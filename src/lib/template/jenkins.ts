export const jenkinsFile = `
// 自定义 钉钉插件 的 错误信息和成功信息
def successText = [
    """ ### 新的构建信息，请注意查收""",
    """ \${env.JOB_BASE_NAME}任务构建<font color=green>成功</font> ，点击查看[构建任务 #\${env.BUILD_NUMBER}](http://jenkins地址/job/\${env.JOB_BASE_NAME}/\${env.BUILD_NUMBER}/)"""
]
def failureText = [
    """ ### 新的构建信息，请注意查收""",
    """ \${env.JOB_BASE_NAME}任务构建<font color=red>失败</font> ，点击查看[构建任务 #\${env.BUILD_NUMBER}](http://jenkins地址/job/\${env.JOB_BASE_NAME}/\${env.BUILD_NUMBER}/)"""
]
def commitText = [
    """ ### 代码拉取成功""",
]
def buildText = [
    """ ### 代码打包成功""",
]
// 1，侦听 github push 事件
properties([pipelineTriggers([githubPush()])])

pipeline {
    agent any
    // 环境变量定义。
    environment {
        GIT_REPO = '仓库地址xxxx'
        GIT_REPO_BRANCH = '*/分支名'
        SSH_SERVICE = 'jenkins配置服务器地址'
    }
    stages {
        // 2，拉取 github 代码，通过 GitSCM 侦听 push 事件。
        stage('Pull code') {
            steps {
                checkout(
                    [
                        $class: 'GitSCM',
                        branches: [[name: env.GIT_REPO_BRANCH]],
                        doGenerateSubmoduleConfigurations: false,
                        extensions: [[
                            $class: 'SubmoduleOption',
                            disableSubmodules: false,
                            parentCredentials: true,
                            recursiveSubmodules: true,
                            reference: '',
                            trackingSubmodules: false
                        ]],
                        submoduleCfg: [],
                        userRemoteConfigs: [
                            [
                                credentialsId: 'chenmd_git_http_account',
                                url: env.GIT_REPO
                            ]
                        ],
                        changelog: true,
                        poll: true,
                    ]
                )
            }
        }
        stage('Commit Log') {
          steps {
            dingtalk (
                robot: '钉钉机器人',
                type: 'ACTION_CARD',
                title: 'Jenkins构建提醒',
                text: commitText,
                at: []
            )
          }  
        }
        stage('Install and build') {
            steps {
                nodejs('NodeJS14.17.5') {
                    sh 'node -v'
                    sh 'npm -v'
                    sh 'npm install yarn -g'
                    sh 'yarn config list'
                    sh 'yarn install'
                    sh 'yarn build'
                }
                dingtalk (
                robot: '钉钉机器人配置',
                type: 'ACTION_CARD',
                title: 'Jenkins构建提醒',
                text: buildText,
                at: []
                )
            }
        }
        stage('Pack') {
            steps { 
                    sh 'tar -zcvf dist.tar -C ./dist/web .'
            }
        }
        stage('Deploy') {
            steps {
                sshPublisher(
                    publishers: [
                        sshPublisherDesc(
                            configName: env.SSH_SERVICE,
                            transfers: [
                                sshTransfer(
                                    cleanRemote: false,
                                    excludes: '',
                                    execCommand: '''
                                       rm -rf /usr/local/nginx/html/web/*
                                       cd /root/usr/local/nginx
                                       tar -xvf dist.tar -C /usr/local/nginx/html/web
                                    ''',
                                    execTimeout: 120000,
                                    flatten: false,
                                    makeEmptyDirs: false,
                                    noDefaultExcludes: false,
                                    patternSeparator: '[, ]+',
                                    remoteDirectory: '/usr/local/nginx',
                                    remoteDirectorySDF: false,
                                    removePrefix: '',
                                    sourceFiles: 'dist.tar'
                                )
                            ],
                            usePromotionTimestamp: false,
                            useWorkspaceInPromotion: false,
                            verbose: false
                        )
                    ]
                )
            }
        }
    }
    post {
        success {
            // 5，DingTalk 插件的使用。
            dingtalk (
                robot: '钉钉机器人',
                type: 'ACTION_CARD',
                title: 'Jenkins构建提醒',
                text: successText,
                btns: [
                    [
                        title: '控制台',
                        actionUrl: 'http://jenkins的服务器地址/job/Web_DevDeployTask/'
                    ],
                    [
                        title: '项目预览',
                        actionUrl: 'http://项目的git地址'
                    ],
                ],
                at: []
            )
        }
        failure {
            dingtalk(
                robot: '钉钉机器人',
                type: 'ACTION_CARD',
                title: 'Jenkins构建提醒',
                text: failureText,
                btns: [
                    [
                        title: '控制台',
                        actionUrl: 'http://jenkins的服务器地址/job/Web_DevDeployTask/'
                    ],
                    [
                        title: '提交预览',
                        actionUrl: 'http://项目的git地址'
                    ],
                ],
                at: []
            )
        }
    }
}
`