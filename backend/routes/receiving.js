const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  const { q, from, to } = req.query;
  try {
    let sql = `SELECT * FROM receiving`;
    const where = [];
    const params = [];
    if (q) { where.push(`(item_no ILIKE $${where.length+1} OR description ILIKE $${where.length+1} OR reference_no ILIKE $${where.length+1})`); params.push(`%${q}%`); }
    if (from) { where.push(`delivery_date::date >= $${where.length+1}`); params.push(from); }
    if (to) { where.push(`delivery_date::date <= $${where.length+1}`); params.push(to); }
    if (where.length) sql += ' WHERE ' + where.join(' AND ');
    sql += ' ORDER BY date_created DESC';
    const { rows } = await db.query(sql, params);
    res.json(rows);
  } catch (e) { console.error(e); res.status(500).json({ error: 'server_error' }); }
});

router.post('/', auth, async (req, res) => {
  const { item_no, qty, reference_no, delivery_date } = req.body || {};
  if (!item_no || !qty) return res.status(400).json({ error: 'missing_fields' });
  try {
    const { rows } = await db.query(
      `INSERT INTO receiving (item_no, description, qty, reference_no, delivery_date, received_by)
       VALUES ($1, (SELECT description FROM items WHERE item_no=$1), $2, $3, $4, $5)
       RETURNING *`,
      [item_no, qty, reference_no || null, delivery_date || null, (req.user?.username || 'system')]
    );
    await db.query(
      `INSERT INTO transactions (item_no, description, type, qty, created_by)
       VALUES ($1, (SELECT description FROM items WHERE item_no=$1), 'IN', $2, $3)`,
      [item_no, qty, req.user?.username || 'system']
    );
    res.status(201).json(rows[0]);
  } catch (e) { console.error(e); res.status(500).json({ error: 'server_error' }); }
});

router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM receiving WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (e) { console.error(e); res.status(500).json({ error: 'server_error' }); }
});

module.exports = router;
