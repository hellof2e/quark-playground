export const ENTRY_JS = './index.jsx';
export const ENTRY_CSS = './index.css';
export const ENTRY_HTML = './index.html';

const mem: Record<string, string> = {
  [ENTRY_JS]: `import {
  QuarkElement,
  property,
  customElement,
} from 'quarkc';
import styleSheetContent from './index.css';
// feel free to import native esmodules, served on websites like unpkg.com or esm.sh
// for example, uncomment following lines to toggle confetti effect:
// import confetti from "https://esm.sh/canvas-confetti@1.6.0";
// confetti();

@customElement({
  tag: "quark-count",
  style: styleSheetContent,
})
class MyElement extends QuarkElement {
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
  margin-bottom: 8px;
  color: #333;
}

.count-btn {
  border-radius: 8px;
  border: 1px dashed transparent;
  padding: 8px 16px;
  font-size: 16px;
  font-weight: bold;
  font-family: inherit;
  cursor: pointer;
  transition: border-color 0.25s;  
}

.count-btn--inc {
  color: #fff;
  background-color: #a8f;
}

.count-btn--dec {
  margin-left: 4px;
  color: #fff;
  background-color: #8af;
}

.count-btn:hover {
  filter: saturate(2);
}

.count-btn:focus, .count-btn:focus-visible {
  border-color: inherit;
}
`,
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

/** remove query and hash */
export const cleanPath = (path: string): string => path
  .replace(/#.*$/s, '')
  .replace(/\?.*$/s, '');

/** read file content from memory */
export const read = (path: string) => mem[getFileKey(path)];
/** write content to file in memory */
export const write = (path: string, content: string) => {
  mem[getFileKey(path)] = content;
};
