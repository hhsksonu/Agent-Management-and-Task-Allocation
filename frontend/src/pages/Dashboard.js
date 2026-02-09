import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddAgent from '../components/AddAgent';
import UploadCSV from '../components/UploadCSV';
import TaskList from '../components/TaskList';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('add-agent');
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="dashboard">
      <div className="navbar">
        <h2>Agent Task Distribution System</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <div className="dashboard-content">
        <h3>Admin Dashboard</h3>
        
        <div className="nav-buttons">
          <button 
            className="nav-btn" 
            onClick={() => setActiveTab('add-agent')}
            style={{ backgroundColor: activeTab === 'add-agent' ? '#5568d3' : '#667eea' }}
          >
            Add Agent
          </button>
          <button 
            className="nav-btn" 
            onClick={() => setActiveTab('upload-csv')}
            style={{ backgroundColor: activeTab === 'upload-csv' ? '#5568d3' : '#667eea' }}
          >
            Upload CSV
          </button>
          <button 
            className="nav-btn" 
            onClick={() => setActiveTab('view-tasks')}
            style={{ backgroundColor: activeTab === 'view-tasks' ? '#5568d3' : '#667eea' }}
          >
            View Tasks
          </button>
        </div>

        {/* Show component based on active tab */}
        {activeTab === 'add-agent' && <AddAgent />}
        {activeTab === 'upload-csv' && <UploadCSV />}
        {activeTab === 'view-tasks' && <TaskList />}
      </div>
    </div>
  );
}

export default Dashboard;
