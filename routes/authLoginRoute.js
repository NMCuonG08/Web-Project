import { Router } from 'express';
import facebookPassport from '../authentication/facebook.js';
import googlePassport from '../authentication/google.js';
import githubPassport from '../authentication/github.js';
import saveUserToDatabase from '../service/userService.js';

const router = Router();


const roleBasedAccess = (requiredRole) => (req, res, next) => {
    if (req.session.role === requiredRole) {
      return next();
    }
    res.status(403).send('Access Denied');
  };

  
  router.get('/facebook', facebookPassport.authenticate('facebook',{auth_type: 'reauthenticate'} ));
router.get(
  '/facebook/callback',
  facebookPassport.authenticate('facebook', { failureRedirect: '/login' }),
  async (req, res) => {
    try {
      const user = await saveUserToDatabase(req.user, 'facebook');
      req.session.userId = user.id;
      req.session.role = user.role;

      // Set role cookie
      res.cookie('userRole', user.role, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }); // 1 day
      res.redirect('/');
    } catch (error) {
      res.redirect('/login');
    }
  }
);


router.get('/google',googlePassport.authenticate('google', { scope: ['profile', 'email'] ,prompt: 'select_account' }));
router.get('/google/callback',googlePassport.authenticate('google', { failureRedirect: '/login' }),
async (req, res) => {
  try {
    const user = await saveUserToDatabase(req.user, 'google');
    req.session.userId = user.id;
    req.session.role = user.role;

    // Set role cookie
    res.cookie('userRole', user.role, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }); // 1 day
    res.redirect('/');
  } catch (error) {
    res.redirect('/login');
  }
}
);

router.get( '/github',(req, res, next) => {req.logout((err) => {
    if (err) return next(err);
    next();
  }); 
},
    githubPassport.authenticate('github', { scope: ['user:email'] })
);

router.get( '/github/callback', githubPassport.authenticate('github', { failureRedirect: '/login' }),
    async (req, res) => {
    try {
    const user = await saveUserToDatabase(req.user, 'github');
    req.session.userId = user.id;
    req.session.role = user.role;

    // Set role cookie
    res.cookie('userRole', user.role, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }); // 1 day
    res.redirect('/');
    } catch (error) {
    res.redirect('/login');
    }
    }
);


export default router;