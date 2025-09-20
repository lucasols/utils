import { expect, test } from 'vitest';
import {
  concatStrings,
  convertToCamelCase,
  convertToConstantCase,
  convertToDotCase,
  convertToPathCase,
  convertToPascalCase,
  convertToSentenceCase,
  convertToSnakeCase,
  convertToTitleCase,
  formatNum,
  isCamelCase,
  isConstantCase,
  isDotCase,
  isKebabCase,
  isPathCase,
  isPascalCase,
  isSentenceCase,
  isSnakeCase,
  isTitleCase,
  truncateString,
} from './stringUtils';

test('convertToSnakeCase', () => {
  // Basic camelCase conversion
  expect(convertToSnakeCase('camelCase')).toBe('camel_case');
  expect(convertToSnakeCase('someVariableName')).toBe('some_variable_name');

  // PascalCase conversion
  expect(convertToSnakeCase('PascalCase')).toBe('pascal_case');
  expect(convertToSnakeCase('SomeClassName')).toBe('some_class_name');

  // Already lowercase
  expect(convertToSnakeCase('alreadylowercase')).toBe('alreadylowercase');
  expect(convertToSnakeCase('snake_case')).toBe('snake_case');

  // With numbers
  expect(convertToSnakeCase('version2Update')).toBe('version2_update');
  expect(convertToSnakeCase('api3Version')).toBe('api3_version');
  expect(convertToSnakeCase('test123ABC')).toBe('test123_abc');

  // With spaces and special characters (gets removed)
  expect(convertToSnakeCase('hello world')).toBe('hello_world');
  expect(convertToSnakeCase('hello-world')).toBe('hello_world');
  expect(convertToSnakeCase('hello.world')).toBe('hello_world');
  expect(convertToSnakeCase('hello@world')).toBe('helloworld');
  expect(convertToSnakeCase('hello world test')).toBe('hello_world_test');

  // Mixed cases with special characters
  expect(convertToSnakeCase('someVarName-withDashes')).toBe(
    'some_var_name_with_dashes',
  );
  expect(convertToSnakeCase('API_KEY')).toBe('api_key');
  expect(convertToSnakeCase('XMLHttpRequest')).toBe('xml_http_request');

  // Edge cases
  expect(convertToSnakeCase('')).toBe('');
  expect(convertToSnakeCase('A')).toBe('a');
  expect(convertToSnakeCase('a')).toBe('a');
  expect(convertToSnakeCase('123')).toBe('123');
  expect(convertToSnakeCase('_')).toBe('');
  expect(convertToSnakeCase('___')).toBe('');

  // Consecutive uppercase letters
  expect(convertToSnakeCase('HTTPSConnection')).toBe('https_connection');
  expect(convertToSnakeCase('URLParser')).toBe('url_parser');
  expect(convertToSnakeCase('XMLToJSON')).toBe('xml_to_json');

  // Unicode and special cases
  expect(convertToSnakeCase('café')).toBe('caf');
  expect(convertToSnakeCase('naïve')).toBe('nave');
});

test('convertToPascalCase', () => {
  // Basic snake_case conversion
  expect(convertToPascalCase('snake_case')).toBe('SnakeCase');
  expect(convertToPascalCase('some_variable_name')).toBe('SomeVariableName');

  // kebab-case conversion
  expect(convertToPascalCase('kebab-case')).toBe('KebabCase');
  expect(convertToPascalCase('some-component-name')).toBe('SomeComponentName');

  // Space-separated words
  expect(convertToPascalCase('hello world')).toBe('HelloWorld');
  expect(convertToPascalCase('the quick brown fox')).toBe('TheQuickBrownFox');

  // Mixed separators
  expect(convertToPascalCase('mixed_case-with spaces')).toBe(
    'MixedCaseWithSpaces',
  );
  expect(convertToPascalCase('api_key-value test')).toBe('ApiKeyValueTest');

  // Already PascalCase
  expect(convertToPascalCase('AlreadyPascalCase')).toBe('Alreadypascalcase');
  expect(convertToPascalCase('XMLHttpRequest')).toBe('Xmlhttprequest');

  // camelCase input
  expect(convertToPascalCase('camelCaseInput')).toBe('Camelcaseinput');
  expect(convertToPascalCase('someVariableName')).toBe('Somevariablename');

  // With numbers
  expect(convertToPascalCase('version_2_update')).toBe('Version2Update');
  expect(convertToPascalCase('api-3-version')).toBe('Api3Version');
  expect(convertToPascalCase('test 123 abc')).toBe('Test123Abc');

  // Edge cases
  expect(convertToPascalCase('')).toBe('');
  expect(convertToPascalCase('a')).toBe('A');
  expect(convertToPascalCase('single')).toBe('Single');
  expect(convertToPascalCase('_')).toBe('');
  expect(convertToPascalCase('___')).toBe('');
  expect(convertToPascalCase('   ')).toBe('');

  // Multiple consecutive separators
  expect(convertToPascalCase('multiple___underscores')).toBe(
    'MultipleUnderscores',
  );
  expect(convertToPascalCase('multiple---dashes')).toBe('MultipleDashes');
  expect(convertToPascalCase('multiple   spaces')).toBe('MultipleSpaces');
});

test('convertToCamelCase', () => {
  // Basic snake_case conversion
  expect(convertToCamelCase('snake_case')).toBe('snakeCase');
  expect(convertToCamelCase('some_variable_name')).toBe('someVariableName');

  // kebab-case conversion
  expect(convertToCamelCase('kebab-case')).toBe('kebabCase');
  expect(convertToCamelCase('some-component-name')).toBe('someComponentName');

  // Space-separated words
  expect(convertToCamelCase('hello world')).toBe('helloWorld');
  expect(convertToCamelCase('the quick brown fox')).toBe('theQuickBrownFox');

  // Mixed separators
  expect(convertToCamelCase('mixed_case-with spaces')).toBe(
    'mixedCaseWithSpaces',
  );
  expect(convertToCamelCase('api_key-value test')).toBe('apiKeyValueTest');

  // Already camelCase
  expect(convertToCamelCase('alreadyCamelCase')).toBe('alreadycamelcase');
  expect(convertToCamelCase('someVariableName')).toBe('somevariablename');

  // PascalCase input
  expect(convertToCamelCase('PascalCaseInput')).toBe('pascalcaseinput');
  expect(convertToCamelCase('XMLHttpRequest')).toBe('xmlhttprequest');

  // With numbers
  expect(convertToCamelCase('version_2_update')).toBe('version2Update');
  expect(convertToCamelCase('api-3-version')).toBe('api3Version');
  expect(convertToCamelCase('test 123 abc')).toBe('test123Abc');

  // Edge cases
  expect(convertToCamelCase('')).toBe('');
  expect(convertToCamelCase('a')).toBe('a');
  expect(convertToCamelCase('single')).toBe('single');
  expect(convertToCamelCase('_')).toBe('');
  expect(convertToCamelCase('___')).toBe('');
  expect(convertToCamelCase('   ')).toBe('');

  // Multiple consecutive separators
  expect(convertToCamelCase('multiple___underscores')).toBe(
    'multipleUnderscores',
  );
  expect(convertToCamelCase('multiple---dashes')).toBe('multipleDashes');
  expect(convertToCamelCase('multiple   spaces')).toBe('multipleSpaces');
});

test('convertToSentenceCase', () => {
  // Basic snake_case conversion
  expect(convertToSentenceCase('snake_case')).toBe('Snake case');
  expect(convertToSentenceCase('some_variable_name')).toBe(
    'Some variable name',
  );

  // kebab-case conversion
  expect(convertToSentenceCase('kebab-case')).toBe('Kebab case');
  expect(convertToSentenceCase('some-component-name')).toBe(
    'Some component name',
  );

  // Space-separated words
  expect(convertToSentenceCase('hello world')).toBe('Hello world');
  expect(convertToSentenceCase('the quick brown fox')).toBe(
    'The quick brown fox',
  );

  // Mixed separators
  expect(convertToSentenceCase('mixed_case-with spaces')).toBe(
    'Mixed case with spaces',
  );
  expect(convertToSentenceCase('api_key-value test')).toBe(
    'Api key value test',
  );

  // CamelCase and PascalCase input
  expect(convertToSentenceCase('camelCaseInput')).toBe('Camel case input');
  expect(convertToSentenceCase('PascalCaseInput')).toBe('Pascal case input');
  expect(convertToSentenceCase('XMLHttpRequest')).toBe('Xml http request');

  // With numbers
  expect(convertToSentenceCase('version_2_update')).toBe('Version 2 update');
  expect(convertToSentenceCase('api-3-version')).toBe('Api 3 version');
  expect(convertToSentenceCase('test 123 abc')).toBe('Test 123 abc');

  // Edge cases
  expect(convertToSentenceCase('')).toBe('');
  expect(convertToSentenceCase('a')).toBe('A');
  expect(convertToSentenceCase('single')).toBe('Single');
  expect(convertToSentenceCase('_')).toBe(' ');
  expect(convertToSentenceCase('___')).toBe(' ');
  expect(convertToSentenceCase('   ')).toBe(' ');

  // Multiple consecutive separators
  expect(convertToSentenceCase('multiple___underscores')).toBe(
    'Multiple underscores',
  );
  expect(convertToSentenceCase('multiple---dashes')).toBe('Multiple dashes');
  expect(convertToSentenceCase('multiple   spaces')).toBe('Multiple spaces');

  // Already sentence case
  expect(convertToSentenceCase('Already sentence case')).toBe(
    'Already sentence case',
  );
  expect(convertToSentenceCase('UPPERCASE WORDS')).toBe('Uppercase words');
});

test('convertToTitleCase', () => {
  // Basic snake_case conversion
  expect(convertToTitleCase('snake_case')).toBe('Snake Case');
  expect(convertToTitleCase('some_variable_name')).toBe('Some Variable Name');

  // kebab-case conversion
  expect(convertToTitleCase('kebab-case')).toBe('Kebab Case');
  expect(convertToTitleCase('some-component-name')).toBe('Some Component Name');

  // Space-separated words
  expect(convertToTitleCase('hello world')).toBe('Hello World');
  expect(convertToTitleCase('the quick brown fox')).toBe('The Quick Brown Fox');

  // Mixed separators
  expect(convertToTitleCase('mixed_case-with spaces')).toBe(
    'Mixed Case With Spaces',
  );
  expect(convertToTitleCase('api_key-value test')).toBe('Api Key Value Test');

  // CamelCase and PascalCase input
  expect(convertToTitleCase('camelCaseInput')).toBe('Camel Case Input');
  expect(convertToTitleCase('PascalCaseInput')).toBe('Pascal Case Input');
  expect(convertToTitleCase('XMLHttpRequest')).toBe('Xml Http Request');

  // With numbers
  expect(convertToTitleCase('version_2_update')).toBe('Version 2 Update');
  expect(convertToTitleCase('api-3-version')).toBe('Api 3 Version');
  expect(convertToTitleCase('test 123 abc')).toBe('Test 123 Abc');

  // Edge cases
  expect(convertToTitleCase('')).toBe('');
  expect(convertToTitleCase('a')).toBe('A');
  expect(convertToTitleCase('single')).toBe('Single');
  expect(convertToTitleCase('_')).toBe(' ');
  expect(convertToTitleCase('___')).toBe(' ');
  expect(convertToTitleCase('   ')).toBe(' ');

  // Multiple consecutive separators
  expect(convertToTitleCase('multiple___underscores')).toBe(
    'Multiple Underscores',
  );
  expect(convertToTitleCase('multiple---dashes')).toBe('Multiple Dashes');
  expect(convertToTitleCase('multiple   spaces')).toBe('Multiple Spaces');

  // Already title case
  expect(convertToTitleCase('Already Title Case')).toBe('Already Title Case');
  expect(convertToTitleCase('UPPERCASE WORDS')).toBe('Uppercase Words');

  // Complex camelCase with numbers and abbreviations
  expect(convertToTitleCase('getUserID')).toBe('Get User Id');
  expect(convertToTitleCase('parseHTMLString')).toBe('Parse Html String');
  expect(convertToTitleCase('handleAPI2Response')).toBe('Handle Api2 Response');
});

test('isSnakeCase', () => {
  // Valid snake_case
  expect(isSnakeCase('snake_case')).toBe(true);
  expect(isSnakeCase('valid_snake_case')).toBe(true);
  expect(isSnakeCase('simple')).toBe(true);
  expect(isSnakeCase('with_numbers_123')).toBe(true);
  expect(isSnakeCase('_leading_underscore')).toBe(true);
  expect(isSnakeCase('trailing_underscore_')).toBe(true);
  expect(isSnakeCase('___multiple___underscores___')).toBe(true);
  expect(isSnakeCase('123_numbers_first')).toBe(true);

  // Invalid cases
  expect(isSnakeCase('CamelCase')).toBe(false);
  expect(isSnakeCase('camelCase')).toBe(false);
  expect(isSnakeCase('with spaces')).toBe(false);
  expect(isSnakeCase('with-dashes')).toBe(false);
  expect(isSnakeCase('with.dots')).toBe(false);
  expect(isSnakeCase('with@special')).toBe(false);
  expect(isSnakeCase('')).toBe(false);
});

test('isKebabCase', () => {
  // Valid kebab-case
  expect(isKebabCase('kebab-case')).toBe(true);
  expect(isKebabCase('valid-kebab-case')).toBe(true);
  expect(isKebabCase('simple')).toBe(true);
  expect(isKebabCase('with-numbers-123')).toBe(true);
  expect(isKebabCase('single-word')).toBe(true);
  expect(isKebabCase('multiple-word-string')).toBe(true);
  expect(isKebabCase('123-numbers-first')).toBe(true);
  expect(isKebabCase('numbers123')).toBe(true);

  // Invalid cases
  expect(isKebabCase('CamelCase')).toBe(false);
  expect(isKebabCase('camelCase')).toBe(false);
  expect(isKebabCase('PascalCase')).toBe(false);
  expect(isKebabCase('with spaces')).toBe(false);
  expect(isKebabCase('with_underscores')).toBe(false);
  expect(isKebabCase('with.dots')).toBe(false);
  expect(isKebabCase('with@special')).toBe(false);
  expect(isKebabCase('-leading-dash')).toBe(false);
  expect(isKebabCase('trailing-dash-')).toBe(false);
  expect(isKebabCase('double--dash')).toBe(false);
  expect(isKebabCase('')).toBe(false);
  expect(isKebabCase('Mixed-Case')).toBe(false);
});

test('isPascalCase', () => {
  // Valid PascalCase
  expect(isPascalCase('PascalCase')).toBe(true);
  expect(isPascalCase('ValidPascalCase')).toBe(true);
  expect(isPascalCase('Simple')).toBe(true);
  expect(isPascalCase('WithNumbers123')).toBe(true);
  expect(isPascalCase('SingleWord')).toBe(true);
  expect(isPascalCase('MultipleWordString')).toBe(true);
  expect(isPascalCase('XMLHttpRequest')).toBe(true);
  expect(isPascalCase('APIKey')).toBe(true);
  expect(isPascalCase('A')).toBe(true);
  expect(isPascalCase('AB')).toBe(true);
  expect(isPascalCase('ABC123')).toBe(true);

  // Invalid cases
  expect(isPascalCase('camelCase')).toBe(false);
  expect(isPascalCase('snake_case')).toBe(false);
  expect(isPascalCase('kebab-case')).toBe(false);
  expect(isPascalCase('with spaces')).toBe(false);
  expect(isPascalCase('With Spaces')).toBe(false);
  expect(isPascalCase('with.dots')).toBe(false);
  expect(isPascalCase('with@special')).toBe(false);
  expect(isPascalCase('lowercase')).toBe(false);
  expect(isPascalCase('')).toBe(false);
  expect(isPascalCase('123StartingWithNumber')).toBe(false);
  expect(isPascalCase('_StartingWithUnderscore')).toBe(false);
});

test('isCamelCase', () => {
  // Valid camelCase
  expect(isCamelCase('camelCase')).toBe(true);
  expect(isCamelCase('validCamelCase')).toBe(true);
  expect(isCamelCase('simple')).toBe(true);
  expect(isCamelCase('withNumbers123')).toBe(true);
  expect(isCamelCase('singleWord')).toBe(true);
  expect(isCamelCase('multipleWordString')).toBe(true);
  expect(isCamelCase('xmlHttpRequest')).toBe(true);
  expect(isCamelCase('apiKey')).toBe(true);
  expect(isCamelCase('a')).toBe(true);
  expect(isCamelCase('aB')).toBe(true);
  expect(isCamelCase('aBC123')).toBe(true);

  // Invalid cases
  expect(isCamelCase('PascalCase')).toBe(false);
  expect(isCamelCase('snake_case')).toBe(false);
  expect(isCamelCase('kebab-case')).toBe(false);
  expect(isCamelCase('with spaces')).toBe(false);
  expect(isCamelCase('With Spaces')).toBe(false);
  expect(isCamelCase('with.dots')).toBe(false);
  expect(isCamelCase('with@special')).toBe(false);
  expect(isCamelCase('UPPERCASE')).toBe(false);
  expect(isCamelCase('')).toBe(false);
  expect(isCamelCase('123startingWithNumber')).toBe(false);
  expect(isCamelCase('_startingWithUnderscore')).toBe(false);
});

test('isTitleCase', () => {
  // Valid Title Case
  expect(isTitleCase('Title Case')).toBe(true);
  expect(isTitleCase('Valid Title Case')).toBe(true);
  expect(isTitleCase('Simple')).toBe(true);
  expect(isTitleCase('With Numbers 123')).toBe(true);
  expect(isTitleCase('Single Word')).toBe(true);
  expect(isTitleCase('Multiple Word String')).toBe(true);
  expect(isTitleCase('Api Key')).toBe(true);
  expect(isTitleCase('A')).toBe(true);
  expect(isTitleCase('A B')).toBe(true);
  expect(isTitleCase('Test 123')).toBe(true);

  // Invalid cases
  expect(isTitleCase('camelCase')).toBe(false);
  expect(isTitleCase('PascalCase')).toBe(false);
  expect(isTitleCase('snake_case')).toBe(false);
  expect(isTitleCase('kebab-case')).toBe(false);
  expect(isTitleCase('title case')).toBe(false); // lowercase words
  expect(isTitleCase('Title case')).toBe(false); // mixed case
  expect(isTitleCase('TITLE CASE')).toBe(false); // all uppercase
  expect(isTitleCase('Title  Case')).toBe(false); // double space
  expect(isTitleCase('Title-Case')).toBe(false); // with dash
  expect(isTitleCase('Title.Case')).toBe(false); // with dot
  expect(isTitleCase('Title@Case')).toBe(false); // with special char
  expect(isTitleCase('')).toBe(false);
  expect(isTitleCase('123 Title')).toBe(false); // starting with number
  expect(isTitleCase(' Title')).toBe(false); // leading space
  expect(isTitleCase('Title ')).toBe(false); // trailing space
});

test('isSentenceCase', () => {
  // Valid Sentence case
  expect(isSentenceCase('Sentence case')).toBe(true);
  expect(isSentenceCase('Valid sentence case')).toBe(true);
  expect(isSentenceCase('Simple')).toBe(true);
  expect(isSentenceCase('With numbers 123')).toBe(true);
  expect(isSentenceCase('Single word')).toBe(true);
  expect(isSentenceCase('Multiple word string')).toBe(true);
  expect(isSentenceCase('Api key value')).toBe(true);
  expect(isSentenceCase('A')).toBe(true);
  expect(isSentenceCase('A b')).toBe(true);
  expect(isSentenceCase('Test 123')).toBe(true);
  expect(isSentenceCase('Test with multiple words here')).toBe(true);

  // Invalid cases
  expect(isSentenceCase('camelCase')).toBe(false);
  expect(isSentenceCase('PascalCase')).toBe(false);
  expect(isSentenceCase('snake_case')).toBe(false);
  expect(isSentenceCase('kebab-case')).toBe(false);
  expect(isSentenceCase('Title Case')).toBe(false); // multiple capitals
  expect(isSentenceCase('sentence case')).toBe(false); // lowercase start
  expect(isSentenceCase('SENTENCE CASE')).toBe(false); // all uppercase
  expect(isSentenceCase('Sentence  case')).toBe(false); // double space
  expect(isSentenceCase('Sentence-case')).toBe(false); // with dash
  expect(isSentenceCase('Sentence.case')).toBe(false); // with dot
  expect(isSentenceCase('Sentence@case')).toBe(false); // with special char
  expect(isSentenceCase('')).toBe(false);
  expect(isSentenceCase('123 sentence')).toBe(false); // starting with number
  expect(isSentenceCase(' Sentence')).toBe(false); // leading space
  expect(isSentenceCase('Sentence ')).toBe(false); // trailing space
  expect(isSentenceCase('Sentence Case word')).toBe(false); // capital in middle
});

test('concatStrings', () => {
  expect(concatStrings('a', 'b', 'c')).toBe('abc');
  expect(concatStrings('a', false, 'c')).toBe('ac');
  expect(concatStrings('a', null, 'c')).toBe('ac');
  expect(concatStrings('a', undefined, 'c')).toBe('ac');
  expect(concatStrings('hello', ' ', 'world')).toBe('hello world');
  expect(concatStrings(['a', 'b'], 'c')).toBe('abc');
  expect(concatStrings('a', ['b', false, 'c'])).toBe('abc');
});

test('formatNum', () => {
  expect(formatNum(1234.5678)).toBe('1,234.57');
  expect(formatNum(0)).toBe('0');
  expect(formatNum(1000000)).toBe('1,000,000');
  expect(formatNum(-500.123)).toBe('-500.12');
});

test('truncateString', () => {
  expect(truncateString('hello world', 10)).toBe('hello wor…');
  expect(truncateString('short', 10)).toBe('short');
  expect(truncateString('exactly10c', 10)).toBe('exactly10c');
  expect(truncateString('toolongstring', 8, '...')).toBe('toolong...');
  expect(truncateString('', 5)).toBe('');
});

test('isConstantCase', () => {
  // Valid CONSTANT_CASE
  expect(isConstantCase('CONSTANT_CASE')).toBe(true);
  expect(isConstantCase('API_KEY')).toBe(true);
  expect(isConstantCase('MAX_VALUE')).toBe(true);
  expect(isConstantCase('A')).toBe(true);
  expect(isConstantCase('_PRIVATE')).toBe(true);
  expect(isConstantCase('VALUE_123')).toBe(true);

  // Invalid cases
  expect(isConstantCase('snake_case')).toBe(false);
  expect(isConstantCase('camelCase')).toBe(false);
  expect(isConstantCase('PascalCase')).toBe(false);
  expect(isConstantCase('with spaces')).toBe(false);
  expect(isConstantCase('with-dashes')).toBe(false);
  expect(isConstantCase('123INVALID')).toBe(false);
  expect(isConstantCase('')).toBe(false);
});

test('isDotCase', () => {
  // Valid dot.case
  expect(isDotCase('dot.case')).toBe(true);
  expect(isDotCase('api.key')).toBe(true);
  expect(isDotCase('simple')).toBe(true);
  expect(isDotCase('with.numbers.123')).toBe(true);
  expect(isDotCase('a.b.c')).toBe(true);

  // Invalid cases
  expect(isDotCase('CamelCase')).toBe(false);
  expect(isDotCase('with spaces')).toBe(false);
  expect(isDotCase('with_underscores')).toBe(false);
  expect(isDotCase('.leading.dot')).toBe(false);
  expect(isDotCase('trailing.dot.')).toBe(false);
  expect(isDotCase('double..dot')).toBe(false);
  expect(isDotCase('')).toBe(false);
});

test('isPathCase', () => {
  // Valid path/case
  expect(isPathCase('path/case')).toBe(true);
  expect(isPathCase('api/key')).toBe(true);
  expect(isPathCase('simple')).toBe(true);
  expect(isPathCase('with/numbers/123')).toBe(true);
  expect(isPathCase('a/b/c')).toBe(true);

  // Invalid cases
  expect(isPathCase('CamelCase')).toBe(false);
  expect(isPathCase('with spaces')).toBe(false);
  expect(isPathCase('with_underscores')).toBe(false);
  expect(isPathCase('/leading/slash')).toBe(false);
  expect(isPathCase('trailing/slash/')).toBe(false);
  expect(isPathCase('double//slash')).toBe(false);
  expect(isPathCase('')).toBe(false);
});

test('convertToConstantCase', () => {
  expect(convertToConstantCase('camelCase')).toBe('CAMEL_CASE');
  expect(convertToConstantCase('PascalCase')).toBe('PASCAL_CASE');
  expect(convertToConstantCase('snake_case')).toBe('SNAKE_CASE');
  expect(convertToConstantCase('kebab-case')).toBe('KEBAB_CASE');
  expect(convertToConstantCase('with spaces')).toBe('WITH_SPACES');
  expect(convertToConstantCase('XMLHttpRequest')).toBe('XML_HTTP_REQUEST');
  expect(convertToConstantCase('')).toBe('');
});

test('convertToDotCase', () => {
  expect(convertToDotCase('camelCase')).toBe('camel.case');
  expect(convertToDotCase('PascalCase')).toBe('pascal.case');
  expect(convertToDotCase('snake_case')).toBe('snake.case');
  expect(convertToDotCase('kebab-case')).toBe('kebab.case');
  expect(convertToDotCase('with spaces')).toBe('with.spaces');
  expect(convertToDotCase('XMLHttpRequest')).toBe('xml.http.request');
  expect(convertToDotCase('')).toBe('');
});

test('convertToPathCase', () => {
  expect(convertToPathCase('camelCase')).toBe('camel/case');
  expect(convertToPathCase('PascalCase')).toBe('pascal/case');
  expect(convertToPathCase('snake_case')).toBe('snake/case');
  expect(convertToPathCase('kebab-case')).toBe('kebab/case');
  expect(convertToPathCase('with spaces')).toBe('with/spaces');
  expect(convertToPathCase('XMLHttpRequest')).toBe('xml/http/request');
  expect(convertToPathCase('')).toBe('');
});
