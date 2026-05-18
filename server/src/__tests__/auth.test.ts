import request from 'supertest';
import app from '../app';
import { UserRole } from '../interfaces';

describe('Auth API', () => {
  it('registers, logs in, and returns the current user', async () => {
    const registerPayload = {
      name: 'Test User',
      email: 'test.user@example.com',
      password: 'password123',
      role: UserRole.ADMIN,
    };

    const registerRes = await request(app)
      .post('/api/auth/register')
      .send(registerPayload);

    expect(registerRes.status).toBe(201);
    expect(registerRes.body.success).toBe(true);
    expect(registerRes.body.data.user.email).toBe(registerPayload.email);
    expect(registerRes.body.data.token).toBeTruthy();

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: registerPayload.email, password: registerPayload.password });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.success).toBe(true);
    expect(loginRes.body.data.token).toBeTruthy();

    const meRes = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${loginRes.body.data.token}`);

    expect(meRes.status).toBe(200);
    expect(meRes.body.data.email).toBe(registerPayload.email);
    expect(meRes.body.data.role).toBe(UserRole.ADMIN);
  });
});
