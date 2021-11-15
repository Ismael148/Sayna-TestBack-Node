const express = require('express');
const router = express.Router();
const User = require('../models/User')
const { createJWT, generateRefreshToken } = require('../utils/auth')
const validateToken = require('../utils/validateToken')

// Update
router.put(`/update`, async (req, res) => {
  const { id } = req.params;
  let user = await User.updateOne(id, req.body);
  return res.status(202).send({
    message: "L'utilisateur a bien été mis à jour",
    error: false,
    user
  });
  user.save()
});



//Refresh token API
router.post("/refreshToken", (req,res) => {
  let refreshTokens = []
if (!refreshTokens.includes(req.body.token)) res.status(400).send("Refresh Token Invalid")
refreshTokens = refreshTokens.filter( (c) => c != req.body.token)
//remove the old refreshToken from the refreshTokens list
const accessToken = createJWT ({user: req.body.email})
const refreshToken = generateRefreshToken ({user: req.body.email})
//generate new accessToken and refreshTokens
res.json ({accessToken: accessToken, refreshToken: refreshToken})
})

// Logout
router.delete("/logout", (req,res)=>{
   let refreshTokens = []
refreshTokens = refreshTokens.filter( (c) => c != req.body.token)
//remove the old refreshToken from the refreshTokens list
res.status(204).send("Logged out!")
})

// Get User
router.get("/users", validateToken, (req, res)=>{
console.log("Token is valid")
console.log(req.user)
res.send(req.user)
})

// Get All Users
router.get('/userlist' , async (req , res) => {
 const users = await User.find({}).select('firstname lastname email sexe date_naissance');
    return res.status(200).json({
      error: false,
      users,
    });
}) 


module.exports = router;