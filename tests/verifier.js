/*!
 * Copyright (c) 2021 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const https = require('https');
const {httpClient} = require('@digitalbazaar/http-client');
const {getZcapClient, constructOAuthHeader} = require('./helpers');

const agent = new https.Agent({rejectUnauthorized: false});

class Verifier {
  constructor({oauth2, verifier}) {
    this.oauth2 = oauth2;
    this.verifier = verifier;
  }
  async verify({credential}) {
    let result;
    let err;
    try {
      const body = {
        verifiableCredential: credential,
        options: {
          checks: ['proof'],
        },
      };
      const {verifier, oauth2} = this;
      if(verifier.zcap) {
        const capability = JSON.parse(verifier.zcap.capability);
        const zcapClient = await getZcapClient({zcap: verifier.zcap});
        result = await zcapClient.write({
          url: this.verifier.endpoint,
          capability,
          json: body
        });
      } else {
        const headers = {};
        if(oauth2) {
          headers.Authorization = await constructOAuthHeader({...oauth2});
        }
        result = await httpClient.post(
          this.verifier.endpoint,
          {agent, headers, json: body}
        );
      }
    } catch(e) {
      err = e;
    }
    return {result, err};
  }
}

module.exports = {Verifier};
