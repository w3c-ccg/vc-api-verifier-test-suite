/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const chai = require('chai');
const implementations = require('../implementations.js');
const {verify} = require('./verify.js');
const validVC = require('../mock-data/valid-vc.json');
const {cloneJSON, testBadRequestError} = require('./helpers');

const should = chai.should();

describe('Verifiable Credentials Verifier API', function() {
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
  for(const implementation of implementations) {
    columnNames.push(implementation.name);
    const verifier = implementation.verifier;
    describe(implementation.name, function() {
      it('MUST verify a valid VC.', async function() {
        // this tells the test report which cell in the interop matrix
        // the result goes in
        this.test.cell = {
          columnId: implementation.name,
          rowId: this.test.title
        };
        const {result, err} = await verify({
          credential: validVC,
          verifier
        });
        should.not.exist(err);
        should.exist(result);
        should.exist(result.status);
        result.status.should.equal(200);
      });
      it('MUST not verify if "@context" property is missing.',
        async function() {
          this.test.cell = {
            columnId: implementation.name,
            rowId: this.test.title
          };
          const noContextVC = cloneJSON(validVC);
          delete noContextVC['@context'];
          const {result, err} = await verify({
            credential: noContextVC,
            verifier
          });
          testBadRequestError({result, err});
        });
      it('MUST not verify if "type" property is missing.', async function() {
        this.test.cell = {
          columnId: implementation.name,
          rowId: this.test.title
        };
        const noTypeVC = cloneJSON(validVC);
        delete noTypeVC.type;
        const {result, err} = await verify({
          credential: noTypeVC,
          verifier
        });
        testBadRequestError({result, err});
      });
      it('MUST not verify if "issuer" property is missing.', async function() {
        this.test.cell = {
          columnId: implementation.name,
          rowId: this.test.title
        };
        const noIssuerVC = cloneJSON(validVC);
        delete noIssuerVC.issuer;
        const {result, err} = await verify({
          credential: noIssuerVC,
          verifier
        });
        testBadRequestError({result, err});
      });
      it('MUST not verify if "credentialSubject" property is missing.',
        async function() {
          this.test.cell = {
            columnId: implementation.name,
            rowId: this.test.title
          };
          const noCredentialSubjectVC = cloneJSON(validVC);
          delete noCredentialSubjectVC.credentialSubject;
          const {result, err} = await verify({
            credential: noCredentialSubjectVC,
            verifier
          });
          testBadRequestError({result, err});
        });
      it('MUST not verify if "proof" property is missing.', async function() {
        this.test.cell = {
          columnId: implementation.name,
          rowId: this.test.title
        };
        const noProofVC = cloneJSON(validVC);
        delete noProofVC.proof;
        const {result, err} = await verify({
          credential: noProofVC,
          verifier
        });
        testBadRequestError({result, err});
      });
      it('MUST not verify if "proof.type" property is missing.',
        async function() {
          this.test.cell = {
            columnId: implementation.name,
            rowId: this.test.title
          };
          const noProofTypeVC = cloneJSON(validVC);
          delete noProofTypeVC.proof.type;
          const {result, err} = await verify({
            credential: noProofTypeVC,
            verifier
          });
          testBadRequestError({result, err});
        });
      it('MUST not verify if "proof.created" property is missing.',
        async function() {
          this.test.cell = {
            columnId: implementation.name,
            rowId: this.test.title
          };
          const noProofCreatedVC = cloneJSON(validVC);
          delete noProofCreatedVC.proof.created;
          const {result, err} = await verify({
            credential: noProofCreatedVC,
            verifier
          });
          testBadRequestError({result, err});
        });
      it('MUST not verify if "proof.verificationMethod" property is missing.',
        async function() {
          this.test.cell = {
            columnId: implementation.name,
            rowId: this.test.title
          };
          const noProofVerificationMethodVC = cloneJSON(validVC);
          delete noProofVerificationMethodVC.proof.verificationMethod;
          const {result, err} = await verify({
            credential: noProofVerificationMethodVC,
            verifier
          });
          testBadRequestError({result, err});
        });
      it('MUST not verify if "proof.proofValue" property is missing.',
        async function() {
          this.test.cell = {
            columnId: implementation.name,
            rowId: this.test.title
          };
          const noProofValueVC = cloneJSON(validVC);
          delete noProofValueVC.proof.proofValue;
          const {result, err} = await verify({
            credential: noProofValueVC,
            verifier
          });
          testBadRequestError({result, err});
        });
      it('MUST not verify if "proof.proofPurpose" property is missing.',
        async function() {
          this.test.cell = {
            columnId: implementation.name,
            rowId: this.test.title
          };
          const noProofPurposeVC = cloneJSON(validVC);
          delete noProofPurposeVC.proof.proofPurpose;
          const {result, err} = await verify({
            credential: noProofPurposeVC,
            verifier
          });
          testBadRequestError({result, err});
        });
      it('MUST not verify if "@context" is not an array.', async function() {
        this.test.cell = {
          columnId: implementation.name,
          rowId: this.test.title
        };
        const copyVC = cloneJSON(validVC);
        const invalidContextTypes = ['string', {}, null, undefined, 10, true];
        for(const invalidContextType of invalidContextTypes) {
          copyVC['@context'] = invalidContextType;
          const {result, err} = await verify({
            credential: copyVC,
            verifier
          });
          testBadRequestError({result, err});
        }
      });
      it('MUST not verify if "@context" items are not strings.',
        async function() {
          this.test.cell = {
            columnId: implementation.name,
            rowId: this.test.title
          };
          const copyVC = cloneJSON(validVC);
          const invalidContextItemTypes = [[], {}, null, undefined, 10, true];
          for(const invalidContextItemType of invalidContextItemTypes) {
            copyVC['@context'] = [invalidContextItemType];
            const {result, err} = await verify({
              credential: copyVC,
              verifier
            });
            testBadRequestError({result, err});
          }
        });
      it('MUST not verify if "type" is not an array.', async function() {
        this.test.cell = {
          columnId: implementation.name,
          rowId: this.test.title
        };
        const copyVC = cloneJSON(validVC);
        const invalidTypes = ['string', {}, null, undefined, 10, true];
        for(const invalidType of invalidTypes) {
          copyVC.type = invalidType;
          const {result, err} = await verify({
            credential: copyVC,
            verifier
          });
          testBadRequestError({result, err});
        }
      });
      it('MUST not verify if "type" items are not strings.', async function() {
        this.test.cell = {
          columnId: implementation.name,
          rowId: this.test.title
        };
        const copyVC = cloneJSON(validVC);
        const invalidTypeItemTypes = [[], {}, null, undefined, 10, true];
        for(const invalidItemType of invalidTypeItemTypes) {
          copyVC.type = [invalidItemType];
          const {result, err} = await verify({
            credential: copyVC,
            verifier
          });
          testBadRequestError({result, err});
        }
      });
      it('MUST not verify if "issuer" is not an object or a string.',
        async function() {
          this.test.cell = {
            columnId: implementation.name,
            rowId: this.test.title
          };
          const copyVC = cloneJSON(validVC);
          const invalidIssuerTypes = [[], null, undefined, 10, true];
          for(const invalidIssuerType of invalidIssuerTypes) {
            copyVC.issuer = invalidIssuerType;
            const {result, err} = await verify({
              credential: copyVC,
              verifier
            });
            testBadRequestError({result, err});
          }
        });
      it('MUST not verify if "credentialSubject" is not an object.',
        async function() {
          this.test.cell = {
            columnId: implementation.name,
            rowId: this.test.title
          };
          const copyVC = cloneJSON(validVC);
          const invalidCredentialSubjectTypes = [
            'string', null, undefined, 10, true, []
          ];
          for(const invalidType of invalidCredentialSubjectTypes) {
            copyVC.credentialSubject = invalidType;
            const {result, err} = await verify({
              credential: copyVC,
              verifier
            });
            testBadRequestError({result, err});
          }
        });
      it('MUST not verify if "proof" is not an object.', async function() {
        this.test.cell = {
          columnId: implementation.name,
          rowId: this.test.title
        };
        const copyVC = cloneJSON(validVC);
        const invalidProofTypes = ['string', null, undefined, 10, true, []];
        for(const invalidProofType of invalidProofTypes) {
          copyVC.proof = invalidProofType;
          const {result, err} = await verify({
            credential: copyVC,
            verifier
          });
          testBadRequestError({result, err});
        }
      });
    });
  }
});
