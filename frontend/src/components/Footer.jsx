import React from 'react';
import { Sparkles, Phone, Mail, MapPin, Heart, Shield, Server } from 'lucide-react';

export default function Footer({ apiOnline }) {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-brand-col">
          <div className="brand-logo">
            <div className="logo-icon-wrapper">
              <Sparkles className="logo-icon" size={22} />
            </div>
            <div className="brand-text">
              <span className="brand-name">BRILHO<span className="text-highlight">TOTAL</span></span>
              <span className="brand-tagline">Soluções em Higienização</span>
            </div>
          </div>
          <p className="footer-desc">
            Transformando espaços em ambientes impecáveis, saudáveis e acolhedores com soluções completas de limpeza por m².
          </p>
          <div className="footer-badges">
            <div className="badge-item">
              <Shield size={15} />
              <span>Garantia de Qualidade</span>
            </div>
            <div className="badge-item">
              <Server size={15} />
              <span>{apiOnline ? 'Servidor API Conectado' : 'Aguardando Servidor'}</span>
            </div>
          </div>
        </div>

        <div className="footer-links-col">
          <h4>Navegação</h4>
          <ul>
            <li><a href="#orcamento-form">Simulador de Orçamento</a></li>
            <li><a href="#servicos">Tabela de Serviços</a></li>
            <li><a href="#beneficios">Diferenciais & Garantias</a></li>
          </ul>
        </div>

        <div className="footer-links-col">
          <h4>Serviços</h4>
          <ul>
            <li><span>Limpeza Pós-Obra</span></li>
            <li><span>Comercial & Escritórios</span></li>
            <li><span>Residencial Padrão</span></li>
            <li><span>Pré-Mudança & Pesada</span></li>
          </ul>
        </div>

        <div className="footer-contact-col">
          <h4>Fale Conosco</h4>
          <div className="contact-item">
            <Phone size={16} />
            <span>(11) 98888-7777</span>
          </div>
          <div className="contact-item">
            <Mail size={16} />
            <span>contato@brilhototal.com.br</span>
          </div>
          <div className="contact-item">
            <MapPin size={16} />
            <span>Atendimento em toda a Grande SP e Região</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Brilho Total. Todos os direitos reservados.</p>
        <p className="footer-credit">
          Desenvolvido com tecnologia moderna, integrado via Supabase & Express API.
        </p>
      </div>
    </footer>
  );
}
