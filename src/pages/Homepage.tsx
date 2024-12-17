import { useEffect, useState } from "react"
import marty from "../assets/marty.png"
import { RecordAndAnswer } from "../components/RecordAndAnswer"

export function Homepage() {

  const [martyClicked, setMartyClicked] = useState("What is ... ?")

  const financeTerms = ['debt', 'budget', 'credit', 'interest', 'assets', 'inflation', 'taxes']
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

  useEffect(() => {
    if (defineThisTerm === 'No Term Yet') {
      return
    } else {
      let martyQuestion = new SpeechSynthesisUtterance(`Marty here. In the context of finances, can you give a short definition or example for ${defineThisTerm}?`)
      speechSynthesis.speak(martyQuestion)
      setMartyClicked(`What is ${defineThisTerm}?`)
      console.log(defineThisTerm)
    }
  }, [defineThisTerm])

  return (
    <div className="main-container">

      <div className="image-container">
        <img
          src={marty}
          alt="Marty Logo"
          className="marty-logo"
          onClick={clickedOnMarty}
        />
      </div>

      <div className="marty-text-container">
        <p className="marty-text marty-title">Marty the <span className="marty-yellow">SMARTI</span></p>
        <p className="marty-text marty-subtitle">(<span className="marty-yellow">S</span>uper <span className="marty-yellow">M</span>ighty <span className="marty-yellow">ART</span>ificial <span className="marty-yellow">I</span>ntelligence)</p>
        <p className="marty-text marty-question-text">Question:</p>
        <p className="marty-text marty-question-text">{martyClicked}</p>
      </div>

      <RecordAndAnswer defineThisTerm={defineThisTerm} />

    </div>

  )
}