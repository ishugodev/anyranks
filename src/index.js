import * as createSortList from './createSortList.js'
import * as sorting from './sorting.js'
import * as result from './result.js'

import * as elements from './elements.js'

export function start() {
  elements.input.focus()
  createSortList.updateSortList()
  createSortList.addSortItem()
  createSortList.removeSortItem()
  createSortList.closeDisplay()

  sorting.choiceSortOption()

  result.buttonBack()
}