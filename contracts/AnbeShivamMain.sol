// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./AnbeShivamNFT.sol";
import "./AnbeShivamInvestorToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AnbeShivamMain is Ownable {
    address GODSContract;
    address NFTContract;
    uint totalWeight;

    struct Content {
        uint id;
        uint receivedFunds;
        uint matchedFunds;
        uint weight;
        uint votes;
        bool isListed;
        string name;
        string fileURL;
        address payable creator;
    }

    Content[] public contents;
    uint public fundingPool;
    uint public matchingPool;

    event newContentAdded(uint, string, string);
    event projectFunded(uint, uint, address);
    event setMatchingPool(uint);

    function sqrt(uint y) internal pure returns (uint z) {
        if (y > 3) {
            z = y;
            uint x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }

    function syncMatchedFunds() external onlyOwner {
        for(uint i=0; i < contents.length; ++i) {
            if(contents[i].isListed) {
                contents[i].matchedFunds = contents[i].weight*matchingPool/totalWeight;
            }
        }
    } 

    function returnContentCount() external view returns (uint) {
        return contents.length;
    } 

    function setContractAddresses(
        address _GODSContract, 
        address _NFTContract
    ) 
        external 
        onlyOwner 
    {
        GODSContract = _GODSContract;
        NFTContract = _NFTContract;
    }

    function increaseMatchingPool() external payable onlyOwner {
        require(msg.value > 0);
        matchingPool += msg.value;
        emit setMatchingPool(matchingPool);
    }

    function addContent(string memory _name, string memory _fileURL) external payable {
        require(msg.value >= 2 ether, "Insufficient amount");
        contents.push(
            Content(
                contents.length, 
                0, 0, 0, 0, 
                true, 
                _name, 
                _fileURL, 
                payable(msg.sender)
            )
        );
        emit newContentAdded(
            contents.length - 1,
            contents[contents.length - 1].name,
            contents[contents.length - 1].fileURL
        );
    }

    function investFunds(uint _contentID, string memory _metadata) external payable {
        require(msg.value >= 1 ether);
        require(msg.sender != contents[_contentID].creator);
        contents[_contentID].votes += 1;
        totalWeight -= contents[_contentID].weight;
        contents[_contentID].receivedFunds += msg.value;
        contents[_contentID].weight = (sqrt(contents[_contentID].weight + contents[_contentID].receivedFunds) + sqrt(msg.value))**2 - contents[_contentID].receivedFunds;
        fundingPool += msg.value;
        totalWeight += contents[_contentID].weight;
        AnbeShivamInvestorToken(GODSContract).mint(msg.sender, msg.value);
        AnbeShivamNFT(NFTContract).safeMint(msg.sender, _metadata);
        emit projectFunded(_contentID, msg.value, msg.sender);
    }

    function withdrawFunds(uint _contentID) external {
        require(contents[_contentID].isListed, "Unlisted project");
        require(msg.sender == contents[_contentID].creator, "Not creator");
        uint totalFunds = contents[_contentID].receivedFunds + contents[_contentID].matchedFunds + 2 ether;
        contents[_contentID].receivedFunds = 0;
        matchingPool -= contents[_contentID].matchedFunds;
        contents[_contentID].matchedFunds = 0;
        contents[_contentID].isListed = false;
        contents[_contentID].creator.transfer(totalFunds);
    }
}