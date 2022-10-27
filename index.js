#!/usr/bin/env node

const { program } = require('commander');
const inq = require('inquirer');
const ora = require('ora');
const { promisify } = require('util')
const { resolve } = require('path')

// let processCreate = ora('正在创建项目...')

const cloneRepo = async function (repo, desc) {
    const download = promisify(require('download-git-repo')) // download-git-repo: Download and extract a git repository (GitHub, GitLab, Bitbucket)
    const ora = require('ora')
    const process = ora(`🚛 下载......`)
    process.start() // 进度条开始
    await download(repo, desc)
    process.succeed('✨ 下载完成')
}

const handleCreate = (params) => {
    inq
        .prompt([
            {
                type: 'list',
                name: 'type',
                message: '🌟 请选择项目类型',
                choices: ['主应用', '子应用']
            },
            {
                type: 'list',
                name: 'language',
                message: '✍️ 请选择项目语言',
                choices: ['Vue3.x', 'React', 'Angular'],
            },
            {
                type: 'confirm',
                name: 'isTypeScript',
                message: '🛠 是否使用TypeScript',
                default: true
            },
            {
                type: 'list',
                name: 'package',
                message: '📦 请选择包管理工具',
                choices: ['npm', 'yarn', 'pnpm'],
            },
            {
                type: 'confirm',
                name: 'isInstall',
                message: '🛒 是否安装依赖',
                default: true
            }
        ])
        .then(async (answers) => {
            // 合并参数
            const options = Object.assign(answers, params);

            /* download repo */
            if(options.type === '主应用') {
                await cloneRepo('Rich4st/qiankun-main-template', options.name)
            } else {
                await cloneRepo('Rich4st/qiankun-sub-template', options.name)
            }

            /* preinstall dependencies */
            if(options.isInstall) {
                const spawn = require('cross-spawn');
                spawn(options.package, ['install'], { stdio: 'inherit', cwd: resolve(process.cwd(), options.name) })
            }
        })
        .catch((err) => {
            console.log(err);
        }
        )


};

program
    .command('create <name>')
    .description('create a project')
    .action((name) => {
        handleCreate({ name });
    });

program.option('-ig,--initgit', 'init git');

program.parse(process.argv);
