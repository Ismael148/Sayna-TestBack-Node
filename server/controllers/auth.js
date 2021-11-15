const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {
  createJWT,
  generateRefreshToken
} = require("../utils/auth");

// Email regex
const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// Sign Up Controller
exports.signup = (req, res, next) => {
  let { firstname, lastname, email, password, password_confirmation, date_naissance, sexe, } = req.body;

  let errors = [];
  if (!firstname) {
    errors.push({ firstname: "required" });
  }
  if (!lastname) {
    errors.push({ lastname: "required" });
  }
  if (!email) {
    errors.push({ email: "required" });
  }
  if (!emailRegexp.test(email)) {
    errors.push({ email: "invalid" });
  }
  if (!password) {
    errors.push({ password: "required" });
  }
  if (!password_confirmation) {
    errors.push({
      password_confirmation: "required",
    });
  }
  if (password != password_confirmation) {
    errors.push({ password: "Password doesn't match" });
  }
  if (!date_naissance) {
    errors.push({ date_naissance: "required" });
  }
  if (!sexe) {
    errors.push({ sexe: "required" });
  }
  if (errors.length > 0) {
    return res.status(422).json({ errors: errors });
  }

  User.findOne({ email: email })
    .then(user => {
      if (user) {
        return res.status(422).json({ errors: [{ user: "email already exists" }] });
      } else {
        const user = new User({
          firstname: firstname,
          lastname: lastname,
          email: email,
          password: password,
          date_naissance: date_naissance,
          sexe: sexe
        });
        bcrypt.genSalt(10, function (err, salt) {
          bcrypt.hash(password, salt, function (err, hash) {
            if (err) throw err;
            user.password = hash;
            user.save()

              .then(response => {
                res.status(200).json({
                  success: true,
                  message: "L'utilisateur a bien été crée avec succès",
                  result: response
                })
                console.log(response)
              })
              .catch(err => {
                res.status(500).json({
                  message: "L'une ou plusieurs données obligatoires sont manquantes",
                  errors: [{ error: err }]
                });
              });
          });
        });
      }
    }).catch(err => {
      res.status(500).json({
        errors: [{ error: 'Something went wrong' }]
      });
    })
}

// Sign In Controller
exports.signin = (req, res) => {
  let { email, password } = req.body;

  let errors = [];
  if (!email) {
    errors.push({ email: "required" });
  }
  if (!emailRegexp.test(email)) {
    errors.push({ email: "invalid email" });
  }
  if (!password) {
    errors.push({ passowrd: "required" });
  }
  if (errors.length > 0) {
    return res.status(422).json({ errors: errors });
  }

  User.findOne({ email: email }).then(user => {
    if (!user) {
      return res.status(404).json({
        errors: [{ user: "not found" }],
      });
    } else {
      bcrypt.compare(password, user.password).then(isMatch => {
        if (!isMatch) {
          return res.status(400).json({
            errors: [{
              password:
                "incorrect"
            }]
          });
        }
        let refresh_token = generateRefreshToken({
          user: req.body.firstname
        });
        let access_token = createJWT(
          user.firstname,
          user.lastname,
          user.email,
          user.date_naissance,
          user.sexe,
          user._id,
          3600
        );
        jwt.verify(access_token, process.env.TOKEN_SECRET, (err,
          decoded) => {
          if (err) {
            res.status(500).json({ erros: err });
          }
          if (decoded) {
            return res.status(200).json({
              success: true,
              message: "L'utilisateur a été authentifié avec succés",
              token: access_token,
              refreshToken: refresh_token,
              user
            });
            console.log(res)
          }
        });
      }).catch(err => {
        res.status(500).json({ 
          erros: err,
          message: "User Not found Please Sign Up"
         });
      });
    }
  }).catch(err => {
    res.status(500).json({ erros: err });
  });
}


