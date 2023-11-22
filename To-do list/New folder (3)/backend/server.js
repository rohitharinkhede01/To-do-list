const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');

//cross origin requests
app.use(cors({
    origin: '*'
}));

// db connection
const dbConn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '#Bigstar1',
    database: 'todo'
});

dbConn.connect(function (err) {
    if (err) throw err;
    console.log("Database Connected!");
});

const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send("Hello World");
});

// get all tasks
app.get('/get', (req, response) => {
    dbConn.query("Select * from task", function (err, res) {
        if (err) {
            console.log("error: ", err);
            result(null, err);
        }
        else {
            // console.log('task : ', res);
            response.send(res)
        }
        console.log("api called")
    });
});

// add task
app.post('/addtask', (req, res) => {
    let task = req.body.task;
    let date = req.body.date;

    const sql = "INSERT INTO task (task, date) VALUES (?,?)";
    dbConn.query(sql, [task, date], (err, result) => {
        console.log(result);
    });
})

// update status
app.put('/complete/:taskId', (req, res) => {
    let taskId = req.params['taskId'];
    console.log("completed   called")

    const sql = "UPDATE task SET status='completed' WHERE id = ?";
    dbConn.query(sql, taskId, (err, result) => {
        if (err) console.log(err);
    });
});

// delete task
app.delete('/delete/:taskId', (req, res) => {
    const taskId = req.params['taskId'];
    const sql = "DELETE FROM task WHERE id = ?";
    dbConn.query(sql, taskId, (err, result) => {
        if (err) console.log(err);
    });
});

// listen for requests
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});