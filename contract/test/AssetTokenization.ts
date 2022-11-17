import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("AssetTokenization", function () {
  async function deployContract() {
    const [owner, otherAccount] = await ethers.getSigners();

    const AssetTokenization = await ethers.getContractFactory(
      "AssetTokenization"
    );
    const manager = await AssetTokenization.deploy();

    return {
      owner,
      otherAccount,
      manager,
    };
  }

  describe("basic", function () {
    it("basic", async function () {
      const { otherAccount, manager } = await loadFixture(deployContract);

      const nftName = "a";
      const description = "a";
      const totalMint = 10;
      const price = 100;
      const expirationDate = 100;

      await manager
        .connect(otherAccount)
        .newCropsNft(nftName, description, totalMint, price, expirationDate);

      const a = await manager.getAllCropsNft();

      console.log("attribute:", a);
    });
  });
});
