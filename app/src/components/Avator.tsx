import { Voice } from "./Voice"

export const Avator = () => {
  return (
    <div className="flex flex-col h-screen">
      <img src='AIhayashi.png' className="self-center" />
      <div className="flex items-center justify-center flex-grow">
        <Voice />      
      </div>
    </div>
  )
}
