import {
  getFileKey,
} from './index';

const getTmplPath = () => {
  const hash = location.hash.replace(/^#\//, '') || 'hello-world';
  return `../views/${hash}/index.ts`;
};

const tmpls: Record<string, string> = import.meta.glob(`../views/**/index.ts`, {
  import: 'default',
  eager: true,
});

export const read = (key: string) => {
  return tmpls[getTmplPath()][getFileKey(key)];
};

export const write = (key: string, content: string) => {
  tmpls[getTmplPath()][getFileKey(key)] = content;
};
