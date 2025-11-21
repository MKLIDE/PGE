// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract GrowthOwnership {
    struct GoalRecord {
        string goal;
        address owner;
        uint256 timestamp;
    }

    GoalRecord[] public records;

    event GoalAdded(address indexed owner, string goal, uint256 timestamp);

    function addGoal(string memory goal) public {
        records.push(GoalRecord(goal, msg.sender, block.timestamp));
        emit GoalAdded(msg.sender, goal, block.timestamp);
    }

    function getAllGoals() public view returns (GoalRecord[] memory) {
        return records;
    }
}
