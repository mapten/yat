import { afterEach, beforeEach, describe, it, expect } from 'vitest';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Services
import { getAxiosApiInstance } from '../../services/axios.service';

describe('getAxiosApiInstance', () => {
  let mockAxios: MockAdapter;

  beforeEach(() => {
    mockAxios = new MockAdapter(axios);
  });

  afterEach(() => {
    mockAxios.restore();
  });

  it('should return a 200 code when fails less than 5 times and the last time is a success code (200)', async () => {
    // arrange
    mockAxios.onGet().replyOnce(500)
      .onGet().replyOnce(400)
      .onGet().replyOnce(200, 'foo');

    // act
    const result = await getAxiosApiInstance('').get('/foo');

    // assert
    expect(result.data).toBe('foo');
  }, 30000);

  it('should return an error code when fails less than 5 times and the last time is an error', async() => {
    // arrange
    mockAxios.onGet().replyOnce(500)
      .onGet().replyOnce(() => {
        throw new Error('foo error');
      });

    // act
    const result = getAxiosApiInstance('').get('/foo');

    // assert
    await expect(result).rejects.toThrow('foo error');
  }, 30000);

  it('should return an error code when fails more than 5 times and the 5th time is an error code', async () => {
    // arrange
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
