import express from 'express';
import passport from 'passport';
import session from 'express-session';
import './authentication/passport-setup.js';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import facebookPassport from './authentication/facebook.js';
import googlePassport from './authentication/google.js';
import githubPassport from './authentication/github.js';
import flash from 'connect-flash';
import adminRoute from './routes/adminRoute.js';
import authLogin from './routes/authLoginRoute.js';
import vnpay from './routes/payment/vnpay.js';
import payment from './routes/payment/payment.js';
import router from './routes/index.js';
import editorRoute from './routes/editorRoute.js';
import subRoute from './routes/subRoute.js';
import captchaRoute from './routes/captchaRoute.js'

const app = express();

// Add the eq helper
const hbsHelpers = {
  eq: (a, b) => a === b
};

// Configure Handlebars engine with helpers
app.engine('hbs', engine({
  extname: 'hbs',
  helpers: hbsHelpers
}));
app.set('view engine', 'hbs');
app.set('views', './view');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'Q2VNTVN3QklsQXZTRmFhRHV6ZEtKcHhDdFNldG4xTHdGSzRCWkunSmJ5UT8',
  resave: false,
  saveUninitialized: true,
}));

app.use(flash());
app.use((req, res, next) => {
  res.locals.errorMessage = req.flash('error');
  res.locals.successMessage = req.flash('success');
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(facebookPassport.initialize());
app.use(facebookPassport.session());
app.use(googlePassport.initialize());
app.use(googlePassport.session());
app.use(githubPassport.initialize());
app.use(githubPassport.session());

// Middleware to attach session user to req.user
app.use((req, res, next) => {
  if (req.session.user) {
    req.user = req.session.user;
  }
  next();
});

// Routes
app.use('/', router);
app.use('/auth', authLogin);
app.use('/editor', editorRoute);
app.use('/admin', adminRoute);
app.use('/api/payment', vnpay);
app.use('/payment', payment);
app.use('/subscriber', subRoute);
app.use('/captcha', captchaRoute);

app.get("/", (req, res) => {
  res.send("Hello word");
});

app.listen(3000, () => {
  console.log("App is running");
});
