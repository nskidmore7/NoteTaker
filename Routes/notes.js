const router = require("express").Router();
const fs = require("fs");
const uuidv1 = require("uuidv1");
const { validateNote } = require("../../lib/notes");


/* GET */
router.get("/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf8", function (err, contents) {
    var words = JSON.parse(contents);
    res.send(words);
  });
});

/* POST */
router.post("/notes", (req, res) => {
  if (!validateNote(req.body)) {
    res.status(400).send("The note is not properly formatted.");
  } else {
    fs.readFile("db/db.json", (err, data) => {
      // Check for error
      if (err) throw err;
      // Handle data gathering for json update
      let notes = JSON.parse(data);
      req.body.id = notes.length.toString();
      let note = {
        title: req.body.title,
        text: req.body.text,
        id: uuidv1(),
      };
      console.log(note);
      res.json(note);
      // Add data to existing json array
      notes.push(note);
      console.log(notes);

      // Write updated json to array
      fs.writeFile("db/db.json", JSON.stringify(notes, null, 2), (err) => {
        // Check for error
        if (err) throw err;
        console.log("OK");
      });
    });
  }
});

/* DELETE REQUEST */
router.delete("/notes/:id", (req, res) => {
  fs.readFile("db/db.json", (err, data) => {
    // Check for error
    if (err) throw err;
    let deleteId = req.params.id;
    console.log(deleteId);
    // Handle data gathering for json update
    let notes = JSON.parse(data);
    notes.forEach((item, i) => {
      if (item.id == deleteId) {
        console.log(item);
        notes.splice(i, 1);
      }
    });

    // Write updated json to array
    fs.writeFile("db/db.json", JSON.stringify(notes, null, 2), (err) => {
      // Check for error
      if (err) throw err;
      res.send("200");
    });
  });
});

module.exports = router;