// ============================================================
// CORREÇÃO COMPLETA - KANAWA SOFT ERP (VERSÃO FINAL DEFINITIVA)
// ============================================================

(function() {
    'use strict';
    
    console.log('🔧 Aplicando correções definitivas...');

    // ============================================================
    // 1. CORREÇÃO DO MANIFEST (CORS)
    // ============================================================
    
    function criarManifestDinamico() {
        try {
            document.querySelectorAll('link[rel="manifest"]').forEach(el => el.remove());
            
            const manifest = {
                name: "Kanawa Soft ERP",
                short_name: "Kanawa",
                description: "Sistema de Gestão Empresarial",
                start_url: window.location.pathname,
                display: "standalone",
                background_color: "#f5f7fa",
                theme_color: "#667eea",
                orientation: "portrait-primary",
                icons: [
                    {
                        src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='192' height='192' viewBox='0 0 24 24' fill='%23667eea'%3E%3Crect x='2' y='2' width='20' height='20' rx='4'/%3E%3Ctext x='12' y='16' text-anchor='middle' font-size='14' fill='white' font-weight='bold'%3EKS%3C/text%3E%3C/svg%3E",
                        sizes: "192x192",
                        type: "image/svg+xml",
                        purpose: "any maskable"
                    },
                    {
                        src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='512' height='512' viewBox='0 0 24 24' fill='%23667eea'%3E%3Crect x='2' y='2' width='20' height='20' rx='4'/%3E%3Ctext x='12' y='16' text-anchor='middle' font-size='16' fill='white' font-weight='bold'%3EKS%3C/text%3E%3C/svg%3E",
                        sizes: "512x512",
                        type: "image/svg+xml",
                        purpose: "any maskable"
                    }
                ]
            };
            
            const link = document.createElement('link');
            link.rel = 'manifest';
            link.href = 'data:application/json,' + encodeURIComponent(JSON.stringify(manifest));
            document.head.appendChild(link);
            
            console.log('✅ Manifest criado dinamicamente');
        } catch (e) {
            console.warn('⚠️ Erro ao criar manifest:', e);
        }
    }

    // ============================================================
    // 2. FUNÇÃO renderizarProdutosLoja (CORRIGIDA)
    // ============================================================
    
    window.renderizarProdutosLoja = function() {
        console.log('🛍️ Renderizando produtos da loja...');
        const produtos = DB.produtos || [];
        const carrinho = window.ecommerceCarrinhos || [];
        const idsCarrinho = new Set(carrinho.map(i => i.produtoId || i.id));
        
        const grid = document.getElementById('lojaProdutos');
        if (!grid) return;
        
        if (produtos.length === 0) {
            grid.innerHTML = `
                <div style="grid-column:1/-1;text-align:center;padding:40px;color:#999;">
                    <div style="font-size:3rem;margin-bottom:10px;">🛍️</div>
                    <p>Nenhum produto disponível no momento</p>
                    <button onclick="openModule('produtos')" style="margin-top:10px;padding:10px 25px;background:#667eea;color:#fff;border:none;border-radius:8px;cursor:pointer;">
                        Cadastrar Produtos
                    </button>
                </div>
            `;
            return;
        }
        
        grid.innerHTML = produtos.map(p => {
            const noCarrinho = idsCarrinho.has(p.id);
            return `
                <div class="loja-produto-card" data-id="${p.id}">
                    <div class="icone">📦</div>
                    <div class="nome">${p.nome}</div>
                    <div class="preco">${formatCurrency(p.preco || 0)}</div>
                    <div style="font-size:0.7rem;color:#999;margin:4px 0;">${p.categoria || 'Geral'}</div>
                    ${noCarrinho ? `
                        <button class="btn-comprar no-carrinho" onclick="verCarrinhoLoja()">✅ No Carrinho</button>
                    ` : `
                        <button class="btn-comprar" onclick="adicionarAoCarrinhoLoja('${p.id}')">🛒 Adicionar</button>
                    `}
                </div>
            `;
        }).join('');
        
        console.log('✅ Produtos renderizados:', produtos.length);
    };

    // ============================================================
    // 3. FUNÇÃO verCarrinhoLoja
    // ============================================================
    
    window.verCarrinhoLoja = function() {
        const carrinho = document.querySelector('.loja-carrinho');
        if (carrinho) {
            carrinho.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // ============================================================
    // 4. FUNÇÃO renderLojaVirtual (COMPLETA)
    // ============================================================
    
    window.renderLojaVirtual = function() {
        console.log('🛍️ Renderizando Loja Virtual...');
        
        const carrinho = window.ecommerceCarrinhos || [];
        const subtotal = carrinho.reduce((s, i) => s + ((i.preco || 0) * (i.quantidade || 0)), 0);
        
        const container = document.querySelector('.main-content') || document.querySelector('#app') || document.body;
        
        container.innerHTML = `
            <style>
                .loja-container { max-width:1200px;margin:0 auto;padding:20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif; }
                .loja-header { background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;padding:30px 20px;border-radius:12px;text-align:center;margin-bottom:25px; }
                .loja-header h1 { margin:0;font-size:2rem; }
                .loja-header p { opacity:0.9;margin-top:8px; }
                .loja-grid { display:grid;grid-template-columns:2fr 1fr;gap:25px; }
                .loja-produtos { display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:20px; }
                .loja-produto-card { background:#fff;border-radius:12px;padding:15px;box-shadow:0 2px 10px rgba(0,0,0,0.08);border:1px solid #eee;transition:transform 0.2s;cursor:pointer;text-align:center; }
                .loja-produto-card:hover { transform:translateY(-5px);box-shadow:0 5px 20px rgba(0,0,0,0.15); }
                .loja-produto-card .icone { font-size:3rem;margin-bottom:10px; }
                .loja-produto-card .nome { font-weight:600;font-size:0.9rem;margin:8px 0 4px; }
                .loja-produto-card .preco { font-size:1.2rem;font-weight:700;color:#667eea; }
                .loja-produto-card .btn-comprar { width:100%;margin-top:10px;padding:8px;background:#667eea;color:#fff;border:none;border-radius:8px;font-weight:600;cursor:pointer;transition:background 0.2s; }
                .loja-produto-card .btn-comprar:hover { background:#5a6fd6; }
                .loja-produto-card .btn-comprar.no-carrinho { background:#27ae60; }
                .loja-carrinho { background:#fff;border-radius:12px;padding:20px;box-shadow:0 2px 10px rgba(0,0,0,0.08);border:1px solid #eee;position:sticky;top:20px; }
                .loja-carrinho h3 { margin-top:0;display:flex;justify-content:space-between;align-items:center; }
                .loja-carrinho-item { display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #eee; }
                .loja-carrinho-item .info { flex:1; }
                .loja-carrinho-item .info .nome { font-weight:600;font-size:0.85rem; }
                .loja-carrinho-item .info .detalhes { font-size:0.7rem;color:#666; }
                .loja-carrinho-item .qtd { display:flex;align-items:center;gap:6px; }
                .loja-carrinho-item .qtd button { width:26px;height:26px;border:1px solid #ddd;border-radius:50%;background:#fff;cursor:pointer;font-weight:700; }
                .loja-carrinho-item .qtd button:hover { background:#f0f0f0; }
                .loja-carrinho-item .qtd span { min-width:25px;text-align:center;font-weight:600; }
                .loja-carrinho-item .subtotal { font-weight:700;color:#667eea;min-width:70px;text-align:right;font-size:0.9rem; }
                .loja-carrinho-item .btn-remove { background:none;border:none;color:#e74c3c;cursor:pointer;padding:5px; }
                .loja-total { margin-top:15px;padding-top:15px;border-top:2px solid #eee; }
                .loja-total .linha { display:flex;justify-content:space-between;padding:4px 0;font-size:0.9rem; }
                .loja-total .linha.total { font-size:1.2rem;font-weight:700;color:#667eea;padding-top:10px;border-top:2px solid #eee; }
                .loja-acoes { display:flex;gap:8px;margin-top:15px;flex-wrap:wrap; }
                .loja-acoes .btn { flex:1;padding:10px;border:none;border-radius:8px;font-weight:600;cursor:pointer;text-align:center; }
                .loja-acoes .btn-success { background:#27ae60;color:#fff; }
                .loja-acoes .btn-success:hover { background:#219a52; }
                .loja-acoes .btn-danger { background:#e74c3c;color:#fff; }
                .loja-acoes .btn-danger:hover { background:#c0392b; }
                .loja-vazio { text-align:center;padding:40px 20px;color:#999; }
                .loja-vazio .icone { font-size:3rem;margin-bottom:10px;opacity:0.3; }
                .loja-vazio h3 { color:#333;margin-bottom:5px; }
                .loja-footer { text-align:center;margin-top:40px;padding:20px;border-top:1px solid #eee;font-size:0.8rem;color:#999; }
                .loja-busca { display:flex;gap:10px;margin-bottom:20px;flex-wrap:wrap; }
                .loja-busca input { flex:1;min-width:200px;padding:10px 15px;border:1px solid #ddd;border-radius:8px;font-size:0.95rem; }
                .loja-busca button { padding:10px 25px;background:#667eea;color:#fff;border:none;border-radius:8px;font-weight:600;cursor:pointer; }
                @media (max-width:768px) { .loja-grid { grid-template-columns:1fr; } .loja-produtos { grid-template-columns:repeat(auto-fill,minmax(160px,1fr)); } }
                @media (max-width:480px) { .loja-produtos { grid-template-columns:1fr 1fr;gap:10px; } .loja-produto-card { padding:10px; } .loja-produto-card .icone { font-size:2rem; } }
            </style>
            
            <div class="loja-container">
                <div class="loja-header">
                    <h1>🛍️ Kanawa Soft Shop</h1>
                    <p>Encontre os melhores produtos com preços incríveis!</p>
                </div>
                
                <div class="loja-busca">
                    <input type="text" id="lojaBusca" placeholder="🔍 Buscar produtos..." oninput="filtrarProdutosLoja(this.value)">
                    <button onclick="filtrarProdutosLoja()">Buscar</button>
                </div>
                
                <div class="loja-grid">
                    <div>
                        <div class="loja-produtos" id="lojaProdutos"></div>
                    </div>
                    
                    <div>
                        <div class="loja-carrinho">
                            <h3>🛒 Carrinho <span style="font-size:0.8rem;font-weight:normal;color:#666;">${carrinho.length} itens</span></h3>
                            
                            <div id="lojaCarrinhoItens">
                                ${carrinho.length > 0 ? carrinho.map(i => `
                                    <div class="loja-carrinho-item">
                                        <div class="info">
                                            <div class="nome">${i.nome}</div>
                                            <div class="detalhes">${formatCurrency(i.preco)} x ${i.quantidade}</div>
                                        </div>
                                        <div class="qtd">
                                            <button onclick="alterarQuantidadeCarrinhoLoja('${i.id}', -1)">-</button>
                                            <span>${i.quantidade}</span>
                                            <button onclick="alterarQuantidadeCarrinhoLoja('${i.id}', 1)">+</button>
                                        </div>
                                        <div class="subtotal">${formatCurrency((i.preco || 0) * (i.quantidade || 0))}</div>
                                        <button class="btn-remove" onclick="removerDoCarrinhoLoja('${i.id}')">✕</button>
                                    </div>
                                `).join('') : `
                                    <div class="loja-vazio">
                                        <div class="icone">🛒</div>
                                        <h3>Seu carrinho está vazio</h3>
                                        <p style="font-size:0.9rem;">Adicione produtos para começar</p>
                                    </div>
                                `}
                            </div>
                            
                            ${carrinho.length > 0 ? `
                                <div class="loja-total">
                                    <div class="linha">
                                        <span>Subtotal</span>
                                        <span>${formatCurrency(subtotal)}</span>
                                    </div>
                                    <div class="linha total">
                                        <span>Total</span>
                                        <span>${formatCurrency(subtotal)}</span>
                                    </div>
                                </div>
                                <div class="loja-acoes">
                                    <button class="btn btn-danger" onclick="limparCarrinhoLoja()">🗑️ Limpar</button>
                                    <button class="btn btn-success" onclick="finalizarPedidoLoja()">✅ Finalizar</button>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
                
                <div class="loja-footer">
                    <p>🛍️ Kanawa Soft Shop - © ${new Date().getFullYear()}</p>
                </div>
            </div>
        `;
        
        // Renderizar produtos
        setTimeout(window.renderizarProdutosLoja, 50);
        
        document.title = '🛍️ Kanawa Soft Shop';
        console.log('✅ Loja Virtual renderizada com sucesso!');
    };

    // ============================================================
    // 5. FUNÇÃO filtrarProdutosLoja
    // ============================================================
    
    window.filtrarProdutosLoja = function(texto) {
        const termo = texto?.toLowerCase() || document.getElementById('lojaBusca')?.value?.toLowerCase() || '';
        const cards = document.querySelectorAll('.loja-produto-card');
        cards.forEach(card => {
            const nome = card.dataset.nome || card.querySelector('.nome')?.textContent?.toLowerCase() || '';
            card.style.display = nome.includes(termo) ? '' : 'none';
        });
    };

    // ============================================================
    // 6. FUNÇÕES DO CARRINHO DA LOJA
    // ============================================================
    
    window.adicionarAoCarrinhoLoja = function(id) {
        const produtos = DB.produtos || [];
        const produto = produtos.find(p => p.id == id);
        
        if (!produto) {
            mostrarToast('❌ Produto não encontrado', 'error');
            return;
        }
        
        if (!window.ecommerceCarrinhos) window.ecommerceCarrinhos = [];
        
        const existente = window.ecommerceCarrinhos.find(i => i.produtoId == id);
        if (existente) {
            existente.quantidade = (existente.quantidade || 0) + 1;
        } else {
            window.ecommerceCarrinhos.push({
                id: 'cart_' + Date.now(),
                produtoId: produto.id,
                nome: produto.nome,
                preco: produto.preco || 0,
                quantidade: 1,
                imagem: produto.imagem || '',
                categoria: produto.categoria || 'Geral'
            });
        }
        
        localStorage.setItem('ecommerceCarrinhos', JSON.stringify(window.ecommerceCarrinhos));
        window.renderizarProdutosLoja();
        window.atualizarCarrinhoLoja();
        mostrarToast(`✅ ${produto.nome} adicionado ao carrinho!`, 'success');
    };
    
    window.atualizarCarrinhoLoja = function() {
        const carrinho = window.ecommerceCarrinhos || [];
        const container = document.getElementById('lojaCarrinhoItens');
        if (!container) return;
        
        const subtotal = carrinho.reduce((s, i) => s + ((i.preco || 0) * (i.quantidade || 0)), 0);
        
        if (carrinho.length === 0) {
            container.innerHTML = `
                <div class="loja-vazio">
                    <div class="icone">🛒</div>
                    <h3>Seu carrinho está vazio</h3>
                    <p style="font-size:0.9rem;">Adicione produtos para começar</p>
                </div>
            `;
            document.querySelector('.loja-total')?.remove();
            document.querySelector('.loja-acoes')?.remove();
            return;
        }
        
        container.innerHTML = carrinho.map(i => `
            <div class="loja-carrinho-item">
                <div class="info">
                    <div class="nome">${i.nome}</div>
                    <div class="detalhes">${formatCurrency(i.preco)} x ${i.quantidade}</div>
                </div>
                <div class="qtd">
                    <button onclick="alterarQuantidadeCarrinhoLoja('${i.id}', -1)">-</button>
                    <span>${i.quantidade}</span>
                    <button onclick="alterarQuantidadeCarrinhoLoja('${i.id}', 1)">+</button>
                </div>
                <div class="subtotal">${formatCurrency((i.preco || 0) * (i.quantidade || 0))}</div>
                <button class="btn-remove" onclick="removerDoCarrinhoLoja('${i.id}')">✕</button>
            </div>
        `).join('');
        
        // Atualizar total
        let totalDiv = document.querySelector('.loja-total');
        let acoesDiv = document.querySelector('.loja-acoes');
        
        if (!totalDiv) {
            const parent = container.parentElement;
            totalDiv = document.createElement('div');
            totalDiv.className = 'loja-total';
            parent.appendChild(totalDiv);
        }
        
        totalDiv.innerHTML = `
            <div class="linha">
                <span>Subtotal</span>
                <span>${formatCurrency(subtotal)}</span>
            </div>
            <div class="linha total">
                <span>Total</span>
                <span>${formatCurrency(subtotal)}</span>
            </div>
        `;
        
        if (!acoesDiv) {
            const parent = totalDiv.parentElement;
            acoesDiv = document.createElement('div');
            acoesDiv.className = 'loja-acoes';
            parent.appendChild(acoesDiv);
        }
        
        acoesDiv.innerHTML = `
            <button class="btn btn-danger" onclick="limparCarrinhoLoja()">🗑️ Limpar</button>
            <button class="btn btn-success" onclick="finalizarPedidoLoja()">✅ Finalizar</button>
        `;
    };
    
    window.removerDoCarrinhoLoja = function(id) {
        if (!window.ecommerceCarrinhos) return;
        window.ecommerceCarrinhos = window.ecommerceCarrinhos.filter(i => i.id !== id);
        localStorage.setItem('ecommerceCarrinhos', JSON.stringify(window.ecommerceCarrinhos));
        window.renderizarProdutosLoja();
        window.atualizarCarrinhoLoja();
        mostrarToast('🗑️ Item removido do carrinho', 'info');
    };
    
    window.alterarQuantidadeCarrinhoLoja = function(id, delta) {
        if (!window.ecommerceCarrinhos) return;
        const item = window.ecommerceCarrinhos.find(i => i.id === id);
        if (!item) return;
        
        const novaQtd = (item.quantidade || 0) + delta;
        if (novaQtd <= 0) {
            window.removerDoCarrinhoLoja(id);
            return;
        }
        item.quantidade = novaQtd;
        localStorage.setItem('ecommerceCarrinhos', JSON.stringify(window.ecommerceCarrinhos));
        window.renderizarProdutosLoja();
        window.atualizarCarrinhoLoja();
    };
    
    window.limparCarrinhoLoja = function() {
        if (!window.ecommerceCarrinhos || window.ecommerceCarrinhos.length === 0) {
            mostrarToast('Carrinho já está vazio', 'info');
            return;
        }
        if (!confirm('Tem certeza que deseja limpar o carrinho?')) return;
        window.ecommerceCarrinhos = [];
        localStorage.setItem('ecommerceCarrinhos', JSON.stringify(window.ecommerceCarrinhos));
        window.renderizarProdutosLoja();
        window.atualizarCarrinhoLoja();
        mostrarToast('🧹 Carrinho limpo!', 'info');
    };
    
    window.finalizarPedidoLoja = function() {
        const carrinho = window.ecommerceCarrinhos || [];
        if (carrinho.length === 0) {
            mostrarToast('❌ Carrinho vazio', 'error');
            return;
        }
        
        const subtotal = carrinho.reduce((s, i) => s + ((i.preco || 0) * (i.quantidade || 0)), 0);
        
        if (!confirm(`Finalizar pedido no valor de ${formatCurrency(subtotal)}?`)) return;
        
        if (!DB.pedidosEcommerce) DB.pedidosEcommerce = [];
        
        const pedido = {
            id: 'pedido_' + Date.now(),
            numero: 'PED-' + String(DB.pedidosEcommerce.length + 1).padStart(4, '0'),
            itens: JSON.parse(JSON.stringify(carrinho)),
            subtotal: subtotal,
            total: subtotal,
            data: new Date().toISOString(),
            status: 'pendente',
            origem: 'loja_virtual',
            cliente: 'Cliente Anônimo'
        };
        
        DB.pedidosEcommerce.push(pedido);
        localStorage.setItem('pedidosEcommerce', JSON.stringify(DB.pedidosEcommerce));
        
        window.ecommerceCarrinhos = [];
        localStorage.setItem('ecommerceCarrinhos', JSON.stringify(window.ecommerceCarrinhos));
        
        window.renderizarProdutosLoja();
        window.atualizarCarrinhoLoja();
        mostrarToast(`✅ Pedido ${pedido.numero} confirmado! Total: ${formatCurrency(subtotal)}`, 'success');
    };

    // ============================================================
    // 7. FUNÇÃO initLojaVirtual
    // ============================================================
    
    window.initLojaVirtual = function() {
        console.log('🛍️ Inicializando Loja Virtual...');
        
        const path = window.location.pathname;
        const params = new URLSearchParams(window.location.search);
        
        const isLojaRoute = path === '/loja' || path === '/loja/' || 
                            path === '/ecommerce' || path === '/ecommerce/' ||
                            path === '/loja-virtual' || path === '/loja-virtual/';
        
        const isLojaParam = params.get('modo') === 'loja' || params.get('loja') === 'true';
        
        if (isLojaRoute || isLojaParam) {
            if (typeof window.renderLojaVirtual === 'function') {
                window.renderLojaVirtual();
                return true;
            } else {
                console.error('❌ renderLojaVirtual não está definida');
                return false;
            }
        }
        return false;
    };

    // ============================================================
    // 8. CORREÇÃO DA API (MOCK)
    // ============================================================
    
    function configurarAPIMock() {
        if (typeof window.API_URL === 'undefined') {
            window.API_URL = '';
            window.API_MODE = 'local';
        }
        
        const originalFetch = window.fetch;
        
        window.fetch = function(url, options) {
            if (typeof url === 'string' && url.includes('/api/')) {
                const endpoint = url.split('/api/')[1]?.split('?')[0]?.split('/')[0];
                
                if (endpoint === 'health' || endpoint === '') {
                    return Promise.resolve({
                        ok: true,
                        status: 200,
                        json: () => Promise.resolve({ 
                            status: 'ok', 
                            version: '11.0', 
                            timestamp: new Date().toISOString(),
                            mode: 'offline'
                        })
                    });
                }
                
                if (DB[endpoint] !== undefined) {
                    return Promise.resolve({
                        ok: true,
                        status: 200,
                        json: () => Promise.resolve(DB[endpoint])
                    });
                }
                
                return Promise.resolve({
                    ok: false,
                    status: 404,
                    json: () => Promise.resolve({ error: 'Endpoint not found', endpoint: endpoint })
                });
            }
            
            try {
                return originalFetch(url, options);
            } catch(e) {
                return Promise.reject(new Error('Network error'));
            }
        };
        
        console.log('✅ API Mock configurada');
    }

    // ============================================================
    // 9. CORREÇÃO DA IMAGEM user.png
    // ============================================================
    
    function corrigirAvatar() {
        const avatar = document.getElementById('headerAvatar');
        if (avatar) {
            const user = JSON.parse(localStorage.getItem('kanawa_user') || '{}');
            const nome = user.name || 'Administrador';
            const inicial = nome.charAt(0).toUpperCase();
            avatar.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='16' fill='%23667eea'/%3E%3Ctext x='16' y='21' text-anchor='middle' fill='white' font-size='14' font-weight='bold'%3E${inicial}%3C/text%3E%3C/svg%3E`;
            avatar.onerror = null;
        }
    }

    // ============================================================
    // 10. MOSTRAR TOAST (FALLBACK)
    // ============================================================
    
    if (typeof window.mostrarToast === 'undefined') {
        window.mostrarToast = function(mensagem, tipo = 'info') {
            const toast = document.createElement('div');
            toast.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                padding: 12px 24px;
                border-radius: 8px;
                color: #fff;
                font-size: 0.9rem;
                font-weight: 500;
                background: ${tipo === 'success' ? '#2ecc71' : tipo === 'error' ? '#e74c3c' : tipo === 'warning' ? '#f39c12' : '#3498db'};
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                z-index: 9999;
                animation: slideUp 0.3s ease;
                max-width: 400px;
            `;
            toast.textContent = mensagem;
            document.body.appendChild(toast);
            setTimeout(() => {
                toast.style.animation = 'slideDown 0.3s ease forwards';
                setTimeout(() => toast.remove(), 300);
            }, 4000);
        };
    }

    // ============================================================
    // 11. INICIALIZAÇÃO
    // ============================================================
    
    function init() {
        criarManifestDinamico();
        configurarAPIMock();
        corrigirAvatar();
        
        if (typeof window.ecommerceCarrinhos === 'undefined') {
            window.ecommerceCarrinhos = JSON.parse(localStorage.getItem('ecommerceCarrinhos') || '[]');
        }
        
        // Inicializar a loja se estiver na rota correta
        setTimeout(() => {
            window.initLojaVirtual();
        }, 100);
        
        console.log('✅ Correções completas aplicadas!');
    }

    // ============================================================
    // 12. EXPORTAÇÃO
    // ============================================================
    
    window.criarManifestDinamico = criarManifestDinamico;
    window.configurarAPIMock = configurarAPIMock;
    window.renderLojaVirtual = renderLojaVirtual;
    window.renderizarProdutosLoja = renderizarProdutosLoja;
    window.filtrarProdutosLoja = filtrarProdutosLoja;
    window.atualizarCarrinhoLoja = atualizarCarrinhoLoja;
    window.verCarrinhoLoja = verCarrinhoLoja;
    window.initLojaVirtual = initLojaVirtual;
    window.corrigirAvatar = corrigirAvatar;

    // Executar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    console.log('✅ Todos os sistemas inicializados!');
    
})();