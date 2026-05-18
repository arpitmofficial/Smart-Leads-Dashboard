import request from 'supertest';
import app from '../app';
import { LeadStatus, LeadSource, UserRole } from '../interfaces';

const registerAndLogin = async () => {
  const registerPayload = {
    name: 'Lead Owner',
    email: 'lead.owner@example.com',
    password: 'password123',
    role: UserRole.SALES,
  };

  await request(app).post('/api/auth/register').send(registerPayload);

  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ email: registerPayload.email, password: registerPayload.password });

  return loginRes.body.data.token as string;
};

describe('Leads API', () => {
  it('enforces a 10-record page size and returns pagination metadata', async () => {
    const token = await registerAndLogin();

    const leadsPayloads = Array.from({ length: 12 }, (_, index) => ({
      name: `Lead ${index + 1}`,
      email: `lead${index + 1}@example.com`,
      status: LeadStatus.NEW,
      source: LeadSource.WEBSITE,
    }));

    for (const payload of leadsPayloads) {
      await request(app)
        .post('/api/leads')
        .set('Authorization', `Bearer ${token}`)
        .send(payload);
    }

    const listRes = await request(app)
      .get('/api/leads?page=1&limit=5')
      .set('Authorization', `Bearer ${token}`);

    expect(listRes.status).toBe(200);
    expect(listRes.body.data).toHaveLength(10);
    expect(listRes.body.pagination.limit).toBe(10);
    expect(listRes.body.pagination.totalRecords).toBe(12);
    expect(listRes.body.pagination.totalPages).toBe(2);
  });

  it('applies combined filters and search', async () => {
    const token = await registerAndLogin();

    await request(app)
      .post('/api/leads')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Rahul Sharma',
        email: 'rahul@example.com',
        status: LeadStatus.QUALIFIED,
        source: LeadSource.INSTAGRAM,
      });

    await request(app)
      .post('/api/leads')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Maya Singh',
        email: 'maya@example.com',
        status: LeadStatus.NEW,
        source: LeadSource.REFERRAL,
      });

    const listRes = await request(app)
      .get('/api/leads?status=Qualified&source=Instagram&search=rahul')
      .set('Authorization', `Bearer ${token}`);

    expect(listRes.status).toBe(200);
    expect(listRes.body.data).toHaveLength(1);
    expect(listRes.body.data[0].name).toBe('Rahul Sharma');
  });
});
