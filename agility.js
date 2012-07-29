// Generated by CoffeeScript 1.3.1
(function() {
  var Agility, App, root,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  root = this;

  if (typeof exports !== "undefined" && exports !== null) {
    root = exports;
  }

  Agility = {};

  App = {
    Controllers: {},
    Collections: {},
    Views: {},
    Models: {},
    Helpers: {}
  };

  root.Agility = Agility;

  root.App = App;

  Agility.Application = (function() {

    Application.name = 'Application';

    Application.prototype.routes = {};

    function Application() {
      this.initApplication = __bind(this.initApplication, this);
      this.router = new Agility.Router(this);
    }

    Application.prototype.populateRoutes = function() {
      var method, path, _ref, _results;
      _ref = this.routes;
      _results = [];
      for (path in _ref) {
        method = _ref[path];
        _results.push(this.router.route(path, method));
      }
      return _results;
    };

    Application.prototype.preBoot = function(proceed) {
      return proceed();
    };

    Application.prototype.run = function() {
      return this.preBoot(this.initApplication);
    };

    Application.prototype.initApplication = function() {
      this.populateRoutes();
      this.initNavigation();
      return this.hijackLinks();
    };

    Application.prototype.initNavigation = function() {
      Backbone.history.start({
        pushState: true,
        silent: true
      });
      return Backbone.history.loadUrl(this.startPoint());
    };

    Application.prototype.startPoint = function() {
      return null;
    };

    Application.prototype.$rootEl = function() {
      return $(this.root);
    };

    Application.prototype.hijackLinks = function() {
      return $('a').live('click', function(e) {
        var host, path, regex;
        if ($(this).attr('href') === '#') {
          e.preventDefault();
          return;
        }
        host = window.location.host + '/';
        regex = new RegExp(window.location.host);
        if (regex.test(this.href)) {
          path = this.href.split(host).pop();
          path = path.replace(/^\//, '');
          Backbone.history.navigate(path, true);
          return e.preventDefault();
        }
      });
    };

    return Application;

  })();

  Agility.Collection = (function(_super) {

    __extends(Collection, _super);

    Collection.name = 'Collection';

    function Collection() {
      return Collection.__super__.constructor.apply(this, arguments);
    }

    return Collection;

  })(Backbone.Collection);

  Agility.Controller = (function() {

    Controller.name = 'Controller';

    function Controller(app) {
      this.app = app;
    }

    Controller.prototype.view = function(name, options) {
      var view_class;
      view_class = App.Views[name];
      if (view_class != null) {
        return new view_class(this.app, options);
      } else {
        throw new Error("View " + name + " not found");
      }
    };

    return Controller;

  })();

  Agility.Model = (function(_super) {

    __extends(Model, _super);

    Model.name = 'Model';

    function Model() {
      return Model.__super__.constructor.apply(this, arguments);
    }

    Model.prototype.urlSuffix = '';

    Model.prototype.url = function() {
      return Model.__super__.url.call(this) + this.urlSuffix;
    };

    Model.prototype.parse = function(data) {
      if (this.namespace) {
        return data[this.namespace];
      } else {
        return data;
      }
    };

    Model.prototype.toJSON = function() {
      var result;
      if (this.namespace) {
        result = {};
        result[this.namespace] = this.attributes;
      } else {
        result = this.attributes;
      }
      return result;
    };

    Model.prototype.className = function() {
      return this.constructor.name;
    };

    return Model;

  })(Backbone.Model);

  Agility.Router = (function() {

    Router.name = 'Router';

    function Router(app) {
      this.router = new Backbone.Router;
      this.app = app;
    }

    Router.prototype.route = function(path, action) {
      var _this = this;
      return this.router.route(path, action, function() {
        var params;
        params = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return _this.dispatch(action, params);
      });
    };

    Router.prototype.dispatch = function(action, params) {
      var controller, instance, method, _ref;
      _ref = action.split("#"), controller = _ref[0], method = _ref[1];
      instance = new App.Controllers[controller](this.app);
      return instance[method].apply(instance, params);
    };

    return Router;

  })();

  Agility.Template = {
    templates: {},
    clearTemplates: function() {
      return this.templates = {};
    },
    register: function(name, html) {
      return Handlebars.templates[name] = Handlebars.compile(html);
    },
    find: function(name) {
      return Handlebars.templates[name];
    },
    render: function(name, data, options) {
      var template;
      template = this.find(name);
      if (template) {
        return template(data, options);
      } else {
        throw new Error("Template " + name + " not found");
      }
    }
  };

  Agility.View = (function(_super) {

    __extends(View, _super);

    View.name = 'View';

    function View() {
      var app, options;
      app = arguments[0], options = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      this.renderTemplate = __bind(this.renderTemplate, this);

      this.app = app;
      View.__super__.constructor.apply(this, options);
    }

    View.prototype.appRoot = function() {
      return this.app.$rootEl();
    };

    View.prototype.render = function() {
      return this.renderTemplate(this.templateContext());
    };

    View.prototype.templateContext = function() {
      return this.options;
    };

    View.prototype.renderTemplate = function(context) {
      var html;
      html = Agility.Template.render(this.template, context);
      return this.$el.html(html);
    };

    View.prototype.attachToRoot = function() {
      root = this.appRoot();
      if (!this.isAttachedToRoot()) {
        root.empty();
        return root.append(this.$el);
      }
    };

    View.prototype.isAttachedToRoot = function() {
      return this.$el.parent().is(root);
    };

    View.prototype.view = function(name, options) {
      var view_class;
      view_class = App.Views[name];
      if (view_class != null) {
        return new view_class(this.app, options);
      } else {
        throw new Error("View " + name + " not found");
      }
    };

    return View;

  })(Backbone.View);

}).call(this);
