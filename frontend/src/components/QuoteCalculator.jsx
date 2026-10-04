import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  Calculator, 
  Send, 
  Sparkles, 
  User, 
  Phone, 
  Mail, 
  Maximize2, 
  Layers, 
  CheckCircle, 
  AlertCircle, 
  MessageSquare, 
  Copy, 
  Check, 
  X,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { submitOrcamento } from '../services/api';

const QUICK_AREAS = [50, 90, 150, 250, 500];

export default function QuoteCalculator({ 
  tipos = [], 
  loadingTipos = false, 
  errorTipos = null, 
  onRetryTipos,
  selectedTipoId, 
  onSelectTipo, 
  onQuoteCreated 
}) {
  const [formData, setFormData] = useState({
    nome_cliente: '',
    telefone: '',
    email: '',
    metragem: 80,
    tipo_limpeza_id: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successModalData, setSuccessModalData] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Sync selectedTipoId from parent or auto-select first available type
  useEffect(() => {
    if (selectedTipoId) {
      setFormData(prev => ({ ...prev, tipo_limpeza_id: String(selectedTipoId) }));
    } else if (tipos && tipos.length > 0) {
      setFormData(prev => {
        if (!prev.tipo_limpeza_id) {
          return { ...prev, tipo_limpeza_id: String(tipos[0].id_limpeza) };
        }
        return prev;
      });
    }
  }, [selectedTipoId, tipos]);

  // Selected cleaning type object (falls back to first type if available)
  const currentTipo = useMemo(() => {
    if (!tipos || tipos.length === 0) return null;
    return tipos.find(t => String(t.id_limpeza) === String(formData.tipo_limpeza_id)) || tipos[0];
  }, [tipos, formData.tipo_limpeza_id]);

  // Calculated estimated total
  const estimatedTotal = useMemo(() => {
    if (!currentTipo || !formData.metragem) return 0;
    return Number(formData.metragem) * Number(currentTipo.preco_por_m2);
  }, [currentTipo, formData.metragem]);

  // Mask phone
  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    
    if (value.length > 6) {
      value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    } else if (value.length > 2) {
      value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else if (value.length > 0) {
      value = `(${value}`;
    }
    setFormData(prev => ({ ...prev, telefone: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.nome_cliente.trim()) {
      setErrorMessage('Por favor, informe seu nome completo.');
      return;
    }
    if (!formData.telefone.trim() || formData.telefone.replace(/\D/g, '').length < 10) {
      setErrorMessage('Por favor, informe um telefone/WhatsApp válido com DDD.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage('Por favor, informe um endereço de e-mail válido.');
      return;
    }
    if (!formData.metragem || Number(formData.metragem) <= 0) {
      setErrorMessage('A metragem deve ser maior que 0 m².');
      return;
    }

    let finalTipoId = formData.tipo_limpeza_id;
    if (!finalTipoId && tipos && tipos.length > 0) {
      finalTipoId = String(tipos[0].id_limpeza);
      setFormData(prev => ({ ...prev, tipo_limpeza_id: finalTipoId }));
    }

    if (!finalTipoId) {
      setErrorMessage('Nenhum serviço selecionado. Por favor, aguarde o carregamento ou recarregue a página.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await submitOrcamento({
        ...formData,
        tipo_limpeza_id: finalTipoId,
        telefone: formData.telefone.replace(/\D/g, '') // Send clean phone digits
      });

      // Trigger celebratory confetti
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });

      const pedido = res.pedido || res;
      setSuccessModalData({
        pedido,
        tipoNome: currentTipo?.nome || 'Limpeza Profissional',
        precoM2: currentTipo?.preco_por_m2 || 0,
      });

      if (onQuoteCreated) {
        onQuoteCreated(pedido);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Erro ao conectar ao servidor. Verifique se o backend está em execução.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyQuote = (pedidoId, valor) => {
    const text = `Orçamento Brilho Total #${pedidoId} | Valor Estimado: R$ ${Number(valor).toFixed(2)}`;
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <section id="orcamento-form" className="calculator-section">
      <div className="section-header">
        <div className="section-tag">
          <Calculator size={14} />
          <span>Simulação em Tempo Real</span>
        </div>
        <h2 className="section-title">Calcule e Solicite seu Orçamento</h2>
        <p className="section-subtitle">
          Sem burocracia: veja o cálculo exato na hora e garanta o agendamento da sua limpeza.
        </p>
      </div>

      <div className="calculator-container glass-panel">
        <form onSubmit={handleSubmit} className="calculator-form">
          <div className="form-grid">
            
            {/* Field: Nome */}
            <div className="form-group">
              <label htmlFor="nome_cliente" className="form-label">
                <User size={16} />
                <span>Seu Nome Completo *</span>
              </label>
              <input
                id="nome_cliente"
                type="text"
                placeholder="Ex: Mariana Souza Santos"
                className="form-input"
                value={formData.nome_cliente}
                onChange={(e) => setFormData({ ...formData, nome_cliente: e.target.value })}
                required
              />
            </div>

            {/* Field: WhatsApp / Telefone */}
            <div className="form-group">
              <label htmlFor="telefone" className="form-label">
                <Phone size={16} />
                <span>WhatsApp / Telefone *</span>
              </label>
              <input
                id="telefone"
                type="tel"
                placeholder="(11) 98888-7777"
                className="form-input"
                value={formData.telefone}
                onChange={handlePhoneChange}
                required
              />
            </div>

            {/* Field: E-mail */}
            <div className="form-group full-width">
              <label htmlFor="email" className="form-label">
                <Mail size={16} />
                <span>E-mail para envio da proposta *</span>
              </label>
              <input
                id="email"
                type="email"
                placeholder="Ex: seuemail@empresa.com.br"
                className="form-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            {/* Field: Tipo de Limpeza */}
            <div className="form-group full-width">
              <label className="form-label">
                <Layers size={16} />
                <span>Selecione a Modalidade do Serviço *</span>
              </label>
              <div className="tipo-selector-grid">
                {loadingTipos && (
                  <div className="tipo-loading-placeholder">
                    <span className="spinner-dot"></span>
                    <span>Carregando modalidades do banco de dados...</span>
                  </div>
                )}

                {!loadingTipos && errorTipos && (
                  <div className="tipo-error-box">
                    <span>⚠️ {errorTipos}</span>
                    {onRetryTipos && (
                      <button type="button" className="btn-retry-tipos" onClick={onRetryTipos}>
                        Tentar carregar novamente
                      </button>
                    )}
                  </div>
                )}

                {!loadingTipos && !errorTipos && tipos.length === 0 && (
                  <div className="tipo-error-box">
                    <span>Nenhum tipo de limpeza cadastrado no banco.</span>
                    {onRetryTipos && (
                      <button type="button" className="btn-retry-tipos" onClick={onRetryTipos}>
                        Recarregar
                      </button>
                    )}
                  </div>
                )}

                {!loadingTipos && tipos.map((tipo) => {
                  const active = String(formData.tipo_limpeza_id) === String(tipo.id_limpeza);
                  return (
                    <button
                      key={tipo.id_limpeza}
                      type="button"
                      className={`tipo-option-btn ${active ? 'active' : ''}`}
                      onClick={() => {
                        setFormData({ ...formData, tipo_limpeza_id: String(tipo.id_limpeza) });
                        if (onSelectTipo) onSelectTipo(tipo.id_limpeza);
                      }}
                    >
                      <div className="tipo-btn-header">
                        <span className="tipo-btn-title">{tipo.nome}</span>
                        <span className="tipo-btn-rate">
                          R$ {Number(tipo.preco_por_m2).toFixed(2)}/m²
                        </span>
                      </div>
                      <span className="tipo-btn-desc">{tipo.descricao}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Field: Metragem com Slider e Quick Buttons */}
            <div className="form-group full-width metragem-block">
              <div className="metragem-header">
                <label htmlFor="metragem-input" className="form-label">
                  <Maximize2 size={16} />
                  <span>Área Total do Imóvel (m²) *</span>
                </label>
                <div className="metragem-badge">
                  <span className="metragem-number">{formData.metragem}</span>
                  <span className="metragem-unit">m²</span>
                </div>
              </div>

              <input
                type="range"
                id="metragem-slider"
                min="20"
                max="800"
                step="5"
                value={formData.metragem}
                onChange={(e) => setFormData({ ...formData, metragem: Number(e.target.value) })}
                className="range-slider"
              />

              <div className="quick-areas-wrapper">
                <span className="quick-label">Sugestões rápidas:</span>
                <div className="quick-buttons">
                  {QUICK_AREAS.map((area) => (
                    <button
                      key={area}
                      type="button"
                      className={`btn-quick-area ${formData.metragem === area ? 'active' : ''}`}
                      onClick={() => setFormData({ ...formData, metragem: area })}
                    >
                      {area} m²
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {errorMessage && (
            <div className="error-alert">
              <AlertCircle size={18} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Live Price Estimation Card */}
          <div className="live-estimate-card">
            <div className="estimate-details">
              <span className="estimate-tag">Valor Total Estimado</span>
              <div className="estimate-formula">
                <span>{formData.metragem} m²</span>
                <span className="operator">×</span>
                <span>R$ {Number(currentTipo?.preco_por_m2 || 0).toFixed(2)}/m²</span>
                <span className="operator">=</span>
              </div>
              <div className="estimate-price">
                <span className="currency">R$</span>
                <span className="val">
                  {estimatedTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="btn-submit-quote"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="spinner-dot"></span>
                  <span>Processando Orçamento...</span>
                </>
              ) : (
                <>
                  <Send size={18} />
                  <span>Confirmar & Salvar Orçamento</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      {successModalData && (
        <div className="modal-backdrop">
          <div className="modal-content glass-panel animate-fade-in">
            <button 
              type="button" 
              className="modal-close-btn"
              onClick={() => setSuccessModalData(null)}
            >
              <X size={20} />
            </button>

            <div className="modal-icon-success">
              <CheckCircle size={48} className="text-emerald" />
            </div>

            <h3 className="modal-title">Orçamento Gerado com Sucesso!</h3>
            <p className="modal-description">
              Seu pedido foi registrado no sistema com o número <strong>#{successModalData.pedido?.id_pedidos}</strong>.
            </p>

            <div className="modal-summary-box">
              <div className="summary-row">
                <span>Cliente:</span>
                <strong>{successModalData.pedido?.nome_cliente}</strong>
              </div>
              <div className="summary-row">
                <span>Serviço:</span>
                <strong>{successModalData.tipoNome}</strong>
              </div>
              <div className="summary-row">
                <span>Metragem:</span>
                <strong>{successModalData.pedido?.metragem} m²</strong>
              </div>
              <div className="summary-row">
                <span>Status Inicial:</span>
                <span className="badge-pending">{successModalData.pedido?.status || 'Pendente'}</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-row total-highlight">
                <span>Valor Total:</span>
                <span className="modal-price">
                  R$ {Number(successModalData.pedido?.valor_total).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="modal-actions">
              <a
                href={`https://wa.me/55${formData.telefone.replace(/\D/g, '')}?text=${encodeURIComponent(
                  `Olá! Acabei de gerar o orçamento #${successModalData.pedido?.id_pedidos} na Brilho Total.\nServiço: ${successModalData.tipoNome}\nÁrea: ${successModalData.pedido?.metragem}m²\nValor Estimado: R$ ${Number(successModalData.pedido?.valor_total).toFixed(2)}\nGostaria de prosseguir!`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="btn-whatsapp-action"
              >
                <MessageSquare size={18} />
                <span>Enviar no WhatsApp</span>
                <ExternalLink size={14} />
              </a>

              <button
                type="button"
                className="btn-copy-action"
                onClick={() => handleCopyQuote(successModalData.pedido?.id_pedidos, successModalData.pedido?.valor_total)}
              >
                {copiedLink ? <Check size={16} /> : <Copy size={16} />}
                <span>{copiedLink ? 'Copiado!' : 'Copiar Resumo'}</span>
              </button>
            </div>

            <button
              type="button"
              className="btn-done"
              onClick={() => {
                setSuccessModalData(null);
                setFormData(prev => ({ ...prev, nome_cliente: '', email: '', telefone: '' }));
              }}
            >
              Fazer outra simulação
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
