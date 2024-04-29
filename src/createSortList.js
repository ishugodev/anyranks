import * as elements from './elements.js'
import sortList from './sortList.js'
import { selectSortItemsToSort } from './sorting.js'

let generateId = 0

function validateSort() {

  const isExist = sortList.find(i => String(i.name).toLowerCase() == String(elements.input.value).toLowerCase())
  return isExist ? true : false
}

export function addSortItem() {
  elements.submit.addEventListener('click', (e) => {
    e.preventDefault()
    
    if(!elements.input.value) {
      elements.alertMessage.textContent = 'Nothing to add! Please type.'
      elements.input.value = ''
      return
    }

    if(validateSort()) {
      elements.alertMessage.textContent = 'Same name! Please add different name.'
      elements.input.value = ''
      return
    }

    elements.alertMessage.textContent = ''

    generateId++

    sortList.push({
      idName: generateId,
      name: elements.input.value,
      sortPoints: 0,
    })

    elements.input.value = ''
    updateSortList()
    elements.input.focus()
  })
}

export function updateSortList() {
  elements.sortList.innerHTML = ''

  if(!sortList[0]) {
    elements.sortList.innerHTML = '<p>No list yet!😪</p>'
    return
  }

  sortList.forEach(index => {
    elements.sortList.innerHTML += `
    <li>
      ${index.name}
      <button id="${index.idName}">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x"
          viewBox="0 0 16 16">
          <path
            d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
        </svg>
      </button>
    </li>
    `
  })

  if(sortList.length >= 2) {
    elements.startSort.innerHTML = '<button id="btn-start-sort">Start sort!🤩</button>'
  }
}

export function removeSortItem() {
  elements.sortList.addEventListener('click', (e) => {
    if(e.target.tagName == 'BUTTON') {
      let selectedId = e.target.id
      let selectedIndex = sortList.findIndex(i => i.idName == selectedId)

      sortList.splice(selectedIndex, 1)

      updateSortList()
    }
  })
}

export function closeDisplay() {
  elements.startSort.addEventListener('click', (e) => {
    if(e.target.tagName == 'BUTTON') {
      elements.createSortList.style.display = 'none'
      elements.sorting.style.display = 'grid'
      selectSortItemsToSort()
    }
  })
}