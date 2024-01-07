const express = require("express");
const app = express();
const mysql = require("mysql");
const PORT = process.env.port || 8000;

const cors = require('cors');
let corsOptions = {
    origin: "*", // 출처 허용 옵션
    credential: true, // 사용자 인증이 필요한 리소스(쿠키 ..등) 접근
  };
  
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 프로젝트 DB 정보 입력
const db = mysql.createPool({
  host: "_",
  user: "_",
  password: "_",
  database: "_",
});

app.post("/isminted", (req, res) => {
    const walletId = req.body.walletId;
    const sqlQuery = `UPDATE moonsnails_db.wallet set isminted = true where id ='${walletId}'`;
    db.query(sqlQuery, (err, result) => {
      console.log(err);
      res.send("success!");
      console.log(result)
    });
  });

app.post("/chkwhitelist", (req, res) => {    
    console.log(req.body.walletAddress);
    const sqlQuery = `SELECT * FROM moonsnails_db.wallet Where walletaddress = '${req.body.walletAddress}'`;
    db.query(sqlQuery, (err, result) => {
      console.log('error : ' + err);
      res.send(result);
      console.log(result);

    });
  });

app.listen(PORT, () => {
  console.log(`running on port ${PORT}`);
});
