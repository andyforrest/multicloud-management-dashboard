import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface OpenStackServer {
  id: string;
  name: string;
  status: string;
  addresses: { [key: string]: Array<{ addr: string }> };
}

const OpenStackServers: React.FC = () => {
  const [servers, setServers] = useState<OpenStackServer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [creatingServer, setCreatingServer] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [selectedServer, setSelectedServer] = useState<OpenStackServer | null>(null);

  // Fetch OpenStack Servers
  const fetchServers = async () => {
    setLoading(true); // Start loading
    try {
      const response = await axios.get('http://localhost:8000/openstack/servers');
      setServers(response.data);
    } catch (error) {
      console.error('Error fetching OpenStack servers:', error);
      setError('Failed to fetch OpenStack servers');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Create a new OpenStack Server
  const createServer = async () => {
    setCreatingServer(true); // Set creating state
    try {
      await axios.post('http://localhost:8000/openstack/server'); // Adjust this API call accordingly
      alert('OpenStack Server created successfully');
      fetchServers(); // Refresh server list after creation
    } catch (error) {
      console.error('Error creating OpenStack server:', error);
      alert('Failed to create OpenStack server');
    } finally {
      setCreatingServer(false); // Stop creating state
    }
  };

  // Delete the selected OpenStack server
  const deleteServer = async () => {
    if (!selectedServer) return;
    setIsDeleting(true); // Start deleting
    try {
      await axios.delete(`http://localhost:8000/openstack/server/${selectedServer.id}`);
      alert(`OpenStack Server ${selectedServer.id} deleted successfully`);
      fetchServers(); // Refresh the server list after deletion
      setSelectedServer(null); // Clear the selection after deletion
    } catch (error) {
      console.error('Error deleting OpenStack server:', error);
      alert(`Failed to delete OpenStack Server ${selectedServer.id}`);
    } finally {
      setIsDeleting(false); // Stop deleting
    }
  };

  useEffect(() => {
    fetchServers();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show loading state
  }

  if (error) {
    return <div>Error: {error}</div>; // Show error state
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">OpenStack Servers</h1>

      {/* Create Server Button */}
      <button
        onClick={createServer}
        disabled={creatingServer || isDeleting} // Disable if creating or deleting
        className={`mb-4 px-4 py-2 text-white ${creatingServer ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} rounded-md`}
      >
        {creatingServer ? 'Creating...' : 'Create OpenStack Server'}
      </button>

      {/* Delete Server Button */}
      {selectedServer && (
        <button
          onClick={deleteServer}
          disabled={isDeleting || creatingServer} // Disable if creating or deleting
          className={`ml-4 mb-4 px-4 py-2 text-white ${isDeleting ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-700'} rounded-md`}
        >
          {isDeleting ? 'Deleting...' : `Delete Server ${selectedServer.name}`}
        </button>
      )}

      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-2 px-4">Server ID</th>
            <th className="py-2 px-4">Server Name</th>
            <th className="py-2 px-4">Status</th>
            <th className="py-2 px-4">IP Address</th>
          </tr>
        </thead>
        <tbody>
          {servers.map((server) => (
            <tr
              key={server.id}
              className={`border-b cursor-pointer ${selectedServer?.id === server.id ? 'bg-gray-100' : ''}`}
              onClick={() => setSelectedServer(server)}
            >
              <td className="py-2 px-4">{server.id}</td>
              <td className="py-2 px-4">{server.name}</td>
              <td className="py-2 px-4">{server.status}</td>
              <td className="py-2 px-4">
                {Object.keys(server.addresses).length > 0
                  ? server.addresses[Object.keys(server.addresses)[0]][0].addr
                  : 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OpenStackServers;
