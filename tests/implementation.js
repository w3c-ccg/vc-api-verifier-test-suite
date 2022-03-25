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
      let result;
      if(this.settings.verifier.zcap) {
        const capability = JSON.parse(this.settings.verifier.zcap);
        const zcapClient = await getZcapClient();
        result = await zcapClient.write({
          url: this.settings.verifier.endpoint,
          headers,
          capability,
          json: body
        });
      } else {
        result = await httpClient.post(
          this.settings.verifier.endpoint,
          {headers, agent, json: body}
        );
      }
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

module.exports = Implementation;
