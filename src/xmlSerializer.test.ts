import { expect, test } from 'vitest';
import { serializeXML, type XMLNode } from './xmlSerializer';

test('serializes self-closing tag without children', () => {
  const node: XMLNode = {
    name: 'input',
    attributes: { type: 'text', value: 'hello' },
  };

  const result = serializeXML(node);
  expect(result).toBe('<input type="text" value="hello" />');
});

test('serializes self-closing tag without attributes', () => {
  const node: XMLNode = {
    name: 'br',
  };

  const result = serializeXML(node);
  expect(result).toBe('<br />');
});

test('serializes element with text content', () => {
  const node: XMLNode = {
    name: 'p',
    children: 'Hello World',
  };

  const result = serializeXML(node);
  expect(result).toBe('<p>Hello World</p>');
});

test('serializes element with text content and attributes', () => {
  const node: XMLNode = {
    name: 'p',
    attributes: { class: 'text', id: 'content' },
    children: 'Hello World',
  };

  const result = serializeXML(node);
  expect(result).toBe('<p class="text" id="content">Hello World</p>');
});

test('serializes empty element', () => {
  const node: XMLNode = {
    name: 'div',
    children: [],
  };

  const result = serializeXML(node);
  expect(result).toBe('<div></div>');
});

test('serializes nested elements', () => {
  const node: XMLNode = {
    name: 'div',
    children: [
      {
        name: 'h1',
        children: 'Title',
      },
      {
        name: 'p',
        children: 'Content',
      },
    ],
  };

  const result = serializeXML(node);
  expect(result).toBe('<div><h1>Title</h1><p>Content</p></div>');
});

test('serializes with indentation', () => {
  const node: XMLNode = {
    name: 'div',
    children: [
      {
        name: 'h1',
        children: 'Title',
      },
      {
        name: 'p',
        children: 'Content',
      },
    ],
  };

  const result = serializeXML(node, { indent: 2 });
  expect(result).toBe(`<div>
  <h1>Title</h1>
  <p>Content</p>
</div>`);
});

test('serializes with string indentation', () => {
  const node: XMLNode = {
    name: 'div',
    children: [
      {
        name: 'p',
        children: 'Content',
      },
    ],
  };

  const result = serializeXML(node, { indent: '\t' });
  expect(result).toBe(`<div>
\t<p>Content</p>
</div>`);
});

test('handles multiline text with indentation', () => {
  const node: XMLNode = {
    name: 'pre',
    children: 'Line 1\nLine 2\n  Line 3',
  };

  const result = serializeXML(node, { indent: 2 });
  expect(result).toBe(`<pre>
  Line 1
  Line 2
    Line 3
</pre>`);
});

test('handles multiline text without indentation', () => {
  const node: XMLNode = {
    name: 'pre',
    children: 'Line 1\nLine 2\n  Line 3',
  };

  const result = serializeXML(node);
  expect(result).toBe('<pre>Line 1\nLine 2\n  Line 3</pre>');
});

test('escapes XML characters in text content', () => {
  const node: XMLNode = {
    name: 'p',
    children: 'Text with <tags> & "quotes" and \'apostrophes\'',
  };

  const result = serializeXML(node);
  expect(result).toBe(
    '<p>Text with &lt;tags&gt; &amp; &quot;quotes&quot; and &#39;apostrophes&#39;</p>',
  );
});

test('escapes XML characters in attributes', () => {
  const node: XMLNode = {
    name: 'div',
    attributes: {
      title: 'Text with <tags> & "quotes"',
      'data-value': "Single 'quotes'",
    },
  };

  const result = serializeXML(node);
  expect(result).toBe(
    '<div title="Text with &lt;tags&gt; &amp; &quot;quotes&quot;" data-value="Single &#39;quotes&#39;" />',
  );
});

test('filters out null and undefined attributes', () => {
  const node: XMLNode = {
    name: 'div',
    attributes: {
      id: 'test',
      class: null,
      'data-value': undefined,
      title: 'Keep this',
    },
  };

  const result = serializeXML(node);
  expect(result).toBe('<div id="test" title="Keep this" />');
});

test('converts non-string attribute values to strings', () => {
  const node: XMLNode = {
    name: 'input',
    attributes: {
      value: 42,
      checked: true,
      disabled: false,
    },
  };

  const result = serializeXML(node);
  expect(result).toBe('<input value="42" checked="true" disabled="false" />');
});

test('filters out falsy children', () => {
  const node: XMLNode = {
    name: 'div',
    children: [
      {
        name: 'p',
        children: 'Valid',
      },
      null,
      undefined,
      false,
      {
        name: 'span',
        children: 'Also valid',
      },
    ],
  };

  const result = serializeXML(node, { indent: 2 });
  expect(result).toBe(`<div>
  <p>Valid</p>
  <span>Also valid</span>
</div>`);
});

test('serializes comment node', () => {
  const node: XMLNode = { type: 'comment', children: 'This is a comment' };
  const result = serializeXML(node);
  expect(result).toBe('<!-- This is a comment -->');
});

test('serializes empty line node', () => {
  const node: XMLNode = { type: 'emptyLine' };
  const result = serializeXML(node);
  expect(result).toBe('');
});

test('handles array of mixed node types', () => {
  const nodes: XMLNode[] = [
    { type: 'comment', children: 'Header comment' },
    {
      type: 'node',
      name: 'div',
      attributes: { id: 'main' },
      children: 'Content',
    },
    { type: 'emptyLine' },
    { type: 'node', name: 'span', children: 'Footer' },
  ];

  const result = serializeXML(nodes, { indent: 2 });
  expect(result).toBe(`<!-- Header comment -->
<div id="main">Content</div>

<span>Footer</span>`);
});

test('escapes comment content when escapeText is true', () => {
  const node: XMLNode = {
    type: 'comment',
    children: 'Comment with <tags> & "quotes"',
    escapeText: true,
  };
  const result = serializeXML(node);
  expect(result).toBe(
    '<!-- Comment with &lt;tags&gt; &amp; &quot;quotes&quot; -->',
  );
});

test('does not escape comment content when escapeText is false', () => {
  const node: XMLNode = {
    type: 'comment',
    children: 'Comment with <tags> & "quotes"',
    escapeText: false,
  };
  const result = serializeXML(node);
  expect(result).toBe('<!-- Comment with <tags> & "quotes" -->');
});

test('throws error for invalid tag name when invalidNodes is "throw"', () => {
  const node: XMLNode = {
    name: '123invalid',
    children: 'content',
  };

  expect(() => serializeXML(node, { invalidNodes: 'throw' })).toThrow(
    'Invalid XML tag name: "123invalid"',
  );
});

test('rejects invalid tag name when invalidNodes is "reject"', () => {
  const node: XMLNode = {
    name: '123invalid',
    children: 'content',
  };

  const result = serializeXML(node, { invalidNodes: 'reject' });
  expect(result).toBe('');
});

test('rejects nodes with xml prefix', () => {
  const node: XMLNode = {
    name: 'xmlDocument',
    children: 'content',
  };

  const result = serializeXML(node, { invalidNodes: 'reject' });
  expect(result).toBe('');
});

test('disables tag name validation when validateTagName is false', () => {
  const node: XMLNode = {
    name: '123invalid',
    children: 'content',
  };

  const result = serializeXML(node, { validateTagName: false });
  expect(result).toBe('<123invalid>content</123invalid>');
});

test('handles indentation with comment nodes', () => {
  const nodes: XMLNode[] = [
    {
      type: 'node',
      name: 'root',
      children: [
        { type: 'comment', children: 'Nested comment' },
        { type: 'node', name: 'child', children: 'content' },
      ],
    },
  ];

  const result = serializeXML(nodes, { indent: 2 });
  expect(result).toBe(`<root>
  <!-- Nested comment -->
  <child>content</child>
</root>`);
});

test('filters out empty results from rejected nodes in arrays', () => {
  const nodes: XMLNode[] = [
    { name: 'valid', children: 'content' },
    { name: '123invalid', children: 'content' },
    { type: 'comment', children: 'Valid comment' },
  ];

  const result = serializeXML(nodes, { invalidNodes: 'reject', indent: 2 });
  expect(result).toBe(`<valid>content</valid>
<!-- Valid comment -->`);
});

test('handles mixed escapeText settings', () => {
  const node: XMLNode = {
    name: 'root',
    children: [
      {
        name: 'escaped',
        children: 'Text with <tags>',
        escapeText: true,
      },
      {
        name: 'unescaped',
        children: 'Text with <tags>',
        escapeText: false,
      },
    ],
  };

  const result = serializeXML(node, { indent: 2 });
  expect(result).toBe(`<root>
  <escaped>Text with &lt;tags&gt;</escaped>
  <unescaped>Text with <tags></unescaped>
</root>`);
});

test('handles array serialization', () => {
  const nodes: XMLNode[] = [
    {
      name: 'header',
      children: 'Header content',
    },
    {
      name: 'main',
      children: [
        {
          name: 'section',
          children: 'Section content',
        },
      ],
    },
    {
      name: 'footer',
    },
  ];

  const result = serializeXML(nodes, { indent: 2 });
  expect(result).toBe(`<header>Header content</header>
<main>
  <section>Section content</section>
</main>
<footer />`);
});

test('handles deeply nested elements with indentation', () => {
  const node: XMLNode = {
    name: 'html',
    children: [
      {
        name: 'body',
        children: [
          {
            name: 'div',
            attributes: { class: 'container' },
            children: [
              {
                name: 'h1',
                children: 'Title',
              },
            ],
          },
        ],
      },
    ],
  };

  const result = serializeXML(node, { indent: 2 });
  expect(result).toBe(`<html>
  <body>
    <div class="container">
      <h1>Title</h1>
    </div>
  </body>
</html>`);
});

test('handles empty multiline text properly', () => {
  const node: XMLNode = {
    name: 'pre',
    children: 'Line 1\n\nLine 3',
  };

  const result = serializeXML(node, { indent: 2 });
  expect(result).toBe(`<pre>
  Line 1

  Line 3
</pre>`);
});

test('handles mixed content types', () => {
  const node: XMLNode = {
    name: 'article',
    attributes: { id: 'main' },
    children: [
      {
        name: 'h1',
        children: 'Article Title',
      },
      null,
      {
        name: 'p',
        children: 'First paragraph with\nmultiple lines',
      },
      false,
      {
        name: 'footer',
        children: [],
      },
    ],
  };

  const result = serializeXML(node, { indent: 2 });
  expect(result).toBe(`<article id="main">
  <h1>Article Title</h1>
  <p>
    First paragraph with
    multiple lines
  </p>
  <footer></footer>
</article>`);
});

test('disables text escaping globally', () => {
  const node: XMLNode = {
    name: 'div',
    children: 'Raw <strong>HTML</strong> & content',
  };

  const result = serializeXML(node, { escapeText: false });
  expect(result).toBe('<div>Raw <strong>HTML</strong> & content</div>');
});

test('disables attribute escaping globally', () => {
  const node: XMLNode = {
    name: 'div',
    attributes: {
      title: 'Raw <content> & "quotes"',
      'data-html': '<span>test</span>',
    },
  };

  const result = serializeXML(node);
  expect(result).toBe(
    '<div title="Raw &lt;content&gt; &amp; &quot;quotes&quot;" data-html="&lt;span&gt;test&lt;/span&gt;" />',
  );
});

test('disables both text and attribute escaping globally', () => {
  const node: XMLNode = {
    name: 'div',
    attributes: { title: 'Raw <title> & content' },
    children: 'Raw <strong>HTML</strong> & content',
  };

  const result = serializeXML(node, {
    escapeText: false,
  });
  expect(result).toBe(
    '<div title="Raw &lt;title&gt; &amp; content">Raw <strong>HTML</strong> & content</div>',
  );
});

test('disables text escaping per node', () => {
  const node: XMLNode = {
    name: 'article',
    children: [
      {
        name: 'p',
        children: 'This <em>should</em> be escaped',
      },
      {
        name: 'div',
        escapeText: false,
        children: 'This <strong>should NOT</strong> be escaped',
      },
    ],
  };

  const result = serializeXML(node, { indent: 2 });
  expect(result).toBe(`<article>
  <p>This &lt;em&gt;should&lt;/em&gt; be escaped</p>
  <div>This <strong>should NOT</strong> be escaped</div>
</article>`);
});

test('per-node escaping options override global options', () => {
  const node: XMLNode = {
    name: 'div',
    children: [
      {
        name: 'p',
        attributes: { title: 'Global disabled' },
        children: 'Global disabled',
      },
      {
        name: 'p',
        escapeText: true,
        attributes: { title: 'Node enabled <override>' },
        children: 'Node enabled <override>',
      },
    ],
  };

  const result = serializeXML(node, {
    indent: 2,
    escapeText: false,
  });
  expect(result).toBe(`<div>
  <p title="Global disabled">Global disabled</p>
  <p title="Node enabled &lt;override&gt;">Node enabled &lt;override&gt;</p>
</div>`);
});

test('handles multiline text without escaping', () => {
  const node: XMLNode = {
    name: 'pre',
    escapeText: false,
    children: 'Line 1 with <tags>\nLine 2 with & symbols\n  Line 3 indented',
  };

  const result = serializeXML(node, { indent: 2 });
  expect(result).toBe(`<pre>
  Line 1 with <tags>
  Line 2 with & symbols
    Line 3 indented
</pre>`);
});

test('mixed escaping in nested structure', () => {
  const node: XMLNode = {
    name: 'html',
    children: [
      {
        name: 'head',
        children: [
          {
            name: 'style',
            escapeText: false,
            children: 'body { color: red; } /* <comment> */',
          },
        ],
      },
      {
        name: 'body',
        children: [
          {
            name: 'p',
            children: 'This <will> be escaped',
          },
          {
            name: 'script',
            escapeText: false,
            children: 'if (x < 5) { console.log("test"); }',
          },
        ],
      },
    ],
  };

  const result = serializeXML(node, { indent: 2 });
  expect(result).toBe(`<html>
  <head>
    <style>body { color: red; } /* <comment> */</style>
  </head>
  <body>
    <p>This &lt;will&gt; be escaped</p>
    <script>if (x < 5) { console.log("test"); }</script>
  </body>
</html>`);
});

test('no escapeText and indent', () => {
  const html = `<html>
  <head>
    <title>Hello</title>
  </head>
</html>
`;

  const result = serializeXML(
    {
      name: 'html',
      children: [
        {
          name: 'body',
          children: html,
        },
      ],
    },
    { indent: 2, escapeText: false },
  );

  expect(result).toMatchInlineSnapshot(`
    "<html>
      <body>
        <html>
          <head>
            <title>Hello</title>
          </head>
        </html>

      </body>
    </html>"
  `);
});

test('validateTagName: throws for invalid tag name by default', () => {
  const node: XMLNode = {
    name: '123invalid',
  };
  expect(() => serializeXML(node)).toThrow(
    'Invalid XML tag name: "123invalid"',
  );
});

test('validateTagName: throws for tag name starting with "xml" (case-insensitive)', () => {
  const node1: XMLNode = { name: 'xmlOkay' };
  const node2: XMLNode = { name: 'XmLNotOkay' };
  const node3: XMLNode = { name: 'XMlFine' };

  expect(() => serializeXML(node1, { validateTagName: true })).toThrow(
    'Invalid XML tag name: "xmlOkay"',
  );
  expect(() => serializeXML(node2, { validateTagName: true })).toThrow(
    'Invalid XML tag name: "XmLNotOkay"',
  );
  expect(() => serializeXML(node3, { validateTagName: true })).toThrow(
    'Invalid XML tag name: "XMlFine"',
  );
});

test('validateTagName: valid tag names pass validation', () => {
  const node1: XMLNode = { name: 'validTag' };
  const node2: XMLNode = { name: 'valid-tag_1.23' };
  const node3: XMLNode = { name: '_underscoreStart' };

  expect(serializeXML(node1, { validateTagName: true })).toBe('<validTag />');
  expect(serializeXML(node2, { validateTagName: true })).toBe(
    '<valid-tag_1.23 />',
  );
  expect(serializeXML(node3, { validateTagName: true })).toBe(
    '<_underscoreStart />',
  );
});

test('validateTagName: reject works with children', () => {
  const node: XMLNode = {
    name: 'parent',
    children: [
      { name: 'child1' },
      { name: 'invalid child' },
      { name: 'child2' },
    ],
  };
  const result = serializeXML(node, { invalidNodes: 'reject', indent: 2 });
  expect(result).toBe(`<parent>
  <child1 />
  <child2 />
</parent>`);
});

test('validateTagName: default (throw) works with children and stops serialization', () => {
  const node: XMLNode = {
    name: 'parent',
    children: [
      { name: 'child1' },
      { name: 'invalid child' },
      { name: 'child2' },
    ],
  };
  expect(() => serializeXML(node, { indent: 2 })).toThrow(
    'Invalid XML tag name: "invalid child"',
  );
});

test('serializes array of nodes without indentation', () => {
  const nodes: XMLNode[] = [
    { name: 'first', children: 'First element' },
    { name: 'second', attributes: { id: 'test' } },
    { name: 'third', children: [{ name: 'nested', children: 'content' }] },
  ];

  const result = serializeXML(nodes);
  expect(result).toBe(
    '<first>First element</first><second id="test" /><third><nested>content</nested></third>',
  );
});

test('serializes array of nodes with indentation', () => {
  const nodes: XMLNode[] = [
    { name: 'first', children: 'First element' },
    { name: 'second', attributes: { id: 'test' } },
    { name: 'third', children: [{ name: 'nested', children: 'content' }] },
  ];

  const result = serializeXML(nodes, { indent: 2 });
  expect(result).toBe(`<first>First element</first>
<second id="test" />
<third>
  <nested>content</nested>
</third>`);
});

test('serializes empty array', () => {
  const nodes: XMLNode[] = [];
  const result = serializeXML(nodes);
  expect(result).toBe('');
});

test('serializes array with mixed content', () => {
  const nodes: XMLNode[] = [
    { name: 'header', children: 'Page Title' },
    {
      name: 'content',
      attributes: { class: 'main' },
      children: [
        { name: 'p', children: 'First paragraph' },
        { name: 'p', children: 'Second paragraph' },
      ],
    },
    { name: 'footer' },
  ];

  const result = serializeXML(nodes, { indent: 2 });
  expect(result).toBe(`<header>Page Title</header>
<content class="main">
  <p>First paragraph</p>
  <p>Second paragraph</p>
</content>
<footer />`);
});
