import boto3

# Retrieve the list of existing buckets
# s3 = boto3.client('s3', aws_access_key_id=aws_access_key_id, aws_secret_access_key=aws_secret_access_key,
#                                   region_name=region)
s3 = boto3.client('s3')
response = s3.list_buckets()

def get_buckets(response):
    s3_client = boto3.client('s3')
    response = s3_client.list_buckets()
    buckets = [bucket['Name'] for bucket in response['Buckets']]
    print("Buckets:", buckets)
    return buckets
        