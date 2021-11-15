const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require('bcrypt');
// Update User
exports.update = async (req, res) => {

  const { id } = req.params;
  let user = await User.updateOne(id, req.body);
  return res.status(202).send({
    message: "L'utilisateur a jour",
    error: false,
    user
  });
  
  user.save()

};



module.exports = router;