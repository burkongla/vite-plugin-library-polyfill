import { Plugin } from 'vite';
import babel, { NodePath } from '@babel/core';
import generate from '@babel/generator';
import createFilter from './filter';
import { polyfillUndeclaredVariable } from './polyfill';
import { TransformResult as TransformResult_2 } from 'rollup';

export type Options = {
  include?: string | string[] | undefined;
  exclude?: string | string[] | undefined;
  skipPreBuild?: boolean;
};

/**
 * babel.traverse
 */
const visitor = {
  enter(path: NodePath<babel.types.Node>) {
    /**
     * 填充未声明的变量对其进行声明
     */
    polyfillUndeclaredVariable(path);
  }
};

/**
 * polyfill some library can not use script module
 * 填充一些库无法正常编译成 script module 使用
 * @param options
 */
export function vitePluginLibraryPolyfill(
  options: Options = { skipPreBuild: false }
): Plugin {
  const filter = createFilter(options.include, options.exclude);
  return {
    name: 'vite-plugin-library-polyfill',
    enforce: 'pre',
    transform(code: string, id: string): Promise<TransformResult_2> | TransformResult_2 {
      if (
        !filter(id) ||
        (options.skipPreBuild && id.indexOf('/node_modules/.vite/') !== -1)
      ) {
        return null;
      }

      /**
       * 代码转换 => 解析成 ast => 遍历 ast 树 => 再建并生成处理后的代码
       */
      const result = babel.transform(code);
      if (!result || !result.code) {
        throw Error(`babel.transform error, result: ${result}`);
      }
      const ast = babel.parse(result.code);
      if (!ast) {
        throw Error(`ast error: ${ast}`);
      }
      babel.traverse(ast, visitor);
      const output = generate(ast);

      return {
        code: output.code,
        map: output.map
      }
    }
  };
}
