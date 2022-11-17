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
    const assetTokenization = await AssetTokenization.deploy();

    return {
      owner,
      otherAccount,
      assetTokenization,
    };
  }

  describe("basic", function () {
    it("basic", async function () {
      const { owner, otherAccount, assetTokenization } = await loadFixture(
        deployContract
      );

      const farmerName = "farmer";
      const name = "nft";
      const symbol = "symbol";
      const description = "description";
      const totalMint = 10;
      const price = 100;
      const expirationDate = 100;

      await assetTokenization
        .connect(otherAccount)
        .generateNft(
          farmerName,
          name,
          symbol,
          description,
          totalMint,
          price,
          expirationDate
        );

      const a = await assetTokenization.allNftDetals();

      console.log("attribute:", a);
    });
  });
});
