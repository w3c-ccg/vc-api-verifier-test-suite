/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const chai = require('chai');
const {implementations} = require('vc-api-test-suite-implementations');
const validVC = require('../mock-data/valid-vc-jwt.json');
const {cloneJSON, testBadRequestError, createBody} = require('./helpers');

const should = chai.should();

describe.skip('Verify Credential - JWT', function() {
  const summaries = new Set();
  this.summary = summaries;
  // column names for the matrix go here
  const columnNames = [];
  const reportData = [];
  // this will tell the report
  // to make an interop matrix with this suite
  this.matrix = true;
  this.report = true;
  this.columns = columnNames;
  this.rowLabel = 'Test Name';
  this.columnLabel = 'Verifier';
  // the reportData will be displayed under the test title
  this.reportData = reportData;
  for(const [name, implementation] of implementations) {
    columnNames.push(name);
    const verifier = implementation.verifiers.find(
      verifier => verifier.tags.has('VC-HTTP-API'));
    describe(name, function() {
      it('MUST verify a valid VC.', async function() {
        // this tells the test report which cell in the interop matrix
        // the result goes in
        this.test.cell = {
          columnId: name,
          rowId: this.test.title
        };
        const body = createBody({vc: validVC});
        const {result, error} = await verifier.verify({body});
        should.not.exist(error);
        should.exist(result);
        should.exist(result.status);
        result.status.should.equal(200);
      });
      it('MUST not verify if "@context" property is missing.',
        async function() {
          this.test.cell = {
            columnId: name,
            rowId: this.test.title
          };
          const noContextVC = cloneJSON(validVC);
          delete noContextVC['@context'];
          const body = createBody({vc: noContextVC});
          const {result, error} = await verifier.verify({body});
          testBadRequestError({result, error});
        });
      it('MUST not verify if "type" property is missing.', async function() {
        this.test.cell = {
          columnId: name,
          rowId: this.test.title
        };
        const noTypeVC = cloneJSON(validVC);
        delete noTypeVC.type;
        const body = createBody({vc: noTypeVC});
        const {result, error} = await verifier.verify({body});
        testBadRequestError({result, error});
      });
      it('MUST not verify if "issuer" property is missing.', async function() {
        this.test.cell = {
          columnId: name,
          rowId: this.test.title
        };
        const noIssuerVC = cloneJSON(validVC);
        delete noIssuerVC.issuer;
        const body = createBody({vc: noIssuerVC});
        const {result, error} = await verifier.verify({body});
        testBadRequestError({result, error});
      });
      it('MUST not verify if "credentialSubject" property is missing.',
        async function() {
          this.test.cell = {
            columnId: name,
            rowId: this.test.title
          };
          const noCredentialSubjectVC = cloneJSON(validVC);
          delete noCredentialSubjectVC.credentialSubject;
          const body = createBody({vc: noCredentialSubjectVC});
          const {result, error} = await verifier.verify({body});
          testBadRequestError({result, error});
        });
      it('MUST not verify if "proof" property is missing.', async function() {
        this.test.cell = {
          columnId: name,
          rowId: this.test.title
        };
        const noProofVC = cloneJSON(validVC);
        delete noProofVC.proof;
        const body = createBody({vc: noProofVC});
        const {result, error} = await verifier.verify({body});
        testBadRequestError({result, error});
      });
      it('MUST not verify if "proof.type" property is missing.',
        async function() {
          this.test.cell = {
            columnId: name,
            rowId: this.test.title
          };
          const noProofTypeVC = cloneJSON(validVC);
          delete noProofTypeVC.proof.type;
          const body = createBody({vc: noProofTypeVC});
          const {result, error} = await verifier.verify({body});
          testBadRequestError({result, error});
        });
      it('MUST not verify if "proof.created" property is missing.',
        async function() {
          this.test.cell = {
            columnId: name,
            rowId: this.test.title
          };
          const noProofCreatedVC = cloneJSON(validVC);
          delete noProofCreatedVC.proof.created;
          const body = createBody({vc: noProofCreatedVC});
          const {result, error} = await verifier.verify({body});
          testBadRequestError({result, error});
        });
      it('MUST not verify if "proof.verificationMethod" property is missing.',
        async function() {
          this.test.cell = {
            columnId: name,
            rowId: this.test.title
          };
          const noProofVerificationMethodVC = cloneJSON(validVC);
          delete noProofVerificationMethodVC.proof.verificationMethod;
          const body = createBody({vc: noProofVerificationMethodVC});
          const {result, error} = await verifier.verify({body});
          testBadRequestError({result, error});
        });
      it('MUST not verify if "proof.proofValue" property is missing.',
        async function() {
          this.test.cell = {
            columnId: name,
            rowId: this.test.title
          };
          const noProofValueVC = cloneJSON(validVC);
          delete noProofValueVC.proof.proofValue;
          const body = createBody({vc: noProofValueVC});
          const {result, error} = await verifier.verify({body});
          testBadRequestError({result, error});
        });
      it('MUST not verify if "proof.proofPurpose" property is missing.',
        async function() {
          this.test.cell = {
            columnId: name,
            rowId: this.test.title
          };
          const noProofPurposeVC = cloneJSON(validVC);
          delete noProofPurposeVC.proof.proofPurpose;
          const body = createBody({vc: noProofPurposeVC});
          const {result, error} = await verifier.verify({body});
          testBadRequestError({result, error});
        });
      it('MUST not verify if "@context" is not an array.', async function() {
        this.test.cell = {
          columnId: name,
          rowId: this.test.title
        };
        const copyVC = cloneJSON(validVC);
        const invalidContextTypes = ['string', {}, null, undefined, 10, true];
        for(const invalidContextType of invalidContextTypes) {
          copyVC['@context'] = invalidContextType;
          const body = createBody({vc: copyVC});
          const {result, error} = await verifier.verify({body});
          testBadRequestError({result, error});
        }
      });
      it('MUST not verify if "@context" items are not strings.',
        async function() {
          this.test.cell = {
            columnId: name,
            rowId: this.test.title
          };
          const copyVC = cloneJSON(validVC);
          const invalidContextItemTypes = [[], {}, null, undefined, 10, true];
          for(const invalidContextItemType of invalidContextItemTypes) {
            copyVC['@context'] = [invalidContextItemType];
            const body = createBody({vc: copyVC});
            const {result, error} = await verifier.verify({body});
            testBadRequestError({result, error});
          }
        });
      it('MUST not verify if "type" is not an array.', async function() {
        this.test.cell = {
          columnId: name,
          rowId: this.test.title
        };
        const copyVC = cloneJSON(validVC);
        const invalidTypes = ['string', {}, null, undefined, 10, true];
        for(const invalidType of invalidTypes) {
          copyVC.type = invalidType;
          const body = createBody({vc: copyVC});
          const {result, error} = await verifier.verify({body});
          testBadRequestError({result, error});
        }
      });
      it('MUST not verify if "type" items are not strings.', async function() {
        this.test.cell = {
          columnId: name,
          rowId: this.test.title
        };
        const copyVC = cloneJSON(validVC);
        const invalidTypeItemTypes = [[], {}, null, undefined, 10, true];
        for(const invalidItemType of invalidTypeItemTypes) {
          copyVC.type = [invalidItemType];
          const body = createBody({vc: copyVC});
          const {result, error} = await verifier.verify({body});
          testBadRequestError({result, error});
        }
      });
      it('MUST not verify if "issuer" is not an object or a string.',
        async function() {
          this.test.cell = {
            columnId: name,
            rowId: this.test.title
          };
          const copyVC = cloneJSON(validVC);
          const invalidIssuerTypes = [[], null, undefined, 10, true];
          for(const invalidIssuerType of invalidIssuerTypes) {
            copyVC.issuer = invalidIssuerType;
            const body = createBody({vc: copyVC});
            const {result, error} = await verifier.verify({body});
            testBadRequestError({result, error});
          }
        });
      it('MUST not verify if "credentialSubject" is not an object.',
        async function() {
          this.test.cell = {
            columnId: name,
            rowId: this.test.title
          };
          const copyVC = cloneJSON(validVC);
          const invalidCredentialSubjectTypes = [
            'string', null, undefined, 10, true, []
          ];
          for(const invalidType of invalidCredentialSubjectTypes) {
            copyVC.credentialSubject = invalidType;
            const body = createBody({vc: copyVC});
            const {result, error} = await verifier.verify({body});
            testBadRequestError({result, error});
          }
        });
      it('MUST not verify if "proof" is not an object.', async function() {
        this.test.cell = {
          columnId: name,
          rowId: this.test.title
        };
        const copyVC = cloneJSON(validVC);
        const invalidProofTypes = ['string', null, undefined, 10, true, []];
        for(const invalidProofType of invalidProofTypes) {
          copyVC.proof = invalidProofType;
          const body = createBody({vc: copyVC});
          const {result, error} = await verifier.verify({body});
          testBadRequestError({result, error});
        }
      });
    });
  }
});
