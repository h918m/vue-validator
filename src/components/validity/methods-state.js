/* @flow */

export default function (Vue: GlobalAPI): Object {
  function getValue (options?: Object): any {
    return 'value'
  }

  function checkModified (options?: Object): boolean {
    return this._initValue !== this.getValue(options)
  }

  function willUpdateTouched (options?: Object): void {
    if (!this.touched) {
      this.touched = true
      this.fireEvent('touched')
    }
  }

  function willUpdateDirty (options?: Object): void {
    if (!this.dirty && this.checkModified(options)) {
      this.dirty = true
      this.fireEvent('dirty')
    }
  }

  function willUpdateModified (options?: Object): void {
    const modified = this.modified = this.checkModified(options)
    if (this._modified !== modified) {
      this._modified = modified
      this.fireEvent('modified', modified)
    }
  }

  return {
    getValue,
    checkModified,
    willUpdateTouched,
    willUpdateDirty,
    willUpdateModified
  }
}
