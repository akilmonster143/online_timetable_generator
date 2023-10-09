app.get('/', (req, res) => {
  const facultyQuery = 'SELECT username FROM faculty';
  const scheduleQuery = 'SELECT * FROM schedule WHERE day = ? ORDER BY hour';

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
          groupedSchedules[result.hour] = result;
        });

        schedules[username] = groupedSchedules;

        // Render the EJS template with the faculty schedules
        if (Object.keys(schedules).length === facultyUsernames.length) {
          console.log(facultyUsernames, schedules, today );
          res.render('index', { facultyUsernames, schedules, today });
        }
      });
    });
  });
});