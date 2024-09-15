import { useState, useEffect } from 'react';
import axios from 'axios';

const S3Buckets = () => {
  const [buckets, setBuckets] = useState<any[]>([]); // Initialize as an empty array
  const [selectedBucket, setSelectedBucket] = useState<string | null>(null);
  const [bucketName, setBucketName] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // For error messages
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state for bucket creation
  const [isDeleting, setIsDeleting] = useState<boolean>(false); // Loading state for bucket deletion

  // Fetch all S3 buckets
  const fetchBuckets = async () => {
    try {
      const response = await axios.get('http://localhost:8000/aws/buckets');
      console.log('S3 Buckets API Response:', response.data); // Log the response to inspect it
      setBuckets(response.data.response.Buckets); // Update to match the nested structure
    } catch (error) {
      console.error('Error fetching S3 buckets:', error);
    }
  };

  // Create a new S3 bucket
  const createBucket = async () => {
    try {
      setErrorMessage(''); // Clear any previous error
      setIsLoading(true); // Set loading state
      const response = await axios.post(`http://localhost:8000/aws/bucket/${bucketName}`);
      alert('Bucket created successfully');
      console.log('S3 Bucket Created:', response.data);
      setBucketName(''); // Clear input after successful creation
      fetchBuckets(); // Refresh the bucket list after creation
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.detail) {
        setErrorMessage(error.response.data.detail); // Set the error message returned from the backend
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
      console.error('Error creating S3 bucket:', error);
    } finally {
      setIsLoading(false); // Stop loading state
    }
  };

  // Delete an S3 bucket
  const deleteBucket = async (bucketName: string) => {
    try {
      setIsDeleting(true); // Set deleting state
      await axios.delete(`http://localhost:8000/aws/bucket/${bucketName}`);
      alert('Bucket deleted successfully');
      fetchBuckets(); // Refresh buckets after deletion
      setSelectedBucket(null); // Reset selected bucket
    } catch (error) {
      console.error('Error deleting S3 bucket:', error);
    } finally {
      setIsDeleting(false); // Stop deleting state
    }
  };

  useEffect(() => {
    fetchBuckets();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">AWS S3 Buckets</h1>

       {/* Delete button for selected bucket */}
       {selectedBucket && (
        <div className="mt-6">
          <p>
            Selected Bucket: <strong>{selectedBucket}</strong>
          </p>
          <button
            onClick={() => deleteBucket(selectedBucket)}
            className={`bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 mt-4 mb-4 ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isDeleting || isLoading} // Disable if creating/deleting
          >
            {isDeleting ? 'Deleting...' : 'Delete Bucket'}
          </button>
        </div>
      )}

      {/* Table for displaying S3 buckets */}
      {Array.isArray(buckets) && buckets.length > 0 ? (
        <table className="min-w-full bg-white shadow-md rounded mb-6">
          <thead>
            <tr>
              <th className="py-2 px-4 bg-gray-200 text-left">Bucket Name</th>
            </tr>
          </thead>
          <tbody>
            {buckets.map((bucket: { Name: string }) => (
              <tr
                key={bucket.Name}
                onClick={() => setSelectedBucket(bucket.Name)}
                className={`cursor-pointer ${selectedBucket === bucket.Name ? 'bg-blue-100' : ''}`}
              >
                <td className="py-2 px-4">{bucket.Name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No S3 buckets available.</p>
      )}

      {/* Create new S3 bucket */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Enter new bucket name"
          value={bucketName}
          onChange={(e) => setBucketName(e.target.value)}
          className="border rounded p-2 mr-2"
          disabled={isLoading || isDeleting} // Disable input if creating/deleting
        />
        <button
          onClick={createBucket}
          className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isLoading || isDeleting} // Disable button if creating/deleting
        >
          {isLoading ? 'Creating...' : 'Create Bucket'}
        </button>
      </div>

      {/* Error message for bucket creation */}
      {errorMessage && (
        <div className="text-red-500 mb-4">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default S3Buckets;

