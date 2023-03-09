# node-esm-import-all

An easy way to import all files within a directory.

This library is based on [require.all](https://github.com/felixge/node-require-all) but supports ESM projects.

### Note

I am currently only using this library to automatically import all test files for Mocha in it's entry file. If you
have other use cases where conversion from `require.all` doesn't work as expected or if you'd found other bugs,
feel free to open an issue.

## Usage

```js
import path from 'path'
import * as url from 'url'
import { importAll } from 'node-esm-import-all'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

const testFiles = await importAll({
  dirname: path.join(__dirname, '/../src'),
  filter: /spec\.(js|ts|tsx)$/i,
  recursive: true,
})
```

## Configuration Object

### **dirname** *[required]*
Directory to import files from.

Example: `path.join(__dirname, '/../src')`

### **filter** *[optional]*
A RegExp to match specific file names or a function which takes the filename as it's argument and returns a new filename or `false` to ignore the file.

Example 1: `/spec\.(js|ts|tsx)$/i`

Example 2:
```js
const filter = (filename: string) => {
  if (!filename.endsWith('.spec.ts')) return false;

  return filename;
}
```

### **excludeDirs** *[optional]*
A RegExp to match specific file names that should be ignored.

Example: `/spec\.(js|ts|tsx)$/i`

## **recursive** *[optional]*
Recursive mode. `true`/`false`
