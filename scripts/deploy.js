const fs = require("fs");
const { ethers } = require("hardhat");
const hre = require("hardhat");


async function main() {
  
  
  const Token = await hre.ethers.getContractFactory("Token");
  const token = await Token.deploy({ gasLimit: 20000000 });
  await token.deployed();

  const contractsDir = __dirname + "/../pages/contractsData";
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + `/token-address.json`,
    JSON.stringify({ address: token.address }, undefined, 2)
  );

  const TokenContractArtifact = artifacts.readArtifactSync("Token");

  fs.writeFileSync(
    contractsDir + `/token.json`,
    JSON.stringify(TokenContractArtifact, null, 2)
  );

  console.log("Token deployed to: ", token.address);



  const DAO = await hre.ethers.getContractFactory("DAO");
  const dao = await DAO.deploy(token.address, { gasLimit: 20000000 });
  await dao.deployed();

  fs.writeFileSync(
    contractsDir + `/dao-address.json`,
    JSON.stringify({ address: dao.address }, undefined, 2)
  );

  const DAOContractArtifact = artifacts.readArtifactSync("DAO");

  fs.writeFileSync(
    contractsDir + `/dao.json`,
    JSON.stringify(DAOContractArtifact, null, 2)
  );

  console.log("DAO deployed to: ", dao.address);



  const EtherSwap = await hre.ethers.getContractFactory("EtherSwap");
  const etherswap = await EtherSwap.deploy(token.address);
  await etherswap.deployed();

  fs.writeFileSync(
    contractsDir + `/etherswap-address.json`,
    JSON.stringify({ address: etherswap.address }, undefined, 2)
  );

  const EtherSwapContractArtifact = artifacts.readArtifactSync("EtherSwap");

  fs.writeFileSync(
    contractsDir + `/etherswap.json`,
    JSON.stringify(EtherSwapContractArtifact, null, 2)
  );

  console.log("EtherSwap deployed to: ", etherswap.address);

}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
