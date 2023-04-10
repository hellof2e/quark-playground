import { QuarkElement, customElement, state } from "quarkc";
import style from "./index.css"
interface MenuItem {
    name: string
    childrens: {name: string; link: string}[]
}
@customElement({ tag: "app-menu", style })
export default class Menu extends QuarkElement {

	@state()
	menus: MenuItem [] = [{
		name: 'BASICS',
		childrens: [
            {
                name: 'Hello World',
                link: './'
            },
            {
                name: 'Defining',
                link: './'
            },
            {
                name: 'Rendering',
                link: './'
            }
        ]
	},{
		name: 'REACTIVE PROPERTIES',
		childrens: [
            {
                name: 'State',
                link: './'
            },
            {
                name: 'Props',
                link: './'
            },
            {
                name: 'Skill',
                link: './'
            }
        ]
	},]

  componentDidMount(): void {}
  renderMenu = (memu: MenuItem) => {
    return <div class="menu_item">
        <div class="menu_item_name">{memu.name}</div>
        <div class="menu_item_sub">
            {memu.childrens.map((child) => {
                return <a>{child.name}</a>
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