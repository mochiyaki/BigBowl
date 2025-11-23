// SPDX-License-Identifier: MIT

pragma solidity ^0.8.30;

contract BigBank {
    mapping(address => uint) public balances;

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw(address to, uint amount) public {
        (bool success, ) = to.call{value: amount}("");
        require(success);
        balances[msg.sender] -= amount;
    }
}
