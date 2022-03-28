/*!
 * Copyright (c) 2021 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const https = require('https');
const {httpClient} = require('@digitalbazaar/http-client');
const {getZcapClient} = require('./helpers');

const agent = new https.Agent({rejectUnauthorized: false});

const _headers = {
  Accept: 'application/ld+json,application/json',
  'Content-Type': 'application/json',
};

const verify = async ({credential, auth, verifier}) => {
  try {
    const body = {
      verifiableCredential: credential,
      options: {
        checks: ['proof'],
      },
    };
    const headers = {
      ..._headers,
      ...verifier.headers
    };
    if(auth && auth.type === 'oauth2-bearer-token') {
      headers.Authorization = `Bearer ${auth.accessToken}`;
    }
    if(verifier.zcap && typeof verifier.zcap === 'string') {
      const capability = JSON.parse(verifier.zcap);
      const zcapClient = await getZcapClient();
      return await zcapClient.write({
        url: verifier.endpoint,
        headers,
        capability,
        json: body
      });
    }
    return await httpClient.post(
      verifier.endpoint,
      {headers, agent, json: body}
    );
  } catch(e) {
    // this is just to make debugging easier
    if(e && e.response && e.response.data) {
      throw new Error(JSON.stringify(e.response.data, null, 2));
    }
    throw e;
  }
};

module.exports = {verify};
