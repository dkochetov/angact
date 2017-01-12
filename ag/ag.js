var AngactDom = function (core, real, scope, maskScope, contx) {
    this.template = core.template;
    this.scope = scope;
    this.maskScope = maskScope || [];
    this.compileTemplate = '';
    this.real = real;
    this.child = [];
    contx.push(this);
};

AngactDom.prototype.render = function () {
    this.real.innerHTML = this.compileTemplate;
};
AngactDom.prototype.update = function () {
    var template = this.template,
        that = this;

    this.maskScope.forEach(function (keyScope) {
        var revertArray = keyScope.split('-') || [];
        if (revertArray[0] === 'ag') {
            if (that.scope[keyScope]) {
                angact.agAttrs[keyScope](that.scope[keyScope], that);
            }
            return;
        }
        var replaceData = that.scope[keyScope] ? that.scope[keyScope].value ? that.scope[keyScope].value : that.scope[keyScope] : '';
        template = template.split('{{' + keyScope + '}}').join(replaceData);
    });
    this.compileTemplate = template;
    this.render();
    for (var i = 0; i < this.real.childNodes.length; i++) {
        angact._whiteRabbit(this.real.childNodes[i], this.child)
    }
};

var Angact = function () {
    var that = this;
    this.components = {};
    this.agAttrs = {};
    this.angactDom = [];
    document.addEventListener('DOMContentLoaded', function () {
        that.root = document.querySelector("[data-app]");
        that._whiteRabbit(that.root, that.angactDom);

    });
};

Angact.prototype.component = function (name, core) {
    if (!name) return;
    this.components[this.replacer(name)] = core;
};
Angact.prototype.agAttr = function (name, core) {
    if (!name) return;
    this.agAttrs[this.replacer(name)] = core;
};

Angact.prototype._createDom = function (node, contx, i) {
    var core = node.core(),
        maskScope = [],
        component = {},
        angactNode = {};

    var scope = {};
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
                    angactNode.update();
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
};
Angact.prototype._whiteRabbit = function (node, contx) {
    if (!node || !node.childNodes || !node.childNodes.length) {
        return;
    }
    var childNodes = node.childNodes;
    for (var i = 0; i < childNodes.length; i++) {
        if (this.components[childNodes[i].localName]) {
            this._createDom({
                name: childNodes[i].localName,
                real: childNodes[i],
                core: this.components[childNodes[i].localName],
                child: []
            }, contx, i)

        }
    }
};
Angact.prototype.replacer = function (name) {
    var compileName = '',
        codeChar = 0;
    for (var i = 0; i < name.length; i++) {
        codeChar = name.charCodeAt(i);
        if (codeChar >= 65 && codeChar <= 90) {
            compileName += '-' + String.fromCharCode(codeChar + 32)
        } else {
            compileName += name[i];
        }
    }
    return compileName;
};

window.angact = new Angact();