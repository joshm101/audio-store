pragma solidity ^0.4.23;

/// @title Contract for creating audio tracks
/// @author Joshua Mora
/// @dev Audio file is stored as a reference/locator
contract AudioTrackFactory {

    struct AudioTrack {
        string name;
        string description;
        string creator;
        string coverImageLocator;
        string audioFileLocator;
        bool canDownload;
        uint downloadPrice;
    }

    event AudioTrackCreated(uint trackId);    

    AudioTrack[] public tracks;

    mapping (uint => address) public trackToOwner;
    mapping (address => uint) public ownerTrackCount;

    /// @notice Creates an audio track record
    /// @param _name The name of the audio track
    /// @param _description The audio track's description
    /// @param _creator The creator/producer/uploader
    /// @param _coverImageLocator Image file locator/path
    /// @param _audioFileLocator Audio file locator/path
    /// @param _canDownload Whether or not the file can be downloaded
    /// @param _downloadPrice Price in ether to be allowed to download file
    function createAudioTrack(
        string _name, 
        string _description,
        string _creator,
        string _coverImageLocator, 
        string _audioFileLocator,
        bool _canDownload,
        uint _downloadPrice
    ) public {
        // create new audio track
        AudioTrack memory track = AudioTrack(
            _name,
            _description,
            _creator,
            _coverImageLocator,
            _audioFileLocator,
            _canDownload,
            _downloadPrice
        );

        // Push newly created audio track onto tracks array and
        // retrieve resulting length of tracks array.
        uint newTracksArrayLength = tracks.push(track);

        // Retrieve index of newly added track to use as an ID.
        uint trackId = newTracksArrayLength - 1;
        
        // Set owner of newly created track & increase owner's
        // audio track count.
        trackToOwner[trackId] = msg.sender;
        ownerTrackCount[msg.sender]++;
        emit AudioTrackCreated(trackId);
    }
}
