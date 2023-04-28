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
  disabletick = false;

  componentDidMount() {
    if (!this.disabletick) {
      this.interval = setInterval(() => this.tick(), 1000)
    }
  }

  shouldComponentUpdate(
    propName: string,
    oldValue: string | boolean,
    newValue: string | boolean
  ): boolean {
    if (propName === "xxx") {
      // 阻止更新
      return false
    }
    return true;
  }

  componentDidUpdate(propName: string, oldValue: string, newValue: string) {
    // 已更新
  }

  componentWillUnmount() {
    // 清除副作用
    if (this.interval) {
      clearInterval(this.interval)
    }
  }

  tick() {
    this.count++
  }

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
`,
  [ENTRY_HTML]: `<!DOCTYPE html>
<html lang="en">
  <head>
    <script type="module" src="./index.js"></script>
  </head>
  <body>
    <my-element count="0"></my-element>
    <br/>
    <my-element count="1" disabletick></my-element>
  </body>
</html>
  `
};

export default mem;