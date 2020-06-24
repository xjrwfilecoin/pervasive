export function getTreeList(rows, idFieldName, pidFieldName, fileds) { // 工具方法，将扁平数据转化成tree格式数据
  function nodejsonexists(rows, ParentId) {
    for (var i = 0; i < rows.length; i++) {
      if (rows[i][idFieldName] === ParentId) {
        return true
      }
    }
    return false
  }

  let nodes = []
  for (let i = 0; i < rows.length; i++) {
    let row = rows[i]
    if (!nodejsonexists(rows, row[pidFieldName])) {
      var data = {
        id: row[idFieldName]
      }
      let arrFiled = fileds.split(',')
      for (var j = 0; j < arrFiled.length; j++) {
        if (arrFiled[j] !== idFieldName) {
          data[arrFiled[j]] = row[arrFiled[j]]
        }
      }
      nodes.push(data)
    }
  }
  let toDo = []
  for (let i = 0; i < nodes.length; i++) {
    toDo.push(nodes[i])
  }
  while (toDo.length) {
    let node = toDo.shift() // the parent node
    // get the children nodes
    for (let i = 0; i < rows.length; i++) {
      let row = rows[i]
      if (row[pidFieldName] === node.id) {
        let child = {
          id: row[idFieldName]
        }
        let arrFiled = fileds.split(',')
        for (let j = 0; j < arrFiled.length; j++) {
          if (arrFiled[j] !== idFieldName) {
            child[arrFiled[j]] = row[arrFiled[j]]
          }
        }
        if (node.children) {
          node.children.push(child)
        } else {
          node.children = [child]
        }
        toDo.push(child)
      }
    }
  }
  return nodes
}
