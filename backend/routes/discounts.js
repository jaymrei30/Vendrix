const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  const { q } = req.query;
  try {
    let sql = `SELECT d.*, i.description as item_description FROM discounts d LEFT JOIN items i ON i.item_no = d.item_no`;
    let params = [];
    if (q) { sql += ` WHERE d.item_no ILIKE $1 OR i.description ILIKE $1`; params.push(`%${q}%`); }
    sql += ` ORDER BY d.date_created DESC`;
    const { rows } = await db.query(sql, params);
    res.json(rows);
  } catch (e) { console.error(e); res.status(500).json({ error: 'server_error' }); }
});

router.post('/', auth, async (req, res) => {
  const { item_no, discount_amt, start_date, end_date } = req.body || {};
  if (!item_no || discount_amt == null || !start_date || !end_date) return res.status(400).json({ error: 'missing_fields' });
  try {
    const { rows } = await db.query(
      `INSERT INTO discounts (item_no, discount_amt, start_date, end_date, created_by)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [item_no, discount_amt, start_date, end_date, req.user?.username || 'system']
    );
    res.status(201).json(rows[0]);
  } catch (e) { console.error(e); res.status(500).json({ error: 'server_error' }); }
});

router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { item_no, discount_amt, start_date, end_date } = req.body || {};
  try {
    const { rows } = await db.query(
      `UPDATE discounts SET 
         item_no = COALESCE($1, item_no),
         discount_amt = COALESCE($2, discount_amt),
         start_date = COALESCE($3, start_date),
         end_date = COALESCE($4, end_date)
       WHERE id = $5 RETURNING *`,
      [item_no, discount_amt, start_date, end_date, id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'not_found' });
    res.json(rows[0]);
  } catch (e) { console.error(e); res.status(500).json({ error: 'server_error' }); }
});

router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM discounts WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (e) { console.error(e); res.status(500).json({ error: 'server_error' }); }
});

module.exports = router;
