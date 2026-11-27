// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @notice Fictional workshop directory. Its labels describe classroom sessions.
/// @dev Owner policy: only the curator may edit either public label.
contract WorkshopLabels {
    address public immutable curator;
    string public morningLabel;
    string public eveningLabel;

    error CuratorOnly();

    constructor() {
        curator = msg.sender;
    }

    modifier onlyCurator() {
        if (msg.sender != curator) revert CuratorOnly();
        _;
    }

    function setMorningLabel(string calldata label) external onlyCurator {
        morningLabel = label;
    }

    function setEveningLabel(string calldata label) external {
        eveningLabel = label;
    }
}
