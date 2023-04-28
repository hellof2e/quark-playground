import {ENTRY_JS, ENTRY_HTML, ENTRY_CSS} from '../../const'

const mem: Record<string, string> = {
  [ENTRY_JS]: `import {
  QuarkElement,
  property,
  customElement,
  Fragment,
} from 'quarkc';
import style from './index.css';

@customElement({
  tag: "my-element",
  style
})
class MyElement extends QuarkElement {

  onClick = () => {
    alert("click")
  }

  onInput = () => {
    alert("input")
  }
  
  render() {
    return (
      <Fragment>
        <button onClick={this.onClick}>Click</button>
        <br/>
        <input onInput={this.onInput}></input>
      </Fragment>
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