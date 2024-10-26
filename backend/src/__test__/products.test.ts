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
describe("TEST PRODUCTS ENDPOINT", () => {
  test("GET PRODUCTS", async () => {
    const res = await request(app)
      .get('/products');
    expect(res.status).toBe(200);
  });
  test(" UNAUTHORIZED : DELETE PRODUCTS", async () => {
    const res = await request(app)
      .delete('/products/123')
    expect(res.status).toBe(401);
  });
  test(" UNAUTHORIZED : PUT PRODUCTS", async () => {
    const res = await request(app)
      .put('/products/123')
      .set('Content-Type', 'application/json')
      .send({ name: "product name changes" })
    expect(res.status).toBe(401);
  });
});