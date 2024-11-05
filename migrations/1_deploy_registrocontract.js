const RegistrosContract = artifacts.require("RegistrosContract.sol");

module.exports = function (deployer) {
  deployer.deploy(RegistrosContract);
};