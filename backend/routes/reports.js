const express = require('express');
const router = express.Router();
const db = require('../db');
const ExcelJS = require('exceljs');

router.get('/inventory', async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT item_no, description, qty_available AS current_stock
      FROM items
      ORDER BY description ASC
    `);
    res.json(rows);
  } catch (e) { console.error(e); res.status(500).json({ error: 'server_error' }); }
});

router.get('/inventory/export', async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT item_no, description, qty_available AS current_stock
      FROM items
      ORDER BY description ASC
    `);
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Current Stock');
    ws.columns = [
      { header: 'ItemNo', key: 'item_no', width: 20 },
      { header: 'Description', key: 'description', width: 40 },
      { header: 'CurrentStock', key: 'current_stock', width: 20 },
    ];
    rows.forEach(r => ws.addRow(r));
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="Vendrix_Current_Stock.xlsx"');
    await wb.xlsx.write(res); res.end();
  } catch (e) { console.error(e); res.status(500).json({ error: 'server_error' }); }
});

module.exports = router;
