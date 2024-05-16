import os
import boto3
from dotenv import load_dotenv
from fastapi import APIRouter

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
    response = s3_client.list_buckets()
    buckets = [bucket["Name"] for bucket in response["Buckets"]]
    return {"buckets": buckets}


@router.get("/instances")
def list_ec2_instances():
    session = get_session()
    ec2_client = session.client("ec2")
    response = ec2_client.describe_instances()
    return {"ec2 instances: ": response}
