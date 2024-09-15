import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AzureContainers = () => {
  const [containers, setContainers] = useState<string[]>([]);
  const [selectedContainer, setSelectedContainer] = useState<string | null>(null);
  const [containerName, setContainerName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Fetch all containers
  const fetchContainers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/azure/containers');
      setContainers(response.data.containers);
    } catch (error) {
      setErrorMessage('Error fetching containers');
      console.error('Error fetching containers:', error);
    } finally {
      setIsLoading(false);
    }
  };

const createContainer = async () => {
    try {
      setErrorMessage(''); // Clear any previous error
      setIsLoading(true); // Set loading state
      const response = await axios.post(`http://localhost:8000/azure/container/${containerName}`);
      alert('Container created successfully');
      console.log('Container Created:', response.data);
      setContainerName(''); // Clear input after successful creation
      fetchContainers(); // Refresh the bucket list after creation
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.detail) {
        setErrorMessage(error.response.data.detail); // Set the error message returned from the backend
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
      console.error('Error creating Container:', error);
    } finally {
      setIsLoading(false); // Stop loading state
    }
  };

  // Delete a container
  const deleteContainer = async (containerName: string) => {
    setIsDeleting(true);
    try {
        console.log(containerName)
      await axios.delete(`http://localhost:8000/azure/container/${containerName}`);
      fetchContainers(); // Refresh the container list
      setSelectedContainer(null); // Reset selected container
    } catch (error) {
      setErrorMessage('Error deleting container');
      console.error('Error deleting container:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Fetch containers on component mount
  useEffect(() => {
    fetchContainers();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Azure Blob Storage Containers</h1>

       {/* Delete button for selected container */}
       {selectedContainer && (
        <div className="mt-6">
          <p>
            Selected Container: <strong>{selectedContainer}</strong>
          </p>
          <button
            onClick={() => deleteContainer(selectedContainer)}
            disabled={isDeleting}
            className={`bg-red-600 text-white px-4 py-2 mb-4 rounded ${
              isDeleting ? 'bg-gray-400' : 'hover:bg-red-700'
            } mt-4`}
          >
            {isDeleting ? 'Deleting...' : 'Delete Container'}
          </button>
        </div>
      )}

      {/* Display containers in a table */}
      {isLoading ? (
        <p>Loading containers...</p>
      ) : containers.length > 0 ? (
        <table className="min-w-full bg-white shadow-md rounded mb-6">
          <thead>
            <tr>
              <th className="py-2 px-4 bg-gray-200 text-left">Container Name</th>
            </tr>
          </thead>
          <tbody>
            {containers.map((container) => (
              <tr
                key={container}
                onClick={() => setSelectedContainer(container)}
                className={`cursor-pointer ${
                  selectedContainer === container ? 'bg-blue-100' : ''
                }`}
              >
                <td className="py-2 px-4">{container}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No containers available.</p>
      )}

      {/* Create new container */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Enter new bucket name"
          value={containerName}
          onChange={(e) => setContainerName(e.target.value)}
          className="border rounded p-2 mr-2"
          disabled={isLoading || isDeleting} // Disable input if creating/deleting
        />
        <button
          onClick={createContainer}
          className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isLoading || isDeleting} // Disable button if creating/deleting
        >
          {isLoading ? 'Creating...' : 'Create Bucket'}
        </button>
      </div>


      {/* Error message */}
      {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}

    </div>
  );
};

export default AzureContainers;
