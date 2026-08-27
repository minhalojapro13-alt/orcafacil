import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ActiveTab, ActiveView, Client, Quote, QuoteStatus } from './types';
import { clientRepository, quoteRepository } from './services/storageService';
import { LoginView } from './components/Auth/LoginView';
import { RegisterView } from './components/Auth/RegisterView';
import { Header } from './components/Navigation/Header';
import { BottomNav } from './components/Navigation/BottomNav';
import { DashboardView } from './components/Dashboard/DashboardView';
import { ClientList } from './components/Clients/ClientList';
import { ClientDetailView } from './components/Clients/ClientDetailView';
import { ClientFormModal } from './components/Clients/ClientFormModal';
import { QuoteList } from './components/Quotes/QuoteList';
import { QuoteForm } from './components/Quotes/QuoteForm';
import { QuoteDetailView } from './components/Quotes/QuoteDetailView';
import { QuotePDFView } from './components/Quotes/QuotePDFView';
import { ProfileView } from './components/Profile/ProfileView';

function AppContent() {
  const { user, isAuthenticated } = useAuth();

  // Auth screen toggle
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Navigation state
  const [activeView, setActiveView] = useState<ActiveView>({ type: 'tab', tab: 'dashboard' });

  // Data state
  const [clients, setClients] = useState<Client[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  // Client Modal state
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);

  // Load user data
  const loadData = useCallback(async () => {
    if (!user) return;
    try {
      const [userClients, userQuotes] = await Promise.all([
        clientRepository.getByUserId(user.id),
        quoteRepository.getByUserId(user.id),
      ]);
      setClients(userClients);
      setQuotes(userQuotes);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, loadData]);

  // If not logged in, show Login or Register
  if (!isAuthenticated) {
    if (authMode === 'register') {
      return <RegisterView onSwitchToLogin={() => setAuthMode('login')} />;
    }
    return <LoginView onSwitchToRegister={() => setAuthMode('register')} />;
  }

  // Navigation Handlers
  const handleSelectTab = (tab: ActiveTab) => {
    setActiveView({ type: 'tab', tab });
  };

  const handleNavigateBack = () => {
    if (activeView.type === 'quote-pdf') {
      setActiveView({ type: 'quote-detail', quoteId: activeView.quoteId });
    } else if (activeView.type === 'edit-quote') {
      setActiveView({ type: 'quote-detail', quoteId: activeView.quoteId });
    } else if (activeView.type === 'quote-detail' || activeView.type === 'new-quote') {
      setActiveView({ type: 'tab', tab: 'quotes' });
    } else if (activeView.type === 'client-detail') {
      setActiveView({ type: 'tab', tab: 'clients' });
    } else {
      setActiveView({ type: 'tab', tab: 'dashboard' });
    }
  };

  // Client CRUD Handlers
  const handleSaveClient = async (clientData: {
    name: string;
    phone: string;
    email?: string;
    address?: string;
    notes?: string;
  }) => {
    if (!user) return;

    if (clientToEdit) {
      await clientRepository.update(clientToEdit.id, clientData);
    } else {
      await clientRepository.create({
        ...clientData,
        userId: user.id,
      });
    }

    setClientToEdit(null);
    setIsClientModalOpen(false);
    await loadData();
  };

  const handleQuickAddClient = async (clientData: {
    name: string;
    phone: string;
    email?: string;
    address?: string;
    notes?: string;
  }): Promise<Client> => {
    if (!user) throw new Error('Usuário não autenticado');
    const created = await clientRepository.create({
      ...clientData,
      userId: user.id,
    });
    await loadData();
    return created;
  };

  const handleDeleteClient = async (clientId: string) => {
    await clientRepository.delete(clientId);
    await loadData();
  };

  // Quote CRUD Handlers
  const handleSaveQuote = async (quoteData: {
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
  }) => {
    if (!user) return;

    if (activeView.type === 'edit-quote') {
      const updated = await quoteRepository.update(activeView.quoteId, quoteData);
      await loadData();
      if (updated) {
        setActiveView({ type: 'quote-detail', quoteId: updated.id });
      }
    } else {
      const created = await quoteRepository.create({
        ...quoteData,
        userId: user.id,
      });
      await loadData();
      setActiveView({ type: 'quote-detail', quoteId: created.id });
    }
  };

  const handleUpdateQuoteStatus = async (quoteId: string, status: QuoteStatus) => {
    await quoteRepository.updateStatus(quoteId, status);
    await loadData();
  };

  const handleDeleteQuote = async (quoteId: string) => {
    await quoteRepository.delete(quoteId);
    await loadData();
  };

  // Render current view content
  const renderViewContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-500 mt-2 font-medium">Carregando informações...</p>
        </div>
      );
    }

    // 1. Tab Views
    if (activeView.type === 'tab') {
      switch (activeView.tab) {
        case 'dashboard':
          return (
            <DashboardView
              user={user}
              clients={clients}
              quotes={quotes}
              onNewQuoteClick={() => setActiveView({ type: 'new-quote' })}
              onSelectQuote={(quoteId) => setActiveView({ type: 'quote-detail', quoteId })}
              onNavigateToQuotes={() => setActiveView({ type: 'tab', tab: 'quotes' })}
              onNavigateToClients={() => setActiveView({ type: 'tab', tab: 'clients' })}
            />
          );
        case 'clients':
          return (
            <ClientList
              clients={clients}
              quotes={quotes}
              onSelectClient={(clientId) => setActiveView({ type: 'client-detail', clientId })}
              onAddNewClient={() => {
                setClientToEdit(null);
                setIsClientModalOpen(true);
              }}
              onEditClient={(client) => {
                setClientToEdit(client);
                setIsClientModalOpen(true);
              }}
              onDeleteClient={handleDeleteClient}
              onNewQuoteForClient={(clientId) =>
                setActiveView({ type: 'new-quote', preselectedClientId: clientId })
              }
            />
          );
        case 'quotes':
          return (
            <QuoteList
              quotes={quotes}
              clients={clients}
              onSelectQuote={(quoteId) => setActiveView({ type: 'quote-detail', quoteId })}
              onNewQuoteClick={() => setActiveView({ type: 'new-quote' })}
            />
          );
        case 'profile':
          return <ProfileView onDataChanged={loadData} />;
      }
    }

    // 2. New Quote View
    if (activeView.type === 'new-quote') {
      return (
        <QuoteForm
          clients={clients}
          preselectedClientId={activeView.preselectedClientId}
          onSave={handleSaveQuote}
          onAddNewClient={handleQuickAddClient}
          onCancel={() => setActiveView({ type: 'tab', tab: 'quotes' })}
        />
      );
    }

    // 3. Edit Quote View
    if (activeView.type === 'edit-quote') {
      const quoteToEdit = quotes.find((q) => q.id === activeView.quoteId);
      return (
        <QuoteForm
          clients={clients}
          initialQuote={quoteToEdit}
          onSave={handleSaveQuote}
          onAddNewClient={handleQuickAddClient}
          onCancel={() => setActiveView({ type: 'quote-detail', quoteId: activeView.quoteId })}
        />
      );
    }

    // 4. Quote Detail View
    if (activeView.type === 'quote-detail') {
      const quote = quotes.find((q) => q.id === activeView.quoteId);
      if (!quote) {
        return (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200">
            <p className="text-sm font-bold text-slate-700">Orçamento não encontrado.</p>
            <button
              onClick={() => setActiveView({ type: 'tab', tab: 'quotes' })}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
            >
              Voltar para Orçamentos
            </button>
          </div>
        );
      }
      const client = clients.find((c) => c.id === quote.clientId);
      return (
        <QuoteDetailView
          quote={quote}
          client={client}
          user={user}
          onBack={() => setActiveView({ type: 'tab', tab: 'quotes' })}
          onEdit={(quoteId) => setActiveView({ type: 'edit-quote', quoteId })}
          onDelete={handleDeleteQuote}
          onViewPdf={(quoteId) => setActiveView({ type: 'quote-pdf', quoteId })}
          onStatusChange={handleUpdateQuoteStatus}
        />
      );
    }

    // 5. Quote PDF View
    if (activeView.type === 'quote-pdf') {
      const quote = quotes.find((q) => q.id === activeView.quoteId);
      if (!quote) {
        return (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200">
            <p className="text-sm font-bold text-slate-700">Orçamento não encontrado.</p>
            <button
              onClick={() => setActiveView({ type: 'tab', tab: 'quotes' })}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
            >
              Voltar para Orçamentos
            </button>
          </div>
        );
      }
      const client = clients.find((c) => c.id === quote.clientId);
      return (
        <QuotePDFView
          quote={quote}
          client={client}
          user={user}
          onBack={() => setActiveView({ type: 'quote-detail', quoteId: activeView.quoteId })}
        />
      );
    }

    // 6. Client Detail View
    if (activeView.type === 'client-detail') {
      const client = clients.find((c) => c.id === activeView.clientId);
      if (!client) {
        return (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200">
            <p className="text-sm font-bold text-slate-700">Cliente não encontrado.</p>
            <button
              onClick={() => setActiveView({ type: 'tab', tab: 'clients' })}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold"
            >
              Voltar para Clientes
            </button>
          </div>
        );
      }
      return (
        <ClientDetailView
          client={client}
          quotes={quotes}
          onBack={() => setActiveView({ type: 'tab', tab: 'clients' })}
          onEditClient={(c) => {
            setClientToEdit(c);
            setIsClientModalOpen(true);
          }}
          onDeleteClient={handleDeleteClient}
          onNewQuoteForClient={(clientId) =>
            setActiveView({ type: 'new-quote', preselectedClientId: clientId })
          }
          onSelectQuote={(quoteId) => setActiveView({ type: 'quote-detail', quoteId })}
        />
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans antialiased text-slate-900">
      {/* Header */}
      <Header
        activeView={activeView}
        onNavigateBack={handleNavigateBack}
        onNavigateToProfile={() => setActiveView({ type: 'tab', tab: 'profile' })}
      />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-4 sm:px-6">
        {renderViewContent()}
      </main>

      {/* Bottom Navigation */}
      <BottomNav
        activeView={activeView}
        onSelectTab={handleSelectTab}
        onNewQuoteClick={() => setActiveView({ type: 'new-quote' })}
      />

      {/* Global Client Form Modal */}
      <ClientFormModal
        isOpen={isClientModalOpen}
        onClose={() => {
          setIsClientModalOpen(false);
          setClientToEdit(null);
        }}
        onSave={handleSaveClient}
        clientToEdit={clientToEdit}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
