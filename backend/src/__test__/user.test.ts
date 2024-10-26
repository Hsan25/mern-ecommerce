import '../config/db';
import app from '../app';
import dotenv from 'dotenv';
import request from 'supertest';
import { Role } from '../constants';
dotenv.config();

const schemaUser = {
  username: "hello",
  password: "hello",
  email: "hello",
  avatar: "hello" || null,
  role: Role.ADMIN || Role.USER,
  created_at: Date.now(),
  updated_at: Date.now(),
}
describe("TEST USER ENDPOINT", () => {
  test("UNAUTHORIZED ACCESS TO USER", async () => {
    const res = await request(app)
      .get('/users');
    expect(res.status).toBe(401);
  });
  test("TOKEN INVALID ACCESS TO USER", async () => {
    const res = await request(app)
      .get('/users')
      .set('Authorization', 'Bearer TOOKEN1');
    expect(res.status).toBe(400);
  });
  test("INVALID ID: GET USER BY ID", async () => {
    const res = await request(app).get('/users/12345');
    expect(res.status).toBe(404);
  });
  test("UNAUTHORIZED: EDIT USER BY ID", async () => {
    const res = await request(app)
      .put('/users/12345')
      .set('Content-Type', 'application/json')
      .send({
        username: 'USERNAME GI GANTI'
      });
    expect(res.status).toBe(401);
  });
  test("UNAUTHORIZED: DELETE USER BY ID", async () => {
    const res = await request(app).delete('/users/1234')
    expect(res.status).toBe(401);
  });
});