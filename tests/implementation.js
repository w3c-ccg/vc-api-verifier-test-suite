/*!
 * Copyright (c) 2021 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const https = require('https');
const agent = new https.Agent({rejectUnauthorized: false});
const didKey = require('@digitalbazaar/did-method-key');
const {decodeSecretKeySeed} = require('bnid');
const {ZcapClient} = require('@digitalbazaar/ezcap');
const {Ed25519Signature2020} = require('@digitalbazaar/ed25519-signature-2020');

const didKeyDriver = didKey.driver();
const _headers = {
  Accept: 'application/ld+json,application/json',
  'Content-Type': 'application/json',
};

class Implementation {
  constructor(settings) {
    this.settings = settings;
  }
  async verify({credential, auth}) {
    try {
      const body = {
        verifiableCredential: credential,
        options: {
          checks: ['proof'],
        },
      };
      const headers = {
        ..._headers,
        ...this.settings.verifier.headers
      };
      if(auth && auth.type === 'oauth2-bearer-token') {
        headers.Authorization = `Bearer ${auth.accessToken}`;
      }
      let capability;
      if(this.settings.verifier.zcap) {
        capability = JSON.parse(this.settings.verifier.zcap);
      }
      const zcapClient = await _getZcapClient();
      const result = await zcapClient.write({
        url: this.settings.verifier.endpoint,
        headers,
        capability,
        json: body
      });
      return result;
    } catch(e) {
      // this is just to make debugging easier
      if(e && e.response && e.response.data) {
        throw new Error(JSON.stringify(e.response.data, null, 2));
      }
      throw e;
    }
  }
}

async function _getZcapClient() {
  if(!process.env.CLIENT_SECRET) {
    throw new Error('ENV variable CLIENT_SECRET is required.');
  }
  const secretKeySeed = process.env.CLIENT_SECRET;
  const seed = await decodeSecretKeySeed({secretKeySeed});
  const didKey = await didKeyDriver.generate({seed});
  const {didDocument: {capabilityInvocation}} = didKey;
  const zcapClient = new ZcapClient({
    SuiteClass: Ed25519Signature2020,
    invocationSigner: didKey.keyPairs.get(capabilityInvocation[0]).signer(),
    agent
  });
  return zcapClient;
}

module.exports = Implementation;
