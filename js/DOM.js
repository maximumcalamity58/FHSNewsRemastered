//returns HTML element specified. Can overload arguments to give the element attributes. Syntax is "[attr, value]"
function createElement(type) {
	let elm = document.createElement(type);
	let func;
	for (let i = 1; i < arguments.length; i++) {

		switch (arguments[i][0]) {
			case "text":
				elm.innerHTML = arguments[i][1];
				break;
			case "children":
				if (arguments[i][1] instanceof Array) {
					for (let e of arguments[i][1]) {
						if (e != null)
							elm.appendChild(e);
					}
				} else {
					if (arguments[i][1] != null)
						elm.appendChild(arguments[i][1]);
				}
				break;
			case "onkeydown":
				func = arguments[i][1];
				elm.addEventListener("keypress", func.bind(event, this, elm));
				break;
			case "onkeyup":
				func = arguments[i][1];
				elm.addEventListener("keyup", func.bind(event, this, elm));
				break;
			case "checked":
				elm.checked = arguments[i][1]
			default:
				elm.setAttribute(arguments[i][0], arguments[i][1]);
		}
	}
	return elm;
}

//returns all HTML elements within the parent. findAll specifies if all elements of the same name should be found. Overload arguments with element(s) descriptor
function findElements(parent, findAll, desc) {
	if (parent == undefined || desc == undefined) {
		return;
	}
	let elms = [];
	for (let i = 2; i < arguments.length; i++) {
		if (findAll) {
			let q = parent.querySelectorAll(arguments[i]);
			for (let thing of q) {
				elms.push(thing);
			}
		} else {
			elms.push(parent.querySelector(arguments[i]));
		}
	}

	return (findAll) ? elms : elms[0];
}

function replaceElementsWith(parent, newNodes) {
	for (let i = 0; i < newNodes.length; i++) {
		if (i < parent.children.length) {
			parent.replaceChild(newNodes[i], parent.children[i]);
		} else {
			parent.appendChild(newNodes[i]);
		}
	}
}

function replaceAllChildren(parent, newNodes) {
	clearChildren(parent);
	replaceElementsWith(parent, newNodes);
}

function insertAfter(newNode, referenceNode) {
	referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function clearChildren(parent) {
	while (parent.firstChild) {
		parent.removeChild(parent.firstChild);
	}
	return parent;
}


function createDropDown(nodeList, maxShow = 3) {
	let table = createElement('table', ['style', 'border-collapse: collapse;']),
		thead = createElement('thead'),
		tbody = createElement('tbody', ['style', ' visibility:collapse']),
		wrapper = createElement('div', ['class', ' dropdown_wrapper'], ['style', ' width: fit-content;display: inline-block;line-height: 0;position: relative;box-sizing: content-box;']),
		overflowContainer = createElement('div', ['class', ' overflow_container'], ['style', 'position: absolute;width: max-content;cursor: pointer;overflow:auto;'])
	tr = createElement('tr'),
		closeDropdown = true;
	var comp;
	var r = function (n) {
		return function () {
			thead.replaceChild(n.cloneNode(true), thead.children[0]);
			window.dropdownRef = getDropDownCurrentNode();
			dropdownUpdated();
			closeDropdown = true;
		};
	};
	for (let node of nodeList) {
		node.classList += ' drop_itm';
		node.addEventListener('click', r(node));
		tr.appendChild(node);
	}

	thead.onclick = function () {
		overflowContainer.style.height = "";
		overflowContainer.style.overflow = "auto";
		tbody.style = "";
		closeDropdown = false;
	}


	tbody.appendChild(tr);
	thead.appendChild(((tr.cloneNode()).appendChild(nodeList[0].cloneNode(true))));
	table.appendChild(thead);
	table.appendChild(tbody);
	overflowContainer.appendChild(table);
	wrapper.appendChild(overflowContainer);

	window.addEventListener('load', function size() {
		comp = window.getComputedStyle(thead);
		wrapper.style.width = comp.width;
		wrapper.style.height = comp.height;
		overflowContainer.style.maxHeight = (parseInt((comp.height.split("px")[0])) * maxShow * 1.2) + "px";
		overflowContainer.style.height = parseInt((comp.height.split("px")[0])) + "px";
		//global variables to check if a new option has been selected
		window.dropdownRef = getDropDownCurrentNode();
		window.dropdownLength = nodeList.length;
		dropdownLoaded();
		this.removeEventListener('load', size);
	});
	window.addEventListener('resize', function size() {
		comp = window.getComputedStyle(thead);
		if (comp.width != "auto") {
			wrapper.style.width = comp.width;
			wrapper.style.height = comp.height;
			overflowContainer.style.maxHeight = (parseInt((comp.height.split("px")[0])) * maxShow * 1.2) + "px";
			if (closeDropdown) {
				overflowContainer.style.height = parseInt((comp.height.split("px")[0])) + "px";
			}
		}
	});
	window.addEventListener('click', function () {
		if (closeDropdown) {
			overflowContainer.style.overflow = "hidden";
			overflowContainer.style.height = parseInt((comp.height.split("px")[0])) + "px";
			overflowContainer.scrollTop = 0;
			tbody.style = "visibility:hidden";
		}
		closeDropdown = true;
	});
	var addRule = (function (style) {
		var sheet = document.head.appendChild(style).sheet;
		return function (selector, css) {
			var propText = typeof css === "string" ? css : Object.keys(css).map(function (p) {
				return p + ":" + (p === "content" ? "'" + css[p] + "'" : css[p]);
			}).join(";");
			sheet.insertRule(selector + "{" + propText + "}", sheet.cssRules.length);
		};
	})(document.createElement("style"));
	addRule(".overflow_container::-webkit-scrollbar", {
		display: "none"
	});

	return wrapper;
}

function getDropDownCurrentNode() {
	let drop = findElements(document.body, false, ".dropdown_wrapper");
	if (drop) {
		return drop.children[0].children[0].children[0].children;
	} else {
		return;
	}
}

function replaceDropdownContent(drop, nodeList) {
	let thead = findElements(drop, false, "thead"),
		tr = findElements(drop, false, "tr");

	clearChildren(tr);
	clearChildren(thead);


	var r = function (n) {
		return function () {
			thead.replaceChild(n.cloneNode(true), thead.children[0]);
			window.dropdownRef = getDropDownCurrentNode();
			dropdownUpdated();
			closeDropdown = true;
		};
	};
	for (let node of nodeList) {
		node.classList += ' drop_itm';
		node.addEventListener('click', r(node));
		tr.appendChild(node);
	}
	thead.appendChild(((tr.cloneNode()).appendChild(nodeList[0].cloneNode(true))));
	window.dropdownRef = getDropDownCurrentNode();
	dropdownUpdated();
	return drop;
}

function dropdownUpdated() {
	return;
}

function dropdownLoaded() {
	return;
}
