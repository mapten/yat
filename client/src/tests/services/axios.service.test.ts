import { afterEach, beforeEach, describe, vi, it, expect } from 'vitest';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Store
import * as authStore from '../../store/auth.store';

// Services
import { getAxiosApiInstance } from '../../services/axios.service';

describe('getAxiosApiInstance', () => {
  let mockAxios: MockAdapter;

  const originalViteApiAxiosRetriesEnv = import.meta.env.VITE_API_AXIOS_RETRIES;

  beforeEach(() => {
    mockAxios = new MockAdapter(axios);
  });

  afterEach(() => {
    import.meta.env.VITE_API_AXIOS_RETRIES = originalViteApiAxiosRetriesEnv;
    mockAxios.restore();
  });

  it('should contain the Bearer token in the header', async () => {
    // arrange
    vi.spyOn(authStore, 'getTokenNonReactComponent').mockReturnValueOnce('footoken');

    mockAxios.onGet().reply(200);

    // act
    const result = await getAxiosApiInstance('foo').get('/foo');

    // assert
    expect(result.config.headers.Authorization).toBe('Bearer footoken');
  });

  it('should return a 200 code when fails less than 5 times and the last time is a success code (200)', async () => {
    // arrange
    import.meta.env.VITE_API_AXIOS_RETRIES = 5;

    mockAxios.onGet().replyOnce(500)
      .onGet().replyOnce(510)
      .onGet().replyOnce(200, 'foo');

    // act
    const result = await getAxiosApiInstance('').get('/foo');

    // assert
    expect(result.data).toBe('foo');
  }, 30000);

  it('should return an error code when fails less than "import.meta.env.VITE_API_AXIOS_RETRIES" times and the last time is an error', async() => {
    // arrange
    import.meta.env.VITE_API_AXIOS_RETRIES = 3;

    mockAxios.onGet().reply(500)
      .onGet().replyOnce(() => {
        throw new Error();
      });

    // act
    const result = getAxiosApiInstance('').get('/foo');

    // assert
    await expect(result).rejects.toThrow('Request failed with status code 500');
  }, 30000);

  it('should return an error code when fails more than 5 times and the 5th time is an error code', async () => {
    // arrange
    import.meta.env.VITE_API_AXIOS_RETRIES = 5;

    expect.assertions(3);

    let count = 0;

    mockAxios
      .onGet().replyOnce(() => {
        count++;
        return [500, '1'];
      })
      .onGet().replyOnce(() => {
        count++;
        return [500, '2'];
      })
      .onGet().replyOnce(() => {
        count++;
        return [510, '3'];
      })
      .onGet().replyOnce(() => {
        count++;
        return [500, '4'];
      })
      .onGet().replyOnce(() => {
        count++;
        return [500, '5'];
      })
      .onGet().replyOnce(() => {
        count++;
        return [512, '6'];
      })
      .onGet().replyOnce(() => {
        count++;
        return [500, '7'];
      })
      .onGet().replyOnce(200, 'foo');

    // act
    await getAxiosApiInstance('').get('/foo').catch((error) => {
      // assert
      expect(error.response.status).toBe(512);
      expect(error.response.data).toBe(6);
    });

    // assert
    expect(count).toBe(6);

    // assert
  }, 30000);

  it('should take a status code as 200 when status code from server is null', async () => {
    // arrange
    expect.assertions(1);

    mockAxios.onGet().networkError();

    // act
    await getAxiosApiInstance('').get('/foo')
      .then(() => {
        // fail
        expect(true).toBe(false);
      })
      .catch((error) => {
        // assert
        expect(error.message).toBe('Network Error');
      });
  }, 30000);

  it('should not retry when status is smaller than 400', async () => {
    // arrange
    expect.assertions(2);

    let count = 0;

    mockAxios
      .onGet().replyOnce(() => {
        count++;
        return [300, '1'];
      })
      .onGet().replyOnce(() => {
        count++;
        return [200, '2'];
      });

    // act
    await getAxiosApiInstance('').get('/foo')
      .then(() => {
        // fail
        expect(true).toBe(false);
      })
      .catch((error) => {
        // assert
        expect(error.response.status).toBe(300);
      });
    
    expect(count).toBe(1);
  }, 30000);
});
