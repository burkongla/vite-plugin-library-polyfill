# vite-plugin-library-polyfill

该库参考 [vite-plugin-commonjs](#https://github.com/originjs/vite-plugins/tree/main/packages/vite-plugin-commonjs)

对一些未正确编码的库进行 polyfill，如下：

* [x] [lamejs](#https://github.com/zhuker/lamejs)
* [ ] [emoji-picker-react](#https://github.com/ealush/emoji-picker-react)

## 安装

```shell
$ npm install vite-plugin-library-polyfill --save-dev
```

or 

```shell
$ yarn add vite-plugin-library-polyfill -D
```

## 如何使用

```ts
import { vitePluginLibraryPolyfilllugin } from 'vite-plugin-library-polyfill';

// vite.config.ts/vite.config.js
export default {
  plugins: [
    vitePluginLibraryPolyfill({include: ['lamejs']})
  ]
}
```

