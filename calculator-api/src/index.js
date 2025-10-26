import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));

const OPERATIONS = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
};

app.get('/', (_req, res) => {
  res.json({status: 'ok', message: 'FunStack calculator API ready'});
});

app.post('/calculate', (req, res) => {
  const {a, b, operator} = req.body;
  const parsedA = Number(a);
  const parsedB = Number(b);

  if (!Number.isFinite(parsedA) || !Number.isFinite(parsedB)) {
    return res.status(400).json({error: 'Both numbers must be provided.'});
  }

  const mathOperation = OPERATIONS[operator];
  if (!mathOperation) {
    return res.status(400).json({error: 'Unsupported operator'});
  }

  const result = mathOperation(parsedA, parsedB);
  res.json({result, a: parsedA, b: parsedB, operator});
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Calculator API listening on port ${port}`);
});
