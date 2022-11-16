import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("CropNft", function () {
  async function deployContract() {
    const [owner, otherAccount] = await ethers.getSigners();

    const farmerName = "a";
    const cropsName = "a";
    const description = "a";
    const totalMint = 10;
    const price = 100;
    const expirationDate = 100;

    const CropNft = await ethers.getContractFactory("CropNft");
    const cropNft = await CropNft.deploy(
      farmerName,
      cropsName,
      description,
      totalMint,
      price,
      expirationDate
    );

    return {
      owner,
      otherAccount,
      cropNft,
    };
  }

  describe("provide", function () {
    it("Token should be moved", async function () {
      const { otherAccount, cropNft } = await loadFixture(deployContract);

      await cropNft.connect(otherAccount).mintNFT();

      console.log("tokenURI:", await cropNft.tokenURI(0));
    });
  });
});
