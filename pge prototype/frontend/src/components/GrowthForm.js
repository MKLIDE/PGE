import React, { useState } from 'react';
import axios from 'axios';
import './GrowthForm.css';

export default function GrowthForm({ onAdded }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Career');

  async function submit(e) {
    e.preventDefault();
    try {
      await axios.post(
        process.env.REACT_APP_API_URL + '/api/goals',
        { title, category, progress: 0 }
      );
      setTitle('');
      onAdded();
    } catch (err) {
      console.error(err);
      alert("Failed to add goal. Please try again.");
    }
  }

  return (
    <form className="growth-form" onSubmit={submit}>
      <input
        className="growth-input"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Goal title"
        required
      />
      <select
        className="growth-select"
        value={category}
        onChange={e => setCategory(e.target.value)}
      >
        <option>Career</option>
        <option>Health</option>
        <option>Finance</option>
        <option>Social</option>
      </select>
      <button className="growth-btn" type="submit">Add Goal</button>
    </form>
  );
}
