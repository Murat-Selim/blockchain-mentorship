const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  const MentorshipContract = await ethers.getContractFactory("MentorshipContract");
  const mentorship = await MentorshipContract.deploy();

  console.log("Waiting for deployment...");
  await mentorship.waitForDeployment();

  const contractAddress = await mentorship.getAddress();
  console.log("MentorshipContract deployed to:", contractAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 