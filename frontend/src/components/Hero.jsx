import React from 'react';
import { Sparkles, CheckCircle2, ShieldCheck, Clock, Award, ArrowRight } from 'lucide-react';

export default function Hero({ onStartQuote }) {
  return (
    <section className="hero-section">
      <div className="hero-badge">
        <Sparkles size={16} className="text-cyan" />
        <span>Líder em higienização e limpeza de alta performance</span>
      </div>

      <h1 className="hero-title">
        Seu ambiente impecável com{' '}
        <span className="gradient-text">precisão, brilho e agilidade</span>
      </h1>

      <p className="hero-subtitle">
        Calcule seu orçamento em segundos com base na metragem exata do seu imóvel.
        Atendemos residências, escritórios comerciais e obras com tecnologia e equipe especializada.
      </p>

      <div className="hero-actions">
        <button 
          type="button" 
          className="btn-hero-primary"
          onClick={onStartQuote}
        >
          <span>Simular Orçamento Agora</span>
          <ArrowRight size={18} />
        </button>

        <a href="#servicos" className="btn-hero-secondary">
          <span>Ver Tabela de Serviços</span>
        </a>
      </div>

      <div className="hero-highlights">
        <div className="highlight-item">
          <div className="highlight-icon-wrapper">
            <Clock size={20} />
          </div>
          <div>
            <strong>Cálculo Instantâneo</strong>
            <p>Orçamento automático em tempo real</p>
          </div>
        </div>

        <div className="highlight-item">
          <div className="highlight-icon-wrapper">
            <ShieldCheck size={20} />
          </div>
          <div>
            <strong>Garantia Total</strong>
            <p>Profissionais qualificados e segurados</p>
          </div>
        </div>

        <div className="highlight-item">
          <div className="highlight-icon-wrapper">
            <Award size={20} />
          </div>
          <div>
            <strong>Produtos Premium</strong>
            <p>Ecológicos e hipoalergênicos</p>
          </div>
        </div>
      </div>
    </section>
  );
}
