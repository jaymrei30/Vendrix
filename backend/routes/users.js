const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');

router.get('/', auth, async (req, res) => {
  try {
    const { rows } = await db.query('SELECT id, username, created_by, date_created FROM users ORDER BY id DESC');
    res.json(rows);
  } catch (e) { console.error(e); res.status(500).json({ error: 'server_error' }); }
});

router.post('/', auth, async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'missing_fields' });
  try {
    const hash = await bcrypt.hash(password, 10);
    const { rows } = await db.query('INSERT INTO users (username, password, created_by) VALUES ($1,$2,$3) RETURNING id, username, created_by, date_created',
      [username, hash, req.user?.username || 'system']);
    res.status(201).json(rows[0]);
  } catch (e) { console.error(e); res.status(500).json({ error: 'server_error' }); }
});

router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { password } = req.body || {};
  try {
    let result;
    if (password) {
      const hash = await bcrypt.hash(password, 10);
      result = await db.query('UPDATE users SET password = $1 WHERE id = $2 RETURNING id, username, created_by, date_created', [hash, id]);
    } else {
      result = await db.query('SELECT id, username, created_by, date_created FROM users WHERE id = $1', [id]);
    }
    if (!result.rows[0]) return res.status(404).json({ error: 'not_found' });
    res.json(result.rows[0]);
  } catch (e) { console.error(e); res.status(500).json({ error: 'server_error' }); }
});

router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (e) { console.error(e); res.status(500).json({ error: 'server_error' }); }
});

module.exports = router;
