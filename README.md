# audio-store

Decentralized application to allow artists to post music and make it available for download/purchase/free(w/ optional donation).

The **overall goal** of this application is to provide a way for decentralized audio file storage & streaming. Consumers of content can download/stream audio; producers of content can choose certain rules for consumers to abide by to download/stream the audio. For example, an uploader can allow an audio file to be streamed for free and/or be downloaded with a specified fee, etc.

The **initial goal** is to create a ___proof-of-concept___ smart contract that can allow for the designation of rules that define access to an audio file.

**The initial goal does not take into consideration the reality of some uploaders uploading audio files they either:**
  - **a) do not own**
  - **b) have not created themselves**

Challenges such as providing an easy way to upload a file to a decentralized file storage network and streaming the uploaded file from the decentralized storage network are yet to be solved. The smart contract will **not** try to facilitate file storage; it will store a reference to the uploaded file and the client-side will retrieve the file for use.

*Below instructions assume basic knowledge of Node.js/`npm` and Truffle framework.*
### Prerequisites to run in a development environment
1. [Node.js](https://nodejs.org/en/) installed on your computer to use the `npm` command.
2. [Truffle](http://truffleframework.com/): `npm install -g truffle`
3. [Genache](http://truffleframework.com/ganache/): To fire up a local Ethereum blockchain for development

### Deploy smart contract local Ethereum blochain
In the root of the project directory:
1. `truffle compile`
2. `truffle migrate`

This should create contract migration transactions on the local Ethereum blockchain, signifying that the smart contract is up on the local Ethereum blockchain.