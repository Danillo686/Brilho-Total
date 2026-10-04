import React from 'react';
import { Sparkles, PhoneCall, ListFilter, ShieldCheck, Activity } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, apiOnline }) {
  return (
    <header className="navbar-container">
      <div className="navbar-content">
        <div className="brand-logo" onClick={() => setActiveTab('simulator')}>
          <div className="logo-icon-wrapper">
            <Sparkles className="logo-icon" size={24} />
          </div>
          <div className="brand-text">
            <span className="brand-name">BRILHO<span className="text-highlight">TOTAL</span></span>
            <span className="brand-tagline">Limpeza Profissional</span>
          </div>
        </div>

        <nav className="nav-links">
          <button 
            type="button"
            className={`nav-link ${activeTab === 'simulator' ? 'active' : ''}`}
            onClick={() => setActiveTab('simulator')}
          >
            Simular Orçamento
          </button>
          <a href="#servicos" className="nav-link" onClick={() => setActiveTab('simulator')}>
            Nossos Serviços
          </a>
          <a href="#beneficios" className="nav-link" onClick={() => setActiveTab('simulator')}>
            Diferenciais
          </a>
          <button 
            type="button"
            className={`nav-link dashboard-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <ListFilter size={17} />
            <span>Gestão de Pedidos</span>
          </button>
        </nav>

        <div className="navbar-actions">
          <div className={`api-status-badge ${apiOnline ? 'status-online' : 'status-offline'}`} title={apiOnline ? 'Backend Conectado (Porta 3001)' : 'Backend Desconectado'}>
            <span className="status-dot"></span>
            <span className="status-text">{apiOnline ? 'API Conectada' : 'Offline'}</span>
          </div>

          <a 
            href="#orcamento-form" 
            className="btn-primary-glow"
            onClick={() => setActiveTab('simulator')}
          >
            <Sparkles size={16} />
            <span>Pedir Orçamento</span>
          </a>
        </div>
      </div>
    </header>
  );
}
