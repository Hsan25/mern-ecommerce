import '../config/db';
import app from '../app';
import dotenv from 'dotenv';
import request from 'supertest';
dotenv.config();


describe("REGISTER", () => {
  test("REGISTER with no email", async () => {
    const body = {
      username: "USER1",
      //   "email": "user@gmail.com",
      password: "123456",
      role: "USER"
    }
    const res = await request(app)
      .post('/users/register')
      .set('Content-Type', 'application/json')
      .send(body);
    expect(res.status).toBe(400);
    expect(res.body.msg).toBe('email: Required');
  })
  test("REGISTER with no username", async () => {
    const body = {
      // username: "USER1",
      email: "user@gmail.com",
      password: "123456",
      role: "USER"
    }
    const res = await request(app)
      .post('/users/register')
      .set('Content-Type', 'application/json')
      .send(body);
    expect(res.status).toBe(400);
    expect(res.body.msg).toBe('username: Required');
  })
  test("REGISTER with Invalid email", async () => {
    const body = {
      username: "USER123",
      email: "user@gmailcom",
      password: "123456",
      role: "USER"
    }
    const res = await request(app)
      .post('/users/register')
      .set('Content-Type', 'application/json')
      .send(body);
    expect(res.status).toBe(400);
    expect(res.body.msg).toBe('email: Invalid email');
  })
  test("REGISTER with INVALID username", async () => {
    const body = {
      username: "USER",
      email: "user@gmail.com",
      password: "123456",
      role: "USER"
    }
    const res = await request(app)
      .post('/users/register')
      .set('Content-Type', 'application/json')
      .send(body);
    expect(res.status).toBe(400);
    expect(res.body.msg).toBe('username: String must contain at least 5 character(s)');
  })
  // test("REGISTER SUCCESS", async () => {
  //   const body = {
  //     username: "USER206",
  //     email: "user206@gmail.com",
  //     password: "123456",
  //     role: "USER"
  //   }
  //   const res = await request(app)
  //     .post('/users/register')
  //     .set('Content-Type', 'application/json')
  //     .send(body);
  //   console.log(res.error)
  //   expect(res.status).toBe(203);
  //   expect(res.body.msg).toBe('success create new user');
  // })
})

describe('TEST LOGIN', () => {
  test("LOGIN with INVALID email", async () => {
    const body = {
      email: "user@gmailcom",
      password: "123456"
    }
    const res = await request(app)
      .post('/auth/login')
      .set('Content-Type', 'application/json')
      .send(body);
    expect(res.status).toBe(400);
    expect(res.body.msg).toBe('email: Invalid email');
  })
  test("LOGIN with INVALID password", async () => {
    const body = {
      email: "user@gmail.com",
      password: "1234"
    }
    const res = await request(app)
      .post('/auth/login')
      .set('Content-Type', 'application/json')
      .send(body);
    expect(res.status).toBe(400);
    expect(res.body.msg).toBe('password: String must contain at least 6 character(s)');
  })
  test("LOGIN FAILED", async () => {
    const body = {
      email: "user@gmail.com",
      password: "1234562"
    }
    const res = await request(app)
      .post('/auth/login')
      .set('Content-Type', 'application/json')
      .send(body);
    expect(res.status).toBe(400);
    expect(res.body.msg).toBe('Incorrect email or password');
  })

  test("LOGIN SUCCESS", async () => {
    // pastikan ini ada di database user
    const body = {
      email: "user@gmail.com",
      password: "123456"
    }
    const res = await request(app)
      .post('/auth/login')
      .set('Content-Type', 'application/json')
      .send(body);
    expect(res.status).toBe(200);
    expect(res.headers['Cookie'])
    expect(res.body.msg).toBe('LOGIN success');
  })

})

describe("TEST LOGOUT", () => {
  test("FAILED LOGOUT", async () => {
    const res = await request(app)
      .delete('/auth/logout')
    // .set('Cookie','token_session=12345')
    expect(res.status).toBe(401);
  })
  test("LOGOUT SUCCESS", async () => {
    const res = await request(app)
      .delete('/auth/logout')
      .set('Cookie', 'token_session=token-example')
    expect(res.status).toBe(204);
  })
})