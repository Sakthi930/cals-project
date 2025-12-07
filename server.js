const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());

// Serve frontend files from ../frontend folder
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Validate math expression
function isValidExpression(expr) {
  return /^[0-9+\-*/().%\s]+$/.test(expr);
}

function evaluateExpression(expr) {
  try {
    const sanitized = expr.replace(/\s+/g, '');
    const fn = new Function(`return (${sanitized});`);
    return fn();
  } catch {
    return null;
  }
}

app.post('/calculate', (req, res) => {
  const { expr } = req.body;

  if (!isValidExpression(expr)) {
    return res.status(400).json({ error: "Invalid characters!" });
  }

  const result = evaluateExpression(expr);

  if (result === null || !isFinite(result)) {
    return res.status(400).json({ error: "Invalid expression!" });
  }

  res.json({ result });
});

// Default route: open calculator UI
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
