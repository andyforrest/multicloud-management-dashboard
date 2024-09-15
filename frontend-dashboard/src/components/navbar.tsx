import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import { Menu } from '@headlessui/react';
import { HomeIcon, ServerIcon, ArchiveBoxIcon, CloudIcon } from '@heroicons/react/24/outline';

// Define your pages/components for AWS EC2 Instances, Azure Containers, and OpenStack Volumes
const AWSEC2Instances = () => <div className="p-4">Welcome to the AWS EC2 Instances Page</div>;
const AWSS3Storage = () => <div className="p-4">Welcome to the AWS S3 Storage Page</div>;
const AzureContainers = () => <div className="p-4">Welcome to the Azure Containers Page</div>;
const OpenStackVolumes = () => <div className="p-4">Welcome to the OpenStack Volumes Page</div>;

const Sidebar = () => {
  // State to track the selected cloud provider
  const [selectedProvider, setSelectedProvider] = useState<string>('aws');

  // Define the links based on the selected provider
  let links = [];

  if (selectedProvider === 'aws') {
    links = [
      { name: 'EC2 Instances', to: '/aws-ec2', icon: <HomeIcon className="h-5 w-5 mr-2" /> },
      { name: 'S3 Storage', to: '/aws-s3', icon: <CloudIcon className="h-5 w-5 mr-2" /> },
    ];
  } else if (selectedProvider === 'azure') {
    links = [
      { name: 'Containers', to: '/azure-containers', icon: <ServerIcon className="h-5 w-5 mr-2" /> },
    ];
  } else if (selectedProvider === 'openstack') {
    links = [
      { name: 'Volumes', to: '/openstack-volumes', icon: <ArchiveBoxIcon className="h-5 w-5 mr-2" /> },
    ];
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-700 text-white">
        <div className="p-6 text-lg font-semibold">
          Cloud Dashboard
        </div>

        {/* Cloud Provider Selection */}
        <div className="p-4">
          <select
            className="w-full bg-blue-500 text-white py-2 px-3 rounded-md"
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value)}
          >
            <option value="aws">AWS</option>
            <option value="azure">Azure</option>
            <option value="openstack">OpenStack</option>
          </select>
        </div>

        {/* Navigation Links */}
        <ul className="space-y-2 px-2">
          {links.map((link, index) => (
            <li key={index}>
              <Menu>
                <Link to={link.to} className="flex items-center p-2 text-sm hover:bg-blue-600 rounded-md">
                  {link.icon}
                  {link.name}
                </Link>
              </Menu>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-6">
        <div className="container mx-auto">
          <Routes>
            {/* AWS Routes */}
            <Route path="/aws-ec2" element={<AWSEC2Instances />} />
            <Route path="/aws-s3" element={<AWSS3Storage />} />
            
            {/* Azure Routes */}
            <Route path="/azure-containers" element={<AzureContainers />} />
            
            {/* OpenStack Routes */}
            <Route path="/openstack-volumes" element={<OpenStackVolumes />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Sidebar />
    </Router>
  );
};

export default App;

