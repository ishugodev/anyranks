import sortList from "./sortList.js";
import * as elements from './elements.js'

let orderBySortPoints = []

export function showResult() {
  elements.sortResult.style.display = 'grid'

  orderBySortPoints = sortList.sort((a, b) => b.sortPoints - a.sortPoints)

  let rankNumber = 1

  elements.sortResultText.textContent = `
  Ranking
  `

  orderBySortPoints.forEach(i => {
    elements.resultList.innerHTML += `
    <li><span>${rankNumber++}º</span> <p>${i.name}</p></li>
    <hr />
    `
  })

  elements.btnBackWrapper.innerHTML = `
    <button id="btn-back">Do another!</button>
  `
}

export function buttonBack(){
  elements.btnBackWrapper.addEventListener('click', (e) => {
    if(e.target.tagName == 'BUTTON') {
      window.location.reload()
    }
    
  })
}