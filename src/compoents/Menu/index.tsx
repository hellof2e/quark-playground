import { QuarkElement, customElement, state } from "quarkc";
import style from "./index.css"

@customElement({ tag: "app-menu", style })
export default class Menu extends QuarkElement {

	@state()
	menus = [{
		name: 'home',
		link: '/'
	}]

  componentDidMount(): void {}
  
  render() {
    return (
		<nav class="app_menu">
				
  		</nav>
    );
  }
}