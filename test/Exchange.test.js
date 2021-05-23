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
      result = await exchange.depositEther({ from: user1, value: amount });
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

  describe('withdrawing ether',() =>{
    let result;
    let amount = ether(1);
    beforeEach(async()=>{
      //deposit ether first
      await exchange.depositEther({from: user1, value: amount});
    })

    describe('success',()=>{
      beforeEach(async()=>{
        //withdraw ether 
        result = await exchange.withdrawEther( amount, {from: user1});
      });
      it('withdraws ether funds',async()=>{
        const balance = await exchange.tokens(ETHER_ADDRESS,user1);
        balance.toString().should.equal('0');
      })

      it("emits a Withdraw event", async () => {
        const log = result.logs[0];
        log.event.should.equal("Withdraw");
        const event = log.args;
        event._token
          .toString()
          .should.equal(ETHER_ADDRESS, "token address is correct");
        event._user.toString().should.equal(user1, "user is correct");
        event._amount
          .toString()
          .should.equal(amount.toString(), "value is correct");
        event._balance
          .toString()
          .should.equal('0', "value is correct");
      });
    })

    describe('failure',()=>{
      it('rejects withdraws for insufficient balances',async()=>{
        await exchange.withdrawEther(ether(100,{from: user1})).should.be.rejectedWith(EVM_REVERT);
      })
    })

  })

  describe('withdrawing tokens',()=>{
    let result;
    let amount;

    describe('success',()=>{
      
      beforeEach(async()=>{
        //Deposit tokens first
        amount = tokens(10);
        await token.approve(exchange.address,amount,{from:user1});
        await exchange.depositToken(token.address, amount, { from: user1 });

        //Withdraw tokens
        result = await exchange.withdrawToken(token.address, amount, {
          from: user1,
        });
      })

      it('withdraws token funts', async()=>{
        const balance = await exchange.tokens(token.address, user1);
        balance.toString().should.equal("0");
      })

      
      it("emits a Withdraw event", async () => {
        const log = result.logs[0];
        log.event.should.equal("Withdraw");
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
          .should.equal('0', "value is correct");
      });
    })

    describe('failure',()=>{
      it('rejects ether withdraw',async()=>{
        await exchange
          .withdrawToken(ETHER_ADDRESS, tokens(10), { from: user1 })
          .should.be.rejectedWith(EVM_REVERT);
      })
      it('rejects for insufficient balance',async()=>{
        await exchange
          .withdrawToken(token.address, tokens(10), {
            from: user1,
          })
          .should.be.rejectedWith(EVM_REVERT);
      })
    })

    describe('checking balances',()=>{
      beforeEach(async()=>{
        exchange.depositEther({ from: user1, value: ether(1) });
      })

      it('returns user balance', async()=>{
        const result = await exchange.balanceOf(ETHER_ADDRESS, user1);
        result.toString().should.equal(ether(1).toString());
      })
    })
    
  })

  // describe('tracking balances after deposit',()=>{
  //   let ganacheEthBalanceBefore;
  //   let ganacheEthBalanceAfter;
  //   let exchangeEthBalanceBefore;
  //   let exchangeEthBalanceAfter;
  //   it('tracks ganache eth balance',async()=>{
  //     ganacheEthBalanceBefore = await web3.eth.getBalance(user1);
  //     console.log(ganacheEthBalanceBefore);
  //     await exchange.depositEther({from: user1, value: ether(5)});
  //     let gasPrice = await web3.eth.getGasPrice();

  //     ganacheEthBalanceAfter = await web3.eth.getBalance(user1) ;
  //     console.log(ganacheEthBalanceAfter);
  //     console.log(gasPrice);
  //     console.log(ganacheEthBalanceBefore-ether(5)-gasPrice);
  //   })
  //   it('tracks exchange eth balance',async()=>{
  //     exchangeEthBalanceBefore = await exchange.tokens(ETHER_ADDRESS,user1);
  //     await exchange.depositEther({from: user1, value: ether(5)});
  //     exchangeEthBalanceAfter = await exchange.tokens(ETHER_ADDRESS,user1);
  //     console.log(exchangeEthBalanceBefore.toString());
  //     console.log(ganacheEthBalanceAfter.toString());
  //   })
  // })

});