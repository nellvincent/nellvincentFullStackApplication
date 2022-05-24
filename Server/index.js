const express = require('express');
const app     = express();
const port    = process.env.port || 3000;

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database( process.env.sqlitedatabase || "db.db" );

app.use(
    express.json(),
    (err, req, res, next) => { res.status(500).send(err.stack) }
);

app.post('/', (require, response, next) => {

    if (require.body) {
        db.serialize(() => {
            db.run('CREATE TABLE IF NOT EXISTS root(header JSONB, general JSONB, works JSONB, footer JSONB, language VARCHAR(4))');

            db.each('SELECT header, general, works, footer FROM root WHERE language = ?', ['ru'], (err, row) => {
                return response.status(200).send({
                    header:  JSON.parse( row.header ),
                    general: JSON.parse( row.general ),
                    works:   JSON.parse( row.works ),
                    footer:  JSON.parse( row.footer)
                })
            })
        })
        
    }
    
})

app.listen(port, () => {
    console.log("Server started...")
})