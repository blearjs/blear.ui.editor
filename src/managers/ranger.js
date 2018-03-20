/**
 * RangeManger
 * @author ydr.me
 * @create 2017-11-29 13:50
 * @update 2017-11-29 13:50
 */


'use strict';

var Events = require('blear.classes.events');
var selector = require('blear.core.selector');
var event = require('blear.core.event');
var modification = require('blear.core.modification');
var object = require('blear.utils.object');
var fun = require('blear.utils.function');

var nodal = require('../utils/nodal');

var selectionChangeEventType = 'selectionchange';
var doc = document;
var isEmpty = nodal.isEmpty;
var getLastChildNode = nodal.getLastChildNode;
var getNodeLength = nodal.getNodeLength;
// var blockNodeRE = new RegExp("^(" + ["div", "p", "ul", "ol", "li", "blockquote", "hr",
//     "pre", "h1", "h2", "h3", "h4", "h5", "table"].join('|') + ")$", 'i');
var defaults = {
    el: document
};
var RangeManger = Events.extend({
    className: 'RangeManger',
    constructor: function (options) {
        var the = this;

        RangeManger.parent(the);
        options = the[_options] = object.assign({}, defaults, options);
        the[_el] = options.el;
        the[_initEvent]();
        the[_savedRange] = null;
    },

    /**
     * 获取当前元素内选区
     * @returns {Range|null}
     */
    get: function () {
        var the = this;
        var sel = getNativeSelection();

        if (!sel.rangeCount) {
            return null;
        }

        var range = sel.getRangeAt(0);
        var contains = selector.contains(range.commonAncestorContainer, the[_el]);

        if (!contains) {
            return null;
        }

        return range;
    },

    /**
     * 设置选区
     * @param range
     * @returns {RangeManger}
     */
    set: function (range) {
        var the = this;

        if (!range) {
            return the;
        }

        var sel = getNativeSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        return the;
    },

    // /**
    //  * 保存当前选区待恢复
    //  * @returns {RangeManger}
    //  */
    // save: function () {
    //     var the = this;
    //     the[_savedRange] = the.get();
    //     return the;
    // },
    //
    // /**
    //  * 恢复保存的选区
    //  * @returns {RangeManger}
    //  */
    // restore: function () {
    //     var the = this;
    //     the.set(the[_savedRange]);
    //     the[_savedRange] = null;
    //     return the;
    // },

    /**
     * 变动选区
     * @returns {RangeManger}
     */
    change: function () {
        var the = this;

        the[_selectionChange]();

        return the;
    },

    /**
     * 聚焦
     * @returns {RangeManger}
     */
    focus: function () {
        var the = this;
        var recentRange = the[_lastestRange];

        if (recentRange) {
            the.set(recentRange);
        } else {
            var node = getLastChildNode(the[_el]);
            setRangeAtEndOf(node);
        }

        return the;
    },

    /**
     * 插入节点
     * @param node
     * @returns {RangeManger}
     */
    insertNode: function (node) {
        var the = this;
        var range = the[_lastestRange];

        if (!range) {
            return the;
        }

        range.deleteContents();
        range.insertNode(node);
        range.setStartAfter(node);
        range.setEndAfter(node);
        range.collapse(false);
        return the;
    },

    /**
     * 包裹节点
     * @param node
     * @returns {RangeManger}
     */
    wrapNode: function (node) {
        var the = this;
        var contains = selector.contains(node, the[_el]);

        if (!contains) {
            return the;
        }

        var range = createNativeRange();
        range.setStartBefore(node);
        range.setEndAfter(node);
        the.set(range);
        return the;
    },

    /**
     * 销毁实例
     */
    destroy: function () {
        var the = this;

        event.un(doc, selectionChangeEventType, the[_onSelectionChangeListener]);
        RangeManger.invoke('destroy', the);
    }
});
var sole = RangeManger.sole;
var pro = RangeManger.prototype;
var _options = sole();
var _el = sole();
var _initEvent = sole();
var _selectionChange = sole();
var _lastestRange = sole();
var _savedRange = sole();
var _onSelectionChangeListener = sole();

pro[_selectionChange] = function () {
    var the = this;
    var range = the.get();

    if (!range) {
        return;
    }

    the[_lastestRange] = range;
    the.emit('selectionChange');
};

pro[_initEvent] = function () {
    var the = this;

    event.on(doc, selectionChangeEventType, the[_onSelectionChangeListener] = fun.throttle(function () {
        the[_selectionChange]();
    }));
};

RangeManger.defaults = defaults;
RangeManger.create = createNativeRange;
module.exports = RangeManger;


// ======================================================


/**
 * 本地选区
 * @returns {Selection}
 */
function getNativeSelection() {
    return window.getSelection();
}


/**
 * 创建本地选区
 * @returns {Range|TextRange}
 */
function createNativeRange() {
    return document.createRange();
}

/**
 * 设置选区到元素末尾位置
 * @ref simditor
 * @param node
 * @returns {Range|TextRange}
 */
function setRangeAtEndOf(node) {
    var range = createNativeRange();
    var nodeName = node.nodeName;
    var nodeType = node.nodeType;
    var sel = getNativeSelection();

    if (nodeName === 'PRE') {
        debugger;
    } else {
        var nodeLength = getNodeLength(node);

        if (nodeType !== 3 && nodeLength > 0) {
            var lastChildNode = getLastChildNode(node);
            var lastChildNodeName = lastChildNode.nodeName;
            var lastChildNodeType = lastChildNode.nodeType;

            if (lastChildNodeName === 'BR') {
                nodeLength -= 1;
            } else if (lastChildNodeType !== 3 && isEmpty(lastChildNode)) {
                modification.insert(brEl(), lastChildNode, 2);
                nodeLength = 0;
            }
        }

        range.setEnd(node, nodeLength);
    }

    range.collapse(false);

    try {
        sel.removeAllRanges();
    } catch (err) {
        // ignore
    }
    sel.addRange(range);

    return range;
}


/**
 * BR 节点
 * @returns {HTMLBRElement}
 */
function brEl() {
    return modification.create('br');
}

