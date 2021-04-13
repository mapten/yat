import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Services
import { getAxiosApiInstance } from './axios.service';

describe('axios service', () => {
  let mockAxios: MockAdapter;

  beforeEach(() => {
    mockAxios = new MockAdapter(axios);
  });

  afterEach(() => {
    mockAxios.restore();
  });

  describe('getAxiosApiInstance', () => {
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

    it('should return an error code when fails less than 5 times and the last time is an error', (done) => {
      // arrange
      mockAxios.onGet().replyOnce(500)
        .onGet().replyOnce(414);

      // act
      getAxiosApiInstance('').get('/foo')
        .then(() => {
          // assert
          expect(false).toBeTruthy();
          done();
        })
        .catch(() => {
          // assert
          expect(true).toBeTruthy();
          done();
        });
    }, 30000);

    it('should return an error code when fails more than 5 times and the 5th time is an error code', (done) => {
      // arrange
      mockAxios.onGet().replyOnce(500)
        .onGet().replyOnce(500)
        .onGet().replyOnce(500)
        .onGet().replyOnce(510)
        .onGet().replyOnce(500)
        .onGet().replyOnce(512)
        .onGet().replyOnce(200, 'foo');

      // act
      getAxiosApiInstance('').get('/foo')
        .then(() => {
          // assert
          expect(false).toBeTruthy();
          done();
        })
        .catch(() => {
          // assert
          expect(true).toBeTruthy();
          done();
        });
    }, 30000);

    it('should take a status code as 200 when status code from server is null', (done) => {
      // arrange
      mockAxios.onGet().networkError();

      // act
      getAxiosApiInstance('').get('/foo')
        .then(() => {
          // assert
          expect(false).toBeTruthy();
          done();
        })
        .catch(() => {
          // assert
          expect(true).toBeTruthy();
          done();
        });
    }, 30000);

    it('should not retry when status is smaller than 400', (done) => {
      // arrange
      mockAxios.onGet().replyOnce(300)
        .onGet().replyOnce(200);

      // act
      getAxiosApiInstance('').get('/foo')
        .then(() => {
          // assert
          expect(false).toBeTruthy();
          done();
        })
        .catch(() => {
          // assert
          expect(true).toBeTruthy();
          done();
        });
    }, 30000);
  });
});
