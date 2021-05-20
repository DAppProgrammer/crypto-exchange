import { tokens, EVM_REVERT } from './helpers';

const Token = artifacts.require('./Token');

require('chai')
    .use(require('chai-as-promised'))
    .should();

   

contract("Token", ([deployer, receiver]) => {
  let token;
  const name = "Leo Token";
  const symbol = "LEO";
  const decimals = "18";
  const totalSupply = tokens(1000000).toString();

  beforeEach(async () => {
    token = await Token.new();
  });

  describe("deployment", () => {
    it("tracks the name", async () => {
      const result = await token.name();
      result.should.equal(name);
    });
    it("tracks the symbol", async () => {
      const result = await token.symbol();
      result.should.equal(symbol);
    });
    it("tracks the decimals", async () => {
      const result = await token.decimals();
      result.toString().should.equal(decimals.toString());
    });
    it("tracks the total supply", async () => {
      const result = await token.totalSupply();
      result.toString().should.equal(totalSupply);
    });
    it("assigns the total supply to deployer", async () => {
      const result = await token.balanceOf(deployer);
      result.toString().should.equal(totalSupply);
    });
  });

  describe("sending tokens", () => {
    let result;
    let amount = tokens(100);

    describe("success", async () => {
      beforeEach(async () => {
        result = await token.transfer(receiver, amount, { from: deployer });
      });

      it("transfers token balances", async () => {
        let balanceOf;
        balanceOf = await token.balanceOf(deployer);
        balanceOf.toString().should.equal(tokens(999900).toString());
        balanceOf = await token.balanceOf(receiver);
        balanceOf.toString().should.equal(tokens(100).toString());
      });

      it("emits a transfer event", async () => {
        const log = result.logs[0];
        log.event.should.equal("Transfer");
        const event = log.args;
        event._from.toString().should.equal(deployer, "from is correct");
        event._to.toString().should.equal(receiver, "to is correct");
        event._value
          .toString()
          .should.equal(amount.toString(), "value is correct");
      });
    });

    describe("failure", async () => {
      it("rejects insufficient balances", async () => {
        let invalidAmount;
        invalidAmount = tokens(10000000);
        await token
          .transfer(receiver, invalidAmount, { from: deployer })
          .should.be.rejectedWith(EVM_REVERT);

        //Attempts tranfer tokens, when you have none
        invalidAmount = tokens(10);  
        await token
          .transfer(deployer, invalidAmount, { from: receiver })
          .should.be.rejectedWith(EVM_REVERT);
      });

      it('rejects invalid receipients', async() => {
        await token
        .transfer(0x0, amount, { from: deployer })
        .should.be.rejected;
      })
    });
  });
});