const { addTa, getAllTas, assignTa, deleteTa, deleteTaCourse } = require("../controller/TADirectory");
const router = require("express").Router();
const { verifyToken, verifyRole } = require("../middleware/auth");
router.use(verifyToken);
router.get("/", getAllTas);
router.use(verifyRole);
router.post("/add", addTa);
router.post("/assign", assignTa);
router.delete("/delete", deleteTa);
router.delete("/deleteTACourse", deleteTaCourse);
module.exports = router;

