import openstack
from dotenv import load_dotenv
from fastapi import APIRouter

router = APIRouter(prefix="/openstack", tags=["OpenStack"])

load_dotenv()


# conn = openstack.connect(cloud="openstack")
# conn = openstack.connect(cloud="ovh")
conn = openstack.connect(cloud="vexxhost")


@router.get("/servers")
def list_servers():
    print("List Servers:")
    for server in conn.compute.servers():
        return {"server: ": server.name}


@router.get("/images")
def list_images():
    print("List Images:")
    for image in conn.compute.images():
        return {"image: ": image.name}


@router.get("/flavours")
def list_flavours():
    print("List Flavours:")
    for flavour in conn.compute.images():
        return {"flavour: ": flavour.name}


@router.get("/networks")
def list_networks():
    print("List Networks:")
    for network in conn.network.networks():
        return {"network: ": network.name}


@router.get("/keypair")
def list_keypairs():
    print("List Networks:")
    for keypair in conn.compute.keypairs():
        return {"keypair: ": keypair.name}
