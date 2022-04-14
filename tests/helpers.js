/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const chai = require('chai');
const https = require('https');
const {decodeSecretKeySeed} = require('bnid');
const didKey = require('@digitalbazaar/did-method-key');
const {Ed25519Signature2020} = require('@digitalbazaar/ed25519-signature-2020');
const {ZcapClient} = require('@digitalbazaar/ezcap');

const agent = new https.Agent({rejectUnauthorized: false});
const didKeyDriver = didKey.driver();
const should = chai.should();

// this will create a new copy of a non-circular JSON object
const cloneJSON = data => JSON.parse(JSON.stringify(data, null, 2));

async function getZcapClient() {
  if(!process.env.CLIENT_SECRET_DB) {
    throw new Error('ENV variable CLIENT_SECRET_DB is required.');
  }
  const secretKeySeed = process.env.CLIENT_SECRET_DB;
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

function testBadRequestError({result, error}) {
  should.not.exist(result, 'Expected no result from verifier');
  should.exist(error, 'Expected verifier to error');
  should.exist(error.status, 'Expected an HTTP error response code');
  error.status.should.equal(400, 'Expected status code 400 Bad Request');
}

function createBody({vc}) {
  const body = {
    verifiableCredential: vc,
    options: {
      checks: ['proof'],
    }
  };
  return body;
}

module.exports = {
  cloneJSON,
  createBody,
  getZcapClient,
  testBadRequestError
};
