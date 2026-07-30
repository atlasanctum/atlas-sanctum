import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("RIUToken", () => {
  let riu: any, owner: SignerWithAddress, minter: SignerWithAddress, user: SignerWithAddress;

  beforeEach(async () => {
    [owner, minter, user] = await ethers.getSigners();
    const RIUToken = await ethers.getContractFactory("RIUToken");
    riu = await RIUToken.deploy();
    await riu.deployed();
  });

  it("mints RIUs via authorized minter", async () => {
    await riu.addMinter(minter.address);
    const projectId = ethers.utils.formatBytes32String("proj-001");
    await riu.connect(minter).mint(user.address, ethers.utils.parseEther("100"), projectId);
    expect(await riu.balanceOf(user.address)).to.equal(ethers.utils.parseEther("100"));
  });

  it("reverts mint from unauthorized address", async () => {
    const projectId = ethers.utils.formatBytes32String("proj-001");
    await expect(
      riu.connect(user).mint(user.address, ethers.utils.parseEther("1"), projectId)
    ).to.be.revertedWith("Not a minter");
  });

  it("retires RIUs and emits event", async () => {
    await riu.addMinter(owner.address);
    const projectId = ethers.utils.formatBytes32String("proj-001");
    await riu.mint(user.address, ethers.utils.parseEther("50"), projectId);
    await expect(
      riu.connect(user).retire(ethers.utils.parseEther("10"), projectId, "Corporate offset 2025")
    ).to.emit(riu, "RIURetired");
    expect(await riu.balanceOf(user.address)).to.equal(ethers.utils.parseEther("40"));
  });

  it("enforces max supply", async () => {
    await riu.addMinter(owner.address);
    const projectId = ethers.utils.formatBytes32String("proj-001");
    const maxSupply = await riu.MAX_SUPPLY();
    await expect(
      riu.mint(user.address, maxSupply.add(1), projectId)
    ).to.be.revertedWith("Exceeds max supply");
  });
});

describe("ImpactNFT", () => {
  let nft: any, owner: SignerWithAddress, minter: SignerWithAddress, user: SignerWithAddress;

  beforeEach(async () => {
    [owner, minter, user] = await ethers.getSigners();
    const ImpactNFT = await ethers.getContractFactory("ImpactNFT");
    nft = await ImpactNFT.deploy();
    await nft.deployed();
    await nft.authorizeMinter(minter.address);
  });

  it("mints a certificate with correct impact data", async () => {
    const projectId = ethers.utils.formatBytes32String("amazon-001");
    const tx = await nft.connect(minter).mintCertificate(
      user.address,
      "ipfs://QmTest",
      projectId,
      1000000, // 1000 tonne CO2e in kg
      50000,
      250000,
      150,
      2 // Epic
    );
    const receipt = await tx.wait();
    const tokenId = receipt.events[0].args.tokenId;

    const data = await nft.getImpactData(tokenId);
    expect(data.carbonOffset).to.equal(1000000);
    expect(data.rarity).to.equal(2);
    expect(await nft.ownerOf(tokenId)).to.equal(user.address);
  });

  it("reverts mint from unauthorized address", async () => {
    const projectId = ethers.utils.formatBytes32String("proj-001");
    await expect(
      nft.connect(user).mintCertificate(user.address, "ipfs://x", projectId, 0, 0, 0, 0, 0)
    ).to.be.revertedWith("Not authorized");
  });
});

describe("RIUMarketplace", () => {
  let riu: any, usdc: any, marketplace: any;
  let owner: SignerWithAddress, seller: SignerWithAddress, buyer: SignerWithAddress;

  beforeEach(async () => {
    [owner, seller, buyer] = await ethers.getSigners();

    // Deploy mock USDC (simple ERC20)
    const ERC20Mock = await ethers.getContractFactory("RIUToken"); // reuse for mock
    usdc = await ERC20Mock.deploy();
    await usdc.deployed();
    await usdc.addMinter(owner.address);
    const usdcProjectId = ethers.utils.formatBytes32String("usdc");
    await usdc.mint(buyer.address, ethers.utils.parseEther("10000"), usdcProjectId);

    // Deploy RIUToken
    const RIUToken = await ethers.getContractFactory("RIUToken");
    riu = await RIUToken.deploy();
    await riu.deployed();
    await riu.addMinter(owner.address);
    const riuProjectId = ethers.utils.formatBytes32String("proj-001");
    await riu.mint(seller.address, ethers.utils.parseEther("1000"), riuProjectId);

    // Deploy Marketplace
    const Marketplace = await ethers.getContractFactory("RIUMarketplace");
    marketplace = await Marketplace.deploy(riu.address, usdc.address, owner.address);
    await marketplace.deployed();
  });

  it("creates a listing and allows purchase", async () => {
    const riuAmount = ethers.utils.parseEther("100");
    const pricePerRIU = ethers.utils.parseEther("25"); // $25 per RIU
    const projectId = ethers.utils.formatBytes32String("proj-001");

    await riu.connect(seller).approve(marketplace.address, riuAmount);
    const listTx = await marketplace.connect(seller).list(riuAmount, pricePerRIU, projectId);
    const listReceipt = await listTx.wait();
    const listingId = listReceipt.events[1].args.listingId;

    const purchaseAmount = ethers.utils.parseEther("10");
    const totalCost = purchaseAmount.mul(pricePerRIU).div(ethers.utils.parseEther("1"));
    await usdc.connect(buyer).approve(marketplace.address, totalCost);

    await expect(marketplace.connect(buyer).purchase(listingId, purchaseAmount))
      .to.emit(marketplace, "Purchased");

    expect(await riu.balanceOf(buyer.address)).to.equal(purchaseAmount);
  });

  it("allows seller to cancel listing", async () => {
    const riuAmount = ethers.utils.parseEther("50");
    const projectId = ethers.utils.formatBytes32String("proj-001");
    await riu.connect(seller).approve(marketplace.address, riuAmount);
    const listTx = await marketplace.connect(seller).list(riuAmount, ethers.utils.parseEther("30"), projectId);
    const receipt = await listTx.wait();
    const listingId = receipt.events[1].args.listingId;

    await marketplace.connect(seller).cancelListing(listingId);
    const listing = await marketplace.listings(listingId);
    expect(listing.active).to.be.false;
    expect(await riu.balanceOf(seller.address)).to.equal(ethers.utils.parseEther("1000"));
  });
});
