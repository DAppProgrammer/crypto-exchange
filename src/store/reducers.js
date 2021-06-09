import { combineReducers } from "redux";
import Web3 from 'web3';

const initialState = {};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case "WEB3_LOADED":
      const web3 = new Web3(window.ethereum);
      return { ...state, web3 };
    default:
      return state;
  }
};

// const rootReducer = combineReducers({
//   web3Reducer,
// });

export default rootReducer;