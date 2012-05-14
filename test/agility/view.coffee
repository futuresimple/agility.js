helper = require('../test_helper')
sinon = require('sinon')

helper.requireLib('view')
helper.requireLib('template')

root = sinon.mock()
rootEl = sinon.stub()
rootEl.returns(root)
app = { $rootEl: rootEl }

Agility.Template.register "test", "hello {{name}}"
Agility.Template.register "welcome", "{{hello}} {{name}}"

class App.Views.DefaultsTest extends Agility.View
  template: "test"

class App.Views.Test extends Agility.View
  template: "test"
  extraContext: ->
    {
      'hello': 'Yo'
    }
  
describe "View", ->
  beforeEach ->
    @view = new App.Views.Test(app, { name: "Tom" })
  describe ".appRoot", ->
    it "returns application root element", ->
      assert.equal(@view.appRoot(), root)
  describe "rendering", ->
    it "renders the template based on provided name", ->
      @view.render()
      assert.equal(@view.$el.text(), "hello Tom")

    it "allows the context to be extended", ->
      @view.template = "welcome"
      @view.render()
      assert.equal(@view.$el.text(), "Yo Tom")

    it "works even if extraContext is not defined", ->
      @view = new App.Views.DefaultsTest(app, { name: "Mike" })
      @view.render()
      assert.equal(@view.$el.text(), "hello Mike")

  describe "attachToRoot", ->
    it "attaches the view element to app root", ->
      root = { html: -> }
      mock = sinon.mock(root).expects('html').withExactArgs(@view.$el).once()
      stub = sinon.stub(@view, "appRoot").returns(root)
      @view.attachToRoot()
      mock.verify()

