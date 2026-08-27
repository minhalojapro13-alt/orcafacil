import React from 'react';
import { Quote, Client } from '../../types';
import { StatusBadge } from '../Common/StatusBadge';
import { formatCurrencyBRL, formatDateBR, buildWhatsAppMessage, getWhatsAppShareUrl } from '../../services/storageService';
import { MessageSquare, Calendar, ChevronRight, User } from 'lucide-react';

interface QuoteCardProps {
  quote: Quote;
  client?: Client;
  onSelect: (quoteId: string) => void;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({
  quote,
  client,
  onSelect,
}) => {
  const clientName = client?.name || 'Cliente';
  const clientPhone = client?.phone || '';

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const message = buildWhatsAppMessage(
      clientName,
      quote.serviceTitle,
      quote.total,
      quote.validUntil,
      quote.executionDeadline,
      quote.quoteNumber
    );
    const url = getWhatsAppShareUrl(clientPhone, message);
    window.open(url, '_blank');
  };

  return (
    <div
      id={`quote-card-${quote.id}`}
      onClick={() => onSelect(quote.id)}
      className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:border-blue-300 transition-all cursor-pointer space-y-3"
    >
      {/* Top row: Quote number, date, status */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
            {quote.quoteNumber}
          </span>
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDateBR(quote.createdAt)}
          </span>
        </div>
        <StatusBadge status={quote.status} size="sm" />
      </div>

      {/* Main info */}
      <div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
          <User className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-700 font-semibold">{clientName}</span>
        </div>
        <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2">
          {quote.serviceTitle}
        </h4>
      </div>

      {/* Bottom row: Total value and actions */}
      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Valor Total</span>
          <span className="text-base sm:text-lg font-black text-slate-900">
            {formatCurrencyBRL(quote.total)}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            id={`quote-card-wa-btn-${quote.id}`}
            onClick={handleWhatsAppClick}
            className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-600 font-medium text-xs flex items-center gap-1 transition-colors cursor-pointer"
            title="Enviar no WhatsApp"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline font-semibold">WhatsApp</span>
          </button>

          <button
            id={`quote-card-view-btn-${quote.id}`}
            onClick={() => onSelect(quote.id)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Ver Detalhes"
          >
            <ChevronRight className="w-5 h-5 text-slate-500" />
          </button>
        </div>
      </div>
    </div>
  );
};
