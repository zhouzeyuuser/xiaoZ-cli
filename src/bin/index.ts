#!/usr/bin/env node

import commander from 'commander';
import prompts from 'prompts';
import { addCommit } from '../lib/scripts/commit';
import { addEditorConfig, addEslint, addTs } from '../lib/scripts/eslint';
import { addJest } from '../lib/scripts/jest';
import { showList } from '../lib/scripts/list';
import { addRelease } from '../lib/scripts/release';
import { addTravis } from '../lib/scripts/travis';
import { addVscode } from '../lib/scripts/vscode';
import { addClock } from '../lib/scripts/clock';

import { selectListOption, ChoiceEnum } from '../lib/selects'
import { installDeps, logFn, exec } from '../lib/utils';
const prompts = require('prompts');

interface Command extends commander.Command {
  dep: ChoiceEnum[];
  all: boolean;
  list: boolean;
}

const program: Command = commander.program as Command;

async function start() {
  program
    .option('-D, --dep [dep...]', '需要集成的工具，支持 xiaoz cli -D jest eslint ts editorConfig commit vscode release travis')
    .option('-a, --all', '是否全部集成')
    .option('-l, --list', '查看支持的工具')
    .parse(process.argv);
  let { dep } = program.opts()
  const { all, list } = program.opts()

  if (dep === undefined && !all && !list) {
    const { value } = await prompts(selectListOption)
    dep = Array.isArray(value) ? value : value ? [value] : []
    if (!dep?.length) {
      throw new Error(`必须选择dep`)
    }
  }

  dep = dep || []
  const hasEditorConfig = dep.includes(ChoiceEnum.editorConfig)
  if (hasEditorConfig || all) {
    logFn(() => addEditorConfig(), `editorConfig`)
  }

  const hasTs = dep.includes(ChoiceEnum.ts)
  if (hasTs || all) {
    logFn(() => addTs(), `ts`)
  }

  const hasEslint = dep.includes(ChoiceEnum.eslint)
  if (hasEslint || all) {
    logFn(() => addEslint(hasEditorConfig), `eslint`)
  }

  const hasVscode = dep.includes(ChoiceEnum.vscode)
  if (hasVscode || all) {
    logFn(() => addVscode(), `vscode`)
  }

  const hasCommit = dep.includes(ChoiceEnum.commit)
  if (hasCommit || all) {
    logFn(() => addCommit(), `commit`)
  }

  const hasRelease = dep.includes(ChoiceEnum.release)
  if (hasRelease || all) {
    logFn(() => addRelease(), `release`)
  }

  const hasJest = dep.includes(ChoiceEnum.jest)
  if (hasJest || all) {
    logFn(() => addJest(), `jest`)
  }

  const hasTravis = dep.includes(ChoiceEnum.travis)
  if (hasTravis || all) {
    logFn(() => addTravis(), `jest`)
  }

  const hasClock = dep.includes(ChoiceEnum.clock)
  if (hasClock || all) {
    logFn(() => addClock(), `clock`)
  }

  if (list) {
    showList()
  }

  await installDeps()

  if (hasEslint || all) {
    setTimeout(() => {
      (async () => {
        const response = await prompts({
          type: 'text',
          name: 'meaning',
          message: '是否立即执行eslint(y/n)'
        });
        if (response.meaning === 'y' || response.meaning === 'Y') {
          exec('npm run eslint');
        }
      })();
    }, 1000);
  }
}

start()
