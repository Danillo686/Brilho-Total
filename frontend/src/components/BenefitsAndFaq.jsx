import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Award, 
  Clock, 
  ChevronDown, 
  CheckCircle2, 
  HelpCircle,
  ThumbsUp
} from 'lucide-react';

const FAQS = [
  {
    q: 'Como é calculado o valor do orçamento?',
    a: 'O valor é calculado de forma transparente: multiplicamos a metragem total (m²) pelo valor específico da modalidade escolhida (ex: Pós-Obra, Comercial ou Residencial). Você vê o cálculo exato antes mesmo de enviar o pedido.'
  },
  {
    q: 'A equipe traz todos os produtos e equipamentos?',
    a: 'Sim! Nossa equipe comparece com maquinário profissional (aspiradores industriais, enceradeiras, lavadoras de alta pressão quando necessário) e produtos específicos e ecológicos regularizados pela ANVISA.'
  },
  {
    q: 'Quanto tempo leva para receber o contato após a simulação?',
    a: 'Assim que você gera o pedido na plataforma, nossa central recebe a solicitação imediatamente no painel e entra em contato via WhatsApp em poucos minutos para confirmar o melhor dia e horário.'
  },
  {
    q: 'E se a metragem do imóvel for aproximada?',
    a: 'Não se preocupe! A simulação serve como excelente estimativa inicial. Caso prefira, nossa equipe pode realizar a conferência detalhada no local antes de iniciar o serviço.'
  }
];

export default function BenefitsAndFaq() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <section id="beneficios" className="benefits-faq-section">
      <div className="section-header">
        <div className="section-tag">
          <Award size={14} />
          <span>Por Que Nos Escolher</span>
        </div>
        <h2 className="section-title">O Padrão de Excelência Brilho Total</h2>
        <p className="section-subtitle">
          Compromisso rigoroso com a higiene, saúde e preservação de cada detalhe do seu patrimônio.
        </p>
      </div>

      <div className="benefits-grid">
        <div className="benefit-card glass-panel">
          <div className="benefit-icon-wrapper">
            <ShieldCheck size={28} />
          </div>
          <h3>Segurança & Confiança</h3>
          <p>Profissionais com antecedentes checados, uniformizados, treinados e com supervisão técnica constante.</p>
        </div>

        <div className="benefit-card glass-panel">
          <div className="benefit-icon-wrapper">
            <Sparkles size={28} />
          </div>
          <h3>Produtos de Grau Hospitalar</h3>
          <p>Químicos de alta eficiência aprovados pela ANVISA, livres de odores agressivos e seguros para pets e crianças.</p>
        </div>

        <div className="benefit-card glass-panel">
          <div className="benefit-icon-wrapper">
            <Clock size={28} />
          </div>
          <h3>Pontualidade & Agilidade</h3>
          <p>Cronogramas cumpridos rigorosamente. Entregamos o ambiente pronto e perfumado no prazo acordado.</p>
        </div>

        <div className="benefit-card glass-panel">
          <div className="benefit-icon-wrapper">
            <ThumbsUp size={28} />
          </div>
          <h3>Garantia de Satisfação</h3>
          <p>Checklist de entrega minucioso. Só finalizamos o atendimento após a sua completa aprovação.</p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="faq-container glass-panel">
        <div className="faq-header">
          <div className="faq-icon-title">
            <HelpCircle size={22} className="text-cyan" />
            <h3>Perguntas Frequentes</h3>
          </div>
          <p>Tire suas dúvidas sobre o processo de orçamento e execução dos serviços.</p>
        </div>

        <div className="faq-list">
          {FAQS.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div 
                key={idx} 
                className={`faq-item ${isOpen ? 'open' : ''}`}
                onClick={() => toggleFaq(idx)}
              >
                <div className="faq-question">
                  <span>{item.q}</span>
                  <ChevronDown size={18} className={`chevron ${isOpen ? 'rotate' : ''}`} />
                </div>
                {isOpen && (
                  <div className="faq-answer animate-fade-in">
                    <p>{item.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
