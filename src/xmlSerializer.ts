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
};

export function serialize(node: XMLNode, options?: SerializeOptions): string {
  return serializeWithLevel(node, options, 0);
}

function serializeWithLevel(
  node: XMLNode,
  options: SerializeOptions = {},
  level: number,
): string {
  const { name, attributes = {}, children, escapeText: nodeEscapeText } = node;
  const { indent, escapeText: globalEscapeText = true } = options;

  // Per-node options override global options
  const shouldEscapeText =
    nodeEscapeText !== undefined ? nodeEscapeText : globalEscapeText;

  // Calculate indentation
  const indentStr = indent ? getIndentString(indent, level) : '';
  const newline = indent ? '\n' : '';

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

  const childrenStr = filterAndMap(
    children,
    (child) => !!child && serializeWithLevel(child, options, level + 1),
  ).join(newline);

  return `${indentStr}<${name}${attributesPart}>${newline}${childrenStr}${newline}${indentStr}</${name}>`;
}

function getIndentString(indent: string | number, level: number): string {
  if (typeof indent === 'string') {
    return indent.repeat(level);
  }
  return ' '.repeat(indent * level);
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
