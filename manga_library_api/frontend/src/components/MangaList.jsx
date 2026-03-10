import MangaCard from "./MangaCard.jsx"

function MangaList({ mangas }) {
	return (
		<div className="manga-list">
			{mangas.map(manga => (
				<MangaCard key={manga.id} manga={manga} />
			))}
		</div>
	)
}

export default MangaList