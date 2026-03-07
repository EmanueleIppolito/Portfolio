function checkId(req, res, next) {
    const id = parseInt(req.params.id)
    if(Number.isNaN(id)){
      return res.status(400).json({
            error: "L'id inserito non è un numero"
        })
    }
    next()
}

module.exports = checkId;