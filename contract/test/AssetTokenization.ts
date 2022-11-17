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

      await assetTokenization
        .connect(userAccounts[1])
        .generateNft(
          farmerName,
          name,
          symbol,
          description,
          totalMint,
          price,
          expirationDate
        );

      const nfts = await assetTokenization.allNftDetails();

      expect(nfts[0].farmerName).to.equal(farmerName);
      expect(nfts[0].name).to.equal(name);
      expect(nfts[0].symbol).to.equal(symbol);
      expect(nfts[0].description).to.equal(description);
      expect(nfts[0].id).to.equal(0);
      expect(nfts[0].totalMint).to.equal(totalMint);
      expect(nfts[0].availableMint).to.equal(totalMint);
      expect(nfts[0].price).to.equal(price);
      expect(nfts[0].expirationDate).to.equal(expirationDate);

      expect(nfts[1].farmerName).to.equal(farmerName);
      expect(nfts[1].name).to.equal(name);
      expect(nfts[1].symbol).to.equal(symbol);
      expect(nfts[1].description).to.equal(description);
      expect(nfts[1].id).to.equal(1);
      expect(nfts[1].totalMint).to.equal(totalMint);
      expect(nfts[1].availableMint).to.equal(totalMint);
      expect(nfts[1].price).to.equal(price);
      expect(nfts[1].expirationDate).to.equal(expirationDate);
    });
  });
});
