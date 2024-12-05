import marty from "../assets/marty.png"
import { RecordButton } from "../components/RecordButton"

export function Homepage() {
  return(
    <div className="main-container">
      <img src={marty} alt="" className="marty-logo" />
      <RecordButton/>
    </div>
      
  )
}