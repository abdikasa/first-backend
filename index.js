const express = require("express");
const { response } = require("express");
const app = express();
//Need this otherwise body will be undefined.
//Takes the json data from request, transforms it to JS object, attch it to the body, before route is called.
app.use(express.json());

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2019-05-30T17:30:31.098Z",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2019-05-30T18:39:34.091Z",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2019-05-30T19:20:14.298Z",
    important: true,
  },
];

const generateID = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  return maxId + 1;
};

//POST: send all information for the new note inside the request body in json format.
app.post("/api/notes", (req, res) => {
  //assign body of the code
  const body = req.body;

  //check if content is empty
  if (!body.content) {
    return response.status(400).json({
      error: "content-missing",
    });
  }

  const note = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generateID(),
  };

  notes = notes.concat(note);
  res.json(note);
});

//on root, show this
app.get("/", (req, res) => {
  res.send("<h1>Hello World umm kay</h1>");
});

//specifies a certain path and shows the notes data.
app.get("/api/notes", (req, res) => {
  res.json(notes);
});

// Now app.get('/api/notes/:id', ...)will handle all HTTP GET requests, that are of the form /api/notes/SOMETHING, where SOMETHING is an arbitrary string.

// The id parameter in the route of a request, can be accessed through the request object
app.get("/api/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  const note = notes.find((note) => note.id === id);

  // Note variable is set to undefined if no matching note is found. Should return 404 not found and not status code 200.

  if (note) res.json(note);
  else response.status(404).end();
});

app.delete("/api/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  notes = notes.filter((note) => note.id !== id);
  //status code 204 no content and return no data with the response
  res.status(204).end();
});

const PORT = 3002;
app.listen(PORT),
  () => {
    console.log(`Server running on port ${PORT}`);
  };
