const hre = require("hardhat");
require("@nomiclabs/hardhat-etherscan");
// npx hardhat run scripts\testnet.js --network testnet
async function main() {
    // const [_dev] = await hre.ethers.getSigners();
    const _Main = await hre.ethers.getContractFactory("Main");
    const Main = await _Main.deploy();
    await Main.deployed();
    console.log("Main:", Main.address);

    await Main.setSaleStatus(true);
    await Main.setBaseURI('https://mint-o-taurs.pages.dev/metadata/');

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
