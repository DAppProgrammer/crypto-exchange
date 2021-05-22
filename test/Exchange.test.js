import { tokens, ether, EVM_REVERT, ETHER_ADDRESS } from './helpers';


const Token = artifacts.require('./Token');
const Exchange = artifacts.require('./Exchange');

require('chai')
    .use(require('chai-as-promised'))
    .should();

contract("Exchange", ([deployer, feeAccount, user1]) => {
  let token;
  let exchange;
  const feePercent = 10;

  beforeEach(async () => {
    //Deploy token
    token = await Token.new();

    //Transfer some token to user1
    await token.transfer(user1, tokens(100), {from: deployer});

    //Deploy exchange
    exchange = await Exchange.new(feeAccount,feePercent);

  });

  describe("deployment", () => {
    let result;

    it("tracks the fee account", async () => {
      result = await exchange.feeAccount();
      result.should.equal(feeAccount);
    });

    it('tracks the exchange fee', async() => {
      result = await exchange.feePercent();
      result.toString().should.equal(feePercent.toString());
    })
  });

  describe('fallback',()=>{
    it('reverts when ether is sent directly to exchange token address', async()=> {
      await exchange
        .sendTransaction({ value: 1, from: user1 })
        .should.be.rejectedWith(EVM_REVERT);
    })
  })

  describe('deposting ether', () =>{
    let result;
    let amount = ether(1);
    beforeEach(async()=>{
      result = await exchange.depositEther({from: user1, value: amount })
    });

    it('tracks the ether deposit', async() =>{
      const balance = await exchange.tokens(ETHER_ADDRESS,user1);
      balance.toString().should.equal(amount.toString());
    })


    it("emits a Deposit event", async () => {
      const log = result.logs[0];
      log.event.should.equal("Deposit");
      const event = log.args;
      event._token
        .toString()
        .should.equal(ETHER_ADDRESS, "ether address is correct");
      event._user.toString().should.equal(user1, "user is correct");
      event._amount
        .toString()
        .should.equal(amount.toString(), "value is correct");
      event._balance
        .toString()
        .should.equal(amount.toString(), "value is correct");
    });

  });

 describe("depositing tokens", () => {
  let result;
  const amount = tokens(10);


   describe("success", async () => {
     beforeEach(async () => {
       await token.approve(exchange.address, amount, { from: user1 });
       result = await exchange.depositToken(token.address, amount, {
         from: user1,
       });
     });

     it("tracks the token deposit", async () => {
       //Check token balance on Token contract
       result = await token.balanceOf(exchange.address);
       result.toString().should.equal(amount.toString());

       //Check token balance on exchnage contract
       result = await exchange.tokens(token.address, user1);
       result.toString().should.equal(amount.toString());
     });

     it("emits a Deposit event", async () => {
       const log = result.logs[0];
       log.event.should.equal("Deposit");
       const event = log.args;
       event._token
         .toString()
         .should.equal(token.address, "token address is correct");
       event._user.toString().should.equal(user1, "user is correct");
       event._amount
         .toString()
         .should.equal(amount.toString(), "value is correct");
       event._balance
         .toString()
         .should.equal(amount.toString(), "value is correct");
     });
   });

   describe("failure", async() => {
     it('rejects ether deposit', async()=>{
       await exchange.depositToken(ETHER_ADDRESS,tokens(10),{from: user1}).should.be.rejectedWith(EVM_REVERT);
     })

     it('fails when no tokens are approved', async()=>{
       //Don't approve any tokens before depositing
       await exchange.depositToken(token.address,tokens(10),{from:user1}).should.be.rejectedWith(EVM_REVERT);
     })

  });

   
  });

});