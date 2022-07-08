export const traverseDfs = (tree: any[], func?: Function) => {
  let node
  let list = [...tree]

  while ((node = list.shift())) {
    func?.(node)
    node.children && list.unshift(...node.children)
  }
}

function forEach(items: any[], callback: any) {
  for (let index = 0; index < items.length; index++) {
    callback(items[index])
  }
}

// * ---------------------------------------------------------------------------

if (import.meta.vitest) {
  const { it, expect, vi, afterEach, describe, test } = import.meta.vitest
  afterEach(() => {
    vi.restoreAllMocks()
  })

  const mockCallback = vi.fn((x: number) => 42 + x)

  forEach([0, 1], mockCallback)

  it("should work as expected", () => {
    // expect(forEach([1, 2], mockCallback)).toEqual([1, 2])
    // 此 mock 函数被调用了两次
    expect(mockCallback.mock.calls.length).toBe(2)

    // 第一次调用函数时的第一个参数是 0
    expect(mockCallback.mock.calls[0][0]).toBe(0)

    // 第二次调用函数时的第一个参数是 1
    expect(mockCallback.mock.calls[1][0]).toBe(1)

    // 第一次函数调用的返回值是 42
    expect(mockCallback.mock.results[0].value).toBe(42)
  })

  it.each([
    [1, 1, 2],
    [1, 2, 3],
    [2, 1, 3],
  ])("add(%i, %i) -> %i", (a, b, expected) => {
    expect(a + b).toBe(expected)
  })

  const numberToCurrency = (value) => {
    if (typeof value !== "number") throw new Error("Value must be a number")

    return value
      .toFixed(2)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  describe("numberToCurrency", () => {
    describe("given an invalid number", () => {
      it("composed of non-numbers to throw error", () => {
        expect(() => numberToCurrency("abc")).toThrow()
      })
    })

    describe("given a valid number", () => {
      it("returns the correct currency format", () => {
        expect(numberToCurrency(10000)).toBe("10,000.00")
      })
    })
  })

  const person = {
    isActive: true,
    age: 32,
  }

  describe("person", () => {
    test("person is defined", () => {
      expect(person).toBeDefined()
    })

    test("is active", () => {
      expect(person.isActive).toBeTruthy()
    })

    test("age limit", () => {
      expect(person.age).toBeLessThanOrEqual(32)
    })
  })
}
