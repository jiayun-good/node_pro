# Express Pro - 视频分享平台后端 API

一个基于 Express.js + MongoDB 构建的视频分享平台后端服务，支持用户管理、视频管理、订阅关系等功能。

## 技术栈

- **Node.js** 18+
- **Express.js** 5.2.1 - Web 框架
- **MongoDB** + **Mongoose** 9.3.3 - 数据库
- **JWT** - 身份认证
- **express-validator** - 请求参数校验
- **Multer** - 文件上传
- **MD5** - 密码加密

## 项目结构

```
express-pro/
├── app.js                  # 应用入口
├── db.js                   # 数据库连接
├── package.json            # 项目依赖
├── .env                    # 环境变量
├── controller/             # 控制器层
│   ├── userController.js   # 用户相关接口
│   └── videoController.js  # 视频相关接口
├── middleware/             # 中间件
│   ├── authMiddleware.js   # JWT 认证中间件
│   └── validator/          # 参数校验
│       ├── errorBack.js
│       └── userValidator.js
├── models/                 # 数据模型
│   ├── userSchema.js       # 用户模型
│   ├── videoSchema.js      # 视频模型
│   └── subscribeSchema.js  # 订阅关系模型
├── router/                 # 路由层
│   ├── user.js             # 用户路由
│   └── video.js            # 视频路由
├── uploads/                # 上传文件目录
└── utils/                  # 工具函数
    ├── appError.js         # 自定义错误类
    ├── asyncHandler.js     # 异步错误处理
    ├── errorHandler.js     # 全局错误处理
    └── jwt.js              # JWT 工具
```

## 功能特性

### 用户模块
- 用户注册（支持用户名唯一性校验、长度校验）
- 用户登录（MD5 密码加密、JWT Token 签发）
- 获取当前登录用户信息
- 头像/文件上传
- 用户订阅/关注功能

### 视频模块
- 创建视频（需登录）
- 获取视频详情（支持 populate 关联用户信息）

### 安全与认证
- JWT Token 认证（支持可选认证）
- 全局错误处理
- 请求参数校验
- 异步错误捕获

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

创建 `.env` 文件：

```env
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
```

### 3. 启动 MongoDB

确保本地 MongoDB 服务已启动，默认连接地址：
```
mongodb://127.0.0.1:27017/myMongoDB
```

### 4. 启动服务

```bash
node app.js
```

服务将在 `http://localhost:3000` 启动。

## API 接口文档

### 用户接口

| 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|
| POST | /api/user/register | 用户注册 | 否 |
| POST | /api/user/login | 用户登录 | 否 |
| GET | /api/user/list | 获取当前用户信息 | 是 |
| POST | /api/user/upload | 文件上传 | 可选 |
| GET | /api/user/subscribe | 订阅用户 | 是 |

#### 注册

```http
POST /api/user/register
Content-Type: application/json

{
  "username": "testuser",
  "password": "123456"
}
```

**响应：**
```json
{
  "message": "注册成功",
  "data": { ... }
}
```

#### 登录

```http
POST /api/user/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "123456"
}
```

**响应：**
```json
{
  "message": "登录成功",
  "data": { ... },
  "token": "Bearer xxx..."
}
```

#### 获取用户信息

```http
GET /api/user/list
Authorization: Bearer <token>
```

#### 文件上传

```http
POST /api/user/upload
Authorization: Bearer <token>  # 可选
Content-Type: multipart/form-data

file: <文件>
```

#### 订阅用户

```http
GET /api/user/subscribe?chennelId=<用户ID>
Authorization: Bearer <token>
```

### 视频接口

| 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|
| POST | /api/video/create | 创建视频 | 是 |
| GET | /api/video/getVideo | 获取视频详情 | 可选 |

#### 创建视频

```http
POST /api/video/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "视频标题",
  "descrption": "视频描述",
  "vodvideoId": "视频ID"
}
```

#### 获取视频详情

```http
GET /api/video/getVideo?videoId=<视频ID>
Authorization: Bearer <token>  # 可选
```

## 数据模型

### User（用户）

| 字段 | 类型 | 说明 |
|------|------|------|
| username | String | 用户名（唯一） |
| password | String | 密码（MD5加密） |
| age | Number | 年龄（默认18） |
| subscribeCount | Number | 粉丝数 |
| createdAt | Date | 创建时间 |
| updated_at | Date | 更新时间 |

### Video（视频）

| 字段 | 类型 | 说明 |
|------|------|------|
| title | String | 视频标题 |
| descrption | String | 视频描述 |
| vodvideoId | String | 视频资源ID |
| userId | ObjectId | 发布者（关联User） |
| createdAt | Date | 创建时间 |
| updated_at | Date | 更新时间 |

### Subscribe（订阅关系）

| 字段 | 类型 | 说明 |
|------|------|------|
| userId | ObjectId | 订阅者 |
| chennelId | ObjectId | 被订阅者 |
| createdAt | Date | 创建时间 |
| updated_at | Date | 更新时间 |

## 注意事项

1. 本项目使用 ES Module（`"type": "module"`），所有导入导出使用 `import/export` 语法
2. 上传的文件保存在 `uploads/` 目录，可通过 `/uploads/<文件名>` 访问
3. JWT Token 有效期为 7 天
4. 部分接口支持可选认证（`authMiddleware(false)`），未携带 Token 也能访问
