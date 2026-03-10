import { useState } from "react"
import { API_BASE_URL } from "../config/api.js"

function AddMangaModal({ showModal, setShowModal, onMangaAdded }) {
	const [formData, setFormData] = useState({
		title: "",
		originalTitle: "",
		author: "",
		cover: "",
		isOnGoing: false,
		plot: "",
		volumes: "",
		publishDate: "",
		publisher: "",
		genre: "",
		tag: ""
	})

	const [coverFile, setCoverFile] = useState(null)

	if (!showModal) return null

	const handleFormField = (field, value) => {
		setFormData(prev => ({
			...prev,
			[field]: value
		}))
	}

	const resetForm = () => {
		setFormData({
			title: "",
			originalTitle: "",
			author: "",
			cover: "",
			isOnGoing: false,
			plot: "",
			volumes: "",
			publishDate: "",
			publisher: "",
			genre: "",
			tag: ""
		})
		setCoverFile(null)
	}

	const handleSubmit = async (e) => {
		e.preventDefault()

		try {
			let response

			if (coverFile) {
				const multipartData = new FormData()

				multipartData.append("title", formData.title)
				multipartData.append("originalTitle", formData.originalTitle)
				multipartData.append("author", formData.author)
				multipartData.append("publisher", formData.publisher)
				multipartData.append("volumes", formData.volumes)
				multipartData.append("publishDate", formData.publishDate)
				multipartData.append("plot", formData.plot)
				multipartData.append("isOnGoing", formData.isOnGoing ? 1 : 0)
				multipartData.append("cover", coverFile)

				const genreArray = formData.genre
					.split(",")
					.map(item => item.trim())
					.filter(item => item !== "")

				const tagArray = formData.tag
					.split(",")
					.map(item => item.trim())
					.filter(item => item !== "")

				genreArray.forEach(singleGenre => {
					multipartData.append("genre", singleGenre)
				})

				tagArray.forEach(singleTag => {
					multipartData.append("tag", singleTag)
				})

				response = await fetch(`${API_BASE_URL}/mangas`, {
					method: "POST",
					body: multipartData
				})
			} else {
				const mangaData = {
					title: formData.title,
					originalTitle: formData.originalTitle,
					author: formData.author,
					publisher: formData.publisher,
					volumes: formData.volumes,
					publishDate: formData.publishDate,
					plot: formData.plot,
					isOnGoing: formData.isOnGoing,
					cover: formData.cover,
					genre: formData.genre
						.split(",")
						.map(item => item.trim())
						.filter(item => item !== ""),
					tag: formData.tag
						.split(",")
						.map(item => item.trim())
						.filter(item => item !== "")
				}

				response = await fetch(`${API_BASE_URL}/mangas`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify(mangaData)
				})
			}

			const result = await response.json()
			console.log("STATUS:", response.status)
			console.log("RISPOSTA BACKEND:", result)

			if (!response.ok) {
				throw new Error(result.message || "Errore durante il salvataggio del manga")
			}

			onMangaAdded(result.manga || result)
			resetForm()
			setShowModal(false)
		} catch (error) {
			console.error("Errore submit:", error)
		}
	}

	return (
		<div className="modal-overlay">
			<div className="modal">
				<h2>Aggiungi Manga</h2>

				<form onSubmit={handleSubmit}>
					<input
						type="text"
						placeholder="Titolo"
						value={formData.title}
						onChange={(e) => handleFormField("title", e.target.value)}
						required
					/>

					<input
						type="text"
						placeholder="Titolo originale"
						value={formData.originalTitle}
						onChange={(e) => handleFormField("originalTitle", e.target.value)}
					/>

					<input
						type="text"
						placeholder="Autore"
						value={formData.author}
						onChange={(e) => handleFormField("author", e.target.value)}
						required
					/>

					<input
						type="text"
						placeholder="Editore"
						value={formData.publisher}
						onChange={(e) => handleFormField("publisher", e.target.value)}
					/>

					<input
						type="number"
						placeholder="Volumi"
						value={formData.volumes}
						onChange={(e) => handleFormField("volumes", e.target.value)}
					/>

					<input
						type="date"
						value={formData.publishDate}
						onChange={(e) => handleFormField("publishDate", e.target.value)}
					/>

					<textarea
						placeholder="Trama"
						value={formData.plot}
						onChange={(e) => handleFormField("plot", e.target.value)}
					/>

					<input
						type="text"
						placeholder="Generi separati da virgola"
						value={formData.genre}
						onChange={(e) => handleFormField("genre", e.target.value)}
					/>

					<input
						type="text"
						placeholder="Tag separati da virgola"
						value={formData.tag}
						onChange={(e) => handleFormField("tag", e.target.value)}
					/>

					<input
						type="text"
						placeholder="Link immagine o /covers/nomefile.jpg"
						value={formData.cover}
						onChange={(e) => handleFormField("cover", e.target.value)}
						disabled={coverFile !== null}
					/>

					<input
						type="file"
						accept="image/*"
						onChange={(e) => setCoverFile(e.target.files[0])}
						disabled={formData.cover.trim() !== ""}
					/>

					{coverFile && <p>File selezionato: {coverFile.name}</p>}

					<label>
						<input
							type="checkbox"
							checked={formData.isOnGoing}
							onChange={(e) => handleFormField("isOnGoing", e.target.checked)}
						/>
						In corso
					</label>

					<button type="submit"><strong>Aggiungi manga</strong></button>
					<button type="button" onClick={() => setShowModal(false)}>
						<strong>Chiudi</strong>
					</button>
				</form>
			</div>
		</div>
	)
}

export default AddMangaModal