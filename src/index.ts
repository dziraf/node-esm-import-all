import fs from 'fs'
import Module from 'module';

export const DEFAULT_EXCLUDE_DIR = /^\./
// eslint-disable-next-line no-useless-escape
export const DEFAULT_FILTER = /^([^\.].*)\.js(on)?$/
export const DEFAULT_RECURSIVE = true

export interface ImportAllOptions {
  dirname: string;
  excludeDirs?: RegExp;
  filter?: RegExp | ((val: string) => string);
  recursive?: boolean;
  resolve?: (val: string) => string;
  map?: (file: string, filePath?: string) => string;
}

export type ModuleTuple = [string, Module | ModuleTuple[]]

export const getModulesStructure = (modules: ModuleTuple[] = []) => modules.reduce((memo, current) => {
  const [path, value] = current

  memo[path] = !Array.isArray(value) ? value : getModulesStructure(value.filter(Boolean))

  return memo
}, {})

const defaultResolve = (val: string): string => val

export const importAll = async (options: ImportAllOptions) => {
  const { dirname } = options
  const excludeDirs = options.excludeDirs === undefined
    ? DEFAULT_EXCLUDE_DIR
    : options.excludeDirs
  const filter = options.filter === undefined ? DEFAULT_FILTER : options.filter
  const recursive = options.recursive === undefined ? DEFAULT_RECURSIVE : options.recursive
  const resolve = options.resolve || defaultResolve
  const map = options.map || defaultResolve

  const excludeDirectory = (dir: string) => !recursive || (excludeDirs && dir.match(excludeDirs))
  const filterFile = (filename: string) => {
    if (typeof filter === 'function') {
      return filter(filename)
    }

    const match = filename.match(filter)
    if (!match) return false

    return match?.input ?? match[1] ?? match[0]
  }

  const files = fs.readdirSync(dirname)

  const modules = await Promise.all(files.map(async (file) => {
    const filepath = `${dirname}/${file}`
    if (fs.statSync(filepath).isDirectory()) {
      if (excludeDirectory(file)) return false

      const subModules = await importAll({
        dirname: filepath,
        filter,
        excludeDirs,
        map,
        resolve,
      })

      if (Object.keys(subModules).length === 0) return false

      return [map(file, filepath), subModules]
    }
    const name = filterFile(file)
    if (!name) return false

    return [map(name, filepath), resolve(
      await import(filepath),
    )]
  }))

  return getModulesStructure(modules.filter(Boolean))
}

export default importAll
