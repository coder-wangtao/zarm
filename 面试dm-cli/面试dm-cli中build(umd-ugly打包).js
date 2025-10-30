// umd-ugly在umd基础上压缩代码，减小体积

mode: 'production', // 设置为生产模式
output: {
    filename: '[name].min.js', // 输出的文件名使用 `.min.js`，以示已压缩
},  

new MiniCssExtractPlugin({
    filename: '[name].min.css', // 追加插件，提取 CSS 并压缩成 `.min.css`
}),

其他配置与umd打包相同