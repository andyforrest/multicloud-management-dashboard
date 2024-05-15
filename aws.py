import os
import boto3
from dotenv import load_dotenv

load_dotenv()
ACCESS_KEY = os.getenv("aws_access_key_id")
SECRET_KEY = os.getenv("aws_secret_access_key")


def get_session():
    session = boto3.Session(
        aws_access_key_id=ACCESS_KEY, aws_secret_access_key=SECRET_KEY
    )
    return session


def read_buckets():
    session = get_session()
    s3_client = session.client("s3")
    response = s3_client.list_buckets()
    return response
