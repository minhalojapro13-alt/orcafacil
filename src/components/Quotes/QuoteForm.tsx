import React, { useState, useEffect } from 'react';
import { Client, Quote, QuoteStatus } from '../../types';
import { formatCurrencyBRL } from '../../services/storageService';
import { ClientFormModal } from '../Clients/ClientFormModal';
import {
  User,
  Plus,
  Briefcase,
  FileText,
  Package,
  DollarSign,
  Calendar,
  Clock,
  MessageCircle,
  Save,
  Calculator,
  ArrowLeft,
} from 'lucide-react';

interface QuoteFormProps {
  clients: Client[];
  initialQuote?: Quote | null;
  preselectedClientId?: string;
  onSave: (quoteData: {
    clientId: string;
    serviceTitle: string;
    serviceDescription: string;
    materials?: string;
    laborCost: number;
    materialsCost: number;
    discount: number;
    validUntil: string;
    executionDeadline: string;
    notes?: string;
    status: QuoteStatus;
  }) => void;
  onAddNewClient: (clientData: {
    name: string;
    phone: string;
    email?: string;
    address?: string;
    notes?: string;
  }) => Promise<Client>;
  onCancel: () => void;
}

export const QuoteForm: React.FC<QuoteFormProps> = ({
  clients,
  initialQuote,
  preselectedClientId,
  onSave,
  onAddNewClient,
  onCancel,
}) => {
  const [clientId, setClientId] = useState(
    initialQuote?.clientId || preselectedClientId || (clients.length > 0 ? clients[0].id : '')
  );
  const [serviceTitle, setServiceTitle] = useState(initialQuote?.serviceTitle || '');
  const [serviceDescription, setServiceDescription] = useState(initialQuote?.serviceDescription || '');
  const [materials, setMaterials] = useState(initialQuote?.materials || '');
  
  const [laborCostStr, setLaborCostStr] = useState(initialQuote ? initialQuote.laborCost.toString() : '');
  const [materialsCostStr, setMaterialsCostStr] = useState(initialQuote ? initialQuote.materialsCost.toString() : '');
  const [discountStr, setDiscountStr] = useState(initialQuote ? initialQuote.discount.toString() : '0');

  // Default validUntil: 15 days from now
  const defaultValidDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 15);
    return d.toISOString().split('T')[0];
  };

  const [validUntil, setValidUntil] = useState(initialQuote?.validUntil || defaultValidDate());
  const [executionDeadline, setExecutionDeadline] = useState(initialQuote?.executionDeadline || '3 a 5 dias úteis');
  const [notes, setNotes] = useState(
    initialQuote?.notes !== undefined
      ? initialQuote.notes
      : 'Condições de pagamento: 50% de entrada e 50% na conclusão dos serviços. Garantia de 90 dias sobre a mão de obra.'
  );
  const [status, setStatus] = useState<QuoteStatus>(initialQuote?.status || 'rascunho');

  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [error, setError] = useState('');

  // Calculations
  const laborCost = parseFloat(laborCostStr.replace(',', '.')) || 0;
  const materialsCost = parseFloat(materialsCostStr.replace(',', '.')) || 0;
  const discount = parseFloat(discountStr.replace(',', '.')) || 0;

  const subtotal = laborCost + materialsCost;
  const total = Math.max(0, subtotal - discount);

  useEffect(() => {
    if (preselectedClientId && !initialQuote) {
      setClientId(preselectedClientId);
    }
  }, [preselectedClientId, initialQuote]);

  const handleQuickAddClient = async (newClientData: {
    name: string;
    phone: string;
    email?: string;
    address?: string;
    notes?: string;
  }) => {
    const created = await onAddNewClient(newClientData);
    setClientId(created.id);
    setIsClientModalOpen(false);
  };

  const handleQuickDaysPreset = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    setValidUntil(d.toISOString().split('T')[0]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId) {
      setError('Selecione ou cadastre um cliente para o orçamento.');
      return;
    }
    if (!serviceTitle.trim()) {
      setError('Informe o título do serviço.');
      return;
    }
    if (!serviceDescription.trim()) {
      setError('Informe a descrição detalhada do serviço.');
      return;
    }
    if (laborCost <= 0 && materialsCost <= 0) {
      setError('Informe pelo menos o valor da mão de obra ou dos materiais.');
      return;
    }

    setError('');
    onSave({
      clientId,
      serviceTitle: serviceTitle.trim(),
      serviceDescription: serviceDescription.trim(),
      materials: materials.trim() || undefined,
      laborCost,
      materialsCost,
      discount,
      validUntil,
      executionDeadline: executionDeadline.trim(),
      notes: notes.trim() || undefined,
      status,
    });
  };

  return (
    <div className="space-y-5 pb-24 max-w-2xl mx-auto">
      {/* Top back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-xl border border-slate-200 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Cancelar e Voltar</span>
        </button>

        {initialQuote && (
          <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
            Editando {initialQuote.quoteNumber}
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        {/* Section 1: Cliente */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="quote-client-select" className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-4 h-4 text-blue-600" />
              <span>Cliente *</span>
            </label>
            <button
              id="quote-quick-add-client-btn"
              type="button"
              onClick={() => setIsClientModalOpen(true)}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Novo Cliente</span>
            </button>
          </div>

          {clients.length === 0 ? (
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-center">
              <p className="text-xs text-amber-800 font-medium">
                Você ainda não tem clientes cadastrados.
              </p>
              <button
                type="button"
                onClick={() => setIsClientModalOpen(true)}
                className="mt-2 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl inline-flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Cadastrar Cliente Agora</span>
              </button>
            </div>
          ) : (
            <select
              id="quote-client-select"
              required
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 text-slate-900 text-sm font-semibold bg-slate-50/50 outline-none transition-all"
            >
              <option value="" disabled>
                Selecione o cliente...
              </option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} - {c.phone}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Section 2: Serviço e Descrição */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <Briefcase className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Dados do Serviço
            </h3>
          </div>

          <div>
            <label htmlFor="quote-service-title" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Título do Serviço *
            </label>
            <input
              id="quote-service-title"
              type="text"
              required
              value={serviceTitle}
              onChange={(e) => setServiceTitle(e.target.value)}
              placeholder="Ex: Instalação Elétrica Residencial e Troca de Fiação"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 text-slate-900 text-sm font-medium outline-none bg-slate-50/30 transition-all"
            />
          </div>

          <div>
            <label htmlFor="quote-service-description" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              Descrição do Serviço *
            </label>
            <textarea
              id="quote-service-description"
              required
              rows={3}
              value={serviceDescription}
              onChange={(e) => setServiceDescription(e.target.value)}
              placeholder="Descreva o que será feito com clareza (ex: passagem de conduítes, testes de carga, instalação de disjuntores)..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 text-slate-900 text-sm font-medium outline-none resize-none bg-slate-50/30 transition-all"
            />
          </div>

          <div>
            <label htmlFor="quote-materials" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Package className="w-3.5 h-3.5 text-slate-400" />
              Materiais (opcional)
            </label>
            <textarea
              id="quote-materials"
              rows={2}
              value={materials}
              onChange={(e) => setMaterials(e.target.value)}
              placeholder="Liste os materiais necessários ou fornecidos (ex: 50m cabo 4mm, 6 tomadas, disjuntor 32A)..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 text-slate-900 text-sm font-medium outline-none resize-none bg-slate-50/30 transition-all"
            />
          </div>
        </div>

        {/* Section 3: Valores & Cálculo Automático */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Valores e Totais
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="quote-labor-cost" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Mão de Obra (R$) *
              </label>
              <input
                id="quote-labor-cost"
                type="number"
                step="0.01"
                min="0"
                value={laborCostStr}
                onChange={(e) => setLaborCostStr(e.target.value)}
                placeholder="0.00"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 text-slate-900 text-sm font-bold outline-none bg-slate-50/30 transition-all"
              />
            </div>

            <div>
              <label htmlFor="quote-materials-cost" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Materiais (R$)
              </label>
              <input
                id="quote-materials-cost"
                type="number"
                step="0.01"
                min="0"
                value={materialsCostStr}
                onChange={(e) => setMaterialsCostStr(e.target.value)}
                placeholder="0.00"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 text-slate-900 text-sm font-bold outline-none bg-slate-50/30 transition-all"
              />
            </div>

            <div>
              <label htmlFor="quote-discount" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Desconto (R$)
              </label>
              <input
                id="quote-discount"
                type="number"
                step="0.01"
                min="0"
                value={discountStr}
                onChange={(e) => setDiscountStr(e.target.value)}
                placeholder="0.00"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 text-slate-900 text-sm font-bold outline-none bg-slate-50/30 transition-all"
              />
            </div>
          </div>

          {/* Automatic calculation summary banner */}
          <div className="mt-4 p-4 rounded-xl bg-slate-900 text-white space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1">
                <Calculator className="w-3.5 h-3.5 text-blue-400" />
                Subtotal (Mão de Obra + Materiais):
              </span>
              <span className="font-semibold">{formatCurrencyBRL(subtotal)}</span>
            </div>

            {discount > 0 && (
              <div className="flex items-center justify-between text-xs text-rose-300">
                <span>Desconto aplicado:</span>
                <span className="font-semibold">- {formatCurrencyBRL(discount)}</span>
              </div>
            )}

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Valor Total Final:
              </span>
              <span className="text-xl font-black text-emerald-400">
                {formatCurrencyBRL(total)}
              </span>
            </div>
          </div>
        </div>

        {/* Section 4: Prazos e Condições */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Prazos e Validade
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="quote-valid-until" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Validade do Orçamento *
                </label>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleQuickDaysPreset(7)}
                    className="text-[10px] px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-600 font-semibold cursor-pointer"
                  >
                    +7d
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDaysPreset(15)}
                    className="text-[10px] px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-600 font-semibold cursor-pointer"
                  >
                    +15d
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDaysPreset(30)}
                    className="text-[10px] px-1.5 py-0.5 bg-slate-100 hover:bg-slate-200 rounded text-slate-600 font-semibold cursor-pointer"
                  >
                    +30d
                  </button>
                </div>
              </div>
              <input
                id="quote-valid-until"
                type="date"
                required
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 text-slate-900 text-sm font-medium outline-none bg-slate-50/30 transition-all"
              />
            </div>

            <div>
              <label htmlFor="quote-execution-deadline" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Prazo de Execução *
              </label>
              <input
                id="quote-execution-deadline"
                type="text"
                required
                value={executionDeadline}
                onChange={(e) => setExecutionDeadline(e.target.value)}
                placeholder="Ex: 3 a 5 dias úteis, 1 semana"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 text-slate-900 text-sm font-medium outline-none bg-slate-50/30 transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="quote-notes" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <MessageCircle className="w-3.5 h-3.5 text-slate-400" />
              Observações e Termos de Garantia (opcional)
            </label>
            <textarea
              id="quote-notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Condições de pagamento, chave PIX, garantia de 90 dias..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 text-slate-900 text-sm font-medium outline-none resize-none bg-slate-50/30 transition-all"
            />
          </div>

          {/* Status selector */}
          <div>
            <label htmlFor="quote-status-select" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Status Inicial
            </label>
            <select
              id="quote-status-select"
              value={status}
              onChange={(e) => setStatus(e.target.value as QuoteStatus)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 text-slate-900 text-sm font-medium outline-none bg-slate-50/30 transition-all"
            >
              <option value="rascunho">Rascunho</option>
              <option value="enviado">Enviado</option>
              <option value="aprovado">Aprovado</option>
              <option value="recusado">Recusado</option>
            </select>
          </div>
        </div>

        {/* Primary Save Button */}
        <div className="pt-2">
          <button
            id="save-quote-submit-btn"
            type="submit"
            className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
          >
            <Save className="w-4 h-4" />
            <span>{initialQuote ? 'Atualizar Orçamento' : 'Salvar Orçamento'}</span>
          </button>
        </div>
      </form>

      {/* Quick Add Client Modal */}
      <ClientFormModal
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
        onSave={handleQuickAddClient}
      />
    </div>
  );
};
