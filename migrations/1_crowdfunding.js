//const {Web3}=require("web3");
//const abi=require("./../build/contracts/crowdfunding.json");

const crowdFunding = artifacts.require("CrowdFunding");

module.exports = function(deployer) {
  // Deploy the SolidityContract contract as our only task
  deployer.deploy(crowdFunding,100000,1800);
};

//0xac137c5c6c32fC7c710e8a414Cf41CE96b425F5e

//var Contract = artifacts.require("./Contract.sol");

//module.exports = function(deployer) {
//  deployer.deploy(Contract,constructor_param_1, constructor_param_2, ,constructor_param_3, ,constructor_param_etc);
//
//};
