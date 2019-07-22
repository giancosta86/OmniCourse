import React from "react"
import { ContextPath } from "./ContextPath"

export default ({ rootLabel, rootContexts, path, onPathRequest }) => {
  let leftAnchoredSubpaths = path.getLeftAnchoredSubpaths()

  let subpathControls = path.isRoot()
    ? null
    : leftAnchoredSubpaths.map((subpath, index) =>
        index < leftAnchoredSubpaths.length - 1 ? (
          <button
            className="internal path-component"
            key={subpath}
            onClick={() => onPathRequest(subpath)}
          >
            {subpath.getLastContext()}
          </button>
        ) : (
          <span className="leaf path-component" key={subpath}>
            {subpath.getLastContext()}
          </span>
        )
      )

  return (
    <nav className="path-bar">
      <label className="root-label">{rootLabel}</label>
      <select
        className="root-select"
        value={path.getRootContext()}
        onChange={event => onPathRequest(new ContextPath(event.target.value))}
      >
        {rootContexts.map(rootContext => (
          <option key={rootContext}>{rootContext}</option>
        ))}
      </select>

      {subpathControls}
    </nav>
  )
}
