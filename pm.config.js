module.exports = {
  apps: [{
    name: 'xysbtn-upload',
    script: './src/app.js',
    out_file: '/logs/out.log', // 日志输出
    error_file: '/logs/error.log', // 错误日志
    max_memory_restart: '1G', // 超过多大内存自动重启
    env: {
      NODE_ENV: 'production'
    },
    exec_mode: 'cluster', // 开启多线程模式，用于负载均衡
    instances: 'max', // 启用多少个实例，可用于负载均衡
    autorestart: true // 程序崩溃后自动重启
  }]
}
