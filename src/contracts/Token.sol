pragma solidity ^0.5.1;
import 'openzeppelin-solidity/contracts/math/SafeMath.sol';
contract Token {
    using SafeMath for uint;

    //Variables
    string public name = 'Leo Token';
    string public symbol = 'LEO';
    uint public decimals = 18;
    uint public totalSupply;
    mapping(address => uint) public balanceOf;

    //Events
    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    constructor() public {
        totalSupply = 1000000 * (10 ** decimals);
        balanceOf[msg.sender] = totalSupply;
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(_to != address(0));
        require(balanceOf[msg.sender] >= _value);
        balanceOf[msg.sender] = balanceOf[msg.sender].sub(_value);
        balanceOf[_to] = balanceOf[_to].add(_value);
        emit Transfer(msg.sender, _to, _value);
        return true;
    }
    
}