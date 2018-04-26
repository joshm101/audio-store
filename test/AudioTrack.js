var AudioTrackConsumption = artifacts.require('AudioTrackConsumption');

/**
 * AudioTrackConsumption contract used to test base
 * AudioTrackFactory functionality as well as the
 * inheriting AudioTrackConsumption functionality.
 */
contract('AudioTrackConsumption', (accounts) => {
    const name = 'Test track';
    const description = 'Test description'
    const creator = 'Test creator';
    const coverImageLocator = 'some/path/to/image';
    const audioFileLocator = 'some/path/to/file';
    const canDownload = true;
    const canStream = true;
    const downloadPrice = 10;
    const utils = web3._extend.utils;
    let trackId;
    let contractInstance;
  it('should create an audio track record', () =>
    AudioTrackConsumption.deployed().then((instance) => {
      contractInstance = instance;
      return contractInstance.createAudioTrack(
        name,
        description,
        creator,
        coverImageLocator,
        audioFileLocator,
        canDownload,
        canStream,
        utils.toWei(downloadPrice),
        { from: accounts[0] }
      );
    }).then((result) => {
      // determined via https://goo.gl/F8wjxL and console.logs
      const audioTrackCreatedEvent = result.logs[0];
      trackId = audioTrackCreatedEvent.args.trackId.toNumber();

      return contractInstance.tracks.call(
        trackId,
        { from: accounts[0] }
      )
    }).then((track) => {
      // track is an array, set index constants for
      // readability.
      const NAME = 0;
      const DESCRIPTION = 1;
      const CREATOR = 2;
      const COVER_IMAGE_LOCATOR = 3;
      const AUDIO_FILE_LOCATOR = 4;
      const CAN_DOWNLOAD = 5;
      const CAN_STREAM = 6;
      const DOWNLOAD_PRICE = 7;

      const setDownloadPrice = utils.fromWei(
        track[DOWNLOAD_PRICE]
      ).toNumber();


      // ensure data for fields on created audio track
      // record match the data provided during creation.
      assert.equal(track[NAME], name);
      assert.equal(track[DESCRIPTION], description);
      assert.equal(track[CREATOR], creator);
      assert.equal(track[COVER_IMAGE_LOCATOR], coverImageLocator);
      assert.equal(track[AUDIO_FILE_LOCATOR], audioFileLocator);
      assert.equal(track[CAN_DOWNLOAD], canDownload);
      assert.equal(track[CAN_STREAM], canStream);
      assert.equal(setDownloadPrice, downloadPrice);
    })
  );
  
  it('allows the purchase of a valid track', () => {
    contractInstance.purchaseTrackDownload(
      trackId,
      {
        from: accounts[1],
        value: utils.toWei(downloadPrice),
      }
    ).then((result) => {
      const audioTrackDownloadPurchasedEvent = result.logs[0];
      const purchasedTrackId = audioTrackDownloadPurchasedEvent.args.trackId.toNumber();
      assert.equal(trackId, purchasedTrackId);
    });
  });
  
  it(
    'throws a revert error when required ether amount is not provided',
    async () => {
      const testFunction = async () => {
        let caughtError;
        try {
          await contractInstance.purchaseTrackDownload(
            trackId,
            {
              from: accounts[1],
              value: utils.toWei(0.0001)
            }
          )
        } catch (error) {
          caughtError = error;
        }
        assert.throws(() => {
          if (caughtError) {
            throw caughtError; 
          }
        }, /revert/);
      }
      await testFunction();
    }
  );

  it('calculates download privileges', () => {
    // Test request where requester does have privileges
    // to download a track because they have purchased it.
    contractInstance.canDownloadTrack.call(
      trackId,
      { from: accounts[1] }
    ).then((result) => {
      assert.isTrue(result);
    });

    // Test request where requestor does NOT have privileges
    // to download a track because they have NOT purchased it.
    contractInstance.canDownloadTrack.call(
      trackId,
      { from: accounts[2] }
    ).then((result) => {
      assert.isFalse(result);
    });

    // Test request where requestor owns the track that is
    // being checked.
    contractInstance.canDownloadTrack.call(
      trackId,
      { from: accounts[0] }
    ).then((result) => {
      assert.isTrue(result);
    });
  });
});
