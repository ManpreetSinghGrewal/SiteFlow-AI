export function extractHtmlFromMessage(content: string): string | null {
  const match = content.match(/```html\s*\n([\s\S]*?)```/);
  return match ? match[1].trim() : null;
}

export function hasHtmlCode(content: string): boolean {
  return /```html\s*\n/.test(content);
}
