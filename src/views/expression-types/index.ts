import {ENTRY_JS, ENTRY_HTML, ENTRY_CSS} from '../../const'

const mem: Record<string, string> = {
  [ENTRY_JS]: `import {
  QuarkElement,
  property,
  customElement,
} from 'quarkc';
import style from './index.css';

@customElement({
  tag: "quark-element",
  style
})
class QuarkEle extends QuarkElement {
  @property()
  bodytext = 'Text in child expression.';

  @property({ type: Boolean })
  disabled = false;

  handleDisableInput = () => {
    this.disabled = !this.disabled;
  }
  
  render() {
    return (
      <div>
        <div>Child expression: {this.bodytext} </div>
        <div>
            <span>Attribute expression: </span>
            <input type="text" disabled={this.disabled} />
        </div>
        

        <div>
            <span>Event listener expression: </span>
            <button onClick={this.handleDisableInput}>Disable Input</button>
        </div>
        
      </div>
    );
  }
}
`,
  [ENTRY_CSS]: `:host{}`,
  [ENTRY_HTML]: `<quark-element></quark-element>`
};

export default mem;