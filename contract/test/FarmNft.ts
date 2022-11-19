import { ethers } from "hardhat";
import { BigNumber, Overrides } from "ethers";
import { expect } from "chai";
import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";

describe("farmNft", function () {
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

    const FarmNft = await ethers.getContractFactory("FarmNft");
    const farmNft = await FarmNft.deploy(
      accounts[0].address,
      farmerName,
      description,
      totalMint,
      price,
      expirationDate
    );

    return {
      deployAccount: accounts[0],
      userAccounts: accounts.slice(1, accounts.length),
      farmNft,
      totalMint,
    };
  }

  describe("mint", function () {
    it("basic", async function () {
      const { userAccounts, farmNft } = await loadFixture(deployContract);

      const account = userAccounts[0];
      const price = await farmNft.price();

      await farmNft.mintNFT(account.address, { value: price } as Overrides);

      expect(await farmNft.ownerOf(0)).to.equal(account.address);
    });

    it("revert when not enough nft to mint", async function () {
      const { userAccounts, farmNft, totalMint } = await loadFixture(
        deployContract
      );

      const account = userAccounts[0];
      const price = await farmNft.price();

      for (let cnt = 0; cnt < totalMint.toNumber(); cnt++) {
        await farmNft.mintNFT(account.address, { value: price } as Overrides);
      }

      await expect(
        farmNft.mintNFT(account.address, { value: price } as Overrides)
      ).to.be.reverted;
    });

    it("revert when not enough currency to mint", async function () {
      const { userAccounts, farmNft, totalMint } = await loadFixture(
        deployContract
      );

      const account = userAccounts[0];
      const price = await farmNft.price();

      await expect(
        farmNft.mintNFT(account.address, { value: price.sub(1) } as Overrides)
      ).to.be.reverted;
    });
  });

  describe("tokenURI", function () {
    it("basic", async function () {
      const { userAccounts, farmNft } = await loadFixture(deployContract);

      const account = userAccounts[0];
      const price = await farmNft.price();

      await farmNft.mintNFT(account.address, {
        value: price,
      } as Overrides);

      console.log("URI: ", await farmNft.tokenURI(0));
    });
  });

  describe("burnNFT", function () {
    it("basic", async function () {
      const { userAccounts, farmNft } = await loadFixture(deployContract);

      const account = userAccounts[0];
      const price = await farmNft.price();

      await farmNft.mintNFT(account.address, { value: price } as Overrides);

      expect(await farmNft.ownerOf(0)).to.equal(account.address);

      await time.increase(oneWeekInSecond * 2);

      await farmNft.burnNFT();

      expect(await farmNft.balanceOf(account.address)).to.equal(0);
    });

    it("revert when call burnNFT before expiration", async function () {
      const { farmNft } = await loadFixture(deployContract);

      await expect(farmNft.burnNFT()).to.be.reverted;
    });
  });

  describe("allOwners", function () {
    it("basic", async function () {
      const { userAccounts, farmNft, totalMint } = await loadFixture(
        deployContract
      );

      const price = await farmNft.price();

      for (let cnt = 0; cnt < totalMint.toNumber(); cnt++) {
        await farmNft.mintNFT(userAccounts[cnt].address, {
          value: price,
        } as Overrides);
      }

      const owners = await farmNft.getTokenOwners();

      for (let cnt = 0; cnt < totalMint.toNumber(); cnt++) {
        expect(owners[cnt]).to.equal(userAccounts[cnt].address);
      }
    });
  });
});
