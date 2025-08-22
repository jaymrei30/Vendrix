const bcrypt = require('bcrypt');
const db = require('../db');

async function seed(){
  try {
    console.log('Seeding...');
    const adminHash = await bcrypt.hash('password', 10);
    await db.query(`
      INSERT INTO users (username, password, created_by)
      VALUES ($1,$2,$3)
      ON CONFLICT (username) DO NOTHING
    `, ['admin', adminHash, 'system']);

    await db.query(`INSERT INTO uom(description, created_by) VALUES ('PCS','system'), ('BOX','system') 
      ON CONFLICT DO NOTHING`);

    await db.query(`
      INSERT INTO items (item_no, description, unit_price, uom_id, qty_available, created_by)
      VALUES 
        ('ITM-001','Sample Item A', 100, (SELECT id FROM uom WHERE description='PCS'), 10, 'system'),
        ('ITM-002','Sample Item B', 250, (SELECT id FROM uom WHERE description='BOX'), 5, 'system')
      ON CONFLICT (item_no) DO NOTHING
    `);

    console.log('Seed complete.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error', err);
    process.exit(1);
  }
}
seed();
