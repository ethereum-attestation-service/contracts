// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import { EMPTY_UUID } from "./Types.sol";
import { IASRegistry, ASRecord } from "./IASRegistry.sol";
import { IASResolver } from "./IASResolver.sol";

/**
 * @title The global AS registry.
 */
contract ASRegistry is IASRegistry {
    error AlreadyExists();

    string public constant VERSION = "0.9";

    // The global mapping between AS records and their IDs.
    mapping(bytes32 => ASRecord) private _registry;

    // The global counter for the total number of attestations.
    uint256 private _asCount;

    /**
     * @inheritdoc IASRegistry
     */
    function register(bytes calldata schema, IASResolver resolver) external returns (bytes32) {
        uint256 index;
        unchecked {
            index = ++_asCount;
        }

        ASRecord memory asRecord = ASRecord({ uuid: EMPTY_UUID, index: index, schema: schema, resolver: resolver });

        bytes32 uuid = _getUUID(asRecord);
        if (_registry[uuid].uuid != EMPTY_UUID) {
            revert AlreadyExists();
        }

        asRecord.uuid = uuid;
        _registry[uuid] = asRecord;

        emit Registered(uuid, index, schema, resolver, msg.sender);

        return uuid;
    }

    /**
     * @inheritdoc IASRegistry
     */
    function getAS(bytes32 uuid) external view returns (ASRecord memory) {
        return _registry[uuid];
    }

    /**
     * @inheritdoc IASRegistry
     */
    function getASCount() external view returns (uint256) {
        return _asCount;
    }

    /**
     * @dev Calculates a UUID for a given AS.
     *
     * @param asRecord The input AS.
     *
     * @return AS UUID.
     */
    function _getUUID(ASRecord memory asRecord) private pure returns (bytes32) {
        return keccak256(abi.encodePacked(asRecord.schema, asRecord.resolver));
    }
}
