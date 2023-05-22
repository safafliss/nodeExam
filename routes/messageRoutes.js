var express= require("express")
var router=express.Router()
var {addMsg, listMsg, addLikes, modifMsg, deleteMsg, getMsgById} = require("../controllers/messageController")
var validate = require("../middlewares/validation");

router.get('/msg', function(req, res, next) {
    res.render('messageSocket', { title: 'Express' });
  });


router.post("/addMsg",validate, addMsg);
router.get("/listMsg", listMsg);
router.put("/addLikes/:id", addLikes);
router.put("/modifMsg/:id", modifMsg);
router.delete("/deleteMsg/:id", deleteMsg);
router.get("/getMsgById/:id", getMsgById);

module.exports=router;