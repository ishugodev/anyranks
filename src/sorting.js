import sortList from "./sortList.js";
import * as elements from "./elements.js"
import * as result from './result.js'

let countSameSortPointsAcordingIndex = []
let indexOfMaxSortPoints = null
let haveMoreTwoSameSortPoints = false
let countSelectedSortItems = 0
let selectedSortItems = []
let adaptCountSameSortPointsIndex = 3
let previousSortItems = []
let countSortTime = 0

export function selectSortItemsToSort() {
	//Reset arrays
	countSameSortPointsAcordingIndex = []
	selectedSortItems = []

	//Adapt multiplicator
	if(indexOfMaxSortPoints > sortList.length) {
		adaptCountSameSortPointsIndex += 1
	}

	//Making array with 0
	for(let i = 0; i < (sortList.length) + adaptCountSameSortPointsIndex; i++) {
		countSameSortPointsAcordingIndex.push(0)
	}

	//Counting index with same sort points
	sortList.forEach(i => {
		countSameSortPointsAcordingIndex[i.sortPoints] = countSameSortPointsAcordingIndex[i.sortPoints] + 1
	})

	//Looking for the index with the largest quantity that has the same point
	for(let i = 0; i < countSameSortPointsAcordingIndex.length; i++) {
		if(indexOfMaxSortPoints == null) {
			indexOfMaxSortPoints = i
		}

		if(countSameSortPointsAcordingIndex[indexOfMaxSortPoints] < countSameSortPointsAcordingIndex[i]) {
			indexOfMaxSortPoints = i
		}
	}

	//if have index with same sort points
	countSameSortPointsAcordingIndex.forEach(i => {
		if(i > 1) {
			haveMoreTwoSameSortPoints = true
			return
		}

		if(i <= 1 && countSameSortPointsAcordingIndex[indexOfMaxSortPoints] < 2) {
			haveMoreTwoSameSortPoints = false
		}
	})

	//When every sort item don't have same sort point
	if(!haveMoreTwoSameSortPoints) {
		elements.sorting.style.display = 'none'
		result.showResult()
		return
	}

	//Selecting sort items
	for(let i = 0; i < countSameSortPointsAcordingIndex.length; i++) {
		if(sortList[i].sortPoints == indexOfMaxSortPoints) {
			selectedSortItems.push(sortList[i])
			countSelectedSortItems++
		}
		
		if(countSelectedSortItems >= 2) {
			countSelectedSortItems = 0

			if(countSortTime <= 0) {
				previousSortItems = selectedSortItems
			}

			break
		}
	}
	
	//Display selected sort items
	elements.firstSortBox.textContent = selectedSortItems[0].name
	elements.secondSortBox.textContent = selectedSortItems[1].name
}

export function choiceSortOption() {
	elements.firstSortBox.addEventListener('click', (e) => {
		const index = sortList.findIndex(i => i.name == e.target.textContent)
		sortList[index].sortPoints += 1

		previousSortItems = selectedSortItems
		countSortTime++
		selectSortItemsToSort()
	})
	
	elements.secondSortBox.addEventListener('click', (e) => {
		const index = sortList.findIndex(i => i.name == e.target.textContent)
		sortList[index].sortPoints += 1
		
		previousSortItems = selectedSortItems
		countSortTime++
		selectSortItemsToSort()
	})

	elements.middleFirstBox.addEventListener('click', (e) => {
		const indexFirstSortBox = sortList.findIndex(i => i.name == elements.firstSortBox.textContent)
		const indexSecondSortBox = sortList.findIndex(i => i.name == elements.secondSortBox.textContent)

		sortList[indexFirstSortBox].sortPoints += 1
		sortList[indexSecondSortBox].sortPoints += 1

		previousSortItems = selectedSortItems
		countSortTime++
		selectSortItemsToSort()
	})

	elements.middleSecondBox.addEventListener('click', (e) => {
		elements.firstSortBox.textContent = previousSortItems[0].name
		elements.secondSortBox.textContent = previousSortItems[1].name
	})

}