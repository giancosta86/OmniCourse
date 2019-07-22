import { ContextPath } from "../lib/ContextPath"

describe("String representation for", () => {
  it("root-only paths", () => {
    expect(new ContextPath("A").toString()).toBe("A")
  })

  it("2-component paths", () => {
    expect(new ContextPath("A", "B").toString()).toBe("A->B")
  })

  it("3-component paths", () => {
    expect(new ContextPath("A", "B", "C").toString()).toBe("A->B->C")
  })
})

describe("Root context for", () => {
  it("root-only paths", () => {
    expect(new ContextPath("A").getRootContext()).toBe("A")
  })

  it("multi-component paths", () => {
    expect(new ContextPath("A", "B", "C").getRootContext()).toBe("A")
  })
})

describe("Last context for", () => {
  it("root-only paths", () => {
    expect(new ContextPath("A").getLastContext()).toBe("A")
  })

  it("multi-component paths", () => {
    expect(new ContextPath("A", "B", "C").getLastContext()).toBe("C")
  })
})

describe("Is root context for", () => {
  it("root-only paths", () => {
    expect(new ContextPath("A").isRoot()).toBe(true)
  })

  it("multi-component paths", () => {
    expect(new ContextPath("A", "B").isRoot()).toBe(false)
  })
})

describe("Appending a context for", () => {
  it("root-only paths", () => {
    expect(new ContextPath("A").concat("B").toString()).toBe("A->B")
  })

  it("multi-component paths", () => {
    expect(new ContextPath("A", "B").concat("C").toString()).toBe("A->B->C")
  })
})

describe("Indexing an object for", () => {
  let targetObject = {
    A: { B: 13 },

    X: { Y: { Z: 90 } }
  }

  it("root-only paths", () => {
    expect(new ContextPath("A").indexObject(targetObject)).toEqual({ B: 13 })
  })

  it("2-component paths", () => {
    expect(new ContextPath("X", "Y").indexObject(targetObject)).toEqual({
      Z: 90
    })
  })

  it("3-component paths", () => {
    expect(new ContextPath("X", "Y", "Z").indexObject(targetObject)).toBe(90)
  })
})

describe("Left-anchored subpaths for", () => {
  const getLeftAnchoredStrings = path =>
    path.getLeftAnchoredSubpaths().map(path => path.toString())

  it("root-only paths", () => {
    expect(getLeftAnchoredStrings(new ContextPath("A"))).toEqual(["A"])
  })

  it("2-component paths", () => {
    expect(getLeftAnchoredStrings(new ContextPath("A", "B"))).toEqual([
      "A",
      "A->B"
    ])
  })

  it("3-component paths", () => {
    expect(getLeftAnchoredStrings(new ContextPath("A", "B", "C"))).toEqual([
      "A",
      "A->B",
      "A->B->C"
    ])
  })
})
