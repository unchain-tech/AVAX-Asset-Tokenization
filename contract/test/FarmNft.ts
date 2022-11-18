import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import { expect } from "chai";
import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";

describe("farmNft", function () {
  const oneWeekInSecond = 60 * 60 * 24 * 7;

  async function deployContract() {
    const accounts = await ethers.getSigners();

    const farmerName = "farmer";
    const name = "nft";
    const symbol = "symbol";
    const description = "description";
    const totalMint = BigNumber.from(5);
    const price = BigNumber.from(100);
    const expirationDate = BigNumber.from(Date.now())
      .div(1000) // in second
      .add(oneWeekInSecond); // one week later

    const FarmNft = await ethers.getContractFactory("FarmNft");
    const farmNft = await FarmNft.deploy(
      accounts[0].address,
      farmerName,
      name,
      symbol,
      description,
      totalMint,
      price,
      expirationDate
    );

    return {
      deployAccount: accounts[0],
      userAccounts: accounts.slice(1, accounts.length),
      farmNft,
      totalMint,
    };
  }

  describe("mint", function () {
    it("basic", async function () {
      const { userAccounts, farmNft } = await loadFixture(deployContract);

      await farmNft.mintNFT(userAccounts[0].address);

      expect(await farmNft.ownerOf(0)).to.equal(userAccounts[0].address);
    });

    it("revert when not enough nft to mint", async function () {
      const { userAccounts, farmNft, totalMint } = await loadFixture(
        deployContract
      );

      for (let cnt = 0; cnt < totalMint.toNumber(); cnt++) {
        await farmNft.mintNFT(userAccounts[0].address);
      }

      await expect(farmNft.mintNFT(userAccounts[0].address)).to.be.reverted;
    });
  });

  describe("tokenURI", function () {
    it("basic", async function () {
      const { userAccounts, farmNft } = await loadFixture(deployContract);

      await farmNft.mintNFT(userAccounts[0].address);

      console.log("URI: ", await farmNft.tokenURI(0));
    });
  });

  describe("burnNFT", function () {
    it("basic", async function () {
      const { userAccounts, farmNft } = await loadFixture(deployContract);

      await farmNft.mintNFT(userAccounts[0].address);

      expect(await farmNft.ownerOf(0)).to.equal(userAccounts[0].address);

      await time.increase(oneWeekInSecond * 2);

      await farmNft.burnNFT();

      expect(await farmNft.balanceOf(userAccounts[0].address)).to.equal(0);
    });

    it("revert when call burnNFT before expiration", async function () {
      const { farmNft } = await loadFixture(deployContract);

      await expect(farmNft.burnNFT()).to.be.reverted;
    });
  });

  describe("allOwners", function () {
    it("basic", async function () {
      const { userAccounts, farmNft, totalMint } = await loadFixture(
        deployContract
      );

      for (let cnt = 0; cnt < totalMint.toNumber(); cnt++) {
        await farmNft.mintNFT(userAccounts[cnt].address);
      }

      const owners = await farmNft.getTokenOwners();

      for (let cnt = 0; cnt < totalMint.toNumber(); cnt++) {
        expect(owners[cnt]).to.equal(userAccounts[cnt].address);
      }
    });
  });
});
