import {ENTRY_JS, ENTRY_HTML, ENTRY_CSS} from '../../const'

const mem: Record<string, string> = {
  [ENTRY_JS]: `import {
  QuarkElement,
  property,
  customElement,
} from 'quarkc';
import styleSheetContent from './index.css';

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

export default mem;