import { getAllAuthor } from './author'
import { getAllDynasty } from './dynasty'
import { getTypesFn, getAllTypes } from './type'
import { getAllPoem } from './poem'
import { finalSearchFn } from './search'
import { Author, PoemType } from '../sql'


// 已经获取了朝代的信息 暂时不执行
const hasgetDynasties = false
if (hasgetDynasties) {
  getAllDynasty()
}

/**
 * 获取作者
 * hasgetAuthor 切换关闭状态方便调试
 */
const hasgetAuthor = false
if (hasgetAuthor) {
  getAllAuthor()
}


const hasgetType = false
if(hasgetType) {
  getTypesFn()
}

const hasSearch = false
if(hasSearch) {
  finalSearchFn('杜秋娘')
}

// getAllPoem()

// getAllTypes()
