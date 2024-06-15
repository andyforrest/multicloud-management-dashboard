from azure.identity import ClientSecretCredential
from azure.storage.blob import BlobServiceClient
import os
from fastapi import APIRouter

router = APIRouter(prefix="/azure", tags=["Azure"])

# Create a credential object using ClientSecretCredential
client_id = os.getenv("azure_client_id")
tenant_id = os.getenv("azure_tenant_id")
client_secret = os.getenv("azure_client_secret")

token_credential = ClientSecretCredential(
    tenant_id=tenant_id, client_id=client_id, client_secret=client_secret
)


@router.get("/containers")
def get_containers():
    url = os.getenv("azure_account_url")
    # Create the BlobServiceClient
    blob_service_client = BlobServiceClient(
        account_url=url, credential=token_credential
    )
    containers = blob_service_client.list_containers()
    for container in containers:
        print(container["name"])
        return {"Containers": container["name"]}


# import os
# from azure.identity import ClientSecretCredential
# from azure.mgmt.compute import ComputeManagementClient
# from azure.mgmt.storage import StorageManagementClient

# tenant_id = os.getenv("azure_tenant_id")
# client_id = os.getenv("azure_client_id")
# client_secret = os.getenv("azure_secret_client")
# subscription_id = os.getenv("azure_subscription_id")
# resource_group_name = os.getenv("azure_resource_group_name")

# credential = ClientSecretCredential(tenant_id, client_id, client_secret)

# compute_client = ComputeManagementClient(credential, subscription_id)
# storage_client = StorageManagementClient(credential, subscription_id)

# # Example: List all VMs in the resource group
# vms = compute_client.virtual_machines.list(resource_group_name)
# for vm in vms:
#     print(vm.name)

# # Example: List all blob containers in a storage account
# storage_account_name = "<your-storage-account-name>"
# containers = storage_client.blob_containers.list(resource_group_name, storage_account_name)
# for container in containers:
#     print(container.name)
