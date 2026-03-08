import { Routes, Route } from "react-router-dom"
import HomePage from "./pages/Homepage.jsx"
import MangaDetail from "./pages/MangaDetail.jsx"
import "./App.css"

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/mangas/:id" element={<MangaDetail />} />
    </Routes>
  )
}

export default App