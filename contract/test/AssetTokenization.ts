import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("AssetTokenization", function () {
  const oneWeekInSecond = 60 * 60 * 24 * 7;

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
    it("generate NFT contract and check details", async function () {
      const { userAccounts, assetTokenization } = await loadFixture(
        deployContract
      );

      const farmerName = "farmer";
      const name = "nft";
      const symbol = "symbol";
      const description = "description";
      const totalMint = BigNumber.from(5);
      const price = BigNumber.from(100);
      const expirationDate = BigNumber.from(Date.now())
        .div(1000) // in second
        .add(oneWeekInSecond); // one week later

      const account1 = userAccounts[0];
      const account2 = userAccounts[1];

      await assetTokenization
        .connect(account1)
        .generateNftContract(
          farmerName,
          name,
          symbol,
          description,
          totalMint,
          price,
          expirationDate
        );

      await assetTokenization
        .connect(account2)
        .generateNftContract(
          farmerName,
          name,
          symbol,
          description,
          totalMint,
          price,
          expirationDate
        );

      const details1 = await assetTokenization.getNftContractDetails(
        account1.address
      );
      expect(details1.farmerAddress).to.equal(account1.address);
      expect(details1.farmerName).to.equal(farmerName);
      expect(details1.name).to.equal(name);
      expect(details1.symbol).to.equal(symbol);
      expect(details1.description).to.equal(description);
      expect(details1.totalMint).to.equal(totalMint);
      expect(details1.availableMint).to.equal(totalMint);
      expect(details1.price).to.equal(price);
      expect(details1.expirationDate).to.equal(expirationDate);

      const details2 = await assetTokenization.getNftContractDetails(
        account2.address
      );
      expect(details2.farmerAddress).to.equal(account2.address);
      expect(details2.farmerName).to.equal(farmerName);
      expect(details2.name).to.equal(name);
      expect(details2.symbol).to.equal(symbol);
      expect(details2.description).to.equal(description);
      expect(details2.totalMint).to.equal(totalMint);
      expect(details2.availableMint).to.equal(totalMint);
      expect(details2.price).to.equal(price);
      expect(details2.expirationDate).to.equal(expirationDate);
    });
  });
});
