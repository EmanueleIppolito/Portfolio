const mangas = require("../data/mangas.json")

function index(req, res){
    res.json(mangas)
}

function show(req, res){
const id = parseInt(req.params.id);
    const manga = mangas.find(manga => manga.id === id);
    if(!manga){
        return res.status(404).json({error: "Manga non trovato"})
    }
    res.json(manga)
}

function store(req, res){
const body = req.body;
    const newMangaId = mangas[mangas.length - 1].id + 1
    const newManga = {
        id: newMangaId,
        ...body
    }

    mangas.push(newManga)
    res.status(201).json({
        message: "Manga aggiunto con successo",
        manga: newManga})
}

function update(req, res){
const id = parseInt(req.params.id)
    const body = req.body
    const mangaIndex = mangas.findIndex(manga => manga.id === id)
    
    if(mangaIndex === -1){
        return res.status(404).json({
            error: "Manga non trovato"
        })
    }
    const updatedManga = {
        id,
        ...body
    }
    mangas.splice(mangaIndex, 1, updatedManga)
    return res.status(200).json({
        message: `Il manga "${updatedManga.title}" è stato aggiornato`,
        manga: updatedManga
    })
}

function modify(req, res){
const id = parseInt(req.params.id)
    const body = req.body
    const mangaIndex = mangas.findIndex(manga => manga.id === id)

    if(mangaIndex === -1){
        return res.status(404).json({
            error: "Manga non trovato"
        })
    }
    const updatedManga = {
        ...mangas[mangaIndex],
        ...body,
        id
    }
    mangas.splice(mangaIndex, 1, updatedManga)
    res.status(200).json({
        message: `Il manga "${updatedManga.title}" è stato modificato con successo`,
        manga: updatedManga
    })
}

function destroy(req, res){
const id = parseInt(req.params.id)
    const mangaIndex = mangas.findIndex(manga => manga.id === id)

    if(mangaIndex === -1){
        return res.status(404).json({
            error: "Manga non trovato"
        })
    } 
    const deletedManga = mangas[mangaIndex]
    mangas.splice(mangaIndex, 1)
    res.status(200).json({
    message: `Il manga ${deletedManga.title} è stato eliminato`
    })
}

module.exports = {
    index,
    show,
    store,
    update,
    modify,
    destroy
}