import { useCallback } from 'react';

// 类型定义
interface ElectronAPI {
  saveFile: (filePath: string | null, content: string) => Promise<{ success: boolean; filePath?: string; canceled?: boolean; error?: string }>;
  exportHtml: (content: string) => Promise<{ success: boolean; filePath?: string; canceled?: boolean; error?: string }>;
  onMenuNewFile: (callback: () => void) => void;
  onMenuOpenFile: (callback: (event: any, data: { filePath: string; content: string }) => void) => void;
  onMenuSaveFile: (callback: () => void) => void;
  onMenuSaveAsFile: (callback: () => void) => void;
  onMenuExportHtml: (callback: () => void) => void;
  onMenuExportPdf: (callback: () => void) => void;
  removeAllListeners: (channel: string) => void;
  platform: string;
  versions: {
    node: string;
    chrome: string;
    electron: string;
  };
}

// 扩展Window接口
declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

// 检查是否在Electron环境中
const isElectron = () => {
  return typeof window !== 'undefined' && window.electronAPI;
};

// 获取Electron API
const getElectronAPI = (): ElectronAPI | null => {
  if (isElectron()) {
    return window.electronAPI!;
  }
  return null;
};

export const useElectron = () => {
  const electronAPI = getElectronAPI();

  // 保存文件
  const saveFile = useCallback(async (filePath: string | null, content: string) => {
    if (!electronAPI) {
      // 在浏览器环境中，使用下载功能
      const blob = new Blob([content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filePath || 'document.md';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return { success: true };
    }
    
    return await electronAPI.saveFile(filePath, content);
  }, [electronAPI]);

  // 导出HTML
  const exportHtml = useCallback(async (content: string) => {
    if (!electronAPI) {
      // 在浏览器环境中，使用下载功能
      const htmlTemplate = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Markdown Export</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    pre { background: #f6f8fa; padding: 16px; border-radius: 6px; overflow-x: auto; }
    code { background: #f6f8fa; padding: 2px 4px; border-radius: 3px; }
    blockquote { border-left: 4px solid #dfe2e5; padding-left: 16px; color: #6a737d; }
  </style>
</head>
<body>
${content}
</body>
</html>`;
      
      const blob = new Blob([htmlTemplate], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'document.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return { success: true };
    }
    
    return await electronAPI.exportHtml(content);
  }, [electronAPI]);

  // 设置菜单事件监听器
  const setupMenuListeners = useCallback((handlers: {
    onNewFile?: () => void;
    onOpenFile?: (filePath: string, content: string) => void;
    onSaveFile?: () => void;
    onSaveAsFile?: () => void;
    onExportHtml?: () => void;
    onExportPdf?: () => void;
  }) => {
    if (!electronAPI) return;

    if (handlers.onNewFile) {
      electronAPI.onMenuNewFile(handlers.onNewFile);
    }
    if (handlers.onOpenFile) {
      electronAPI.onMenuOpenFile((_event, data) => {
        handlers.onOpenFile!(data.filePath, data.content);
      });
    }
    if (handlers.onSaveFile) {
      electronAPI.onMenuSaveFile(handlers.onSaveFile);
    }
    if (handlers.onSaveAsFile) {
      electronAPI.onMenuSaveAsFile(handlers.onSaveAsFile);
    }
    if (handlers.onExportHtml) {
      electronAPI.onMenuExportHtml(handlers.onExportHtml);
    }
    if (handlers.onExportPdf) {
      electronAPI.onMenuExportPdf(handlers.onExportPdf);
    }

    // 清理函数
    return () => {
      electronAPI.removeAllListeners('menu-new-file');
      electronAPI.removeAllListeners('menu-open-file');
      electronAPI.removeAllListeners('menu-save-file');
      electronAPI.removeAllListeners('menu-save-as-file');
      electronAPI.removeAllListeners('menu-export-html');
      electronAPI.removeAllListeners('menu-export-pdf');
    };
  }, [electronAPI]);

  return {
    isElectron: isElectron(),
    platform: electronAPI?.platform || 'web',
    versions: electronAPI?.versions,
    saveFile,
    exportHtml,
    setupMenuListeners
  };
};

export default useElectron;