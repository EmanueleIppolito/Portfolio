import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import Header from "../components/Header.jsx"
import Footer from "../components/Footer.jsx"
import { API_BASE_URL } from "../config/api.js"
import formatDate from "../utils/formatDate.js"

function MangaDetail() {
    const { id } = useParams()
    const [manga, setManga] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchManga = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/mangas/${id}`)

                if (!response.ok) {
                    throw new Error("Manga non trovato")
                }

                const data = await response.json()
                setManga(data)
            } catch (error) {
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        fetchManga()
    }, [id])

    const coverSrc = manga?.cover?.startsWith("http")
        ? manga.cover
        : manga?.cover
            ? `${API_BASE_URL}${manga.cover}`
            : ""

    return (
        <>
            <div className="page-wrapper">
                <Header
                    search=""
                    setSearch={() => { }}
                    filters={{ isOnGoing: false, isFinished: false }}
                    setFilters={() => { }}
                    onOpenModal={() => { }}
                />

                <main className="detail-page">
                    <Link to="/" className="back-link">← Torna alla home</Link>

                    {loading && <p>Caricamento...</p>}
                    {error && <p>{error}</p>}

                    {manga && (
                        <div className="detail-card">
                            <img className="detail-cover" src={coverSrc} alt={manga.title} />

                            <div className="detail-info">
                                <h1>{manga.title}</h1>
                                <p><strong>Titolo originale:</strong> {manga.originalTitle}</p>
                                <p><strong>Autore:</strong> {manga.author}</p>
                                <p><strong>Editore:</strong> {manga.publisher}</p>
                                <p><strong>Volumi:</strong> {manga.volumes}</p>
                                <p><strong>Data pubblicazione:</strong> {formatDate(manga.publishDate)}</p>
                                <p><strong>Stato:</strong> {manga.isOnGoing ? "In corso" : "Concluso"}</p>

                                {manga.genre?.length > 0 && (
                                    <p><strong>Generi:</strong> {manga.genre.join(", ")}</p>
                                )}

                                {manga.tag?.length > 0 && (
                                    <p><strong>Tag:</strong> {manga.tag.join(", ")}</p>
                                )}
                                <div className="space-20"></div>
                                <h2>Trama</h2>
                                <p>{manga.plot}</p>
                            </div>
                        </div>
                    )}
                </main>

                <Footer />
            </div>
        </>
    )
}

export default MangaDetail