import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AWSS3Storage = () => {
  const [buckets, setBuckets] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the list of S3 buckets when the component is mounted
  useEffect(() => {
    const fetchBuckets = async () => {
      try {
        const response = await axios.get('http://localhost:8000/aws/buckets/'); // Replace with your FastAPI URL
        setBuckets(response.data.buckets);
        setLoading(false);
      } catch (err) {
        setError('Error fetching buckets');
        setLoading(false);
      }
    };

    fetchBuckets();
  }, []);

  if (loading) {
    return <div className="p-4">Loading S3 buckets...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">AWS S3 Buckets</h1>
      {buckets.length > 0 ? (
        <ul className="list-disc pl-5">
          {buckets.map((bucket, index) => (
            <li key={index} className="mb-2">
              {bucket}
            </li>
          ))}
        </ul>
      ) : (
        <div>No buckets found.</div>
      )}
    </div>
  );
};

export default AWSS3Storage;

