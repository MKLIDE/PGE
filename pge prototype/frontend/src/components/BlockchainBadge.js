import React from 'react';
import Web3 from 'web3';


export default function BlockchainBadge({goal}){
async function mint(){
if(!window.ethereum){ alert('Install MetaMask'); return; }
const web3 = new Web3(window.ethereum);
await window.ethereum.request({ method: 'eth_requestAccounts' });
const accounts = await web3.eth.getAccounts();
const addr = accounts[0];
// contract ABI + address would go here (placeholder)
alert('Mint stub - integrate contract ABI and address');
}


return (
<div>
{goal.progress >= 100 && <button onClick={mint}>Mint Achievement Badge</button>}
</div>
);
}