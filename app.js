angact.component('myFirstComponent', function () {
    return {
        template: '<div style="{{styleString}}" class="{{className}}">' +
        '<my-button model="{{data}}" ag-click="click"></my-button>' +
        '</div>',
        scope: {
            model: '=',
            data: '=',
            styleString: '=',
            className: '=',
            click: '@'
        },
        link: function (scope) {
            setTimeout(function () {
                scope.styleString = 'margin-top: 0px';
                scope.data = 'data';
            }, 3000);
            var j = 0;
            scope.click = function (event) {
                event.stopPropagation();                
                scope.data = 'data' + j++;
            }
        }
    }
});
angact.component('myButton', function () {
    return {
        template: '<ul>' +
        '<li>{{title}} - {{label}}</li>' +
        '</ul>',
        scope: {
            title: '=',
            label: '=',
            model: '=',
            click: '@'
        },
        link: function (scope) {
            var i = 1;
            scope.title = '000';
            scope.label = 'Кликнули ' + scope.model;
            scope.click = function (e) {
                e.stopPropagation();
                scope.title = 'Кликнули ' + i + ' - ' + scope.model;
                i++;
            }
        }
    }
});
angact.agAttr('agClick', function (name, context) {
    context.real.addEventListener('click', context.scope[name])
});