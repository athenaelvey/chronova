import { Routes, Route, Link } from 'react-router-dom'
import LandingPage from './LandingPage'
import ExplorePage from './ExplorePage'
import ComparePage from './ComparePage'

function App() {

  return (
    <>
      <nav>
        <Link to="/explore">Explore</Link>{' '}
        <Link to="/compare">Compare</Link>
      </nav>

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/compare" element={<ComparePage />} />
      </Routes>
    </>
  )
}

export default App
