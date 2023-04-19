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

  list = [{key: 1, value: 1}, {key: 2, value: 2},{key: 3, value: 3}]
  
  render() {
    return (
        <div>
            <p>Render a list:</p>
            <ul>
                {
                    this.list.map((item) => {
                        return <li key={item.key}>{item.value}</li>
                    })
                }
            </ul>
      </div>
    );
  }
}
`,
  [ENTRY_CSS]: ``,
  [ENTRY_HTML]: `<my-element></my-element>`
};

export default mem;