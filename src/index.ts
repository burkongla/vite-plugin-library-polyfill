import { Plugin } from 'vite';
import { TransformResult as TransformResult_2 } from 'rollup';
import { transformUndeclaredVariables } from './lib';

export type Options = {
  include: string[];
};

/**
 * polyfill some library can not use script module
 * 填充一些库无法正常编译成 script module 使用
 * @param options
 */
export function vitePluginLibraryPolyfill(
  options: Options
): Plugin {
  return {
    name: 'vite-plugin-library-polyfill',
    enforce: 'pre',
    transform(code: string, id: string): Promise<TransformResult_2> | TransformResult_2 {
      if (options.include.some(library => id.includes(library))) {
        const output = transformUndeclaredVariables(code);
        return {
          code: output.code,
          map: output.map
        };
      }
    }
  };
}
