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
    const process = ora(`下载......${repo}`)
    process.start() // 进度条开始
    await download(repo, desc)
    process.succeed()
}

const handleCreate = (params) => {
    inq
        .prompt([
            {
                type: 'list',
                name: 'type',
                message: '✨ 请选择项目类型',
                choices: ['主/基座应用', '子应用']
            },
            {
                type: 'list',
                name: 'language',
                message: '请选择项目语言',
                choices: ['Vue3.x', 'React', 'Angular'],
            },
            {
                type: 'confirm',
                name: 'isTypeScript',
                message: '是否使用TypeScript',
                default: true
            },
            {
                type: 'list',
                name: 'package',
                message: '请选择包管理工具',
                choices: ['npm', 'yarn', 'pnpm'],
            },
            {
                type: 'checkbox',
                name: 'features',
                message: '请选择项目预装依赖',
                choices: [
                    {
                        name: 'Pinia',
                        value: 'pinia',
                        checked: false
                    },
                    {
                        name: 'Vue Router',
                        value: 'router',
                        checked: false
                    },
                    {
                        name: 'CSS Pre-processors',
                        value: 'cssPreprocessors',
                        checked: false
                    },
                    {
                        name: 'Linter / Formatter',
                        value: 'linter',
                        checked: false
                    },
                    {
                        name: 'Unit Testing',
                        value: 'unitTesting',
                        checked: false
                    },
                    {
                        name: 'E2E Testing',
                        value: 'e2eTesting',
                        checked: false
                    }
                ]
            },
            {
                type: 'confirm',
                name: 'isGit',
                message: '是否初始化git仓库',
                default: true
            },
            {
                type: 'confirm',
                name: 'isInstall',
                message: '是否安装依赖',
                default: true
            }
        ])
        .then(async (answers) => {
            // 合并参数
            const options = Object.assign(answers, params);
            await cloneRepo('Rich4st/vite-demo#main', resolve(process.cwd(), options.name))
            if(options.isInstall) {
                const spawn = require('cross-spawn');
                // spawn(options.package, ['install'], { stdio: 'inherit', cwd: resolve(process.cwd(), options.name) })
                spawn(options.package, ['install', 'cross-spawn'], { stdio: 'inherit', cwd: resolve(process.cwd(), options.name) })
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
