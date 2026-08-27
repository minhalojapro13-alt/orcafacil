import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ActiveView } from '../../types';
import { ChevronLeft } from 'lucide-react';

interface HeaderProps {
  activeView: ActiveView;
  onNavigateBack: () => void;
  onNavigateToProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  onNavigateBack,
  onNavigateToProfile,
}) => {
  const { user } = useAuth();

  const isSubView = activeView.type !== 'tab';

  let title = 'OrçaFácil';
  let subtitle = user?.companyName || 'Orçamentos Profissionais';

  if (activeView.type === 'tab') {
    switch (activeView.tab) {
      case 'dashboard':
        title = 'OrçaFácil';
        subtitle = user?.companyName || 'Painel Principal';
        break;
      case 'clients':
        title = 'Meus Clientes';
        subtitle = 'Gerenciamento de contatos';
        break;
      case 'quotes':
        title = 'Orçamentos';
        subtitle = 'Histórico e status';
        break;
      case 'profile':
        title = 'Meu Perfil';
        subtitle = 'Dados da empresa e plano';
        break;
    }
  } else if (activeView.type === 'new-quote') {
    title = 'Novo Orçamento';
    subtitle = 'Preencha os dados do serviço';
  } else if (activeView.type === 'edit-quote') {
    title = 'Editar Orçamento';
    subtitle = 'Atualize as informações';
  } else if (activeView.type === 'quote-detail') {
    title = 'Detalhes do Orçamento';
    subtitle = 'Visualize e compartilhe';
  } else if (activeView.type === 'quote-pdf') {
    title = 'Visualização do PDF';
    subtitle = 'Documento para impressão';
  } else if (activeView.type === 'client-detail') {
    title = 'Detalhes do Cliente';
    subtitle = 'Informações e histórico';
  }

  const initials = user?.name
    ? user.name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0].toUpperCase())
        .join('')
    : 'OF';

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 h-16 px-4 sm:px-6 flex items-center justify-between shrink-0 shadow-xs">
      <div className="max-w-3xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isSubView ? (
            <button
              id="header-back-btn"
              onClick={onNavigateBack}
              aria-label="Voltar"
              className="p-2 -ml-1 rounded-xl text-slate-700 hover:bg-slate-100 active:bg-slate-200 transition-colors flex items-center justify-center cursor-pointer border border-slate-200/60"
            >
              <ChevronLeft className="w-5 h-5 text-slate-800" />
            </button>
          ) : (
            <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center shadow-xs">
              <div className="w-4 h-4 border-2 border-white rounded-xs"></div>
            </div>
          )}

          <div>
            {isSubView ? (
              <>
                <h1 className="text-base sm:text-lg font-extrabold text-slate-900 leading-tight">
                  {title}
                </h1>
                <p className="text-[11px] text-slate-500 truncate max-w-[200px] sm:max-w-xs font-medium">
                  {subtitle}
                </p>
              </>
            ) : (
              <span className="text-xl sm:text-2xl font-black tracking-tighter text-slate-800">
                Orça<span className="text-blue-600">Fácil</span>
              </span>
            )}
          </div>
        </div>

        <button
          id="header-profile-btn"
          onClick={onNavigateToProfile}
          className="flex items-center gap-3 p-1 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer text-left"
          title="Ver perfil"
        >
          <div className="text-right hidden sm:block">
            <p className="text-xs sm:text-sm font-bold text-slate-800 leading-tight">
              {user?.name || 'Profissional'}
            </p>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold truncate max-w-[140px]">
              {user?.companyName || 'Prestador'}
            </p>
          </div>
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200 text-blue-600 font-bold text-xs sm:text-sm shadow-xs">
            {initials}
          </div>
        </button>
      </div>
    </header>
  );
};

