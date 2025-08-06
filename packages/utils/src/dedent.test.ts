import { describe, expect, it, test } from 'vitest';
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
  });
});
