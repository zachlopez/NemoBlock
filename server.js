const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require ('bcrypt');
const saltRounds = 10;
const process = require('process');
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
  let initSQL = 'INSERT INTO programs (filename, title, introduction, program, username) VALUES(?, ?, ?, ?, ?)';
  let filename = 'helloworld';
  let title = 'Hello World';
  let introduction = 'Hi 🙂! This is your first Nemo Blocks program 🤩!';
  let xml = '<xml xmlns="https://developers.google.com/blockly/xml"><variables><variable id="[+?cC#8(soyO?KYei)mt">response</variable></variables><block type="start" id="6_S},[q^:L,cFM/+.=gR" deletable="false" x="10" y="10"><statement name="ACTIONS"><block type="say" id="``7D{UM;(5JJp,kXZZmG"><value name="DIALOGUE"><block type="text" id="RCnf*H@cQdAc^XVY4d?$"><field name="TEXT">Welcome to Nemo Blocks!</field></block></value><statement name="ACTIONS"><block type="ask" id="Fw9|jTwUCHSu8^?#9c/$"><value name="DIALOGUE"><block type="text" id=";!Tm`:+EL0RjA#3fnvGa"><field name="TEXT">Would you like to see the tutorial?</field></block></value><statement name="ACTIONS"><block type="option" id="[3%`sTEddwGvHCM6pSEg"><field name="PAYLOAD_VAR" id="[+?cC#8(soyO?KYei)mt">response</field><value name="TITLE"><block type="text" id="@47KI2Ujw|8fK1BN/n)S"><field name="TEXT">Yes</field></block></value><value name="PAYLOAD_VAL"><block type="text" id="n_f]]NXL.cm!a*,z1vts"><field name="TEXT">yes</field></block></value><next><block type="option" id="0QZZ?Mm276M?(@O7LMCN"><field name="PAYLOAD_VAR" id="[+?cC#8(soyO?KYei)mt">response</field><value name="TITLE"><block type="text" id="?OI6O?CWG7t1Z*qh$X_:"><field name="TEXT">No</field></block></value><value name="PAYLOAD_VAL"><block type="text" id="]4eJ30=MXuL6cSS`7,L)"><field name="TEXT">no</field></block></value></block></next></block></statement></block></statement></block></statement></block><block type="repeat" id=";OK~g^Rs@TDIso-B]w1{" deletable="false" x="10" y="270"><statement name="ACTIONS"><block type="controls_if" id="@wBEcV/B),tX_IXe{%+4"><mutation else="1"></mutation><value name="IF0"><block type="logic_compare" id="56]P+4Gf]c$kt/d[^-N@"><field name="OP">EQ</field><value name="A"><block type="variables_get" id="4h%!XrYMijQ+|Rp#kzr9"><field name="VAR" id="[+?cC#8(soyO?KYei)mt">response</field></block></value><value name="B"><block type="text" id="T)[~,WBQs,gIHAr@X|]j"><field name="TEXT">yes</field></block></value></block></value><statement name="DO0"><block type="say" id="^#izX)/kp8*H4:a{og/3"><value name="DIALOGUE"><block type="text_join" id=")FNb!$HJ1%9?MR_8KZOV"><mutation items="2"></mutation><value name="ADD0"><block type="text" id="*/6c?2c/lwsx5)=`SD!p"><field name="TEXT">This is a \'say\' block. </field></block></value><value name="ADD1"><block type="text" id="?2Y?F6]xoH%5@3c}U8/I"><field name="TEXT">What you say here will be sent to your user. </field></block></value></block></value><statement name="ACTIONS"><block type="ask" id="WcDSBsm}M+d$L3AH)c%@"><value name="DIALOGUE"><block type="text_join" id="soR5^/egr2:7OR}OQ,n!"><mutation items="4"></mutation><value name="ADD0"><block type="text" id="])u27,}f}hldEN/^-|V!"><field name="TEXT">And this is an \'ask\' block. </field></block></value><value name="ADD1"><block type="text" id="Jm~XP:oQ#LE6Ju%z`O2$"><field name="TEXT">You can add \'option\' blocks here. </field></block></value><value name="ADD2"><block type="text" id="~x-O%ee,}([NP:^w3EDP"><field name="TEXT">Options blocks determine what will happen when users choose them. </field></block></value><value name="ADD3"><block type="text" id="32cXB!t2u35{sM.MO)3d"><field name="TEXT">Would you like to see the tutorial again? </field></block></value></block></value><statement name="ACTIONS"><block type="option" id="bEp!xJ#3X$Ca87|84oae"><field name="PAYLOAD_VAR" id="[+?cC#8(soyO?KYei)mt">response</field><value name="TITLE"><block type="text" id="9:*AW!+`;[_tdd]VUeu{"><field name="TEXT">Yes</field></block></value><value name="PAYLOAD_VAL"><block type="text" id="py|8B26h%o@ogX_x9I+%"><field name="TEXT">yes</field></block></value><next><block type="option" id="7FI)wpz9tM4GTTdmOxX2"><field name="PAYLOAD_VAR" id="[+?cC#8(soyO?KYei)mt">response</field><value name="TITLE"><block type="text" id="tlq4Em0ij{}#nh`30y@G"><field name="TEXT">No</field></block></value><value name="PAYLOAD_VAL"><block type="text" id="j{5EtsmScH[`tg3+xvAd"><field name="TEXT">no</field></block></value></block></next></block></statement></block></statement></block></statement><statement name="ELSE"><block type="say" id="#Ez4464Jx2YZ|=R,E*yO"><value name="DIALOGUE"><block type="text_join" id="DhW.23X8hcW9X[sTxZvz"><mutation items="2"></mutation><value name="ADD0"><block type="text" id="{[%B?Y2Of|lo9Bd5zXOp"><field name="TEXT">Before you go, remember that \'start\' runs at the start of the program or when the restart option is used. </field></block></value><value name="ADD1"><block type="text" id="G#U,HQjb^nvHS4KQejz,"><field name="TEXT">And \'repeat\' runs every time an option is selected. </field></block></value></block></value><statement name="ACTIONS"><block type="say" id="VI2`2P*+~R{c(NvXTMM}"><value name="DIALOGUE"><block type="text" id="mwusDk1h,.bHl#/:QXM_"><field name="TEXT">You\'re all set. Have fun using Nemo Blocks!</field></block></value></block></statement></block></statement></block></statement></block></xml>';
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
          db.run(initSQL, [filename, title, introduction, xml, req.body.user], function(err) {
            res.send(JSON.stringify({stat: 'Success!'}));
          });
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
      res.send(JSON.stringify({stat: 'You already have a program with this filename. Please change before saving.'}));
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

app.post('/destroy', (req, res) => {
  let deleteSQL = 'DELETE FROM users WHERE username = ?';
  let removeSQL = 'DELETE FROM programs WHERE username = ?';
  db.run(removeSQL, [req.body.user], function(err) {
    if (err) {
      console.error(err.message);
      res.send(JSON.stringify({stat: 'An error occured. Please try again.'}));
      return;
    }
    db.run(deleteSQL, [req.body.user], function(err) {
      if (err) {
        console.error(err.message);
        res.send(JSON.stringify({stat: 'An error occured. Please try again.'}));
        return;
      }
      res.send(JSON.stringify({stat: 'Success!'}));
  });
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

app.post('/download', (req, res) => {
  let retrieveSQL = 'SELECT * FROM programs WHERE username = ? AND id = ?';
  // first row only
  db.get(retrieveSQL, [req.body.user, req.body.id], (err, row) => {
    if (err) {
      console.error(err.message);
      res.send(JSON.stringify({stat: 'An error occured. Please try again.'}));
    } else if (row) { // if the row exists
      res.status(200)
        .attachment(row.filename + `.txt`)
        .send(row.program);
    } else {
      res.send(JSON.stringify({stat: "Selected program id is not found in the user's saved programs."}));
    }
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));

process.on('exit', code => {
  console.log(`Disconnected from database`);
  db.close();
});

process.on('SIGTERM', signal => {
  console.log(`Process ${process.pid} received a SIGTERM signal`);
  process.exit(0);
});

process.on('SIGINT', signal => {
  console.log(`Process ${process.pid} has been interrupted`);
  process.exit(0);
});

process.on('uncaughtException', err => {
  console.log(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});