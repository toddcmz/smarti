import { useEffect, useState } from "react"
import marty from "../assets/marty.png"
import callIcon from "../assets/callIcon.png"
import { RecordAndAnswer } from "../components/RecordAndAnswer"
import martyGreeting from "../assets/audio/martyGreeting.mp3"
import assetsQuestion from "../assets/audio/assetsQuestion.mp3"
import budgetQuestion from "../assets/audio/budgetQuestion.mp3"
import debtQuestion from "../assets/audio/debtQuestion.mp3"
import recordSendInstructions from "../assets/audio/recordSendInstructions.mp3"

export function Homepage() {

  const [martyClicked, setMartyClicked] = useState("notClicked")

  const financeTerms = ['debt', 'budget', 'assets']
  const [defineThisTerm, setDefineThisTerm] = useState('No Term Yet')

  function clickedOnMarty() {
    let thisTermIndex = Math.floor(Math.random() * (financeTerms.length - 1))
    if (defineThisTerm === financeTerms[thisTermIndex]) {
      if (thisTermIndex === (financeTerms.length - 1)) {
        setDefineThisTerm(financeTerms[thisTermIndex - 1])
      } else {
        setDefineThisTerm(financeTerms[thisTermIndex + 1])
      } // end handling don't pick same term twice, and don't pick next term if at end of array
    } else {
      setDefineThisTerm(financeTerms[thisTermIndex])
    }
    console.log(thisTermIndex)
  }

  function playInitialAudio(){
    let playGreeting = new Audio(martyGreeting)
      playGreeting.play()

      if (defineThisTerm === "assets") {
        setTimeout(() => {
          let audioQuestion = new Audio(assetsQuestion)
          audioQuestion.play()
        }, 7500)
      }
      if (defineThisTerm === "budget") {
        setTimeout(() => {
          let audioQuestion = new Audio(budgetQuestion)
          audioQuestion.play()
        }, 7500)
      }
      if (defineThisTerm === "debt") {
        setTimeout(() => {
          let audioQuestion = new Audio(debtQuestion)
          audioQuestion.play()
        }, 7500)
      }

      setTimeout(() => {
        let audioInstructions = new Audio(recordSendInstructions)
        audioInstructions.play()
      }, 12000)
  }

  useEffect(() => {
    if (defineThisTerm === 'No Term Yet') {
      return
    } else {

      if (defineThisTerm === "assets") {
        setMartyClicked(`What are ${defineThisTerm}?`)
      } else {
        setMartyClicked(`What is ${defineThisTerm}?`)
      }

      playInitialAudio()

    }
  }, [defineThisTerm])

  return (
    <div className="main-container">

      {martyClicked === "notClicked" ?
        <div
          className="call-marty"
          onClick={clickedOnMarty}
        >
          <p className="call-text">CALL</p>
          <img src={callIcon} alt="phone icon" className="call-icon" />
          <p className="call-text">MARTY</p>
        </div>
        :
        <div className="image-container">
          <img
            src={marty}
            alt="Marty Logo"
            className="marty-logo"
            onClick={clickedOnMarty}
          />
        </div>
      }

      {martyClicked === "notClicked" ?
        <></>
        :
        <div className="marty-text-container">
          <p className="marty-text marty-title">Marty the <span className="marty-yellow">SMARTI</span></p>
          <p className="marty-text marty-subtitle">(<span className="marty-yellow">S</span>uper <span className="marty-yellow">M</span>ighty <span className="marty-yellow">ART</span>ificial <span className="marty-yellow">I</span>ntelligence)</p>
          <br />
          <p className="marty-text marty-question-text">Question:</p>
          <p className="marty-text marty-question-text">{martyClicked}</p>
        </div>
      }

      {martyClicked === "notClicked" ?
        <></>
        :
        <RecordAndAnswer defineThisTerm={defineThisTerm} />
      }


    </div>

  )
}