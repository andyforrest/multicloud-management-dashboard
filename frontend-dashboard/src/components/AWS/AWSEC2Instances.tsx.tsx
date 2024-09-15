import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface EC2Instance {
  InstanceId: string;
  InstanceType: string;
  State: { Name: string };
  PublicIpAddress?: string;
  PrivateIpAddress: string;
}

const AWSEC2Instances: React.FC = () => {
  const [instances, setInstances] = useState<EC2Instance[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [creatingInstance, setCreatingInstance] = useState<boolean>(false);
  const [selectedInstance, setSelectedInstance] = useState<EC2Instance | null>(null);

  // Fetch EC2 Instances
  const fetchEC2Instances = async () => {
    try {
      const response = await axios.get('http://localhost:8000/aws/instances');
      const reservations = response.data.ec2_instances.Reservations;
      const allInstances = reservations.flatMap((reservation: any) => reservation.Instances);
      setInstances(allInstances);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch EC2 instances');
      setLoading(false);
    }
  };

  // Create a new EC2 instance
  const createEC2Instance = async () => {
    setCreatingInstance(true);
    try {
      await axios.post('http://localhost:8000/aws/instance');
      alert('EC2 Instance created successfully');
      fetchEC2Instances();
    } catch (error) {
      console.error('Error creating EC2 instance:', error);
      alert('Failed to create EC2 instance');
    } finally {
      setCreatingInstance(false);
    }
  };

  // Delete the selected EC2 instance
  const deleteEC2Instance = async () => {
    if (!selectedInstance) return;
    try {
      await axios.delete(`http://localhost:8000/aws/instance/${selectedInstance.InstanceId}`);
      alert(`EC2 Instance ${selectedInstance.InstanceId} deleted successfully`);
      fetchEC2Instances();
      setSelectedInstance(null);
    } catch (error) {
      console.error('Error deleting EC2 instance:', error);
      alert(`Failed to delete EC2 Instance ${selectedInstance.InstanceId}`);
    }
  };

  useEffect(() => {
    fetchEC2Instances();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">AWS EC2 Instances</h1>

      {/* Create EC2 Instance Button */}
      <button
        onClick={createEC2Instance}
        disabled={creatingInstance}
        className={`mb-4 px-4 py-2 text-white ${creatingInstance ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} rounded-md`}
      >
        {creatingInstance ? 'Creating...' : 'Create EC2 Instance'}
      </button>

      {/* Delete EC2 Instance Button */}
      {selectedInstance && (
        <button
          onClick={deleteEC2Instance}
          className="ml-4 mb-4 px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md"
        >
          Delete EC2 Instance {selectedInstance.InstanceId}
        </button>
      )}

      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-2 px-4">Instance ID</th>
            <th className="py-2 px-4">Instance Type</th>
            <th className="py-2 px-4">State</th>
            <th className="py-2 px-4">Public IP</th>
            <th className="py-2 px-4">Private IP</th>
          </tr>
        </thead>
        <tbody>
          {instances.map((instance) => (
            <tr
              key={instance.InstanceId}
              className={`border-b cursor-pointer ${selectedInstance?.InstanceId === instance.InstanceId ? 'bg-gray-100' : ''}`}
              onClick={() => setSelectedInstance(instance)}
            >
              <td className="py-2 px-4">{instance.InstanceId}</td>
              <td className="py-2 px-4">{instance.InstanceType}</td>
              <td className="py-2 px-4">{instance.State.Name}</td>
              <td className="py-2 px-4">{instance.PublicIpAddress || 'N/A'}</td>
              <td className="py-2 px-4">{instance.PrivateIpAddress}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AWSEC2Instances;



