import React from 'react';
import { Client, Quote, User } from '../../types';
import { formatCurrencyBRL, formatDateBR } from '../../services/storageService';
import { Printer, ArrowLeft, FileCheck, CheckCircle, ShieldCheck } from 'lucide-react';

interface QuotePDFViewProps {
  quote: Quote;
  client?: Client;
  user?: User | null;
  onBack: () => void;
}

export const QuotePDFView: React.FC<QuotePDFViewProps> = ({
  quote,
  client,
  user,
  onBack,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const clientName = client?.name || 'Cliente';
  const companyName = user?.companyName || 'Prestador de Serviços';

  return (
    <div className="space-y-4 pb-20 max-w-3xl mx-auto">
      {/* Top action buttons (hidden in print) */}
      <div className="flex items-center justify-between print:hidden">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-xl border border-slate-200 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Orçamento</span>
        </button>

        <button
          id="print-pdf-page-btn"
          onClick={handlePrint}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-blue-500/25 flex items-center gap-2 cursor-pointer transition-all"
        >
          <Printer className="w-4 h-4" />
          <span>Imprimir / Salvar em PDF</span>
        </button>
      </div>

      {/* Printable Sheet (Standard A4 Pro Invoice Layout) */}
      <div
        id="printable-quote-sheet"
        className="bg-white rounded-2xl p-6 sm:p-10 shadow-lg border border-slate-200 text-slate-900 print:shadow-none print:border-none print:p-0 print:m-0"
      >
        {/* Header with Provider Branding */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b-2 border-slate-900">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold">
                <FileCheck className="w-5 h-5" />
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 uppercase tracking-tight">
                {companyName}
              </h1>
            </div>
            <p className="text-xs text-slate-600 font-medium">{user?.name}</p>
            <p className="text-xs text-slate-500">
              {user?.phone} {user?.email ? `• ${user.email}` : ''} {user?.city ? `• ${user.city}` : ''}
            </p>
            {user?.pixKey && (
              <p className="text-xs font-semibold text-slate-700">
                Chave PIX: <span className="font-mono">{user.pixKey}</span>
              </p>
            )}
          </div>

          <div className="sm:text-right space-y-1 bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Proposta Comercial
            </span>
            <div className="text-xl sm:text-2xl font-mono font-extrabold text-blue-700">
              {quote.quoteNumber}
            </div>
            <p className="text-xs text-slate-500">
              Data de emissão: <strong>{formatDateBR(quote.createdAt)}</strong>
            </p>
            <p className="text-xs text-slate-500">
              Validade: <strong>{formatDateBR(quote.validUntil)}</strong>
            </p>
          </div>
        </div>

        {/* Client Box */}
        <div className="my-6 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Dados do Cliente
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div>
              <p className="font-bold text-slate-900 text-sm">{clientName}</p>
              <p className="text-slate-600">{client?.phone}</p>
              {client?.email && <p className="text-slate-600">{client.email}</p>}
            </div>
            <div>
              {client?.address && (
                <p className="text-slate-600">
                  <strong className="text-slate-800">Local da Obra/Serviço:</strong> {client.address}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Service Scope */}
        <div className="space-y-3 mb-6">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Especificação dos Serviços
            </span>
            <h2 className="text-base font-bold text-slate-900 mt-0.5">{quote.serviceTitle}</h2>
          </div>

          <div className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-100 whitespace-pre-wrap">
            {quote.serviceDescription}
          </div>

          {quote.materials && (
            <div className="mt-3">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Materiais e Insumos Inclusos:
              </span>
              <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg whitespace-pre-wrap">
                {quote.materials}
              </div>
            </div>
          )}
        </div>

        {/* Values Table */}
        <div className="mb-6">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white font-semibold">
                <th className="py-2.5 px-4 rounded-l-lg">Item / Descrição</th>
                <th className="py-2.5 px-4 text-right rounded-r-lg">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-2.5 px-4 text-slate-800 font-medium">Mão de Obra Especializada</td>
                <td className="py-2.5 px-4 text-right font-semibold text-slate-900">
                  {formatCurrencyBRL(quote.laborCost)}
                </td>
              </tr>
              {quote.materialsCost > 0 && (
                <tr>
                  <td className="py-2.5 px-4 text-slate-800 font-medium">Materiais / Equipamentos</td>
                  <td className="py-2.5 px-4 text-right font-semibold text-slate-900">
                    {formatCurrencyBRL(quote.materialsCost)}
                  </td>
                </tr>
              )}
              <tr className="bg-slate-50/50">
                <td className="py-2 px-4 text-slate-500">Subtotal</td>
                <td className="py-2 px-4 text-right text-slate-700 font-semibold">
                  {formatCurrencyBRL(quote.subtotal)}
                </td>
              </tr>
              {quote.discount > 0 && (
                <tr className="text-rose-600">
                  <td className="py-2 px-4">Desconto Promocional</td>
                  <td className="py-2 px-4 text-right font-semibold">
                    - {formatCurrencyBRL(quote.discount)}
                  </td>
                </tr>
              )}
              <tr className="bg-slate-900 text-white font-bold text-sm">
                <td className="py-3 px-4 rounded-l-lg uppercase">Total da Proposta</td>
                <td className="py-3 px-4 text-right rounded-r-lg font-extrabold text-emerald-400">
                  {formatCurrencyBRL(quote.total)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Terms & Conditions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-4 border-t border-slate-200">
          <div>
            <p className="font-bold text-slate-800 mb-1">Prazo de Execução:</p>
            <p className="text-slate-600">{quote.executionDeadline}</p>

            <p className="font-bold text-slate-800 mt-2 mb-1">Validade do Orçamento:</p>
            <p className="text-slate-600">Até {formatDateBR(quote.validUntil)}</p>
          </div>

          {quote.notes && (
            <div>
              <p className="font-bold text-slate-800 mb-1">Observações e Garantia:</p>
              <p className="text-slate-600 whitespace-pre-wrap">{quote.notes}</p>
            </div>
          )}
        </div>

        {/* Signature lines */}
        <div className="mt-12 pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-center text-xs text-slate-500">
          <div>
            <div className="border-b border-slate-400 w-3/4 mx-auto mb-1"></div>
            <p className="font-semibold text-slate-800">{user?.name || companyName}</p>
            <p className="text-[10px]">Prestador de Serviços</p>
          </div>
          <div>
            <div className="border-b border-slate-400 w-3/4 mx-auto mb-1"></div>
            <p className="font-semibold text-slate-800">{clientName}</p>
            <p className="text-[10px]">De acordo do Cliente</p>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-8 pt-4 text-center text-[10px] text-slate-400 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3 h-3 text-slate-400" />
          <span>Orçamento gerado via OrçaFácil • {quote.quoteNumber}</span>
        </div>
      </div>
    </div>
  );
};
