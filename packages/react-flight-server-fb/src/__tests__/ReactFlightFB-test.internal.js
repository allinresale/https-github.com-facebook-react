/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @emails react-core
 * @jest-environment node
 */

'use strict';

let mockModuleEvaluation;

beforeEach(() => {
  jest.resetModules();
  mockModuleEvaluation = jest.fn();
  jest.mock('react', () => require('react/react.react-server'));
  jest.doMock(
    'UnregisteredFlightAction',
    () => {
      mockModuleEvaluation();
      return {action: () => 'unused'};
    },
    {virtual: true},
  );
});

it('rejects an FB reply server reference before evaluating its module', async () => {
  const ReactFlightServer = require('react-flight-server-fb/src/server/react-flight-dom-server.node');
  const body = new FormData();
  body.set('0', '"$h1"');
  body.set(
    '1',
    JSON.stringify({id: 'UnregisteredFlightAction#action', bound: null}),
  );

  await expect(
    Promise.resolve(ReactFlightServer.decodeReply(body)),
  ).rejects.toThrow(
    'Server-reference decoding is not supported by the FB Flight bundler.',
  );
  expect(mockModuleEvaluation).not.toHaveBeenCalled();
});
