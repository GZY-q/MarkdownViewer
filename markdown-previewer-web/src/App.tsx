import React, { useState } from 'react'
import MarkdownEditor from './components/MarkdownEditor'
import { ThemeProvider } from './contexts/ThemeContext'
import 'highlight.js/styles/github.css'
import 'highlight.js/styles/github-dark.css'
import './styles/themes.css'
import './App.css'

function App() {
  const [content, setContent] = useState(`# Markdown预览器

欢迎使用全平台Markdown预览器！

## 功能特性

- ✅ 实时预览
- ✅ 语法高亮
- ✅ 响应式设计
- ✅ 支持GitHub风格Markdown

## 代码示例

\`\`\`javascript
function hello() {
  console.log("Hello, Markdown!");
}
\`\`\`

## 表格支持

| 功能 | 状态 | 说明 |
|------|------|------|
| 编辑器 | ✅ | 支持Tab缩进 |
| 预览 | ✅ | 实时更新 |
| 导出 | 🚧 | 开发中 |

> 这是一个引用块，用于强调重要信息。

**粗体文本** 和 *斜体文本* 都得到了很好的支持。

[访问GitHub](https://github.com/GZY-q/MarkdownViewer/tree/main) 了解更多信息。
`);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  return (
    <ThemeProvider>
      <div className="app">
        <MarkdownEditor 
          initialContent={content}
          onChange={handleContentChange}
        />
      </div>
    </ThemeProvider>
  )
}

export default App
