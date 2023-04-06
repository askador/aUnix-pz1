// Import the required modules
const http = require('http')
const fs = require('fs')

const host = 'localhost' 
const port = 3000
let messages = []

const server = http.createServer(function (req, res) {
  if (req.url === '/') {
    // Serve the chat client HTML page
    fs.readFile('./chat.html', function (err, data) {
      if (err) {
        res.writeHead(500, {'Content-Type': 'text/html'})
        return res.end('500 Internal Server Error')
      }
      res.writeHead(200, {'Content-Type': 'text/html'})
      res.write(data)
      return res.end()
    })
  } else if (req.url === '/messages') {
    if (req.method === 'GET') {
      // Return the chat messages
      res.writeHead(200, {'Content-Type': 'application/json'})
      res.write(JSON.stringify(messages))
      return res.end()
    } else if (req.method === 'POST') {
      // Add a new chat message
      let body = ''
      req.on('data', function (data) {
        body += data
      })
      req.on('end', function () {
        let message = JSON.parse(body)
        messages.push(message)
        res.writeHead(201, {'Content-Type': 'application/json'})
        res.write(JSON.stringify(message))
        return res.end()
      })
    }
  } else {
    // Return 404 if the requested file is not found
    fs.readFile('.' + req.url, function(err, data) {
      if (err) {
        res.writeHead(404, {'Content-Type': 'text/html'})
        return res.end('404 Not Found')
      }
      res.writeHead(200, {'Content-Type': 'text/html'})
      res.write(data)
      return res.end()
    })
  }
})

// Start the server
server.listen(port, function () {
  console.log(`Server running at http://${host}:${port}`)
})
