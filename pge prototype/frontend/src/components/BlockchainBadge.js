import React, { useState } from "react";
import { ethers } from "ethers";
import "./BlockchainBadge.css";
import contractABI from "./abi/GrowthOwnership.json";

export default function BlockchainBadge({ goal }) {
  const [status, setStatus] = useState("not_verified");

  const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

  async function verifyOnChain() {
    try {
      setStatus("verifying");

      // Assume a provider already exists
      const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
      const signer = provider.getSigner(0); // Use first account for now

      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const tx = await contract.recordGoalCompletion(
        goal.id,
        goal.title,
        goal.progress
      );

      await tx.wait();
      setStatus("verified");
    } catch (err) {
      console.error(err);
      setStatus("failed");
    }
  }

  return (
    <div className="blockchain-badge-container">
      {status === "verified" ? (
        <span className="blockchain-verified">✓ Verified on Blockchain</span>
      ) : status === "verifying" ? (
        <span className="blockchain-verifying">Verifying...</span>
      ) : status === "failed" ? (
        <span className="blockchain-failed">Failed – Try Again</span>
      ) : (
        <button className="blockchain-btn" onClick={verifyOnChain}>
          Verify on Blockchain
        </button>
      )}
    </div>
  );
}



/*import React, { useState } from "react";
import { ethers } from "ethers";
import "./BlockchainDadge.css";
import contractABI from "./abi/GrowthOwnership.json";

export default function BlockchainBadge({ goal }) {
  const [status, setStatus] = useState("not_verified");

  const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

  async function verifyOnChain() {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask to use blockchain features.");
        return;
      }

      setStatus("verifying");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      const tx = await contract.recordGoalCompletion(
        goal.id,
        goal.title,
        goal.progress
      );

      await tx.wait();
      setStatus("verified");
    } catch (err) {
      console.error(err);
      setStatus("failed");
    }
  }

  return (
    <div className="blockchain-badge-container">
      {status === "verified" ? (
        <span className="blockchain-verified">✓ Verified on Blockchain</span>
      ) : status === "verifying" ? (
        <span className="blockchain-verifying">Verifying...</span>
      ) : status === "failed" ? (
        <span className="blockchain-failed">Failed – Try Again</span>
      ) : (
        <button className="blockchain-btn" onClick={verifyOnChain}>
          Verify on Blockchain
        </button>
      )}
    </div>
  );
}*/

