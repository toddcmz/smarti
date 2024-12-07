import { useEffect, useState } from "react"
import useSpeechRecognition from "../hooks/useSpeechRecognitionHook"
import axios from "axios"

type Props = {
  defineThisTerm: string
}

export function RecordAndAnswer({defineThisTerm}:Props) {


  const {
    textRecorded,
    startListening,
    stopListening,
    currentlyListening,
    hasRecognitionSupport
  } = useSpeechRecognition()

  const [checkAnswerResult, setCheckAnswerResult] = useState("Waiting for a Recording")
  const letMeIn = import.meta.env.VITE_APP_ACCESS_DEMO_API

  const [powerAwarded, setPowerAwarded] = useState("Check your recording to see what you get!")

  useEffect (()=> {
    let tempContent = checkAnswerResult.slice(0,2).toLowerCase()
    if (checkAnswerResult === "Waiting for a Recording" ||
      defineThisTerm === "No Term Yet" ||
      textRecorded === "No Recording Yet"
    ){
      return
    }else if(tempContent === "ye"){
      setPowerAwarded("Congratulations. Marti thinks you're right. Take a free move.")
    }else{
      setPowerAwarded("Sorry, Marti didn't like your answer. No bonus awarded.")
    }
  },[checkAnswerResult])

  const promptChatGpt = async () => {
    if(defineThisTerm==="No Term Yet"){
      setCheckAnswerResult("No question asked, yet. Click my picture to get a question, then record an answer.")
      return
    }else if(textRecorded === "No Recording Yet"){
      setCheckAnswerResult("No answer recorded, yet. Record an answer to have me check it.")
      return
    }
    try {
      const apiUrl = "https://api.openai.com/v1/chat/completions"
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${letMeIn}`
      };

      const requestBody = {
        model: "gpt-4o-mini",
        messages: [{
          role: 'user', content: `Yes or no, is '${textRecorded}' a reasonable general definition or example for ${defineThisTerm}?
          After saying yes or no, provide a short, one-sentence explanation.` }]
      };

      const { data } = await axios.post(apiUrl, requestBody, { headers })

      setCheckAnswerResult(data.choices[0].message.content)
    } catch (error) {
      console.error('Error sending message: ', error)
    }
  }

  return (
    <div className="recording-and-reward-container">
      <div className="buttons-container">
        {hasRecognitionSupport ? (
          <>

            <button
              className="button record-button"
              onClick={startListening}
            >
              Record Answer
            </button>

            {currentlyListening ?
              <p className="currently-recording-status">Status: Recording Your Answer...</p>
              :
              <p className="currently-recording-status">Status: Not Currently Recording</p>
            }

            <button
              className="button stop-record-button"
              onClick={stopListening}
            >
              Stop Recording
            </button>
            <p className="recorded-text">What I Heard: {textRecorded}</p>

            <button
              className="button send-answer-button"
              onClick={promptChatGpt}
            >Check Answer</button>
            <p className="check-answer-status">Marty Says: {checkAnswerResult}</p>
          </>
        ) : (
          <p>Your browser does not support speech recognition. All modern browsers except Firefox are currently supported. </p>
        )}
      </div>
      <div className="reward-container">
        <h2>Game Bonus:</h2>
        <br />
        <h3 className="reward">{powerAwarded}</h3>
      </div>
    </div>


  )
}