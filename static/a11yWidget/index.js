

const setup = async () => {

	const html = await fetch("static/a11yWidget/index.html").then((res) => res.text());

	class RWCAccessibilityWidget extends HTMLElement {
		menuExpanded = false

		// settings


		menus = [
			{
				"id": 'text',
				"label": "Text",
				"icon": "",
				"iconAlt": "",
				"options": [
					{
						"label": "Normal",
						"callback": (event) => {
							const html = document.querySelector("html");

							html.setAttribute("data-accessibility-font-size", "default")
						}
					},
					{
						"label": "Large",
						"callback": (event) => {
							const html = document.querySelector("html");

							html.setAttribute("data-accessibility-font-size", "large")
						}
					},
					{
						"label": "Extra Large",
						"callback": (event) => {
							const html = document.querySelector("html");

							html.setAttribute("data-accessibility-font-size", "xlarge")
						}
					}
				]
			},
		]


		// The class constructor object
		constructor () {
	
			// Always call super first in constructor
			super();
	
			// Creates a shadow root
		//	this.root = this.attachShadow({mode: 'open'});
	
	
			// Render HTML
			this.innerHTML = html;
	
		}

		onMenuButtonClick(event){

			const menu = this.querySelector('#a11yMenu');
			const menuButton = this.querySelector('button');

			this.menuExpanded = !this.menuExpanded;

			menu.setAttribute("aria-expanded", this.menuExpanded)

			const menuRoot = this.querySelector('#a11yMenu');


			const menus = [...menuRoot.querySelectorAll('[role="menu"]')];

			menus.forEach((menu) => this.collapseMenu(menu))


			if(this.menuExpanded){
				menuButton.classList.add("radius-right-0")
				menu.classList.remove("closed")
				menu.classList.add("expanded")
				return;
			}
			
			menu.classList.add("closed")
			menu.classList.remove("expanded")

			menuButton.classList.remove("radius-right-0")
		}
		renderSubMenu(root, menu){


			for(const option of menu.options){
				const button = document.createElement('button');

				button.className = 'usa-button--unstyled menu-button margin-top-1'

				button.textContent = option.label

				button.role = "menuitem"

				button.addEventListener('click', option.callback.bind(this))

				root.appendChild(button)
			}

		}

		renderMenus(){
			const menuRoot = this.querySelector('#a11yMenu');

			for(const menu of this.menus){

				const wrapper = document.createElement('div');

				wrapper.className = 'menu-item-wrapper border-primary width-15 border-bottom-05';

				const button = document.createElement('button');

				button.className = 'menu-button grid-col width-full text-primary height-full display-flex flex-align-center flex-justify-center padding-left-3 padding-right-3'

				button.textContent = menu.label

				wrapper.appendChild(button);

				const menuElement = document.createElement('div');

				menuElement.className = 'display-flex position-absolute width-15 bg-primary-lighter flex-column border-primary border-left-05 border-right-05 border-bottom-05 closed';

				menuElement.setAttribute("aria-expanded", false)

				menuElement.id = `${menu.id}Menu`

				menuElement.role = 'menu'
				
				button.addEventListener('click', (event) => {
					// setup menu expand / collapse

					const menus = [...menuRoot.querySelectorAll('[role="menu"]')].filter((menu) => menu.id !== menuElement.id);

					menus.forEach((menu) => this.collapseMenu(menu))

					this.expandCollapseSubmenu(menuElement);

				});

				this.renderSubMenu(menuElement, menu);

				wrapper.appendChild(menuElement)
				
				menuRoot.appendChild(wrapper)

			}
		}

		collapseMenu(menu){
			menu.classList.add('closed');
			menu.classList.remove('expanded');
			menu.setAttribute('aria-expanded', false);
		}

		expandCollapseSubmenu(menuElement){

			const isExpanded = menuElement.getAttribute('aria-expanded') === 'false';

			if(isExpanded){
				menuElement.classList.remove('closed');
				menuElement.classList.add('expanded');
				menuElement.setAttribute('aria-expanded', true);
				return;
			}

			menuElement.classList.add('closed');
			menuElement.classList.remove('expanded');
			menuElement.setAttribute('aria-expanded', false);

		}

		connectedCallback(){
			const menuButton = this.querySelector('button');
			menuButton.addEventListener('click', this.onMenuButtonClick.bind(this));

	

			this.renderMenus();

	


		}
	
		// Runs when the value of an attribute is changed on the component
		attributeChangedCallback (name, oldValue, newValue) {
	
			// Remove the icon
			let icon = this.root.querySelector('.loading-ring');
			icon.remove();
	
			// Show a content loaded message
			let notify = this.root.querySelector('[role="status"]');
			notify.textContent = newValue.length ? newValue : 'Content loaded';
	
		}
	
		// Create a list of attributes to observe
		static get observedAttributes () {
			return ['loaded'];
		}
	
	}
	
	if ('customElements' in window) {
		customElements.define('rwc-accessibility-widget', RWCAccessibilityWidget);
	}
	

	

}

await setup();