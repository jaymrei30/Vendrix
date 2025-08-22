const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/uom', require('./routes/uom'));
app.use('/api/items', require('./routes/items'));
app.use('/api/discounts', require('./routes/discounts'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/receiving', require('./routes/receiving'));
app.use('/api/users', require('./routes/users'));
app.use('/api/reports', require('./routes/reports'));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Vendrix API running at http://localhost:${port}`));
