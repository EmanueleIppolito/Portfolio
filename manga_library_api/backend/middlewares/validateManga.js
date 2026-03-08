function validateManga(req, res, next){
    const body = req.body
    if(!body.title || !body.author){
     return res.status(400).json({
            error: `Errore! il campo "Titolo" e il campo "Autore" sono obbligatori!`
        })
    }
    next();

}

module.exports = validateManga;