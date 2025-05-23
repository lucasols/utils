import { filterAndMap } from './arrayUtils';

export type XMLNode = {
  name: string;
  attributes?: Record<string, string | number | boolean | null | undefined>;
  children?: (XMLNode | null | undefined | false)[] | string;
  escapeText?: boolean;
};

export type SerializeOptions = {
  indent?: number | string;
  escapeText?: boolean;
  validateTagName?: 'throw' | 'reject' | false;
};

export function serializeXML(
  node: XMLNode,
  options?: SerializeOptions,
): string {
  return serializeWithLevel(node, options, 0);
}

function serializeWithLevel(
  node: XMLNode,
  options: SerializeOptions = {},
  level: number,
): string {
  const { name, attributes = {}, children, escapeText: nodeEscapeText } = node;
  const {
    indent,
    escapeText: globalEscapeText = true,
    validateTagName = 'throw',
  } = options;

  // Per-node options override global options
  const shouldEscapeText =
    nodeEscapeText !== undefined ? nodeEscapeText : globalEscapeText;

  // Calculate indentation
  const indentStr = indent ? getIndentString(indent, level) : '';
  const newline = indent ? '\n' : '';

  // Validate tag name
  if (validateTagName) {
    if (!isValidXmlTagName(name)) {
      const message = `Invalid XML tag name: "${name}"`;
      if (validateTagName === 'throw') {
        throw new Error(message);
      }
      // If 'reject', return empty string or handle as per desired 'reject' behavior.
      // For now, let's return an empty string, effectively rejecting the node.
      return '';
    }
  }

  // Build attributes string
  const attributesStr = filterAndMap(
    Object.entries(attributes),
    ([key, value]) =>
      value !== null && value !== undefined ?
        `${key}="${escapeXml(String(value))}"`
      : false,
  ).join(' ');

  const attributesPart = attributesStr ? ` ${attributesStr}` : '';

  // Handle self-closing tag (no children)
  if (children === undefined) {
    return `${indentStr}<${name}${attributesPart} />`;
  }

  // Handle text content
  if (typeof children === 'string') {
    const processedText = shouldEscapeText ? escapeXml(children) : children;

    // Handle multiline text with proper indentation
    if (processedText.includes('\n') && indent) {
      const lines = processedText.split('\n');
      const contentIndent = getIndentString(indent, level + 1);

      const indentedLines = lines.map((line, index) => {
        // Don't indent empty lines
        if (line.trim() === '') return '';
        // First line doesn't need extra indentation if it starts right after opening tag
        return index === 0 ? line : contentIndent + line;
      });

      const indentedText = indentedLines.join('\n');
      return `${indentStr}<${name}${attributesPart}>\n${contentIndent}${indentedText}\n${indentStr}</${name}>`;
    }

    // Single line text
    return `${indentStr}<${name}${attributesPart}>${processedText}</${name}>`;
  }

  // Handle child elements
  if (children.length === 0) {
    return `${indentStr}<${name}${attributesPart}></${name}>`;
  }

  const serializedChildren = filterAndMap(children, (child) => {
    if (!child) return false;
    const serializedChild = serializeWithLevel(child, options, level + 1);
    return serializedChild || false; // Filter out empty strings from rejected children
  });

  if (serializedChildren.length === 0) {
    // All children were falsy or rejected
    return `${indentStr}<${name}${attributesPart}></${name}>`;
  }

  const childrenStr = serializedChildren.join(newline);

  return `${indentStr}<${name}${attributesPart}>${newline}${childrenStr}${newline}${indentStr}</${name}>`;
}

function getIndentString(indent: string | number, level: number): string {
  if (typeof indent === 'string') {
    return indent.repeat(level);
  }
  return ' '.repeat(indent * level);
}

function isValidXmlTagName(name: string): boolean {
  if (!name) return false;
  // Cannot start with "xml" (case-insensitive)
  if (/^xml/i.test(name)) return false;
  // Must start with a letter or underscore
  // Subsequent characters can be letters, numbers, hyphens, underscores, or periods.
  // Cannot contain spaces.
  const tagNameRegex = /^[a-zA-Z_][a-zA-Z0-9._-]*$/;
  return tagNameRegex.test(name);
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
