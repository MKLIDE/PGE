import hre from "hardhat"; // default import for CommonJS module

async function main() {
  const GrowthOwnership = await hre.ethers.getContractFactory("GrowthOwnership");
  // Deploy
  const contract = await GrowthOwnership.deploy();
  //wait for deployment
  await contract.waitForDeployment();

  console.log("GrowthOwnership deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


