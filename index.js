const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();

app.use(express.static('frontend'));    // Connect to frontend

const db = new sqlite3.Database("movies.db", (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

var hindi = 'SELECT * FROM hindiMovies';
var telugu = 'SELECT * FROM teluguMovies';

app.get('/data', function(req, res) {
  const language = req.query.language;
  const year = req.query.year;
  const rating = req.query.rating;

  if(language == 'telugu' && year && rating)  
  {
    //telugu, year, rating
    db.all(`SELECT * FROM teluguMovies WHERE year = ${year} AND rating = ${rating}`, [], (err, rows) => {
      if (err) {
        console.error('Error getting data from database:', err.message);
        res.status(500).send('Internal server error');
      } else {
        res.json(rows);
      }
    });
  }
  else if (language == 'hindi' && year && rating)  
  {
    //hindi, year, rating
    db.all( `SELECT * FROM hindiMovies WHERE year = ${year} AND rating = ${rating}`, [], (err, rows) => {
      if (err) {
        console.error('Error getting data from database:', err.message);
        res.status(500).send('Internal server error');
      } else {
        res.json(rows);
      }
    });
  }
  else if (language == 'telugu' && year)
  {
    //telugu, year
    db.all(`SELECT * FROM teluguMovies WHERE year = ${year}`, [], (err, rows) => {
      if (err) {
        console.error('Error getting data from database:', err.message);
        res.status(500).send('Internal server error');
      } else {
        res.json(rows);
      }
    });
  }
  else if (language == 'hindi' && year)
  {
    //hindi, year
    db.all(`SELECT * FROM hindiMovies WHERE year = ${year}`, [], (err, rows) => {
      if (err) {
        console.error('Error getting data from database:', err.message);
        res.status(500).send('Internal server error');
      } else {
        res.json(rows);
      }
    });
  }
  else if (language == 'telugu' && rating)
  {
    //telugu, rating
    db.all(`SELECT * FROM teluguMovies WHERE rating = ${rating}`, [], (err, rows) => {
      if (err) {
        console.error('Error getting data from database:', err.message);
        res.status(500).send('Internal server error');
      } else {
        res.json(rows);
      }
    });
  }
  else if (language == 'hindi' && rating)
  {
    db.all(`SELECT * FROM hindiMovies WHERE rating = ${rating}`, [], (err, rows) => {
      if (err) {
        console.error('Error getting data from database:', err.message);
        res.status(500).send('Internal server error');
      } else {
        res.json(rows); 
      }
    });
  }
  else if (language == 'telugu')
  {
    //telugu
    db.all(telugu, [], (err, rows) => {
      if (err) {
        console.error('Error getting data from database:', err.message);
        res.status(500).send('Internal server error');
      } else {
        res.json(rows);
      }
    });
  }
  else if (language == 'hindi')
  {
    //hindi
    db.all(hindi, [], (err, rows) => {
      if (err) {
        console.error('Error getting data from database:', err.message);
        res.status(500).send('Internal server error');
      } else {
        res.json(rows);
      }
    });
  }
  else if (year && rating)
  {
    //year, rating
    Promise.all([
      new Promise((resolve, reject) => {
        db.all(`SELECT * FROM hindiMovies WHERE year = ${year} AND rating = ${rating}`, [], (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      }),
      new Promise((resolve, reject) => {
        db.all(`SELECT * FROM teluguMovies WHERE year = ${year} AND rating = ${rating}`, [], (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      }),
    ])
      .then(([hindiMovies, teluguMovies]) => {
        const allMovies = [...hindiMovies, ...teluguMovies]; // Merge both results
        res.send(allMovies); // Send all movies (Hindi + Telugu)
      })
      .catch((error) => {
        console.error("Error querying database:", error.message);
        res.status(500).send({ error: "Failed to retrieve movies" });
      });
  }
  else if (year)
  {
    Promise.all([
      new Promise((resolve, reject) => {
        const query = `SELECT * FROM hindiMovies WHERE year = ${year}`;
        db.all(query, [], (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      }),
      new Promise((resolve, reject) => {
        const query = `SELECT * FROM teluguMovies WHERE year = ${year}`;
        db.all(query, [], (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      }),
    ])
      .then(([hindiMovies, teluguMovies]) => {
        const allMovies = [...hindiMovies, ...teluguMovies]; // Merge both results
        res.send(allMovies); // Send all movies filtered by year
      })
      .catch((error) => {
        console.error("Error querying database:", error.message);
        res.status(500).send({ error: "Failed to retrieve movies" });
      });
  }
  else if(rating)
  {
    //rating
    Promise.all([
      new Promise((resolve, reject) => {
        const query = `SELECT * FROM hindiMovies WHERE rating = ${rating}`;
        db.all(query, [], (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      }),
      new Promise((resolve, reject) => {
        const query = `SELECT * FROM teluguMovies WHERE rating = ${rating}`;
        db.all(query, [], (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      }),
    ])
      .then(([hindiMovies, teluguMovies]) => {
        const allMovies = [...hindiMovies, ...teluguMovies]; // Merge both results
        res.send(allMovies); // Send all movies filtered by rating
      })
      .catch((error) => {
        console.error("Error querying database:", error.message);
        res.status(500).send({ error: "Failed to retrieve movies" });
      });
  }
  else
  {
    //all
    Promise.all([
      new Promise((resolve, reject) => {
        db.all(hindi, [], (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      }),
      new Promise((resolve, reject) => {
        db.all(telugu, [], (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      }),
    ])
      .then(([hindiMovies, teluguMovies]) => {
        const allMovies = [...hindiMovies, ...teluguMovies]; // Merge both results
        res.send(allMovies); // Send all movies (Hindi + Telugu)
      })
      .catch((error) => {
        console.error("Error querying database:", error.message);
        res.status(500).send({ error: "Failed to retrieve movies" });
      });
  }

});

var server = app.listen(5000, function() {
  console.log('Express App running at http://127.0.0.1:5000/index.html');
});