function validateManga(req, res, next){
    const body = req.body
    if(!body.title || !body.author){
        res.status(404).json({
            error: `Errore! il campo "Titolo" e il campo "Autore" sono obbligatori!`
        })
    }
    next();

}

module.exports = validateManga;