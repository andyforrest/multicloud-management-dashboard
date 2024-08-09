import openstack
from dotenv import load_dotenv
from fastapi import APIRouter

router = APIRouter(prefix="/openstack", tags=["OpenStack"])

load_dotenv()


# conn = openstack.connect(cloud="openstack")
# conn = openstack.connect(cloud="ovh")
conn = openstack.connect(cloud="vexxhost")

# image_name = "ubuntu-2204-kube-v1.27.3"
# flavour_name = "ubuntu-2204-kube-v1.27.3"
# network_name = "openstacksdk-example-project-network"
# keypair_name = "demo-key-pair"


@router.get("/servers")
def list_servers():
    print("List Servers:")
    servers = [server.to_dict() for server in conn.compute.servers()]
    return servers


@router.get("/images")
def list_images():
    print("List Images:")
    images = [image.to_dict() for image in conn.compute.images()]
    return images


@router.get("/flavours")
def list_flavours():
    print("List Flavours:")
    flavors = [flavor.to_dict() for flavor in conn.compute.images()]
    return flavors


@router.get("/networks")
async def list_networks():
    print("List Networks:")
    networks = [network.to_dict() for network in conn.network.networks()]
    return networks


@router.post("/networks")
def create_network():
    print("Create Network:")

    example_network = conn.network.create_network(
        name="openstacksdk-example-project-network"
    )

    print(example_network)

    example_subnet = conn.network.create_subnet(
        name="openstacksdk-example-project-subnet",
        network_id=example_network.id,
        ip_version="4",
        cidr="10.0.2.0/24",
        gateway_ip="10.0.2.1",
    )

    print(example_subnet)
    return {"network name: ": example_network, "subnet name: ": example_subnet}


@router.get("/keypairs")
def list_keypairs():
    keypairs = [keypair.to_dict() for keypair in conn.compute.keypairs()]
    return keypairs


@router.get("/regions")
def list_regions():
    print("List Regions:")

    regions = [region.to_dict() for region in conn.identity.regions()]
    return regions
