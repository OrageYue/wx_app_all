import { host } from '../../src/constants';
export function idUri2titleUri(tree, iduri){
  const titleuri = []
  let cur_node = tree;
  for (let uid of iduri.slice(1)){
    cur_node = cur_node.children.find(n=>n.id===uid);
    titleuri.push(cur_node.name);
  }
  return titleuri;
}

export function getNodeInTree(tree, iduri) {
  let cur_node = tree;
  const iduri_without_root = iduri.slice(1);
  for (let uid of iduri_without_root){
    cur_node = cur_node.children.find(n=>n.id===uid);
  }
  return cur_node;
}

export function getItemsInTree(tree, iduri){
  const cur_node = getNodeInTree(tree, iduri);
  // children not got yet.
  const items = cur_node ? cur_node.children : [];
  // state not finish initializing
  if (!items) {return []}
  else return items;
}

export function isItemViewable(itemtype) {
  if (typeof(itemtype) === 'object') itemtype=itemtype.type;
  return ['pdf', 'image', 'video', 'richtext', 'other', 'docx'].includes(itemtype);
}

export function canItemDownload(itemtype) {
  if (typeof(itemtype) === 'object') itemtype=itemtype.type;
  return ['pdf', 'image', 'video', 'other'].includes(itemtype);
}

export function isFolder(itemtype) {
  if (typeof(itemtype) === 'object') itemtype=itemtype.type;
  return 'folder' === itemtype;
}

/**
 * 获取资源对应的URL
 */
export function getResourceUrl(item) {
  return `${host}${item.content}`
}