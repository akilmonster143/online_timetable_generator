const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const path = require('path');
const mysql = require('mysql');
// Set up body-parser middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

// Set the folder where your static files are located (e.g., HTML, CSS, JS files)
app.use(express.static(path.join(__dirname, 'static')));

// Configure Express.js to use EJS as the view engine
app.set('view engine', 'ejs');
// Set the folder where your views are located
app.set('views', path.join(__dirname, 'views'));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'Akil',
  password: 'Akilamu@321',
  database: 'newdbexp3'
});

// Connect to MySQL server
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL server');

  const createTableQuery = `CREATE TABLE IF NOT EXISTS classteacher (
      id INT PRIMARY KEY AUTO_INCREMENT,
      faculty VARCHAR(255),
      class VARCHAR(255)
    )`;
  connection.query(createTableQuery, (err, result) => {
    if (err) throw err;
    console.log('classteacher Table created successfully');
  });

  // Define route to handle form submission from addClassTeacher.html
  app.post('/addClassTeacherData', (req, res) => {
    const { facultyName, year, section } = req.body;

    // Concatenate year and section values
    const yearSection = `${year}${section}`;
    // Check if the class teacher entry already exists in the classTeacher table
    const checkQuery = `SELECT * FROM classteacher WHERE class = ? `;
    connection.query(checkQuery, [yearSection], (err, result) => {
      if (err) {
        res.status(500).json({ error: 'Failed to check class teacher entry in database' });
      } else {
        if (result.length > 0) {
          // If entry exists, update the row with the new faculty name
          const updateQuery = `UPDATE classteacher SET faculty = ? WHERE class = ? `;
          connection.query(updateQuery, [facultyName, yearSection], (err, result) => {
            if (err) {
              res.status(500).json({ error: 'Failed to update class teacher entry in database' });
            } else {
              res.send('<h1 style="text-align: center; color: green;">Successfully Added!</h1>');
              res.redirect('/addclassteacher.html');
            }
          });
        } else {
          // If entry does not exist, insert a new row into classTeacher table
          const insertQuery = `INSERT INTO classteacher (faculty, class) VALUES (?, ?)`;
          connection.query(insertQuery, [facultyName, yearSection], (err, result) => {
            if (err) {
              res.status(500).json({ error: 'Failed to add class teacher entry to database' });
            } else {
              res.send('<h1 style="text-align: center; color: green;">Successfully Added!</h1>');
            }
          });
        }
      }
    });
  });

  app.post('/addScheduleData', (req, res) => {
    const { year, section, day, subject1, faculty1, subject2, faculty2, subject3, faculty3, subject4, faculty4, subject5, faculty5, subject6, faculty6, subject7, faculty7, subject8, faculty8 } = req.body;  

    /// Create table if not exists
    connection.query(`
  CREATE TABLE IF NOT EXISTS schedule (
    schedule_id INT NOT NULL AUTO_INCREMENT,
  hour INT NOT NULL,
  year INT NOT NULL,
  section VARCHAR(255) NOT NULL,
  day VARCHAR(255) NOT NULL,
  faculty VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  PRIMARY KEY (schedule_id)
  )
`, (error, results, fields) => {

      if (error) throw error;
      console.log('Schedule table created successfully');
    });

    // Insert 8 tuples into the schedule table
    const schedule = [
      [1, year, section, day, faculty1, subject1],
      [2, year, section, day, faculty2, subject2],
      [3, year, section, day, faculty3, subject3],
      [4, year, section, day, faculty4, subject4],
      [5, year, section, day, faculty5, subject5],
      [6, year, section, day, faculty6, subject6],
      [7, year, section, day, faculty7, subject7],
      [8, year, section, day, faculty8, subject8]
    ];

    // Insert each tuple into the schedule table
    for (let i = 0; i < schedule.length; i++) {
      const tuple = schedule[i];
      const checkQuery = `SELECT * FROM schedule WHERE hour = ? AND year = ? AND section = ? AND day = ?`;
      connection.query(checkQuery, [tuple[0], tuple[1], tuple[2], tuple[3]], (err, result) => {
        if (err) {
          throw err;
        } else {
          if (result.length > 0) {
            // If entry exists, update the row with the new faculty name
            const updateQuery = `UPDATE schedule SET faculty = ?, subject = ? WHERE hour = ? AND year = ? AND section = ? AND day = ?`;
            connection.query(updateQuery, [tuple[4], tuple[5], tuple[0], tuple[1], tuple[2], tuple[3]], (err, result) => {
              if (err) {
                throw err;
              } else {
                console.log(`Schedule ${i + 1} has been updated.`);
              }
            });
          } else {
            // If entry does not exist, insert a new row into the schedule table
            const insertQuery = `INSERT INTO schedule (hour, year, section, day, faculty, subject) VALUES (?, ?, ?, ?, ?, ?)`;
            const faculty = tuple[4].toLowerCase();
            connection.query(insertQuery, [tuple[0], tuple[1], tuple[2], tuple[3], faculty, tuple[5]], (err, result)=> {
              if (err) {
                throw err;
              } else {
                console.log(`Schedule ${i + 1} has been inserted.`);
              }
            });
          }
        }
      });
    }


    res.redirect('/adminDashboard.html');

  });

  // Create the users table if it doesn't exist
  connection.query(`CREATE TABLE IF NOT EXISTS faculty (
  id INT(11) NOT NULL AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  PRIMARY KEY (id)
)`, (err, results) => {
    if (err) {
      console.error(err);
    } else {
      console.log('faculty table created or already exists');
    }
  });

  // Handle form submission for faculty signup
  app.post('/facultySignup', (req, res) => {
    const username = req.body.txt;
    const email = req.body.email;
    const password = req.body.pswd;

    // Insert the form data into the users table
    connection.query(`INSERT INTO faculty (username, email, password) VALUES (?, ?, ?)`, [username, email, password], (err, results) => {
      if (err) {
        console.error(err);
        res.send('Error occurred while signing up');
      } else {
        console.log('User signed up');
        // Redirect to the admin dashboard
        res.redirect('/faculty.html');
      }
    });
  });

  // Handle the faculty login request
  app.post('/facultyLogin', function (req, res) {
    const email = req.body.email;
    const password = req.body.pswd;

    // Query the faculty table for the given email and password
    connection.query('SELECT * FROM faculty WHERE email = ? AND password = ?', [email, password], function (error, results, fields) {
      if (error) throw error;

      if (results.length > 0) {
        // Login success, redirect to the faculty dashboard page
        // console.log(results[0].username);
        res.redirect('/facultyDashboard?facultyName=' + encodeURIComponent(results[0].username));
      } else {
        // Credentials don't match, redirect to the login page
        res.redirect('/faculty.html');
      }
    });
  });

  // set up routes
  app.get('/facultyDashboard', function (req, res) {
    const facultyName = req.query.facultyName;
    // console.log(facultyName);
    const sql =
      'SELECT * FROM schedule WHERE faculty = ? ORDER BY day, hour';
    connection.query(sql, [facultyName], function (error, results, fields){
      if (error) {
        console.log(error);
      } else {
        const schedule = results;
        // console.log("facultyName: ", facultyName);
        // console.log("schedule: ", schedule);
        res.render('facultyDashboard', { facultyName, schedule });
      }
    });
  });
  // Close MySQL connection
  // connection.end();
});


app.get('/', (req, res) => {
  const facultyQuery = 'SELECT username FROM faculty';
  const scheduleQuery = 'SELECT * FROM schedule WHERE day = ? AND faculty = ? ORDER BY hour';

  // Get the current day
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  // Retrieve the list of faculty usernames
  connection.query(facultyQuery, (error, results) => {
    if (error) throw error;

    const facultyUsernames = results.map((result) => result.username);

    // Retrieve the schedules for each faculty
    const schedules = {};

    facultyUsernames.forEach((username) => {
      connection.query(scheduleQuery, [today, username], (error, results) => {
        if (error) throw error;

        // Group schedules by hour
        const groupedSchedules = {};
        results.forEach((result) => {
          groupedSchedules[result.hour] = {
            year: result.year,
            section: result.section,
            subject: result.subject
          };
        });

        schedules[username] = groupedSchedules;

        // Render the EJS template with the faculty schedules
        if (Object.keys(schedules).length === facultyUsernames.length) {
          // console.log(schedules, today );
          res.render('index', { facultyUsernames, schedules, today });
        }
      });
    });
  });
});


// Define a route for handling requests to the 'admin.html' URL
app.get('/admin.html', (req, res) => {
  res.render('admin');
});

app.get('/adminDashboard.html', (req, res) => {
  res.render('adminDashboard');
});

app.get('/addClass.html', (req, res) => {
  res.render('addClass');
});

app.get('/addClassTeacher.html', (req, res) => {
  res.render('addClassTeacher');
});

// Create MySQL connection
app.post('/timetable', (req, res) => {
  let year = req.body.year.toLowerCase();
  let section = req.body.section.toLowerCase();
  connection.query(
    'SELECT * FROM schedule WHERE year = ? AND section = ? ORDER BY hour, day',
    [year, section],
    (error, results) => {
      if (error) {
        console.error(error);
        res.sendStatus(500);
      } else {
        // Pass the schedule data to the timetable template
        res.render('timetable.ejs', { 
          schedule: results,
          year: year,
          section: section
        });
      }
    }
  );
});


app.post('/classteacher', (req, res) => {
  let facultyName = req.body['faculty-name'];

  // query database to check if entered faculty is a class teacher
  connection.query(
    'SELECT * FROM classteacher WHERE faculty = ?',
    [facultyName],
    (error, results) => {
      if (error) {
        console.error(error);
        res.sendStatus(500);
      } else {
        if (results.length === 0) {
          // If faculty is not a class teacher, send an alert
          res.send(`<script>alert('You are not a class teacher')</script>`);
        } else {
          // If faculty is a class teacher, extract the class and section
          let classSection = results[0].class.toLowerCase();
          let classNumber = classSection.split('')[0];
          let section = classSection.split('')[1];
          connection.query(
            'SELECT * FROM schedule WHERE year = ? AND section = ? ORDER BY hour, day',
            [classNumber, section],
            (error, results) => {
              if (error) {
                console.error(error);
                res.sendStatus(500);
              } else {
                // Render the timetable template with schedule data
                res.render('timetable.ejs', { 
                  schedule: results,
                  year: classNumber,
                  section: section
                });
              }
            }
          );
        }
      }
    }
  );
});



const port = 5000; // Define the desired port number
app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});