import * as monaco from 'monaco-editor';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import {
  read,
  write,
} from './fs';

self.MonacoEnvironment = {
	getWorker: function (_, label) {
		switch (label) {
			case 'typescript':
			case 'javascript':
				return new tsWorker();
      case 'css':
      case 'scss':
      case 'less':
        return new cssWorker();
      case 'html':
      case 'handlebars':
      case 'razor':
        return new htmlWorker();
			default:
				return new editorWorker();
		}
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
  const editor = monaco.editor.create(container, {
    theme: 'vs-dark',
    automaticLayout: true,
    language,
    value: read(fileName),
  });
  editor.onDidChangeModelContent((event) => {
    let modifiedText = read(fileName);

    for (const change of event.changes) {
      const {
        rangeOffset,
        rangeLength,
        text,
      } = change;
      modifiedText = modifiedText.slice(0, rangeOffset)
        + text
        + modifiedText.slice(rangeOffset + rangeLength);
    }
    
    write(fileName, modifiedText);
    onChange(modifiedText);
  });
  return editor;
};
