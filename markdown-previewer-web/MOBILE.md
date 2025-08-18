# 移动端开发指南

本项目已配置 Capacitor 支持，可以构建为 iOS 和 Android 应用。

## 环境要求

### Android 开发
- Java Development Kit (JDK) 17 或更高版本
- Android Studio
- Android SDK

### iOS 开发 (仅限 macOS)
- Xcode 14 或更高版本
- CocoaPods
- iOS 模拟器或真机

## 开发流程

### 1. 构建 Web 应用
```bash
npm run build
```

### 2. 同步到移动端平台
```bash
npm run cap:sync
```

### 3. 打开原生 IDE

#### Android
```bash
npm run cap:android
```
这将在 Android Studio 中打开项目。

#### iOS
```bash
npm run cap:ios
```
这将在 Xcode 中打开项目。

## 移动端特性

### 已实现的功能
- 响应式设计，适配移动端屏幕
- 触摸友好的界面元素
- 状态栏样式自动适配主题
- 启动屏配置
- 安全区域适配 (iPhone X 及以上)
- 移动端滚动优化

### 移动端适配
- 垂直布局：编辑器和预览区域在移动端采用上下布局
- 触摸优化：按钮和交互元素符合移动端触摸标准
- 字体大小：防止 iOS 自动缩放
- 视口适配：使用动态视口高度避免地址栏影响

## 配置文件

### capacitor.config.ts
主要配置包括：
- 应用 ID: `com.gede.MarkDownViewer`
- 应用名称: `MarkdownViewer`
- Web 资源目录: `dist`
- 启动屏和状态栏配置

### 移动端样式
- `src/styles/mobile.css`: 移动端专用样式
- 响应式断点: 768px, 480px
- 支持横屏和竖屏模式

## 调试

### Web 调试
在移动端浏览器中访问开发服务器：
```bash
npm run dev
```

### 原生调试
- Android: 使用 Chrome DevTools 远程调试
- iOS: 使用 Safari Web Inspector

## 构建发布

### Android
1. 在 Android Studio 中打开项目
2. 配置签名密钥
3. 构建 APK 或 AAB

### iOS
1. 在 Xcode 中打开项目
2. 配置开发者账号和证书
3. 构建并上传到 App Store Connect

## 注意事项

1. **Java 环境**: Android 开发需要安装 JDK
2. **Xcode**: iOS 开发需要完整的 Xcode 安装
3. **权限**: 移动端可能需要额外的权限配置
4. **性能**: 大文件处理在移动端可能需要优化
5. **存储**: 移动端文件存储使用 Capacitor 的文件系统 API

## 故障排除

### 常见问题
1. **Java 未找到**: 安装 JDK 并配置 JAVA_HOME
2. **Xcode 工具缺失**: 安装完整版 Xcode
3. **CocoaPods 未安装**: `sudo gem install cocoapods`
4. **构建失败**: 检查依赖版本兼容性

### 有用的命令
```bash
# 检查 Capacitor 环境
npx cap doctor

# 清理并重新构建
npm run build && npx cap sync

# 查看可用平台
npx cap ls
```