// r.js
// Mit Lisence
// 法克
// 法克@163.com

'use strict';

let path = {};
let splitter = '!';
let homePage = 'index';
let root = window;
let pathExp = /[/*]/g;
let nativeKeys = Object.keys;

const parseRoute = (action, glob, handle, context) => {
    if (!glob || !handle) return false;

    if (typeof glob === 'string' || glob instanceof RegExp) return true;

    for (let i = 0, length = glob.length; i < length; i++) {
        this[action].call(this, glob[i], handle, context);
    }

    return false;
};

const getHash = () => {
    return location.hash.substring(splitter.length + 1);
};

const setHash = (hash) => {
    let hashExp = new RegExp('(?:#|'+ splitter +')', 'g');
    location.hash =  '#' + splitter + hash.replace(hashExp, '');
};

const hashMatcher = () => {
    let hash = getHash();
    let pathKeys = nativeKeys(path), pathObjectList, key, exp;

    if (!hash) return setHash(homePage);

    for (let i = 0, length = pathKeys.length; i < length; i++) {
        key = pathKeys[i];

        // 如果注册的是正则表达式路径
        if (exp = path[key].regexp) {
            if (exp.test(hash)) {
                pathObjectList = path[key].obj;
                break;
            }
        } else {
            if (key === hash) {
                pathObjectList = path[key].obj;
                break;
            }
        }
    }

    pathObjectList && pathObjectList.forEach(pathObject =>
        pathObject.handle.apply(pathObject.context)
    );
};

const hashChange = () =>
    hashMatcher();

/**
 * path转换成根据path的正则表达式
 *
 * @param {String} path 正则表达式路径
 * example
 *   xx/* => xx/[^/]*?$
 *   xx/* /v => xx/[^/]* /v$
 *   xx/* /v /* => xx/[^/]*?/v/[^/]*?$*
 * @return {String}
 */
const pathToRegExp = (path) => {
    let exp = path.replace(pathExp, match => {
        return match === '/' ? '\\/' : '[^\/]*?';
    }) + '$';

    return new RegExp(exp);
};

// 绑定一个路由处理器
export const bind = (glob, handle, context) => {
    if (!parseRoute.call(this, 'bind', glob, handle, context)) return this;

    if (typeof glob === 'string') {
        path[glob] || (path[glob] = {});

        if (pathExp.test(glob)) path[glob].regexp = pathToRegExp(glob);

        path[glob].obj || (path[glob].obj = []).push({ handle: handle, context: context || root });
    }

    return this;
};

// 删除一个路由处理器绑定
export const unbind = (glob, handle) => {
    if (!parseRoute.call(this, 'unbind', glob, handle)) return this;

    if (!path[glob]) return this;

    if (typeof glob === 'string') {
        for (let i = 0, result = [], length = (list = path[glob]).length, usedHandle; i < length; i++) {
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
    hashChange();
};

// 跳转到某一hash
export const go = hash => {
    setHash(hash);

    return this;
};