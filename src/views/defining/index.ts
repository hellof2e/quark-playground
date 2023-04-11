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

  render() {
    return (
      <div>
        <div class="count">count is: {this.count}</div>
      </div>
    );
  }
}
`,
  [ENTRY_CSS]: `.count {
  margin-bottom: 8px;
  color: red;
}

`,
  [ENTRY_HTML]: `<quark-count count="2"></quark-count>`
};

export default mem;