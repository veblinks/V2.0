// ============================================================
// ERROR HUB DNS - NODE.JS ВЕРСИЯ (proxy.js)
// ============================================================

const http = require('http');
const url = require('url');
const fs = require('fs');

const DNS_SERVER = "ultralow.dns.nextdns.io";

// ============================================================
// СОЗДАЁМ HTTP-СЕРВЕР
// ============================================================
const server = http.createServer((req, res) => {
    // НАСТРОЙКИ CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');
    
    // ОТВЕТ НА OPTIONS
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;
    
    // ============================================================
    // ГЛАВНАЯ СТРАНИЦА (GET)
    // ============================================================
    if (req.method === 'GET' && !query.action) {
        res.writeHead(200);
        res.end(JSON.stringify({
            status: 'ok',
            message: '🔥 ERROR HUB DNS активен',
            dns: DNS_SERVER,
            time: new Date().toISOString()
        }));
        return;
    }
    
    // ============================================================
    // ПИНГ (GET)
    // ============================================================
    if (req.method === 'GET' && query.ping) {
        res.writeHead(200);
        res.end(JSON.stringify({
            status: 'ok',
            message: 'pong',
            time: new Date().toISOString()
        }));
        return;
    }
    
    // ============================================================
    // KEEP-ALIVE (GET)
    // ============================================================
    if (req.method === 'GET' && query.keepalive) {
        res.writeHead(200);
        res.end(JSON.stringify({
            status: 'ok',
            message: 'keepalive',
            time: new Date().toISOString()
        }));
        return;
    }
    
    // ============================================================
    // ПОЛУЧАЕМ ДАННЫЕ ИЗ POST
    // ============================================================
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    
    req.on('end', () => {
        let data = {};
        try {
            data = JSON.parse(body);
        } catch (e) {
            data = {};
        }
        
        // ============================================================
        // УСТАНОВКА DNS (POST)
        // ============================================================
        if (req.method === 'POST' && query.action === 'dns') {
            const dns = data.dns || DNS_SERVER;
            res.writeHead(200);
            res.end(JSON.stringify({
                status: 'ok',
                dns: dns,
                message: `✅ DNS установлен: ${dns}`,
                note: 'Для применения DNS на Android нужен Private DNS'
            }));
            return;
        }
        
        // ============================================================
        // АИМ (POST)
        // ============================================================
        if (req.method === 'POST' && query.action === 'aim') {
            const action = data.action || 'activate';
            const isActive = action === 'activate';
            res.writeHead(200);
            res.end(JSON.stringify({
                status: isActive ? 'aim_active' : 'aim_inactive',
                message: isActive ? '🎯 Аим активирован!' : '🔴 Аим деактивирован!',
                aim: isActive
            }));
            return;
        }
        
        // ============================================================
        // НЕИЗВЕСТНЫЙ ЗАПРОС
        // ============================================================
        res.writeHead(404);
        res.end(JSON.stringify({
            status: 'error',
            message: 'Неизвестный запрос'
        }));
    });
});

// ============================================================
// ЗАПУСК СЕРВЕРА
// ============================================================
const PORT = 8080;
server.listen(PORT, () => {
    console.log('🔥 ERROR HUB DNS сервер запущен');
    console.log(`🌐 Адрес: http://localhost:${PORT}`);
    console.log(`📡 DNS сервер: ${DNS_SERVER}`);
    console.log('=' .repeat(50));
});

// ============================================================
// ОБРАБОТКА ЗАКРЫТИЯ
// ============================================================
process.on('SIGINT', () => {
    console.log('\n🔴 Сервер остановлен');
    process.exit();
});