const jwt = require("jsonwebtoken");

// Genrate Access && Refresh Token
exports.createJWT = (firstname, lastname, email, date_naissance, sexe, userId, duration) => {
   const payload = {
      firstname,
      lastname,
      email,
      date_naissance,
      sexe,
      userId,
      duration
   };
   return jwt.sign(payload, process.env.TOKEN_SECRET, {
     expiresIn: "2d",
   });
};

exports.generateRefreshToken = (email, userId, duration) => {
   const user = {
      email,
      userId,      
      duration
   }
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: "50d"})

}