/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const chai = require('chai');
const {filterByTag} = require('vc-api-test-suite-implementations');
const {issuerName} = require('./test-config.js');
const {klona} = require('klona');
const should = chai.should();
const {testBadRequestError, createBody} = require('./helpers');
const {v4: uuidv4} = require('uuid');
const vc = require('../mock-data/vc.json');

// only use implementations with `JWT` verifiers.
const {
  match: matchingVerifiers,
  nonMatch: nonMatchingVerifiers
} = filterByTag({verifierTags: ['JWT']});
const {match: matchingIssuers} = filterByTag({issuerTags: ['JWT']});

describe('Verify Credential - JWT', function() {
  const summaries = new Set();
  this.summary = summaries;
  const reportData = [];
  // this will tell the report
  // to make an interop matrix with this suite
  this.matrix = true;
  this.report = true;
  this.implemented = [...matchingVerifiers.keys()];
  this.rowLabel = 'Test Name';
  this.columnLabel = 'Verifier';
  // the reportData will be displayed under the test title
  this.reportData = reportData;
  this.notImplemented = [...nonMatchingVerifiers.keys()];
  for(const [verifierName, {verifiers}] of matchingVerifiers) {
    const verifier = verifiers.find(
      verifier => verifier.tags.has('JWT'));
    describe(verifierName, function() {
      let validVc;
      before(async function() {
        const issuer = matchingIssuers.get(issuerName).issuers.find(
          issuer => issuer.tags.has('JWT'));
        const {issuer: {id: issuerId}} = issuer;
        const body = {credential: klona(vc)};
        body.credential.id = `urn:uuid:${uuidv4()}`;
        body.credential.issuer = issuerId;
        const {data} = await issuer.issue({body});
        validVc = data;
      });
      it('MUST verify a valid VC.', async function() {
        // this tells the test report which cell in the interop matrix
        // the result goes in
        this.test.cell = {
          columnId: verifierName,
          rowId: this.test.title
        };
        const body = createBody({vc: validVc});
        const {result, error} = await verifier.verify({body});
        should.not.exist(error);
        should.exist(result);
        should.exist(result.status);
        result.status.should.equal(200);
      });
      it('MUST not verify if "@context" property is missing.',
        async function() {
          this.test.cell = {
            columnId: verifierName,
            rowId: this.test.title
          };
          const noContextVc = klona(validVc);
          delete noContextVc['@context'];
          const body = createBody({vc: noContextVc});
          const {result, error} = await verifier.verify({body});
          testBadRequestError({result, error});
        });
      it('MUST not verify if "type" property is missing.', async function() {
        this.test.cell = {
          columnId: verifierName,
          rowId: this.test.title
        };
        const noTypeVc = klona(validVc);
        delete noTypeVc.type;
        const body = createBody({vc: noTypeVc});
        const {result, error} = await verifier.verify({body});
        testBadRequestError({result, error});
      });
      it('MUST not verify if "issuer" property is missing.', async function() {
        this.test.cell = {
          columnId: verifierName,
          rowId: this.test.title
        };
        const noIssuerVc = klona(validVc);
        delete noIssuerVc.issuer;
        const body = createBody({vc: noIssuerVc});
        const {result, error} = await verifier.verify({body});
        testBadRequestError({result, error});
      });
      it('MUST not verify if "credentialSubject" property is missing.',
        async function() {
          this.test.cell = {
            columnId: verifierName,
            rowId: this.test.title
          };
          const noCredentialSubjectVc = klona(validVc);
          delete noCredentialSubjectVc.credentialSubject;
          const body = createBody({vc: noCredentialSubjectVc});
          const {result, error} = await verifier.verify({body});
          testBadRequestError({result, error});
        });
      it('MUST not verify if "proof" property is missing.', async function() {
        this.test.cell = {
          columnId: verifierName,
          rowId: this.test.title
        };
        const noProofVc = klona(validVc);
        delete noProofVc.proof;
        const body = createBody({vc: noProofVc});
        const {result, error} = await verifier.verify({body});
        testBadRequestError({result, error});
      });
      it('MUST not verify if "proof.type" property is missing.',
        async function() {
          this.test.cell = {
            columnId: verifierName,
            rowId: this.test.title
          };
          const noProofTypeVc = klona(validVc);
          delete noProofTypeVc.proof.type;
          const body = createBody({vc: noProofTypeVc});
          const {result, error} = await verifier.verify({body});
          testBadRequestError({result, error});
        });
      it('MUST not verify if "proof.created" property is missing.',
        async function() {
          this.test.cell = {
            columnId: verifierName,
            rowId: this.test.title
          };
          const noProofCreatedVc = klona(validVc);
          delete noProofCreatedVc.proof.created;
          const body = createBody({vc: noProofCreatedVc});
          const {result, error} = await verifier.verify({body});
          testBadRequestError({result, error});
        });
      it('MUST not verify if "proof.verificationMethod" property is missing.',
        async function() {
          this.test.cell = {
            columnId: verifierName,
            rowId: this.test.title
          };
          const noProofVerificationMethodVc = klona(validVc);
          delete noProofVerificationMethodVc.proof.verificationMethod;
          const body = createBody({vc: noProofVerificationMethodVc});
          const {result, error} = await verifier.verify({body});
          testBadRequestError({result, error});
        });
      it('MUST not verify if "proof.proofValue" property is missing.',
        async function() {
          this.test.cell = {
            columnId: verifierName,
            rowId: this.test.title
          };
          const noProofValueVc = klona(validVc);
          delete noProofValueVc.proof.proofValue;
          const body = createBody({vc: noProofValueVc});
          const {result, error} = await verifier.verify({body});
          testBadRequestError({result, error});
        });
      it('MUST not verify if "proof.proofPurpose" property is missing.',
        async function() {
          this.test.cell = {
            columnId: verifierName,
            rowId: this.test.title
          };
          const noProofPurposeVc = klona(validVc);
          delete noProofPurposeVc.proof.proofPurpose;
          const body = createBody({vc: noProofPurposeVc});
          const {result, error} = await verifier.verify({body});
          testBadRequestError({result, error});
        });
      it('MUST not verify if "@context" is not an array.', async function() {
        this.test.cell = {
          columnId: verifierName,
          rowId: this.test.title
        };
        const copyVc = klona(validVc);
        const invalidContextTypes = ['string', {}, null, undefined, 10, true];
        for(const invalidContextType of invalidContextTypes) {
          copyVc['@context'] = invalidContextType;
          const body = createBody({vc: copyVc});
          const {result, error} = await verifier.verify({body});
          testBadRequestError({result, error});
        }
      });
      it('MUST not verify if "@context" items are not strings.',
        async function() {
          this.test.cell = {
            columnId: verifierName,
            rowId: this.test.title
          };
          const copyVc = klona(validVc);
          const invalidContextItemTypes = [[], {}, null, undefined, 10, true];
          for(const invalidContextItemType of invalidContextItemTypes) {
            copyVc['@context'] = [invalidContextItemType];
            const body = createBody({vc: copyVc});
            const {result, error} = await verifier.verify({body});
            testBadRequestError({result, error});
          }
        });
      it('MUST not verify if "type" is not an array.', async function() {
        this.test.cell = {
          columnId: verifierName,
          rowId: this.test.title
        };
        const copyVc = klona(validVc);
        const invalidTypes = ['string', {}, null, undefined, 10, true];
        for(const invalidType of invalidTypes) {
          copyVc.type = invalidType;
          const body = createBody({vc: copyVc});
          const {result, error} = await verifier.verify({body});
          testBadRequestError({result, error});
        }
      });
      it('MUST not verify if "type" items are not strings.', async function() {
        this.test.cell = {
          columnId: verifierName,
          rowId: this.test.title
        };
        const copyVc = klona(validVc);
        const invalidTypeItemTypes = [[], {}, null, undefined, 10, true];
        for(const invalidItemType of invalidTypeItemTypes) {
          copyVc.type = [invalidItemType];
          const body = createBody({vc: copyVc});
          const {result, error} = await verifier.verify({body});
          testBadRequestError({result, error});
        }
      });
      it('MUST not verify if "issuer" is not an object or a string.',
        async function() {
          this.test.cell = {
            columnId: verifierName,
            rowId: this.test.title
          };
          const copyVc = klona(validVc);
          const invalidIssuerTypes = [[], null, undefined, 10, true];
          for(const invalidIssuerType of invalidIssuerTypes) {
            copyVc.issuer = invalidIssuerType;
            const body = createBody({vc: copyVc});
            const {result, error} = await verifier.verify({body});
            testBadRequestError({result, error});
          }
        });
      it('MUST not verify if "credentialSubject" is not an object.',
        async function() {
          this.test.cell = {
            columnId: verifierName,
            rowId: this.test.title
          };
          const copyVc = klona(validVc);
          const invalidCredentialSubjectTypes = [
            'string', null, undefined, 10, true, []
          ];
          for(const invalidType of invalidCredentialSubjectTypes) {
            copyVc.credentialSubject = invalidType;
            const body = createBody({vc: copyVc});
            const {result, error} = await verifier.verify({body});
            testBadRequestError({result, error});
          }
        });
      it('MUST not verify if "proof" is not an object.', async function() {
        this.test.cell = {
          columnId: verifierName,
          rowId: this.test.title
        };
        const copyVc = klona(validVc);
        const invalidProofTypes = ['string', null, undefined, 10, true, []];
        for(const invalidProofType of invalidProofTypes) {
          copyVc.proof = invalidProofType;
          const body = createBody({vc: copyVc});
          const {result, error} = await verifier.verify({body});
          testBadRequestError({result, error});
        }
      });
    });
  }
});
