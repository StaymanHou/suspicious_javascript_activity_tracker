setTimeout(function(){
(function () {
  var fire_pixel_method_called = function(obj, methodName, args) {
    console.log(obj, method_name, arguments);
  };

  var fire_pixel_property_set = function(obj, propName, args) {
    console.log(obj, method_name, arguments);
  };

  var monitor_methods = function(obj, methodNames) {
    for (var i = methodNames.length - 1; i >= 0; i--) {
      var methodName = methodNames[i];
      var oldMethod = obj[methodName];
      console.log(methodName, oldMethod);
      obj[methodName] = function() {
        fire_pixel(obj, methodName, arguments);
        return oldMethod.apply(this, arguments);
      };
    }
  };

  var monitor_properties = function(obj, propNames) {

  };

  monitor_methods(window, ['alert', 'confirm', 'prompt', 'open']);
})();
},0);