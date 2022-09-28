const { mapValuesSeries } = require('async');
const express = require('express');
const app = express();
const mysql = require('mysql');

app.use(express.static('public'));
// フォームから送信される値を受け取る
app.use(express.urlencoded({extended: false}));

// MAMPのMysqlサーバーへの接続
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'express_dev',
  socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
});

// トップ

app.get('/', (req, res) => {
  res.render('top.ejs');
});

// 一覧

app.get('/index', (req, res) => {
  connection.query(
    'SELECT * FROM items',
    (error, results) => {
      console.log(results);
      res.render('index.ejs',{items :results});
    }
  );
});

// 新規作成

app.get('/new', (req,res) => {
  res.render('new.ejs');
});

app.post('/create', (req, res) => {
  connection.query(
    'INSERT INTO items (name) VALUES(?)',
    [req.body.itemName],
    (error, results) => {
      res.redirect('/index');
    }
  );
});

// 編集
app.get('/edit/:id', (req, res) => {
  connection.query(
    'SELECT * FROM items WHERE id= ?',
    [req.params.id],
      (error, results) => {
        res.render('edit.ejs', {item: results[0]});
      }
  )
});

app.post('/update/:id', (req, res) => {
  connection.query(
    'UPDATE items SET name= ? where id= ?',
    [req.body.itemName, req.params.id],
      (error, results) => {
      res.redirect('/index');
      }
  )
});

// 削除

app.post('/delete/:id', (req, res) => {
  connection.query(
    'DELETE FROM items WHERE id= ?',
    [req.params.id],
    (error, results) => {
      res.redirect('/index');
    }
  )
});

app.listen(3000);