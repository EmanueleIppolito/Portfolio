import { Link } from "react-router-dom"
import { API_BASE_URL } from "../config/api.js"

function MangaCard({ manga }) {
  const coverSrc = manga.cover?.startsWith("http")
    ? manga.cover
    : `${API_BASE_URL}${manga.cover}`

  return (
    <Link to={`/mangas/${manga.id}`} className="manga-card-link">
      <div className="manga-card">
        <img src={coverSrc} alt={manga.title} />

        <div className="manga-card-content">
          <h3>{manga.title}</h3>
            <div><p>Autore: {manga.author}</p></div>
            <div><p>{manga.isOnGoing ? "In corso" : "Concluso"}</p></div>
        </div>
      </div>
    </Link>
  )
}

export default MangaCard