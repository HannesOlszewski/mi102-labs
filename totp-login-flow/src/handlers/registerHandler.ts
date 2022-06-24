import * as bcrypt from 'bcrypt';
import { authenticator } from 'otplib';
import { User } from '../models';
import { generateQRDataUrl } from '../utils';

const saltRounds = 10;
const issuer = 'P.L';

export async function registerHandler(req, res) {
  console.log(req.body);
  try {
    const username: string = req.body.username;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPwd = await bcrypt.hash(req.body.password, salt);
    const secret = authenticator.generateSecret();
    const insertResult = await User.create({
      username: username,
      password: hashedPwd,
      salt: salt,
      secret: secret,
    });

    const qrURL = await generateQRDataUrl(username, issuer, secret);
    console.log('qrURL', qrURL);
    req.session.qrCode = qrURL;
    console.log('InsertResult', insertResult);
    console.log('Hashed password:', hashedPwd);
    console.log('Generated salt', salt);

    res.redirect('/register-2fa');
  } catch (error) {
    console.log(error);
    res.status(500).send(`Internal Server Error occurred, Error: ${error.message}`);
  }
}
