// public/js/app.js - Kanawa Soft App
console.log('🚀 Kanawa Soft ERP v11.0.0 carregado!');

// Configurações
const APP_CONFIG = {
    version: '11.0.0',
    name: 'Kanawa Soft ERP',
    apiUrl: '/api'
};

// Classe principal
class KanawaApp {
    constructor() {
        this.modules = [];
        this.isOnline = navigator.onLine;
        this.init();
    }

    init() {
        console.log('📊 Inicializando Kanawa Soft...');
        this.checkStatus();
        this.setupEventListeners();
        this.loadModules();
        
        // Status da conexão
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.showNotification('Conectado!', 'success');
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.showNotification('Desconectado!', 'warning');
        });
    }

    async checkStatus() {
        try {
            const response = await fetch('/api/health');
            const data = await response.json();
            console.log('💚 API Status:', data);
            this.updateStatusBadge(data.running);
        } catch (error) {
            console.error('❌ Erro ao verificar status:', error);
            this.updateStatusBadge(false);
        }
    }

    updateStatusBadge(running) {
        const badge = document.querySelector('.badge');
        if (badge) {
            if (running) {
                badge.className = 'badge online';
                badge.innerHTML = '<span class="dot"></span> Online';
            } else {
                badge.className = 'badge offline';
                badge.innerHTML = '<span class="dot"></span> Offline';
            }
        }
    }

    setupEventListeners() {
        // Atalhos de teclado
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'S') {
                e.preventDefault();
                this.shutdown();
            }
            if (e.ctrlKey && e.shiftKey && e.key === 'R') {
                e.preventDefault();
                this.restart();
            }
            if (e.ctrlKey && e.shiftKey && e.key === ' ') {
                e.preventDefault();
                this.start();
            }
        });
    }

    loadModules() {
        // Aqui carregamos os módulos disponíveis
        const modules = [
            'Dashboard', 'PDV', 'Vendas', 'Produtos', 'Estoque',
            'Financeiro', 'RH', 'Projetos', 'Frota', 'CRM',
            'E-commerce', 'Documentos', 'Configurações'
        ];
        
        console.log(`📦 ${modules.length} módulos disponíveis`);
        this.modules = modules;
    }

    async start() {
        try {
            const response = await fetch('/api/start', { method: 'POST' });
            const data = await response.json();
            this.showNotification(data.message || 'Servidor iniciado!', 'success');
            this.checkStatus();
        } catch (error) {
            this.showNotification('Erro ao iniciar servidor', 'error');
        }
    }

    async restart() {
        try {
            const response = await fetch('/api/restart', { method: 'POST' });
            const data = await response.json();
            this.showNotification(data.message || 'Servidor reiniciando...', 'info');
            setTimeout(() => this.checkStatus(), 2000);
        } catch (error) {
            this.showNotification('Erro ao reiniciar servidor', 'error');
        }
    }

    async shutdown() {
        if (!confirm('⚠️ Tem certeza que deseja desligar o servidor?')) return;
        
        try {
            const response = await fetch('/api/shutdown', { method: 'POST' });
            const data = await response.json();
            this.showNotification(data.message || 'Servidor desligando...', 'warning');
            this.updateStatusBadge(false);
        } catch (error) {
            this.showNotification('Erro ao desligar servidor', 'error');
        }
    }

    showNotification(message, type = 'info') {
        const colors = {
            success: '#22c55e',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };
        
        // Criar toast
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 12px 24px;
            background: ${colors[type] || '#1a3a5c'};
            color: #fff;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 9999;
            animation: fadeIn 0.3s ease;
            font-size: 0.9rem;
            max-width: 400px;
        `;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    window.app = new KanawaApp();
});

console.log('📊 6 produtos, 3 clientes, 2 vendas');
console.log('📦 32 módulos disponíveis');