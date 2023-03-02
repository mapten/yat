import express from 'express';

const PORT = process.env.PORT || 3001;

const app = express();

// get all tasks
app.get('/task', async (req, res) => {
  console.log('GET /task')
});

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
