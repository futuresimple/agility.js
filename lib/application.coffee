class Agility.Application
  routes: {}
  constructor: ->
    @router = new Agility.Router()

  populateRoutes: ->
    @router.route(path, method) for path, method of @routes

  run: ->
    this.populateRoutes()
    this.init()

  init: ->
    Backbone.history.start()