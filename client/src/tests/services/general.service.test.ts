import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

// Services
import { pingToServer } from '../../services/general.service';

describe('general.service', () => {
  let mockAxios: MockAdapter;

  beforeEach(() => {
    mockAxios = new MockAdapter(axios);
  });

  afterEach(() => {
    mockAxios.restore();
  });

  it('should return a true when the response is 200', async () => {
    // arrange
    mockAxios.onGet().reply(200);

    // act
    const result = await pingToServer();

    // assert
    expect(result).toBe(true);
  });

  it('should return a true when the response is 200', async () => {
    // arrange
    mockAxios.onGet().reply(500);

    // act, assert
    expect(await pingToServer()).toBe(false);
  }, 30000);
});