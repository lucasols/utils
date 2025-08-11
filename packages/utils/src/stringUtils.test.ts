import { expect, test } from 'vitest';
import {
  concatStrings,
  convertToCamelCase,
  convertToPascalCase,
  convertToSentenceCase,
  convertToSnakeCase,
  formatNum,
  isSnakeCase,
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
  expect(convertToSentenceCase('camelCaseInput')).toBe('Camelcaseinput');
  expect(convertToSentenceCase('PascalCaseInput')).toBe('Pascalcaseinput');
  expect(convertToSentenceCase('XMLHttpRequest')).toBe('Xmlhttprequest');

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
