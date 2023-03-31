export const ENTRY_JS = './index.tsx';
export const ENTRY_CSS = './index.css';

const mem: Record<string, string> = {
  [ENTRY_JS]: `
    import { QuarkElement, property, customElement } from 'quarkc';
    import styleSheetContent from './index.css';

    /*
      invoke render function to preview and test your custom element,
      or feel free to write your own render function,
      embeded render function's implementation shown as below:

      function render(
        customElemTag: string,
        root: HTMLElement = document.getElementById('app')
      ) {
        const elem = document.createElement(customElemTag);
        root.innerHTML = '';
        root.appendChild(elem);
      }
    */

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
            <div class="counter">Counter: {this.count}</div>
            <button onClick={this.increment}>Increment</button>
            <button onClick={this.decrement}>Decrement</button>
          </div>
        );
      }
    }

    render('quark-count');
  `,
  [ENTRY_CSS]: `.counter {
    color: #a8f;
  }`,
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
