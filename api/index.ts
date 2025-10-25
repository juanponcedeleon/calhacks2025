import express from 'express';

const app = express();

app.use(express.json());

// Your API routes
app.get('/api', (req, res) => {
  res.json({ message: 'Hello from Express!' });
});

app.get('/api/users', (req, res) => {
  res.json({ users: ['Alice', 'Bob', 'Charlie'] });
});

app.post('/api/data', (req, res) => {
  res.json({ received: req.body });
});

export default app;
