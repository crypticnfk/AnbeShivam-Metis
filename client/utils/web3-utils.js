import Web3 from "web3";
import AnbeShivamNFT from "../abis/AnbeShivamNFT.json";
import AnbeShivamMain from "../abis/AnbeShivamMain.json";
import AnbeShivamInvestorToken from  "../abis/AnbeShivamInvestorToken.json";

let web3, AnbeShivam, ASNFT, GODSToken;

export const loadWeb3 = async () => {
  try {
    if (window.ethereum) {
      web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.enable();
        return true;
      } catch (err) {
        console.log('Transaction rejected by user:', err);
        return false;
      };
    } else if (window.web3) {
        web3 = new Web3(window.web3.currentProvider);
        return true;
    } else {
        window.alert('Wallet not connected. Please install the Metamask plugin');
        return false;
    };
  } catch (err) {
    console.log('Error: ', err);
    return false;
  };
};

export const connectAccount = async () => {
  if (typeof window.ethereum !== 'undefined') {
      window.ethereum.request({ method: 'eth_requestAccounts' });
  } else {
      window.alert("Please install the Metamask plugin");
  }
};

export const loadBlockchainData = async() => {
  const networkId = await web3.eth.net.getId();
  
  const asMainData = AnbeShivamMain.networks[networkId];
  const asNFTData = AnbeShivamNFT.networks[networkId];
  const asGODSData = AnbeShivamInvestorToken.networks[networkId];

  if(asMainData && asNFTData && asGODSData) {
    AnbeShivam = new web3.eth.Contract(AnbeShivamMain.abi, asMainData.address);
    ASNFT = new web3.eth.Contract(AnbeShivamNFT.abi, asNFTData.address);
    GODSToken = new web3.eth.Contract(AnbeShivamInvestorToken.abi, asGODSData.address);
    return true;
  } else {
    window.alert("Unidentified network, please connect to Alfajores Testnet");
    return false;
  }
};

export const getAccountAddress = async() => {
  window.ethereum.on('accountsChanged', function (accounts) {
    window.location.reload();
  });
  const accounts = await window.ethereum.request({ method: 'eth_accounts' });
  return accounts[0];
};

export const getNetwork = async() => {
  window.ethereum.on('chainChanged', () => {
    window.location.reload()
  })
  const networkId = await web3.eth.net.getId();  
  if(networkId == 42220) {
    return "Celo";
  } else if(networkId == 44787) {
    return "Alfajores";
  } 

  return "Unidentified Network";
};

export const getGODSBalance = async() => {
  const account = await getAccountAddress();
  const result = await GODSToken.methods.balanceOf(account).call();
  const balance = web3.utils.fromWei(result);
  return balance;
};

export const getNFTBalance = async() => {
  const account = await getAccountAddress();
  const balance = await ASNFT.methods.balanceOf(account).call();
  return balance;
};

export const getTokenURI = async(tokenId) => {
  const uri = await ASNFT.methods.tokenURI(tokenId).call();
  return uri;
};

export const getProjects = async() => {
  let projects = [];
  const pCount = await AnbeShivam.methods.returnContentCount().call();
  for(var i = 0; i < pCount; ++i) {
    const project = await AnbeShivam.methods.contents(i).call();
    if(project.isListed) {
      projects.push(project);
    }
  }
  return projects;
}

export const addContent = async(projectName, fileURL) => {
  const account = await getAccountAddress();
  await AnbeShivam.methods
    .addContent(projectName, fileURL)
    .send({
      from: account,
      value: web3.utils.toWei("2", "ether")
    })
    .on("transactionHash", function (hash) {})
    .on("receipt", function (receipt) {})
    .on("confirmation", (confirmationNumber, receipt) => {
      window.location.href = "/projects";
    })
    .on("error", (error, receipt) => {
      window.alert("Error occured: ", error);
    });
};

export const investFunds = async(contentId, metadata, amount) => {
  const account = await getAccountAddress();
  await AnbeShivam.methods
    .investFunds(contentId, metadata)
    .send({
      from: account,
      value: web3.utils.toWei(amount.toString())
    })
    .on("transactionHash", function (hash) {})
    .on("receipt", function (receipt) {})
    .on("confirmation", (confirmationNumber, receipt) => {
      window.location.href = "/nfts";
    })
    .on("error", (error, receipt) => {
      window.alert("Error occured while accessing content");
    });
};

export const getNFTs = async() => {
  const account = await getAccountAddress();
  const nftCount = await ASNFT.methods.returnNFTCount().call();
  let nfts = [];
  for(var i = 0; i < nftCount; ++i) {
    const nft = await ASNFT.methods.badges(i).call();
    if(nft.owner.toUpperCase() == account.toUpperCase()) {
      nfts.push(nft);
    }
  }
  return nfts;
}

export const getFundingPools = async () => {
  const cPool = await AnbeShivam.methods.fundingPool().call();
  const mPool = await AnbeShivam.methods.matchingPool().call();
  return [web3.utils.fromWei(cPool), web3.utils.fromWei(mPool)];
}

export const withdrawFunds = async (contentId) => {
  const account = await getAccountAddress();
  await AnbeShivam.methods
    .withdrawFunds(contentId)
    .send({ from: account })
    .on("transactionHash", function (hash) {})
    .on("receipt", function (receipt) {})
    .on("confirmation", (confirmationNumber, receipt) => {
      window.alert("Successfully withdrew Funds");
    })
    .on("error", (error, receipt) => {
      window.alert("Error occured: ", error);
    });
}