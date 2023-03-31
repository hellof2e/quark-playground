export const ENTRY_JS = './index.jsx';
export const ENTRY_CSS = './index.css';
export const ENTRY_HTML = './index.html';

const mem: Record<string, string> = {
  [ENTRY_JS]: `// feel free to import other modules from their esmodule bundle,
// served on websites like unpkg.com or esm.sh,
// for example: import confetti from "https://esm.sh/canvas-confetti@1.6.0"
import { QuarkElement, property, customElement } from 'quarkc';
import styleSheetContent from './index.css';

@customElement({
  tag: "quark-count",
  style: styleSheetContent,
})
export class MyElement extends QuarkElement {
  @property({
    type: Number
  })
  count = 0;

  increment = () => {
    this.count += 1;
  }

  decrement = () => {
    this.count -= 1;
  }
  
  render() {
    return (
      <div>
        <div class="count">count is: {this.count}</div>
        <button class="count-btn count-btn--inc" onClick={this.increment}>Increment</button>
        <button class="count-btn count-btn--dec" onClick={this.decrement}>Decrement</button>
      </div>
    );
  }
}
  `,
  [ENTRY_CSS]: `.count {
    color: #a8f;
  }`,
  [ENTRY_HTML]: `<quark-count count="0"></quark-count>`
};

/** remove leading ./ */
export const stripPath = (path: string) => path.replace(/^[\.\\\/]*/, '');
/** ensure path starts with ./ and used as memory file key */
const getFileKey = (path: string) => {
  if (/^\.\//.test(path)) {
    return path;
  }

  return `./${stripPath(path)}`;
};
/** get valid file id —— used for html element id */
export const getFileId = (path: string) => (
  stripPath(path)
    .replace(/^[^a-zA-Z]/, '')
    .replace(/[^\w-:.]/g, '_')
);

/** read file content from memory */
export const read = (path: string) => mem[getFileKey(path)];
/** write content to file in memory */
export const write = (path: string, content: string) => {
  mem[getFileKey(path)] = content;
};
