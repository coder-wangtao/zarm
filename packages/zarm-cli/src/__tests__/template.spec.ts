import chalk from 'chalk';
import fs from 'fs';
import { sync } from 'mkdirp';
import signale from 'signale'; // 用于控制台日志输出
import { mocked } from 'ts-jest/utils';
import createTemplate from '../template';

jest.mock('mkdirp'); // mkdirp 被模拟，避免实际创建文件夹。
// chalk.green 被模拟，用于测试控制台输出时的绿色文本功能。
jest.mock('chalk', () => {
  return { green: jest.fn() };
});

const syncMocked = mocked(sync); // mock mkdirp.sync 方法
const chalkGreenMocked = mocked(chalk.green); // mock chalk.green 方法

describe('template', () => {
  afterAll(() => {
    // afterAll：在所有测试用例执行完毕后执行。
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });
  afterEach(() => {
    // 每个测试用例执行完毕后，都会清理 mock 函数：
    jest.clearAllMocks();
  });
  describe('#createTemplate', () => {
    it('should create react component code snippet', () => {
      chalkGreenMocked.mockImplementation((str: any) => str); // mock chalk.green 只返回传入的字符串
      const openSyncMocked = jest.spyOn(fs, 'openSync').mockReturnValue(1);
      const writeSyncMocked = jest.spyOn(fs, 'writeSync').mockReturnValue(1);
      const infoStub = jest.spyOn(console, 'info').mockReturnValue();
      const signaleSuccessStub = jest.spyOn(signale, 'success').mockReturnValue(1);
      createTemplate({ compName: 'primary button' });

      expect(syncMocked).toBeCalledWith('src/primary-button');
      expect(syncMocked).toBeCalledWith('src/primary-button/style');
      expect(syncMocked).toBeCalledWith('src/primary-button/__tests__');
      expect(infoStub).toBeCalledWith(expect.stringMatching('create src/primary-button/index.ts'));
      expect(infoStub).toBeCalledWith(expect.stringMatching('create src/primary-button/demo.md'));
      expect(infoStub).toBeCalledWith(
        expect.stringMatching('create src/primary-button/interface.ts'),
      );
      expect(infoStub).toBeCalledWith(
        expect.stringMatching('create src/primary-button/primary button.tsx'),
      );
      expect(infoStub).toBeCalledWith(
        expect.stringMatching('create src/primary-button/style/index.ts'),
      );
      expect(infoStub).toBeCalledWith(
        expect.stringMatching('create src/primary-button/style/index.scss'),
      );
      // 这行代码验证了 console.info 是否被调用，并且在调用时，日志中是否包含了 'create src/primary-button/index.ts' 字符串。

      expect(infoStub).toBeCalledWith(
        expect.stringMatching('create src/primary-button/__tests__/index.test.tsx'),
      );
      expect(infoStub).toBeCalledTimes(7);
      expect(openSyncMocked).toBeCalledTimes(7);
      expect(writeSyncMocked).toBeCalledTimes(7);
      expect(signaleSuccessStub).toBeCalledWith('create component templates successfully!!');
    });
  });
});
