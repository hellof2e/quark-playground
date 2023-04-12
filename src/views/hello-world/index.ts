import {ENTRY_JS, ENTRY_HTML, ENTRY_CSS} from '../../const'

const mem: Record<string, string> = {
  [ENTRY_JS]: `import {
  QuarkElement,
  property,
  customElement,
} from 'quarkc';
import style from './index.css';

@customElement({
  tag: "quark-greeting",
  style,
})
class QuarkGreeting extends QuarkElement {
  @property()
  name = 'World';

  render() {
    return (
      <p> Hello {this.name} </p>
    );
  }
}
`,
  [ENTRY_CSS]: `p {
  color: #0088ff
}
`,
  [ENTRY_HTML]: `<quark-greeting></quark-greeting>`
};

export default mem;