import React, { useState, useMemo } from 'react';
import { 
  ClipboardList, 
  Search, 
  RotateCw, 
  DollarSign, 
  Maximize, 
  Calendar, 
  MessageSquare, 
  User, 
  Mail, 
  Phone, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight,
  Filter
} from 'lucide-react';

export default function OrdersDashboard({ orcamentos, loading, error, onRefresh }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Metrics calculation
  const metrics = useMemo(() => {
    if (!orcamentos || orcamentos.length === 0) {
      return { totalCount: 0, totalValue: 0, avgArea: 0 };
    }
    const totalCount = orcamentos.length;
    const totalValue = orcamentos.reduce((acc, curr) => acc + (Number(curr.valor_total) || 0), 0);
    const totalArea = orcamentos.reduce((acc, curr) => acc + (Number(curr.metragem) || 0), 0);
    const avgArea = totalArea / totalCount;
    return { totalCount, totalValue, avgArea };
  }, [orcamentos]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return (orcamentos || []).filter((item) => {
      const matchesSearch = 
        item.nome_cliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.telefone?.includes(searchTerm);

      const matchesStatus = statusFilter === 'ALL' || item.status?.toUpperCase() === statusFilter.toUpperCase();

      return matchesSearch && matchesStatus;
    });
  }, [orcamentos, searchTerm, statusFilter]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Recente';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <section className="dashboard-section">
      <div className="section-header">
        <div className="section-tag">
          <ClipboardList size={14} />
          <span>Controle Administrativo</span>
        </div>
        <div className="dashboard-header-flex">
          <div>
            <h2 className="section-title">Pedidos de Orçamento Recebidos</h2>
            <p className="section-subtitle">
              Acompanhe todas as solicitações salvas no banco de dados e contate os clientes diretamente.
            </p>
          </div>
          <button 
            type="button" 
            className="btn-refresh" 
            onClick={onRefresh}
            disabled={loading}
          >
            <RotateCw size={16} className={loading ? 'animate-spin' : ''} />
            <span>Atualizar Lista</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="dashboard-metrics-grid">
        <div className="metric-card glass-panel">
          <div className="metric-icon-box blue">
            <ClipboardList size={22} />
          </div>
          <div className="metric-data">
            <span className="metric-label">Total de Solicitações</span>
            <strong className="metric-value">{metrics.totalCount}</strong>
          </div>
        </div>

        <div className="metric-card glass-panel">
          <div className="metric-icon-box emerald">
            <DollarSign size={22} />
          </div>
          <div className="metric-data">
            <span className="metric-label">Valor Total Estimado</span>
            <strong className="metric-value text-emerald">
              R$ {metrics.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </strong>
          </div>
        </div>

        <div className="metric-card glass-panel">
          <div className="metric-icon-box cyan">
            <Maximize size={22} />
          </div>
          <div className="metric-data">
            <span className="metric-label">Média por Imóvel</span>
            <strong className="metric-value">
              {metrics.avgArea.toFixed(0)} m²
            </strong>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="dashboard-controls glass-panel">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por cliente, e-mail ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <Filter size={16} className="text-muted" />
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="ALL">Todos os Status</option>
            <option value="PENDENTE">Pendentes</option>
            <option value="CONCLUIDO">Concluídos</option>
          </select>
        </div>
      </div>

      {/* Table / List */}
      <div className="dashboard-table-container glass-panel">
        {loading && (
          <div className="dashboard-state">
            <RotateCw size={32} className="animate-spin text-cyan" />
            <p>Carregando solicitações do banco de dados...</p>
          </div>
        )}

        {error && !loading && (
          <div className="dashboard-state error-text">
            <p>⚠️ {error}</p>
            <button type="button" onClick={onRefresh} className="btn-retry">Tentar recarregar</button>
          </div>
        )}

        {!loading && !error && filteredOrders.length === 0 && (
          <div className="dashboard-state empty-state">
            <ClipboardList size={40} className="text-dim" />
            <p>Nenhum pedido de orçamento encontrado com os filtros aplicados.</p>
          </div>
        )}

        {!loading && !error && filteredOrders.length > 0 && (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Contato</th>
                  <th>Modalidade</th>
                  <th>Metragem</th>
                  <th>Valor Total</th>
                  <th>Status</th>
                  <th>Data</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => {
                  const cleanPhone = (order.telefone || '').replace(/\D/g, '');
                  const serviceName = order.tipos_limpeza?.nome || `Tipo #${order.tipo_de_limpeza}`;

                  return (
                    <tr key={order.id_pedidos} className="table-row">
                      <td className="cell-id">
                        <span className="id-badge">#{order.id_pedidos}</span>
                      </td>

                      <td className="cell-client">
                        <div className="client-info">
                          <strong className="client-name">{order.nome_cliente}</strong>
                          <span className="client-email">{order.email}</span>
                        </div>
                      </td>

                      <td className="cell-contact">
                        <span className="phone-text">{order.telefone}</span>
                      </td>

                      <td className="cell-type">
                        <span className="service-tag">{serviceName}</span>
                      </td>

                      <td className="cell-area">
                        <strong>{order.metragem}</strong> m²
                      </td>

                      <td className="cell-total">
                        <strong className="price-tag">
                          R$ {Number(order.valor_total).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </strong>
                      </td>

                      <td className="cell-status">
                        <span className={`status-pill ${order.status?.toLowerCase() === 'pendente' ? 'pill-pending' : 'pill-done'}`}>
                          {order.status || 'Pendente'}
                        </span>
                      </td>

                      <td className="cell-date">
                        <span className="date-text">{formatDate(order.criado_em)}</span>
                      </td>

                      <td className="cell-actions">
                        {cleanPhone ? (
                          <a
                            href={`https://wa.me/55${cleanPhone}?text=${encodeURIComponent(
                              `Olá ${order.nome_cliente}, aqui é da Brilho Total! Recebemos sua solicitação de orçamento #${order.id_pedidos} para ${serviceName} (${order.metragem}m²). Podemos confirmar sua data?`
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="btn-whatsapp-cell"
                            title="Conversar no WhatsApp"
                          >
                            <MessageSquare size={16} />
                            <span>WhatsApp</span>
                          </a>
                        ) : (
                          <span className="text-dim">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
