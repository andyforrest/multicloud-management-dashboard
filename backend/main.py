from typing import Union
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from routers import aws, openstack, azureCloud


app = FastAPI()

# Allow requests from your frontend (React) URL
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}


app.include_router(aws.router)
app.include_router(openstack.router)
app.include_router(azureCloud.router)
