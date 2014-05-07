// Generated by CoffeeScript 1.7.1
(function() {
  var F5, bustCache, equals, getCookie, getFileExtension, getFileName, getScript, parseUri, setCookie,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  if (!window.console) {
    window.console = {
      debug: function() {},
      log: function() {},
      info: function() {},
      warn: function() {},
      error: function() {}
    };
  }

  getScript = function(url, errorCallback) {
    var done, parent, script;
    script = document.createElement('script');
    done = false;
    script.async = true;
    script.defer = true;
    script.src = url;
    if (typeof errorCallback === 'function') {
      script.onerror = function(e) {
        return errorCallback({
          url: url,
          event: e
        });
      };
    }
    script.onload = script.onreadystatechange = function() {
      var _ref;
      if (!done && (!this.readyState || ((_ref = this.readyState) === 'loaded' || _ref === 'complete'))) {
        done = true;
        script.onload = script.onreadystatechange = null;
        if (script != null ? script.parentNode : void 0) {
          return script.parentNode.removeChild(script);
        }
      }
    };
    parent = document.getElementsByTagName('body');
    if (parent.length === 0) {
      parent = document.getElementsByTagName('head');
    }
    if (parent.length) {
      return parent[0].appendChild(script);
    }
  };

  parseUri = function(url) {
    var a;
    a = document.createElement('a');
    a.href = url;
    return a;
  };

  setCookie = function(name, value) {
    if (name) {
      if (value === void 0) {
        return document.cookie = "" + name + "=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT";
      } else {
        return document.cookie = "" + name + "=" + value + ";path=/";
      }
    }
  };

  getCookie = function(name, defaultValue) {
    var cookie, cookieArray, i, _i, _len;
    cookieArray = document.cookie.split('; ');
    for (_i = 0, _len = cookieArray.length; _i < _len; _i++) {
      cookie = cookieArray[_i];
      i = cookie.indexOf('=');
      if (i > 0) {
        if (name === cookie.substring(0, i)) {
          return cookie.substring(i + 1);
        }
      }
    }
    return defaultValue || null;
  };

  getFileName = function(path) {
    if (!path) {
      return '';
    }
    return path.replace(/\?.*$/, '').replace(/^.*\//, '');
  };

  getFileExtension = function(path) {
    var base, matched;
    base = getFileName(path);
    matched = base.match(/\.[^.]+$/);
    if (matched) {
      return matched[0].toLowerCase();
    } else {
      return '';
    }
  };

  equals = function(url, path) {
    return url && path && getFileName(url) === getFileName(path);
  };

  bustCache = function(url) {
    var pattern, replacement;
    pattern = /_f5=[\d\.]+/;
    replacement = "_f5=" + (Math.random());
    console.log('bustCache', url);
    if (pattern.test(url)) {
      url = url.replace(pattern, replacement);
    } else if (__indexOf.call(url, '?') >= 0) {
      url += '&' + replacement;
    } else {
      url += '?' + replacement;
    }
    console.log('bustCache', '->', url);
    return url;
  };

  F5 = function() {
    var API_ROOT, MAX_RETRY, applyChange, findStyleSheet, reattachStyleSheet, reload, retryCount, updateCSS, updateImage, updateScript;
    API_ROOT = (function() {
      var script, scripts, src, _i, _len;
      scripts = document.getElementsByTagName('script');
      for (_i = 0, _len = scripts.length; _i < _len; _i++) {
        script = scripts[_i];
        src = script.src;
        if (src.indexOf('/_f5.js') > -1) {
          console.log('apiRootUrl', "http://" + (parseUri(src).hostname) + "/_/");
          return "http://" + (parseUri(src).hostname) + "/_/";
        }
      }
      return '/';
    })();
    MAX_RETRY = 3;
    retryCount = 0;
    reload = function() {
      return location.reload(true);
    };
    applyChange = function(path, type) {
      var ext;
      if (type !== 'modified' && type !== 'created') {
        return;
      }
      ext = getFileExtension(path);
      if (ext === '.css') {
        return updateCSS(path);
      } else if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif' || ext === '.bmp') {
        return updateImage(path);
      } else if (ext === '.js') {
        return updateScript(path);
      } else {
        return reload();
      }
    };
    findStyleSheet = function(name) {
      var rule, ss, _i, _j, _len, _len1, _ref, _ref1;
      _ref = document.styleSheets;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        ss = _ref[_i];
        if (equals(ss.href, name)) {
          return ss;
        } else {
          if (ss.cssText && ss.cssText.indexOf(name) > 0) {
            return ss;
          } else {
            _ref1 = ss.rules;
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              rule = _ref1[_j];
              if (equals(rule.href, name)) {
                return ss;
              }
            }
          }
        }
      }
      return null;
    };
    reattachStyleSheet = function(styleSheet) {
      var link, node;
      node = styleSheet.ownerNode || styleSheet.owningElement;
      link = document.createElement('link');
      link.href = bustCache(node.href);
      link.rel = 'stylesheet';
      node.parentElement.appendChild(link);
      return node.parentElement.removeChild(node);
    };
    updateCSS = function(path) {
      var styleSheet;
      styleSheet = findStyleSheet(getFileName(path));
      return reattachStyleSheet(styleSheet);
    };
    updateImage = function(path) {
      var image, ss, _i, _j, _len, _len1, _ref, _ref1, _results;
      _ref = document.images;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        image = _ref[_i];
        if (equals(image.src, path)) {
          image.src = bustCache(image.src);
        }
      }
      _ref1 = document.styleSheets;
      _results = [];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        ss = _ref1[_j];
        _results.push(reattachStyleSheet(ss));
      }
      return _results;
    };
    updateScript = function(path) {
      var script, _i, _len, _ref, _results;
      _ref = document.scripts;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        script = _ref[_i];
        if (equals(script.src, path)) {
          _results.push(reload());
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };
    this.handleChanges = (function(_this) {
      return function(resp) {
        var info, path, _ref;
        retryCount = 0;
        setCookie('_f5_reply_time', resp.time);
        _ref = resp.changes;
        for (path in _ref) {
          info = _ref[path];
          applyChange(path, info.type);
        }
        console.log('handleChanges', resp.changes);
        return setTimeout(function() {
          return _this.queryChanges();
        }, 100);
      };
    })(this);
    this.queryChanges = function() {
      var lastChangeTime, url;
      url = "" + API_ROOT + "changes?callback=_F5.handleChanges";
      lastChangeTime = parseFloat(getCookie('_f5_reply_time', -Math.random()));
      if (lastChangeTime) {
        url += "&qt=" + lastChangeTime;
      }
      return getScript(url, (function(_this) {
        return function() {
          retryCount += 1;
          if (retryCount >= MAX_RETRY) {
            return alert('和 [F5] 失联，停止自动刷新');
          } else {
            return setTimeout(function() {
              return _this.queryChanges();
            }, 3000);
          }
        };
      })(this));
    };
    return this;
  };

  window._F5 = new F5();

  setTimeout(function() {
    return window._F5.queryChanges();
  }, 1000);

}).call(this);
