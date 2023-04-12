import {ENTRY_JS, ENTRY_HTML, ENTRY_CSS} from '../../const'

const mem: Record<string, string> = {
  [ENTRY_JS]: `import {
  QuarkElement,
  property,
  customElement,
} from 'quarkc';
import style from './index.css';

@customElement({
  tag: "quark-count",
  style
})
class QuarkCount extends QuarkElement {
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
  [ENTRY_HTML]: `
  <quark-count count="0"></quark-count>
  <br/>
  <quark-count count="1" disabletick></quark-count>
  `
};

export default mem;