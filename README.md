# Create ION DID

A script to create and anchor an ION DID. 

This script
- Creates an Ed25519 key pair
- Makes a DID using the public key
- Anchors the DID on the ION network
- Writes the short-form DID, private key, and public key to `did.txt`

Note that the script does not wait for anchoring to complete. Please use the [ION network explorer](https://identity.foundation/ion/explorer/) to verify anchoring.

## Install

Install dependencies

```bash
npm install
```

## Run

Generate key pair and ION DID

```bash
node create-did.js
```