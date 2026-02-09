import React, { useState, useEffect } from 'react';
import { getTasksByAgent } from '../services/api';

function TaskList() {
  const [taskData, setTaskData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch tasks when component loads
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await getTasksByAgent();
      setTaskData(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load tasks');
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="task-list-container">Loading tasks...</div>;
  }

  if (error) {
    return <div className="task-list-container"><p className="error">{error}</p></div>;
  }

  if (taskData.length === 0) {
    return (
      <div className="task-list-container">
        <h3>Task Distribution</h3>
        <p className="no-data">No tasks found. Please upload a CSV file first.</p>
      </div>
    );
  }

  return (
    <div className="task-list-container">
      <h3>Task Distribution by Agent</h3>
      
      {taskData.map((item, index) => (
        <div key={index} className="agent-section">
          <h4>Agent: {item.agent.name}</h4>
          <div className="agent-info">
            <p>Email: {item.agent.email}</p>
            <p>Mobile: {item.agent.mobile}</p>
            <p>Total Tasks: <strong>{item.tasks.length}</strong></p>
          </div>

          <table className="task-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>First Name</th>
                <th>Phone</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {item.tasks.map((task, taskIndex) => (
                <tr key={task.id}>
                  <td>{taskIndex + 1}</td>
                  <td>{task.firstName}</td>
                  <td>{task.phone}</td>
                  <td>{task.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

export default TaskList;
