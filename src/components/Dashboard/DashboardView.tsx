import React from 'react';
import { Client, Quote, User } from '../../types';
import { StatusBadge } from '../Common/StatusBadge';
import { formatCurrencyBRL } from '../../services/storageService';
import {
  Users,
  FileText,
  TrendingUp,
  Plus,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';

interface DashboardViewProps {
  user: User | null;
  clients: Client[];
  quotes: Quote[];
  onNewQuoteClick: () => void;
  onSelectQuote: (quoteId: string) => void;
  onNavigateToQuotes: () => void;
  onNavigateToClients: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  clients,
  quotes,
  onNewQuoteClick,
  onSelectQuote,
  onNavigateToQuotes,
  onNavigateToClients,
}) => {
  // Metric calculations
  const totalClients = clients.length;
  const totalQuotes = quotes.length;
  const approvedQuotes = quotes.filter((q) => q.status === 'aprovado');
  const pendingQuotes = quotes.filter((q) => q.status === 'enviado' || q.status === 'rascunho');

  // Valor em negociação: soma de rascunhos e enviados
  const totalInNegotiation = pendingQuotes.reduce((acc, curr) => acc + curr.total, 0);

  // Valor aprovado/fechado
  const totalApprovedValue = approvedQuotes.reduce((acc, curr) => acc + curr.total, 0);

  const getClientById = (clientId: string) => {
    return clients.find((c) => c.id === clientId);
  };

  const recentQuotes = [...quotes].slice(0, 5);

  return (
    <div className="space-y-4 pb-20">
      {/* 2-Column Quick Metric Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <button
          onClick={onNavigateToClients}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 transition-all text-left cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Clientes
            </span>
            <Users className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            {totalClients}
          </p>
          <span className="text-[11px] font-semibold text-blue-600 group-hover:underline inline-flex items-center gap-0.5 mt-0.5">
            Gerenciar contatos <ArrowUpRight className="w-3 h-3" />
          </span>
        </button>

        <button
          onClick={onNavigateToQuotes}
          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 transition-all text-left cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Orçamentos
            </span>
            <FileText className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            {totalQuotes}
          </p>
          <span className="text-[11px] font-semibold text-blue-600 group-hover:underline inline-flex items-center gap-0.5 mt-0.5">
            Ver histórico <ArrowUpRight className="w-3 h-3" />
          </span>
        </button>
      </div>

      {/* Hero Sleek Blue Card (Em Negociação + CTA) */}
      <div className="bg-blue-600 p-5 sm:p-6 rounded-2xl shadow-lg shadow-blue-500/20 text-white flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold opacity-80 tracking-widest">
              Em Negociação (Pendentes)
            </span>
            <span className="text-[11px] font-bold bg-white/20 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
              {pendingQuotes.length} {pendingQuotes.length === 1 ? 'proposta' : 'propostas'}
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-black mt-2">
            {formatCurrencyBRL(totalInNegotiation)}
          </p>
          <p className="text-xs text-blue-100 mt-0.5">
            {user?.name ? `${user.name.split(' ')[0]}, orçamentos` : 'Orçamentos'} enviados aguardando resposta do cliente.
          </p>
        </div>

        <button
          id="dashboard-hero-new-quote-btn"
          onClick={onNewQuoteClick}
          className="w-full bg-white text-blue-600 font-bold py-3.5 px-4 rounded-xl shadow-md hover:bg-blue-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>Criar Novo Orçamento</span>
        </button>
      </div>

      {/* Guaranteed Revenue Card (Aprovados) */}
      <div className="bg-emerald-500/10 p-4 sm:p-5 rounded-2xl border border-emerald-200/80 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            Total Fechado (Aprovado)
          </span>
          <p className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1">
            {formatCurrencyBRL(totalApprovedValue)}
          </p>
          <p className="text-xs text-emerald-600 font-medium mt-0.5">
            {approvedQuotes.length} {approvedQuotes.length === 1 ? 'orçamento aprovado' : 'orçamentos aprovados'}
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
          <Sparkles className="w-6 h-6" />
        </div>
      </div>

      {/* Recent Activity Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center font-bold text-slate-700 text-sm">
          <span>Últimos Orçamentos</span>
          {quotes.length > 0 && (
            <button
              onClick={onNavigateToQuotes}
              className="text-xs text-blue-600 font-bold hover:text-blue-800 hover:underline cursor-pointer"
            >
              Ver todos ({quotes.length})
            </button>
          )}
        </div>

        {recentQuotes.length === 0 ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">
                Nenhum orçamento cadastrado ainda
              </p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                Crie orçamentos detalhados em poucos toques e envie direto pelo WhatsApp.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
              <button
                onClick={onNewQuoteClick}
                className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm cursor-pointer inline-flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Criar Primeiro Orçamento</span>
              </button>
              {clients.length === 0 && (
                <button
                  onClick={onNavigateToClients}
                  className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer inline-flex items-center justify-center gap-1.5"
                >
                  <Users className="w-4 h-4" />
                  <span>Cadastrar Cliente</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentQuotes.map((quote) => {
              const client = getClientById(quote.clientId);
              return (
                <div
                  key={quote.id}
                  onClick={() => onSelectQuote(quote.id)}
                  className="p-3.5 sm:p-4 hover:bg-slate-50/80 transition-colors cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                        {quote.quoteNumber}
                      </span>
                      <StatusBadge status={quote.status} size="sm" />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm truncate mt-1 group-hover:text-blue-600 transition-colors">
                      {quote.serviceTitle}
                    </h4>
                    <p className="text-xs text-slate-500 truncate">
                      {client?.name || 'Cliente'} • {client?.phone || ''}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-slate-400 block font-medium uppercase">
                      Total
                    </span>
                    <span className="font-extrabold text-slate-900 text-sm sm:text-base">
                      {formatCurrencyBRL(quote.total)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

