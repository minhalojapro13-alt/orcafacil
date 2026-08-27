import React from 'react';
import { Client, Quote } from '../../types';
import { StatusBadge } from '../Common/StatusBadge';
import { formatCurrencyBRL, formatDateBR, sanitizePhoneForWhatsApp } from '../../services/storageService';
import { Phone, Mail, MapPin, FileText, Plus, MessageSquare, Edit2, Trash2, Calendar, FileSpreadsheet, ArrowLeft } from 'lucide-react';

interface ClientDetailViewProps {
  client: Client;
  quotes: Quote[];
  onBack: () => void;
  onEditClient: (client: Client) => void;
  onDeleteClient: (clientId: string) => void;
  onNewQuoteForClient: (clientId: string) => void;
  onSelectQuote: (quoteId: string) => void;
}

export const ClientDetailView: React.FC<ClientDetailViewProps> = ({
  client,
  quotes,
  onBack,
  onEditClient,
  onDeleteClient,
  onNewQuoteForClient,
  onSelectQuote,
}) => {
  const clientQuotes = quotes.filter((q) => q.clientId === client.id);
  const cleanPhone = sanitizePhoneForWhatsApp(client.phone);

  const totalApproved = clientQuotes
    .filter((q) => q.status === 'aprovado')
    .reduce((acc, curr) => acc + curr.total, 0);

  return (
    <div className="space-y-5 pb-24">
      {/* Top back button and actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-xl border border-slate-200 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para Clientes</span>
        </button>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onEditClient(client)}
            className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-blue-600 hover:border-blue-300 transition-colors cursor-pointer"
            title="Editar cliente"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              const quoteMsg = clientQuotes.length > 0 ? `\n\nAtenção: Este cliente possui ${clientQuotes.length} orçamento(s) associado(s).` : '';
              if (confirm(`Tem certeza que deseja excluir o cliente ${client.name}?${quoteMsg}`)) {
                onDeleteClient(client.id);
                onBack();
              }
            }}
            className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-rose-600 hover:border-rose-300 transition-colors cursor-pointer"
            title="Excluir cliente"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Client Overview Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">{client.name}</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Cliente desde {formatDateBR(client.createdAt)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/${cleanPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial px-4 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>WhatsApp</span>
            </a>
            <a
              href={`tel:${client.phone.replace(/\D/g, '')}`}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all"
            >
              <Phone className="w-4 h-4" />
              <span>Ligar</span>
            </a>
          </div>
        </div>

        {/* Contact details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Telefone</span>
              <span className="font-semibold text-slate-900">{client.phone}</span>
            </div>
          </div>

          {client.email && (
            <div className="flex items-center gap-2 text-slate-700">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">E-mail</span>
                <span className="font-semibold text-slate-900 truncate">{client.email}</span>
              </div>
            </div>
          )}

          {client.address && (
            <div className="flex items-start gap-2 text-slate-700 sm:col-span-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Endereço / Local</span>
                <span className="font-semibold text-slate-900">{client.address}</span>
              </div>
            </div>
          )}

          {client.notes && (
            <div className="flex items-start gap-2 text-slate-700 sm:col-span-2 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <FileText className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Observações</span>
                <p className="text-slate-600 text-xs whitespace-pre-wrap mt-0.5">{client.notes}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quotes summary metrics */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total de Orçamentos</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{clientQuotes.length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">Total Fechado</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">
            {formatCurrencyBRL(totalApproved)}
          </p>
        </div>
      </div>

      {/* Client's Quotes Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
            <FileSpreadsheet className="w-4 h-4 text-blue-600" />
            <span>Histórico de Orçamentos</span>
          </h3>
          <button
            onClick={() => onNewQuoteForClient(client.id)}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Novo Orçamento</span>
          </button>
        </div>

        {clientQuotes.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 text-center border border-slate-100">
            <p className="text-xs text-slate-500">
              Nenhum orçamento emitido para este cliente ainda.
            </p>
            <button
              onClick={() => onNewQuoteForClient(client.id)}
              className="mt-3 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold text-xs rounded-xl inline-flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Criar primeiro orçamento</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {clientQuotes.map((quote) => (
              <div
                key={quote.id}
                onClick={() => onSelectQuote(quote.id)}
                className="bg-white p-4 rounded-2xl border border-slate-200/80 hover:border-blue-300 transition-all cursor-pointer shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                      {quote.quoteNumber}
                    </span>
                    <StatusBadge status={quote.status} size="sm" />
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDateBR(quote.createdAt)}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mt-1">{quote.serviceTitle}</h4>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-medium">Valor Total</span>
                    <span className="font-extrabold text-slate-900 text-base">
                      {formatCurrencyBRL(quote.total)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
