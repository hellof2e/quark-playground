import {ENTRY_JS, ENTRY_HTML, ENTRY_CSS} from '../../const'

const mem: Record<string, string> = {
  [ENTRY_JS]: `import {
  QuarkElement,
  state,
  customElement,
} from 'quarkc';
import style from './index.css';

@customElement({
  tag: "quark-list",
  style
})
class QuarkList extends QuarkElement {
  @state()
  columns: string[] = [];

  setColumns = (columns: string[]) => {
    this.columns = columns;
  }
  
  render() {
    return (
      <div class='container'>
        {this.columns.map((column) => {
            return <p> {column} </p>
        })}
      </div>
    );
  }
}
`,
  [ENTRY_CSS]: `:host .container {
    display: flex;
    flex-direction: column;
}
:host .container p {
    color: #0088ff
}
`,
  [ENTRY_HTML]: `
  <quark-list id="list"></quark-list>
  <script>
    const el = document.getElementById("list");
    el.setColumns(['第一行', '第二行', '第三行', '第四行', '第五行'])
  </script>
  `
};

export default mem;