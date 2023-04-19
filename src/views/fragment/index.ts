import {ENTRY_JS, ENTRY_HTML, ENTRY_CSS} from '../../const'

const mem: Record<string, string> = {
  [ENTRY_JS]: `import {
  QuarkElement,
  property,
  customElement,
  Fragment
} from 'quarkc';
import style from './index.css';

@customElement({
  tag: "my-element",
  style
})
class MyElement extends QuarkElement {

  render() {
    return (
      <Fragment>
        <div> First Child </div>
        <div> Second Child </div>
      </Fragment>
    );
  }
}
`,
  [ENTRY_CSS]: ``,
  [ENTRY_HTML]: `<my-element></my-element>`
};

export default mem;