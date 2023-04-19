import HelloWorld from '../views/hello-world';
import FullComponent from '../views/full-component';
import StateReactive from '../views/state-reactive';
import PropsReactive from '../views/props-reactive';
import SkillGuid from '../views/skill-guid';
import ExpressionTypes from '../views/expression-types';
import ConditionalTemplates from '../views/conditional-templates';
import RepeatingTemplates from '../views/repeating-templates';
import SlottingChildren from '../views/slotting-children';
import CssInJs from '../views/css-in-js';
import Fragment from '../views/fragment';
import NativeEvent from '../views/native-event';

const codeEnum = {
  'hello-world': HelloWorld,
  'full-component': FullComponent,
  'state-reactive': StateReactive,
  'props-reactive': PropsReactive,
  'skill-guid': SkillGuid,
  'expression-types': ExpressionTypes,
  'conditional-templates': ConditionalTemplates,
  'repeating-templates': RepeatingTemplates,
  'slotting-children': SlottingChildren,
  'css-in-js': CssInJs,
  'fragment': Fragment,
  'native-event': NativeEvent,
}
const getHashValue = () => {
    return window.location.href.split('/#/')[1] ?  window.location.href.split('/#/')[1] : 'hello-world';
}
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
    const entryKey = getFileKey(key);
    const hashValue = getHashValue();
    return codeEnum[hashValue][entryKey]
};
export const write = (key: string, content: string) => {
  const entryKey = getFileKey(key)
  const hashValue = getHashValue();
  codeEnum[hashValue][entryKey] = content
};

