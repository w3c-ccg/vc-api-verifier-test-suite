/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const chai = require('chai');
const implementations = require('../implementations.js');
const Implementation = require('./Implementation.js');
const validVC = require('../mock-data/valid-vc.json');

const should = chai.should();

const test = [
  'Digital Bazaar'
];

// only test listed implementations
const testAPIs = implementations.filter(v => test.includes(v.name));

for(const verifier of testAPIs) {
  describe(verifier.name, function() {
    it('MUST verify a valid VC.', async function() {
      // this tells the test report which cell in the interop matrix
      // the result goes in
      this.test.cell = {
        columnId: verifier.name,
        rowId: this.test.title
      };
      const implementation = new Implementation(verifier);
      let response;
      let err;
      try {
        response = await implementation.verify({
          credential: validVC
        });
      } catch(e) {
        err = e;
      }
      should.not.exist(err);
      should.exist(response);
      response.status.should.equal(200);
    });
  });
}
