#!/usr/bin/env node

import importLocal from "import-local";
import entry from '../lib/index.js';
import { log } from '@my.imooc.com/utils';
import { filename } from 'dirname-filename-esm';

const __filename = filename(import.meta);
if (importLocal(__filename)) {
  log.info('cli', '使用本次 cli-imooc 版本');
} else {
  entry(process.argv.slice(2));
}

