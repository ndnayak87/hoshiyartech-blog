import { marked } from "marked";
import DOMPurify from "dompurify";

marked.setOptions({ breaks: true, gfm: true });

function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// marked ke code output me hljs classes lagao (bina heavy dep ke simple highlight CSS)
marked.use({
  renderer: {
    code(code, lang) {
      return `<pre class="md-pre"><code class="lang-${escapeHtml(lang || "text")}">${escapeHtml(code)}</code></pre>`;
    },
    codespan(code) {
      return `<code class="md-code">${escapeHtml(code)}</code>`;
    },
  },
});

export function renderMarkdown(md) {
  const html = marked.parse(md || "");
  return DOMPurify.sanitize(html);
}
