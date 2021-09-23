fs = require('fs');
const readline = require("readline");

const ION = require('@decentralized-identity/ion-tools');

const createDid = async () => {
  console.log('🗝️  Generating a Ed25519 key pair');
  const authnKeys = await ION.generateKeyPair('Ed25519');

  console.log('👤 Creating a DID with the public JWK');
  const did = new ION.DID({
    content: {
      publicKeys: [
        {
          id: 'key-1',
          type: 'Ed25519VerificationKey2020',
          publicKeyJwk: authnKeys.publicJwk,
          purposes: ['authentication']
        }
      ]
    }
  });

  console.log('💁 Generating a request to anchor the DID on chain');
  let requestBody = await did.generateRequest(0);

  console.log('🔗 Anchoring the DID on chain')
  const request = new ION.AnchorRequest(requestBody);
  let createResponse = await request.submit();
  console.log(createResponse)

  const shortFormURI = await did.getURI('short');

  fs.writeFile(
    'did.txt',
    `Short Form DID: 
  ${shortFormURI}
Private JWK:
  ${JSON.stringify(authnKeys.privateJwk)}
Public JWK:
  ${JSON.stringify(authnKeys.publicJwk)}`,
    function (err) {
      if (err) return console.log(err);
      console.log('💾 Writing keys and DID to did.txt');
    }
  );

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log("Check that your DID is anchored before deactivating.")

  rl.question("Deactivate the public key (y/n)? ", async (deactivate) => {
    if (deactivate === 'y') {
      console.log("Deactivating public key")

      let deactivateOperation = await did.generateOperation('deactivate', {
        removePublicKeys: ["key-1"]
      });

      let requestBody = await did.generateRequest(deactivateOperation);
      const request = new ION.AnchorRequest(requestBody);
      let createResponse = await request.submit()
    } else {
      console.log("Public key will be kept active.")
    }
    rl.close();
  });

  rl.on("close", function () {
    process.exit(0);
  });
};

createDid();
