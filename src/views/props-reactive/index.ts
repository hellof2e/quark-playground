import {ENTRY_JS, ENTRY_HTML, ENTRY_CSS} from '../../const'

const mem: Record<string, string> = {
  [ENTRY_JS]: `import {
  QuarkElement,
  property,
  customElement,
} from 'quarkc';
import style from './index.css';

@customElement({
  tag: "my-element",
  style
})
class MyElement extends QuarkElement {
  @property({
    type: Number
  })
  count = 0;

  @property({
    type: Boolean
  })
  disable = false;

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
  [ENTRY_CSS]: `:host .count {
  margin-bottom: 8px;
  color: #333;
}

:host .count-btn {
  border-radius: 8px;
  border: 1px dashed transparent;
  padding: 8px 16px;
  font-size: 16px;
  font-weight: bold;
  font-family: inherit;
  cursor: pointer;
  transition: border-color 0.25s;  
}

:host .count-btn--inc {
  color: #fff;
  background-color: #a8f;
}

:host .count-btn--dec {
  margin-left: 4px;
  color: #fff;
  background-color: #8af;
}

:host .count-btn:hover {
  filter: saturate(2);
}

:host .count-btn:focus, .count-btn:focus-visible {
  border-color: inherit;
}
:host([disable]) .count-btn{
    cursor: not-allowed;
    opacity: 0.68;
    user-select: none;
    color: #BCC4CC;
}
`,
  [ENTRY_HTML]: `
  <my-element count="0"></my-element>
  <br/>
  <my-element count="1" disable></my-element>
  `
};

export default mem;