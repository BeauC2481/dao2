require('@nomiclabs/hardhat-ethers');

module.exports = {
  solidity: '0.8.4',
  defaultNetwork: 'goerli',
  networks: {
    hardhat: {
      chainId: 31337,
    },
    goerli: {
      url: 'https://eth-goerli.g.alchemy.com/v2/48I8EVh9NdEbuAG0oc0UDWHLqMVfuDdM',
      accounts: ['0x47c99abed3324a2707c28affff1267e45918ec8c3f20b8aa892e8b065d2942dd'],
    },
  },
};

