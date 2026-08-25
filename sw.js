// ============================================================
// KANAWA SOFT ERP - SERVICE WORKER
// ============================================================

const CACHE_NAME = 'kanawa-soft-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/manifest.json',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
    'https://unpkg.com/html5-qrcode',
    'https://cdn.jsdelivr.net/npm/chart.js',
    'https://cdn.jsdelivr.net/npm/tesseract.js@4/dist/tesseract.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js'
];

// ============================================================
// INSTALAÇÃO DO SERVICE WORKER
// ============================================================
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Cache aberto');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => {
                console.log('[SW] Assets cacheados com sucesso');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('[SW] Erro ao cachear assets:', error);
            })
    );
});

// ============================================================
// ATIVAÇÃO DO SERVICE WORKER
// ============================================================
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[SW] Removendo cache antigo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
        .then(() => {
            console.log('[SW] Service Worker ativado');
            return self.clients.claim();
        })
    );
});

// ============================================================
// INTERCEPTAÇÃO DE REQUISIÇÕES (STRATEGY: CACHE FIRST / NETWORK FALLBACK)
// ============================================================
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Ignorar requisições para API (evitar erros)
    if (url.pathname.startsWith('/api/')) {
        // Tenta buscar da rede, mas não falha se offline
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    // Retorna a resposta da rede
                    return response;
                })
                .catch(() => {
                    // Se falhar, retorna um erro 503 amigável
                    return new Response(JSON.stringify({
                        error: 'API indisponível - Modo offline',
                        timestamp: new Date().toISOString()
                    }), {
                        status: 503,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                })
        );
        return;
    }

    // Ignorar requisições para outros domínios (CDNs, Google Fonts, etc.)
    if (url.origin !== self.location.origin) {
        // Tenta buscar da rede, com fallback para cache se disponível
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    // Clona a resposta para cachear
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                    return response;
                })
                .catch(() => {
                    // Fallback para cache
                    return caches.match(event.request);
                })
        );
        return;
    }

    // Estratégia: Cache First / Network Fallback para assets locais
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    // Retorna do cache
                    return cachedResponse;
                }

                // Se não estiver no cache, busca da rede
                return fetch(event.request)
                    .then((response) => {
                        // Clona a resposta para cachear
                        const responseClone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, responseClone);
                        });
                        return response;
                    })
                    .catch((error) => {
                        console.error('[SW] Erro ao buscar recurso:', error);
                        // Retorna uma resposta de fallback para HTML
                        if (event.request.headers.get('accept').includes('text/html')) {
                            return caches.match('/index.html');
                        }
                        return new Response('Recurso indisponível', {
                            status: 404,
                            statusText: 'Not Found'
                        });
                    });
            })
    );
});

// ============================================================
// SINCRONIZAÇÃO EM BACKGROUND (OFFLINE SUPPORT)
// ============================================================
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-vendas') {
        event.waitUntil(syncVendasOffline());
    }
});

async function syncVendasOffline() {
    console.log('[SW] Sincronizando vendas offline...');
    try {
        // Aqui você pode implementar a sincronização com a API
        // quando o usuário estiver online novamente
        const cache = await caches.open('vendas-offline');
        const requests = await cache.keys();
        
        for (const request of requests) {
            try {
                const response = await fetch(request);
                if (response.ok) {
                    await cache.delete(request);
                    console.log('[SW] Venda sincronizada:', request.url);
                }
            } catch (error) {
                console.error('[SW] Erro ao sincronizar venda:', error);
            }
        }
    } catch (error) {
        console.error('[SW] Erro na sincronização:', error);
    }
}

// ============================================================
// NOTIFICAÇÕES PUSH
// ============================================================
self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'Kanawa Soft ERP';
    const options = {
        body: data.body || 'Você tem uma nova notificação!',
        icon: 'https://i.ibb.co/CpKynFs5/logo.jpg',
        badge: 'https://i.ibb.co/CpKynFs5/logo.jpg',
        vibrate: [200, 100, 200],
        data: data.url || '/',
        actions: [
            {
                action: 'open',
                title: 'Abrir'
            },
            {
                action: 'close',
                title: 'Fechar'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'open') {
        const url = event.notification.data || '/';
        event.waitUntil(
            clients.openWindow(url)
        );
    }
});

// ============================================================
// MENSAGENS DO CLIENTE
// ============================================================
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

console.log('[SW] Service Worker carregado com sucesso!');
console.log('[SW] Cache Name:', CACHE_NAME);