const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/users", userController.allUsers);
router.post("/createUser", userController.createUser);
router.post("/saveUser", userController.saveUser);
router.get("/oneUser", userController.oneUser);
router.put("/updateUsers", userController.updateUser);
// router.delete("/deleteUsers", userController.deleteUser);


module.exports = router;