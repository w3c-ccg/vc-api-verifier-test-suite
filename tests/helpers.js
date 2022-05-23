/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const chai = require('chai');

const should = chai.should();

function testBadRequestError({result, error}) {
  should.not.exist(result, 'Expected no result from verifier');
  should.exist(error, 'Expected verifier to error');
  should.exist(error.status, 'Expected an HTTP error response code');
  error.status.should.equal(400, 'Expected status code 400 Bad Request');
}

function createRequestBody({vc}) {
  const body = {
    verifiableCredential: vc,
    options: {
      checks: ['proof'],
    }
  };
  return body;
}

module.exports = {
  createRequestBody,
  testBadRequestError
};
