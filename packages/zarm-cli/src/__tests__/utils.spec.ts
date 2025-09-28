import fs from 'fs';
import path from 'path';
import { mocked } from 'ts-jest/utils'; // ts-jest/utils 的 mocked 可以让 TS 对 Mock 有类型感知。
import { FileInfo, fileTree, getCustomConfig } from '../utils';

// 当你在 package.json 中配置 test 脚本为 jest，或者用 ts-jest 运行测试时，Jest 会把以下全局函数注入到测试文件中
// 因此，在测试文件里不需要导入 jest，可以直接使用。
jest.mock('fs'); // 使用 jest.mock('fs') 对 Node 的文件系统模块进行 Mock。

// 将 fs.readdirSync 函数进行模拟，通常这个函数是用来读取指定目录下的文件列表。模拟后的 readdirSyncMocked 会返回你定义的模拟数据，而不是访问实际的文件系统。
const readdirSyncMocked = mocked(fs.readdirSync);
// 将 fs.statSync 函数进行模拟，通常用来获取文件或目录的状态信息（如大小、创建时间等）。模拟后的 statSyncMocked 会返回你定义的假数据，用于测试。
const statSyncMocked = mocked(fs.statSync);
// 将 fs.existsSync 函数进行模拟，用于检查文件或目录是否存在。模拟后的 existsSyncMocked 会根据你设置的模拟数据返回 true 或 false。

const existsSyncMocked = mocked(fs.existsSync);

describe('utils', () => {
  let testDirPath: string;
  beforeAll(() => {
    // beforeAll //在所有测试用例执行之前执行。这里它设置了 testDirPath 为 /virtual，模拟一个虚拟目录路径。
    testDirPath = '/virtual';
  });
  afterAll(() => {
    // afterAll：在所有测试用例执行完毕后执行。这里使用 jest.resetAllMocks() 重置所有的 mock 配置，确保测试之间不会有干扰。
    jest.resetAllMocks();
  });

  afterEach(() => {
    // 每个测试用例执行完毕后，都会清理 mock 函数：
    // jest.clearAllMocks() 清除 mock 调用的记录，
    // jest.restoreAllMocks() 恢复所有的 mock 函数为它们的原始实现。

    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('#fileTree', () => {
    // 这个测试的目的是验证 fileTree 函数是否能够正确地列出目录下的文件，并为它们生成文件路径。
    it('should get file path tree', () => {
      // 模拟 fs.readdirSync 返回 /a.ts 和 /b.ts，表示这个目录下有两个文件。
      readdirSyncMocked.mockReturnValueOnce(['/a.ts', '/b.ts'] as unknown as fs.Dirent[]);

      // 这行代码是用 Jest 模拟一个 fs.Stats 对象，并在其中模拟 isDirectory 方法，以便在测试中使用。
      // 测试某个函数时，你可能只关心文件是否是目录，而不想真实读取文件或目录的状态。通过这种方式，可以直接模拟返回 false（表示该路径是文件而非目录）。
      const stats = { isDirectory: jest.fn().mockReturnValue(false) } as unknown as fs.Stats;

      statSyncMocked.mockReturnValue(stats); // 模拟 fs.statSync 的返回值，表示文件不是目录
      const list: FileInfo[] = [];

      fileTree(list, testDirPath);

      expect(list).toEqual([
        { filePath: path.join(testDirPath, '/a.ts'), type: 'ts' },
        { filePath: path.join(testDirPath, '/b.ts'), type: 'ts' },
      ]);

      // 验证 readdirSyncMocked,该函数调用时传入的参数是 testDirPath
      expect(readdirSyncMocked).toBeCalledWith(testDirPath);
      // 验证 readdirSyncMocked 被调用的次数是否为 1。
      expect(readdirSyncMocked).toBeCalledTimes(1);
      // 验证 statSyncMocked（即模拟的 fs.statSync）被调用的次数是否为 2。
      expect(statSyncMocked).toBeCalledTimes(2);
      // 验证 stats.isDirectory（fs.Stats 的一个方法）被调用的次数是否为 2。
      expect(stats.isDirectory).toBeCalledTimes(2);
    });
    // recursively:递归地
    it('should get file path recursively ', () => {
      // 当读取 testDirPath 时，返回 ['/a', '/b.ts']，表示根目录下有一个文件夹 a 和一个文件 b.ts。
      // 当读取 testDirPath/a 时，返回 ['/x.ts', '/y.ts']，表示 a 文件夹下有两个 .ts 文件。
      // testDirPath/
      // ├─ a/
      // │  ├─ x.ts
      // │  └─ y.ts
      // └─ b.ts
      readdirSyncMocked.mockImplementation((dirPath: string): any => {
        if (dirPath === path.join(testDirPath, '/a')) {
          return ['/x.ts', '/y.ts'];
        }
        return ['/a', '/b.ts'];
      });
      // statsA 用来模拟目录 /a，isDirectory() 返回 true。
      // statsB 模拟所有其他路径都是文件，isDirectory() 返回 false。
      const statsA = { isDirectory: jest.fn().mockReturnValue(true) } as unknown as fs.Stats;
      const statsB = { isDirectory: jest.fn().mockReturnValue(false) } as unknown as fs.Stats;
      statSyncMocked.mockImplementation((filePath: string) => {
        switch (filePath) {
          case path.join(testDirPath, '/a'):
            return statsA;
          default:
            return statsB;
        }
      });
      const list: FileInfo[] = [];
      fileTree(list, testDirPath);

      // 验证 readdirSyncMocked,该函数调用时传入的参数是 testDirPath
      expect(readdirSyncMocked).toBeCalledWith(testDirPath);
      // 验证 readdirSyncMocked,该函数调用时传入的参数是 testDirPath/a
      expect(readdirSyncMocked).toBeCalledWith(path.join(testDirPath, '/a'));
      expect(readdirSyncMocked).toBeCalledTimes(2);
      expect(statSyncMocked).toBeCalledTimes(4);
      expect(statsA.isDirectory).toBeCalledTimes(1);
      expect(statsB.isDirectory).toBeCalledTimes(3);
      expect(list).toEqual([
        { filePath: path.join(testDirPath, '/a', '/x.ts'), type: 'ts' },
        { filePath: path.join(testDirPath, '/a', '/y.ts'), type: 'ts' },
        { filePath: path.join(testDirPath, '/b.ts'), type: 'ts' },
      ]);
    });
  });

  // 验证当配置文件存在时，getCustomConfig 能正确加载并返回里面的内容。
  describe('#getCustomConfig', () => {
    it('should get default zarm config file', () => {
      // 用 jest.spyOn(process, 'cwd') 把 process.cwd() 的返回值改成 testDirPath，这样函数运行时总是认为自己在测试目录下。
      const cwdSpy = jest.spyOn(process, 'cwd').mockReturnValueOnce(testDirPath);
      // 把 existsSync（检查文件是否存在的函数）模拟成返回 true，表示 zarm.config.js 文件存在。
      existsSyncMocked.mockReturnValueOnce(true);
      const configPath = path.join(testDirPath, 'zarm.config.js');

      jest.doMock(
        configPath,
        () => {
          return { banner: 'zarm' };
        },
        { virtual: true }, // 模拟
      );
      const actual = getCustomConfig();
      expect(actual).toEqual({ banner: 'zarm' });
      expect(cwdSpy).toBeCalledTimes(1);
      expect(existsSyncMocked).toBeCalledWith(path.join(testDirPath, 'zarm.config.js'));
    });

    it('should return empty object if config file does not exist', () => {
      const cwdSpy = jest.spyOn(process, 'cwd').mockReturnValueOnce(testDirPath);
      existsSyncMocked.mockReturnValueOnce(false);
      const actual = getCustomConfig('non-exists.config.js');
      expect(actual).toEqual({});
      expect(cwdSpy).toBeCalledTimes(1);
      expect(existsSyncMocked).toBeCalledWith(path.join(testDirPath, 'non-exists.config.js'));
    });
  });
});
