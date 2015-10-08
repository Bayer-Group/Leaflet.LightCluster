jsdom = require('jsdom');

propagateToGlobal = function(window) {
    var key;
    for (key in window) {
        if (!window.hasOwnProperty(key)) {
            continue;
        }
        if (key in global) {
            continue;
        }
        global[key] = window[key];
    }
};

if (!global.document) {
    var doc = jsdom.jsdom('<!doctype html><html><body></body></html>');
    var win = doc.defaultView;
    global.document = doc;
    global.window = win;
    propagateToGlobal(win);
}