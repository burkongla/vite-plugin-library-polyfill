import { Plugin } from 'vite';
import createFilter from './filter';
import { TransformResult as TransformResult_2 } from 'rollup';
import { transformUndeclaredVariables } from './lib';

export type Options = {
  include?: string | string[] | undefined;
  exclude?: string | string[] | undefined;
  skipPreBuild?: boolean;
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
      const output = transformUndeclaredVariables(code);
      return {
        code: output.code,
        map: output.map
      };
    }
  };
}
