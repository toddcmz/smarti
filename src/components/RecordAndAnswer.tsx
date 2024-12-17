import { useEffect, useState } from "react"
import useSpeechRecognition from "../hooks/useSpeechRecognitionHook"
import axios from "axios"

type Props = {
  defineThisTerm: string
}

export function RecordAndAnswer({ defineThisTerm }: Props) {


  const {
    textRecorded,
    startListening,
    stopListening,
    currentlyListening,
    hasRecognitionSupport
  } = useSpeechRecognition()

  const [checkAnswerResult, setCheckAnswerResult] = useState("Waiting for a Recording")
  const letMeIn = import.meta.env.VITE_APP_ACCESS_DEMO_API

  const [showInteractionDetails, setShowInteractionDetails] = useState(false)

  function showHideDetails() {
    setShowInteractionDetails(!showInteractionDetails)
  }

  useEffect(() => {
    let tempContent = checkAnswerResult.slice(0, 2).toLowerCase()
    if (checkAnswerResult === "Waiting for a Recording" ||
      defineThisTerm === "No Term Yet" ||
      textRecorded === "No Recording Yet"
    ) {
      return
    } else if (tempContent === "ye") {

      let martyAnswer = new SpeechSynthesisUtterance("You are so right! Pick a smarty card to see what you've won.")
      speechSynthesis.speak(martyAnswer)

    } else {

      let martyAnswer = new SpeechSynthesisUtterance("Oopsy, Marty thinks that wasn't quite right. Better luck next time.")
      speechSynthesis.speak(martyAnswer)

    }
  }, [checkAnswerResult])

  const promptChatGpt = async () => {
    if (defineThisTerm === "No Term Yet") {
      setCheckAnswerResult("No question asked, yet. Click my picture to get a question, then record an answer.")
      return
    } else if (textRecorded === "No Recording Yet") {
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

            {currentlyListening ?
              <div className="outer-button-ring">
                <div className="inner-button-ring">
                  <button
                    className="button stop-record-button"
                    onClick={stopListening}
                  >
                    <p className="button-label">Stop<br />Recording</p>
                  </button>
                </div>
              </div>

              :
              <div className="outer-button-ring">
                <div className="inner-button-ring">
                  <button
                    className="button record-button"
                    onClick={startListening}
                  >
                    <p className="button-label">
                      <span className="lg-button-text">
                        Record
                      </span>
                      <br />
                      your
                      <br />
                      <span className="lg-button-text">
                        Answer
                      </span>
                    </p>
                  </button>
                </div>
              </div>

            }

            <div className="outer-button-ring">
              <div className="inner-button-ring">
                <button
                  className="button send-answer-button"
                  onClick={promptChatGpt}
                >
                  <p className="button-label">
                    <span className="lg-button-text">
                      Send
                    </span>
                    <br />
                    your
                    <br />
                    <span className="lg-button-text">
                      Answer
                    </span>
                  </p>
                </button>
              </div>
            </div>


          </>
        ) : (
          <p>
            Your browser does not support speech recognition. 
            <br />
            All modern browsers except Firefox are currently supported. 
          </p>
        )}

        <div
          className="show-interaction-details"
          onClick={showHideDetails}
        >
          <p>Show/Hide Details</p>
        </div>

        {showInteractionDetails ?
          <div className="interaction-details-container">
            {currentlyListening ?
              <p>Status: Recording Your Answer...</p>
              :
              <p>Status: Not Currently Recording</p>
            }
            <br />
            <p>What I Heard: {textRecorded}</p>
            <br />
            <p>Marty Says: {checkAnswerResult}</p>
          </div>
          :
          <></>
        }

      </div>
    </div>


  )
}