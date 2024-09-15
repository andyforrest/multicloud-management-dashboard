import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface AzureVM {
  vm_name: string;
  location: string;
}

const AzureVM: React.FC = () => {
  const [vms, setVMs] = useState<AzureVM[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [creatingVM, setCreatingVM] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [selectedVM, setSelectedVM] = useState<AzureVM | null>(null);
  const [resourceGroupName, setResourceGroupName] = useState<string>('default-resource-group');
  const [vmName, setVMName] = useState<string>('');

  // Fetch Azure VMs
  const fetchAzureVMs = async () => {
    setLoading(true); // Start loading
    try {
      const response = await axios.get(`http://localhost:8000/azure/vms/multicloud-management-dashboard-resource-group`);
      setVMs(response.data.vms); // Assuming 'setVMs' is the correct state setter for VMs
    } catch (error) {
      console.error('Error fetching Azure VMs:', error.response || error.message);
      setError('Failed to fetch Azure VMs');
    } finally {
      setLoading(false); // Stop loading
    }
  };
  

  // Create a new Azure VM
  const createAzureVM = async () => {
    setCreatingVM(true); // Set creating state
    try {
      await axios.post(`http://localhost:8000/vm/${resourceGroupName}/${vmName}`);
      alert('Azure VM created successfully');
      fetchAzureVMs(); // Refresh VM list after creation
      setVMName(''); // Clear input after creating
    } catch (error) {
      console.error('Error creating Azure VM:', error);
      alert('Failed to create Azure VM');
    } finally {
      setCreatingVM(false); // Stop creating state
    }
  };

  // Delete the selected Azure VM
  const deleteAzureVM = async () => {
    if (!selectedVM) return;
    setIsDeleting(true); // Start deleting
    try {
      await axios.delete(`http://localhost:8000/vm/${resourceGroupName}/${selectedVM.vm_name}`);
      alert(`Azure VM ${selectedVM.vm_name} deleted successfully`);
      fetchAzureVMs(); // Refresh the VM list after deletion
      setSelectedVM(null); // Clear selection after deletion
    } catch (error) {
      console.error('Error deleting Azure VM:', error);
      alert(`Failed to delete Azure VM ${selectedVM.vm_name}`);
    } finally {
      setIsDeleting(false); // Stop deleting
    }
  };

  useEffect(() => {
    fetchAzureVMs();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show loading state
  }

  if (error) {
    return <div>Error: {error}</div>; // Show error state
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Azure Virtual Machines</h1>

      {/* Resource Group Selection */}
      <input
        type="text"
        placeholder="Enter Resource Group Name"
        value={resourceGroupName}
        onChange={(e) => setResourceGroupName(e.target.value)}
        className="border rounded p-2 mr-2 mb-4"
      />

      {/* Delete Azure VM Button */}
      {selectedVM && (
        <button
          onClick={deleteAzureVM}
          disabled={isDeleting || creatingVM} // Disable if creating or deleting
          className={`ml-4 mb-4 px-4 py-2 text-white ${isDeleting ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'} rounded-md`}
        >
          {isDeleting ? 'Deleting...' : `Delete Azure VM ${selectedVM.vm_name}`}
        </button>
      )}

      {/* Display Azure VMs */}
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-2 px-4">VM Name</th>
            <th className="py-2 px-4">Location</th>
          </tr>
        </thead>
        <tbody>
          {vms.map((vm) => (
            <tr
              key={vm.vm_name}
              className={`border-b cursor-pointer ${selectedVM?.vm_name === vm.vm_name ? 'bg-gray-100' : ''}`}
              onClick={() => setSelectedVM(vm)}
            >
              <td className="py-2 px-4">{vm.vm_name}</td>
              <td className="py-2 px-4">{vm.location}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Create Azure VM Button */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter VM Name"
          value={vmName}
          onChange={(e) => setVMName(e.target.value)}
          className="border rounded p-2 mr-2"
        />
        <button
          onClick={createAzureVM}
          disabled={creatingVM || isDeleting} // Disable if creating or deleting
          className={`px-4 py-2 mt-4 text-white ${creatingVM ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} rounded-md`}
        >
          {creatingVM ? 'Creating...' : 'Create Azure VM'}
        </button>
      </div>
    </div>
  );
};

export default AzureVM;
