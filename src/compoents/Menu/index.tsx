import { QuarkElement, customElement, state } from "quarkc";
import style from "./index.css?inline"
import { MenuItem, menus } from "../../config";
@customElement({ tag: "app-menu", style })
export default class Menu extends QuarkElement {

    @state()
    menus: MenuItem [] = menus

    @state()
    currentMenuName = 'Hello World'

    handleMenuClck= (child) => {
        this.currentMenuName = child.name

    }

    componentDidMount(): void {}
    renderMenu = (memu: MenuItem) => {
      return <div class="menu_item">
        <div class="menu_item_name">{memu.name}</div>
        <div class="menu_item_sub">
            {memu.childrens.map((child) => {
                const isCurrent = this.currentMenuName === child.name
                return <a href={child.link} onClick={() => {
                    this.handleMenuClck(child);
                }} style={{fontWeight: isCurrent ? 800 : 400, color: isCurrent ? 'white': '#f5f5f5'}}>{child.name}</a>
            })}
        </div>
        
    </div>
   }
   render() {
     return (
		<nav class="app_menu">
			{this.menus.map((menu) => {
                return this.renderMenu(menu)
            })}
  		</nav>
     );
  }
}