import { expect, test } from 'vitest';
import { serialize, type XMLNode } from './xmlSerializer';

test('serializes self-closing tag without children', () => {
  const node: XMLNode = {
    name: 'input',
    attributes: { type: 'text', value: 'hello' },
  };

  const result = serialize(node);
  expect(result).toBe('<input type="text" value="hello" />');
});

test('serializes self-closing tag without attributes', () => {
  const node: XMLNode = {
    name: 'br',
  };

  const result = serialize(node);
  expect(result).toBe('<br />');
});

test('serializes element with text content', () => {
  const node: XMLNode = {
    name: 'p',
    children: 'Hello World',
  };

  const result = serialize(node);
  expect(result).toBe('<p>Hello World</p>');
});

test('serializes element with text content and attributes', () => {
  const node: XMLNode = {
    name: 'p',
    attributes: { class: 'text', id: 'content' },
    children: 'Hello World',
  };

  const result = serialize(node);
  expect(result).toBe('<p class="text" id="content">Hello World</p>');
});

test('serializes empty element', () => {
  const node: XMLNode = {
    name: 'div',
    children: [],
  };

  const result = serialize(node);
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

  const result = serialize(node);
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

  const result = serialize(node, { indent: 2 });
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

  const result = serialize(node, { indent: '\t' });
  expect(result).toBe(`<div>
\t<p>Content</p>
</div>`);
});

test('handles multiline text with indentation', () => {
  const node: XMLNode = {
    name: 'pre',
    children: 'Line 1\nLine 2\n  Line 3',
  };

  const result = serialize(node, { indent: 2 });
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

  const result = serialize(node);
  expect(result).toBe('<pre>Line 1\nLine 2\n  Line 3</pre>');
});

test('escapes XML characters in text content', () => {
  const node: XMLNode = {
    name: 'p',
    children: 'Text with <tags> & "quotes" and \'apostrophes\'',
  };

  const result = serialize(node);
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

  const result = serialize(node);
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

  const result = serialize(node);
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

  const result = serialize(node);
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

  const result = serialize(node, { indent: 2 });
  expect(result).toBe(`<div>
  <p>Valid</p>
  <span>Also valid</span>
</div>`);
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

  const result = serialize(node, { indent: 2 });
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

  const result = serialize(node, { indent: 2 });
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

  const result = serialize(node, { indent: 2 });
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

  const result = serialize(node, { escapeText: false });
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

  const result = serialize(node);
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

  const result = serialize(node, {
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

  const result = serialize(node, { indent: 2 });
  expect(result).toBe(`<article>
  <p>This &lt;em&gt;should&lt;/em&gt; be escaped</p>
  <div>This <strong>should NOT</strong> be escaped</div>
</article>`);
});

test('disables attribute escaping per node', () => {
  const node: XMLNode = {
    name: 'div',
    children: [
      {
        name: 'span',
        attributes: { title: 'This <should> be escaped' },
      },
      {
        name: 'span',
        attributes: { title: 'This <should NOT> be escaped' },
      },
    ],
  };

  const result = serialize(node, { indent: 2 });
  expect(result).toBe(`<div>
  <span title="This &lt;should&gt; be escaped" />
  <span title="This &lt;should NOT&gt; be escaped" />
</div>`);
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

  const result = serialize(node, {
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

  const result = serialize(node, { indent: 2 });
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

  const result = serialize(node, { indent: 2 });
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
