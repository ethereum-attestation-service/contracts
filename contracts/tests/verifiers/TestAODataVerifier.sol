// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "../../IAOVerifier.sol";

/// @title A sample AO verifier that checks whether an attestation data is either \x00 or \x01.
contract TestAODataVerifier is IAOVerifier {
    function verify(
        address, /* recipient */
        bytes calldata, /* schema */
        bytes calldata data,
        uint256, /* expirationTime */
        address, /* msgSender */
        uint256 /* msgValue */
    ) public virtual override view returns (bool) {
        // Verifies that the data is either 0 or 1.
        return data.length == 1 && (data[0] == "\x00" || data[0] == "\x01");
    }
}