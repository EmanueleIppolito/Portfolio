const express = require("express")
const router = express.Router();
const mangas = require("../data/mangas.json");
const mangasController = require("../controllers/mangasController.js")




router.get("/", mangasController.index);

router.get("/:id", mangasController.show)

router.post("/", mangasController.store)

router.delete("/:id", mangasController.destroy)

router.put("/:id", mangasController.update)

router.patch("/:id", mangasController.modify)






module.exports = router