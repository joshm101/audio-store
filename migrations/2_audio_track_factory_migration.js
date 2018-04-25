var AudioTrackFactory = artifacts.require('AudioTrackFactory');

module.exports = function(deployer) {
  // deployment steps
  deployer.deploy(AudioTrackFactory);
}
