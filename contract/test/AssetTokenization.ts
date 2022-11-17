import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("AssetTokenization", function () {
  async function deployContract() {
    const accounts = await ethers.getSigners();

    const AssetTokenization = await ethers.getContractFactory(
      "AssetTokenization"
    );
    const assetTokenization = await AssetTokenization.deploy();

    return {
      deployAccount: accounts[0],
      userAccounts: accounts.slice(1, accounts.length),
      assetTokenization,
    };
  }

  describe("basic", function () {
    it("basic", async function () {
      const { userAccounts, assetTokenization } = await loadFixture(
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
        .connect(userAccounts[0])
        .generateNft(
          farmerName,
          name,
          symbol,
          description,
          totalMint,
          price,
          expirationDate
        );

      const a = await assetTokenization.allNftDetails();

      console.log("attribute:", a);
    });
  });

  describe("basic", function () {
    it("basic", async function () {
      const { userAccounts, assetTokenization } = await loadFixture(
        deployContract
      );

      const farmer = userAccounts[0];
      const account1 = userAccounts[1];
      const account2 = userAccounts[2];

      const farmerName = "farmer";
      const name = "nft";
      const symbol = "symbol";
      const description = "description";
      const totalMint = 10;
      const price = 100;
      const expirationDate = 100;

      await assetTokenization
        .connect(farmer)
        .generateNft(
          farmerName,
          name,
          symbol,
          description,
          totalMint,
          price,
          expirationDate
        );

      await assetTokenization.connect(account1).buy(0);
      await assetTokenization.connect(account2).buy(0);

      const owners = await assetTokenization.connect(farmer).allOwners();

      console.log("owners:", [account1.address, account2.address]);
      console.log("result:", owners);
    });
  });
});
