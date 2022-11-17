import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import { expect } from "chai";
import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";

describe("FarmerNft", function () {
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

    const FarmerNft = await ethers.getContractFactory("FarmerNft");
    const farmerNft = await FarmerNft.deploy(
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
      farmerNft,
      totalMint,
    };
  }

  describe("mint", function () {
    it("basic", async function () {
      const { userAccounts, farmerNft } = await loadFixture(deployContract);

      await farmerNft.mint(userAccounts[0].address);

      expect(await farmerNft.ownerOf(0)).to.equal(userAccounts[0].address);
    });

    it("revert when not enough nft to mint", async function () {
      const { userAccounts, farmerNft, totalMint } = await loadFixture(
        deployContract
      );

      for (let cnt = 0; cnt < totalMint.toNumber(); cnt++) {
        await farmerNft.mint(userAccounts[0].address);
      }

      await expect(farmerNft.mint(userAccounts[0].address)).to.be.reverted;
    });
  });

  describe("tokenURI", function () {
    it("basic", async function () {
      const { userAccounts, farmerNft } = await loadFixture(deployContract);

      await farmerNft.mint(userAccounts[0].address);

      console.log("URI: ", farmerNft.tokenURI(0));
    });
  });

  describe("end", function () {
    it("basic", async function () {
      const { userAccounts, farmerNft } = await loadFixture(deployContract);

      await farmerNft.mint(userAccounts[0].address);

      expect(await farmerNft.ownerOf(0)).to.equal(userAccounts[0].address);

      await time.increase(oneWeekInSecond * 2);

      await farmerNft.end();

      expect(await farmerNft.balanceOf(userAccounts[0].address)).to.equal(0);
    });

    it("revert when call end before expiration", async function () {
      const { farmerNft } = await loadFixture(deployContract);

      await expect(farmerNft.end()).to.be.reverted;
    });
  });

  describe("allOwners", function () {
    it("basic", async function () {
      const { userAccounts, farmerNft, totalMint } = await loadFixture(
        deployContract
      );

      for (let cnt = 0; cnt < totalMint.toNumber(); cnt++) {
        await farmerNft.mint(userAccounts[cnt].address);
      }

      const owners = await farmerNft.allOwners();

      for (let cnt = 0; cnt < totalMint.toNumber(); cnt++) {
        expect(owners[cnt]).to.equal(userAccounts[cnt].address);
      }
    });
  });
});
