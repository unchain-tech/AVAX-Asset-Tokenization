import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("FarmerNft", function () {
  async function deployContract() {
    const [owner, otherAccount] = await ethers.getSigners();

    const farmerName = "farmer";
    const name = "nft";
    const symbol = "symbol";
    const description = "description";
    const totalMint = 5;
    const price = 100;
    const expirationDate = 100;

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
      owner,
      otherAccount,
      farmerNft,
      totalMint,
    };
  }

  describe("mint", function () {
    it("basic", async function () {
      const { otherAccount, farmerNft } = await loadFixture(deployContract);

      await farmerNft.mint(otherAccount.address);

      expect(await farmerNft.ownerOf(0)).to.equal(otherAccount.address);
    });

    it("revert when not enough nft to mint", async function () {
      const { otherAccount, farmerNft, totalMint } = await loadFixture(
        deployContract
      );

      for (let cnt = 0; cnt < totalMint; cnt++) {
        await farmerNft.mint(otherAccount.address);
      }

      await expect(farmerNft.mint(otherAccount.address)).to.be.reverted;
    });
  });
});
