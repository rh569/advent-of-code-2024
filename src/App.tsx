import './App.css'
import { DayInput } from './components/DayInput'
import { DAYS } from './days'

function App() {
  return (
    <>
      <h1>
        ⭐️
        <a href="https://adventofcode.com/2024" target="_blank">
          Advent of Code (2024)
        </a>
      </h1>

      <DayInput days={DAYS} />
    </>
  )
}

export default App
