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

  @property({ type: Boolean })
  condition = false;

  handleCondition = () => {
    this.condition = !this.condition;
  }
  
  render() {
    return (
      <div>
        {this.condition ? <p>Render some HTML if condition is true.</p> : <p>Render some other HTML if condition is false.</p>}
        <button onClick={this.handleCondition}>Toggle condition</button>
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