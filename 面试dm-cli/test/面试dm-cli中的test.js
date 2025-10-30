const configFile = require.resolve(
  `./config/jestConfig/${mode === 'native' ? 'index.native' : 'index'}`,
);
const args = [
  require.resolve('jest/bin/jest'),
  `--config=${configFile}`,
  `--setupFilesAfterEnv=${getProjectPath(setupFilesAfterEnv)}`,
];
updateSnapshot && args.push('-u');
coverage && args.push('--coverage');
onlyChanged && args.push('--onlyChanged');
execa('node', args, { stdio: 'inherit' }); // stdio: 'inherit' 表示将子进程的输出直接传递给父进程（即控制台输出）。

// execa 执行jest/bin/jest + 配置文件