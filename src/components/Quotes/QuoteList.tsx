import React, { useState } from 'react';
import { Client, Quote, QuoteStatus } from '../../types';
import { QuoteCard } from './QuoteCard';
import { Search, Plus, FileText, Filter } from 'lucide-react';

interface QuoteListProps {
  quotes: Quote[];
  clients: Client[];
  onSelectQuote: (quoteId: string) => void;
  onNewQuoteClick: () => void;
}

export const QuoteList: React.FC<QuoteListProps> = ({
  quotes,
  clients,
  onSelectQuote,
  onNewQuoteClick,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<QuoteStatus | 'todos'>('todos');

  const getClientById = (clientId: string) => {
    return clients.find((c) => c.id === clientId);
  };

  const filteredQuotes = quotes.filter((quote) => {
    const client = getClientById(quote.clientId);
    const clientName = client?.name || '';
    const term = searchTerm.toLowerCase();

    const matchesSearch =
      quote.quoteNumber.toLowerCase().includes(term) ||
      quote.serviceTitle.toLowerCase().includes(term) ||
      clientName.toLowerCase().includes(term);

    const matchesStatus = statusFilter === 'todos' || quote.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const countByStatus = {
    todos: quotes.length,
    rascunho: quotes.filter((q) => q.status === 'rascunho').length,
    enviado: quotes.filter((q) => q.status === 'enviado').length,
    aprovado: quotes.filter((q) => q.status === 'aprovado').length,
    recusado: quotes.filter((q) => q.status === 'recusado').length,
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Orçamentos</h2>
          <p className="text-xs text-slate-500">
            {quotes.length} {quotes.length === 1 ? 'orçamento gerado' : 'orçamentos gerados'}
          </p>
        </div>

        <button
          id="quotes-new-btn"
          onClick={onNewQuoteClick}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Orçamento</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          id="quotes-search-input"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por número, cliente ou serviço..."
          className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 text-slate-800 placeholder:text-slate-400"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
          >
            Limpar
          </button>
        )}
      </div>

      {/* Status Filter Tabs (Horizontal Scrollable on Mobile) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {(
          [
            { id: 'todos', label: 'Todos' },
            { id: 'rascunho', label: 'Rascunhos' },
            { id: 'enviado', label: 'Enviados' },
            { id: 'aprovado', label: 'Aprovados' },
            { id: 'recusado', label: 'Recusados' },
          ] as const
        ).map((tab) => {
          const isActive = statusFilter === tab.id;
          const count = countByStatus[tab.id];

          return (
            <button
              key={tab.id}
              id={`filter-tab-${tab.id}`}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/70'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Quote cards list */}
      {filteredQuotes.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-slate-100 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            {searchTerm || statusFilter !== 'todos'
              ? 'Nenhum orçamento encontrado'
              : 'Nenhum orçamento criado ainda'}
          </h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
            {searchTerm || statusFilter !== 'todos'
              ? 'Tente ajustar os filtros ou buscar por outro termo.'
              : 'Clique no botão abaixo para criar seu primeiro orçamento em menos de 1 minuto.'}
          </p>
          {!searchTerm && statusFilter === 'todos' && (
            <button
              id="empty-create-quote-btn"
              onClick={onNewQuoteClick}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Criar Primeiro Orçamento</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filteredQuotes.map((quote) => (
            <QuoteCard
              key={quote.id}
              quote={quote}
              client={getClientById(quote.clientId)}
              onSelect={onSelectQuote}
            />
          ))}
        </div>
      )}
    </div>
  );
};
