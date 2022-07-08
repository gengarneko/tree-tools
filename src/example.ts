// 将模拟数据转为组件需要的数据，遍历数据，添加 title 和 key 字段

const treeTransFn = (tree) =>
  dfsTransFn(tree, (o) => {
    o["key"] = o.id
    o["title"] = o.label
  })

this.provinceData = treeTransFn(provinceList)

// 选中节点禁用

const disabledTreeFn = (tree, targetKeys) => {
  tree.forEach((o) => {
    let flag = targetKeys.includes(o.id)
    o["key"] = o.id
    o["title"] = flag ? `${o.label}(已配置)` : o.label
    o["disabled"] = flag
    o.children && disabledTreeFn(o.children, targetKeys)
  })
  return tree
}

this.provinceData = disabledTreeFn(provinceList, ["100101", "1022", "1200"])

// 选中节点过滤

/**
 *  选中节点过滤
 *  @params {Array} tree 树数据
 *  @params {Array} targetKeys 选中数据key集合
 * 过滤条件是：当前节点且其后代节点都没有符合条件的数据
 */
const filterSourceTreeFn = (tree = [], targetKeys = [], result = []) => {
  R.forEach((o) => {
    // 1. 判断当前节点是否含符合条件的数据：是-继续；否-过滤
    if (targetKeys.indexOf(o.id) < 0) {
      // 2. 判断是否含有子节点：是-继续；否-直接返回
      if (o.children?.length) {
        // 3. 子节点递归处理
        o.children = filterSourceTreeFn(o.children, targetKeys)
        // 4. 存在子节点，且子节点也有符合条件的子节点，直接返回
        if (o.children.length) result.push(o)
      } else {
        result.push(o)
      }
    }
  }, tree)
  return result
}

this.optProvinceData = treeTransFn(
  filterSourceTreeFn(R.clone(provinceList), ["100101", "1022", "1200"]),
)

// 选中节点保留

// 过滤条件是：当前节点或者是其后代节点有符合条件的数据
filterTargetTreeFn = (tree = [], targetKeys = []) => {
  return R.filter((o) => {
    // 当前节点符合条件，则直接返回
    if (R.indexOf(o.id, targetKeys) > -1) return true
    // 否则看其子节点是否符合条件
    if (o.children?.length) {
      // 子节点递归调用
      o.children = filterTargetTreeFn(o.children, targetKeys)
    }
    // 存在后代节点是返回
    return o.children && o.children.length
  }, tree)
}

this.optProvinceData = treeTransFn(
  filterTargetTreeFn(R.clone(provinceList), ["100101", "1022", "1200"]),
)

// 关键词过滤

export const filterKeywordTreeFn = (tree = [], keyword = "") => {
  if (!(tree && tree.length)) {
    return []
  }
  if (!keyword) {
    return tree
  }

  return R.filter((o) => {
    // 1. 父节点满足条件，直接返回
    if (o.title.includes(keyword)) {
      return true
    }
    if (o.children?.length) {
      // 2. 否则，存在子节点时，递归处理
      o.children = filterKeywordTreeFn(o.children, keyword)
    }
    // 3. 子节点满足条件时，返回
    return o.children && o.children.length
    // 避免修改原数据，此处用R.clone()处理一下
  }, R.clone(tree))
}
