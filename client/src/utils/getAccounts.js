import Web3Singleton from "./getWeb3";

const getAccounts = async () => {
  try {
    // Get network provider and web3 instance.
    const web3 = await Web3Singleton.getInstance();

    // Use web3 to get the user's accounts.
    const accounts = await web3.eth.getAccounts();

    return accounts;
  } catch (error) {
    // Catch any errors for any of the above operations.
    alert(`Failed to load web3 or accounts. Check console for details.`);
    console.error(error);
  }
};

export default getAccounts;
