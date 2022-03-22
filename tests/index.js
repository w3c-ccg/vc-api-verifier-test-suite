/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const implementations = require('../implementations');
const validVC = require('../mock-data/valid-vc.json');

const chai = require('chai');

// eslint-disable-next-line no-unused-vars
const should = chai.should();
// test these implementations' issuers or verifiers
const test = [
  'Digital Bazaar'
];

// only test listed implementations
const testAPIs = implementations.filter(v => test.includes(v.name));

for(const implementation of testAPIs) {
  describe(implementation.name, function() {
    it('MUST verify a valid VC.', async function() {
      console.log(implementation.name);
      console.log(validVC);
    });
  });
}
