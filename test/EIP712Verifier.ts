import Contracts from '../components/Contracts';
import { EIP712Verifier } from '../typechain-types';
import { HARDHAT_CHAIN_ID } from '../utils/Constants';
import { ATTEST_TYPED_SIGNATURE, Delegation, REVOKE_TYPED_SIGNATURE } from '@ethereum-attestation-service/sdk';
import { expect } from 'chai';
import { ethers } from 'hardhat';

const {
  utils: { keccak256, toUtf8Bytes }
} = ethers;

describe('EIP712Verifier', () => {
  let verifier: EIP712Verifier;

  beforeEach(async () => {
    verifier = await Contracts.EIP712Verifier.deploy();
  });

  it('should report a version', async () => {
    expect(await verifier.VERSION()).to.equal('0.10');
  });

  it('should return the correct domain separator', async () => {
    const delegation = new Delegation({
      address: verifier.address,
      version: await verifier.VERSION(),
      chainId: HARDHAT_CHAIN_ID
    });

    expect(await verifier.getDomainSeparator()).to.equal(delegation.getDomainSeparator());
  });

  it('should return the attest type hash', async () => {
    expect(await verifier.getAttestTypeHash()).to.equal(keccak256(toUtf8Bytes(ATTEST_TYPED_SIGNATURE)));
  });

  it('should return the revoke type hash', async () => {
    expect(await verifier.getRevokeTypeHash()).to.equal(keccak256(toUtf8Bytes(REVOKE_TYPED_SIGNATURE)));
  });
});
