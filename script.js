let root = document.querySelector("#root"),
   note = document.querySelector("#note"),
   p1 = document.querySelector("#player1Box"),
   p2 = document.querySelector("#player2Box"),
   btnBox = document.getElementById("btn-box"),
   boardArr = ["🐵", "🐶", "🐺", "🐱", "🦁", "🐯", "🦒",
      "🦊", "🐻", "🐰", "🐹", "🐭", "🐗", "🐷", "🐮", "🦝",
      "🐨", "🐼", "🐸", "🦓", "🐴", "🦄", "🐔", "🐲"],
   cardsNum = boardArr.length - 1,
   currBoardArr = boardArr.slice(0, cardsNum).concat(boardArr.slice(0, cardsNum)),
   Player1 = { name: "", score: 0, totalScore: 0 },
   Player2 = { name: "", score: 0, totalScore: 0 },
   currPlay = [],
   middlePlay = false,
   currPlayer = Player1,
   rollAnimateArr = ['animate__rotateInDownLeft', "animate__rotateInDownRight", "animate__rotateInUpLeft", "animate__rotateInUpRight"]

// the main function on click card
function onClickCard(e) {
   let pos = Number(e.target.id.replace("b", ""))

   if (currPlay.includes(pos) || middlePlay || currBoardArr[pos] == "?") return;

   currPlay.push(pos)
   deleteAnimate(e.target)
   e.target.offsetWidth
   e.target.classList.add("animate__flip")
   e.target.innerHTML = currBoardArr[pos]

   if (currPlay.length == 2) {
      middlePlay = true
      checkWins()
      setTimeout(resetPlay, 3000);
   }

   if (!currBoardArr.find((v) => v != "?")) printWin()
}

// reset the last move
function resetPlay() {
   document.getElementById(`b${currPlay[0]}`).innerText = ""
   document.getElementById(`b${currPlay[1]}`).innerText = ""
   currPlay = []
   middlePlay = false
}

// reset the game
function reset() {
   currBoardArr = boardArr.slice(0, cardsNum).concat(boardArr.slice(0, cardsNum))
   currPlay = []
   Player1.score = 0
   Player2.score = 0
   currPlayer = Player1;
   firstPrint()
}

// in the end of the game print the winner
function printWin() {
   let winner = {}

   if (Player1.score === Player2.score) {
      winner.name = "no one"
   } else {
      winner = Player1.score > Player2.score ? Player1 : Player2
      winner.totalScore++
   }

   note.classList.add("popUp")
   note.innerHTML = winner.name + ` is the winner`
   setTimeout(reset, 4000);
}

// remove old animation from elements
function deleteAnimate(element) {
   element.classList.remove(...rollAnimateArr, "animate__flip")
   return element
}

// check if the player filp two cards that is the same
function checkWins() {
   if (currBoardArr[currPlay[0]] == currBoardArr[currPlay[1]]) {
      Array.from(Array(2)).forEach((x, i) => {
         let card = document.getElementById(`b${currPlay[i]}`)
         deleteAnimate(card).classList.add("animate__heartBeat", "bg-warning")
         setTimeout(() => card.classList.add("gone"), 3000);

         currBoardArr = currBoardArr.map((c) => c == currBoardArr[currPlay[i]] ? "?" : c)
      })

      currPlayer.score++
   } else {
      currPlayer = currPlayer == Player1 ? Player2 : Player1
   }
   printPlayers()
}

// reset the page
function cleanPage() {
   root.innerHTML = ""
   note.innerHTML = ""
   note.className = ""
}

// print the page
function print(first) {
   middlePlay = false
   cleanPage()
   printPlayers()

   currBoardArr.forEach((x, i) => {
      const contain = document.createElement("div")
      contain.classList.add("p-2", `${currBoardArr.length <= 16 ? "p-md-4" : "p-md-2"}`, `${currBoardArr.length <= 16 ? "col-3" : "col-2"}`)

      const div = document.createElement("div")
      div.classList.add("card", "d-flex", "justify-content-center", "align-items-center", "bg-success", "animate__animated", `${first ? rollAnimateArr[Math.floor(Math.random() * rollAnimateArr.length)] : ""}`)
      div.id = `b${i}`
      div.addEventListener("click", onClickCard)

      contain.append(div)
      root.append(contain)
   })
}

// print the players with they score
function printPlayers() {
   const prop = { Player1, Player2, p1, p2 }

   Array.from(Array(2)).forEach((x, i) => {
      prop[`p${i + 1}`].innerHTML = ""

      const h2 = document.createElement("h2")
      h2.className = (`${currPlayer == prop[`Player${i + 1}`] ? "text-success fw-bold" : "text-muted"}`)
      h2.innerText = prop[`Player${i + 1}`].name

      const p = document.createElement("p")
      p.innerText = "score: " + prop[`Player${i + 1}`].score

      const p2 = document.createElement("p")
      p2.innerText = "total score: " + prop[`Player${i + 1}`].totalScore

      prop[`p${i + 1}`].append(h2, p, p2)
   })
}

// suffle the cards at the first run
function firstPrint() {
   currBoardArr.sort(() => Math.random() - 0.5)
   addButtons()
   print(true)
}

// add the btns
function addButtons() {
   const btn = document.createElement("button")
   btn.innerText = "reset"
   btn.classList.add("btn", "btn-danger")
   btn.addEventListener("click", firstPrint)
   btnBox.innerHTML = ""
   btnBox.appendChild(btn)
}

// on submit the names of the players
function submitNames(e) {
   e.preventDefault()
   Player1.name = document.getElementById(`input0`).value
   Player2.name = document.getElementById(`input1`).value

   cardsNum = Number(document.getElementById(`numBoard`).value) || cardsNum
   currBoardArr = boardArr.slice(0, cardsNum).concat(boardArr.slice(0, cardsNum))

   firstPrint()
}

// print the form to get the players name
function formPrint() {
   const form = document.createElement("form")
   form.className = "p-0 p-md-4 d-flex gap-4 flex-column w-75 m-auto mt-5"
   form.addEventListener("submit", submitNames)

   const h1 = document.createElement("h1")
   h1.innerText = "Let's get to know you"
   h1.className = "text-light m-auto"

   let inputs = Array.from(Array(2)).map((x, i) => {
      const inputName = document.createElement("input")
      inputName.className = "form-control"
      inputName.id = `input${i}`
      inputName.required = true
      inputName.placeholder = `Player ${i + 1} Name...`
      return inputName
   })

   let numInput = document.createElement("input")
   numInput.className = "form-control"
   numInput.type = "number"
   numInput.min = 2
   numInput.max = boardArr.length
   numInput.id = "numBoard"

   let label = document.createElement("label")
   label.for = "numBoard"
   label.innerText = "number of cards"

   const button = document.createElement("button")
   button.type = "submit"
   button.innerText = "start the game"
   button.className = "btn btn-success w-50 w-md-25 m-auto"

   form.append(h1, ...inputs, label, numInput, button)
   root.append(form)
}


window.onload = formPrint
// const shuffle = (arr) => arr.sort(() => Math.random() - 0.5)