// Stars spawn and anim

const starsDiv = document.querySelector('.stars')

function spawnStars() {

    starsDiv.innerHTML = ''

    const starCount = 300

    const width = starsDiv.offsetWidth
    const height = starsDiv.offsetHeight
    const centerX = width / 2
    const centerY = height / 2

    const minRad = width * 0.15 
    const maxRad = width * 0.5

    const fragment = document.createDocumentFragment()

    for(let i = 0; i < starCount; i++) {
        const angle = Math.random() * 2 * Math.PI
        const radius = minRad + Math.random() * (maxRad - minRad)

        const x = radius * Math.cos(angle)
        const y = radius * Math.sin(angle)

        const finalX = Math.floor(centerX + x)
        const finalY = Math.floor(centerY + y)

        const star = document.createElement('div')
        star.classList.add('star')

        const size = Math.random() * 3 + 1 + 'px'
        star.style.width = size
        star.style.height = size

        star.style.opacity = Math.random() * 0.7 + 0.3

        const randomSpeed = Math.random() * 3 + 2 + 's'
        star.style.animationDuration = randomSpeed

        const randomDelay = -(Math.random() * 5) + 's'
        star.style.animationDelay = randomDelay

        star.style.left = Math.floor(finalX) + 'px'
        star.style.top = Math.floor(finalY) + 'px'

        fragment.appendChild(star)
    }

    starsDiv.appendChild(fragment)
}

spawnStars()

// Input actions

const inputQuestion = document.getElementById('question-input')
const askQuestion = document.querySelector('.ask')
const faqBut = document.querySelector('.header-faq-img-hover')
const faqMenu = document.querySelector('.faq-menu')
const overlay = document.querySelector('.overlay')
const inputText = localStorage.getItem('inputText')

let animationTimer = null

if (inputText) {
    inputQuestion.value = inputText
    if (!askQuestion.classList.contains('move')) {
        askQuestion.classList.add('move')
        animationTimer = setTimeout(() => {
            askQuestion.classList.add('move-end')
        }, 500)
    }
}

inputQuestion.addEventListener('input', (e) => {
    if (inputQuestion.value.length > 0) {
        if (!askQuestion.classList.contains('move')) {
            askQuestion.classList.add('move')
            animationTimer = setTimeout(() => {
                askQuestion.classList.add('move-end')
            }, 500)
        }
    }
    if (inputQuestion.value.length === 0) {
        clearTimeout(animationTimer)
        askQuestion.classList.remove('move')
        askQuestion.classList.remove('move-end')
    }

    let input = e.target.value
    localStorage.setItem('inputText', input)
})

const answerYesNo = document.querySelector('.answer-yn')
const mainText = document.getElementById('text-main')
const starsAnswer = document.querySelectorAll('.answer-star')

askQuestion.addEventListener('click', async () => {
    askQuestion.classList.remove('move')
    askQuestion.classList.remove('move-end')
    mainText.classList.add('hide')
    inputQuestion.readOnly = true
    try {
        const responce = await fetch('https://yesno.wtf/api')
        const data = await responce.json()
        console.log(data)
        
        let answer = data.answer.toUpperCase()
        answerYesNo.textContent = answer

        const preloadImg = new Image()
        await new Promise((resolve) => {
            preloadImg.onload = () => resolve()
            preloadImg.src = data.image
        })

        setTimeout(() => {
            answerYesNo.classList.add('show')
            starsAnswer.forEach(element => {
                element.innerHTML = ''
                element.classList.add('show')
                const gifStar = document.createElement('img')
                gifStar.classList.add('gif-star')
                gifStar.src = data.image
                element.appendChild(gifStar)
            });
        }, 500)
    } catch (err) {
        alert('Connection error!')
        console.log(err)
    } finally {
        setTimeout(() => {
            askQuestion.classList.add('move')
            askQuestion.classList.add('move-end')
            mainText.classList.remove('hide')
            answerYesNo.classList.remove('show')
            starsAnswer.forEach(element => {
                element.classList.remove('show')
            });
            inputQuestion.readOnly = false
        }, 3000)
    }
})

faqBut.addEventListener('click', () => {
    faqMenu.classList.add('show')
    overlay.classList.add('show')
})

overlay.addEventListener('click', () => {
    faqMenu.classList.remove('show')
    overlay.classList.remove('show')
})

const cometsDiv = document.querySelector('.comets')

document.addEventListener('click', (e) => {
    if (!e.target.closest('.header-faq-img-hover') && !e.target.closest('.question')
        && !e.target.closest('.ask') && !e.target.closest('.faq-menu')) {
        const comet = document.createElement('div')
        comet.classList.add('comet')

        const x = e.clientX
        const y = e.clientY

        comet.style.left = x +'px'
        comet.style.top = y + 'px'

        cometsDiv.appendChild(comet)

        setTimeout(() => {
            comet.remove()
        }, 1000)
    }
})

window.addEventListener('resize', () => {
    setTimeout(() => {
        spawnStars()
    }, 200)
})