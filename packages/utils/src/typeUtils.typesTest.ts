import type { DeepReplaceValue } from './typeUtils';
import { typingTest } from './typingTestUtils';

const { describe, test, expectTypesAre } = typingTest;

describe('typeUtils', () => {
  test('DeepReplaceValue', () => {
    type Input = {
      a: {
        b: {
          c: string;
        };
      };
    };

    type Output = DeepReplaceValue<Input, string, number>;

    expectTypesAre<Output, { a: { b: { c: number } } }>('equal');
  });

  test('DeepReplaceValue with arrays', () => {
    type InputArray = string[];
    type OutputArray = DeepReplaceValue<InputArray, string, boolean>;
    expectTypesAre<OutputArray, boolean[]>('equal');

    type InputNestedArray = string[][];
    type OutputNestedArray = DeepReplaceValue<InputNestedArray, string, number>;
    expectTypesAre<OutputNestedArray, number[][]>('equal');
  });

  test('DeepReplaceValue with mixed objects and arrays', () => {
    type InputMixed = {
      users: {
        id: string;
        tags: string[];
      }[];
      settings: {
        theme: string;
        options: {
          debug: string;
        };
      };
    };

    type OutputMixed = DeepReplaceValue<InputMixed, string, number>;

    expectTypesAre<
      OutputMixed,
      {
        users: {
          id: number;
          tags: number[];
        }[];
        settings: {
          theme: number;
          options: {
            debug: number;
          };
        };
      }
    >('equal');
  });

  test('DeepReplaceValue with different type replacements', () => {
    type InputBoolean = {
      flag: boolean;
      nested: {
        active: boolean;
        items: boolean[];
      };
    };

    type OutputBoolean = DeepReplaceValue<InputBoolean, boolean, string>;

    expectTypesAre<
      OutputBoolean,
      {
        flag: string;
        nested: {
          active: string;
          items: string[];
        };
      }
    >('equal');
  });

  test('DeepReplaceValue with no matching types', () => {
    type InputNoMatch = {
      id: number;
      count: number;
      data: {
        value: number;
      };
    };

    type OutputNoMatch = DeepReplaceValue<InputNoMatch, string, boolean>;

    expectTypesAre<
      OutputNoMatch,
      {
        id: number;
        count: number;
        data: {
          value: number;
        };
      }
    >('equal');
  });

  test('DeepReplaceValue with partial matches', () => {
    type InputPartial = {
      name: string;
      age: number;
      tags: string[];
      meta: {
        created: Date;
        title: string;
      };
    };

    type OutputPartial = DeepReplaceValue<InputPartial, string, { test: 0 }>;

    expectTypesAre<
      OutputPartial,
      {
        name: { test: 0 };
        age: number;
        tags: { test: 0 }[];
        meta: {
          created: Date;
          title: { test: 0 };
        };
      }
    >('equal');
  });

  test('DeepReplaceValue with union types', () => {
    type InvalidType = {
      test: 0;
    };

    type ValidType = {
      test: 1;
    };

    type InputUnion = {
      value: string | InvalidType;
      data: {
        content: string | boolean;
        items: (InvalidType | number)[];
      };
    };

    type OutputUnion = DeepReplaceValue<InputUnion, InvalidType, ValidType>;

    expectTypesAre<
      OutputUnion,
      {
        value: string | ValidType;
        data: {
          content: string | boolean;
          items: (ValidType | number)[];
        };
      }
    >('equal');
  });

  test('DeepReplaceValue in discriminated union', () => {
    type Union =
      | {
          type: 'a';
          value: string;
        }
      | {
          type: 'b';
          value: number;
        }
      | {
          type: 'c';
          value: boolean;
        };

    type Output = DeepReplaceValue<
      Union,
      string,
      number,
      undefined,
      Union['type']
    >;

    expectTypesAre<
      Output,
      | {
          type: 'a';
          value: number;
        }
      | {
          type: 'b';
          value: number;
        }
      | {
          type: 'c';
          value: boolean;
        }
    >('equal');
  });

  test('DeepReplaceValue with SkipPaths', () => {
    type Input = {
      name: string;
      user: {
        id: string;
        profile: {
          bio: string;
        };
      };
      tags: string[];
    };

    type OutputSkipProfile = DeepReplaceValue<
      Input,
      string,
      number,
      'user.profile.bio'
    >;

    expectTypesAre<
      OutputSkipProfile,
      {
        name: number;
        user: {
          id: number;
          profile: {
            bio: string; // should be skipped
          };
        };
        tags: number[];
      }
    >('equal');
  });

  test('DeepReplaceValue with SkipPaths array wildcard', () => {
    type Input = {
      items: {
        id: string;
        data: {
          content: string;
        };
      }[];
    };

    type OutputSkipArrayContent = DeepReplaceValue<
      Input,
      string,
      number,
      'items[*].data.content'
    >;

    expectTypesAre<
      OutputSkipArrayContent,
      {
        items: {
          id: number;
          data: {
            content: string; // should be skipped
          };
        }[];
      }
    >('equal');
  });

  test('DeepReplaceValue with SkipPaths nested', () => {
    type Input = {
      user: {
        name: string;
      };
      age: string;
    };

    type OutputNestedSkip = DeepReplaceValue<
      Input,
      string,
      number,
      'user.name'
    >;

    expectTypesAre<
      OutputNestedSkip,
      {
        user: {
          name: string; // should be skipped
        };
        age: number;
      }
    >('equal');
  });

  test('DeepReplaceValue with SkipPaths complex', () => {
    type Input = {
      config: {
        theme: string;
        debug: string;
      };
      items: string[];
    };

    type OutputSkipDebug = DeepReplaceValue<
      Input,
      string,
      number,
      'config.debug'
    >;

    expectTypesAre<
      OutputSkipDebug,
      {
        config: {
          theme: number;
          debug: string; // should be skipped
        };
        items: number[];
      }
    >('equal');
  });
});
