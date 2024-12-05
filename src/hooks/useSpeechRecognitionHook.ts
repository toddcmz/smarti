import { useEffect, useState } from "react";

let recordSpeech:any = null;
if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window){
  let recognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition
  recordSpeech = new recognitionConstructor();
  recordSpeech.continuous = true;
  recordSpeech.lang = "en-US";
}

const useSpeechRecognition = () => {

  const [textRecorded, setTextRecorded] = useState("");
  const [currentlyListening, setCurrentlyListening] = useState(false);

  useEffect(() =>{
    if (!recordSpeech) return;
    
    recordSpeech.onresult = (event: SpeechRecognitionEvent) => {
      console.log("onresult event from custom hook: ", event)
      setTextRecorded(event.results[0][0].transcript)
      recordSpeech.stop()
      setCurrentlyListening(false) 
    }
  }, [])

  const startListening = () => {
    setTextRecorded("")
    setCurrentlyListening(true)
    recordSpeech.start()
  };

  const stopListening = () => {
    setCurrentlyListening(false)
    recordSpeech.stop()
  };

  return{
    textRecorded,
    currentlyListening,
    startListening,
    stopListening,
    hasRecognitionSupport: !!recordSpeech
  }

};

export default useSpeechRecognition;
