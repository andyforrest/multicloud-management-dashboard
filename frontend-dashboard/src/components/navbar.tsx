import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';

// Define your pages/components for AWS, Azure, and OpenStack
const AWS = () => <div className="p-4">Welcome to the AWS Page</div>;
const Azure = () => <div className="p-4">Welcome to the Azure Page</div>;
const OpenStack = () => <div className="p-4">Welcome to the OpenStack Page</div>;

const Navbar = () => {
  return (
    <nav className="bg-blue-600 p-4">
      <ul className="flex space-x-4">
        <li>
          <Link
            to="/aws"
            className="text-white hover:bg-blue-500 px-3 py-2 rounded-md text-sm font-medium"
          >
            AWS
          </Link>
        </li>
        <li>
          <Link
            to="/azure"
            className="text-white hover:bg-blue-500 px-3 py-2 rounded-md text-sm font-medium"
          >
            Azure
          </Link>
        </li>
        <li>
          <Link
            to="/openstack"
            className="text-white hover:bg-blue-500 px-3 py-2 rounded-md text-sm font-medium"
          >
            OpenStack
          </Link>
        </li>
      </ul>
    </nav>
  );
};

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="container mx-auto mt-4">
        <Routes>
          <Route path="/aws" element={<AWS />} />
          <Route path="/azure" element={<Azure />} />
          <Route path="/openstack" element={<OpenStack />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
