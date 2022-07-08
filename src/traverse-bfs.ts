export const traverseBfs = (tree: any[], func?: Function) => {
  let node
  let list = [...tree]

  while ((node = list.shift())) {
    func?.(node)
    node.children && list.push(...node.children)
  }

  return tree
}

// * ---------------------------------------------------------------------------

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest
  it("bfs", () => {
    expect(traverseBfs([1, 2])).toEqual([1, 2])
    // expect(add(1)).toBe(1)
    // expect(add(1, 2, 3)).toBe(6)
  })
}
