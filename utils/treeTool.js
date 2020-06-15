export function getTreeNode(rows) {
  let Nodes = []
  if (rows && rows.length>0 ) {
    for (var i = 0; i < rows.length; i ++) {
      Nodes.push({
        id: rows[i].user.id,
        label: rows[i].user.fullName + ' ' + rows[i].user.companyRate * 100 + '% ' + rows[i].portionNum + ' ' + rows[i].havPorUserNum + '/' + rows[i].totalUserNum,
        children: getTreeNode(rows[i].childNodes)
      })
    }
  } 
  return Nodes 
}

// 懒加载逐层查询
// export function getTreeNode(rows, uid, name) {  
//   let top = []
//   let children = []
//   if (rows && rows.length > 0) {
//     for (var i = 0; i < rows.length; i ++) {
//       children.push({
//         id: rows[i].id,
//         label: rows[i].fullName + ' ' + rows[i].companyRate * 100 + '%',
//         isLeaf: 'leaf'
//       })
//     }
//   }
//   if (uid && uid != '') {
//     top.push({
//       id: uid,
//       label: name,
//       children: children
//     })
//   } else {
//     top.push({
//       id: 'company',
//       label: '星际荣威科技有限公司',
//       children: children
//     })
//   }
//   return top
// }

// export function getChidlren(data, nodeId, child) {
//   let result;
//   if (!data) {
//     return; //如果data传空，直接返回
//   }
//   if (data[0].children && data[0].children.length>0) {
//     for (var i = 0; i < data[0].children.length; i++) {
//       let item = data[0].children[i];
//       if (item.id == nodeId) {
//         data[0].children[i] = child[0]
//         result = data; //找到id相等的则返回父id
//         return result;
//       } else if (item.children && item.children.length > 0) {
//         //如果有子集，则把子集作为参数重新执行本方法
//         result = getChidlren(item, nodeId, child);
//         if (result) {
//           return result;
//         }
//       }
//     }
//   }
// }

// 单节点上下级
// export function getChildNode(childNodes) {
//   let nodes = []
//   if (childNodes && childNodes.length>0) {
//     for (var i = 0; i < childNodes.length; i ++) {
//       nodes.push({
//         id: childNodes[i].user.id,
//         label: childNodes[i].user.fullName,
//         children: getChildNode(childNodes[i].childNodes)
//       }) 
//     }  
//   } 
//   return nodes 
// }

// export function getOnesTreeNode(rows) {
//   let current = {}  
//   if (rows.child) {
//     current.id = rows.child.user.id
//     current.label = rows.child.user.fullName
//     if (rows.child.childNodes && rows.child.childNodes.length>0) {
//       current.children = getChildNode(rows.child.childNodes)  
//     }
//   }
  
//   let allNodes = {}
//   allNodes = current

//   if (rows.ancestors && rows.ancestors.length > 1) {
//     for (var j = 1; j < rows.ancestors.length; j ++) {
//       let childArr = []
//       childArr.push(allNodes)
//       allNodes = {}
//       allNodes.id = rows.ancestors[j].id,
//       allNodes.label = rows.ancestors[j].fullName,
//       allNodes.children = childArr
//     }
//   }
//   return allNodes
// }
