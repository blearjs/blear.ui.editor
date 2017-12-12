/**
 * Menu
 * @author ydr.me
 * @create 2017-12-12 18:04
 * @update 2017-12-12 18:04
 */


'use strict';

var Events = require('blear.classes.events');
var modification = require('blear.core.modification');
var object = require('blear.utils.object');

var namespace = require('../settings.json').namespace;
var iconClassName = namespace + '-menu';
var defaults = {};
var Menu = Events.extend({
    constructor: function (options) {
        var the = this;

        Menu.parent(the);
        the[_options] = object.assign({}, defaults, options);
        the[_el] = modification.create('div', {
            class: iconClassName
        });
    },

    /**
     * 获取元素
     * @returns {*}
     */
    getEl: function () {
        return this[_el];
    },

    /**
     * 插入图标
     * @param icon
     * @returns {Menu}
     */
    icon: function (icon) {
        var the = this;

        return the;
    },

    /**
     * 插入下拉框
     * @param options
     * @returns {Menu}
     */
    options: function (options) {
        var the = this;

        return the;
    },

    /**
     * 销毁实例
     */
    destroy: function () {
        var the = this;

        Events.invoke('destroy', the);
        modification.remove(the[_el]);
    }
});

Menu.defaults = defaults;
var sole = Menu.sole;
var _options = sole();
var _el = sole();


module.exports = Menu;







