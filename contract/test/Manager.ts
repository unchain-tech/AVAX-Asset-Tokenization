import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("Manager", function () {
  async function deployContract() {
    const [owner, otherAccount] = await ethers.getSigners();

    const Manager = await ethers.getContractFactory("Manager");
    const manager = await Manager.deploy();

    return {
      owner,
      otherAccount,
      manager,
    };
  }

  describe("provide", function () {
    it("Token should be moved", async function () {
      const { otherAccount, manager } = await loadFixture(deployContract);

      const farmerName = "a";
      const cropsName = "a";
      const description = "a";
      const totalMint = 10;
      const price = 100;
      const expirationDate = 100;

      await manager
        .connect(otherAccount)
        .newCrops(
          farmerName,
          cropsName,
          description,
          totalMint,
          price,
          expirationDate
        );

      const a = await manager.allAttribute();

      console.log("attribute:", a);
    });
  });
});
