import React, { useState } from 'react';
import { Client, Quote } from '../../types';
import { Search, UserPlus, Phone, MessageSquare, MapPin, ChevronRight, Users, Trash2, Edit2, FileSpreadsheet } from 'lucide-react';
import { sanitizePhoneForWhatsApp } from '../../services/storageService';

interface ClientListProps {
  clients: Client[];
  quotes: Quote[];
  onSelectClient: (clientId: string) => void;
  onAddNewClient: () => void;
  onEditClient: (client: Client) => void;
  onDeleteClient: (clientId: string) => void;
  onNewQuoteForClient: (clientId: string) => void;
}

export const ClientList: React.FC<ClientListProps> = ({
  clients,
  quotes,
  onSelectClient,
  onAddNewClient,
  onEditClient,
  onDeleteClient,
  onNewQuoteForClient,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = clients.filter((client) => {
    const term = searchTerm.toLowerCase();
    return (
      client.name.toLowerCase().includes(term) ||
      client.phone.includes(term) ||
      (client.email && client.email.toLowerCase().includes(term)) ||
      (client.address && client.address.toLowerCase().includes(term))
    );
  });

  const getClientQuotesCount = (clientId: string) => {
    return quotes.filter((q) => q.clientId === clientId).length;
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Top action & search */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Clientes</h2>
            <p className="text-xs text-slate-500">
              {clients.length} {clients.length === 1 ? 'cliente cadastrado' : 'clientes cadastrados'}
            </p>
          </div>
          <button
            id="add-client-top-btn"
            onClick={onAddNewClient}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Novo Cliente</span>
          </button>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="client-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome, telefone ou endereço..."
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
      </div>

      {/* Client cards list */}
      {filteredClients.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-slate-100 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            {searchTerm ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado ainda'}
          </h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
            {searchTerm
              ? 'Tente buscar com outro termo ou limpe o filtro.'
              : 'Cadastre seu primeiro cliente para gerar orçamentos rápidos e profissionais.'}
          </p>
          {!searchTerm && (
            <button
              id="empty-add-client-btn"
              onClick={onAddNewClient}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <UserPlus className="w-4 h-4" />
              <span>Cadastrar Primeiro Cliente</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filteredClients.map((client) => {
            const quoteCount = getClientQuotesCount(client.id);
            const cleanPhone = sanitizePhoneForWhatsApp(client.phone);

            return (
              <div
                key={client.id}
                id={`client-card-${client.id}`}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:border-blue-300 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div
                    onClick={() => onSelectClient(client.id)}
                    className="flex-1 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-base hover:text-blue-600 transition-colors">
                        {client.name}
                      </h4>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold flex items-center gap-1">
                        <FileSpreadsheet className="w-3 h-3 text-slate-400" />
                        {quoteCount} {quoteCount === 1 ? 'orçamento' : 'orçamentos'}
                      </span>
                    </div>

                    <div className="mt-2 space-y-1 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-medium">{client.phone}</span>
                      </div>
                      {client.address && (
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[260px] sm:max-w-md">{client.address}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Direct WhatsApp button */}
                    <a
                      id={`client-whatsapp-${client.id}`}
                      href={`https://wa.me/${cleanPhone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                      title="Conversar no WhatsApp"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </a>

                    <button
                      id={`client-edit-${client.id}`}
                      onClick={() => onEditClient(client)}
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      id={`client-delete-${client.id}`}
                      onClick={() => {
                        const quoteMsg = quoteCount > 0 ? `\n\nAtenção: Este cliente possui ${quoteCount} orçamento(s) associado(s). Eles permanecerão no histórico.` : '';
                        if (confirm(`Deseja realmente excluir o cliente "${client.name}"?${quoteMsg}`)) {
                          onDeleteClient(client.id);
                        }
                      }}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Footer action */}
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    id={`client-create-quote-${client.id}`}
                    onClick={() => onNewQuoteForClient(client.id)}
                    className="text-blue-600 font-bold hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                  >
                    <span>+ Criar Orçamento</span>
                  </button>

                  <button
                    id={`client-view-details-${client.id}`}
                    onClick={() => onSelectClient(client.id)}
                    className="text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>Ver histórico</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
