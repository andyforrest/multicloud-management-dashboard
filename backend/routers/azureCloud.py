from azure.identity import ClientSecretCredential
from azure.mgmt.compute import ComputeManagementClient
from azure.storage.blob import BlobServiceClient
import os
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/azure", tags=["Azure"])

# Create a credential object using ClientSecretCredential
client_id = os.getenv("azure_client_id")
tenant_id = os.getenv("azure_tenant_id")
client_secret = os.getenv("azure_client_secret")
subscription_id = os.getenv("azure_subscription_id")

token_credential = ClientSecretCredential(
    tenant_id=tenant_id, client_id=client_id, client_secret=client_secret
)


# Get BlobServiceClient
def get_blob_service_client():
    url = os.getenv("azure_account_url")
    return BlobServiceClient(account_url=url, credential=token_credential)


# Helper function to get the Compute Management Client
def get_compute_client():
    return ComputeManagementClient(token_credential, subscription_id)


# Route to list all containers
@router.get("/containers")
def get_containers():
    try:
        blob_service_client = get_blob_service_client()
        containers = blob_service_client.list_containers()

        container_list = [container["name"] for container in containers]
        return {"containers": container_list}

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error retrieving containers: {str(e)}"
        )


# Route to create a container
@router.post("/container/{container_name}")
def create_container(container_name: str):
    try:
        blob_service_client = get_blob_service_client()

        # Create the container
        container_client = blob_service_client.create_container(container_name)

        return {
            "message": f"Container '{container_name}' created successfully",
            "container_name": container_name,
        }

    except Exception as e:
        # Handle specific Azure exceptions like ResourceExistsError if needed
        raise HTTPException(
            status_code=500, detail=f"Error creating container: {str(e)}"
        )


# Route to delete a container
@router.delete("/container/{container_name}")
def delete_container(container_name: str):
    try:
        blob_service_client = get_blob_service_client()

        # Delete container
        container_client = blob_service_client.get_container_client(container_name)
        container_client.delete_container()

        return {"message": f"Container '{container_name}' deleted successfully"}

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error deleting container: {str(e)}"
        )


# Route to list all virtual machines in a specific resource group
@router.get("/vms/{resource_group_name}")
def get_virtual_machines(resource_group_name: str):
    try:
        compute_client = get_compute_client()
        vms = compute_client.virtual_machines.list(resource_group_name)
        vm_list = [{"vm_name": vm.name, "location": vm.location} for vm in vms]

        if not vm_list:
            return {"message": "No VMs found in the specified resource group"}

        return {"vms": vm_list}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving VMs: {str(e)}")


# Route to create a new virtual machine in a specific resource group
@router.post("/vm/{resource_group_name}/{vm_name}")
def create_virtual_machine(resource_group_name: str, vm_name: str):
    try:
        compute_client = get_compute_client()
        print("subscription id" + subscription_id)
        # Define the parameters for VM creation (simple setup, for more customization you'll need to specify other details)
        vm_parameters = {
            "location": "eastus",  # Set to your desired region
            "hardware_profile": {"vm_size": "Standard_DS1_v2"},  # VM size
            "storage_profile": {
                "image_reference": {
                    "publisher": "Canonical",
                    "offer": "UbuntuServer",
                    "sku": "18.04-LTS",
                    "version": "latest",
                }
            },
            "os_profile": {
                "computer_name": vm_name,
                "admin_username": "azureuser",
                "admin_password": "Password1234!",
            },
            "network_profile": {
                "network_interfaces": [
                    {
                        "id": "/subscriptions/{subscription_id}/resourceGroups/{resource_group_name}/providers/Microsoft.Network/networkInterfaces/{nic_name}"
                    }
                ]
            },
        }

        # Create the VM
        async_vm_creation = compute_client.virtual_machines.begin_create_or_update(
            resource_group_name, vm_name, vm_parameters
        )
        vm_result = async_vm_creation.result()

        return {
            "message": f"Virtual machine '{vm_name}' created successfully",
            "vm_details": vm_result.as_dict(),
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating VM: {str(e)}")


# Route to delete a virtual machine
@router.delete("/vm/{resource_group_name}/{vm_name}")
def delete_virtual_machine(resource_group_name: str, vm_name: str):
    try:
        compute_client = get_compute_client()

        # Delete the VM
        async_vm_delete = compute_client.virtual_machines.begin_delete(
            resource_group_name, vm_name
        )
        vm_result = async_vm_delete.result()

        return {
            "message": f"Virtual machine '{vm_name}' deleted successfully",
            "vm_details": vm_result,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting VM: {str(e)}")
