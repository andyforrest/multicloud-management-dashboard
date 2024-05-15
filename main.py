import os
from typing import Union
from dotenv import load_dotenv
from fastapi import FastAPI
from aws import get_buckets
import boto3

load_dotenv()
ACCESS_KEY = os.getenv("aws_access_key_id")
SECRET_KEY = os.getenv("aws_secret_access_key")

print(ACCESS_KEY)
print(SECRET_KEY)
app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}

@app.get("/buckets/")
def read_buckets():
    s3 = boto3.client(
        's3',
        aws_access_key_id=ACCESS_KEY,
        aws_secret_access_key=SECRET_KEY)
    response = s3.list_buckets()
    buckets = get_buckets(response)
    return {"buckets": buckets}

