import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ServicesList from './components/ServicesList';
import QuoteCalculator from './components/QuoteCalculator';
import OrdersDashboard from './components/OrdersDashboard';
import BenefitsAndFaq from './components/BenefitsAndFaq';
import Footer from './components/Footer';
import { fetchTiposLimpeza, fetchOrcamentos, checkApiHealth } from './services/api';
import { CheckCircle2, AlertTriangle, ArrowUp } from 'lucide-react';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('simulator'); // 'simulator' | 'dashboard'
  const [tipos, setTipos] = useState([]);
  const [orcamentos, setOrcamentos] = useState([]);
  const [selectedTipoId, setSelectedTipoId] = useState(null);
  
  const [loadingTipos, setLoadingTipos] = useState(true);
  const [loadingOrcamentos, setLoadingOrcamentos] = useState(false);
  const [errorTipos, setErrorTipos] = useState(null);
  const [errorOrcamentos, setErrorOrcamentos] = useState(null);
  const [apiOnline, setApiOnline] = useState(false);
  const [toast, setToast] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const showNotification = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Load cleaning types from backend
  const loadTipos = useCallback(async () => {
    try {
      setLoadingTipos(true);
      setErrorTipos(null);
      const data = await fetchTiposLimpeza();
      setTipos(Array.isArray(data) ? data : []);
      if (data && data.length > 0 && !selectedTipoId) {
        setSelectedTipoId(data[0].id_limpeza);
      }
      setApiOnline(true);
    } catch (err) {
      console.error(err);
      setErrorTipos('Não foi possível carregar os tipos de limpeza. Verifique se o backend está rodando.');
      setApiOnline(false);
    } finally {
      setLoadingTipos(false);
    }
  }, [selectedTipoId]);

  // Load quotes from backend
  const loadOrcamentos = useCallback(async () => {
    try {
      setLoadingOrcamentos(true);
      setErrorOrcamentos(null);
      const data = await fetchOrcamentos();
      setOrcamentos(Array.isArray(data) ? data : []);
      setApiOnline(true);
    } catch (err) {
      console.error(err);
      setErrorOrcamentos('Não foi possível carregar os pedidos. Verifique se o backend está rodando.');
    } finally {
      setLoadingOrcamentos(false);
    }
  }, []);

  // Check health and initial load
  useEffect(() => {
    const init = async () => {
      const isHealthy = await checkApiHealth();
      setApiOnline(isHealthy);
      await loadTipos();
      await loadOrcamentos();
    };
    init();

    // Health check ping every 25 seconds
    const interval = setInterval(async () => {
      const isHealthy = await checkApiHealth();
      setApiOnline(isHealthy);
    }, 25000);

    return () => clearInterval(interval);
  }, [loadTipos, loadOrcamentos]);

  // Scroll listener for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSelectTipo = (id) => {
    setSelectedTipoId(id);
    setActiveTab('simulator');
    const formElement = document.getElementById('orcamento-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleStartQuote = () => {
    setActiveTab('simulator');
    const formElement = document.getElementById('orcamento-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleQuoteCreated = (newPedido) => {
    showNotification('Orçamento salvo com sucesso no banco de dados!', 'success');
    // Refresh list of orders
    loadOrcamentos();
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-layout">
      {/* Toast Notification */}
      {toast && (
        <div className={`toast-notification ${toast.type === 'success' ? 'toast-success' : 'toast-error'} animate-fade-in`}>
          {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        apiOnline={apiOnline} 
      />

      {/* Main Content Area */}
      <main className="main-content">
        {/* Navigation Tabs Header */}
        <div className="view-switch-banner">
          <div className="tab-pill-container">
            <button
              type="button"
              className={`tab-pill-btn ${activeTab === 'simulator' ? 'active' : ''}`}
              onClick={() => setActiveTab('simulator')}
            >
              Simulador & Contratação
            </button>
            <button
              type="button"
              className={`tab-pill-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('dashboard');
                loadOrcamentos();
              }}
            >
              Painel de Orçamentos ({orcamentos.length})
            </button>
          </div>
        </div>

        {activeTab === 'simulator' ? (
          <>
            <Hero onStartQuote={handleStartQuote} />

            <QuoteCalculator
              tipos={tipos}
              loadingTipos={loadingTipos}
              errorTipos={errorTipos}
              onRetryTipos={loadTipos}
              selectedTipoId={selectedTipoId}
              onSelectTipo={setSelectedTipoId}
              onQuoteCreated={handleQuoteCreated}
            />

            <ServicesList
              tipos={tipos}
              loading={loadingTipos}
              error={errorTipos}
              selectedTipoId={selectedTipoId}
              onSelectTipo={handleSelectTipo}
            />

            <BenefitsAndFaq />
          </>
        ) : (
          <OrdersDashboard
            orcamentos={orcamentos}
            loading={loadingOrcamentos}
            error={errorOrcamentos}
            onRefresh={loadOrcamentos}
          />
        )}
      </main>

      {/* Back to top button */}
      {showScrollTop && (
        <button
          type="button"
          className="btn-scroll-top animate-fade-in"
          onClick={scrollToTop}
          title="Voltar ao topo"
        >
          <ArrowUp size={20} />
        </button>
      )}

      {/* Footer */}
      <Footer apiOnline={apiOnline} />
    </div>
  );
}
