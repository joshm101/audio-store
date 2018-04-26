pragma solidity ^0.4.23;

import "./AudioTrackFactory.sol";

/// @title Contract for managing consumption of audio tracks
/// @author Joshua Mora
/// @dev Inheritance follows pattern from CryptoZombies Solidity tutorial
contract AudioTrackConsumption is AudioTrackFactory {
    // maps trackId to array of addresses that can download
    // trackId's corresponding track.
    mapping (uint => address[]) public trackToDownloadPurchasers;

    // event emitted when an audio track is purchased for downloading.
    event AudioTrackDownloadPurchased(address purchaser, uint trackId);

    /// @notice Determines whether or not requester can download given track
    /// @param trackId ID of track to check downloadable status
    /// @return bool Whether or not requester can download given track.
    function canDownloadTrack(uint trackId) public view returns (bool) {
        // return true if requestor owns the track associated with trackId.
        if (trackToOwner[trackId] == msg.sender) {
            return true;
        }
        
        // get array of download purchasers associated with trackId.
        address[] storage downloadPurchasers = trackToDownloadPurchasers[trackId];

        // iterate over downloadPurchasers array and determine if
        // msg.sender is in array. O(n) operation where n is the
        // length of downloadPurchasers.
        for (uint i = 0; i < downloadPurchasers.length; i++) {
            if (downloadPurchasers[i] == msg.sender) {
                return true;
            }
        }
        return false;
    }

    /// @notice Allows requester to purchase a track for downloading
    /// @param trackId ID of track to purchase
    function purchaseTrackDownload(uint trackId) public payable {
        // Requester must not have previously purchased the track.
        // Note that since this is an internal call to canDownloadTrack,
        // so gas is used here.
        require(!canDownloadTrack(trackId));

        // look up track to get download price.
        AudioTrack storage track = tracks[trackId];
        uint downloadPrice = track.downloadPrice;
        require(msg.value >= downloadPrice);

        // Requester paid the required amount of ether, add the
        // requester's address to the array of downloadPurchasers
        // associated with trackId
        address[] storage downloadPurchasers = trackToDownloadPurchasers[trackId];
        downloadPurchasers.push(msg.sender);

        emit AudioTrackDownloadPurchased(msg.sender, trackId);
    }
}