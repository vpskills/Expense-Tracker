import Calendar from './components/Calendar'
import ExpenseTracker from './components/ExpenseTracker'
import Home from './Pages/Home'
import { Outlet } from 'react-router-dom'

function App() {
  return (
      // <ExpenseTracker/>
      <div className='bg-neutral-900 min-h-svh'>
        <Outlet/>
      </div>
  )
}

export default App
