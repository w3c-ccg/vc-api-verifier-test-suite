/*!
 * Copyright (c) 2022 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const chai = require('chai');
const implementations = require('../implementations.js');
const Implementation = require('./implementation.js');
const validVC = require('../mock-data/valid-vc.json');

const should = chai.should();

const test = [
  'Digital Bazaar'
];

// only test listed implementations
const testAPIs = implementations.filter(v => test.includes(v.name));

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
  for(const verifier of testAPIs) {
    columnNames.push(verifier.name);
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
      it('MUST not verify if "@context" property is missing.',
        async function() {
          this.test.cell = {
            columnId: verifier.name,
            rowId: this.test.title
          };
          const implementation = new Implementation(verifier);
          const noContextVC = {...validVC};
          delete noContextVC['@context'];
          let response;
          let err;
          try {
            response = await implementation.verify({
              credential: noContextVC
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
          columnId: verifier.name,
          rowId: this.test.title
        };
        const implementation = new Implementation(verifier);
        const noTypeVC = {...validVC};
        delete noTypeVC.type;
        let response;
        let err;
        try {
          response = await implementation.verify({
            credential: noTypeVC
          });
        } catch(e) {
          err = e;
        }
        should.exist(err);
        should.not.exist(response);
        err.status.should.equal(400);
        err.data.verified.should.equal(false);
      });
      it('MUST not verify if "issuer" property is missing.', async function() {
        this.test.cell = {
          columnId: verifier.name,
          rowId: this.test.title
        };
        const implementation = new Implementation(verifier);
        const noIssuerVC = {...validVC};
        delete noIssuerVC.issuer;
        let response;
        let err;
        try {
          response = await implementation.verify({
            credential: noIssuerVC
          });
        } catch(e) {
          err = e;
        }
        should.exist(err);
        should.not.exist(response);
        err.status.should.equal(400);
        err.data.verified.should.equal(false);
      });
      it('MUST not verify if "credentialSubject" property is missing.',
        async function() {
          this.test.cell = {
            columnId: verifier.name,
            rowId: this.test.title
          };
          const implementation = new Implementation(verifier);
          const noCredentialSubjectVC = {...validVC};
          delete noCredentialSubjectVC.credentialSubject;
          let response;
          let err;
          try {
            response = await implementation.verify({
              credential: noCredentialSubjectVC
            });
          } catch(e) {
            err = e;
          }
          should.exist(err);
          should.not.exist(response);
          err.status.should.equal(400);
          err.data.verified.should.equal(false);
        });
      it('MUST not verify if "proof" property is missing.', async function() {
        this.test.cell = {
          columnId: verifier.name,
          rowId: this.test.title
        };
        const implementation = new Implementation(verifier);
        const noProofVC = {...validVC};
        delete noProofVC.proof;
        let response;
        let err;
        try {
          response = await implementation.verify({
            credential: noProofVC
          });
        } catch(e) {
          err = e;
        }
        should.exist(err);
        should.not.exist(response);
        err.status.should.equal(400);
        err.data.verified.should.equal(false);
      });
      it('MUST not verify if "proof.type" property is missing.',
        async function() {
          this.test.cell = {
            columnId: verifier.name,
            rowId: this.test.title
          };
          const implementation = new Implementation(verifier);
          const noProofTypeVC = {...validVC};
          delete noProofTypeVC.proof.type;
          let response;
          let err;
          try {
            response = await implementation.verify({
              credential: noProofTypeVC
            });
          } catch(e) {
            err = e;
          }
          should.exist(err);
          should.not.exist(response);
          err.status.should.equal(400);
          err.data.verified.should.equal(false);
        });
      it('MUST not verify if "proof.created" property is missing.',
        async function() {
          this.test.cell = {
            columnId: verifier.name,
            rowId: this.test.title
          };
          const implementation = new Implementation(verifier);
          const noProofCreatedVC = {...validVC};
          delete noProofCreatedVC.proof.created;
          let response;
          let err;
          try {
            response = await implementation.verify({
              credential: noProofCreatedVC
            });
          } catch(e) {
            err = e;
          }
          should.exist(err);
          should.not.exist(response);
          err.status.should.equal(400);
          err.data.verified.should.equal(false);
        });
      it('MUST not verify if "proof.verificationMethod" property is missing.',
        async function() {
          this.test.cell = {
            columnId: verifier.name,
            rowId: this.test.title
          };
          const implementation = new Implementation(verifier);
          const noProofVerificationMethodVC = {...validVC};
          delete noProofVerificationMethodVC.proof.verificationMethod;
          let response;
          let err;
          try {
            response = await implementation.verify({
              credential: noProofVerificationMethodVC
            });
          } catch(e) {
            err = e;
          }
          should.exist(err);
          should.not.exist(response);
          err.status.should.equal(400);
          err.data.verified.should.equal(false);
        });
      it('MUST not verify if "proof.proofValue" property is missing.',
        async function() {
          this.test.cell = {
            columnId: verifier.name,
            rowId: this.test.title
          };
          const implementation = new Implementation(verifier);
          const noProofValueVC = {...validVC};
          delete noProofValueVC.proof.proofValue;
          let response;
          let err;
          try {
            response = await implementation.verify({
              credential: noProofValueVC
            });
          } catch(e) {
            err = e;
          }
          should.exist(err);
          should.not.exist(response);
          err.status.should.equal(400);
          err.data.verified.should.equal(false);
        });
      it('MUST not verify if "proof.proofPurpose" property is missing.',
        async function() {
          this.test.cell = {
            columnId: verifier.name,
            rowId: this.test.title
          };
          const implementation = new Implementation(verifier);
          const noProofPurposeVC = {...validVC};
          delete noProofPurposeVC.proof.proofPurpose;
          let response;
          let err;
          try {
            response = await implementation.verify({
              credential: noProofPurposeVC
            });
          } catch(e) {
            err = e;
          }
          should.exist(err);
          should.not.exist(response);
          err.status.should.equal(400);
          err.data.verified.should.equal(false);
        });
      it('MUST not verify if "@context" is not an array.', async function() {
        this.test.cell = {
          columnId: verifier.name,
          rowId: this.test.title
        };
        const implementation = new Implementation(verifier);
        const copyVC = {...validVC};
        const invalidContextTypes = ['string', {}, null, undefined, 10, true];
        for(const invalidContextType of invalidContextTypes) {
          copyVC['@context'] = invalidContextType;
          let response;
          let err;
          try {
            response = await implementation.verify({
              credential: copyVC
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
            columnId: verifier.name,
            rowId: this.test.title
          };
          const implementation = new Implementation(verifier);
          const copyVC = {...validVC};
          const invalidContextItemTypes = [[], {}, null, undefined, 10, true];
          for(const invalidContextItemType of invalidContextItemTypes) {
            copyVC['@context'] = [invalidContextItemType];
            let response;
            let err;
            try {
              response = await implementation.verify({
                credential: copyVC
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
          columnId: verifier.name,
          rowId: this.test.title
        };
        const implementation = new Implementation(verifier);
        const copyVC = {...validVC};
        const invalidTypes = ['string', {}, null, undefined, 10, true];
        for(const invalidType of invalidTypes) {
          copyVC.type = invalidType;
          let response;
          let err;
          try {
            response = await implementation.verify({
              credential: copyVC
            });
          } catch(e) {
            err = e;
          }
          should.exist(err);
          should.not.exist(response);
          err.status.should.equal(400);
          err.data.verified.should.equal(false);
        }
      });
      it('MUST not verify if "type" items are not strings.', async function() {
        this.test.cell = {
          columnId: verifier.name,
          rowId: this.test.title
        };
        const implementation = new Implementation(verifier);
        const copyVC = {...validVC};
        const invalidTypeItemTypes = [[], {}, null, undefined, 10, true];
        for(const invalidItemType of invalidTypeItemTypes) {
          copyVC.type = [invalidItemType];
          let response;
          let err;
          try {
            response = await implementation.verify({
              credential: copyVC
            });
          } catch(e) {
            err = e;
          }
          should.exist(err);
          should.not.exist(response);
          err.status.should.equal(400);
          err.data.verified.should.equal(false);
        }
      });
      it('MUST not verify  if "issuer" is not an object or a string.',
        async function() {
          this.test.cell = {
            columnId: verifier.name,
            rowId: this.test.title
          };
          const implementation = new Implementation(verifier);
          const copyVC = {...validVC};
          const invalidIssuerTypes = [[], null, undefined, 10, true];
          for(const invalidIssuerType of invalidIssuerTypes) {
            copyVC.issuer = invalidIssuerType;
            let response;
            let err;
            try {
              response = await implementation.verify({
                credential: copyVC
              });
            } catch(e) {
              err = e;
            }
            should.exist(err);
            should.not.exist(response);
            err.status.should.equal(400);
            err.data.verified.should.equal(false);
          }
        });
      it('MUST not verify if "credentialSubject" is not an object.',
        async function() {
          this.test.cell = {
            columnId: verifier.name,
            rowId: this.test.title
          };
          const implementation = new Implementation(verifier);
          const copyVC = {...validVC};
          const invalidCredentialSubjectTypes = [
            'string', null, undefined, 10, true, []
          ];
          for(const invalidType of invalidCredentialSubjectTypes) {
            copyVC.credentialSubject = invalidType;
            let response;
            let err;
            try {
              response = await implementation.verify({
                credential: copyVC
              });
            } catch(e) {
              err = e;
            }
            should.exist(err);
            should.not.exist(response);
            err.status.should.equal(400);
            err.data.verified.should.equal(false);
          }
        });
      it('MUST not verify if "proof" is not an object.', async function() {
        this.test.cell = {
          columnId: verifier.name,
          rowId: this.test.title
        };
        const implementation = new Implementation(verifier);
        const copyVC = {...validVC};
        const invalidProofTypes = ['string', null, undefined, 10, true, []];
        for(const invalidProofType of invalidProofTypes) {
          copyVC.proof = invalidProofType;
          let response;
          let err;
          try {
            response = await implementation.verify({
              credential: copyVC
            });
          } catch(e) {
            err = e;
          }
          should.exist(err);
          should.not.exist(response);
          err.status.should.equal(400);
          err.data.verified.should.equal(false);
        }
      });
    });
  }
});
