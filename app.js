angact.component('menu', function () {
    return {
        template: '<ul>{{item}}</ul>',
        scope: {
            item: '='
        },
        link: function (scope) {
            for (var i = 0; i < 5; i++) {
                scope.item += '<menu-item ag-click="click" title="Item ' + i + '"></menu-item>';
            }
        }
    }
});

angact.component('menuItem', function () {
    return {
        template: '<li class="{{active}}">{{title}}</li>',
        scope: {
            title: '=',
            click: '=',
            active: '='
        },
        link: function (scope) {
            scope.click = function () {
                scope.active = scope.active ? '' : 'active';
            }
        }
    }
});
angact.component('news', function () {
    return {
        template: '<div>{{item}}</div>',
        scope: {
            item: '='
        },
        link: function (scope) {
            for (var i = 0; i < 100; i++) {
                scope.item += '<news-item ag-click="click" title="news ' + i + '" description="description ' + i + '"></news-item>';
            }
        }
    }
});
angact.component('newsItem', function () {
    return {
        template: '<div class="news-item">' +
        '<div class="title">{{title}}</div' +
        '><div class="description">{{description}}</div>' +
        '</div>',
        scope: {
            title: '=',
            click: '=',
            description: '='
        },
        link: function (scope) {
        }
    }
});

angact.agAttr('agClick', function (name, context) {
    context.real.addEventListener('click', context.scope[name])
});