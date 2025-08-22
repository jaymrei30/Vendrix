const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  const { q, from, to } = req.query;
  try {
    let sql = `SELECT t.*, i.description as item_description FROM transactions t 
               LEFT JOIN items i ON i.item_no = t.item_no`;
    const params = [];
    const where = [];
    if (q) { where.push(`(t.item_no ILIKE $${where.length+1} OR i.description ILIKE $${where.length+1})`); params.push(`%${q}%`); }
    if (from) { where.push(`t.date_created::date >= $${where.length+1}`); params.push(from); }
    if (to) { where.push(`t.date_created::date <= $${where.length+1}`); params.push(to); }
    if (where.length) sql += ' WHERE ' + where.join(' AND ');
    sql += ' ORDER BY t.date_created DESC';
    const { rows } = await db.query(sql, params);
    res.json(rows);
  } catch (e) { console.error(e); res.status(500).json({ error: 'server_error' }); }
});

router.post('/', auth, async (req, res) => {
  const { item_no, type, qty } = req.body || {};
  if (!item_no || !type || !qty) return res.status(400).json({ error: 'missing_fields' });
  try {
    const { rows } = await db.query(
      `INSERT INTO transactions (item_no, type, qty, created_by)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [item_no, type, qty, req.user?.username || 'system']
    );
    res.status(201).json(rows[0]);
  } catch (e) { console.error(e); res.status(500).json({ error: 'server_error' }); }
});

router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM transactions WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (e) { console.error(e); res.status(500).json({ error: 'server_error' }); }
});

module.exports = router;
