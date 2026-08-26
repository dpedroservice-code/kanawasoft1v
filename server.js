// server.js - Servidor com API
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;

// Dados mock da API
const DB_MOCK = {
    produtos: [
        { id: 1, nome: 'Produto 1', preco: 100, estoque: 50 },
        { id: 2, nome: 'Produto 2', preco: 200, estoque: 30 }
    ],
    clientes: [
        { id: 1, nome: 'Cliente 1', telefone: '+244 900 000 000' }
    ],
    vendas: [
        { id: 1, cliente: 'Cliente 1', total: 1000, data: new Date().toISOString() }
    ]
};

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    
    // API endpoints
    if (pathname.startsWith('/api/')) {
        const endpoint = pathname.replace('/api/', '');
        
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        
        if (req.method === 'OPTIONS') {
            res.writeHead(200);
            res.end();
            return;
        }
        
        if (endpoint === 'health') {
            res.writeHead(200);
            res.end(JSON.stringify({ status: 'ok', version: '11.0', timestamp: new Date().toISOString() }));
            return;
        }
        
        if (DB_MOCK[endpoint]) {
            res.writeHead(200);
            res.end(JSON.stringify(DB_MOCK[endpoint]));
            return;
        }
        
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Endpoint not found' }));
        return;
    }
    
    // Arquivos estáticos
    let filePath = pathname === '/' ? '/index.html' : pathname;
    filePath = path.join(__dirname, filePath);
    
    const ext = path.extname(filePath);
    const contentType = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon',
        '.txt': 'text/plain'
    }[ext] || 'text/plain';
    
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end('404 - Arquivo não encontrado');
            return;
        }
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
});

server.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log('🚀 KANAWA SOFT SERVER');
    console.log('='.repeat(50));
    console.log(`📁 Servidor: http://localhost:${PORT}`);
    console.log(`📡 API: http://localhost:${PORT}/api/health`);
    console.log(`📂 Diretório: ${__dirname}`);
    console.log('='.repeat(50));
    console.log('✅ Servidor pronto para uso!');
});