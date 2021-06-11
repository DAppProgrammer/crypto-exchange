import React, { useEffect, useState }  from 'react';
import { useSelector, useDispatch } from "react-redux";
import './App.css';
// import Web3 from 'web3';
// import Token from "../abis/Token.json";
import { loadWeb3, loadAccounts } from "../store/reducers";


// const useConstructor = (callBack = () => {}) => {
//   const [hasBeenCalled, setHasBeenCalled] = useState(false);
//   if (hasBeenCalled) return;
//   callBack();
//   setHasBeenCalled(true);
// }

const App =() =>  {

  
  const dispatch = useDispatch();
  const web3 = useSelector((state) => state.web3);
  const accounts = useSelector((state) => state.accounts);
  const networkId = useSelector((state) => state.networkId);
  const token = useSelector((state) => state.token);
  const totalSupply = useSelector((state) => state.totalSupply);

  // useConstructor(() => {
  //   dispatch(loadWeb);
  //   console.log(
  //     "This only happens ONCE and it happens BEFORE the initial render.",web3,accounts
  //   );
  // });

  useEffect(() => {
    dispatch(loadWeb3);
    dispatch(loadAccounts);
    
  }, [dispatch]);



  //const loadBlockchainData = () => {
    // // const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');
    // const web3 = new Web3(window.ethereum)
    // // const network = await web3.eth.net.getNetworkType();
    // // const networks = Token.networks;
    // const accounts = await web3.eth.getAccounts();
    // const networkId = await web3.eth.net.getId();
    // const token = new web3.eth.Contract(Token.abi,Token.networks[networkId].address);
    // const totalSupply = await token.methods.totalSupply().call();
    // console.log(totalSupply);
  //}

    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <a className="navbar-brand" href="/#">Navbar</a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link" href="/#">Link1</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/#">Link2</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/#">Link 3</a>
              </li>
            </ul>
          </div>
        </nav>
        <div className="content">
          <div className="vertical-split">
            <div className="card bg-dark text-white">
              <div className="card-header">
                Card Title
              </div>
              <div className="card-body">
                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                <a href="/#" className="card-link">Card link</a>
              </div>
            </div>
            <div className="card bg-dark text-white">
              <div className="card-header">
                Card Title
              </div>
              <div className="card-body">
                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                <a href="/#" className="card-link">Card link</a>
              </div>
            </div>
          </div>
          <div className="vertical">
            <div className="card bg-dark text-white">
              <div className="card-header">
                Card Title
              </div>
              <div className="card-body">
                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                <a href="/#" className="card-link">Card link</a>
              </div>
            </div>
          </div>
          <div className="vertical-split">
            <div className="card bg-dark text-white">
              <div className="card-header">
                Card Title
              </div>
              <div className="card-body">
                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                <a href="/#" className="card-link">Card link</a>
              </div>
            </div>
            <div className="card bg-dark text-white">
              <div className="card-header">
                Card Title
              </div>
              <div className="card-body">
                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                <a href="/#" className="card-link">Card link</a>
              </div>
            </div>
          </div>
          <div className="vertical">
            <div className="card bg-dark text-white">
              <div className="card-header">
                Card Title
              </div>
              <div className="card-body">
                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                <a href="/#" className="card-link">Card link</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}

export default App;
