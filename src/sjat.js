setTimeout(function(){
(function () {
  if (typeof sjatSnwplwDomain != 'undefined') {
    ;(function(p,l,o,w,i,n,g){if(!p[i]){p.GlobalSnowplowNamespace=p.GlobalSnowplowNamespace||[];
    p.GlobalSnowplowNamespace.push(i);p[i]=function(){(p[i].q=p[i].q||[]).push(arguments)
    };p[i].q=p[i].q||[];n=l.createElement(o);g=l.getElementsByTagName(o)[0];n.async=1;
    n.src=w;g.parentNode.insertBefore(n,g)}}(window,document,"script","//d1fc8wv8zag5ca.cloudfront.net/2.6.1/sp.js","snowplow"));
    window.snowplow('newTracker', 'cf', sjatSnwplwDomain, { // Initialise a tracker
      appId: sjatSnwplwAppId
    });
  }

  var firePixel = function(action, label, property) {
    if (typeof sjatSnwplwDomain == 'undefined') {
      console.log(action, label, property);
    } else {
      window.snowplow('trackStructEvent', 'sjat', action, label, property)
    }
  };

  var firePixelMethodCalled = function(objName, methodName, args) {
    firePixel('method_called', objName+'.'+methodName, JSON.stringify(args));
  };

  var firePixelPropertySet = function(objName, propName, newVal) {
    firePixel('property_set', objName+'.'+propName, JSON.stringify(newVal));
  };

  var monitor_methods = function(obj, objName, methodNames) {
    for (var i = methodNames.length - 1; i >= 0; i--) {
      (function(){
        var methodName = methodNames[i];
        var oldMethod = obj[methodName];
        obj[methodName] = function() {
          firePixelMethodCalled(objName, methodName, arguments);
          return oldMethod.apply(this, arguments);
        };
      })();
    }
  };

  // object.watch
  if (!Object.prototype.watch) {
    Object.defineProperty(Object.prototype, "watch", { enumerable: false, configurable: true, writable: false, value: function (prop, handler) {
      console.log('test');
        var oldval = this[prop], newval = oldval, getter = function () {
          return newval;
        }, setter = function (val) {
          handler.call(this, prop, oldval, val);
          return oldval = newval;
        };
        
        if (delete this[prop]) { // can't watch constants
          Object.defineProperty(this, prop, {
            get: getter,
            set: setter,
            enumerable: true,
            configurable: true
          });
        }
      }
    });
  }

  var monitor_properties = function(obj, objName, propNames) {
    for (var i = propNames.length - 1; i >= 0; i--) {
      var propName = propNames[i];
      obj.watch(propName, function(_propName, _oldVal, newVal){
        console.log(arguments);
        firePixelPropertySet(objName, _propName, newVal);
        return newVal;
      });
    }
  };

  monitor_methods(window, 'window', ['alert', 'confirm', 'prompt', 'open']);
  monitor_properties(window.location, 'window.location', ['href', 'pathname', 'search']); // this works for window.location=/window.location.href=/document.location=/document.location.href=
})();
},0);
