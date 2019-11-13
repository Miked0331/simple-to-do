let express = require('express')
let app = express()
let sanitizeHTML = require('sanitize-html')

//allows use of public folder
app.use(express.static('public'))

let db
let mongodb = require('mongodb')
let connectionString = "mongodb+srv://mainUser:user1@cluster0-1akm9.mongodb.net/TodoApp?retryWrites=true&w=majority"
mongodb.connect(connectionString, { useNewUrlParser: true }, function (err, client) {
  db = client.db()
  app.listen(3000)
})

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//param 1 - 
function passwordProtected(req, res, next) {
  res.set('WWW-Authenticate', 'Basic realm="Simple Todo App"')
  console.log(req.headers.authorization)
  if (req.headers.authorization == 'Basic dXNlcjp1c2Vy') {
    next()
  } else {
    res.status(401).send('Authentication required')
  }
}

app.use(passwordProtected)

//when someone sends a get request that takes them to the homepage '/'
app.get('/', function (req, res) {
  db.collection('items').find().toArray(function (err, items) {
    res.send(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Simple To-Do App</title>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
</head>
<body>
  <div class="container">
    <h1 class="display-4 text-center py-1">To-Do App</h1>
    
    <div class="jumbotron p-3 shadow-sm">
      <form id="create-form" action='/create-item' method='POST'>
        <div class="d-flex align-items-center">
          <input id="create-field" name='item' autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
          <button class="btn btn-primary">Add New Item</button>
        </div>
      </form>
    </div>
    
    <ul id="item-list" class="list-group pb-5">      
    </ul >
    
  </div >

  <script>
  let items = ${JSON.stringify(items)} 
  </script>

  <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
  <script src="/browser.js"> </script>
</body >
</html >
            `)
  })
})

app.post('/create-item', function (req, res) {
  //allowed tags and attributes are noit allowed
  let safeText = sanitizeHTML(req.body.text, { allowedTags: [], allowedAttributes: {} })
  db.collection('items').insertOne({ text: safeText }, function (err, info) {
    res.json(info.ops[0])
  })
})

app.post('/update-item', function (req, res) {
  // first arg tells us which document to update, 2nd argument we tell it what to update on that doc, 3rd arg is function that gets called after dataase action is complete
  //findOneAndUpdate updates document
  let safeText = sanitizeHTML(req.body.text, { allowedTags: [], allowedAttributes: {} })

  db.collection('items').findOneAndUpdate({ _id: new mongodb.ObjectID(req.body.id) }, { $set: { text: safeText } }, function () {
    res.send("Success")
  })
})

//delete one is 
app.post('/delete-item', function (req, res) {
  db.collection('items').deleteOne({ _id: new mongodb.ObjectId(req.body.id) }, function () {
    res.send("Success")
  })
})