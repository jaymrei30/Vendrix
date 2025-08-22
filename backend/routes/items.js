const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');
const multer = require('multer');
const XLSX = require('xlsx');
const fs = require('fs');

const upload = multer({ dest: process.env.UPLOAD_DIR || 'uploads' });

router.get('/', async (req, res) => {
  const { q } = req.query;
  try {
    let sql = `SELECT i.item_no, i.description, i.unit_price, u.description AS uom, i.qty_available, i.created_by, i.date_created, i.uom_id
               FROM items i LEFT JOIN uom u ON u.id = i.uom_id`;
    const params = [];
    if (q) { sql += ` WHERE i.item_no ILIKE $1 OR i.description ILIKE $1`; params.push(`%${q}%`); }
    sql += ` ORDER BY i.date_created DESC`;
    const { rows } = await db.query(sql, params);
    res.json(rows);
  } catch (e) { console.error(e); res.status(500).json({ error: 'server_error' }); }
});

router.post('/', auth, async (req, res) => {
  const { item_no, description, unit_price, uom_id, qty_available = 0 } = req.body || {};
  if (!item_no || !description) return res.status(400).json({ error: 'item_no & description required' });
  try {
    const { rows } = await db.query(
      `INSERT INTO items (item_no, description, unit_price, uom_id, qty_available, created_by)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [item_no, description, unit_price || 0, uom_id || null, qty_available, req.user?.username || 'system']
    );
    res.status(201).json(rows[0]);
  } catch (e) { console.error(e); res.status(500).json({ error: 'server_error' }); }
});

router.put('/:item_no', auth, async (req, res) => {
  const { item_no } = req.params;
  const { description, unit_price, uom_id, qty_available } = req.body || {};
  try {
    const { rows } = await db.query(
      `UPDATE items SET 
         description = COALESCE($1, description),
         unit_price = COALESCE($2, unit_price),
         uom_id = COALESCE($3, uom_id),
         qty_available = COALESCE($4, qty_available)
       WHERE item_no = $5 RETURNING *`,
      [description, unit_price, uom_id, qty_available, item_no]
    );
    if (!rows[0]) return res.status(404).json({ error: 'not_found' });
    res.json(rows[0]);
  } catch (e) { console.error(e); res.status(500).json({ error: 'server_error' }); }
});

router.delete('/:item_no', auth, async (req, res) => {
  const { item_no } = req.params;
  try {
    await db.query('DELETE FROM items WHERE item_no = $1', [item_no]);
    res.json({ success: true });
  } catch (e) { console.error(e); res.status(500).json({ error: 'server_error' }); }
});

router.post('/import', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'file_required' });
    const workbook = XLSX.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
    for (const r of rows) {
      const itemNo = String(r.ItemNo || r.item_no || '').trim();
      const desc = String(r.Description || r.description || '').trim();
      const price = parseFloat(r.UnitPrice || r.unit_price || 0) || 0;
      const uom = String(r.UOM || r.uom || '').trim();
      const qty = parseFloat(r.QtyAvailable || r.qty_available || 0) || 0;
      if (!itemNo || !desc) continue;
      let uomId = null;
      if (uom) {
        const u = await db.query('SELECT id FROM uom WHERE description = $1', [uom]);
        if (u.rows[0]) uomId = u.rows[0].id;
        else {
          const ins = await db.query('INSERT INTO uom(description, created_by) VALUES ($1,$2) RETURNING id',[uom, 'system']);
          uomId = ins.rows[0].id;
        }
      }
      await db.query(
        `INSERT INTO items (item_no, description, unit_price, uom_id, qty_available, created_by)
         VALUES ($1,$2,$3,$4,$5,$6)
         ON CONFLICT (item_no) DO UPDATE SET
           description = EXCLUDED.description,
           unit_price = EXCLUDED.unit_price,
           uom_id = EXCLUDED.uom_id,
           qty_available = EXCLUDED.qty_available`,
        [itemNo, desc, price, uomId, qty, 'system']
      );
    }
    try { require('fs').unlinkSync(req.file.path); } catch {}
    res.json({ success: true });
  } catch (e) { console.error(e); res.status(500).json({ error: 'server_error' }); }
});

module.exports = router;
