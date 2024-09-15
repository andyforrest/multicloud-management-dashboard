import { useState, useEffect } from 'react';
import axios from 'axios';

const AWSVolumes = () => {
  const [volumes, setVolumes] = useState<any[]>([]);
  const [selectedVolume, setSelectedVolume] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Fetch all volumes
  const fetchVolumes = async () => {
    try {
      const response = await axios.get('http://localhost:8000/aws/volumes');
      console.log('Volumes API Response:', response.data);
      setVolumes(response.data.volumes);
    } catch (error) {
      console.error('Error fetching volumes:', error);
    }
  };

  // Create a new volume with default parameters
  const createVolume = async () => {
    try {
      setIsLoading(true); // Show loading state
      const response = await axios.post('http://localhost:8000/aws/volume');
      alert('Volume created successfully');
      console.log('Volume Created:', response.data);
      setIsLoading(false);
      fetchVolumes(); // Refresh the volume list after creation
    } catch (error) {
      console.error('Error creating volume:', error);
      setIsLoading(false);
    }
  };

  // Delete a volume
  const deleteVolume = async (volumeId: string) => {
    try {
      setIsDeleting(true); // Show loading state
      await axios.delete(`http://localhost:8000/aws/volume/${volumeId}`);
      alert('Volume deleted successfully');
      console.log(`Volume ${volumeId} deleted`);
      setSelectedVolume(null); // Reset the selected volume
      setIsDeleting(false);
      fetchVolumes(); // Refresh the volume list after deletion
    } catch (error) {
      console.error(`Error deleting volume ${volumeId}:`, error);
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchVolumes();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">AWS EBS Volumes</h1>

      {/* Delete button for selected volume */}
      {selectedVolume && (
        <div className="mt-6">
          <p>
            Selected Volume: <strong>{selectedVolume}</strong>
          </p>
          <button
            onClick={() => deleteVolume(selectedVolume)}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 mt-4 mb-4"
            disabled={isLoading}
          >
            {isDeleting ? 'Deleting...' : 'Delete Volume'}
          </button>
        </div>
      )}

      {/* Table for displaying volumes */}
      {Array.isArray(volumes) && volumes.length > 0 ? (
        <table className="min-w-full bg-white shadow-md rounded mb-6">
          <thead>
            <tr>
              <th className="py-2 px-4 bg-gray-200 text-left">Volume ID</th>
              <th className="py-2 px-4 bg-gray-200 text-left">Size (GiB)</th>
              <th className="py-2 px-4 bg-gray-200 text-left">State</th>
              <th className="py-2 px-4 bg-gray-200 text-left">Availability Zone</th>
              <th className="py-2 px-4 bg-gray-200 text-left">Type</th>
              <th className="py-2 px-4 bg-gray-200 text-left">Created At</th>
            </tr>
          </thead>
          <tbody>
            {volumes.map((volume: any) => (
              <tr
                key={volume.VolumeId}
                onClick={() => setSelectedVolume(volume.VolumeId)}
                className={`cursor-pointer ${selectedVolume === volume.VolumeId ? 'bg-blue-100' : ''}`}
              >
                <td className="py-2 px-4">{volume.VolumeId}</td>
                <td className="py-2 px-4">{volume.Size}</td>
                <td className="py-2 px-4">{volume.State}</td>
                <td className="py-2 px-4">{volume.AvailabilityZone}</td>
                <td className="py-2 px-4">{volume.VolumeType}</td>
                <td className="py-2 px-4">{new Date(volume.CreateTime).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No volumes available.</p>
      )}

      {/* Create new volume button */}
      <div className="mb-6">
        <button
          onClick={createVolume}
          className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Creating...' : 'Create Volume'}
        </button>
      </div>

      
    </div>
  );
};

export default AWSVolumes;


