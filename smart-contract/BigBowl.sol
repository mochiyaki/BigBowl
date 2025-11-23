// SPDX-License-Identifier: MIT

pragma solidity ^0.8.30;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract BOWL is ERC721 {
    address private _owner;
    uint public totalSupply;
    bool public isClosed;
    uint public moFee;

    struct Mochi {
        uint moId;
        string name;
        string image;
        string agent;
    }

    mapping(uint => Mo) mos;

    modifier ownerOnly() {
        require(msg.sender == _owner);
        _;
    }

    constructor() ERC721("bigbowl", "agent")
    {
        _owner = msg.sender;
    }

    function changeOwner(address newOwner) public ownerOnly {
        _owner = newOwner;
    }

    function owner() public view returns(address) {
        return _owner;
    }

    function setMoFee(uint _cost) public ownerOnly {
        moFee = _cost;
    }

    function redeem(address _to, uint _amount) public ownerOnly {
        (bool success, ) = _to.call{value: _amount}("");
        require(success);
    }

    function closeShop(bool _close) public ownerOnly {
        isClosed = _close;
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function getMo(uint _id) public view returns (Mo memory) {
        return mos[_id];
    }

    function modifyMo(uint _id, string memory _name, string memory _image, string memory _agent) public payable {
        require(ERC721.ownerOf(_id) == msg.sender);
        require(msg.value >= moFee);
        mos[_id].name = _name;
        mos[_id].image = _image;
        mos[_id].agent = _agent;
    }

    function mint(string memory _name, string memory _image, string memory _agent) public payable {
        require(!isClosed);
        require(msg.value >= moFee);
        totalSupply++;
        mos[totalSupply] = Mo(totalSupply, _name, _image, _agent);
        _safeMint(msg.sender, totalSupply);
    }

    function tokenURI(uint _id) override(ERC721) public view returns (string memory) {
        string memory json = Base64.encode(
            bytes(string(
                abi.encodePacked(
                    '{'
                    '"name": "', mos[_id].name, '",',
                    '"image": "', mos[_id].image, '"',
                    '"agent": "', mos[_id].agent, '"',
                    '}'
                )
            ))
        );
        return string(abi.encodePacked('data:application/json;base64,', json));
    }
}
