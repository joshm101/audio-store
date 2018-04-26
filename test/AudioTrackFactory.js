var AudioTrackFactory = artifacts.require('AudioTrackFactory');

contract('AudioTrackFactory', function(accounts) {
  it('should create an audio track record', function() {
    var name = 'Test track';
    var description = 'Test description'
    var creator = 'Test creator';
    var coverImageLocator = 'some/path/to/image';
    var audioFileLocator = 'some/path/to/file';
    var canDownload = false;
    var canStream = true;
    var downloadPrice = 0.001;

    var contractInstance;
    return AudioTrackFactory.deployed().then(function(instance) {
      contractInstance = instance;
      return contractInstance.createAudioTrack(
        name,
        description,
        creator,
        coverImageLocator,
        audioFileLocator,
        canDownload,
        canStream,
        web3._extend.utils.toWei(downloadPrice),
        { from: accounts[0] }
      );
    }).then(function(result) {
      // determined via https://goo.gl/F8wjxL and console.logs
      var audioTrackCreatedEvent = result.logs[0];
      var trackId = audioTrackCreatedEvent.args.trackId.toNumber();

      return contractInstance.tracks.call(
        trackId,
        { from: accounts[0] }
      )
    }).then(function(track) {
      // track is an array, set index constants for
      // readability.
      var NAME = 0;
      var DESCRIPTION = 1;
      var CREATOR = 2;
      var COVER_IMAGE_LOCATOR = 3;
      var AUDIO_FILE_LOCATOR = 4;
      var CAN_DOWNLOAD = 5;
      var CAN_STREAM = 6;
      var DOWNLOAD_PRICE = 7;


      // ensure data for fields on created audio track
      // record match the data provided during creation.
      assert.equal(track[NAME], name);
      assert.equal(track[DESCRIPTION], description);
      assert.equal(track[CREATOR], creator);
      assert.equal(track[COVER_IMAGE_LOCATOR], coverImageLocator);
      assert.equal(track[AUDIO_FILE_LOCATOR], audioFileLocator);
      assert.equal(track[CAN_DOWNLOAD], canDownload);
      assert.equal(track[CAN_STREAM], canStream);
      assert.equal(web3._extend.utils.fromWei(track[DOWNLOAD_PRICE]).toNumber(), downloadPrice);
    });
  });
});