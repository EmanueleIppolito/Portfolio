const express = require("express");
const mangas = require("./data/mangas.json");
const app = express();
app.use(express.json());
const port = 3000;



app.get("/", (req, res) => res.send("<h1>Benvenuto in Manga Library API</h1>"))

app.get("/mangas", (req, res) => res.json(mangas));

app.get("/mangas/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const manga = mangas.find(manga => manga.id === id);
    if(!manga){
        return res.status(404).json({error: "Manga non trovato"})
    }
    res.json(manga);
})

app.post("/mangas", (req, res) => {
    const body = req.body;
    if(!body.title || !body.author){
        return res.status(400).json({
            message: `I campi "Titolo" e "Autore" sono obbligatori`
        })
        
    }
    const newMangaId = mangas[mangas.length - 1].id + 1
    const newManga = {
        id: newMangaId,
        ...body
    }

    mangas.push(newManga)
    res.status(201).json({
        message: "Manga aggiunto con successo",
        manga: newManga})
})

app.delete("/mangas/:id", (req, res) => {
    const id = parseInt(req.params.id)
    const mangaIndex = mangas.findIndex(manga => manga.id === id)

    if(mangaIndex === -1){
        return res.status(404).json({
            message: "Manga non trovato"
        })
    } 
    const deletedManga = mangas[mangaIndex]
    mangas.splice(mangaIndex, 1)
    res.status(200).json({
    message: `Il manga ${deletedManga.title} è stato eliminato`
    })
})

app.put("/mangas/:id", (req, res) => {
    const id = parseInt(req.params.id)
    const body = req.body
    const mangaIndex = mangas.findIndex(manga => manga.id === id)
    
    if(mangaIndex === -1){
        return res.status(404).json({
            message: "Manga non trovato"
        })
    }
    if (!body.title || !body.author){
        return res.status(400).json({
            message: `I campi "Titolo" e "Autore" sono obbligatori` 
        })
    }

    const updatedManga = {
        id,
        ...body
    }
    mangas.splice(mangaIndex, 1, updatedManga)
    return res.status(200).json({
        message: `Il manga "${updatedManga.title}" è stato aggiornato`
    })
})

app.patch("/mangas/:id", (req, res) => {
    const id = parseInt(req.params.id)
    const body = req.body
    const mangaIndex = mangas.findIndex(manga => manga.id === id)

    if(mangaIndex === -1){
        return res.status(404).json({
            message: "Manga non trovato"
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
})
app.listen(port, () => console.log(`Server in ascolto su http://localhost:${port}`));