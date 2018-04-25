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
    }

    event AudioTrackCreated(uint trackId);    

    AudioTrack[] public tracks;

    mapping (uint => address) public trackToOwner;
    mapping (address => uint) public ownerTrackCount;

    /// Creates an audio track record
    function createAudioTrack(
        string _name, 
        string _description,
        string _creator,
        string _coverImageLocator, 
        string _audioFileLocator
    ) public {
        // create new audio track
        AudioTrack memory track = AudioTrack(
            _name,
            _description,
            _creator,
            _coverImageLocator,
            _audioFileLocator
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
