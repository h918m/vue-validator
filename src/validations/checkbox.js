import util, { each, attr } from '../util'
import BaseValidation from './base'


/**
 * CheckboxValidation class
 */

export default class CheckboxValidation extends BaseValidation {

  constructor (field, vm, el, validator) {
    super(field, vm, el, validator)

    this._inits = []
  }

  _addItem (el) {
    let item = {
      el: el,
      init: el.checked,
      value: el.value
    }
    this._inits.push(item)
    return item
  }

  _setChecked (values, el) {
    for (let i = 0, l = values.length; i < l; i++) {
      let value = values[i]
      if (!el.disabled && el.value === value && !el.checked) {
        el.checked = true
      }
    }
  }

  manageElement (el) {
    const _ = util.Vue.util

    let item = this._addItem(el)
    let model = item.model = attr(el, 'v-model')
    if (model) {
      let value = this._vm.$get(model)
      if (Array.isArray(value)) {
        this._setChecked(value, item.el)
        item.unwatch = this._vm.$watch(model, _.bind((val, old) => {
          if (val !== old) {
            this._setChecked(val, item.el)
            this.handleValidate(item.el)
          }
        }, this))
      } else {
        el.checked = value
        this._init = el.checked
        item.init = el.checked
        item.value = el.value
        item.unwatch = this._vm.$watch(model, _.bind((val, old) => {
          if (val !== old) {
            el.checked = val
            this.handleValidate(el)
          }
        }, this))
      }
    } else {
      this._validator.validate()
    }
  }

  unmanageElement (el) {
    let found = -1
    each(this._inits, (item, index) => {
      if (item.el === el) {
        found = index
        if (item.unwatch && item.model) {
          item.unwatch()
          item.unwatch = null
          item.model = null
        }
      }
    })
    if (found === -1) { return }

    this._inits.splice(found, 1)
    this._validator.validate()
  }

  _getValue (el) {
    if (!this._inits || this._inits.length === 0) {
      return el.checked
    } else {
      let vals = []
      each(this._inits, (item, index) => {
        if (item.el.checked) {
          vals.push(item.el.value)
        }
      })
      return vals
    }
  }

  _checkModified (target) {
    if (this._inits.length === 0) {
      return this._init !== target.checked
    } else {
      let modified = false
      each(this._inits, (item, index) => {
        if (!modified) {
          modified = (item.init !== item.el.checked)
        }
      })
      return modified
    }
  }
}
