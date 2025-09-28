pragma solidity ^0.8.24;

import {FHE, ebool, euint32, externalEuint32} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

contract PrivateVote is SepoliaConfig {
    error InvalidOptionsCount();
    error AlreadyVoted();
    error BadIndex();
    uint8 private _optionsCount;
    euint32[] private _tallies;
    mapping(address voter => bool voted) public hasVoted;

    constructor(uint8 optionsCount) {
        if (optionsCount == 0 || optionsCount > 16) revert InvalidOptionsCount();
        _optionsCount = optionsCount;
        _tallies = new euint32[](optionsCount);
    }

    function numOptions() external view returns (uint8) {
        return _optionsCount;
    }

    function getTally(uint8 index) external view returns (euint32) {
        if (!(index < _optionsCount)) revert BadIndex();
        return _tallies[index];
    }

    function vote(externalEuint32 inputChoice, bytes calldata inputProof) external {
        if (hasVoted[msg.sender]) revert AlreadyVoted();

        euint32 choice = FHE.fromExternal(inputChoice, inputProof);

        euint32 one = FHE.asEuint32(1);
        euint32 zero = FHE.asEuint32(0);

        for (uint8 i = 0; i < _optionsCount; ++i) {
            ebool isEq = FHE.eq(choice, FHE.asEuint32(i));
            euint32 addend = FHE.select(isEq, one, zero);
            _tallies[i] = FHE.add(_tallies[i], addend);

            FHE.allowThis(_tallies[i]);
            FHE.allow(_tallies[i], msg.sender);
        }

        hasVoted[msg.sender] = true;
    }

    function allowAllTo(address reader) external {
        for (uint8 i = 0; i < _optionsCount; ++i) {
            FHE.allow(_tallies[i], reader);
        }
    }
}
