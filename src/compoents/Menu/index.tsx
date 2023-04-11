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
                link: '/#/hello-world'
            },
            {
                name: 'Defining',
                link: '/#/defining'
            },
            {
                name: 'Rendering',
                link: '/#/rendering'
            }
        ]
    },{
        name: 'REACTIVE PROPERTIES',
        childrens: [
            {
                name: 'State',
                link: '/#/state'
            },
            {
                name: 'Props',
                link: '/#/props'
            },
            {
                name: 'Skill',
                link: '/#/skill'
            }
        ]
    },]

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