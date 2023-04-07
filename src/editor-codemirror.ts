import {
  basicSetup,
} from 'codemirror';
import {
  EditorView,
  keymap,
} from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
import { oneDark } from '@codemirror/theme-one-dark';
import { javascript } from '@codemirror/lang-javascript';
import { css } from '@codemirror/lang-css';
import { html } from '@codemirror/lang-html';
import {
  read,
  write,
} from './fs';

const getLangExt = (language: string) => {
  switch (language) {
    case 'javascript':
      return javascript({
        jsx: true,
        typescript: true,
      });
    case 'css':
      return css();
    case 'html':
      return html();
    default:
      return null;
  }
};

export default function createEditor({
  fileName,
  language,
  container,
  onChange,
}: {
  fileName: string,
  language: string,
  container: HTMLElement,
  onChange: (text: string) => void,
}) {
  const exts = [
    basicSetup,
    keymap.of([indentWithTab]),
    oneDark,
    EditorView.theme({
      '&': {
        height: '100%',
        '&.cm-focused': {
          outline: 'none',
        },
      },
    }),
  ];
  const langExt = getLangExt(language);

  if (langExt) {
    exts.push(langExt);
  }
  
  const editor = new EditorView({
    doc: read(fileName),
    extensions: [
      ...exts,
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          const modifiedText = update.state.doc.toString();
          write(fileName, modifiedText);
          onChange(modifiedText);
        }
      })
    ],
    parent: container,
  });
  return editor;
};
