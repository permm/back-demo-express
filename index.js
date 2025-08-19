const express = require('express')
const bodyparser = require('body-parser')
const mysql = require('mysql2/promise')
const cors = require('cors')
const app = express()
app.use(bodyparser.json())
app.use(cors())

const port = 8000
let conn = null
const initMySQL = async () =>{
    conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'classicmodels'
    })
}
app.get('/testdb', (req, res) => {
    mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'classicmodels'
    }).then((conn) =>{
        conn.query('SELECT * FROM employees')
        .then((results) =>{
            res.json(results[0])
        })
        .catch((error) =>{
            console.log(error.message)
            res.status(500).json({error: 'Error fetching employees'})
        })
    })
})
app.get('/testdb/v2', async (req, res) => {
    try {
        const results = await conn.query('SELECT * FROM employees')
        res.json(results[0])
    }
    catch (error){
        console.error('error message', error.message)
        let statusCode = error.statusCode || 500
        res.status(statusCode).json({
            message: 'Error fetching users',
            errorMessage: error.message
        })
    }
})
app.get('/api/users', async (req, res) =>{
    try {
        const results = await conn.query('SELECT * FROM employees')
        res.json(results[0])
    }
    catch (error) {
        console.error('error message', error.message)
        let statusCode = error.statusCode || 500
        res.status(statusCode).json({
            message: 'Error fetching users',
            errorMessage: error.message
        })
    }
})
app.get('/api/users/:id', async (req, res) => {
    let id = req.params.id
    try {
        const results = await conn.query('SELECT * FROM employees WHERE employeeNumber ='+id)
        if (results[0].length === 0) {
            throw {statusCode: 404, message: 'User not found'}
        }
        res.json(results[0][0])
    }
    catch (error) {
        console.error('error message', error.message)
        let statusCode = error.statusCode || 500
        res.status(statusCode).json({ 
            message: 'Error fetching users',
            errorMessage: error.message
        })
    }
})

app.post('/api/users', async (req, res) => {
    let user = req.body
    try {
        const results = await conn.query('INSERT INTO employees SET ?', user)
        res.json({
            message: 'insert ok',
            data: results[0]
        })
    }
    catch (error) {
        console.error('error message', error.message)
        res.status(500).json({ error: 'Error insert users' })
    }
})

app.put('/api/users/:id', async (req, res) => {
    let id = req.params.id
    let updateUser = req.body
    try {
        const results = await conn.query(
            'UPDATE employees SET ? WHERE employeeNumber = ?', 
            [updateUser, id]
        )
        res.json({
            message: 'insert ok',
            data: results[0]
        })
    }
    catch (error) {
        console.error('error message', error.message)
        res.status(500).json({ error: 'Error update users' })
    }
    
})

app.delete('/api/users/:id', async (req, res) => {
    let id = req.params.id
    try {
        const results = await conn.query(
            'DELETE from employees WHERE employeeNumber = ?', id)
        res.json({
            message: 'delete ok',
            data: results[0]
        })
    }
    catch (error) {
        console.error('error message', error.message)
        res.status(500).json({ error: 'Error delete users' })
    }
})

app.patch('/api/users/:id', async (req, res) => {
    let id = req.params.id
    let updateUser = req.body
    try {
        const results = await conn.query(
            'UPDATE employees SET ? WHERE employeeNumber = ?',
            [updateUser, id]
        )
        res.json({
            message: 'insert ok',
            data: results[0]
        })
    }
    catch (error) {
        console.error('error message', error.message)
        res.status(500).json({ error: 'Error update users' })
    }
})

app.listen(port, async (req, res) =>{
    await initMySQL()
    console.log('http server run at ' + port)
})