// // const os = require('os');

// // console.log(os.platform());
// // // Output: 'win32' (on Windows platform)

// // console.log(os.arch());
// // // Output: 'x64' (on 64-bit architecture)

// // console.log(os.cpus());
// // // Output: an array of CPU core information

// // console.log(os.totalmem());
// // // Output: total system memory in bytes

// // console.log(os.freemem());
// // // Output: free system memory in bytes

// // console.log(os.networkInterfaces());
// // // Output: an object with information about network interfaces

// // console.log(os.hostname());
// // // Output: the hostname of the operating system

// // console.log(os.type());
// // // Output: 'Windows_NT' (on Windows)

// // console.log(os.uptime());
// // // Output: the system uptime in seconds

// const path = require('path');

// console.log(path.join('/usr', 'local', 'bin'));
// // Output: '/usr/local/bin'

// console.log(path.resolve('path.js'));
// // Output: '/path/to/current/directory/path.js' (assuming the current directory is '/path/to/current/directory')

// console.log(path.basename('/path/to/file.txt'));
// // Output: 'file.txt'

// console.log(path.dirname('/path/to/file.txt'));
// // Output: '/path/to'

// console.log(path.extname('/path/to/file.txt'));
// // Output: '.txt'

// console.log(path.parse('/path/to/file.txt'));
// // Output: { root: '/',
// //           dir: '/path/to',
// //           base: 'file.txt',
// //           ext: '.txt',
// //           name: 'file' }

// console.log(path.isAbsolute('/path/to/file.txt'));
// // Output: true

// console.log(path.relative('/path/to/file.txt', '/path/to'));
// // Output: '..'

// console.log(path.normalize('/path//to/file.txt'));
// // Output: '/path/to/file.txt'

// console.log(path.sep);
// // Output: '/' (on Unix-like systems)

// console.log(path.delimiter);
// // Output: ':' (on Unix-like systems)


const express = require('express');

const app = express();

// app.get('/', (req, res) => {
//     res.send('Hello World');
// });

// app.get('/users/:id', (req, res) => {
//     const userId = req.params.id;
//     res.send(`User ID: ${userId}`);
//   });

// Middleware function
// const authMiddleware = (req, res, next) => {
//     // Check authentication
//     // ...
//     next(); // Call the next middleware or route handler
// };

// // Route handler functions
// const homeHandler = (req, res) => {
//     res.send('Home Page');
// };

// const aboutHandler = (req, res) => {
//     res.send('About Page');
// };

// // Define routes with multiple handlers
// app.get('/', authMiddleware, homeHandler);
// app.get('/about', authMiddleware, aboutHandler);

app.post('/users1', (req, res) => {
    res.send('Create a new user');
});



app.route('/users')
    .get((req, res) => {
        res.send('Get all users');
    })
    .post((req, res) => {
        res.send('Create a new user');
    })
    .put((req, res) => {
        res.send('Update a user');
    })
    .delete((req, res) => {
        res.send('Delete a user');
    });


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});