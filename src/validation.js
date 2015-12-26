import util, { empty, each, trigger } from './util'


/**
 * Validation class
 */

export default class Validation {

  constructor (field, vm, el, validator) {
    this.field = field
    this.touched = false
    this.dirty = false
    this.modified = false

    this._validator = validator
    this._vm = vm
    this._el = el
    this._init = el.value
    this._value = el.value
    this._validators = Object.create(null)
  }

  setValidation (name, arg, msg) {
    let validator = this._validators[name]
    if (!validator) {
      validator = this._validators[name] = {}
      validator.name = name
    }
    
    validator.arg = arg
    if (msg) {
      validator.msg = msg
    }
  }

  listener (e) {
    if (e.relatedTarget && 
      (e.relatedTarget.tagName === 'A' || e.relatedTarget.tagName === 'BUTTON')) {
      return
    }

    if (e.type === 'blur') {
      this.touched = true
    }

    this._value = e.target.value

    if (!this.dirty && this._value !== this._init) {
      this.dirty = true
    }

    this.modified = (this._value !== this._init)

    this._validator.validate()
  }

  validate () {
    const _ = util.Vue.util

    let results = Object.create(null)
    let messages = Object.create(null)
    let valid = true

    each(this._validators, (descriptor, name) => {
      let asset = this._resolveValidator(name)
      let validator = null
      let msg = null

      if (_.isPlainObject(asset)) {
        if (asset.check && typeof asset.check === 'function') {
          validator = asset.check
        }
        if (asset.message) {
          msg = asset.message
        }
      } else if (typeof asset === 'function') {
        validator = asset
      }

      if (descriptor.msg) {
        msg = descriptor.msg
      }

      if (validator) {
        let ret = validator.call(this._vm, this._el.value, descriptor.arg)
        if (!ret) {
          valid = false
          if (msg) {
            messages[name] = typeof msg === 'function' 
              ? msg.call(this._vm, this.field, descriptor.arg) 
              : msg
          }
        }
        results[name] = !ret
      }
    }, this)

    trigger(this._el, valid ? 'valid' : 'invalid')

    let props = {
      valid: valid,
      invalid: !valid,
      touched: this.touched,
      untouched: !this.touched,
      dirty: this.dirty,
      pristine: !this.dirty,
      modified: this.modified
    }
    if (!empty(messages)) {
      props.messages = messages
    }
    _.extend(results, props)

    return results
  }

  _resolveValidator (name) {
    const resolveAsset = util.Vue.util.resolveAsset
    return resolveAsset(this._vm.$options, 'validators', name)
  }
}
