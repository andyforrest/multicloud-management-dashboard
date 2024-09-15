import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon, ServerIcon, ArchiveBoxIcon, CloudIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const Sidebar = () => {
  const [activeProvider, setActiveProvider] = useState<string | null>('aws');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleProviderChange = (provider: string) => {
    setActiveProvider(provider);
    setDropdownOpen(false);
  };

  return (
    <aside className="w-64 bg-blue-800 text-gray-100">
      <div className="p-6 text-lg font-semibold">
        Cloud Dashboard
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="ml-2 bg-blue-900 px-2 py-1 rounded-md flex items-center"
        >
          {activeProvider.toUpperCase()}
          <ChevronDownIcon className="h-5 w-5 ml-1" />
        </button>
        {dropdownOpen && (
          <div className="absolute bg-blue-900 p-2 mt-2 rounded-md shadow-lg">
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => handleProviderChange('aws')}
                  className="block px-4 py-2 hover:bg-blue-700 w-full text-left"
                >
                  AWS
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleProviderChange('azure')}
                  className="block px-4 py-2 hover:bg-blue-700 w-full text-left"
                >
                  Azure
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleProviderChange('openstack')}
                  className="block px-4 py-2 hover:bg-blue-700 w-full text-left"
                >
                  OpenStack
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
      <ul className="space-y-2 px-2">
        {activeProvider === 'aws' && (
          <>
            <li>
              <Link to="/aws-ec2" className="flex items-center p-2 text-sm hover:bg-blue-700 rounded-md">
                <HomeIcon className="h-5 w-5 mr-2" />
                AWS EC2 Instances
              </Link>
            </li>
            <li>
              <Link to="/aws-s3" className="flex items-center p-2 text-sm hover:bg-blue-700 rounded-md">
                <CloudIcon className="h-5 w-5 mr-2" />
                AWS S3 Buckets
              </Link>
            </li>
            <li>
              <Link to="/aws-volumes" className="flex items-center p-2 text-sm hover:bg-blue-700 rounded-md">
                <CloudIcon className="h-5 w-5 mr-2" />
                AWS Volumes
              </Link>
            </li>
            
          </>
        )}
        {activeProvider === 'azure' && (
          <>
            <li>
              <Link to="/azure-containers" className="flex items-center p-2 text-sm hover:bg-blue-700 rounded-md">
                <ServerIcon className="h-5 w-5 mr-2" />
                Azure Containers
              </Link>
            </li>
            <li>
              <Link to="/azure-vm" className="flex items-center p-2 text-sm hover:bg-blue-700 rounded-md">
                <ServerIcon className="h-5 w-5 mr-2" />
                Azure VMs
              </Link>
            </li>
          </>
        )}
        {activeProvider === 'openstack' && (
          <>
            <li>
              <Link to="/openstack-volumes" className="flex items-center p-2 text-sm hover:bg-blue-700 rounded-md">
                <ArchiveBoxIcon className="h-5 w-5 mr-2" />
                OpenStack Volumes
              </Link>
            </li>
          </>
        )}
      </ul>
    </aside>
  );
};

export default Sidebar;



