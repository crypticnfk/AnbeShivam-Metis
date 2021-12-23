const AnbeShivamMain = artifacts.require('AnbeShivamMain');
const AnbeShivamNFT = artifacts.require('AnbeShivamNFT');
const AnbeShivamInvestorToken = artifacts.require('AnbeShivamInvestorToken');

contract('AnbeShivamMain', (accounts) => {
    let asMain, asiToken, asNFT;

    const sampleURI = "https://anbeshivam.main.eth/{id}.json";

    before(async () =>{
      asMain = await AnbeShivamMain.deployed();
      asNFT = await AnbeShivamNFT.deployed();
      asiToken = await AnbeShivamInvestorToken.deployed();
      await asMain.setContractAddresses(await asiToken.address, await asNFT.address);
      const MINTER_ROLE = web3.utils.soliditySha3("MINTER_ROLE");
      await asiToken.grantRole(MINTER_ROLE, await asMain.address);
      await asNFT.grantRole(MINTER_ROLE, await asMain.address);
    });

    describe("Contract Deployment", async () => {
        it("contract deploys succesfully", async () => {
           const address = await asMain.address;
           assert.isDefined(address);    
           assert.notEqual(address, "0x0000000000000000000000000000000000000000"); 
           assert.notEqual(address, null);
           assert.notEqual(address, undefined);       
        });
    });

    describe("Adding new content",async () => {
        let event, initialContentCount;

        before(async () => {
            initialContentCount = await asMain.returnContentCount();
            const result = await asMain.addContent("abcd", "sampleurl", {from: accounts[0], value: web3.utils.toWei("2", "ether")});
            event = result.logs[0].args;
        });

        it("content count increases", async () => {
            const finalContentCount = await asMain.returnContentCount();
            assert.equal((finalContentCount - initialContentCount).toString(), "1");
        });

        it("content has correct name and file url", async () => {
            assert.equal(event[0], 0);
            assert.equal(event[1], "abcd");
            assert.equal(event[2], "sampleurl");
        });
    });

    describe("Funding projects", async() => {
        let initialInvestorBalance, initialEthBalance, initialGODSBalance, initialVotes;

        before(async () => {
            await asMain.addContent("demo", "sampleurl", {from: accounts[1], value: web3.utils.toWei("2", "ether")});
            await asMain.addContent("demo2", "sampleurl", {from: accounts[2], value: web3.utils.toWei("2", "ether")});
            const content = await asMain.contents(0);
            initialEthBalance = content.receivedFunds;
            initialInvestorBalance = await web3.eth.getBalance(accounts[1]);
            initialGODSBalance = await asiToken.balanceOf(accounts[1]);
            initialVotes = content.votes;
            await asMain.investFunds(0, sampleURI, {from: accounts[1], value: web3.utils.toWei("1", "ether")});
        });

        it("project votes increases", async () => {
            const content = await asMain.contents(0);
            const finalVotes = content.votes;
            const difference = finalVotes - initialVotes;
            assert.equal(difference, 1);
        });

        it("investor can invest funds", async() => {
            await asMain.investFunds(2, sampleURI, {from: accounts[5], value: web3.utils.toWei("6", "ether")});
            const finalInvestorBalance = await web3.eth.getBalance(accounts[1]);       
            let difference = parseFloat(
                web3.utils.fromWei((initialInvestorBalance - finalInvestorBalance).toString())
            );               
            assert.isAbove(difference, 1);

            const content = await asMain.contents(0);
            const finalEthBalance = content.receivedFunds;
            difference = parseFloat(
                web3.utils.fromWei((finalEthBalance - initialEthBalance).toString())
            );               
            assert.equal(difference, 1);
        });

        it("investor receives GODS tokens", async()=> {
            const finalGODSBalance = await asiToken.balanceOf(accounts[1]);
            assert.equal(web3.utils.fromWei((finalGODSBalance - initialGODSBalance).toString()), "1");

            const newSupply = await asiToken.totalSupply();
            assert.equal(web3.utils.fromWei(newSupply).toString(), "7");
        });

        it("investor receives NFT", async()=> {
            const NFTBalance = await asNFT.balanceOf(accounts[1]);
            assert.equal(NFTBalance, 1);
        });
    });

    describe("Matching fund pool", async () => {
        let initialPoolAmount, initialMatchedFunds;

        before(async () => {
            initialPoolAmount = await asMain.matchingPool();
            const content = await asMain.contents(0);
            initialMatchedFunds = content.matchedFunds;
            await asMain.investFunds(0, sampleURI, {from: accounts[2], value: web3.utils.toWei("6", "ether")});
        });

        it("deployer can increase matching pool", async () => {
            await asMain.increaseMatchingPool({value: web3.utils.toWei("10", "ether")});
            const finalPoolAmount = await asMain.matchingPool();

            const difference = parseFloat(
                web3.utils.fromWei((finalPoolAmount - initialPoolAmount).toString())
            );

            assert.equal(difference, 10);
        });

        it("deployer can sync matched funds", async () => {
            await asMain.syncMatchedFunds();
            const content = await asMain.contents(0);
            finalMatchedFunds = content.matchedFunds;

            const difference = parseFloat(
                web3.utils.fromWei((finalMatchedFunds - initialMatchedFunds).toString())
            );

            assert.isAbove(difference, 5.76);
        });
    });

    describe("Withdrawing funds", async () => {
        let initialBalance;

        before(async () => {
            initialBalance = await web3.eth.getBalance(accounts[0]);
        });

        it("project owner can withdraw total funds", async () => {
            await asMain.withdrawFunds(0, {from: accounts[0]});
            const finalBalance = await web3.eth.getBalance(accounts[0]);
            const difference = parseFloat(
                web3.utils.fromWei((finalBalance - initialBalance).toString())
            ); 
            assert.isAbove(difference, 2.99);
        });

        it("project is delisted after withdrawal", async () => {
            const content = await asMain.contents(0);
            const isListed = content.isListed;
            assert.equal(isListed, false);
        }); 
    });
});