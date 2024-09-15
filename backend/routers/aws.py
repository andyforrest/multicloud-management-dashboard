import os
import boto3
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
from botocore.exceptions import ClientError

router = APIRouter(prefix="/aws", tags=["AWS"])

load_dotenv()
ACCESS_KEY = os.getenv("aws_access_key_id")
SECRET_KEY = os.getenv("aws_secret_access_key")


def get_session():
    session = boto3.Session(
        aws_access_key_id=ACCESS_KEY, aws_secret_access_key=SECRET_KEY
    )
    return session


@router.get("/buckets/")
def list_buckets():
    session = get_session()
    s3_client = session.client("s3")

    try:
        response = s3_client.list_buckets()
        buckets = [bucket["Name"] for bucket in response["Buckets"]]
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error listing buckets: {str(e)}")


@router.get("/bucket/{bucket_name}")
def get_s3_bucket(bucket_name: str):
    session = get_session()
    region = os.getenv("aws_region")
    s3_client = session.client("s3", region_name=region)

    try:
        response = s3_client.list_objects_v2(Bucket=bucket_name)

        if "Contents" not in response:
            return {"message": f"Bucket {bucket_name} is empty or does not exist"}

        objects = [
            {"Key": obj["Key"], "Size": obj["Size"]} for obj in response["Contents"]
        ]
        return {"bucket_name": bucket_name, "objects": objects}

    except s3_client.exceptions.NoSuchBucket:
        raise HTTPException(
            status_code=404, detail=f"Bucket {bucket_name} does not exist"
        )

    except Exception as e:
        raise HTTPException(
            status_code=400, detail=f"Error retrieving bucket: {str(e)}"
        )


@router.post("/bucket/{bucket_name}")
def create_s3_bucket(bucket_name: str):
    session = get_session()
    region = os.getenv("aws_region")
    s3_client = session.client("s3", region_name=region)

    try:
        if region == "us-east-1":
            response = s3_client.create_bucket(Bucket=bucket_name)
        else:
            response = s3_client.create_bucket(
                Bucket=bucket_name,
                CreateBucketConfiguration={"LocationConstraint": region},
            )
        return {
            "message": f"Bucket {bucket_name} created successfully",
            "response": response,
        }

    except s3_client.exceptions.BucketAlreadyExists:
        raise HTTPException(
            status_code=400,
            detail=f"Bucket name '{bucket_name}' already exists. Please choose a unique name.",
        )

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error creating bucket: {str(e)}")


@router.delete("/bucket/{bucket_name}")
def delete_s3_bucket(bucket_name: str):
    session = get_session()
    region = os.getenv("aws_region")
    s3_client = session.client("s3", region_name=region)

    try:
        response = s3_client.delete_bucket(Bucket=bucket_name)
        return {
            "message": f"Bucket {bucket_name} deleted successfully",
            "response": response,
        }

    except s3_client.exceptions.NoSuchBucket:
        raise HTTPException(
            status_code=404, detail=f"Bucket {bucket_name} does not exist"
        )

    except s3_client.exceptions.BucketNotEmpty:
        raise HTTPException(
            status_code=400, detail=f"Bucket {bucket_name} is not empty"
        )

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error deleting bucket: {str(e)}")


@router.get("/instances")
def list_ec2_instances():
    session = get_session()
    region = os.getenv("aws_region")
    ec2_client = session.client("ec2", region_name=region)

    try:
        response = ec2_client.describe_instances()
        return {"ec2_instances": response}

    except Exception as e:
        raise HTTPException(
            status_code=400, detail=f"Error listing EC2 instances: {str(e)}"
        )


@router.get("/instance-type")
def list_ect_instance_types():
    session = get_session()
    region = os.getenv("aws_region")
    ec2_client = session.client("ec2", region_name=region)
    response = ec2_client.describe_instance_types()
    return response


@router.post("/instance")
def create_ec2_instance():
    session = get_session()
    region = os.getenv("aws_region")
    ec2_resource = session.resource("ec2", region_name=region)

    try:
        instances = ec2_resource.create_instances(
            ImageId="ami-0b31d93fb777b6ae6",
            MinCount=1,
            MaxCount=1,
            InstanceType="t2.micro",
        )
        instance_ids = [instance.id for instance in instances]
        return {"instance_ids": instance_ids}

    except Exception as e:
        raise HTTPException(
            status_code=400, detail=f"Error creating EC2 instance: {str(e)}"
        )


@router.delete("/instance/{instance_id}")
def delete_ec2_instance(instance_id: str):
    session = get_session()
    region = os.getenv("aws_region")
    ec2_resource = session.resource("ec2", region_name=region)

    try:
        instance = ec2_resource.Instance(instance_id)
        response = instance.terminate()
        return {
            "message": f"Instance {instance_id} terminated successfully",
            "response": response,
        }

    except Exception as e:
        raise HTTPException(
            status_code=400, detail=f"Error terminating instance: {str(e)}"
        )


@router.get("/instance/{instance_id}")
def get_ec2_instance(instance_id: str):
    session = get_session()
    region = os.getenv("aws_region")
    ec2_client = session.client("ec2", region_name=region)

    try:
        response = ec2_client.describe_instances(InstanceIds=[instance_id])
        reservations = response.get("Reservations", [])

        if not reservations:
            raise HTTPException(
                status_code=404, detail=f"Instance {instance_id} not found"
            )

        instance_info = reservations[0]["Instances"][0]
        return {"instance_info": instance_info}

    except ec2_client.exceptions.ClientError as e:
        if "InvalidInstanceID.NotFound" in str(e):
            raise HTTPException(
                status_code=404, detail=f"Instance {instance_id} not found"
            )
        else:
            raise HTTPException(
                status_code=400, detail=f"Error retrieving instance: {str(e)}"
            )


@router.post("/volume")
def create_volume(
    availability_zone: str = "eu-west-2a", size: int = 1, volume_type: str = "gp2"
):
    session = get_session()
    region = os.getenv("aws_region")
    ec2_client = session.client("ec2", region_name=region)

    try:
        response = ec2_client.create_volume(
            AvailabilityZone=availability_zone,
            Size=size,
            VolumeType=volume_type,
        )
        return {
            "message": "Volume created successfully",
            "volume_id": response["VolumeId"],
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error creating volume: {str(e)}")


@router.get("/volumes")
def get_all_volumes():
    session = get_session()
    region = os.getenv("aws_region")

    # Use EC2 client
    ec2_client = session.client("ec2", region_name=region)

    try:
        # Get details for all volumes
        response = ec2_client.describe_volumes()

        volumes = response.get("Volumes", [])

        if not volumes:
            return {"message": "No volumes found"}

        # Return information about all volumes
        volume_list = [
            {
                "VolumeId": volume["VolumeId"],
                "Size": volume["Size"],
                "State": volume["State"],
                "AvailabilityZone": volume["AvailabilityZone"],
                "VolumeType": volume["VolumeType"],
                "CreateTime": volume["CreateTime"],
            }
            for volume in volumes
        ]

        return {"volumes": volume_list}

    except Exception as e:
        raise HTTPException(
            status_code=400, detail=f"Error retrieving volumes: {str(e)}"
        )


@router.get("/volume/{volume_id}")
def get_volume(volume_id: str):
    session = get_session()
    region = os.getenv("aws_region")

    # Use EC2 client
    ec2_client = session.client("ec2", region_name=region)

    try:
        # Get volume information
        response = ec2_client.describe_volumes(VolumeIds=[volume_id])

        volumes = response.get("Volumes", [])
        if not volumes:
            raise HTTPException(status_code=404, detail=f"Volume {volume_id} not found")

        volume_info = volumes[0]

        return {"volume_info": volume_info}

    except ec2_client.exceptions.ClientError as e:
        if "InvalidVolume.NotFound" in str(e):
            raise HTTPException(
                status_code=404, detail=f"Volume {volume_id} does not exist"
            )
        else:
            raise HTTPException(
                status_code=400, detail=f"Error retrieving volume: {str(e)}"
            )


@router.delete("/volume/{volume_id}")
def delete_volume(volume_id: str):
    session = get_session()
    region = os.getenv("aws_region")

    # Use EC2 client
    ec2_client = session.client("ec2", region_name=region)

    try:
        # Delete the EBS volume
        response = ec2_client.delete_volume(VolumeId=volume_id)

        return {
            "message": f"Volume {volume_id} deleted successfully",
            "response": response,
        }

    except ClientError as e:
        # Check the error code to determine the reason for failure
        error_code = e.response["Error"]["Code"]

        if error_code == "VolumeInUse":
            raise HTTPException(
                status_code=400, detail=f"Volume {volume_id} is currently in use"
            )
        elif error_code == "InvalidVolume.NotFound":
            raise HTTPException(
                status_code=404, detail=f"Volume {volume_id} does not exist"
            )
        else:
            raise HTTPException(
                status_code=400, detail=f"Error deleting volume: {str(e)}"
            )
