import { useState } from "react"
import marty from "../assets/marty.png"
import { RecordAndAnswer } from "../components/RecordAndAnswer"

export function Homepage() {

  const [martyClicked, setMartyClicked] = useState("Click My Picture to Hear a Question")

  const clickedOnMarty = () => {
    let martyQuestion = new SpeechSynthesisUtterance("Marty here. In a sentence or two, what is debt?")
    speechSynthesis.speak(martyQuestion)
    setMartyClicked("In a sentence or two, what is debt?")
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
      
      <div className="buttons-container">
        <RecordAndAnswer />
      </div>
    </div>

  )
}