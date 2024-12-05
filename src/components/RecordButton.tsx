import useSpeechRecognition from "../hooks/useSpeechRecognitionHook"

export function RecordButton() {

  const {
    textRecorded,
    startListening,
    stopListening,
    currentlyListening,
    hasRecognitionSupport
  } = useSpeechRecognition()

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
          <button
            className="button stop-record-button"
            onClick={stopListening}
          >
            Stop Recording
          </button>
          {currentlyListening ? <div className="currently-listening-note">Recording your answer...</div> : null}
          {textRecorded}
        </>
      ) : (
        <p>Your browser does not support speech recognition. All modern browsers except Firefox are currently supported. </p>
      )}
    </div>


  )
}