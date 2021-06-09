import { web3Loaded } from "./actions";
import Web3 from 'web3';

export const loadWeb3 = (dispatch) => {
    const web3 = new Web3(window.ethereum);
    dispatch(web3Loaded(web3))
    return web3;
}