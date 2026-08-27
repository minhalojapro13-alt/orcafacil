import React, { useState } from 'react';
import { Client, Quote, QuoteStatus, User } from '../../types';
import { StatusBadge } from '../Common/StatusBadge';
import {
  formatCurrencyBRL,
  formatDateBR,
  buildWhatsAppMessage,
  getWhatsAppShareUrl,
  sanitizePhoneForWhatsApp,
} from '../../services/storageService';
import {
  MessageSquare,
  Printer,
  Edit2,
  Trash2,
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  User as UserIcon,
  Package,
  FileText,
  DollarSign,
  Share2,
  CheckCircle2,
} from 'lucide-react';

interface QuoteDetailViewProps {
  quote: Quote;
  client?: Client;
  user?: User | null;
  onBack: () => void;
  onEdit: (quoteId: string) => void;
  onDelete: (quoteId: string) => void;
  onViewPdf: (quoteId: string) => void;
  onStatusChange: (quoteId: string, newStatus: QuoteStatus) => void;
}

export const QuoteDetailView: React.FC<QuoteDetailViewProps> = ({
  quote,
  client,
  user,
  onBack,
  onEdit,
  onDelete,
  onViewPdf,
  onStatusChange,
}) => {
  const [copied, setCopied] = useState(false);

  const clientName = client?.name || 'Cliente';
  const clientPhone = client?.phone || '';
  const cleanPhone = sanitizePhoneForWhatsApp(clientPhone);

  const handleShareWhatsApp = () => {
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

  const handleCopyMessage = () => {
    const message = buildWhatsAppMessage(
      clientName,
      quote.serviceTitle,
      quote.total,
      quote.validUntil,
      quote.executionDeadline,
      quote.quoteNumber
    );
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-5 pb-24 max-w-2xl mx-auto">
      {/* Top action bar */}
      <div className="flex items-center justify-between gap-2">
        <button
          id="detail-back-btn"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-xl border border-slate-200 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar</span>
        </button>

        <div className="flex items-center gap-1.5">
          <button
            id="detail-edit-btn"
            onClick={() => onEdit(quote.id)}
            className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-blue-600 hover:border-blue-300 transition-colors cursor-pointer"
            title="Editar orçamento"
          >
            <Edit2 className="w-4 h-4" />
          </button>

          <button
            id="detail-delete-btn"
            onClick={() => {
              if (confirm(`Tem certeza que deseja excluir o orçamento ${quote.quoteNumber}?`)) {
                onDelete(quote.id);
                onBack();
              }
            }}
            className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-rose-600 hover:border-rose-300 transition-colors cursor-pointer"
            title="Excluir orçamento"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Primary Actions (WhatsApp & PDF) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          id="detail-whatsapp-btn"
          onClick={handleShareWhatsApp}
          className="py-3.5 px-4 bg-[#25D366] hover:bg-[#20bd5a] active:bg-[#1da851] text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-500/15 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
        >
          <MessageSquare className="w-5 h-5 fill-white" />
          <span>Compartilhar no WhatsApp</span>
        </button>

        <button
          id="detail-pdf-btn"
          onClick={() => onViewPdf(quote.id)}
          className="py-3.5 px-4 bg-slate-800 hover:bg-slate-900 active:bg-slate-950 text-white font-bold text-sm rounded-xl shadow-md shadow-slate-900/15 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
        >
          <Printer className="w-5 h-5" />
          <span>Gerar PDF / Imprimir</span>
        </button>
      </div>

      {/* Main Quote Details Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Card Header */}
        <div className="bg-slate-50 p-5 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-black text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-100">
                {quote.quoteNumber}
              </span>
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {formatDateBR(quote.createdAt)}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Emitido por <span className="font-bold text-slate-800">{user?.companyName || 'Prestador de Serviço'}</span>
            </p>
          </div>

          {/* Status selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Status:</span>
            <select
              id="detail-status-select"
              value={quote.status}
              onChange={(e) => onStatusChange(quote.id, e.target.value as QuoteStatus)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold bg-white text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 cursor-pointer shadow-xs"
            >
              <option value="rascunho">Rascunho</option>
              <option value="enviado">Enviado</option>
              <option value="aprovado">Aprovado</option>
              <option value="recusado">Recusado</option>
            </select>
            <StatusBadge status={quote.status} size="sm" showIcon={false} />
          </div>
        </div>

        <div className="p-5 sm:p-7 space-y-5">
          {/* Client Info Card */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Dados do Cliente
            </span>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="font-bold text-slate-900 text-base flex items-center gap-1.5">
                  <UserIcon className="w-4 h-4 text-blue-600" />
                  <span>{clientName}</span>
                </h4>
                {clientPhone && (
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-600">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{clientPhone}</span>
                  </div>
                )}
              </div>

              {client?.address && (
                <div className="text-xs text-slate-500 flex items-start gap-1.5 max-w-xs">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{client.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Service Details */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Serviço Solicitado
            </span>
            <h3 className="text-lg font-extrabold text-slate-900">{quote.serviceTitle}</h3>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
              {quote.serviceDescription}
            </div>
          </div>

          {/* Materials */}
          {quote.materials && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Package className="w-3.5 h-3.5 text-slate-400" />
                Materiais e Insumos Inclusos
              </span>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-slate-700 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                {quote.materials}
              </div>
            </div>
          )}

          {/* Financial Breakdown Card */}
          <div className="space-y-2 pt-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              Discriminação Financeira
            </span>

            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-3">
              <div className="flex justify-between items-center text-xs sm:text-sm text-slate-600">
                <span>Mão de Obra</span>
                <span className="font-bold text-slate-900">{formatCurrencyBRL(quote.laborCost)}</span>
              </div>

              <div className="flex justify-between items-center text-xs sm:text-sm text-slate-600">
                <span>Materiais</span>
                <span className="font-bold text-slate-900">{formatCurrencyBRL(quote.materialsCost)}</span>
              </div>

              <div className="flex justify-between items-center text-xs text-slate-400 pt-1 border-t border-slate-200/80">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-700">{formatCurrencyBRL(quote.subtotal)}</span>
              </div>

              {quote.discount > 0 && (
                <div className="flex justify-between items-center text-xs text-rose-600 font-medium">
                  <span>Desconto aplicado</span>
                  <span>- {formatCurrencyBRL(quote.discount)}</span>
                </div>
              )}

              <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
                <span className="font-black text-slate-900 text-sm uppercase tracking-wider">Valor Total</span>
                <span className="text-2xl font-black text-blue-600">{formatCurrencyBRL(quote.total)}</span>
              </div>
            </div>
          </div>

          {/* Validity & Deadlines */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex items-start gap-2.5">
              <Calendar className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Validade da Proposta
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-800">
                  Até {formatDateBR(quote.validUntil)}
                </span>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Prazo de Execução
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-800">
                  {quote.executionDeadline}
                </span>
              </div>
            </div>
          </div>

          {/* Notes / Terms */}
          {quote.notes && (
            <div className="space-y-1.5 pt-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Observações e Condições de Pagamento
              </span>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-slate-700 text-xs leading-relaxed whitespace-pre-wrap">
                {quote.notes}
              </div>
            </div>
          )}

          {/* Copy text message preview */}
          <div className="pt-2">
            <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/70 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  Mensagem pronta para WhatsApp:
                </span>
                <button
                  onClick={handleCopyMessage}
                  className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 bg-white px-2 py-0.5 rounded-lg border border-emerald-200 cursor-pointer flex items-center gap-1"
                >
                  {copied ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Share2 className="w-3 h-3" />}
                  <span>{copied ? 'Copiado!' : 'Copiar texto'}</span>
                </button>
              </div>
              <div className="p-2.5 bg-white rounded-xl text-slate-700 font-mono text-[11px] whitespace-pre-wrap border border-emerald-100">
                {buildWhatsAppMessage(
                  clientName,
                  quote.serviceTitle,
                  quote.total,
                  quote.validUntil,
                  quote.executionDeadline,
                  quote.quoteNumber
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
