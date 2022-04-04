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
const {httpClient} = require('@digitalbazaar/http-client');

const agent = new https.Agent({rejectUnauthorized: false});
const didKeyDriver = didKey.driver();
const should = chai.should();

// this will create a new copy of a non-circular JSON object
const cloneJSON = data => JSON.parse(JSON.stringify(data, null, 2));

async function getZcapClient({zcap}) {
  const secretKeySeed = process.env[zcap.clientSecret];
  if(!secretKeySeed) {
    throw new Error(`Env variable ${zcap.clientSecret} is not set.`);
  }
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

function testBadRequestError({result, err}) {
  should.not.exist(result, 'Expected no result from verifier');
  should.exist(err, 'Expected verifier to error');
  should.exist(err.status, 'Expected an HTTP error response code');
  err.status.should.equal(400, 'Expected status code 400 Bad Request');
}

async function constructOAuthHeader({
  clientId,
  clientSecret,
  tokenAudience,
  tokenEndpoint
}) {
  const client_secret = process.env[clientSecret];
  if(!client_secret) {
    throw new Error(`Env variable ${clientSecret} not set.`);
  }
  const {accessToken} = await _getNewAccessToken({
    client_id: clientId,
    client_secret,
    token_endpoint: tokenEndpoint,
    audience: tokenAudience,
    grant_type: 'client_credentials'
  });
  return `Bearer ${accessToken}`;
}

/**
 * Gets a new access token from the provided URL.
 *
 * @param {object} options - Options to use.
 * @param {string} options.client_id - The ID of the client.
 * @param {string} options.client_secret - The client secret.
 * @param {string} options.token_endpoint - The URL to call.
 * @param {string} options.grant_type - The grant type.
 * @param {number} options.maxRetries - The maximum number of times to retry
 *  the request.
 * @param {string} options.audience - The URL of resource server.
 *
 * @returns {object} The access token.
 */
async function _getNewAccessToken({
  client_id, client_secret, token_endpoint, grant_type, audience,
  maxRetries = 3
}) {
  // FIXME other implementations appear to post json
  const body = new URLSearchParams({
    client_id, client_secret, grant_type
  });

  for(; maxRetries >= 0; --maxRetries) {
    const access_token = await _requestAccessToken(
      {url: token_endpoint, body});
    if(access_token) {
      return {accessToken: access_token};
    }
  }
  throw new Error(
    `Service Unavailable: Could not renew token for ${audience}.`);
}

async function _requestAccessToken({url, body}) {
  let response;
  try {
    ({data: response} = await httpClient.post(url, {
      body,
      agent
    }));
  } catch(error) {
    console.error('Error getting access token.', {error});
    throw error;
  }
  if(response && response.access_token) {
    return response.access_token;
  }

  return false;
}
module.exports = {
  cloneJSON,
  getZcapClient,
  testBadRequestError,
  constructOAuthHeader
};
