import fs from 'fs';
import path from 'path';
import { Configuration } from 'webpack';

export interface FileInfo {
  filePath?: string;
  type?: string;
}

// 这段代码是一个递归的 fileTree 函数，用来遍历指定目录及其子目录中的所有文件，并将文件的路径和类型信息存储在 list 数组中。
const fileTree = (list: FileInfo[], dirPath: string) => {
  const files = fs.readdirSync(dirPath);
  for (let i = 0; i < files.length; i++) {
    const filePath = path.join(dirPath, files[i]);
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      fileTree(list, filePath);
    } else {
      const type = path.extname(files[i]).substring(1);
      list.push({ filePath, type });
    }
  }
};

// 获取项目文件
// 作用是根据当前工作目录生成一个绝对路径
// process.cwd():它返回 当前工作目录（Current Working Directory），也就是你 在终端中运行 Node.js 脚本时所在的目录。
const getProjectPath = (dir = './'): string => {
  // path.join('/Users/alice/project', 'src')  => '/Users/alice/project/src'
  return path.join(process.cwd(), dir);
};

export interface CustomConfig extends Configuration {
  entries: object;
  banner: string;
  setBabelOptions: (options: string | { [index: string]: any }) => void;
  setRules: (rules: Configuration['module']['rules']) => void;
  setPlugins: (plugins: Configuration['plugins']) => void;
}

// 获取项目文件
const getCustomConfig = (configFileName = 'zarm.config.js'): Partial<CustomConfig> => {
  const configPath = path.join(process.cwd(), configFileName);

  if (fs.existsSync(configPath)) {
    // eslint-disable-next-line import/no-dynamic-require
    return require(configPath);
  }
  return {};
};

export { fileTree, getProjectPath, getCustomConfig };
