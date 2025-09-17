// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, ebool, euint32, euint32, euint8, externalEuint32} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title PrivateVote - simple encrypted single-choice voting
/// @notice Stores vote tallies as encrypted values; each voter can vote once by
///         submitting an encrypted choice. Tallies can be revealed client-side
///         by authorized readers using the Hardhat FHEVM plugin.
contract PrivateVote is SepoliaConfig {
    uint8 private _optionsCount;
    euint32[] private _tallies;
    mapping(address => bool) public hasVoted;

    /// @param optionsCount Number of choices (small for demo, e.g., 2-5)
    constructor(uint8 optionsCount) {
        require(optionsCount > 0 && optionsCount <= 16, "PrivateVote: invalid optionsCount");
        _optionsCount = optionsCount;
        _tallies = new euint32[](optionsCount);
    }

    /// @notice Number of available options
    function numOptions() external view returns (uint8) {
        return _optionsCount;
    }

    /// @notice Returns the encrypted tally for a given option index
    /// @dev Returns bytes32(0) when uninitialized
    function getTally(uint8 index) external view returns (euint32) {
        require(index < _optionsCount, "PrivateVote: bad index");
        return _tallies[index];
    }

    /// @notice Cast a vote for one option using an encrypted choice (euint32)
    /// @param inputChoice Encrypted integer equal to the chosen index
    /// @param inputProof Input verification proof bound to msg.sender and this contract
    function vote(externalEuint32 inputChoice, bytes calldata inputProof) external {
        require(!hasVoted[msg.sender], "PrivateVote: already voted");

        // Convert external encrypted input to an in-contract encrypted value
        euint32 choice = FHE.fromExternal(inputChoice, inputProof);

        euint32 one = FHE.asEuint32(1);
        euint32 zero = FHE.asEuint32(0);

        // For each option i, add 1 if (choice == i) else add 0
        for (uint8 i = 0; i < _optionsCount; i++) {
            ebool isEq = FHE.eq(choice, FHE.asEuint32(i));
            euint32 addend = FHE.select(isEq, one, zero);
            _tallies[i] = FHE.add(_tallies[i], addend);

            // Maintain access: contract itself and voter can later read this tally
            FHE.allowThis(_tallies[i]);
            FHE.allow(_tallies[i], msg.sender);
        }

        hasVoted[msg.sender] = true;
    }

    /// @notice Grant read access for all tallies to a given address
    /// @dev Useful for an aggregator/frontend account to decrypt tallies off-chain
    function allowAllTo(address reader) external {
        for (uint8 i = 0; i < _optionsCount; i++) {
            FHE.allow(_tallies[i], reader);
        }
    }
}
