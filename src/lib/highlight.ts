const escape = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Build-time JSON syntax highlighter that wraps tokens in spans styled by .tok-* classes. */
export function highlightJson(value: unknown, indent = 2) {
  const source = typeof value === 'string' ? value : JSON.stringify(value, null, indent);
  return source.replace(
    /("(?:\\.|[^"\\])*")(\s*:)?|\b(true|false|null)\b|(-?\d+(?:\.\d+)?)|([{}[\],])|(\/\/.*)/g,
    (match, str, colon, literal, number, punct, comment) => {
      if (str) return colon ? `<span class="tok-key">${escape(str)}</span><span class="tok-punct">${colon}</span>` : `<span class="tok-string">${escape(str)}</span>`;
      if (literal) return `<span class="tok-literal">${literal}</span>`;
      if (number) return `<span class="tok-number">${number}</span>`;
      if (punct) return `<span class="tok-punct">${punct}</span>`;
      if (comment) return `<span class="tok-comment">${escape(comment)}</span>`;
      return escape(match);
    },
  );
}
