import {
  createBaseConfig,
  ERROR,
  ERROR_IN_CI,
} from '../../eslint.config.base.ts';

export default createBaseConfig({
  extraRuleGroups: [
    {
      files: ['src/**/*.ts', 'src/**/*.tsx'],
      rules: {
        '@ls-stack/rules-of-hooks': [ERROR],
        '@ls-stack/exhaustive-deps': [
          ERROR_IN_CI,
          {
            additionalHooks: 'useMemoWithPrev|useDeepMemo',
            enableDangerousAutofixThisMayCauseInfiniteLoops: true,
          },
        ],
      },
    },
  ],
});
