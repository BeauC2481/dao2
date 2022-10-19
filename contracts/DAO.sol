// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";
import "./Token.sol";


interface IToken {

    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);

    function transfer(address recipient, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);


    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event TokensPurchased(address account, address token, uint amount, uint rate);
}


contract DAO {
    IToken GT;
    address public Governor;
    address public account = 0xdD2FD4581271e230360230F9337D5c0430Bf44C0;

    struct Proposal {
        uint256 proposalId;
        uint256 amount;
        uint256 deadline;
        uint256 yesVotes;
        uint256 noVotes;
        string title;
        string description;
        address addressTo;
        bool executed;
        mapping(address => bool) voters;
    }


    enum Vote {
        Yes,
        No
    }


    // Create a mapping of ID to Proposal
    mapping(uint256 => Proposal) public proposals;
    // Number of proposals that have been created
    uint256 public numProposals;


    // Create a modifier which only allows a function to be
    // called if the given proposal's deadline has not been exceeded yet
    modifier activeProposalOnly(uint256 proposalIndex) {
        require(
            proposals[proposalIndex].deadline > block.timestamp,
            "DEADLINE_EXCEEDED"
        );
        _;
    }


    // Create a modifier which only allows a function to be
    // called if the given proposals' deadline HAS been exceeded
    // and if the proposal has not yet been executed
    modifier inactiveProposalOnly(uint256 proposalIndex) {
        require(
            proposals[proposalIndex].deadline <= block.timestamp,
            "DEADLINE_NOT_EXCEEDED"
        );
        require(
            proposals[proposalIndex].executed == false,
            "PROPOSAL_ALREADY_EXECUTED"
        );
        _;
    }


    constructor(address GovernorToken) payable {
        GT = IToken(GovernorToken);
    }


    function getBalance() external view returns(uint256 balance) {
        balance = GT.balanceOf(msg.sender);
    }


    function addYesVotes(uint256 _proposalId, uint256 votes) public {
        Proposal storage proposal = proposals[_proposalId];
        require(proposal.voters[msg.sender] = true, "Already voted");
        proposal.yesVotes += votes;
        proposal.voters[msg.sender] = true;
    }

    function addNoVotes(uint256 _proposalId, uint256 votes) public {
        Proposal storage proposal = proposals[_proposalId];
        require(proposal.voters[msg.sender] = true, "Already voted");
        proposal.noVotes += votes;
        proposal.voters[msg.sender] = true;
    }


    function createProposal(string memory _title, uint256 _amount, address _addressTo, string memory _description) external returns (uint256) {
        Proposal storage proposal = proposals[numProposals];
        require(_amount < GT.balanceOf(address(this)), "Not enough Governor token");
        proposal.proposalId = numProposals;
        proposal.amount = _amount;
        proposal.deadline = block.timestamp + 10 minutes;
        proposal.addressTo = _addressTo;
        proposal.title = _title;
        proposal.description = _description;

        numProposals++;
        return numProposals - 1;
    }


    function voteOnProposal(uint256 proposalIndex, Vote vote) external activeProposalOnly(proposalIndex) {
        Proposal storage proposal = proposals[proposalIndex];
        uint256 numVotes;

        uint256 voterGTBalance = GT.balanceOf(msg.sender);
        numVotes = voterGTBalance;
            /*if (proposal.voters[msg.sender] = false) {
                numVotes = voterGTBalance;
                proposal.voters[msg.sender] = true;
            }

        require(proposal.voters[msg.sender] = true, "Already voted");*/

        if (vote == Vote.Yes) {
            proposal.yesVotes += numVotes;
        } else {
            proposal.noVotes += numVotes;
        }
    }


    function executeProposal(uint256 proposalIndex) external inactiveProposalOnly(proposalIndex) {
        Proposal storage proposal = proposals[proposalIndex];
        require(proposal.amount < GT.balanceOf(address(this)), "Not enough Governor token");
        uint _amount = proposal.amount;

        if (proposal.yesVotes > proposal.noVotes) {
            GT.transfer(proposal.addressTo, _amount);
        }
        proposal.executed = true;
    }


    receive() external payable {}

    fallback() external payable {}
    

}

