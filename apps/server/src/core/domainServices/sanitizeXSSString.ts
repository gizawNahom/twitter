import DOMPurify from 'isomorphic-dompurify';

export function sanitizeXSSString(text: string): string {
  return DOMPurify.sanitize(text);
}
