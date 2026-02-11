import React, { useState, useEffect } from 'react';
import { getAllAgents } from '../services/api';

function AgentList() {
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch all agents when component loads
    useEffect(() => {
        fetchAgents();
    }, []);

    const fetchAgents = async () => {
        try {
            const response = await getAllAgents();
            setAgents(response.agents);
            setLoading(false);
        } catch (err) {
            setError('Failed to load agents');
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="task-list-container">Loading agents...</div>;
    }

    if (error) {
        return <div className="task-list-container"><p className="error">{error}</p></div>;
    }

    if (agents.length === 0) {
        return (
            <div className="task-list-container">
                <h3>All Agents</h3>
                <p className="no-data">No agents found. Please add agents first.</p>
            </div>
        );
    }

    return (
        <div className="task-list-container">
            <h3>All Agents ({agents.length})</h3>

            <table className="task-table">
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Mobile</th>
                        <th>Created At</th>
                    </tr>
                </thead>
                <tbody>
                    {agents.map((agent, index) => (
                        <tr key={agent._id}>
                            <td>{index + 1}</td>
                            <td>{agent.name}</td>
                            <td>{agent.email}</td>
                            <td>{agent.mobile}</td>
                            <td>{new Date(agent.createdAt).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AgentList;