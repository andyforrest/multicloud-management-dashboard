import openstack
from dotenv import load_dotenv
from fastapi import APIRouter

router = APIRouter(prefix="/openstack", tags=["OpenStack"])

load_dotenv()


conn = openstack.connect(cloud="openstack")


@router.get("/servers")
def list_servers():
    print("List Servers:")
    for server in conn.compute.servers():
        return {"server: ": server.name}
