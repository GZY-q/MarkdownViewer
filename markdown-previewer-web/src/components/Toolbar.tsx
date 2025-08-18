import React from 'react';
import ThemeToggle from './ThemeToggle';
import './Toolbar.css';

interface ToolbarProps {
  onInsertText: (text: string, cursorOffset?: number) => void;
  onTogglePreview?: () => void;
  showPreview?: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({ 
  onInsertText, 
  onTogglePreview, 
  showPreview = true 
}) => {
  const toolbarItems = [
    {
      title: '粗体',
      icon: 'B',
      action: () => onInsertText('**粗体文本**', -4),
      shortcut: 'Ctrl+B'
    },
    {
      title: '斜体',
      icon: 'I',
      action: () => onInsertText('*斜体文本*', -4),
      shortcut: 'Ctrl+I'
    },
    {
      title: '标题',
      icon: 'H',
      action: () => onInsertText('# 标题', 0),
      shortcut: 'Ctrl+H'
    },
    {
      title: '链接',
      icon: '🔗',
      action: () => onInsertText('[链接文本](https://example.com)', -21),
      shortcut: 'Ctrl+K'
    },
    {
      title: '图片',
      icon: '🖼️',
      action: () => onInsertText('![图片描述](图片链接)', -6),
      shortcut: 'Ctrl+Shift+I'
    },
    {
      title: '代码块',
      icon: '</>', 
      action: () => onInsertText('```\n代码\n```', -4),
      shortcut: 'Ctrl+Shift+C'
    },
    {
      title: '引用',
      icon: '"',
      action: () => onInsertText('> 引用文本', 0),
      shortcut: 'Ctrl+Q'
    },
    {
      title: '无序列表',
      icon: '•',
      action: () => onInsertText('- 列表项', 0),
      shortcut: 'Ctrl+U'
    },
    {
      title: '有序列表',
      icon: '1.',
      action: () => onInsertText('1. 列表项', 0),
      shortcut: 'Ctrl+O'
    },
    {
      title: '表格',
      icon: '⊞',
      action: () => onInsertText('| 列1 | 列2 | 列3 |\n|------|------|------|\n| 内容 | 内容 | 内容 |', 0),
      shortcut: 'Ctrl+T'
    },
    {
      title: '分割线',
      icon: '—',
      action: () => onInsertText('\n---\n', 0),
      shortcut: 'Ctrl+R'
    }
  ];

  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <div className="toolbar-group">
          {toolbarItems.map((item, index) => (
            <button
              key={index}
              className="toolbar-button"
              onClick={item.action}
              title={`${item.title} (${item.shortcut})`}
            >
              <span className="toolbar-icon">{item.icon}</span>
            </button>
          ))}
        </div>
        
        {onTogglePreview && (
          <div className="toolbar-group">
            <button
              className={`toolbar-button ${showPreview ? 'active' : ''}`}
              onClick={onTogglePreview}
              title="切换预览"
            >
              <span className="toolbar-icon">👁️</span>
            </button>
          </div>
        )}
      </div>
      
      <div className="toolbar-right">
        <ThemeToggle />
      </div>
    </div>
  );
};

export default Toolbar;