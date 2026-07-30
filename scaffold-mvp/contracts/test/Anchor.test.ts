import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('Anchor', function () {
  it('should emit Anchored event', async function () {
    const Anchor = await ethers.getContractFactory('Anchor');
    const anchor = await Anchor.deploy();
    await anchor.deployed();

    const payload = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('test-payload'));
    await expect(anchor.anchor(payload)).to.emit(anchor, 'Anchored').withArgs(payload, anyValue, anyValue);
  });
});
