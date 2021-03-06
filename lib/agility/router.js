Agility.Router = {
  _hook: function() {},
  executeHook: function(route, controller_name, action_name) {
    try {
      if (this._hook) this._hook(route, controller_name, action_name);
    } catch(e) {}
  },
  setHook: function(hook) {
    this._hook = hook;
  },
  route: function(route, controller_and_action) {
    if (route == '/') route = ""
    var parts           = controller_and_action.split('#');
    var controller_name = parts[0];
    var controller      = Agility.Controller.controllers[controller_name]
    if (!controller) throw new Error("Could not find controller " + controller_name);
    var action_name     = parts[1];
    var action          = controller[action_name]
    var name = controller_name + "#" + action_name
    if (!action) throw new Error("Action " + controller_name + "#" + action + " not defined");
    if (!_.isRegExp(route)) route = controller._routeToRegExp(route);
    Backbone.history || (Backbone.history = new Backbone.History);
    Backbone.history.route(route, _.bind(function(fragment) {
      Agility.Router.executeHook('/' + fragment, controller_name, action_name)
      var args = controller._extractParameters(route, fragment);
      action.apply(controller, args);
      controller.trigger.apply(controller, ['route:' + name].concat(args));
    }, controller));
  }
}
