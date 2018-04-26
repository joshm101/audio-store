var AudioTrackConsumption = artifacts.require('AudioTrackConsumption');

module.exports = function(deployer) {
  // deployment steps
  deployer.deploy(AudioTrackConsumption);
}
