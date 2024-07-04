import openstack
from dotenv import load_dotenv
from fastapi import APIRouter

router = APIRouter(prefix="/openstack", tags=["OpenStack"])

load_dotenv()


# conn = openstack.connect(cloud="openstack")
conn = openstack.connect(cloud="ovh")
# conn = openstack.connect(cloud="vexxhost")


@router.get("/servers")
def list_servers():
    print("List Servers:")
    servers = [server.to_dict() for server in conn.compute.servers()]
    return servers


@router.post("/servers")
def create_server():
    print("Create Server:")

    image = conn.image.find_image("Ubuntu 20.04 - UEFI")
    flavor = conn.compute.find_flavor("d2-2")
    network = conn.network.find_network("demo-network")
    keypair = conn.compute.find_keypair("demo-key-pair")

    print(image)
    print(flavor)
    print(network)
    print(keypair)

    server = conn.compute.create_server(
        name="new-server",
        image_id=image.id,
        flavor_id=flavor[0].id,
        networks=[{"uuid": network.id}],
        key_name=keypair.name,
    )

    server = conn.compute.wait_for_server(server)

    return{"server: ": server}


@router.get("/images")
def list_images():
    print("List Images:")
    images = [image.name for image in conn.compute.images()]
    return images


@router.get("/flavours")
def list_flavours():
    print("List Flavours:")
    flavors = [flavor for flavor in conn.compute.images()]
    return flavors


@router.get("/networks", response_model=list[str])
async def list_networks():
    print("List Networks:")
    networks = [network.name for network in conn.network.networks()]
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


@router.get("/keypairs", response_model=list[str])
def list_keypairs():
    print("List Networks:")
    keypairs = [keypair.name for keypair in conn.compute.keypairs()]
    return keypairs


@router.get("/regions", response_model=list[str])
def list_regions():
    print("List Regions:")

    regions = [region.id for region in conn.identity.regions()]
    return regions
