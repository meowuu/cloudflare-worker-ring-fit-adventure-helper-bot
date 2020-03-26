import data from './zh.json'

/**
 * 查找材料
 * @param name 材料名称
 */
export default function (name: string) {
  let list = data.filter(item => {
    let find = false
    for (const _key of Object.keys(item).filter(_key => /Ingredient/i.test(_key))) {
      const key = _key as keyof typeof item
      if (item[key].toLowerCase() === name.toLowerCase()) {
        find = true
        break
      }
    }
    return find
  })

  if (list.length === 0) return `你想找的材料 ${ name } 没有找到`

  const title = `你想找的材料 ${ name } 可以在以下关卡找到: `
  return [title]
    .concat(list.map(item => {
      return `世界: ${ item.World } 关卡: ${item.level} 建议人物等级: ${ item['Lv.'] }`
    }))
    .join('\n')
}