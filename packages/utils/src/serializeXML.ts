import { filterAndMap } from './arrayUtils';

// Cache compiled regex at module level for better performance
const XML_TAG_NAME_REGEX = /^[a-zA-Z_][a-zA-Z0-9._-]*$/;
const XML_PREFIX_REGEX = /^xml/i;

// Escape characters map for single-pass replacement
const XML_ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

const XML_ESCAPE_REGEX = /[&<>"']/g;

export type XMLNode =
  | {
      type?: 'node';
      name: string;
      attrs?: Record<string, string | number | boolean | null | undefined>;
      children?: (XMLNode | null | undefined | false)[] | string;
      escapeText?: boolean;
    }
  | {
      type: 'comment';
      content: string;
      escapeText?: boolean;
    }
  | {
      type: 'emptyLine';
    };

export type SerializeOptions = {
  indent?: number | string;
  escapeText?: boolean;
  validateTagName?: boolean;
  invalidNodes?: 'throw' | 'reject';
};

export function serializeXML(
  node: XMLNode | XMLNode[],
  options?: SerializeOptions,
): string {
  if (Array.isArray(node)) {
    const EMPTY_LINE_MARKER = '\x00EMPTY_LINE\x00';
    return node
      .map((n) => {
        if (n.type === 'emptyLine') {
          return EMPTY_LINE_MARKER;
        }
        return serializeWithLevel(n, options, 0);
      })
      .filter(Boolean)
      .join(options?.indent ? '\n' : '')
      .replace(new RegExp(EMPTY_LINE_MARKER, 'g'), '');
  }
  return serializeWithLevel(node, options, 0);
}

function serializeWithLevel(
  node: XMLNode,
  options: SerializeOptions = {},
  level: number,
): string {
  const {
    indent,
    escapeText: globalEscapeText = true,
    validateTagName = true,
    invalidNodes = 'throw',
  } = options;

  // Calculate indentation
  const indentStr = indent ? getIndentString(indent, level) : '';
  const newline = indent ? '\n' : '';

  // Handle different node types
  if (node.type === 'comment') {
    const shouldEscapeText =
      node.escapeText !== undefined ? node.escapeText : globalEscapeText;
    const content = shouldEscapeText ? escapeXml(node.content) : node.content;
    return `${indentStr}<!-- ${content} -->`;
  }

  if (node.type === 'emptyLine') {
    return '';
  }

  const {
    name,
    attrs: attributes = {},
    children,
    escapeText: nodeEscapeText,
  } = node;

  // Per-node options override global options
  const shouldEscapeText =
    nodeEscapeText !== undefined ? nodeEscapeText : globalEscapeText;

  // Validate tag name
  if (validateTagName && !isValidXmlTagName(name)) {
    if (invalidNodes === 'throw') {
      throw new Error(`Invalid XML tag name: "${name}"`);
    }
    // If 'reject', return empty string
    return '';
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
    return serializedChild || false;
  });

  if (serializedChildren.length === 0) {
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
  if (XML_PREFIX_REGEX.test(name)) return false;
  return XML_TAG_NAME_REGEX.test(name);
}

function escapeXml(text: string): string {
  return text.replace(XML_ESCAPE_REGEX, (char) => XML_ESCAPE_MAP[char]!);
}
