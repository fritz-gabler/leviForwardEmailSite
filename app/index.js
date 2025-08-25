const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);

  // Optional: to keep the server alive in development when using nodemon-like tools
  if (process.env.NODE_ENV !== 'production') {
    process.stdin.resume();
  }
});
