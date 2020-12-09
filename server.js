const fs = require('fs')
const key = fs.readFileSync('key.pem');
const cert = fs.readFileSync('certificate.pem');

// Servidor express
const express = require('express');
// El tipo de servidor
const https = require('https');
const app = express();
const server = https.createServer({ key: key, cert: cert }, app);
// io permite saber en que servidor me encuentro
const io = require('socket.io')(server)
const { v4: uuidV4 } = require('uuid')

app.set('view engine', 'ejs')
app.use(express.static('public'))

// Ruta inicial para crear la sala inicial y lo redirije al room con un uuid que es el numero de la sala
app.get('/', (req, res) => {
    res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
    console.log('Server say socket connected...')
        // Configuracion de evento para que cada que alguien se conecte primero pase el id y su userid
        // Cada que nos conectemos se configurar este envento
    socket.on('join-room', (roomId, userId) => {
        console.log('server say new user added!')
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('user-connected', userId)

        socket.on('disconnect', () => {
            socket.to(roomId).broadcast.emit('user-disconnected', userId)
        })
        console.log('userId: ', userId, '\nRoom id: ', roomId);
    })
})

// Servidor escucha en el puerto 3000
server.listen(3000)