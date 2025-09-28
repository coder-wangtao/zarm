import execa from 'execa'; // execa 类似于child_process
import { getProjectPath } from './utils';

export interface ITestConfig {
  mode: 'native';
  updateSnapshot: boolean;
  coverage: boolean;
  setupFilesAfterEnv: string;
  onlyChanged: boolean;
}

export default ({
  mode,
  updateSnapshot,
  coverage,
  setupFilesAfterEnv,
  onlyChanged,
}: Partial<ITestConfig>) => {
  // 如果 mode 是 'native'，则使用 index.native 配置文件, 否则，使用 index 配置文件。
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
};
