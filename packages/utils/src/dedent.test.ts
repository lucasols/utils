import { describe, expect, test } from 'vitest';
import { dedent } from './dedent';

test('works without interpolation', () => {
  expect(
    dedent`
      first
      				 second
      				 third
    `,
  ).toMatchInlineSnapshot(`
    "first
    				 second
    				 third"
  `);
});

test('works with interpolation', () => {
  expect(
    dedent`
      first ${'line'}
      				 ${'second'}
      				 third
    `,
  ).toMatchInlineSnapshot(`
    "first line
    				 second
    				 third"
  `);
});

test('works with suppressed newlines', () => {
  expect(
    dedent`
      first \
      				 ${'second'}
      				 third
    `,
  ).toMatchInlineSnapshot(`
    "first second
    				 third"
  `);
});

test('works with blank first line', () => {
  expect(dedent`
    Some text that I might want to indent:
    	* reasons
    	* fun
    That's all.
  `).toMatchInlineSnapshot(`
    "Some text that I might want to indent:
    	* reasons
    	* fun
    That's all."
  `);
});

test('works with multiple blank first lines', () => {
  expect(
    dedent`

      first
      second
      third
    `,
  ).toMatchInlineSnapshot(`
    "first
    second
    third"
  `);
});

test('works with removing same number of spaces', () => {
  expect(
    dedent`
      first
      	second
      		 third
    `,
  ).toMatchInlineSnapshot(`
    "first
    	second
    		 third"
  `);
});

describe('single line input', () => {
  test('works with single line input', () => {
    expect(dedent`A single line of input.`).toMatchInlineSnapshot(
      `"A single line of input."`,
    );
  });

  test('works with single line and closing backtick on newline', () => {
    expect(dedent`
      A single line of input.
    `).toMatchInlineSnapshot(`"A single line of input."`);
  });

  test('works with single line and inline closing backtick', () => {
    expect(dedent`
      A single line of input.
    `).toMatchInlineSnapshot(`"A single line of input."`);
  });
});

test('can be used as a function', () => {
  expect(
    dedent(`
      A test argument.
    `),
  ).toMatchInlineSnapshot(`"A test argument."`);
});

describe('function character escapes', () => {
  describe('default behavior', () => {
    test('does not escape backticks', () => {
      expect(dedent(`\``)).toMatchInlineSnapshot(`"\`"`);
    });

    test('does not escape dollar signs', () => {
      expect(dedent(`$`)).toMatchInlineSnapshot(`"$"`);
    });

    test('does not escape opening braces', () => {
      expect(dedent(`{`)).toMatchInlineSnapshot(`"{"`);
    });

    test('escapes double-escaped backticks', () => {
      expect(dedent(`\\\``)).toMatchInlineSnapshot(`"\\\`"`);
    });

    test('escapes double-escaped dollar signs', () => {
      expect(dedent(`\\$`)).toMatchInlineSnapshot(`"\\$"`);
    });

    test('escapes double-escaped opening braces', () => {
      expect(dedent(`\\{`)).toMatchInlineSnapshot(`"\\{"`);
    });

    test('ignores closing braces', () => {
      expect(dedent(`}`)).toMatchInlineSnapshot(`"}"`);
    });
  });

  describe.each([undefined, false, true])(
    'with escapeSpecialCharacters %s',
    (escapeSpecialCharacters) => {
      test('backticks', () => {
        expect(
          dedent.withOptions({ escapeSpecialCharacters })(`\``),
        ).toMatchSnapshot();
      });

      test('dollar signs', () => {
        expect(
          dedent.withOptions({ escapeSpecialCharacters })(`$`),
        ).toMatchSnapshot();
      });

      test('opening braces', () => {
        expect(
          dedent.withOptions({ escapeSpecialCharacters })(`{`),
        ).toMatchSnapshot();
      });

      test('double-escaped backticks', () => {
        expect(
          dedent.withOptions({ escapeSpecialCharacters })(`\\\``),
        ).toMatchSnapshot();
      });

      test('double-escaped dollar signs', () => {
        expect(
          dedent.withOptions({ escapeSpecialCharacters })(`\\$`),
        ).toMatchSnapshot();
      });

      test('double-escaped opening braces', () => {
        expect(
          dedent.withOptions({ escapeSpecialCharacters })(`\\{`),
        ).toMatchSnapshot();
      });
    },
  );
});

describe.each([undefined, false, true])(
  'with trimWhitespace %s',
  (trimWhitespace) => {
    test('with trailing whitespace', () => {
      expect(
        dedent.withOptions({ trimWhitespace })(
          `
						foo---
						bar---
					`.replace(/-/g, ' '),
        ),
      ).toMatchSnapshot();
    });

    test('without trailing whitespace', () => {
      expect(
        dedent.withOptions({ trimWhitespace })(
          `
						foo
						bar
					`.replace(/-/g, ' '),
        ),
      ).toMatchSnapshot();
    });

    test('with leading whitespace', () => {
      expect(
        dedent.withOptions({ trimWhitespace })(`


						foo
					`),
      ).toMatchSnapshot();
    });
  },
);

describe('string tag character escapes', () => {
  describe('default behavior', () => {
    test('escapes backticks', () => {
      expect(dedent`\``).toMatchSnapshot();
    });

    test('escapes dollar signs', () => {
      expect(dedent`\$`).toMatchSnapshot();
    });

    test('escapes opening braces', () => {
      expect(dedent`\{`).toMatchSnapshot();
    });

    test('ignores closing braces', () => {
      expect(dedent`\}`).toMatchSnapshot();
    });
  });

  describe.each([undefined, false, true])(
    'with escapeSpecialCharacters %s',
    (escapeSpecialCharacters) => {
      test('backticks', () => {
        expect(
          dedent.withOptions({ escapeSpecialCharacters })`\``,
        ).toMatchSnapshot();
      });

      test('dollar signs', () => {
        expect(
          dedent.withOptions({ escapeSpecialCharacters })`\$`,
        ).toMatchSnapshot();
      });

      test('opening braces', () => {
        expect(
          dedent.withOptions({ escapeSpecialCharacters })`\{`,
        ).toMatchSnapshot();
      });
    },
  );
});

test("doesn't strip explicit newlines", () => {
  expect(dedent`
    <p>Hello world!</p>\n
  `).toMatchSnapshot();
});

test("doesn't strip explicit newlines with mindent", () => {
  expect(dedent`
    <p>
    	Hello world!
    </p>\n
  `).toMatchSnapshot();
});

test('works with spaces for indentation', () => {
  expect(
    dedent`
      first
        second
          third
    `,
  ).toMatchSnapshot();
});

test('works with tabs for indentation', () => {
  expect(
    dedent`
      first
      	second
      		third
    `,
  ).toMatchSnapshot();
});

test('works with escaped tabs for indentation', () => {
  expect(dedent('\t\tfirst\n\t\t\tsecond\n\t\t\t\tthird')).toMatchSnapshot();
});

test('does not replace \\n when called as a function', () => {
  expect(dedent(`\\nu`)).toBe('\\nu');
});

test('escapes escaped interpolation', () => {
  expect(dedent`\${'foo'}`).toMatchInlineSnapshot(`"\${'foo'}"`);
});

describe('recursive dedent (default)', () => {
  test('dedents interpolated multiline strings', () => {
    const nested = `nested line 1
nested line 2`;

    expect(dedent`
      outer line 1
        ${nested}
      outer line 2
    `).toMatchInlineSnapshot(`
      "outer line 1
        nested line 1
        nested line 2
      outer line 2"
    `);
  });

  test('preserves indentation of interpolated strings relative to insertion point', () => {
    const nested = `item 1
item 2`;

    expect(dedent`
      list:
        ${nested}
      end
    `).toMatchInlineSnapshot(`
      "list:
        item 1
        item 2
      end"
    `);
  });

  test('handles deeply nested interpolations', () => {
    const level3 = `level 3 content`;

    const level2 = dedent`
      level 2 start
        ${level3}
      level 2 end
    `;

    const result = dedent`
      level 1 start
        ${level2}
      level 1 end
    `;

    expect(result).toMatchInlineSnapshot(`
      "level 1 start
        level 2 start
          level 3 content
        level 2 end
      level 1 end"
    `);
  });

  test('handles single-line interpolations', () => {
    const singleLine = 'single line value';

    expect(dedent`
      before
        ${singleLine}
      after
    `).toMatchInlineSnapshot(`
      "before
        single line value
      after"
    `);
  });

  test('handles empty string interpolations', () => {
    const empty = '';

    expect(dedent`
      before
        ${empty}
      after
    `).toMatchInlineSnapshot(`
      "before
  
      after"
    `);
  });
});

const noIdentInterpolations = dedent.withOptions({
  identInterpolations: false,
});

describe('with identInterpolations false', () => {
  test('does not dedent interpolated multiline strings', () => {
    const nested = `nested line 1
nested line 2`;

    expect(noIdentInterpolations`
          outer line 1
            ${nested}
          outer line 2
    `).toMatchInlineSnapshot(`
      "outer line 1
        nested line 1
      nested line 2
      outer line 2"
    `);
  });
});

test('do not show falsey values', () => {
  expect(dedent`
    false:
    ${false}
    null:
    ${null}
    undefined:
    ${undefined}
    number:
    ${123}
    true:
    ${true}
    ---
  `).toMatchInlineSnapshot(`
    "false:

    null:

    undefined:

    number:
    123
    true:
    true
    ---"
  `);
});
