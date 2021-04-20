import { IconAlignLeft } from './client-side-assets.js';
import { IconAlignCenter } from './client-side-assets.js';
import { IconAlignRight } from './client-side-assets.js';
import { BaseModule } from './BaseModule.js';

let Align, initialized = false;
function ensureInitialization() {

	if(initialized) return;
	const parchment = window.Quill.imports.parchment;
	Align = window.Quill.imports['formats/align'];
	const offsetAttributor = new parchment.Attributor.Attribute('nameClass', 'class', {
		scope: parchment.Scope.INLINE,
	});
	window.Quill.register(offsetAttributor);
	initialized = true;

}

export class Toolbar extends BaseModule {
	onCreate = () => {

		ensureInitialization();

		// Setup Toolbar
		this.toolbar = document.createElement('div');
		Object.assign(this.toolbar.style, this.options.toolbarStyles);
		this.overlay.appendChild(this.toolbar);

		// Setup Buttons
		this._defineAlignments();
		this._addToolbarButtons();
	};

	// The toolbar and its children will be destroyed when the overlay is removed
	onDestroy = () => { };

	onUpdate = () => {
		this.overlay.removeChild(this.toolbar);
		this.onCreate();
	};

	_defineAlignments = () => {
		this.alignments = [
			{
				icon: IconAlignLeft,
				class: "ql-image-align-left",
				apply: () => {
					const line = Quill.find(this.img).parent;
					Align.remove(line.domNode);
				},
				isApplied: () => {
					const line = Quill.find(this.img).parent;
					return !Align.whitelist.includes(Align.value(line.domNode));
				},
			},
			{
				icon: IconAlignCenter,
				class: "ql-image-align-center",
				apply: () => {
					const line = Quill.find(this.img).parent;
					Align.add(line.domNode, 'center');
				},
				isApplied: () => {
					const line = Quill.find(this.img).parent;
					return Align.value(line.domNode) == 'center';
				},
			},
			{
				icon: IconAlignRight,
				class: "ql-image-align-right",
				apply: () => {
					const line = Quill.find(this.img).parent;
					Align.add(line.domNode, 'right');
				},
				isApplied: () => {
					const line = Quill.find(this.img).parent;
					return Align.value(line.domNode) == 'right';
				},
			},
		];
	};

	_addToolbarButtons = () => {
		const buttons = [];
		this.alignments.forEach((alignment, idx) => {
			const button = document.createElement('span');
			button.classList.add(alignment.class);
			buttons.push(button);
			if(typeof(alignment.icon)==="function") {
				alignment.icon(button).then(() => {
					Object.assign(button.children[0].style, this.options.toolbarButtonSvgStyles);
				});
			} else {
				button.innerHTML = alignment.icon;
				Object.assign(button.children[0].style, this.options.toolbarButtonSvgStyles);
			}
			button.addEventListener('click', () => {
				// deselect all buttons
				buttons.forEach(button => button.style.filter = '');
				if (alignment.isApplied()) {
					// If applied, unapply
					const line = Quill.find(this.img).parent;
					Align.remove(line.domNode);
				} else {
					// otherwise, select button and apply
					this._selectButton(button);
					alignment.apply();
				}
				// image may change position; redraw drag handles
				this.requestUpdate();
			});
			Object.assign(button.style, this.options.toolbarButtonStyles);
			if (idx > 0) {
				button.style.borderLeftWidth = '0';
			}
			if (alignment.isApplied()) {
				// select button if previously applied
				this._selectButton(button);
			}
			this.toolbar.appendChild(button);
		});
	};

	_selectButton = (button) => {
		button.style.filter = 'invert(20%)';
	};

}
