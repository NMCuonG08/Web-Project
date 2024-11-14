import express from 'express';
import passport from 'passport';
import session from 'express-session'
import './authentication/passport-setup.js'
import { engine } from 'express-handlebars'; 
import path from 'path';
import { fileURLToPath } from 'url';
import facebookPassport from './authentication/facebook.js';
import googlePassport from './authentication/google.js';
import router from './routes/index.js';
import githubPassport from './authentication/github.js';



import userinfo from './services/userinfo.js';

router.post("/patch" , async (req, res) => {

    const id = +req.body.UserID || 1;
  
    const changes = {
      FullName: req.body.FullName,
      Email: req.body.Email,
      FirstName: req.body.FirstName,
      LastName: req.body.LastName
    }
  
    await userinfo.patch(id,changes)
    res.redirect('/profile')
  })