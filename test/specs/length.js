/**
 * import(s)
 */

var Vue = require('../../node_modules/vue/dist/vue')
var validator = require('../../index')
var createInstance = require('./helper').createInstance


describe('minLength', function () {
  var vm, target

  before(function () {
    Vue.config.async = false
    Vue.use(validator)
  })

  after(function () {
    Vue.config.async = true
  })
  
  beforeEach(function () {
    vm = createInstance(
      '<input type="text" v-model="comment" v-validate="minLength: 4">',
      { msg: null }
    )
    target = vm._children[0]
  })


  describe('when input 3 length string', function () {
    beforeEach(function () {
      vm.comment = 'aaa'
      vm._digest() // force update
    })

    it('should be true', function () {
      expect(target.validation.comment.minLength).to.be(true)
    })
  })


  describe('when input 4 length string', function () {
    beforeEach(function () {
      vm.comment = 'aaaa'
      vm._digest() // force update
    })

    it('should be false', function () {
      expect(target.validation.comment.minLength).to.be(false)
    })
  })


  describe('when input 5 length string', function () {
    beforeEach(function () {
      vm.comment = 'aaaaa'
      vm._digest() // force update
    })

    it('should be false', function () {
      expect(target.validation.comment.minLength).to.be(false)
    })
  })
})



describe('maxLength', function () {
  var vm, target

  before(function () {
    Vue.config.async = false
    Vue.use(validator)
  })

  after(function () {
    Vue.config.async = true
  })
  
  beforeEach(function () {
    vm = createInstance(
      '<input type="text" v-model="comment" v-validate="maxLength: 4">',
      { msg: null }
    )
    target = vm._children[0]
  })


  describe('when input 3 length string', function () {
    beforeEach(function () {
      vm.comment = 'aaa'
      vm._digest() // force update
    })

    it('should be false', function () {
      expect(target.validation.comment.maxLength).to.be(false)
    })
  })


  describe('when input 4 length string', function () {
    beforeEach(function () {
      vm.comment = 'aaaa'
      vm._digest() // force update
    })

    it('should be false', function () {
      expect(target.validation.comment.maxLength).to.be(false)
    })
  })


  describe('when input 5 length string', function () {
    beforeEach(function () {
      vm.comment = 'aaaaa'
      vm._digest() // force update
    })

    it('should be true', function () {
      expect(target.validation.comment.maxLength).to.be(true)
    })
  })
})
