import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("CropsNft", function () {
  async function deployContract() {
    const [owner, otherAccount] = await ethers.getSigners();

    const farmerName = "farmer";
    const name = "nft";
    const symbol = "symbol";
    const description = "description";
    const totalMint = 10;
    const price = 100;
    const expirationDate = 100;

    const CropsNft = await ethers.getContractFactory("CropsNft");
    const cropsNft = await CropsNft.deploy(
      farmerName,
      name,
      symbol,
      description,
      totalMint,
      price,
      expirationDate
    );

    return {
      owner,
      otherAccount,
      cropsNft,
    };
  }

  describe("basic", function () {
    it("basic", async function () {
      const { otherAccount, cropsNft } = await loadFixture(deployContract);

      await cropsNft.connect(otherAccount).mint();

      console.log("tokenURI:", await cropsNft.tokenURI(0));
    });
  });
});
