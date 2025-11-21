import hardhat from "hardhat"; // default import for CommonJS module
const { ethers } = hardhat;

async function main() {
  const GrowthOwnership = await ethers.getContractFactory("GrowthOwnership");
  const contract = await GrowthOwnership.deploy();

  await contract.waitForDeployment();

  console.log("Contract deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

