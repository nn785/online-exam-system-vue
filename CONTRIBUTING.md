# 项目贡献指南

## 开发环境设置

### 必要工具
- Node.js (推荐版本: v14.x 或更高)
- npm (推荐版本: v6.x 或更高)
- Git

### 推荐的IDE和插件
- Visual Studio Code
  - Vetur (Vue工具)
  - ESLint
  - Prettier
  - EditorConfig for VS Code

### 初始化项目
```bash
# 克隆仓库
git clone https://github.com/nn785/online-exam-system-vue.git

# 进入项目目录
cd online-exam-system-vue

# 安装依赖
npm install

# 启动开发服务器
npm run serve
```

## 编码规范

### 文件命名
- 组件文件名：使用 PascalCase (如 `LoginForm.vue`)
- 其他JS文件：使用 camelCase (如 `authService.js`)

### Vue组件结构
- 组件应按照以下顺序排列:
  1. `<template>`
  2. `<script>`
  3. `<style>`

### JavaScript规范
- 使用ES6+语法
- 变量和函数使用camelCase
- 常量使用UPPER_SNAKE_CASE
- 类名使用PascalCase
- 避免使用var，优先使用const，其次使用let

### CSS规范
- 使用SCSS预处理器
- 类名使用kebab-case
- 避免使用行内样式
- 优先使用类选择器，避免使用ID选择器

### 注释规范
- 每个组件、函数和复杂逻辑都应有注释
- 使用JSDoc风格的注释
- 对于复杂的业务逻辑，添加详细注释

### Git提交规范
提交信息应遵循以下格式:
```
<类型>: <简短描述>

<详细描述>
```

类型包括:
- feat: 新功能
- fix: 修复bug
- docs: 文档更新
- style: 代码风格修改(不影响代码运行的变动)
- refactor: 重构(既不是新增功能，也不是修改bug的代码变动)
- perf: 性能优化
- test: 增加测试
- chore: 构建过程或辅助工具的变动

## 代码审查
- 所有代码必须通过ESLint和Prettier检查
- 所有新功能必须有对应的测试
- 代码审查应关注:
  - 代码质量和可维护性
  - 性能问题
  - 安全问题
  - 是否符合项目规范

## 分支策略
- `main`: 主分支，保持稳定可发布状态
- `develop`: 开发分支，用于集成功能
- `feature/*`: 功能分支，用于开发新功能
- `bugfix/*`: 修复分支，用于修复bug
- `release/*`: 发布分支，用于准备发布 