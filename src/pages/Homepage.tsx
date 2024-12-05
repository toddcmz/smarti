import marty from "../assets/marty.png"
import { Record } from "../components/Record"
import { SendAnswer } from "../components/SendAnswer"

export function Homepage() {
  return (
    <div className="main-container">
      <img src={marty} alt="" className="marty-logo" />
      <div className="buttons-container">
        <Record />
        <SendAnswer />
      </div>
    </div>

  )
}