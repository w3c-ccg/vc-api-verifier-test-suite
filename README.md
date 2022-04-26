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

## Implementation
To add your implementation to this test suite see the [README here.](https://github.com/w3c-ccg/vc-api-test-suite-implementations)
Add the tag `VC-API` to the issuers and verifiers you want tested.
To run the tests, some implementations require client secrets that can be
passed as env variables to the test script. To see which ones require client
secrets, you can check the `vc-api-test-suite-implementations` library.
