import { marked } from 'marked';
import hljs from 'highlight.js';

// 配置marked选项
marked.setOptions({
  breaks: true,
  gfm: true
});

// 自定义渲染器
const renderer = new marked.Renderer();

// 自定义代码块渲染
renderer.code = function({ text, lang }) {
  if (lang && hljs.getLanguage(lang)) {
    try {
      const highlighted = hljs.highlight(text, { language: lang }).value;
      return `<pre><code class="hljs language-${lang}">${highlighted}</code></pre>`;
    } catch (err) {
      console.warn('Highlight.js error:', err);
    }
  }
  return `<pre><code class="hljs">${text}</code></pre>`;
};

// 自定义链接渲染（添加target="_blank"）
renderer.link = function({ href, title, tokens }) {
  const text = tokens.map(token => token.raw || '').join('');
  const titleAttr = title ? ` title="${title}"` : '';
  return `<a href="${href}"${titleAttr} target="_blank" rel="noopener noreferrer">${text}</a>`;
};

marked.use({ renderer });

/**
 * 解析Markdown文本为HTML
 * @param markdown Markdown文本
 * @returns HTML字符串
 */
export const parseMarkdown = async (markdown: string): Promise<string> => {
  try {
    const result = await marked(markdown);
    return typeof result === 'string' ? result : '';
  } catch (error) {
    console.error('Markdown parsing error:', error);
    return '<p>解析错误</p>';
  }
};

/**
 * 防抖函数
 * @param func 要防抖的函数
 * @param wait 等待时间（毫秒）
 * @returns 防抖后的函数
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: number;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = window.setTimeout(() => func(...args), wait);
  };
};