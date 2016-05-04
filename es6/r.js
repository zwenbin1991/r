// r.js
// Mit Lisence
// 法克
// 法克@163.com

'use strict';

let path = {};
let pathRegExp = [];
let splitter = '!';
var homePage = 'index';
var root = window;

const parseRoute = (action, glob, handle, context) => {
    if (!glob || !handle) return false;

    if (typeof glob === 'string' || glob instanceof RegExp) return true;

    for (var i = 0, length = glob.length; i < length; i++) {
        this[action].call(this, glob[i], handle, context);
    }

    return false;
};

const getHash = () => {
    return location.hash.substring(splitter.length + 1);
};

const setHash = (hash) => {
    var hashExp = new RegExp('(?:#|'+ splitter +')', 'g');
    location.hash =  '#' + splitter + hash.replace(hashExp, '');
};

const hashChange = () => {
    if (pathRegExp.length) {
        for (var i = 0, length = pathRegExp.length; i < length; i++) {
                
        }
    }

};

// 绑定一个路由处理器
export const bind = (glob, handle, context) => {
    if (!parseRoute.call(this, 'bind', glob, handle, context)) return this;

    if (typeof glob === 'string') (path[glob] || (path[glob] = [])).push({ handle: handle, context: context || root });
    else if (glob instanceof RegExp) pathRegExp.push({ regexp: glob, handle: handle, context: context || root });

    return this;
};

// 删除一个路由处理器绑定
export const unbind = (glob, handle) => {
    if (!parseRoute.call(this, 'unbind', glob, handle)) return this;

    if (!path[glob]) return this;

    if (typeof glob === 'string') {
        for (var i = 0, result = [], length = (list = path[glob]).length, usedHandle; i < length; i++) {
            (usedHandle = list[i].handle) !== handle && result.push(usedHandle);
        }

        if (!result.length) delete path[glob];
        else path[glob] = result;
    }

    return this;
};

// 启动路由监控
export const boot = option => {
    option.splitter && (splitter = option.splitter);
    option.homePage && (homePage = option.homePage);

    root.onhashchange && (root.onhashchange = hashChange);
};

// 跳转到某一hash
export const go = hash => {

};