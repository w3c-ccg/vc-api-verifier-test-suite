# vc-api-verifier-test-suite

Test Suite for Verifiers that implement the VC HTTP API

## Table of Contents

- [Background](#background)
- [Install](#install)
- [Usage](#usage)
- [Implementation](#implementation)

## Background

Provides interoperability tests for verifiers that support [VC-API](https://w3c-ccg.github.io/vc-api/).

## Install

```js
git clone git@github.com:w3c-ccg/vc-api-verifier-test-suite.git
cd vc-api-verifier-test-suite
npm i
```

## Usage

```
npm test
```

Note: The default issuer is set to `Digital Bazaar`, you can change the
issuer by setting the `ISSUER_NAME` env variable.

## Implementation

To add your implementation to this test suite see the
`w3c-ccg/vc-test-suite-implementations` [README](https://github.com/w3c-ccg/vc-test-suite-implementations/blob/main/README.md). Add the tag `vc-api` to the verifiers you want
to run the tests against.

Note: To run the tests, some implementations require client secrets that can be
passed as env variables to the test script. To see which ones require client
secrets, you can check configs in the `w3c-ccg/vc-test-suite-implementations`
repo.
