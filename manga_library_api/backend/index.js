const express = require("express");
const mangasRouter = require("./routes/mangasRouter.js")
const app = express();
app.use(express.json());
const port = 3000;



app.get("/", (req, res) => res.send("<h1>Benvenuto in Manga Library API</h1>"))

app.use("/mangas", mangasRouter);

app.use((req, res) => res.status(404).send("<h1> Ops... Rotta non trovata... 😣</h1>"))

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({
        error: "Errore interno del server"
    })
})

app.listen(port, () => console.log(`Server in ascolto su http://localhost:${port}`));