import HelloWorld from '../views/hello-world';

const codeEnum = {
  'hello-world': HelloWorld
}
const hashValue = window.location.href.split('/#/')[1] ?  window.location.href.split('/#/')[1] : 'hello-world'

export const stripPath = (path: string) => path.replace(/^[\.\\\/]*/, '');
const getFileKey = (path: string) => {
  if (/^\.\//.test(path)) {
    return path;
  }

  return `./${stripPath(path)}`;
};
export const getFileId = (path: string) => (
  stripPath(path)
    .replace(/^[^a-zA-Z]/, '')
    .replace(/[^\w-:.]/g, '_')
);

export const cleanPath = (path: string): string => path
  .replace(/#.*$/s, '')
  .replace(/\?.*$/s, '');

export const read = (key: string) => {
    const entryKey = getFileKey(key)
    return codeEnum[hashValue][entryKey]
};
export const write = (key: string, content: string) => {
  const entryKey = getFileKey(key)
  codeEnum[hashValue][entryKey] = content
};

