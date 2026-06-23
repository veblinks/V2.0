const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const DB_FILE = 'keys.json';

// ====== БАЗА ======
function initDB() {
  if (!fs.existsSync(DB_FILE)) {
    const db = {};
    // ТОЛЬКО 1 КЛЮЧ ДЛЯ ТЕСТА
    db['12345'] = { used: false, fingerprint: null, activatedAt: null };
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
    console.log('📁 Создан keys.json');
  }
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

function saveDB(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  console.log('💾 БД сохранена');
}

// ====== API ======
app.post('/api/check', (req, res) => {
  const { key } = req.body;
  const db = initDB();
  console.log(`🔍 Проверка: ${key}`);
  
  if (db[key]) {
    res.json({ valid: true, used: db[key].used, fingerprint: db[key].fingerprint });
  } else {
    res.json({ valid: false });
  }
});

app.post('/api/activate', (req, res) => {
  const { key, fingerprint } = req.body;
  const db = initDB();
  console.log(`🔑 Активация: ${key}, fp: ${fingerprint?.substring(0, 10)}...`);
  
  if (!db[key]) {
    return res.json({ success: false, message: 'Key not found' });
  }
  
  // === ЕСЛИ УЖЕ ИСПОЛЬЗУЕТСЯ ===
  if (db[key].used && db[key].fingerprint !== fingerprint) {
    console.log(`❌ Ключ ${key} уже занят!`);
    return res.json({ success: false, message: 'ALREADY_USED' });
  }
  
  // === АКТИВИРУЕМ ===
  db[key].used = true;
  db[key].fingerprint = fingerprint;
  db[key].activatedAt = Date.now();
  saveDB(db);
  console.log(`✅ Ключ ${key} активирован!`);
  res.json({ success: true, message: 'Activated!' });
});

app.get('/api/stats', (req, res) => {
  const db = initDB();
  res.json(db);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server on port ${PORT}`);
  const db = initDB();
  console.log('📊 База:', db);
});
