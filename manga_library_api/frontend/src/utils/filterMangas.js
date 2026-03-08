function filterMangas(mangas, search, filters) {
  const query = search.trim().toLowerCase()

  return mangas.filter(manga => {
    const matchesSearch =
      !query || manga.title.toLowerCase().includes(query)

    const isOngoing = Boolean(manga.isOnGoing)

    let matchesStatus = true

    if (filters.isOnGoing && !filters.isFinished) {
      matchesStatus = isOngoing
    } else if (!filters.isOnGoing && filters.isFinished) {
      matchesStatus = !isOngoing
    }

    return matchesSearch && matchesStatus
  })
}

export default filterMangas