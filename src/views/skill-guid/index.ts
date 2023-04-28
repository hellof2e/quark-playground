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
<!DOCTYPE html>
<html lang="en">
  <head>
    <script type="module" src="./index.js"></script>
  </head>
  <body>
    <quark-list id="list"></quark-list>
    <script>
      // 模拟异步数据请求
      setTimeout(() => {
        const el = document.getElementById("list");
        el.setColumns(['第一行', '第二行', '第三行', '第四行', '第五行'])
      }, 1000)
      
    </script>
  </body>
</html>
`
};

export default mem;