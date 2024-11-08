import { render } from '@testing-library/react';

window.fetch = jest.fn().mockImplementation(() =>
  Promise.resolve({
    ok: true,
    json: () => [],
  }),
);

describe('Root page', () => {});
