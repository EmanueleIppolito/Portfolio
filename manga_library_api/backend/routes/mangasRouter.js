const express = require("express")
const router = express.Router();
const mangasController = require("../controllers/mangasController.js")
const checkId = require("../middlewares/checkId.js")
const validateManga = require("../middlewares/validateManga.js")
const upload = require("../config/multer.js")



router.get("/", mangasController.index);

router.get("/:id", checkId, mangasController.show)

router.post("/", upload.single("cover"), validateManga, mangasController.store)

router.delete("/:id", checkId, mangasController.destroy)

router.put("/:id", checkId, validateManga, mangasController.update)

router.patch("/:id", checkId, mangasController.modify)






module.exports = router