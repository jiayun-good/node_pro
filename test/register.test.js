import request from 'supertest';
import app from '../app.js';
import User from '../models/userSchema.js';
import mongoose from 'mongoose';
import md5 from 'md5';

// 在每个测试前清理用户数据
async function clearUsers() {
  await User.deleteMany({});
}

describe('POST /api/user/register', () => {
  // 测试前清理数据库
  beforeEach(async () => {
    await clearUsers();
  });

  it('should register a new user successfully', async () => {
    const userData = {
      username: 'testuser',
      password: 'testpassword123'
    };

    const response = await request(app)
      .post('/api/user/register')
      .send(userData)
      .expect(200);

    expect(response.body.message).toBe('注册成功');
    expect(response.body.data).toBeDefined();
    expect(response.body.data.username).toBe(userData.username);

    // 验证密码是否被正确加密
    const savedUser = await User.findOne({ username: userData.username });
    expect(savedUser).toBeDefined();
    expect(savedUser.password).toBe(md5(userData.password));
    expect(savedUser.username).toBe(userData.username);
  });

  it('should return error for duplicate username', async () => {
    const userData = {
      username: 'testuser',
      password: 'testpassword123'
    };

    // 先注册一个用户
    await request(app)
      .post('/api/user/register')
      .send(userData)
      .expect(200);

    // 尝试用相同的用户名再次注册
    const response = await request(app)
      .post('/api/user/register')
      .send(userData)
      .expect(400);

    expect(response.body.message).toBe('用户名已存在');
  });

  it('should return error when username is missing', async () => {
    const userData = {
      password: 'testpassword123'
    };

    const response = await request(app)
      .post('/api/user/register')
      .send(userData)
      .expect(400);

    expect(response.body.message).toBe('用户名不能为空');
  });

  it('should return error when password is missing', async () => {
    const userData = {
      username: 'testuser'
    };

    const response = await request(app)
      .post('/api/user/register')
      .send(userData)
      .expect(400);

    expect(response.body.message).toBe('密码不能为空');
  });

  it('should set default age to 18', async () => {
    const userData = {
      username: 'testuser',
      password: 'testpassword123'
    };

    const response = await request(app)
      .post('/api/user/register')
      .send(userData)
      .expect(200);

    expect(response.body.data.age).toBe(18);
    expect(response.body.data.subscribeCount).toBe(0);
  });

  it('should return error for username too short', async () => {
    const userData = {
      username: 'ab',
      password: 'testpassword123'
    };

    const response = await request(app)
      .post('/api/user/register')
      .send(userData)
      .expect(400);

    expect(response.body.message).toBe('用户名长度不能小于3位');
  });

  it('should return error for password too short', async () => {
    const userData = {
      username: 'testuser',
      password: 'ab'
    };

    const response = await request(app)
      .post('/api/user/register')
      .send(userData)
      .expect(400);

    expect(response.body.message).toBe('密码长度不能小于3位');
  });
});