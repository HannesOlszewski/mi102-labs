# Lab 8 - Login Flow with TOTP

## Tech-Stack:
- Node
- Express
- Typescript
- MongoDb
- Mongoose ORM

The express server serves static html files with Bootstrap. Simple input forms
are then being used to post relevant data to the specific endpoints for validation/authorization.

For otp the library `otplib` is used, for hashing/salting we are using `bcrypt`.


## How to run
1. Make sure to install mongodb, ideally with home brew:
   1. `brew update`
   2. `brew tap mongodb/brew`
   3. `brew install mongodb/community`
2. Initialize folder for mongodb
   1. `sudo mkdir -p /data/db`
   2. `sudo chown -R `id -un` /data/db`
3. Start service:
   1. `mongod` or `brew services start mongodb-community`
   2. If port is already assigned, kill service and retry
4. Start application
   1. `yarn dev`
   2. Go to `localhost:3000`
   3. Register, Scan Code, go back to Login-Page to login


### Additional commands:
- `sudo lsof -iTCP -sTCP:LISTEN -n -P` - show all services using tcp
- `sudo kill <PID>` - kills the service
- `sudo nano /usr/local/etc/mongod.conf` - edit mongodb config file
- `mongod --dbpath=/Users/$(whoami)/data/db` set new dbpath

### How to hash with bcrypt
- `$passwordHash = bcrypt($password . $pepper, $salt);`
- `$passwordHash = bcrypt(hash('sha256', $password . $pepper), $salt);`


## Evaluation

### How secure do you think your own implementation is?
- Attack Vectors:
  - Hash collision attack - brute force/calculate hashs of known passwords
    - Not irreversible, just hard to reverse
    - Dictionary Attacks
      - Usually prevented by pepper 
  - Pre-computed tables (rainbow tables), can be used as a lookup
    - Is prevented by use of salts
  - 2fa:
    - Supply chain attacks, could intercept secret during setup if device is infected
    - Man in the middle attack, could read secret as well as additional information
    - Secret is stored in plain text in the db, if db is breached the information is leaked
    - Secret is written into session, sessions can be hijacked

### Why not to use pepper
- [Stackoverflow discussion](https://stackoverflow.com/questions/16891729/best-practices-salting-peppering-passwords)

### Which security goals did you achieve with your implementation and which not?
- Achieved:
  - No plain text passwords in db
  - Use of hashing for additional security
    - makes simple passwords more complex / unique for every user
  - Simple TOTP / 2FA in addition to normal password
- Not achieved:
  - Route protection
    - Currently not redirecting on successful login, simply rendering different .html file
    - Ideally should redirect to a protected route, normally only accessible with valid token / session
  - Proper auth flow with token

