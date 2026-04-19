# Focus One

专注的力量 - 一个使用React Native CLI构建的应用。

## 技术栈

- React Native 0.85.1
- React 19.2.3
- TypeScript
- Kotlin (Android)

## 开始使用

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm start
```

### 运行应用

- **Android**: `npm run android`
- **iOS**: `npm run ios`

## 构建APK

### 本地构建

```bash
cd android
./gradlew assembleDebug
```

### GitHub Actions自动构建

每次推送到main分支时，GitHub Actions会自动构建APK并提供下载。

## 项目结构

```
├── App.tsx           # 主应用组件
├── android/          # Android原生代码
├── package.json      # 项目配置
└── README.md         # 项目说明
```
