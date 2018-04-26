var AudioTrackConsumption = artifacts.require('AudioTrackConsumption');

/**
 * AudioTrackConsumption contract used to test base
 * AudioTrackFactory functionality as well as the
 * inheriting AudioTrackConsumption functionality.
 */
contract('AudioTrackConsumption', function(accounts) {
    var name = 'Test track';
    var description = 'Test description'
    var creator = 'Test creator';
    var coverImageLocator = 'some/path/to/image';
    var audioFileLocator = 'some/path/to/file';
    var canDownload = true;
    var canStream = true;
    var downloadPrice = 0.001;
    var trackId;
    var contractInstance;
  it('should create an audio track record', function() {
    return AudioTrackConsumption.deployed().then(function(instance) {
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
      trackId = audioTrackCreatedEvent.args.trackId.toNumber();

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
  
  it('allows the purchase of a valid track', function() {
    contractInstance.purchaseTrackDownload(
      trackId,
      {
        from: accounts[1],
        value: web3._extend.utils.toWei(downloadPrice),
      }
    ).then(function(result) {
      var audioTrackDownloadPurchasedEvent = result.logs[0];
      var purchasedTrackId = audioTrackDownloadPurchasedEvent.args.trackId.toNumber();
      assert.equal(trackId, purchasedTrackId);
    });
  });
  
  it(
    'throws a revert error when required ether amount is not provided',
    async function() {
      var testFunction = async function() {
        var caughtError;
        try {
          await contractInstance.purchaseTrackDownload(
            trackId,
            {
              from: accounts[1],
              value: web3._extend.utils.toWei(0.0001)
            }
          )
        } catch (error) {
          caughtError = error;
        }
        assert.throws(function() {
          if (caughtError) {
            throw caughtError; 
          }
        }, /revert/);
      }
      await testFunction();
    }
  );

  it('calculates download privileges', function() {
    // Test request where requester does have privileges
    // to download a track because they have purchased it.
    contractInstance.canDownloadTrack.call(
      trackId,
      { from: accounts[1] }
    ).then(function(result) {
      assert.isTrue(result);
    });

    // Test request where requestor does NOT have privileges
    // to download a track because they have NOT purchased it.
    contractInstance.canDownloadTrack.call(
      trackId,
      { from: accounts[2] }
    ).then(function(result) {
      assert.isFalse(result);
    });

    // Test request where requestor owns the track that is
    // being checked.
    contractInstance.canDownloadTrack.call(
      trackId,
      { from: accounts[0] }
    ).then(function(result) {
      assert.isTrue(result);
    });
  });
});
