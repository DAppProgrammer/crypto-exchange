pragma solidity ^0.5.1;
import 'openzeppelin-solidity/contracts/math/SafeMath.sol';
import './Token.sol';

//ToDo List
//To Do:
//[X] Set the fee
//[X] Deposit Ether
//[X] Deposit Token
//[] Check Balances
//[ ] Withdraw Ether
//[ ] Withdraw Token
//[ ] Make Order
//[ ] Fill Order
//[ ] Cancel Order
//[ ] Charge Fees

contract Exchange {
    using SafeMath for uint;

    //Variables
    address public feeAccount; //the account that receives exchange fee
    uint public feePercent; //the fee percent
    address constant ETHER = address(0); //store ether in tokens mapping with blank address
    mapping(address => mapping(address => uint)) public tokens;

    //Events
    event Deposit(address _token, address _user, uint _amount, uint _balance);

    constructor(address _feeAccount, uint _feePercent) public {
        feeAccount = _feeAccount;
        feePercent =_feePercent;
    }


    //Fallback: reverts if Etierh is sent directly to this smart contract by mistake
    function() external {
        revert();
    }

    function depositEther() public payable {
        tokens[ETHER][msg.sender] = tokens[ETHER][msg.sender].add(msg.value);
        emit Deposit(ETHER, msg.sender, msg.value, tokens[ETHER][msg.sender]);
    }

    function depositToken(address _token, uint _amount) public {
        require(_token != ETHER);
        require(Token(_token).transferFrom(msg.sender, address(this), _amount));
        tokens[_token][msg.sender] = tokens[_token][msg.sender].add(_amount);

        //Emit event
        emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);
    }

}



