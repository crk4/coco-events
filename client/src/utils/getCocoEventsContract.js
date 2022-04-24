import Web3Singleton from "./getWeb3";
import COCOEvents from "../contracts/COCOEvents.json";

const getCocoEventsContractInstance = async () => {
  // Get network provider and web3 instance.
  const web3 = await Web3Singleton.getInstance();

  // Get the contract instance.
  const networkId = await web3.eth.net.getId();
  const deployedNetwork = COCOEvents.networks[networkId];
  const instance = new web3.eth.Contract(
    COCOEvents.abi,
    deployedNetwork && deployedNetwork.address
  );

  return instance;
};

export default getCocoEventsContractInstance;
