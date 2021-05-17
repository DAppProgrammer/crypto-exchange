pragma solidity ^0.5.1;

contract Token {
    string public name = 'Leo Token';
    string public symbol = 'LEO';
    uint public decimals = 18;
    uint public totalSupply = 10;

    constructor() public {
        totalSupply = 1000000 * (10 ** decimals);
    }
}