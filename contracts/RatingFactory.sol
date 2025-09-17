// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {RatingItem} from "./RatingItem.sol";

contract RatingFactory {
    struct ItemMeta {
        address item;
        address creator;
        uint8 min;
        uint8 max;
        string name;
        string description;
    }
    ItemMeta[] private _items;

    event ItemCreated(uint256 indexed id, address indexed item, address indexed creator, string name);

    function createItem(
        string memory name,
        string memory description,
        uint8 minScore,
        uint8 maxScore
    ) external returns (address item, uint256 id) {
        RatingItem r = new RatingItem(name, description, minScore, maxScore);
        item = address(r);
        id = _items.length;
        _items.push(
            ItemMeta({
                item: item,
                creator: msg.sender,
                min: minScore,
                max: maxScore,
                name: name,
                description: description
            })
        );
        emit ItemCreated(id, item, msg.sender, name);
    }

    function getItemsCount() external view returns (uint256) {
        return _items.length;
    }

    function getItem(
        uint256 id
    )
        external
        view
        returns (address item, address creator, uint8 min, uint8 max, string memory name, string memory description)
    {
        ItemMeta storage m = _items[id];
        return (m.item, m.creator, m.min, m.max, m.name, m.description);
    }
}
