import { useEffect, useState } from "react"
import { API_BASE_URL } from "../config/api.js"

function useMangas() {
  const [mangas, setMangas] = useState([])

  useEffect(() => {
    fetch(`${API_BASE_URL}/mangas`)
      .then(res => res.json())
      .then(data => {
        console.log(data)
        setMangas(data)
      })
      .catch(error => console.error(error))
  }, [])

  const addManga = (newManga) => {
    setMangas(prev => [...prev, newManga])
  }

  return {
    mangas,
    addManga
  }
}

export default useMangas