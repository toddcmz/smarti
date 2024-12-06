import { useState } from "react"
import useSpeechRecognition from "../hooks/useSpeechRecognitionHook"
import axios from "axios"

export function RecordAndAnswer() {

  const {
    textRecorded,
    startListening,
    stopListening,
    currentlyListening,
    hasRecognitionSupport
  } = useSpeechRecognition()

  const [checkAnswerResult, setCheckAnswerResult] = useState("Waiting for a Recording")
  const letMeIn = import.meta.env.VITE_APP_ACCESS_DEMO_API

  const promptChatGpt = async () => {
    try {
      const apiUrl = "https://api.openai.com/v1/chat/completions"
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${letMeIn}`
      };

      const requestBody = {
        model: "gpt-4o-mini",
        messages: [{ role: 'user', content: `Yes or no, is '${textRecorded}' a reasonable general definition or example of debt?
          After saying yes or no, provide a short, one-sentence explanation.` }]
      };

      const { data } = await axios.post(apiUrl, requestBody, { headers })

      setCheckAnswerResult(data.choices[0].message.content)
    } catch (error) {
      console.error('Error sending message: ', error)
    }
  }

  return (

    <div className="recording-results">
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


  )
}