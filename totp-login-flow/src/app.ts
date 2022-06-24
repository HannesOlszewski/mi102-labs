import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import path from 'path';
import { connectDb } from './models';
import { registerHandler } from './handlers/registerHandler';
import { loginHandler } from './handlers/loginHandler';
import { register2faHandler } from './handlers/register2faHandler';

declare module 'express-session' {
  export interface SessionData {
    qrCode: string;
  }
}

const oneDay = 1000 * 60 * 60 * 24;

const app = express();

// eslint-disable-next-line @typescript-eslint/no-var-requires
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, '/views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
  })
);

app.get('/', (req, res) => res.render('register.html'));

app.get('/register', async (req, res) => res.render('register.html'));

app.post('/register', registerHandler);

app.get('/register-2fa', register2faHandler);

app.get('/login', async (req, res) => res.render('login.html'));

app.post('/login', loginHandler);

connectDb().then(async () => {
  app.listen(3000, () => console.log('Example app listening on port 3000!'));
});
