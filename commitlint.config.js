//-----------------------------------------------------------------------------------------------------------------------------------------------------
// build: Changes that affect the build system or external dependencies
// chore: used for miscellaneous changes that don't affect the main codebase(configuring development tools, setting up project-specific settings)
// ci: Changes to our CI configuration files and scripts
// docs: Documentation only changes
// feat: A new feature
// fix: A bug fix
// perf: A code change that improves performance
// refactor: A code change that neither fixes a bug nor adds a feature
// style: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
// test: Adding missing tests or correcting existing tests
// translation: Changes related to translations or language localization. This includes adding or updating translations in the codebase.
// security: Changes that address security vulnerabilities, implement security measures, or enhance the overall security of the codebase.
// -----------------------------------------------------------------------------------------------------------------------------------------------------

module.exports = {
    parserPreset: {
      parserOpts: {
        headerPattern: /^(.*?):(.*)/,
        headerCorrespondence: ['type', 'subject'],
      }
    },
    plugins: [
      {
        rules: {
          'header-match-team-pattern': (parsed) => {
            const { type, subject } = parsed;
            if (type === null && subject === null) {
              return [
                false,
                '\x1b[31mERROR\x1b[0m: Please follow the format \'[chore] subject\'',
              ];
            }
            
return [
              true, 
              ''
            ];
          },
          'type-enum': (parsed, _when, expectedValue) => {
              const { type } = parsed;
              if (type && !expectedValue.includes(type)) {
                return [false, `\x1b[31mERROR\x1b[0m: [${type}] doesn't include in [${expectedValue}]`];
              }
              
return [true, ''];
              },
        },
      },
    ],
    rules: {
      'header-match-team-pattern': [2, 'always'],
      'type-enum': [
        2,
        'always',
        [
          'build',
          'chore',
          'ci',
          'docs',
          'feat',
          'fix',
          'perf',
          'refactor',
          'revert',
          'style',
          'test',
        ],
      ],
      'subject-empty': [2, 'never'],
      'body-leading-blank': [2, 'always'],
      'footer-leading-blank': [2, 'always'],
      'footer-empty': [2, 'always'],
    },
  };