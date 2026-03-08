import { useState } from "react"
import Header from "../components/Header.jsx"
import AddMangaModal from "../components/AddMangaModal.jsx"
import MangaList from "../components/MangaList.jsx"
import Footer from "../components/Footer.jsx"
import useMangas from "../hooks/useMangas.js"
import filterMangas from "../utils/filterMangas.js"

function HomePage() {
    const { mangas, addManga } = useMangas()

    const [search, setSearch] = useState("")
    const [filters, setFilters] = useState({
        isOnGoing: false,
        isFinished: false
    })
    const [showModal, setShowModal] = useState(false)

    const filteredMangas = filterMangas(mangas, search, filters)

    return (
        <>
            <div className="page-wrapper">
                <Header
                    search={search}
                    setSearch={setSearch}
                    filters={filters}
                    setFilters={setFilters}
                    onOpenModal={() => setShowModal(true)}
                />

                <AddMangaModal
                    showModal={showModal}
                    setShowModal={setShowModal}
                    onMangaAdded={addManga}
                />

                <h1>MangAPI</h1>
                <p>Manga presenti: {filteredMangas.length}</p>

                <MangaList mangas={filteredMangas} />

                <Footer />
            </div>
        </>
    )
}

export default HomePage