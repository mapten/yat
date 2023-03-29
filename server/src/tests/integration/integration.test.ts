import { describe, it, assert } from 'vitest';
import supertest from 'supertest';

import { app } from '../../main';

// Services
import { createAuthToken } from '../../services/token.service';

// Models
import { User } from '../../models/user.model';

describe('integration test', () => {
  it('should throw errors when request does not have required tokens and then return a 200 code when contains all required tokens', async () => {
    const responsePing = await supertest(app).get('/generic/ping');
    assert.equal(responsePing.status, 403);

    // get the csrf token and try again
    const responseCsrf = await supertest(app).get('/token/csrf-token');
    const csrfToken = responseCsrf.body.csrfToken;
    const cookies = responseCsrf.headers['set-cookie'];

    const responsePing2 = await supertest(app).get('/generic/ping')
      .set('x-csrf-token', csrfToken)
      .set('Cookie', cookies[0]);
  
    assert.equal(responsePing2.status, 401);

    // get the auth token and try again
    const token = createAuthToken({ id: '1', email: 'test@test.com' } as User);

    const responsePing3 = await supertest(app).get('/generic/ping')
      .set('x-csrf-token', csrfToken)
      .set('Cookie', cookies)
      .set('Authorization', `Bearer ${token}`);
    assert.equal(responsePing3.status, 200);

  });
});