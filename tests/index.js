/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const chai = require('chai');
const implementations = require('../implementations.js');
const {verify} = require('./verify.js');
const validVC = require('../mock-data/valid-vc.json');
const {cloneJSON} = require('./helpers');

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
  this.columnLabel = 'Issuer';
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
        let response;
        let err;
        try {
          response = await verify({
            credential: validVC,
            verifier
          });
        } catch(e) {
          err = e;
        }
        should.not.exist(err);
        should.exist(response);
        response.status.should.equal(200);
      });
      it('MUST not verify if "@context" property is missing.',
        async function() {
          this.test.cell = {
            columnId: implementation.name,
            rowId: this.test.title
          };
          const noContextVC = cloneJSON(validVC);
          delete noContextVC['@context'];
          let response;
          let err;
          try {
            response = await verify({
              credential: noContextVC,
              verifier
            });
          } catch(e) {
            err = e;
          }
          should.exist(err);
          should.not.exist(response);
          err.status.should.equal(400);
        });
      it('MUST not verify if "type" property is missing.', async function() {
        this.test.cell = {
          columnId: implementation.name,
          rowId: this.test.title
        };
        const noTypeVC = cloneJSON(validVC);
        delete noTypeVC.type;
        let response;
        let err;
        try {
          response = await verify({
            credential: noTypeVC,
            verifier
          });
        } catch(e) {
          err = e;
        }
        should.exist(err);
        should.not.exist(response);
        err.status.should.equal(400);
      });
      it('MUST not verify if "issuer" property is missing.', async function() {
        this.test.cell = {
          columnId: implementation.name,
          rowId: this.test.title
        };
        const noIssuerVC = cloneJSON(validVC);
        delete noIssuerVC.issuer;
        let response;
        let err;
        try {
          response = await verify({
            credential: noIssuerVC,
            verifier
          });
        } catch(e) {
          err = e;
        }
        should.exist(err);
        should.not.exist(response);
        err.status.should.equal(400);
      });
      it('MUST not verify if "credentialSubject" property is missing.',
        async function() {
          this.test.cell = {
            columnId: implementation.name,
            rowId: this.test.title
          };
          const noCredentialSubjectVC = cloneJSON(validVC);
          delete noCredentialSubjectVC.credentialSubject;
          let response;
          let err;
          try {
            response = await verify({
              credential: noCredentialSubjectVC,
              verifier
            });
          } catch(e) {
            err = e;
          }
          should.exist(err);
          should.not.exist(response);
          err.status.should.equal(400);
        });
      it('MUST not verify if "proof" property is missing.', async function() {
        this.test.cell = {
          columnId: implementation.name,
          rowId: this.test.title
        };
        const noProofVC = cloneJSON(validVC);
        delete noProofVC.proof;
        let response;
        let err;
        try {
          response = await verify({
            credential: noProofVC,
            verifier
          });
        } catch(e) {
          err = e;
        }
        should.exist(err);
        should.not.exist(response);
        err.status.should.equal(400);
      });
      it('MUST not verify if "proof.type" property is missing.',
        async function() {
          this.test.cell = {
            columnId: implementation.name,
            rowId: this.test.title
          };
          const noProofTypeVC = cloneJSON(validVC);
          delete noProofTypeVC.proof.type;
          let response;
          let err;
          try {
            response = await verify({
              credential: noProofTypeVC,
              verifier
            });
          } catch(e) {
            err = e;
          }
          should.exist(err);
          should.not.exist(response);
          err.status.should.equal(400);
        });
      it('MUST not verify if "proof.created" property is missing.',
        async function() {
          this.test.cell = {
            columnId: implementation.name,
            rowId: this.test.title
          };
          const noProofCreatedVC = cloneJSON(validVC);
          delete noProofCreatedVC.proof.created;
          let response;
          let err;
          try {
            response = await verify({
              credential: noProofCreatedVC,
              verifier
            });
          } catch(e) {
            err = e;
          }
          should.exist(err);
          should.not.exist(response);
          err.status.should.equal(400);
        });
      it('MUST not verify if "proof.verificationMethod" property is missing.',
        async function() {
          this.test.cell = {
            columnId: implementation.name,
            rowId: this.test.title
          };
          const noProofVerificationMethodVC = cloneJSON(validVC);
          delete noProofVerificationMethodVC.proof.verificationMethod;
          let response;
          let err;
          try {
            response = await verify({
              credential: noProofVerificationMethodVC,
              verifier
            });
          } catch(e) {
            err = e;
          }
          should.exist(err);
          should.not.exist(response);
          err.status.should.equal(400);
        });
      it('MUST not verify if "proof.proofValue" property is missing.',
        async function() {
          this.test.cell = {
            columnId: implementation.name,
            rowId: this.test.title
          };
          const noProofValueVC = cloneJSON(validVC);
          delete noProofValueVC.proof.proofValue;
          let response;
          let err;
          try {
            response = await verify({
              credential: noProofValueVC,
              verifier
            });
          } catch(e) {
            err = e;
          }
          should.exist(err);
          should.not.exist(response);
          err.status.should.equal(400);
        });
      it('MUST not verify if "proof.proofPurpose" property is missing.',
        async function() {
          this.test.cell = {
            columnId: implementation.name,
            rowId: this.test.title
          };
          const noProofPurposeVC = cloneJSON(validVC);
          delete noProofPurposeVC.proof.proofPurpose;
          let response;
          let err;
          try {
            response = await verify({
              credential: noProofPurposeVC,
              verifier
            });
          } catch(e) {
            err = e;
          }
          should.exist(err);
          should.not.exist(response);
          err.status.should.equal(400);
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
          let response;
          let err;
          try {
            response = await verify({
              credential: copyVC,
              verifier
            });
          } catch(e) {
            err = e;
          }
          should.exist(err);
          should.not.exist(response);
          err.status.should.equal(400);
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
            let response;
            let err;
            try {
              response = await verify({
                credential: copyVC,
                verifier
              });
            } catch(e) {
              err = e;
            }
            should.exist(err);
            should.not.exist(response);
            err.status.should.equal(400);
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
          let response;
          let err;
          try {
            response = await verify({
              credential: copyVC,
              verifier
            });
          } catch(e) {
            err = e;
          }
          should.exist(err);
          should.not.exist(response);
          err.status.should.equal(400);
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
          let response;
          let err;
          try {
            response = await verify({
              credential: copyVC,
              verifier
            });
          } catch(e) {
            err = e;
          }
          should.exist(err);
          should.not.exist(response);
          err.status.should.equal(400);
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
            let response;
            let err;
            try {
              response = await verify({
                credential: copyVC,
                verifier
              });
            } catch(e) {
              err = e;
            }
            should.exist(err);
            should.not.exist(response);
            err.status.should.equal(400);
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
            let response;
            let err;
            try {
              response = await verify({
                credential: copyVC,
                verifier
              });
            } catch(e) {
              err = e;
            }
            should.exist(err);
            should.not.exist(response);
            err.status.should.equal(400);
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
          let response;
          let err;
          try {
            response = await verify({
              credential: copyVC,
              verifier
            });
          } catch(e) {
            err = e;
          }
          should.exist(err);
          should.not.exist(response);
          err.status.should.equal(400);
        }
      });
    });
  }
});
