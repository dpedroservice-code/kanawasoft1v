// fix-erros.js - Correção de erros comuns

// 1. Funções de formatação
window.formatarDataInput = function(data) {
    if (!data) return '';
    const d = new Date(data);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().split('T')[0];
};

window.formatarHoraInput = function(hora) {
    if (!hora) return '00:00';
    const parts = hora.split(':');
    if (parts.length < 2) return '00:00';
    return `${String(parts[0]).padStart(2, '0')}:${String(parts[1]).padStart(2, '0')}`;
};

window.formatarNumeroInput = function(valor) {
    if (valor === undefined || valor === null) return '';
    return String(valor);
};

// 2. Função de imagem padrão
window.getImagemPadrao = function(imagem, tipo = 'produto') {
    if (imagem && (imagem.startsWith('data:') || imagem.startsWith('http') || imagem.startsWith('/'))) {
        return imagem;
    }
    
    const padrao = {
        produto: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="%23999" stroke-width="1"%3E%3Crect x="3" y="3" width="18" height="18" rx="2"/%3E%3Ccircle cx="8.5" cy="8.5" r="2.5"/%3E%3Cpath d="M21 15l-5-5L5 21"/%3E%3C/svg%3E',
        usuario: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="%23999" stroke-width="1"%3E%3Ccircle cx="12" cy="8" r="4"/%3E%3Cpath d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/%3E%3C/svg%3E'
    };
    return padrao[tipo] || padrao.produto;
};

// 3. Correção do manifest
window.criarManifestDinamico = function() {
    if (document.querySelector('link[rel="manifest"]')) return;
    
    const manifest = {
        name: "Kanawa Soft",
        short_name: "Kanawa",
        start_url: window.location.pathname,
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#667eea",
        icons: [
            { src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='192' height='192' viewBox='0 0 24 24' fill='%23667eea'%3E%3Crect x='2' y='2' width='20' height='20' rx='4'/%3E%3Ctext x='12' y='16' text-anchor='middle' font-size='14' fill='white' font-weight='bold'%3EKS%3C/text%3E%3C/svg%3E", sizes: "192x192", type: "image/svg+xml" }
        ]
    };
    
    const link = document.createElement('link');
    link.rel = 'manifest';
    link.href = 'data:application/json,' + encodeURIComponent(JSON.stringify(manifest));
    document.head.appendChild(link);
};

// 4. Inicialização
document.addEventListener('DOMContentLoaded', function() {
    window.criarManifestDinamico();
    console.log('✅ Correções de erros aplicadas!');
});