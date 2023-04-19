import {ENTRY_JS, ENTRY_HTML, ENTRY_CSS} from '../../const'

const mem: Record<string, string> = {
  [ENTRY_JS]: `import {
  QuarkElement,
  state,
  customElement,
} from 'quarkc';
import style from './index.css';

@customElement({
  tag: "my-element",
  style
})
class MyElement extends QuarkElement {
  @state({
    type: Number
  })
  count = 0;
  increment = () => {
    this.count += 1;
    this.emitEvent();
  }

  decrement = () => {
    this.count -= 1;
    this.emitEvent();
  }

  emitEvent = () => {
    this.$emit("change", {
        detail: {
          value: this.count
        }
    })
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
  [ENTRY_HTML]: `
<my-element id="my-element"></my-element>
<script>
    const el = document.getElementById("my-element");
    el.addEventListener('change', (evt) => {
        alert(evt.detail.value);
    })
</script>
`
};

export default mem;