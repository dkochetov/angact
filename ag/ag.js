class AngactDom {
    constructor(core, real, scope, maskScope = [], contx) {
        this.template = core.template;
        this.scope = scope;
        this.maskScope = maskScope;
        this.compileTemplate = '';
        this.real = real;
        this.child = [];
        this.compileTemplate = document.createElement('template');
        contx.push(this);
    }

    render() {
        this.real.innerHTML = '';
        this.real.appendChild(document.importNode(this.compileTemplate.content, true))
    }

    update() {
        let {template} = this;

        this.maskScope.forEach((keyScope) => {
            if (~keyScope.indexOf('ag-')) {
                if (this.scope[keyScope]) {
                    angact.agAttrs[keyScope](this.scope[keyScope], this);
                }
                return;
            }
            let replaceData = this.scope[keyScope] ? this.scope[keyScope].value ? this.scope[keyScope].value : this.scope[keyScope] : '';
            template = template.split('{{' + keyScope + '}}').join(replaceData);
        });

        this.compileTemplate.innerHTML = template;

        this.render();
        for (let i = 0; i < this.real.childNodes.length; i++) {
            angact._whiteRabbit(this.real.childNodes[i], this.child)
        }
    }
}

class Angact {
    constructor() {
        this.components = {};
        this.agAttrs = {};
        this.angactDom = [];
        document.addEventListener('DOMContentLoaded', () => {
            this.root = document.querySelector("[data-app]");
            this._whiteRabbit(this.root, this.angactDom);

        });
    }

    component(name, core) {
        if (!name) return;
        this.components[Angact.replacer(name)] = core;
    }

    agAttr(name, core) {
        if (!name) return;
        this.agAttrs[Angact.replacer(name)] = core;
    }

    _createDom(node, contx, i) {
        let core = node.core(),
            maskScope = [],
            component = {},
            angactNode = {};

        let scope = {};
        if (!contx[i]) {
            angactNode = new AngactDom(core, node.real, scope, maskScope, contx);
            component.$$scope = {};
            Object.keys(this.agAttrs).forEach(function (key) {
                core.scope[key] = '=';
            });
            Object.keys(core.scope).forEach(function (key) {
                maskScope.push(key);
                if (node.real.attributes[key]) {
                    component.$$scope[key] = node.real.attributes[key] ? node.real.attributes[key].value : '';
                }
                Object.defineProperty(scope, key, {
                    set: function (val) {
                        component.$$scope[key] = val ? val.value ? val.value : val : '';
                        if(angactNode.t) {
                            clearTimeout(angactNode.t);
                        }
                        angactNode.t = window.setTimeout(function () {
                            angactNode.update();
                        })
                    },
                    get: function () {
                        return component.$$scope[key] ? component.$$scope[key].value ? component.$$scope[key].value : component.$$scope[key] : '';
                    }
                })
            });
            angactNode.update();
            core.link(scope);
        } else {
            scope = contx[i].scope;
            contx[i].real = node.real;
            contx[i].maskScope.forEach(function (key) {
                if (node.real.attributes[key]) {
                    scope[key] = node.real.attributes[key] ? node.real.attributes[key].value : '';
                }
            });
            contx[i].update();

        }
    }

    _whiteRabbit(node, contx) {
        if (!node || !node.childNodes || !node.childNodes.length) {
            return;
        }
        let childNodes = node.childNodes;
        for (let i = 0; i < childNodes.length; i++) {
            if (this.components[childNodes[i].localName]) {
                this._createDom({
                    name: childNodes[i].localName,
                    real: childNodes[i],
                    core: this.components[childNodes[i].localName],
                    child: []
                }, contx, i)
            }
        }
    }

    static replacer(name) {
        return name.replace(/[A-Z]/g, (char, index) => {
            let lowerChar = char.toLowerCase();
            if (index === 0) return lowerChar;
            return '-' + lowerChar;
        })
    }
}

window.angact = new Angact();