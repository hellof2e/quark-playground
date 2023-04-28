export const stripPath = (path: string) => path.replace(/^[\.\\\/]*/, '');

export const getFileKey = (path: string) => {
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
