// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.5.0 <0.9.0;

contract CrowdFunding
{
    mapping(address=>uint) public contributors;
    address public manager;
    uint public minimumContribution;
    uint public deadline;
    uint public target;
    uint public raisedAmount;
    uint public noOfContributors;

    constructor(uint _target,uint _deadline){
        target=_target;
        deadline=block.timestamp+_deadline;
        minimumContribution=500 wei;
        manager=msg.sender;
    }

    function sendEth() public payable{
        require(block.timestamp < deadline,"Deadline has passed");
        require(msg.value >= minimumContribution,"Minimum contribution is not met");

        if(contributors[msg.sender]==0){
            noOfContributors++;
        }
        contributors[msg.sender]+=msg.value;
        raisedAmount+=msg.value;
    }
    function getContractBalanace() public view returns(uint){
        return address(this).balance;
    }

    function refund() public{
        require(block.timestamp>deadline && raisedAmount<target,"you are not eligible for refund");
        require(contributors[msg.sender]>0);
        address payable user=payable(msg.sender);
        user.transfer(contributors[msg.sender]);
        contributors[msg.sender]=0;
    }

    struct request{
        string description;
        address payable recipient;
        uint value;
        bool completed;
        uint noOfVoters;
        mapping(address=>bool) voters;
    }

    mapping(uint=>request) public requests;
    uint public numRequests;

    modifier onlymanager(){      //read once
        require(msg.sender==manager,"only manager can call this function");
        _;
    }

    function createRequests(string memory _discription,address payable _recipient,uint _value) public onlymanager{

        request storage newRequest = requests[numRequests];
        numRequests++;
        newRequest.description=_discription;
        newRequest.recipient=_recipient;
        newRequest.value=_value;
        newRequest.completed=false;
        newRequest.noOfVoters=0;
    }

    function voteRequest(uint _requestNo) public{
        require(contributors[msg.sender]>0,"you must be a contributor");
        request storage thisRequest=requests[_requestNo];
        require(thisRequest.voters[msg.sender]==false,"you have already voted");
        thisRequest.voters[msg.sender]=true;
        thisRequest.noOfVoters++;
    }
    
    function makePayment(uint _requestNo) public onlymanager{
        require(raisedAmount>=target);
        request storage thisRequest=requests[_requestNo];
        require(thisRequest.completed==false,"the rquest is already completed");
        require(thisRequest.noOfVoters > noOfContributors/2,"majority does not supported");
        thisRequest.recipient.transfer(thisRequest.value);
        thisRequest.completed=true;

    }

    
}