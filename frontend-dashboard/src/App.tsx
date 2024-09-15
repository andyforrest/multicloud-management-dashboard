import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/sidebar';
import AWSEC2Instances from './components/AWS/AWSEC2Instances.tsx'; // Make sure these components are correct
import S3Buckets from './components/AWS/S3Buckets.tsx';
import AWSVolumes from './components/AWS/AWSVolume.tsx'
import AzureContainers from './components/Azure/AzureContainers.tsx';
// import AzureContainers from './AzureContainers';
// import OpenStackVolumes from './OpenStackVolumes';

const App = () => {
  return (
    <Router>
      <div className="flex">
        <Sidebar /> {/* Sidebar should always render */}
        <main className="flex-1 bg-gray-100 p-6">
          <div className="container mx-auto">
            <Routes>
              <Route path="/aws-ec2" element={<AWSEC2Instances />} />
              <Route path="/aws-s3" element={<S3Buckets />} />
              <Route path="/aws-volumes" element={<AWSVolumes />} />
              <Route path="/azure-containers" element={<AzureContainers />} />
               {/* <Route path="/azure-containers" element={<AzureContainers />} />
              <Route path="/openstack-volumes" element={<OpenStackVolumes />} /> */}
              {/* <Route path="/azure-containers" element={<AzureContainers />} />
              <Route path="/openstack-volumes" element={<OpenStackVolumes />} /> */}
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
};

export default App;

