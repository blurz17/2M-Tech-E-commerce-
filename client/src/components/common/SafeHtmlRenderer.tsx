import React from 'react';
import DOMPurify from 'dompurify';

interface SafeHtmlRendererProps {
  htmlContent: string;
  className?: string;
  allowedTags?: string[];
  allowedAttributes?: { [key: string]: string[] };
}

const SafeHtmlRenderer: React.FC<SafeHtmlRendererProps> = ({
  htmlContent,
  className = '',
  allowedTags,
  allowedAttributes
}) => {
  // Default safe configuration for product descriptions
  const defaultConfig = {
    ALLOWED_TAGS: allowedTags || [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'div', 'span',
      'strong', 'b', 'em', 'i', 'u', 'strike',
      'ul', 'ol', 'li',
      'blockquote', 'pre', 'code',
      'sub', 'sup',
      'a'
    ],
    ALLOWED_ATTR: allowedAttributes || {
      '*': ['class', 'style'],
      'a': ['href', 'target', 'rel'],
      'span': ['class', 'style'],
      'div': ['class', 'style'],
      'p': ['class', 'style'],
      'h1': ['class', 'style'],
      'h2': ['class', 'style'],
      'h3': ['class', 'style'],
      'h4': ['class', 'style'],
      'h5': ['class', 'style'],
      'h6': ['class', 'style'],
      'strong': ['class', 'style'],
      'em': ['class', 'style'],
      'i': ['class', 'style'],
      'b': ['class', 'style'],
      'u': ['class', 'style'],
      'strike': ['class', 'style']
    },
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto):|[^a-z]|[a-z+.-]+(?:[^a-z+.-:]|$))/i,
    ADD_ATTR: ['target'],
    FORBID_TAGS: ['script', 'object', 'embed', 'iframe', 'form', 'input', 'button'],
    FORBID_ATTR: ['onerror', 'onclick', 'onload', 'onmouseover', 'onfocus', 'onblur']
  };

  // Sanitize the HTML content
  const sanitizedHtml = DOMPurify.sanitize(htmlContent, defaultConfig as any);

  // If content is empty after sanitization, show fallback
  if (!sanitizedHtml) {
    return (
      <div className={`text-gray-500 italic ${className}`}>
        No description available for this product.
      </div>
    );
  }

  return (
    <div
      className={`prose prose-sm max-w-none wysiwyg-content ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      style={{
        // Ensure Quill classes work in the rendered content
        fontFamily: 'inherit'
      }}
    />
  );
};

export default SafeHtmlRenderer;