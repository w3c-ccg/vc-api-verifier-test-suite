/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
import chai from 'chai';
import {klona} from 'klona';
import {v4 as uuidv4} from 'uuid';
import {vc} from '../mock-data/vc.js';

const should = chai.should();

export function testBadRequestError({result, error}) {
  should.not.exist(result, 'Expected no result from verifier');
  should.exist(error, 'Expected verifier to error');
  should.exist(error.status, 'Expected an HTTP error response code');
  error.status.should.equal(400, 'Expected status code 400 Bad Request');
}

export function createRequestBody({vc}) {
  const body = {
    verifiableCredential: vc,
    options: {
      checks: ['proof'],
    }
  };
  return body;
}

/**
 * Creates an initial Vc using the issuer endpoint.
 *
 * @param {object} options - Options to use.
 * @param {object} options.issuer - An issuer endpoint.
 * @param {object} [options.credential = vc] - An optional Vc.
 *
 * @throws {Error} Throws if the request fails.
 *
 * @returns {Promise<object>} The resulting Vc.
 */
export async function createInitialVc({issuer, credential = vc}) {
  const {settings: {id: issuerId, options}} = issuer;
  const body = {credential: klona(credential), options};
  body.credential.id = `urn:uuid:${uuidv4()}`;
  body.credential.issuer = issuerId;
  // this library doesn't throw errors as we might need to assert on them
  // in tests so we do need to throw here
  const {data, error} = await issuer.post({json: body});
  if(error) {
    throw error;
  }
  return data;
}
