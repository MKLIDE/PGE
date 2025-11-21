import React, { useState, useEffect } from 'react';
import GrowthForm from './GrowthForm';
import AIRecommendations from './AIRecommendations';
import BlockchainBadge from './BlockchainBadge';
import PowerBIEmbed from './PowerBIEmbed';
import axios from 'axios';

export default function Dashboard(){
const [goals, setGoals] = useState([]);


useEffect(()=>{ fetchGoals(); },[]);


async function fetchGoals(){
try{
const res = await axios.get(process.env.REACT_APP_API_URL + '/api/goals');
setGoals(res.data);
}catch(e){ console.error(e); }
}


return (
<div>
<GrowthForm onAdded={fetchGoals} />
<h2>Your Goals</h2>
<ul>
{goals.map(g => (
<li key={g.id}>
<strong>{g.title}</strong> - {g.category} - {g.progress}%
<AIRecommendations goal={g} />
<BlockchainBadge goal={g} />
</li>
))}
</ul>
<h2>Power BI Insights</h2>
<PowerBIEmbed />
</div>
);
}