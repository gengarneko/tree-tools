export { traverseBfs as bfs } from "./traverse-bfs"
export { traverseDfs as dfs } from "./traverse-dfs"

// * --------------------------------------------------------------------------- 测试数据

const provinceList = [
  {
    id: "1000",
    label: "湖北省",
    children: [
      {
        id: "1001",
        pid: "1000",
        label: "武汉",
        children: [
          { id: "100101", pid: "1001", label: "洪山区" },
          { id: "100102", pid: "1001", label: "武昌区" },
          { id: "100103", pid: "1001", label: "汉阳区" },
        ],
      },
      { id: "1020", pid: "1000", label: "咸宁" },
      { id: "1022", pid: "1000", label: "孝感" },
      { id: "1034", pid: "1000", label: "襄阳" },
      { id: "1003", pid: "1000", label: "宜昌" },
    ],
  },
  {
    id: "1200",
    value: "江苏省",
    label: "江苏省",
    children: [
      { id: "1201", pid: "1200", label: "南京" },
      { id: "1202", pid: "1200", label: "苏州" },
      { id: "1204", pid: "1200", label: "扬州" },
    ],
  },
]

// * --------------------------------------------------------------------------- 树的遍历

/**
 *  深度优先遍历 - 递归
 */
const dfsTransFn = (tree, func) => {
  tree.forEach((node) => {
    func(node)
    // 如果子树存在，递归调用
    if (node.children?.length) {
      dfsTransFn(node.children, func)
    }
  })
  return tree
}

// * ---------------------------

/**
 *  深度优先遍历
 */
const dfsTreeFn = (tree, func) => {
  let node,
    list = [...tree]
  // shift()-取第一个
  while ((node = list.shift())) {
    func(node)
    // 如果子树存在，递归调用
    // 子节点追加到队列最前面`unshift`
    node.children && list.unshift(...node.children)
  }
}

// * ---------------------------

/**
 *  广度优先遍历
 */
const bfsTransFn = (tree, func) => {
  let node,
    list = [...tree]
  // shift()-取第一个；pop()-取最后一个
  while ((node = list.shift())) {
    func(node)
    // 如果子树存在，递归调用
    node.children && list.push(...node.children)
  }
}

// * --------------------------------------------------------------------------- 树和列表间的转换

const dfsTreeToListFn = (tree, result = []) => {
  if (!tree?.length) {
    return []
  }
  tree.forEach((node) => {
    result.push(node)
    console.log(`${node.id}...${node.label}`) // 打印节点信息
    node.children && dfsTreeToListFn(node.children, result)
  })
  return result
}

// * ---------------------------

const bfsTreeToListFn = (tree, result = []) => {
  let node,
    list = [...tree]
  while ((node = list.shift())) {
    result.push(node)
    console.log(`${node.id}...${node.label}`) // 打印节点信息
    node.children && list.push(...node.children)
  }
  return result
}

// * ---------------------------

export const treeToListFn = (tree) => {
  let node,
    result = tree.map((node) => ((node.level = 1), node))
  for (let i = 0; i < result.length; i++) {
    // 没有子节点，跳过当前循环，进入下一个循环
    if (!result[i].children) continue
    // 有子节点，遍历子节点，添加层级信息
    let list = result[i].children.map(
      (node) => ((node.level = result[i].level + 1), node),
    )
    // 将子节点加入数组
    result.splice(i + 1, 0, ...list)
  }
  return result
}

// * --------------------------------------------------------------------------- 列表转树

const listToTreeFn = (list) => {
  // 建立了id=>node的映射
  let obj = list.reduce(
    // map-累加器，node-当前值
    (map, node) => ((map[node.id] = node), (node.children = []), map),
    // 初始值
    {},
  )
  return list.filter((node) => {
    // 寻找父元素的处理：
    // 1. 遍历list：时间复杂度是O(n)，而且在循环中遍历，总体时间复杂度会变成O(n^2)
    // 2. 对象取值：时间复杂度是O(1)，总体时间复杂度是O(n)
    obj[node.pid] && obj[node.pid].children.push(node)
    // 根节点没有pid，可当成过滤条件
    return !node.pid
  })
}

// * --------------------------------------------------------------------------- 查找节点

const treeFindFn = (tree, func) => {
  for (let node of tree) {
    if (func(node)) return node
    if (node.children) {
      let result = treeFindFn(node.children, func)
      if (result) return result
    }
  }
  return false
}

// 测试代码
let findFlag1 = treeFindFn(provinceList, (node) => node.id === "1020")
let findFlag2 = treeFindFn(provinceList, (node) => node.id === "100125")
console.log(`1020 is ${JSON.stringify(findFlag1)}, 100125 is ${findFlag2}`)

// * --------------------------------------------------------------------------- 查找节点路径

const treeFindPathFn = (tree, func, path = []) => {
  if (!tree) return []

  for (let node of tree) {
    path.push(node.id)
    if (func(node)) return path
    if (node.children) {
      const findChild = treeFindPathFn(node.children, func, path)
      if (findChild.length) return findChild
    }
    path.pop()
  }
  return []
}

// 测试代码
let findPathFlag = treeFindPathFn(provinceList, (node) => node.id === "100102")
console.log(`100102 path is ${findPathFlag}`)
