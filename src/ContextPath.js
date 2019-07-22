import _ from "lodash"

export class ContextPath {
  constructor(...contexts) {
    this._contexts = [...contexts]
  }

  getRootContext() {
    return _.first(this._contexts)
  }

  getLastContext() {
    return _.last(this._contexts)
  }

  concat(context) {
    let newContexts = _.concat(this._contexts, context)

    return new ContextPath(...newContexts)
  }

  indexObject(objectToIndex) {
    return this._contexts.reduce(
      (currentObject, currentContext) => currentObject[currentContext],
      objectToIndex
    )
  }

  getLeftAnchoredSubpaths() {
    return this._contexts.reduce((result, context) => {
      let lastPathInResult = _.last(result)
      let nextPath = lastPathInResult
        ? lastPathInResult.concat(context)
        : new ContextPath(context)

      return _.concat(result, nextPath)
    }, [])
  }

  isRoot() {
    return this._contexts.length === 1
  }

  toString() {
    return _.join(this._contexts, "->")
  }
}
