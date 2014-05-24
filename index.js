/**
 * import(s)
 */

var slice = [].slice


/**
 * export(s)
 */

exports.install = function (Vue) {
    var utils = Vue.require('utils'),
        Directive = Vue.require('directive')
    Vue.config('debug', true)


    /**
     * required validate filter
     */
    Vue.filter('required', function (val, key) {
        utils.log('required filter: ' + val + ', ' + key)
        this.$validation[key]['required'] = (val.length === 0)
        return val
    })

    /**
     * pattern validate filter
     */
    // TODO: Regexp flag
    Vue.filter('pattern', function (val, pattern, key) {
        utils.log('pattern filter: ' + val + ', ' + pattern + ', ' + key)
        try {
            this.$validation[key]['pattern'] = !(new RegExp(pattern).test(val))
        } catch (e) {
            console.error('pattern filter error:', e)
        }
        return val
    })

    /**
     * length validate filter
     */
    Vue.filter('length', function (val) {
        try {
            var key = arguments[arguments.length - 1],
                args = {}

            // parse length condition arguments
            for (var i = 1; i < arguments.length - 1; i++) {
                var parsed = arguments[i].split(':')
                if (parsed.length !== 2) { continue }
                if (isNaN(parsed[1])) { continue }
                args[parsed[0]] = parseInt(parsed[1])
            }

            // validate min
            if ('min' in args) {
                this.$validation[key]['length']['min'] = (val.length < args['min'])
            }

            // validate max
            if ('max' in args) {
                this.$validation[key]['length']['max'] = (val.length > args['max'])
            }
        } catch (e) {
            console.error('length filter error:', e)
        }

        return val
    })


    function initValidationState ($validation, key, filters) {
        for (var i = 0; i < filters.length; i++) {
            var filterName = filters[i].name
            if (filterName === 'required' || filterName === 'pattern') {
                $validation[key][filterName] = false
            } else if (filterName === 'length') {
                $validation[key][filterName] = initValidationArgsState(filters[i].args)
            } else {
                $validation[key][filterName] = {}
            }
        }
    }

    function initValidationArgsState (args) {
        var state = {}

        for (var i = 0; i < args.length; i++) {
            var arg = args[i],
                parsed = arg.split(':')
            if (parsed.length !== 2) { continue }
            state[parsed[0]] = false
        }

        return state
    }

    function makeFilterExpression ($validation, key, filters) {
        var elements = [key],
            ret = ''

        for (var i = 0; i < filters.length; i++) {
            var filterName = filters[i].name
            if (filters[i].args) {
                elements.push([filterName].concat(filters[i].args).concat([key]).join(' '))
            } else {
                elements.push(filterName + ' ' + key)
            }
        }

        ret = elements.join('|')
        utils.log('makeFilterExpression: ' + ret)

        return ret
    }


    Vue.directive('validate', {
        bind: function () {
            var $validation = this.vm.$validation || {},
                el = this.el

            if (el.nodeType === 1 && el.tagName !== 'SCRIPT' && el.hasChildNodes()) {
                slice.call(el.childNodes).forEach(function (node) {
                    if (node.nodeType === 1) {
                        var tag = node.tagName
                        if ((tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') 
                          && node.hasAttributes) {
                            var attrs = slice.call(node.attributes)
                            for (var i = 0; i < attrs.length; i++) {
                                var attr = attrs[i]
                                if (attr.name === 'v-model') {
                                    var asts = Directive.parse(attr.value),
                                        key = asts[0].key,
                                        filters = asts[0].filters
                                    console.log(asts)
                                    console.log(key, filters)
                                    $validation[key] = {}
                                    if (filters) {
                                        initValidationState($validation, key, filters)
                                        attr.value = makeFilterExpression($validation, key, filters)
                                    }
                                }
                            }
                        }
                    }
                })
            }
            
            this.vm.$validation = $validation
        },

        update: function (val, init) {
            console.log('update', val, init)
            /*
            if (typeof handle !== 'function') { return }

            var name = this.el.getAttribute('name')
            if (!name) { return }

            var $validation = this.vm.$validation
            if (this.arg) {
              $validation[name][this.arg] = handle.call(this.vm)
            } else {
              $validation[name] = handle.call(this.vm)
            }

            this.vm.$validation = $validation
            */
        }
    })
}
