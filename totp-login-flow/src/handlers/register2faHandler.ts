export async function register2faHandler(req, res) {
  console.log(req.body);
  if (!req.session.qrCode) {
    return res.redirect('/');
  }
  return res.render('register-2fa.html', { qrCode: req.session.qrCode });
}
