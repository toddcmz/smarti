import { useState } from "react"
import marty from "../assets/marty.png"
import { RecordAndAnswer } from "../components/RecordAndAnswer"

export function Homepage() {

  const [martyClicked, setMartyClicked] = useState("Click or Tap My Picture to Hear a Question")

  const financeTerms = ['debt', 'budget', 'credit', 'interest', 'assets', 'inflation', 'taxes']
  const [defineThisTerm, setDefineThisTerm] = useState('debt')

  const chooseTerm = () => {
    let thisTermIndex = Math.floor(Math.random() * (financeTerms.length - 1))
    setDefineThisTerm(financeTerms[thisTermIndex])
  }

  const clickedOnMarty = () => {
    chooseTerm()
    let martyQuestion = new SpeechSynthesisUtterance(`Marty here. In the context of finances, can you give a short definition or example for ${defineThisTerm}?`)
    speechSynthesis.speak(martyQuestion)
    setMartyClicked(`In a sentence or two, define or provide and example for ${defineThisTerm}.`)
  }

  return (
    <div className="main-container">

      <div className="image-container">
        <img 
          src={marty} 
          alt="Marty Logo" 
          className="marty-logo"
          onClick={clickedOnMarty} 
        />
        <h3 className="marty-greeting"> Hi, I'm Marty the Smarti</h3>
        <h4 className="marty-subtext">{martyClicked}</h4>
      </div>
      
      <RecordAndAnswer defineThisTerm={defineThisTerm}/>
      
    </div>

  )
}