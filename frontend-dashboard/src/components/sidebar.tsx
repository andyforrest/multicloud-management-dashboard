import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon, ServerIcon, ArchiveBoxIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const Sidebar = () => {
  const [activeProvider, setActiveProvider] = useState<string | null>('aws');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleProviderChange = (provider: string) => {
    setActiveProvider(provider);
    setDropdownOpen(false);
  };

  return (
    <aside className="w-64 bg-blue-700 text-white">
      <div className="p-6 text-lg font-semibold">
        Cloud Dashboard
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="mt-4 bg-blue-800 px-2 py-1 rounded-md flex items-center"
        >
          {activeProvider.toUpperCase()}
          <ChevronDownIcon className="h-5 w-5 ml-1" />
        </button>
        {dropdownOpen && (
          <div className="absolute bg-blue-800 p-2 mt-2 rounded-md shadow-lg">
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => handleProviderChange('aws')}
                  className="block px-4 py-2 hover:bg-blue-600 w-full text-left"
                >
                  AWS
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleProviderChange('azure')}
                  className="block px-4 py-2 hover:bg-blue-600 w-full text-left"
                >
                  Azure
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleProviderChange('openstack')}
                  className="block px-4 py-2 hover:bg-blue-600 w-full text-left"
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
              <Link to="/aws-ec2" className="flex items-center p-2 text-sm hover:bg-blue-600 rounded-md">
                <HomeIcon className="h-5 w-5 mr-2" />
                AWS EC2 Instances
              </Link>
            </li>
            {/* Add more AWS-specific links here */}
          </>
        )}
        {activeProvider === 'azure' && (
          <>
            <li>
              <Link to="/azure-containers" className="flex items-center p-2 text-sm hover:bg-blue-600 rounded-md">
                <ServerIcon className="h-5 w-5 mr-2" />
                Azure Containers
              </Link>
            </li>
            {/* Add more Azure-specific links here */}
          </>
        )}
        {activeProvider === 'openstack' && (
          <>
            <li>
              <Link to="/openstack-volumes" className="flex items-center p-2 text-sm hover:bg-blue-600 rounded-md">
                <ArchiveBoxIcon className="h-5 w-5 mr-2" />
                OpenStack Volumes
              </Link>
            </li>
            {/* Add more OpenStack-specific links here */}
          </>
        )}
      </ul>
    </aside>
  );
};

export default Sidebar;


