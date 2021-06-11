import { combineReducers } from "redux";
import Web3 from 'web3';
import Token from "../abis/Token.json";

const initialState = {};

const web3Reducer = (state = initialState, action) => {

    
  
  switch (action.type) {
    case "WEB3_LOADED":
      
      return {
        ...state,
        web3: action.payload.web3
      };
      case "ACCOUNTS_LOADED":
      
        return {
          ...state,
          accounts: action.payload.accounts,
          // networkId: action.payload.networkId,
          // token: action.payload.token,
          // totalSupply: action.payload.totalSupply,
        };
      default:
      return state;
  }
};

const rootReducer = combineReducers({
  web3Reducer,
});

export default rootReducer;

export function loadWeb3(dispatch) {
  const web3 = new Web3(window.ethereum);
  dispatch({ type: 'WEB3_LOADED',payload:{web3}})
}

export async function loadAccounts(dispatch) {
  
   //const accounts = await web3.eth.getAccounts();
  // const networkId = await web3.eth.net.getId();
  // const token = new web3.eth.Contract(Token.abi,Token.networks[networkId].address);
  // const totalSupply = await token.methods.totalSupply().call();
  //  dispatch({ type: 'ACCOUNTS_LOADED', payload: {accounts, networkId, token, totalSupply}})
   //dispatch({ type: 'ACCOUNTS_LOADED',payload:{accounts}})
}