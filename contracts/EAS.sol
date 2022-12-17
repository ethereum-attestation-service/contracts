// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import { Address } from "@openzeppelin/contracts/utils/Address.sol";

import { EMPTY_UUID, EIP712Signature } from "./Types.sol";

// prettier-ignore
import {
    Attestation,
    AttestationRequest,
    AttestationRequestData,
    DelegatedAttestationRequest,
    DelegatedRevocationRequest,
    IEAS,
    MultiAttestationRequest,
    MultiDelegatedAttestationRequest,
    MultiDelegatedRevocationRequest,
    MultiRevocationRequest,
    RevocationRequest,
    RevocationRequestData
} from "./IEAS.sol";
import { ISchemaRegistry, SchemaRecord } from "./ISchemaRegistry.sol";
import { IEIP712Verifier } from "./IEIP712Verifier.sol";

import { ISchemaResolver } from "./resolver/ISchemaResolver.sol";

struct AttestationsResult {
    uint256 usedValue; // Total ETH amount that was sent to resolvers.
    bytes32[] uuids; // UUIDs of the new attestations.
}

/**
 * @title EAS - Ethereum Attestation Service
 */
contract EAS is IEAS {
    using Address for address payable;

    error AccessDenied();
    error AlreadyRevoked();
    error InsufficientValue();
    error InvalidAttestation();
    error InvalidAttestations();
    error InvalidExpirationTime();
    error InvalidLength();
    error InvalidOffset();
    error InvalidRegistry();
    error InvalidRevocation();
    error InvalidRevocations();
    error InvalidSchema();
    error InvalidVerifier();
    error Irrevocable();
    error NotFound();
    error NotPayable();
    error WrongSchema();

    // The version of the contract.
    string public constant VERSION = "0.21";

    // The global schema registry.
    ISchemaRegistry private immutable _schemaRegistry;

    // The EIP712 verifier used to verify signed attestations.
    IEIP712Verifier private immutable _eip712Verifier;

    // The global mapping between attestations and their UUIDs.
    mapping(bytes32 => Attestation) private _db;

    /**
     * @dev Creates a new EAS instance.
     *
     * @param registry The address of the global schema registry.
     * @param verifier The address of the EIP712 verifier.
     */
    constructor(ISchemaRegistry registry, IEIP712Verifier verifier) {
        if (address(registry) == address(0)) {
            revert InvalidRegistry();
        }

        if (address(verifier) == address(0)) {
            revert InvalidVerifier();
        }

        _schemaRegistry = registry;
        _eip712Verifier = verifier;
    }

    /**
     * @inheritdoc IEAS
     */
    function getSchemaRegistry() external view returns (ISchemaRegistry) {
        return _schemaRegistry;
    }

    /**
     * @inheritdoc IEAS
     */
    function getEIP712Verifier() external view returns (IEIP712Verifier) {
        return _eip712Verifier;
    }

    /**
     * @inheritdoc IEAS
     */
    function attest(AttestationRequest calldata request) public payable virtual returns (bytes32) {
        AttestationRequestData[] memory requests = new AttestationRequestData[](1);
        requests[0] = request.data;

        return _attest(request.schema, requests, msg.sender, msg.value, true).uuids[0];
    }

    /**
     * @inheritdoc IEAS
     */
    function attestByDelegation(
        DelegatedAttestationRequest calldata delegatedRequest
    ) public payable virtual returns (bytes32) {
        _eip712Verifier.attest(delegatedRequest);

        AttestationRequestData[] memory data = new AttestationRequestData[](1);
        data[0] = delegatedRequest.data;

        return _attest(delegatedRequest.schema, data, delegatedRequest.attester, msg.value, true).uuids[0];
    }

    /**
     * @inheritdoc IEAS
     */
    function multiAttest(MultiAttestationRequest[] calldata multiRequests) external payable returns (bytes32[] memory) {
        bytes32[][] memory totalUuids = new bytes32[][](multiRequests.length);
        uint256 totalUuidsCount = 0;

        uint availableValue = msg.value;

        for (uint256 i = 0; i < multiRequests.length; ) {
            bool last;
            unchecked {
                last = i == multiRequests.length - 1;
            }

            MultiAttestationRequest calldata multiRequest = multiRequests[i];

            AttestationsResult memory res = _attest(
                multiRequest.schema,
                multiRequest.data,
                msg.sender,
                availableValue,
                last
            );

            availableValue -= res.usedValue;

            totalUuids[i] = res.uuids;
            unchecked {
                totalUuidsCount += res.uuids.length;
            }

            unchecked {
                ++i;
            }
        }

        return _mergeUUIDs(totalUuids, totalUuidsCount);
    }

    /**
     * @inheritdoc IEAS
     */
    function multiAttestByDelegation(
        MultiDelegatedAttestationRequest[] calldata multiDelegatedRequests
    ) external payable returns (bytes32[] memory) {
        bytes32[][] memory totalUuids = new bytes32[][](multiDelegatedRequests.length);
        uint256 totalUuidsCount = 0;

        uint availableValue = msg.value;

        for (uint256 i = 0; i < multiDelegatedRequests.length; ) {
            bool last;
            unchecked {
                last = i == multiDelegatedRequests.length - 1;
            }

            MultiDelegatedAttestationRequest memory multiDelegatedRequest = multiDelegatedRequests[i];
            AttestationRequestData[] memory data = multiDelegatedRequest.data;

            if (data.length == 0 || data.length != multiDelegatedRequest.signatures.length) {
                revert InvalidLength();
            }

            for (uint256 j = 0; j < data.length; ) {
                _eip712Verifier.attest(
                    DelegatedAttestationRequest({
                        schema: multiDelegatedRequest.schema,
                        data: data[j],
                        signature: multiDelegatedRequest.signatures[j],
                        attester: multiDelegatedRequest.attester
                    })
                );

                unchecked {
                    ++j;
                }
            }

            AttestationsResult memory res = _attest(
                multiDelegatedRequest.schema,
                data,
                multiDelegatedRequest.attester,
                availableValue,
                last
            );

            availableValue -= res.usedValue;

            totalUuids[i] = res.uuids;
            unchecked {
                totalUuidsCount += res.uuids.length;
            }

            unchecked {
                ++i;
            }
        }

        return _mergeUUIDs(totalUuids, totalUuidsCount);
    }

    /**
     * @inheritdoc IEAS
     */
    function revoke(RevocationRequest calldata request) public payable virtual {
        RevocationRequestData[] memory requests = new RevocationRequestData[](1);
        requests[0] = request.data;

        _revoke(request.schema, requests, msg.sender, msg.value, true);
    }

    /**
     * @inheritdoc IEAS
     */
    function revokeByDelegation(DelegatedRevocationRequest calldata delegatedRequest) public payable virtual {
        _eip712Verifier.revoke(delegatedRequest);

        RevocationRequestData[] memory data = new RevocationRequestData[](1);
        data[0] = delegatedRequest.data;

        _revoke(delegatedRequest.schema, data, delegatedRequest.revoker, msg.value, true);
    }

    /**
     * @inheritdoc IEAS
     */
    function multiRevoke(MultiRevocationRequest[] calldata multiRequests) external payable {
        uint availableValue = msg.value;

        for (uint256 i = 0; i < multiRequests.length; ) {
            bool last;
            unchecked {
                last = i == multiRequests.length - 1;
            }

            MultiRevocationRequest calldata multiRequest = multiRequests[i];

            availableValue -= _revoke(multiRequest.schema, multiRequest.data, msg.sender, availableValue, last);

            unchecked {
                ++i;
            }
        }
    }

    /**
     * @inheritdoc IEAS
     */
    function multiRevokeByDelegation(
        MultiDelegatedRevocationRequest[] calldata multiDelegatedRequests
    ) external payable {
        uint availableValue = msg.value;

        for (uint256 i = 0; i < multiDelegatedRequests.length; ) {
            bool last;
            unchecked {
                last = i == multiDelegatedRequests.length - 1;
            }

            MultiDelegatedRevocationRequest memory multiDelegatedRequest = multiDelegatedRequests[i];
            RevocationRequestData[] memory data = multiDelegatedRequest.data;

            if (data.length == 0 || data.length != multiDelegatedRequest.signatures.length) {
                revert InvalidLength();
            }

            for (uint256 j = 0; j < data.length; ) {
                _eip712Verifier.revoke(
                    DelegatedRevocationRequest({
                        schema: multiDelegatedRequest.schema,
                        data: data[j],
                        signature: multiDelegatedRequest.signatures[j],
                        revoker: multiDelegatedRequest.revoker
                    })
                );

                unchecked {
                    ++j;
                }
            }

            availableValue -= _revoke(
                multiDelegatedRequest.schema,
                data,
                multiDelegatedRequest.revoker,
                availableValue,
                last
            );

            unchecked {
                ++i;
            }
        }
    }

    /**
     * @inheritdoc IEAS
     */
    function getAttestation(bytes32 uuid) external view returns (Attestation memory) {
        return _db[uuid];
    }

    /**
     * @inheritdoc IEAS
     */
    function isAttestationValid(bytes32 uuid) public view returns (bool) {
        return _db[uuid].uuid != 0;
    }

    /**
     * @dev Attests to a specific schema.
     *
     * @param schema // the unique identifier of the schema to attest to.
     * @param data The arguments of the attestation requests.
     * @param attester The attesting account.
     * @param availableValue The total available ETH amount that can be sent to the resolver.
     * @param last Whether this is the last attestations/revocations set.
     *
     * @return The UUID of the new attestations and the total sent ETH amount.
     */
    function _attest(
        bytes32 schema,
        AttestationRequestData[] memory data,
        address attester,
        uint256 availableValue,
        bool last
    ) private returns (AttestationsResult memory) {
        AttestationsResult memory res;
        res.uuids = new bytes32[](data.length);

        SchemaRecord memory schemaRecord = _schemaRegistry.getSchema(schema);
        if (schemaRecord.uuid == EMPTY_UUID) {
            revert InvalidSchema();
        }

        uint256 length = data.length;
        Attestation[] memory attestations = new Attestation[](length);
        uint256[] memory values = new uint256[](length);

        for (uint256 i = 0; i < length; ) {
            AttestationRequestData memory request = data[i];

            if (request.expirationTime != 0 && request.expirationTime <= _time()) {
                revert InvalidExpirationTime();
            }

            if (!schemaRecord.revocable && request.revocable) {
                revert Irrevocable();
            }

            Attestation memory attestation = Attestation({
                uuid: EMPTY_UUID,
                schema: schema,
                refUUID: request.refUUID,
                time: _time(),
                expirationTime: request.expirationTime,
                revocationTime: 0,
                recipient: request.recipient,
                attester: attester,
                revocable: request.revocable,
                data: request.data
            });

            // Look for the first non-existing UUID (and use a bump seed/nonce in the rare case of a conflict).
            bytes32 uuid;
            uint32 bump = 0;
            while (true) {
                uuid = _getUUID(attestation, bump);
                if (_db[uuid].uuid == EMPTY_UUID) {
                    break;
                }

                unchecked {
                    ++bump;
                }
            }
            attestation.uuid = uuid;

            _db[uuid] = attestation;

            if (request.refUUID != 0) {
                if (!isAttestationValid(request.refUUID)) {
                    revert NotFound();
                }
            }

            attestations[i] = attestation;
            values[i] = request.value;

            res.uuids[i] == uuid;

            emit Attested(request.recipient, attester, uuid, schema);

            unchecked {
                ++i;
            }
        }

        res.usedValue = _resolveAttestations(schemaRecord, attestations, values, false, availableValue, last);

        return res;
    }

    /**
     * @dev Revokes an existing attestation to a specific schema.
     *
     * @param schema The unique identifier of the schema to attest to.
     * @param data The arguments of the revocation requests.
     * @param revoker The revoking account.
     * @param availableValue The total available ETH amount that can be sent to the resolver.
     * @param last Whether this is the last attestations/revocations set.
     *
     * @return Returns the total sent ETH amount.
     */
    function _revoke(
        bytes32 schema,
        RevocationRequestData[] memory data,
        address revoker,
        uint256 availableValue,
        bool last
    ) private returns (uint256) {
        SchemaRecord memory schemaRecord = _schemaRegistry.getSchema(schema);
        if (schemaRecord.uuid == EMPTY_UUID) {
            revert InvalidSchema();
        }

        uint256 length = data.length;
        Attestation[] memory attestations = new Attestation[](length);
        uint256[] memory values = new uint256[](length);

        for (uint256 i = 0; i < length; ) {
            RevocationRequestData memory request = data[i];

            Attestation storage attestation = _db[request.uuid];
            if (attestation.uuid == EMPTY_UUID) {
                revert NotFound();
            }

            if (attestation.attester != revoker) {
                revert AccessDenied();
            }

            // Please note that also checking of the schema itself is revocable is unnecessary, since it's not possible to
            // make revocable attestations to an irrevocable schema.
            if (!attestation.revocable) {
                revert Irrevocable();
            }

            if (attestation.revocationTime != 0) {
                revert AlreadyRevoked();
            }

            attestation.revocationTime = _time();

            attestations[i] = attestation;
            values[i] = request.value;

            emit Revoked(attestation.recipient, revoker, request.uuid, attestation.schema);

            unchecked {
                ++i;
            }
        }

        return _resolveAttestations(schemaRecord, attestations, values, true, availableValue, last);
    }

    /**
     * @dev Resolves a new attestation or a revocation of an existing attestation.
     *
     * @param schemaRecord The schema of the attestation.
     * @param attestation The data of the attestation to make/revoke.
     * @param value An explicit ETH amount to send to the resolver.
     * @param isRevocation Whether to resolve an attestation or its revocation.
     * @param availableValue The total available ETH amount that can be sent to the resolver.
     * @param last Whether this is the last attestations/revocations set.
     *
     * @return Returns the total sent ETH amount.
     */
    function _resolveAttestation(
        SchemaRecord memory schemaRecord,
        Attestation memory attestation,
        uint256 value,
        bool isRevocation,
        uint256 availableValue,
        bool last
    ) private returns (uint256) {
        ISchemaResolver resolver = schemaRecord.resolver;
        if (address(resolver) == address(0)) {
            // Ensure that we don't accept payments if there is no resolver
            if (value != 0) {
                revert NotPayable();
            }

            return 0;
        }

        // Ensure that we don't accept payments which can't be forwarded to the resolver
        if (value != 0 && !resolver.isPayable()) {
            revert NotPayable();
        }

        // Ensure that the attester/revoker doesn't try to spend more than available
        if (value > availableValue) {
            revert InsufficientValue();
        }

        unchecked {
            availableValue -= value;
        }

        if (isRevocation) {
            if (!resolver.revoke{ value: value }(attestation)) {
                revert InvalidRevocation();
            }
        } else if (!resolver.attest{ value: value }(attestation)) {
            revert InvalidAttestation();
        }

        if (last) {
            _refund(availableValue);
        }

        return value;
    }

    /**
     * @dev Resolves multiple attestations or revocations of existing attestations.
     *
     * @param schemaRecord The schema of the attestation.
     * @param attestations The data of the attestations to make/revoke.
     * @param values Explicit ETH amounts to send to the resolver.
     * @param isRevocation Whether to resolve an attestation or its revocation.
     * @param availableValue The total available ETH amount that can be sent to the resolver.
     * @param last Whether this is the last attestations/revocations set.
     *
     * @return Returns the total sent ETH amount.
     */
    function _resolveAttestations(
        SchemaRecord memory schemaRecord,
        Attestation[] memory attestations,
        uint256[] memory values,
        bool isRevocation,
        uint256 availableValue,
        bool last
    ) private returns (uint256) {
        uint256 length = attestations.length;
        if (length == 1) {
            return _resolveAttestation(schemaRecord, attestations[0], values[0], isRevocation, availableValue, last);
        }

        ISchemaResolver resolver = schemaRecord.resolver;
        if (address(resolver) == address(0)) {
            // Ensure that we don't accept payments if there is no resolver
            for (uint256 i = 0; i < length; ) {
                if (values[i] != 0) {
                    revert NotPayable();
                }
            }

            return 0;
        }

        uint256 totalUsedValue = 0;

        for (uint256 i = 0; i < length; ) {
            uint256 value = values[i];

            // Ensure that we don't accept payments which can't be forwarded to the resolver
            if (value != 0 && !resolver.isPayable()) {
                revert NotPayable();
            }

            // Ensure that the attester/revoker doesn't try to spend more than available
            if (value > availableValue) {
                revert InsufficientValue();
            }

            unchecked {
                availableValue -= value;
                totalUsedValue += value;

                ++i;
            }
        }

        if (isRevocation) {
            if (!resolver.multiRevoke{ value: totalUsedValue }(attestations, values)) {
                revert InvalidRevocations();
            }
        } else if (!resolver.multiAttest{ value: totalUsedValue }(attestations, values)) {
            revert InvalidAttestations();
        }

        if (last) {
            _refund(availableValue);
        }

        return totalUsedValue;
    }

    /**
     * @dev Calculates a UUID for a given attestation.
     *
     * @param attestation The input attestation.
     * @param bump A bump value to use in case of a UUID conflict.
     *
     * @return Attestation UUID.
     */
    function _getUUID(Attestation memory attestation, uint32 bump) private pure returns (bytes32) {
        return
            keccak256(
                abi.encodePacked(
                    attestation.schema,
                    attestation.recipient,
                    attestation.attester,
                    attestation.time,
                    attestation.expirationTime,
                    attestation.revocable,
                    attestation.refUUID,
                    attestation.data,
                    bump
                )
            );
    }

    /**
     * @dev Refunds remaining ETH amount to the attester.
     *
     * @param remainingValue The remaining ETH amount that was not sent to the resolver.
     */
    function _refund(uint256 remainingValue) private {
        if (remainingValue > 0) {
            // Using a regular transfer here might revert, for some non-EOA attesters, due to exceeding of the 2300
            // gas limit which is why we're using call instead (via sendValue), which the 2300 gas limit does not
            // apply for.
            payable(msg.sender).sendValue(remainingValue);
        }
    }

    /**
     * @dev Merges lists of UUIDs
     *
     * @param uuidLists The provided lists of UUIDs
     * @param uuidsCount Total UUIDs count
     *
     * @return A merge list of all the UUIDs.
     */
    function _mergeUUIDs(bytes32[][] memory uuidLists, uint256 uuidsCount) private pure returns (bytes32[] memory) {
        bytes32[] memory uuids = new bytes32[](uuidsCount);

        for (uint256 i = 0; i < uuidLists.length; ) {
            bytes32[] memory currentUuids = uuidLists[i];
            for (uint256 j = 0; j < currentUuids.length; ) {
                uuids[i * uuidLists.length + j] = currentUuids[j];

                unchecked {
                    ++j;
                }
            }
            unchecked {
                ++i;
            }
        }

        return uuids;
    }

    /**
     * @dev Returns the current's block timestamp.
     */
    function _time() internal view virtual returns (uint32) {
        return uint32(block.timestamp);
    }
}
