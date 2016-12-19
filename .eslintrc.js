module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    mocha: true,
    es6: true,
  },
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  extends: 'airbnb-base',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // check if imports actually resolve
  'settings': {
    'import/resolver': {
      'webpack': {
        'config': 'build/webpack.base.conf.js'
      }
    }
  },
  // add your custom rules here
  'rules': {
    // don't require .vue extension when importing
    'import/extensions': ['error', 'always', {
      'js': 'never',
      'vue': 'never'
    }],
    // 结尾禁用逗号
    'comma-dangle': ['error', 'never'],
    // 结尾禁用分号
    'semi': ['error', 'never'],
    // 允许在 for 循环的最后一个表达式中使用 ++ 和 --
    'no-plusplus': ["error", { "allowForLoopAfterthoughts": true }],
    // 可以对函数参数再赋值
    'no-param-reassign': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
