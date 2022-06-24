import * as bcrypt from 'bcrypt';
import { authenticator } from 'otplib';
import { User } from '../models';

export async function loginHandler(req, res) {
  try {
    const username = req.body.username;
    const pw = req.body.password;
    const code = req.body.code;
    const user = await User.findOne({ username: username });
    console.log(user);
    if (user) {
      const secret = user?.secret;
      const cmp = await bcrypt.compare(pw, user.password);
      const authCheck = authenticator.check(code, secret);
      if (cmp && authCheck) {
        res.render('landing.html', { ...user });
      } else {
        res.redirect('/login');
      }
    } else {
      res.redirect('/login');
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server error occurred');
  }
}
