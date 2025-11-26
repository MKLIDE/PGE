import React, { useState, useEffect } from 'react';
import './Dash.css';
import GrowthForm from './GrowthForm';
import AIRecommendations from './AIRecommendations';
import BlockchainBadge from './BlockchainBadge';
import PowerBIEmbed from './PowerBIEmbed';
import axios from 'axios';

export default function Dashboard() {

  const [goals, setGoals] = useState([]);

  // Track goal being edited
  const [editingGoal, setEditingGoal] = useState(null);

  useEffect(() => { fetchGoals(); }, []);

  async function fetchGoals() {
    try {
      const res = await axios.get(process.env.REACT_APP_API_URL + '/api/goals');
      setGoals(res.data);
    } catch (e) { console.error(e); }
  }

  // DELETE
  async function handleDelete(id) {
    try {
      await axios.delete(process.env.REACT_APP_API_URL + '/api/goals/' + id);
      fetchGoals();
    } catch (e) { console.error(e); }
  }

  // UPDATE
  async function handleUpdate() {
    try {
      await axios.put(
        process.env.REACT_APP_API_URL + '/api/goals/' + editingGoal.id,
        editingGoal
      );
      setEditingGoal(null);
      fetchGoals();
    } catch (e) { console.error(e); }
  }

  return (
    <div id="dashboard-container">

      <section id="growth-form-section">
        <GrowthForm onAdded={fetchGoals} />
      </section>

      <h2 className="section-title">Your Goals</h2>

      <ul id="goals-list">
        {goals.map(g => (
          <li key={g.id} className="goal-item">

            {/* VIEW MODE */}
            {editingGoal?.id !== g.id ? (
              <div className="goal-content">

                <div className="goal-details">
                  <span className="goal-title">{g.title}</span>
                  <span className="goal-category">{g.category}</span>
                  <span className="goal-progress">{g.progress}%</span>
                </div>

                <div className="goal-buttons">
                  <button 
                    className="goal-btn edit-btn"
                    onClick={() => setEditingGoal(g)}
                  >
                    Edit
                  </button>

                  <button 
                    className="goal-btn delete-btn"
                    onClick={() => handleDelete(g.id)}
                  >
                    Delete
                  </button>
                </div>

                <AIRecommendations goal={g} />
                <BlockchainBadge goal={g} />

              </div>
            ) : (

              /* EDIT MODE */
              <div className="goal-edit-form">
                
                <input
                  className="edit-input"
                  type="text"
                  value={editingGoal.title}
                  onChange={e => setEditingGoal({ ...editingGoal, title: e.target.value })}
                />

                <input
                  className="edit-input"
                  type="text"
                  value={editingGoal.category}
                  onChange={e => setEditingGoal({ ...editingGoal, category: e.target.value })}
                />

                <input
                  className="edit-input small-input"
                  type="number"
                  value={editingGoal.progress}
                  onChange={e => setEditingGoal({ ...editingGoal, progress: Number(e.target.value) })}
                />

                <button 
                  className="goal-btn save-btn"
                  onClick={handleUpdate}
                >
                  Save
                </button>

                <button 
                  className="goal-btn cancel-btn"
                  onClick={() => setEditingGoal(null)}
                >
                  Cancel
                </button>

              </div>
            )}

          </li>
        ))}
      </ul>

      <h2 className="section-title">Power BI Insights</h2>

      <section id="powerbi-section">
        <PowerBIEmbed />
      </section>

    </div>
  );
}
