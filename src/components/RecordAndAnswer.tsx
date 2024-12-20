import { useEffect, useState } from "react"
import useSpeechRecognition from "../hooks/useSpeechRecognitionHook"
import axios from "axios"
import correctEnding from "../assets/audio/correctEnding.mp3"
import assetsIncorrect from "../assets/audio/assetsIncorrect.mp3"
import budgetIncorrect from "../assets/audio/budgetIncorrect.mp3"
import debtIncorrect from "../assets/audio/debtIncorrect.mp3"

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

  function playCorrectEnding() {
    let endingAudio = new Audio(correctEnding)
    endingAudio.play()
  }

  function playWrongEnding() {

    if (defineThisTerm == "assets") {
      let endingAnswer = new Audio(assetsIncorrect)
      endingAnswer.play()
    }
    if (defineThisTerm == "budget") {
      let endingAnswer = new Audio(budgetIncorrect)
      endingAnswer.play()
    }
    if (defineThisTerm == "debt") {
      let endingAnswer = new Audio(debtIncorrect)
      endingAnswer.play()
    }
  }

  useEffect(() => {
    let tempContent = checkAnswerResult.slice(0, 2).toLowerCase()
    if (checkAnswerResult === "Waiting for a Recording" ||
      checkAnswerResult === "Heard Nothing" ||
      defineThisTerm === "No Term Yet" ||
      textRecorded === "No Recording Yet"
    ) {
      return
    } else if (tempContent === "ye") {

      playCorrectEnding()

    } else {

      playWrongEnding()

    }
  }, [checkAnswerResult])

  const promptChatGpt = async () => {
    if (defineThisTerm === "No Term Yet") {
      setCheckAnswerResult("No question asked, yet. Click or tap 'Call Marty' to get a question, then record an answer.")
      return
    } else if (textRecorded === "No Recording Yet") {
      setCheckAnswerResult("No answer recorded, yet.")
      return
    } else if (textRecorded === "" || textRecorded === null) {
      setCheckAnswerResult("Heard Nothing")
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
                      <span className="sm-button-text">
                        your
                      </span>
                      <br />
                      <span className="lg-button-text">
                        Answer
                      </span>
                    </p>
                  </button>
                </div>
              </div>

            }
            {checkAnswerResult === "Heard Nothing" ?
              <div className="recording-error">
                <p>Nothing recorded. Try again,
                  <br />
                  or check mic is enabled.</p>
              </div>
              :
              <></>
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
                    <span className="sm-button-text">
                      your
                    </span>
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