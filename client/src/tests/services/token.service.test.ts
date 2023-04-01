import MockAdapter from 'axios-mock-adapter';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import axios from 'axios';

// Services
import { fetchCSRFToken } from '../../services/token.service';

describe('token.service', () => {
  let mockAxios: MockAdapter;

  beforeEach(() => {
    mockAxios = new MockAdapter(axios);
  });

  afterEach(() => {
    mockAxios.restore();
  });

  it('should return a token when the response is 200', async () => {
    //arrange, act
    mockAxios.onGet().reply(200, { csrfToken: 'token' });

    const result = await fetchCSRFToken();

    //assert
    expect(result).toBe('token');
  });
});