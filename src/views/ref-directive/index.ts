import {ENTRY_JS, ENTRY_HTML, ENTRY_CSS} from '../../const'

const mem: Record<string, string> = {
  [ENTRY_JS]: `import {
  QuarkElement,
  property,
  customElement,
  createRef
} from 'quarkc';
import style from './index.css';

@customElement({
  tag: "my-element",
  style
})
class MyElement extends QuarkElement {

  inputRef: any = createRef();

  componentDidMount() {
    this.firstUpdated();
  }

  firstUpdated() {
    this.inputRef.current?.focus();
  }

  render() {
    return (
      <div>
        <input ref={this.inputRef}></input>
      </div>
    );
  }
}
`,
  [ENTRY_CSS]: ``,
  [ENTRY_HTML]: `
<!DOCTYPE html>
<html lang="en">
  <head>
    <script type="module" src="./index.js"></script>
  </head>
  <body>
    <my-element></my-element>
  </body>
</html>
`
};

export default mem;