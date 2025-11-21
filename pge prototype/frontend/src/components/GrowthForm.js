import React, {useState} from 'react';
import axios from 'axios';


export default function GrowthForm({onAdded}){
const [title,setTitle] = useState('');
const [category,setCategory] = useState('Career');


async function submit(e){
e.preventDefault();
await axios.post(process.env.REACT_APP_API_URL + '/api/goals', { title, category, progress: 0 });
setTitle('');
onAdded();
}


return (
<form onSubmit={submit}>
<input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Goal title" required />
<select value={category} onChange={e=>setCategory(e.target.value)}>
<option>Career</option>
<option>Health</option>
<option>Finance</option>
<option>Social</option>
</select>
<button type="submit">Add Goal</button>
</form>
);
}