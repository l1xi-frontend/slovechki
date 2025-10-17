const body = document.body
const windowInnerHeight = window.innerHeight
const keys= document.querySelectorAll('.keyboard div')
const letterContainers = document.querySelectorAll('.attempts div')
const attemptsDivs = document.querySelectorAll('.attempts')
const wordNumber = document.querySelector('.word-number')
const noWord = document.querySelector('.no-word')
const endGame = document.querySelector('.end-game')
const resultHiddenWord = document.querySelector('.result-hidden-word')
const resultAttempts = document.querySelector('.result-attempts')
const winOrLose = document.querySelector('.win-or-lose')
const restart = document.querySelector('.restart')
const resultTime = document.querySelector('.result-time')
const errorWords = document.querySelector('.error')

const widthNoword = noWord.offsetWidth
let words = []
let hiddenWord = ''
let randomNumber = Math.floor(Math.random() * 3331)
let attempts = 0
let step = 0
let seconds = 0
let minutes = 0

const timeSet = setInterval(() => {
  seconds++
  if (seconds == 60) {
    seconds = 0
    minutes++
  }
  if (seconds < 10) {
    seconds = `0${seconds}`
  }
  resultTime.textContent = `${minutes}:${seconds}`
}, 1000)

function printingLetters(key) {
  if (step < 5) {
    attemptsDivs[attempts].children[step].textContent = key.textContent
    attemptsDivs[attempts].children[step].style.backgroundColor = '#222'
    step++
  }
}

function backspace(key) {
  if (step > 0) {
    step--;
    attemptsDivs[attempts].children[step].textContent = ''
    attemptsDivs[attempts].children[step].style.backgroundColor = '#0D0D0D'
 }
}

function enter(key) {
  const userWord = attemptsDivs[attempts].textContent.replace(/\s+/g, "").toLowerCase()

  if (step === 5 && words.includes(userWord)) {
    for (let i = 0; i < hiddenWord.length; i++) {
      attemptsDivs[attempts].children[i].style.cssText += `
        transition: background-color .6s, border-color .6s;
        animation: enter .6s ease-in-out;
      `
      
      for (let l = 0; l < keys.length; l++) {
          if(keys[l].textContent.trim().toLowerCase() == userWord[i] && keys[l].style.backgroundColor !== 'rgb(134, 186, 86)') {
            keys[l].style.cssText += `
              transition: background-color .6s, border-color .6s;
            `
            keys[l].style.backgroundColor = '#222'
            keys[l].style.borderColor = '#222'
          }
        }
      
      for (let j = 0; j < hiddenWord.length; j++) {
        if (userWord[i] == hiddenWord[j]) {
        attemptsDivs[attempts].children[i].style.backgroundColor = '#DCD359' //ЖЕЛТЫЙ
        attemptsDivs[attempts].children[i].style.borderColor = '#DCD359'
        for (let l = 0; l < keys.length; l++) {
          
          if(keys[l].textContent.trim().toLowerCase() == userWord[i] && keys[l].style.backgroundColor !== 'rgb(134, 186, 86)') {
            keys[l].style.cssText += `
              transition: background-color .6s, border-color .6s;
          `
            keys[l].style.backgroundColor = '#DCD359'
            keys[l].style.borderColor = '#DCD359'
          }
        }
      }
    }
      if (userWord[i] == hiddenWord[i]) {
        attemptsDivs[attempts].children[i].style.backgroundColor = '#86BA56' //ЗЕЛЁНЫЙ 
        attemptsDivs[attempts].children[i].style.borderColor = '#86BA56'
        for (let l = 0; l < keys.length; l++) {
          if(keys[l].textContent.trim().toLowerCase() == userWord[i]) {
            keys[l].style.cssText += `
              transition: background-color .6s, border-color .6s;
            `
            keys[l].style.backgroundColor = '#86BA56'
            keys[l].style.borderColor = '#86BA56'
          }
        }
      }
    }
    
    attempts++
    step = 0
    
    if (userWord == hiddenWord) {
      winOrLose.textContent = 'СЛОВО ОТГАДАНО'
      clearInterval(timeSet)
      setTimeout(() => {
        endGame.style.display = 'flex'
      }, 700)
    } else if (attempts == 6 && userWord !== hiddenWord){
      winOrLose.textContent = 'УПС! СЛОВО НЕ ОТГАДАНО'
      clearInterval(timeSet)
      setTimeout(() => {
        endGame.style.display = 'flex'
      }, 700)
    }
    
  } else if (step === 5 && !words.includes(userWord)) {
    noWord.style.cssText += `transform: translateY(0px);`
    setTimeout(() => {
      noWord.style.cssText += `transform: translateY(-${widthNoword}px);`
    }, 3000)
  }
}



async function STARTGAME() {
  try {
    const response = await fetch('words.json')
    words = await response.json()
    hiddenWord = words[randomNumber]
    console.log('Слова загружены -', words.length)
  } catch (error) {
    hiddenWord = 'ERROR'
    console.error('Ошибка загрузки слов:', error)
    errorWords.style.display = 'flex'
  }
  
  
  console.log('Загаданое слово -', hiddenWord)
  resultHiddenWord.textContent = hiddenWord.toUpperCase()
  
  wordNumber.textContent = randomNumber + 1
  body.style.minHeight = `${windowInnerHeight}px`
  
  
  noWord.style.cssText += `transform: translateY(-${widthNoword}px);`
  letterContainers.forEach((letterContainer) => {
    const width = letterContainer.offsetWidth
    letterContainer.style.height = `${width}px`
  })

  keys.forEach((key, i) => {
    key.addEventListener('click', () => {
      if (i != 22 && i != 32) {
        printingLetters(key)
      } else if (i == 32) {
        backspace(key)
      } else if (i == 22) {
        enter(key)
        resultAttempts.textContent = `${attempts}/6`
      }
    })
  })
  
  restart.addEventListener('click', () => {
    location.reload()
  })
  
}

STARTGAME()
