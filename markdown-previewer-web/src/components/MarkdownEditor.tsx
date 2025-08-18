import React, { useState, useCallback, useRef, useEffect } from 'react';
import { parseMarkdown, debounce } from '../utils/markdown';
import ResizablePanes from './ResizablePanes';
import Toolbar from './Toolbar';
import { useElectron } from '../hooks/useElectron';
import './MarkdownEditor.css';

interface MarkdownEditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ 
  initialContent = '', 
  onChange 
}) => {
  const [content, setContent] = useState(initialContent);
  const [preview, setPreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentFilePath, setCurrentFilePath] = useState<string | null>(null);
  const [isModified, setIsModified] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { isElectron, saveFile, exportHtml, setupMenuListeners } = useElectron();

  // 防抖更新预览
  const debouncedUpdatePreview = useCallback(
    debounce(async (markdown: string) => {
      setIsLoading(true);
      try {
        const html = await parseMarkdown(markdown);
        setPreview(html);
      } catch (error) {
        console.error('Preview update error:', error);
        setPreview('<p>预览更新失败</p>');
      } finally {
        setIsLoading(false);
      }
    }, 300),
    []
  );

  // 内容变化时更新预览
  useEffect(() => {
    debouncedUpdatePreview(content);
  }, [content, debouncedUpdatePreview]);

  // 设置Electron菜单事件监听器
  useEffect(() => {
    if (isElectron) {
      const cleanup = setupMenuListeners({
        onNewFile: handleNewFile,
        onOpenFile: handleOpenFile,
        onSaveFile: handleSaveFile,
        onSaveAsFile: handleSaveAsFile,
        onExportHtml: handleExportHtml,
      });
      return cleanup;
    }
  }, [isElectron, setupMenuListeners, handleNewFile, handleOpenFile, handleSaveFile, handleSaveAsFile, handleExportHtml]);

  // 处理文本变化
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    setIsModified(true);
    onChange?.(newContent);
  };

  // 文件操作函数
  const handleNewFile = useCallback(() => {
    if (isModified) {
      const confirmed = window.confirm('当前文件未保存，确定要新建文件吗？');
      if (!confirmed) return;
    }
    setContent('');
    setCurrentFilePath(null);
    setIsModified(false);
  }, [isModified]);

  const handleSaveFile = useCallback(async () => {
    try {
      const result = await saveFile(currentFilePath, content);
      if (result.success && !result.canceled) {
        setIsModified(false);
        if (result.filePath) {
          setCurrentFilePath(result.filePath);
        }
      }
    } catch (error) {
      console.error('保存文件失败:', error);
    }
  }, [saveFile, currentFilePath, content]);

  const handleSaveAsFile = useCallback(async () => {
    try {
      const result = await saveFile(null, content);
      if (result.success && !result.canceled) {
        setIsModified(false);
        if (result.filePath) {
          setCurrentFilePath(result.filePath);
        }
      }
    } catch (error) {
      console.error('另存为文件失败:', error);
    }
  }, [saveFile, content]);

  const handleExportHtml = useCallback(async () => {
    try {
      await exportHtml(preview);
    } catch (error) {
      console.error('导出HTML失败:', error);
    }
  }, [exportHtml, preview]);

  const handleOpenFile = useCallback((filePath: string, fileContent: string) => {
    if (isModified) {
      const confirmed = window.confirm('当前文件未保存，确定要打开新文件吗？');
      if (!confirmed) return;
    }
    setContent(fileContent);
    setCurrentFilePath(filePath);
    setIsModified(false);
  }, [isModified]);

  // 插入文本到光标位置
  const insertTextAtCursor = useCallback((text: string, cursorOffset: number = 0) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newContent = content.substring(0, start) + text + content.substring(end);
    
    setContent(newContent);
    onChange?.(newContent);
    debouncedUpdatePreview(newContent);
    
    // 设置光标位置
    setTimeout(() => {
      const newCursorPos = start + text.length + cursorOffset;
      textarea.selectionStart = textarea.selectionEnd = newCursorPos;
      textarea.focus();
    }, 0);
  }, [content, onChange, debouncedUpdatePreview]);

  // 键盘快捷键处理
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      insertTextAtCursor('  ');
      return;
    }

    // 快捷键处理
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          insertTextAtCursor('**粗体文本**', -4);
          break;
        case 'i':
          e.preventDefault();
          insertTextAtCursor('*斜体文本*', -4);
          break;
        case 'k':
          e.preventDefault();
          insertTextAtCursor('[链接文本](https://example.com)', -21);
          break;
        case 'h':
          e.preventDefault();
          insertTextAtCursor('# 标题', 0);
          break;
        case 'q':
          e.preventDefault();
          insertTextAtCursor('> 引用文本', 0);
          break;
        case 'u':
          e.preventDefault();
          insertTextAtCursor('- 列表项', 0);
          break;
        case 'o':
          e.preventDefault();
          insertTextAtCursor('1. 列表项', 0);
          break;
        case 't':
          e.preventDefault();
          insertTextAtCursor('| 列1 | 列2 | 列3 |\n|------|------|------|\n| 内容 | 内容 | 内容 |', 0);
          break;
        case 'r':
          e.preventDefault();
          insertTextAtCursor('\n---\n', 0);
          break;
      }
    }

    // Shift + Ctrl 组合键
    if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
      switch (e.key.toLowerCase()) {
        case 'i':
          e.preventDefault();
          insertTextAtCursor('![图片描述](图片链接)', -6);
          break;
        case 'c':
          e.preventDefault();
          insertTextAtCursor('```\n代码\n```', -4);
          break;
      }
    }
  };

  // 计算统计信息
  const stats = {
    characters: content.length,
    words: content.trim() ? content.trim().split(/\s+/).length : 0,
    lines: content.split('\n').length
  };

  // 编辑器面板
  const editorPane = (
    <div className="editor-panel">
      <div className="editor-header">
        <h3>编辑器</h3>
        <div className="editor-stats">
          {stats.characters} 字符 · {stats.words} 单词 · {stats.lines} 行
        </div>
      </div>
      <Toolbar onInsertText={insertTextAtCursor} />
      <textarea
        ref={textareaRef}
        className="editor-textarea"
        value={content}
        onChange={handleContentChange}
        onKeyDown={handleKeyDown}
        placeholder="在这里输入Markdown内容..."
        spellCheck={false}
      />
    </div>
  );

  // 预览面板
  const previewPane = (
    <div className="preview-panel">
      <div className="preview-header">
        <h3>预览</h3>
        {isLoading && <div className="loading-indicator">更新中...</div>}
      </div>
      <div 
        className="preview-content"
        dangerouslySetInnerHTML={{ __html: preview }}
      />
    </div>
  );

  return (
    <div className="markdown-editor">
      <ResizablePanes
        leftPane={editorPane}
        rightPane={previewPane}
        initialSplitPercentage={50}
        minPaneSize={300}
      />
    </div>
  );
};

export default MarkdownEditor;