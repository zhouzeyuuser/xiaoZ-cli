// const getChoice = (title) => ({ title, value: title })

export enum ChoiceEnum {
  eslint = `eslint`,
  vscode = `vscode`,
  editorConfig = `editorConfig`,
  ts = `ts`,
  commit = `commit`,
  release = `release`,
  jest = `jest`,
  travis = `travis`,
  clock = 'clock',
}

export const choiceList = [
  {
    value: ChoiceEnum.eslint,
    desc: `代码校验eslint`,
    links: [`https://eslint.org/docs/user-guide/configuring/`]
  },
  {
    value: ChoiceEnum.vscode,
    desc: `vscode配置json`,
  },
  {
    value: ChoiceEnum.editorConfig,
    desc: `编辑器格式化`,
  },
  {
    value: ChoiceEnum.ts,
    desc: `TS`,
  },
  {
    value: ChoiceEnum.commit,
    desc: `规范代码提交格式`,
    links: [
      `https://github.com/conventional-changelog/commitlint`,
      `https://typicode.github.io/husky/#/?id=automatic-recommended`,
      `https://github.com/okonet/lint-staged#example-ignore-files-from-match`
    ]
  },
  {
    value: ChoiceEnum.release,
    desc: `规范自动化发布`,
    links: [`https://github.com/conventional-changelog/standard-version`]
  },
  {
    value: ChoiceEnum.jest,
    desc: `单元测试`,
    links: [`https://jestjs.io/zh-Hans/docs/getting-started](https://jestjs.io/zh-Hans/docs/getting-started`]
  },
  {
    value: ChoiceEnum.travis,
    desc: `自动化CI/CD`,
    links: [`https://docs.travis-ci.com/user/tutorial/`]
  },
  {
    value: ChoiceEnum.clock,
    desc: `是否锁定package.json版本号`
  },
].map(v => ({
  ...v,
  title: (v as { title?: string }).title || `${v.value}  ${v.desc}`
}))

export const selectListOption = {
  type: 'multiselect',
  name: 'value',
  message: '选择需要集成的工具',
  choices: choiceList,
  hint: '- Space 选中. 回车提交'
}
