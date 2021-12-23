import { 
  useEffect, 
  useState, 
  useContext 
} from 'react';
import { Context } from '../context/state';
import { 
  loadWeb3, 
  loadBlockchainData,
  getFundingPools
} from '../utils/web3-utils';
import { AtomSpinner } from 'react-epic-spinners';
import styles from '../styles/Home.module.css';
import { Card } from 'react-bootstrap';

function Home() {
  const [web3, setWeb3] = useContext(Context); 

  useEffect(async() => {
    if(web3) {
      setLoading(true);
      await loadWeb3();
      const isConnected = await loadBlockchainData();
      setConnected(isConnected);
      if(isConnected) {
        const pools = await getFundingPools();
        setFundingPool(pools[0]);
        setMatchingPool(pools[1]);
        setLoading(false);
      }
    }
  },[web3]);

  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fundingPool, setFundingPool] = useState(0);
  const [matchingPool, setMatchingPool] = useState(0);

  const checkUser = async() => {
    if(!connected) {
      window.alert("Please connect your wallet first and use Metis Stardust TestNetwork");
    } else {
      window.alert("Welcome to AnbeShivam");
      window.location.href = "/projects";
    }
  }

  if (loading) {
    return (
      <div className="spinner">
        <AtomSpinner color="lightblue" size="150"/>
      </div>
    );
  } else {
    return (
      
      <div className={styles.main}>
        <div className="w3-container w3-blue w3-center" style={{ padding: '128px 16px' }}>
          <h1 className="w3-margin w3-jumbo">AnbeShivam</h1>
          <p className="w3-xlarge">Project Funding, Simplified and Decentralized</p>
          <button className="w3-button w3-black w3-padding-large w3-large w3-margin-top" onClick={checkUser}>Enter App</button>
        </div>
        {/* First Grid */}
        <div className="w3-row-padding w3-padding-64 w3-container">
          <div className="w3-content">
            <div className="w3-twothird">
            <Card
              bg="warning"
              text="white"
              style={{ width: '18rem' }}
              className="mb-2"
            ><center>
              <Card.Header><p style={{fontSize:30}}>Voting Pool</p></Card.Header>
              <Card.Body>
                <Card.Title><p style={{fontSize:30}}>{parseFloat(fundingPool).toFixed(2)} METIS</p></Card.Title>
                <Card.Text>
                  Total Funds received from community voters projects in voting rounds
                </Card.Text>
              </Card.Body>
              </center>
            </Card>
              <br/>
              <h1>Overview</h1>
              <h5 className="w3-padding-32">AnbeShivam works as a decentralized and completely transparent quadratic funding platform to manage grants programs using Smart Contracts</h5>  
              <p className="w3-text-grey">Any user can seek funds for their project by listing it on the AnbeShivam Platform.
              To add a project, the user must upload a pitch and stake a small amount of 2 METIS. This is to avoid spam projects. 
              The community can then vote for projects, where a single vote costs a minimum amount (1 METIS). Voters are also eligible to 
              receive $GODS tokens in return, equivalent to the amount they've invested in the projects on the AnbeShivam platform. 
              The funds garnered in this way will be sent to the project creator, who can withdraw the amount and the project from the 
              voting round at any point of time. Their stake is also returned when the project is withdrawn.
              <br/>
              <img src='https://finematics.com/wp-content/uploads/2020/12/matching-pool-1024x507.png' alt="AnbeShivam flow" width="600" height="350" />
              <br/>
              The Matching Pool consists of funds donated by grants programs and sponsors. Each project listed on the platform will be 
              matched an amount from this pool, using a Quadratic Funding Algorithm. This is done to democratize the funding process, where
              the number of voters will play a bigger role than the the funds received in determining the matched funds.
               <br/> 
              </p>
            </div>
            <div className="w3-third w3-center">
            <Card
              bg="success"
              text="white"
              style={{ width: '18rem' }}
              className="mb-2"
            >
              <Card.Header><p style={{fontSize:30}}>Grant Pool</p></Card.Header>
              <Card.Body>
                <Card.Title><p style={{fontSize:30}}>{parseFloat(matchingPool).toFixed(2)} METIS</p></Card.Title>
                <Card.Text>
                  Total Grants pool for projects
                </Card.Text>
              </Card.Body>
            </Card>
              <i className="fa fa-anchor w3-padding-64 w3-text-red" />
            </div>
          </div>
        </div>
        {/* Second Grid */}
        <div className="w3-row-padding w3-light-grey w3-padding-64">
          <div className="w3-content">
            <div className="w3-third w3-center">
              <i className="fa fa-coffee w3-padding-64 w3-text-red w3-margin-right" />
            </div>
            <div className="w3-twothird">
              <h1>Investment Process</h1>
              <br/><br/>
              <h5 className="w3-text-grey">Community Voters/Investors can access pitch content of the projects. They can 
              vote for their prefered projects by donating an amount of minimum 1 METIS. On pledging or sending funds towards a project, 
              the investor receives an equivalent amount of $GODS tokens and an AnbeShivam NFT in return.
              <br/><br/>
              <img src='https://www.toptierawards.com/wp-content/uploads/2017/01/GoldSilverBronze.gif' alt="AnbeShivam Investor Tiers" width="500" height="200" />
              <br/><br/>
              The NFT also acts an investor badge, signifying their involvment as an investor on the AnbeShivam protocol. It also denotes 
              the tier of the Investor, the various tiers being Gold, Silver and Bronze which is determined on the basis of the amount 
              they've invested in total.
              </h5>
              <br/><br/><br/>
              {/* <p className="w3-text-grey">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Excepteur sint
                occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                laboris nisi ut aliquip ex ea commodo consequat.</p> */}
            </div>
          </div>
        </div>
        <div className={styles.box}>
          
        </div>
      </div>

    );
  }
}

export default Home;