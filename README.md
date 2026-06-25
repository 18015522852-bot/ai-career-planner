# AI 实习规划助手

一个面向中国大学生的 AI 实习规划工具。

用户填写学校、专业、年级和目标岗位后，系统会调用 DeepSeek API，生成：

- 适合岗位分析
- 当前技能缺口
- 未来 6 个月提升路线
- 实习投递建议

技术栈：

- Next.js 15
- TypeScript
- TailwindCSS
- DeepSeek API
- Vercel

## 1. 安装依赖

先确认电脑已经安装 Node.js。

建议使用 Node.js 20 或更高版本。

在项目根目录打开终端，执行：

```bash
npm install
```

安装完成后，项目会生成 `node_modules` 文件夹。

## 2. 创建 `.env.local`

项目根目录里已经有一个示例文件：

```bash
.env.local.example
```

你需要在项目根目录新建一个文件：

```bash
.env.local
```

注意：文件名必须是 `.env.local`，不要写成 `.env.local.txt`。

## 3. 配置 DeepSeek API Key

打开 `.env.local`，填入：

```env
DEEPSEEK_API_KEY=你的DeepSeek_API_Key
DEEPSEEK_MODEL=deepseek-chat
```

示例：

```env
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxx
DEEPSEEK_MODEL=deepseek-chat
```

注意：

- `DEEPSEEK_API_KEY` 不要写到前端页面里。
- 不要把 `.env.local` 上传到 GitHub。
- 如果 API Key 配错，页面会提示服务端生成失败。

## 4. 启动项目

在项目根目录执行：

```bash
npm run dev
```

如果启动成功，终端里会看到类似：

```bash
Local: http://localhost:3000
```

## 5. 本地访问

打开浏览器，访问：

```bash
http://localhost:3000
```

然后填写：

- 学校
- 专业
- 年级
- 目标岗位

点击“生成实习规划”，等待 AI 返回结果。

## 6. 部署到 Vercel

### 第一步：上传到 GitHub

先把项目上传到 GitHub 仓库。

如果你还没有初始化 Git，可以执行：

```bash
git init
git add .
git commit -m "init ai internship planner"
```

然后在 GitHub 创建一个新仓库，并按 GitHub 页面提示推送代码。

### 第二步：导入 Vercel

打开 Vercel 官网，登录后点击：

```bash
Add New Project
```

选择刚才的 GitHub 仓库。

### 第三步：配置环境变量

在 Vercel 项目设置里找到：

```bash
Settings -> Environment Variables
```

添加两个变量：

```env
DEEPSEEK_API_KEY=你的DeepSeek_API_Key
DEEPSEEK_MODEL=deepseek-chat
```

### 第四步：开始部署

点击：

```bash
Deploy
```

部署成功后，Vercel 会给你一个线上访问地址。

以后每次你把代码推送到 GitHub，Vercel 都会自动重新部署。

## 常见问题

### 页面提示缺少 `DEEPSEEK_API_KEY`

说明你还没有创建 `.env.local`，或者变量名写错了。

请确认 `.env.local` 里有：

```env
DEEPSEEK_API_KEY=你的DeepSeek_API_Key
```

### 修改 `.env.local` 后没有生效

需要停止项目，然后重新启动：

```bash
npm run dev
```

### 本地打不开页面

确认终端里是否还在运行项目。

如果 `3000` 端口被占用，Next.js 可能会自动使用其他端口，比如：

```bash
http://localhost:3001
```

以终端显示的地址为准。
