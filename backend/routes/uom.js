const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT id, description, created_by, date_created FROM uom ORDER BY id DESC');
    res.json(rows);
  } catch (e) { console.error(e); res.status(500).json({ error: 'server_error' }); }
});

router.post('/', auth, async (req, res) => {
  const { description } = req.body || {};
  if (!description) return res.status(400).json({ error: 'description_required' });
  try {
    const { rows } = await db.query(
      'INSERT INTO uom (description, created_by) VALUES ($1, $2) RETURNING *',
      [description, req.user?.username || 'system']
    );
    res.status(201).json(rows[0]);
  } catch (e) { console.error(e); res.status(500).json({ error: 'server_error' }); }
});

router.put('/:id', auth, async (req, res) => {
  const { id } = req.params; const { description } = req.body || {};
  try {
    const { rows } = await db.query('UPDATE uom SET description = COALESCE($1, description) WHERE id = $2 RETURNING *',[description, id]);
    if (!rows[0]) return res.status(404).json({ error: 'not_found' });
    res.json(rows[0]);
  } catch (e) { console.error(e); res.status(500).json({ error: 'server_error' }); }
});

router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM uom WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (e) { console.error(e); res.status(500).json({ error: 'server_error' }); }
});

module.exports = router;
