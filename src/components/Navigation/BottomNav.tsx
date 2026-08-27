import React from 'react';
import { ActiveTab, ActiveView } from '../../types';
import { LayoutDashboard, Users, FileText, UserCircle, Plus } from 'lucide-react';

interface BottomNavProps {
  activeView: ActiveView;
  onSelectTab: (tab: ActiveTab) => void;
  onNewQuoteClick: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeView,
  onSelectTab,
  onNewQuoteClick,
}) => {
  const currentTab = activeView.type === 'tab' ? activeView.tab : null;

  return (
    <nav
      id="mobile-bottom-nav"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 h-18 sm:h-20 shadow-md safe-area-bottom print:hidden"
    >
      <div className="max-w-md mx-auto h-full flex items-center justify-around relative px-2">
        {/* Tab: Início / Dashboard */}
        <button
          id="nav-tab-dashboard"
          onClick={() => onSelectTab('dashboard')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors cursor-pointer ${
            currentTab === 'dashboard'
              ? 'text-blue-600 font-bold'
              : 'text-slate-400 font-bold hover:text-slate-600'
          }`}
        >
          <LayoutDashboard className={`w-5 h-5 mb-1 ${currentTab === 'dashboard' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] tracking-tight">Início</span>
        </button>

        {/* Tab: Clientes */}
        <button
          id="nav-tab-clients"
          onClick={() => onSelectTab('clients')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors cursor-pointer ${
            currentTab === 'clients'
              ? 'text-blue-600 font-bold'
              : 'text-slate-400 font-bold hover:text-slate-600'
          }`}
        >
          <Users className={`w-5 h-5 mb-1 ${currentTab === 'clients' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] tracking-tight">Clientes</span>
        </button>

        {/* Center Raised Action: + Novo Orçamento */}
        <div className="flex-1 flex justify-center">
          <button
            id="nav-quick-new-quote-btn"
            onClick={onNewQuoteClick}
            aria-label="Criar novo orçamento"
            className="bg-blue-600 w-14 h-14 rounded-full border-4 border-[#F8FAFC] shadow-lg shadow-blue-500/25 flex items-center justify-center text-white text-3xl font-light hover:bg-blue-700 active:scale-95 transition-all -top-6 absolute left-1/2 -translate-x-1/2 cursor-pointer"
          >
            <Plus className="w-7 h-7 stroke-[2.2]" />
          </button>
        </div>

        {/* Tab: Orçamentos */}
        <button
          id="nav-tab-quotes"
          onClick={() => onSelectTab('quotes')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors cursor-pointer ${
            currentTab === 'quotes'
              ? 'text-blue-600 font-bold'
              : 'text-slate-400 font-bold hover:text-slate-600'
          }`}
        >
          <FileText className={`w-5 h-5 mb-1 ${currentTab === 'quotes' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] tracking-tight">Orçamentos</span>
        </button>

        {/* Tab: Perfil */}
        <button
          id="nav-tab-profile"
          onClick={() => onSelectTab('profile')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors cursor-pointer ${
            currentTab === 'profile'
              ? 'text-blue-600 font-bold'
              : 'text-slate-400 font-bold hover:text-slate-600'
          }`}
        >
          <UserCircle className={`w-5 h-5 mb-1 ${currentTab === 'profile' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] tracking-tight">Perfil</span>
        </button>
      </div>
    </nav>
  );
};

