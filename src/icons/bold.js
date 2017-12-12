/**
 * bold
 * @author ydr.me
 * @create 2017-12-11 14:45
 * @update 2017-12-11 14:45
 */


'use strict';

var Icon = require('../constructors/icon');
var Button = require('../constructors/button');

var cmd = 'bold';

module.exports = function (options) {
    return function (editor) {
        // editor.button({
        //     el: Icon(editor, {
        //         name: cmd,
        //         title: '加粗'
        //     }).getButtonEl(),
        //     cmd: cmd,
        //     shortcut: (editor.mac ? 'cmd' : 'ctrl') + '+b'
        // });

        new Icon({
            name: cmd,
            title: '加粗'
        });
    };
};

