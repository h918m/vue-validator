/**
 * import(s)
 */

var Vue = require('vue'),
    nextTick = Vue.require('utils').nextTick,
    validator = require('vue-validator')


describe('pattern', function () {
    describe('basic', function () {
        var input = mock(
            'validator-pattern1',
            '<form v-validate>' +
            'value: <input type="text" v-model="value | pattern \'[0-9]+\'" /><br />' +
            '</form>'
        ).getElementsByTagName('input')[0]

        Vue.use(validator)

        var form = new Vue({
            el: '#validator-pattern1',
            data: {
                value: ''
            }
        })

        describe('when input invalid pattern', function () {
            before(function (done) {
                input.value = 'hoge'
                input.dispatchEvent(mockHTMLEvent('input'))
                done()
            })

            describe('$validation.value.pattern', function () {
                it('should be true', function (done) {
                    nextTick(function () {
                        expect(form.$validation.value.pattern).to.be(true)
                        done()
                    })
                })
            })
        })

        describe('when input valid pattern', function () {
            before(function (done) {
                input.value = '1111'
                input.dispatchEvent(mockHTMLEvent('input'))
                done()
            })

            describe('$validation.value.pattern', function () {
                it('should be false', function (done) {
                    nextTick(function () {
                        expect(form.$validation.value.pattern).to.be(false)
                        done()
                    })
                })
            })
        })
    })

    describe('Regex flag', function () {
        var input = mock(
            'validator-pattern2',
            '<form v-validate>' +
            'message: <input type="text" v-model="message | pattern \'hello|world\' i" /><br />' +
            '</form>'
        ).getElementsByTagName('input')[0]

        Vue.use(validator)

        var form = new Vue({
            el: '#validator-pattern2',
            data: {
                message: ''
            }
        })

        describe('when input HELLO', function () {
            before(function (done) {
                input.value = 'HELLO'
                input.dispatchEvent(mockHTMLEvent('input'))
                done()
            })

            describe('$validation.message.pattern', function () {
                it('should be false', function (done) {
                    nextTick(function () {
                        expect(form.$validation.message.pattern).to.be(false)
                        done()
                    })
                })
            })
        })
    })
})
