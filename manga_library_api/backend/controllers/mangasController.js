const mangas = require("../data/mangas.json");

function index(req, res, next) {
    try {
        const { title, originalTitle, author, genre, tag, isOnGoing } = req.query;
        let filteredMangas = mangas;
        if (title) {
            filteredMangas = filteredMangas.filter(manga =>
                manga.title.toLowerCase()
                    .includes(title.toLowerCase()))
        }
        if (originalTitle) {
            filteredMangas = filteredMangas.filter(manga =>
                manga.originalTitle.toLowerCase()
                    .includes(originalTitle.toLowerCase()))
        }
        if (author) {
            filteredMangas = filteredMangas.filter(manga =>
                manga.author.toLowerCase()
                    .includes(author.toLowerCase()))
        }
        if (genre) {
            const requestedGenres = genre.split(",").map(singleGenre =>
                singleGenre.toLowerCase().trim()
            )
            filteredMangas = filteredMangas.filter(manga => {
                const matchedGenres = requestedGenres.filter(requestedGenre =>
                    manga.genre.find(singleGenre =>
                        singleGenre.toLowerCase() === requestedGenre))
                return matchedGenres.length === requestedGenres.length
            })

        }
        if (tag) {
            const requestedTags = tag.split(",").map(singleTag =>
                singleTag.toLowerCase().trim()
            );

            filteredMangas = filteredMangas.filter(manga => {
                const matchedTags = requestedTags.filter(requestedTag =>
                    manga.tag.find(singleTag =>
                        singleTag.toLowerCase() === requestedTag
                    )
                );

                return matchedTags.length === requestedTags.length;
            });
        }
        if (isOnGoing !== undefined) {
            const isOnGoingBool = isOnGoing === "true";
            filteredMangas = filteredMangas.filter(manga =>
                manga.isOnGoing === isOnGoingBool
            )
        }
        res.json(filteredMangas);
    } catch (err) {
        next(err);
    }
}

function show(req, res, next) {
    try {
        const id = parseInt(req.params.id);
        const manga = mangas.find(manga => manga.id === id);

        if (!manga) {
            return res.status(404).json({
                error: "Manga non trovato"
            });
        }

        res.json(manga);
    } catch (err) {
        next(err);
    }
}

function store(req, res, next) {
    try {
        const body = req.body;
        const newMangaId = mangas[mangas.length - 1].id + 1;

        const newManga = {
            id: newMangaId,
            ...body
        };

        mangas.push(newManga);

        res.status(201).json({
            message: "Manga aggiunto con successo",
            manga: newManga
        });
    } catch (err) {
        next(err);
    }
}

function update(req, res, next) {
    try {
        const id = parseInt(req.params.id);
        const body = req.body;
        const mangaIndex = mangas.findIndex(manga => manga.id === id);

        if (mangaIndex === -1) {
            return res.status(404).json({
                error: "Manga non trovato"
            });
        }

        const updatedManga = {
            id,
            ...body
        };

        mangas.splice(mangaIndex, 1, updatedManga);

        return res.status(200).json({
            message: `Il manga "${updatedManga.title}" è stato aggiornato`,
            manga: updatedManga
        });
    } catch (err) {
        next(err);
    }
}

function modify(req, res, next) {
    try {
        const id = parseInt(req.params.id);
        const body = req.body;
        const mangaIndex = mangas.findIndex(manga => manga.id === id);

        if (mangaIndex === -1) {
            return res.status(404).json({
                error: "Manga non trovato"
            });
        }

        const updatedManga = {
            ...mangas[mangaIndex],
            ...body,
            id
        };

        mangas.splice(mangaIndex, 1, updatedManga);

        res.status(200).json({
            message: `Il manga "${updatedManga.title}" è stato modificato con successo`,
            manga: updatedManga
        });
    } catch (err) {
        next(err);
    }
}

function destroy(req, res, next) {
    try {
        const id = parseInt(req.params.id);
        const mangaIndex = mangas.findIndex(manga => manga.id === id);

        if (mangaIndex === -1) {
            return res.status(404).json({
                error: "Manga non trovato"
            });
        }

        const deletedManga = mangas[mangaIndex];
        mangas.splice(mangaIndex, 1);

        res.status(200).json({
            message: `Il manga ${deletedManga.title} è stato eliminato`
        });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    index,
    show,
    store,
    update,
    modify,
    destroy
};