import { useState } from "react"
import logo from "../assets/mangapi-logo.png"

function Header({ search, setSearch, filters, setFilters, onOpenModal }) {
	const [showFilters, setShowFilters] = useState(false)

	return (
		<header className="header">
			<div className="header-left">
				<a href="/">
					<img src={logo} alt="MangAPI Logo" />
				</a>
			</div>

			<div className="header-center">
				<input
					type="text"
					placeholder="Cerca per titolo"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>

				<button type="button" onClick={() => setShowFilters(prev => !prev)}>
					<strong>Filtri</strong>
				</button>

				{showFilters && (
					<div className="filters-panel">
						<label>
							<input
								type="checkbox"
								checked={filters.isOnGoing}
								onChange={(e) =>
									setFilters(prev => ({
										...prev,
										isOnGoing: e.target.checked
									}))
								}
							/>
							In corso
						</label>

						<label>
							<input
								type="checkbox"
								checked={filters.isFinished}
								onChange={(e) =>
									setFilters(prev => ({
										...prev,
										isFinished: e.target.checked
									}))
								}
							/>
							Conclusi
						</label>
					</div>
				)}
			</div>

			<div className="header-right">
				<button type="button" onClick={onOpenModal}>
					Aggiungi Manga
				</button>
			</div>
		</header>
	)
}

export default Header