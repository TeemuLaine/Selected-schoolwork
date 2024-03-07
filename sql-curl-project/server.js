var express = require('express');

var app = express();
var port = 8080;    // app.listen(8080);

var CONTENT_TYPE_JSON = "application/json"
var HTTP_OK = 200
var HTTP_NOK = 404
var HTTP_CREATED = 201


var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('test.db');

var accepted = ["id", "first", "last", "team"]

app.get('/', (req, res) => {
    res.setHeader('Content-Type', CONTENT_TYPE_JSON);
    message = { message: "Hello World" }
    res.status(302).send(`${JSON.stringify(message)}\n`);
})


app.get('/select', (req, res) => { // curl --silent --include "http://localhost:8080/select?table=football (&team=PSG)" optional where clause
    res.setHeader('Content-Type', CONTENT_TYPE_JSON);
    let message = { message: "Successfully deleted data" }
    let q = req.query
    let status = HTTP_OK
    let data = Object.keys(q)
    let values = Object.values(q)
    let column_error = false
    if (data[0] == "table") {
        if (values[0] != "football" && values[0] != "manager") {
            status = HTTP_NOK
            message = { error: `No such table: ${values[0]}` }
        }
        else {
            for (var i = 1; i < data.length; i++) {
                if (!accepted.find(element => element == data[i])) {
                    message = { error: `No such column: ${data[i]}` }
                    status = HTTP_NOK
                    column_error = true
                    break
                }
                else if (!values[i]) {
                    message = { error: `Column ${data[i]} can't be null` }
                    status = HTTP_NOK
                    column_error = true
                    break
                }
            }
            if (!column_error) {
                // forming the correct query
                let query = `SELECT * FROM ${values[0]}`
                if (values.length > 1) {
                    query += ` WHERE LOWER(${data[1]}) = LOWER("${values[1]}")`

                    for (var i = 2; i < data.length; i++) {
                        query += ` AND LOWER(${data[i]}) = LOWER("${values[i]}")`
                    }

                }
                db.all(query
                    , function (err, row) {
                        if (err)
                            console.log(err)
                        res.status(status).send(`${JSON.stringify(row)}\n`)
                    })
            }
            else
                res.status(status).send(`${JSON.stringify(message)}\n`)
        }
    } else {
        status = HTTP_NOK
        message = { error: "First key must be table" }
        res.status(status).send(`${JSON.stringify(message)}\n`)
    }
})

app.get('/join', (req, res) => { //  curl --silent --include "http://localhost:8080/join?table=football&join=manager&team"
    res.setHeader('Content-Type', CONTENT_TYPE_JSON);
    let message
    let q = req.query
    let status = HTTP_OK
    let data = Object.keys(q)
    let values = Object.values(q)
    let column_error = false
    if (data[0] == "table" && data[1] == "join") {
        if (values[0] == "football" || values[0] == "manager") {
            if (values[1] == "football" || values[1] == "manager") {
                for (var i = 2; i < data.length; i++) {
                    if (!accepted.find(element => element == data[i])) {
                        message = { error: `No such column: ${data[i]}` }
                        status = HTTP_NOK
                        column_error = true
                        break
                    }
                }
                if (!column_error) {
                    let query = `SELECT a.first || ' ' || a.last as 'Player Name', a.team AS 'Team',
                                 b.first || ' ' || b.last AS 'Manager name' FROM ${values[0]} a INNER JOIN
                                 ${values[1]} b ON a.${data[2]} = b.${data[2]}`
                    db.all(query
                        , function (err, row) {
                            if (err)
                                console.log(err)
                            res.status(status).send(`${JSON.stringify(row)}\n`)
                        })
                }
                else
                    res.status(status).send(`${JSON.stringify(message)}\n`)
            }
            else {
                status = HTTP_NOK
                message = { error: `No such table: ${values[1]}` }
                res.status(status).send(`${JSON.stringify(message)}\n`)
            }
        }
        else {
            status = HTTP_NOK
            message = { error: `No such table: ${values[0]}` }
            res.status(status).send(`${JSON.stringify(message)}\n`)
        }
    } else {
        status = HTTP_NOK
        message = { error: "First two keys must be table and join" }
        res.status(status).send(`${JSON.stringify(message)}\n`)
    }
})

app.post("/insert", (req, res) => { // curl -d POST --silent --include "http://localhost:8080/insert?table=football&first=Teemu&last=Laine&team=Tampere" all values required
    res.setHeader('Content-Type', CONTENT_TYPE_JSON);
    let q = req.query
    let status = HTTP_CREATED
    let message = { success: "Successfully added data" }
    let data = Object.keys(q)
    let values = Object.values(q)
    if (data[0] == "table") {
        if (values[0] == "football" || values[0] == "manager") {
            if (!q.first) {
                status = HTTP_NOK
                message = { error: "Column first can't be null" }
            }
            else if (!q.last) {
                status = HTTP_NOK
                message = { error: "Column last can't be null" }
            }
            else if (!q.team) {
                status = HTTP_NOK
                message = { error: "Column team can't be null" }
            }
            else {
                db.serialize(() => {
                    db.run(`INSERT INTO ${values[0]}(${data[1]}, ${data[2]}, ${data[3]}) VALUES('${values[1]}', '${values[2]}', '${values[3]}')`);
                })
            }
        }
        else {
            status = HTTP_NOK
            message = { error: `No such table: ${values[0]}` }
            res.status(status).send(`${JSON.stringify(message)}\n`)
        }
    }
    else {
        status = HTTP_NOK
        message = { error: "First key must be table" }
        res.status(status).send(`${JSON.stringify(message)}\n`);
    }
    res.status(status).send(`${JSON.stringify(message)}\n`);
})

app.delete("/delete", (req, res) => { // curl -X DELETE --silent --include "http://localhost:8080/delete?table=football&last=Laine" Last value is where clause
    res.setHeader('Content-Type', CONTENT_TYPE_JSON);
    let message = { success: "Successfully deleted data" }
    let q = req.query
    let status = HTTP_OK
    let data = Object.keys(q)
    let values = Object.values(q)
    let column_error = false
    if (data[0] == "table") {
        if (values[0] != "football" && values[0] != "manager") {
            status = HTTP_NOK
            message = { error: `No such table: ${values[0]}` }
        }
        else {
            for (var i = 1; i < data.length; i++) {
                if (!accepted.find(element => element == data[i])) {
                    message = { error: `No such column: ${data[i]}` }
                    status = HTTP_NOK
                    column_error = true
                    break
                }
                else if (!values[i]) {
                    message = { error: `Column ${data[i]} can't be null` }
                    status = HTTP_NOK
                    column_error = true
                    break
                }
            }
            if (!column_error) {
                // forming the correct query
                let query = `DELETE FROM ${values[0]}`
                if (values.length > 1) {
                    query += ` WHERE LOWER(${data[1]}) = LOWER("${values[1]}")`

                    for (var i = 2; i < data.length; i++) {
                        query += ` AND LOWER(${data[i]}) = LOWER("${values[i]}")`
                    }

                }
                db.all(query
                    , function (err, row) {
                        if (err)
                            console.log(err)
                            res.status(status).send(`${JSON.stringify(message)}\n`)
                    })
            }
            else
                res.status(status).send(`${JSON.stringify(message)}\n`)
        }
    } else {
        status = HTTP_NOK
        message = { error: "First key must be table" }
        res.status(status).send(`${JSON.stringify(message)}\n`)
    }
}
)

app.patch("/update", (req, res) => { // curl -X PATCH --silent --include "http://localhost:8080/update?table=football&...&id=2" Last value is WHERE clause
    res.setHeader('Content-Type', CONTENT_TYPE_JSON);
    let q = req.query
    let status = HTTP_OK
    let message = { success: "Successfully updated data" }
    let data = Object.keys(q)
    let values = Object.values(q)
    let column_error = false

    if (data[0] == "table") {
        if (values[0] != "football" && values[0] != "manager") {
            status = HTTP_NOK
            message = { error: `No such table: ${values[0]}` }
        }
        else {
            for (var i = 1; i < data.length; i++) {
                if (!accepted.find(element => element == data[i])) {
                    message = { error: `No such column: ${data[i]}` }
                    status = HTTP_NOK
                    column_error = true
                    break
                }
                else if (!values[i]) {
                    message = { error: `Column ${data[i]} can't be null` }
                    status = HTTP_NOK
                    column_error = true
                    break
                }
            }
            if (!column_error) {
                if (values.length == 2) {
                    status = HTTP_NOK
                    message = { error: "Not enough arguments" }
                }
                else {
                    let query = `UPDATE ${values[0]} SET ${data[1]} = '${values[1]}'`
                    let LAST = data.length - 1;

                    for (var i = 2; i < LAST; i++) {
                        query += `, ${data[i]} = '${values[i]}'`
                    }
                    query += `WHERE LOWER(${data[LAST]}) = LOWER("${values[LAST]}")`

                    db.serialize(() => {
                        db.run(query, function (err) {
                            if (err)
                                console.log(err)
                        })
                    })
                }
            }
        }
    }
    else {
        status = HTTP_NOK
        message = { error: "First key must be table" }
    }
    res.status(status).send(`${JSON.stringify(message)}\n`)
}
)


app.use((req, res) => {
    res.setHeader('Content-Type', CONTENT_TYPE_JSON);
    res.status(HTTP_NOK).json({});
});

app.listen(port, () => {
    console.log(`Backend running at http://localhost:${port}`)
})

