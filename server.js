const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require ('bcrypt');
const saltRounds = 10;

const app = express();
const port = process.env.PORT || 5000;

// open the database
let db = new sqlite3.Database('./nemo.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to database.');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/login', (req, res) => {
  let selectSQL = 'SELECT * FROM users WHERE username = ?';
  // first row only
  db.get(selectSQL, [req.body.user], (err, row) => {
    if (err) {
      console.error(err.message);
      res.send(JSON.stringify({stat: 'An error occured. Please try again.'}));
      return;
    }
    if (!row) {
      res.send(JSON.stringify({stat: 'Username does not exit. Please create an account.'}));
      return;
    }

    bcrypt.hash(req.body.pass, row.salt, function(err, hash) {
      if (err) {
        console.error(err.message);
        res.send(JSON.stringify({stat: 'An error occured. Please try again.'}));
        return;
      }
      if (hash === row.password) {
        res.send(JSON.stringify({stat: 'Success!', val: req.body.user}));
        return;
      }
      res.send(JSON.stringify({stat: 'Incorrect password.'}));
    });
  });
});

app.post('/create', (req, res) => {
  let selectSQL = 'SELECT * FROM users WHERE username = ?';
  let insertSQL = 'INSERT INTO users (username, password, salt) VALUES(?, ?, ?)';
  // first row only
  db.get(selectSQL, [req.body.user], (err, row) => {
    if (err) {
      console.error(err.message);
      res.send(JSON.stringify({stat: 'An error occured. Please try again.'}));
      return;
    }
    if (row) {
      res.send(JSON.stringify({stat: 'Username already used. Please use a different one.'}));
      return;
    }
    bcrypt.genSalt(saltRounds, function(err, salt) {
      if (err) {
        console.error(err.message);
        res.send(JSON.stringify({stat: 'An error occured. Please try again.'}));
        return;
      }
      bcrypt.hash(req.body.pass, salt, function(err, hash) {
        if (err) {
          console.error(err.message);
          res.send(JSON.stringify({stat: 'An error occured. Please try again.'}));
          return;
        }
        db.run(insertSQL, [req.body.user, hash, salt], function(err) {
          if (err) {
            console.error(err.message);
            res.send(JSON.stringify({stat: 'An error occured. Please try again.'}));
            return;
          }
          res.send(JSON.stringify({stat: 'Success!'}));
        });
      });
    });
  });
});

app.post('/save', (req, res) => {
  // CREATE TABLE programs (id INTEGER PRIMARY KEY AUTOINCREMENT, filename TEXT, title TEXT, introduction TEXT, program TEXT, username TEXT NOT NULL, FOREIGN KEY (username) REFERENCES users (username) ON UPDATE CASCADE ON DELETE CASCADE);
  let checkSQL = 'SELECT * FROM programs WHERE filename = ? AND username = ? AND NOT id = ?';
  let selectSQL = 'SELECT * FROM programs WHERE id = ? AND username = ?';
  let updateSQL = 'UPDATE programs SET filename = ?, title = ?, introduction = ?, program = ? WHERE id = ?';
  let insertSQL = 'INSERT INTO programs (filename, title, introduction, program, username) VALUES(?, ?, ?, ?, ?)';
  let retrieveSQL = 'SELECT * FROM programs WHERE filename = ? AND title = ? AND introduction = ? AND program = ? AND username = ?';
  // first row only
  db.get(checkSQL, [req.body.filename, req.body.user, req.body.id], (err, row) => {
    if (err) {
      console.error(err.message);
      res.send(JSON.stringify({stat: 'An error occured. Please try again.'}));
    } else if (row) { // if the row exists
      res.send(JSON.stringify({stat: 'You already have a program with this title. Please change before saving.'}));
    } else {
      db.get(selectSQL, [req.body.id, req.body.user], (err, row) => {
        if (err) {
          console.error(err.message);
          res.send(JSON.stringify({stat: 'An error occured. Please try again.'}));
        } else if (row) { // if the row exists
          db.run(updateSQL, [req.body.filename, req.body.title, req.body.intro, req.body.program, req.body.id], (err) => {
            if (err) {
              console.error(err.message);
              res.send(JSON.stringify({stat: 'An error occured. Please try again.'}));
            } else {
              res.send(JSON.stringify({stat: 'Successfully saved!', val: row.id}));
            }
          });
        } else {
          db.run(insertSQL, [req.body.filename, req.body.title, req.body.intro, req.body.program, req.body.user], (err) => {
            if (err) {
              console.error(err.message);
              res.send(JSON.stringify({stat: 'An error occured. Please try again.'}));
            } else {
              db.get(retrieveSQL, [req.body.filename, req.body.title, req.body.intro, req.body.program, req.body.user], (err, row) => {
                if (err) {
                  console.error(err.message);
                  res.send(JSON.stringify({stat: 'An error occured. Please try again.'}));
                } else {
                  res.send(JSON.stringify({stat: 'Successfully saved!', val: row.id}));
                }
              });
            }
          });
        }
      });
    }
  });
});

app.post('/load', (req, res) => {
  let retrieveSQL = 'SELECT * FROM programs WHERE username = ? AND id = ?';
  // first row only
  db.get(retrieveSQL, [req.body.user, req.body.id], (err, row) => {
    if (err) {
      console.error(err.message);
      res.send(JSON.stringify({stat: 'An error occured. Please try again.'}));
    } else if (row) { // if the row exists
      res.send(JSON.stringify({
        stat: 'Load successful!', 
        val: {
          filename: row.filename,
          title: row.title,
          intro: row.introduction,
          program: row.program,
          id: row.id
        },
      }));
    } else {
      res.send(JSON.stringify({stat: "Selected program id is not found in the user's saved programs."}));
    }
  });
});

app.post('/delete', (req, res) => {
  let selectSQL = 'DELETE FROM programs WHERE username = ? AND id = ?';
  db.run(selectSQL, [req.body.user, req.body.id], function(err) {
    if (err) {
      console.error(err.message);
      res.send(JSON.stringify({stat: 'An error occured. Please try again.'}));
      return;
    }
    res.send(JSON.stringify({stat: 'Success!'}));
  });
});

app.post('/getPrgNames', (req, res) => {
  // CREATE TABLE programs (id INTEGER PRIMARY KEY AUTOINCREMENT, filename TEXT, title TEXT, introduction TEXT, program TEXT, username TEXT NOT NULL, FOREIGN KEY (username) REFERENCES users (username) ON UPDATE CASCADE ON DELETE CASCADE);
  let selectSQL = 'SELECT id, title FROM programs WHERE username = ?';
  // first row only
  db.all(selectSQL, [req.body.user], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.send(JSON.stringify({stat: 'An error occured. Please try again.'}));
    } else {
      let rowDic = {};
      rows.forEach((row)=>{
        rowDic[row.id] = row.title;
      });
      res.send(JSON.stringify({stat: ' ', val: rowDic}));
    }
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));