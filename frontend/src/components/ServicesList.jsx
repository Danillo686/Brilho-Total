import React from 'react';
import { Home, Building2, HardHat, Sparkles, Check, ArrowRight, Loader2 } from 'lucide-react';

const iconMap = {
  'Residencial': Home,
  'Comercial': Building2,
  'Pós-Obra': HardHat,
  'Pós Obra': HardHat,
  'Pré-Mudança': Sparkles,
  'Faxina': Sparkles,
};

function getServiceIcon(nome) {
  for (const key of Object.keys(iconMap)) {
    if (nome.toLowerCase().includes(key.toLowerCase())) {
      return iconMap[key];
    }
  }
  return Sparkles;
}

export default function ServicesList({ tipos, loading, error, onSelectTipo, selectedTipoId }) {
  return (
    <section id="servicos" className="services-section">
      <div className="section-header">
        <div className="section-tag">
          <Sparkles size={14} />
          <span>Soluções Sob Medida</span>
        </div>
        <h2 className="section-title">Nossos Serviços Especializados</h2>
        <p className="section-subtitle">
          Preços justos e transparentes calculados diretamente por metro quadrado (m²).
          Escolha o tipo de limpeza ideal para o seu espaço.
        </p>
      </div>

      {loading && (
        <div className="loading-state">
          <Loader2 className="animate-spin text-cyan" size={36} />
          <p>Carregando tabela de serviços atualizada...</p>
        </div>
      )}

      {error && (
        <div className="error-card">
          <p>⚠️ {error}</p>
          <button 
            type="button" 
            className="btn-retry" 
            onClick={() => window.location.reload()}
          >
            Tentar novamente
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="services-grid">
          {tipos.map((tipo) => {
            const Icon = getServiceIcon(tipo.nome);
            const isSelected = selectedTipoId === tipo.id_limpeza;

            return (
              <div 
                key={tipo.id_limpeza}
                className={`service-card ${isSelected ? 'selected' : ''}`}
                onClick={() => onSelectTipo(tipo.id_limpeza)}
              >
                {isSelected && (
                  <span className="selected-badge">
                    <Check size={14} /> Selecionado
                  </span>
                )}
                <div className="service-icon-box">
                  <Icon size={28} />
                </div>
                <h3 className="service-title">{tipo.nome}</h3>
                <p className="service-description">{tipo.descricao}</p>
                
                <div className="service-pricing">
                  <span className="price-label">A partir de</span>
                  <div className="price-value">
                    <span className="currency">R$</span>
                    <span className="amount">
                      {Number(tipo.preco_por_m2).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="unit">/ m²</span>
                  </div>
                </div>

                <button 
                  type="button"
                  className={`btn-select-service ${isSelected ? 'btn-active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTipo(tipo.id_limpeza);
                    const formElement = document.getElementById('orcamento-form');
                    if (formElement) {
                      formElement.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  <span>{isSelected ? 'Selecionado' : 'Simular este serviço'}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
