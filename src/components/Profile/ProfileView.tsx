import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  User,
  Building2,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Crown,
  CheckCircle,
  Save,
  LogOut,
  RotateCcw,
  Trash2,
  ShieldCheck,
  Check,
} from 'lucide-react';

interface ProfileViewProps {
  onDataChanged: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onDataChanged }) => {
  const { user, updateProfile, resetDemoData, clearUserData, logout } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [companyName, setCompanyName] = useState(user?.companyName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [city, setCity] = useState(user?.city || '');
  const [pixKey, setPixKey] = useState(user?.pixKey || '');

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [demoNotice, setDemoNotice] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setCompanyName(user.companyName || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setCity(user.city || '');
      setPixKey(user.pixKey || '');
    }
  }, [user]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name.trim(),
      companyName: companyName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      city: city.trim() || undefined,
      pixKey: pixKey.trim() || undefined,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleResetDemo = () => {
    if (confirm('Deseja restaurar os clientes e orçamentos de exemplo? Seus dados atuais serão substituídos pelos de demonstração.')) {
      resetDemoData();
      onDataChanged();
      setDemoNotice('Dados de demonstração restaurados com sucesso!');
      setTimeout(() => setDemoNotice(''), 3000);
    }
  };

  const handleClearData = () => {
    if (confirm('Atenção: Isso irá apagar todos os clientes e orçamentos para que você comece com o sistema 100% limpo com dados reais. Deseja continuar?')) {
      clearUserData();
      onDataChanged();
      setDemoNotice('Todos os dados foram limpos. Pronto para dados reais!');
      setTimeout(() => setDemoNotice(''), 3000);
    }
  };

  return (
    <div className="space-y-5 pb-24 max-w-2xl mx-auto">
      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-xl font-black shadow-md shadow-blue-600/20">
          {name ? name.charAt(0).toUpperCase() : <User className="w-6 h-6" />}
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900">{name || 'Seu Nome'}</h2>
          <p className="text-xs font-bold text-blue-600">{companyName || 'Sua Empresa'}</p>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">{email}</p>
        </div>
      </div>

      {/* Subscription Plan Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                Plano Atual
              </span>
              <h3 className="text-base font-black text-white">Plano Gratuito (MVP)</h3>
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Ativo
          </span>
        </div>

        <div className="pt-2 border-t border-slate-800 space-y-1.5 text-xs text-slate-300 font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Criação ilimitada de orçamentos pelo celular</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Envio instantâneo para WhatsApp</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Geração de PDF com layout profissional</span>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Dados da Empresa e Prestador
          </h3>
          <span className="text-[11px] text-slate-400 font-medium">Aparecem no cabeçalho do PDF</span>
        </div>

        {saveSuccess && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-1.5">
            <Check className="w-4 h-4" />
            <span>Dados salvos com sucesso!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-3.5">
          <div>
            <label htmlFor="prof-name" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-400" />
              Seu Nome Completo
            </label>
            <input
              id="prof-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 text-slate-900 text-sm font-medium outline-none bg-slate-50/30 transition-all"
            />
          </div>

          <div>
            <label htmlFor="prof-company" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              Nome da Empresa / Nome Comercial
            </label>
            <input
              id="prof-company"
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 text-slate-900 text-sm font-medium outline-none bg-slate-50/30 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="prof-phone" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                Telefone / WhatsApp
              </label>
              <input
                id="prof-phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 text-slate-900 text-sm font-medium outline-none bg-slate-50/30 transition-all"
              />
            </div>

            <div>
              <label htmlFor="prof-email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                E-mail
              </label>
              <input
                id="prof-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 text-slate-900 text-sm font-medium outline-none bg-slate-50/30 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="prof-city" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Cidade / Estado
              </label>
              <input
                id="prof-city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ex: São Paulo - SP"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 text-slate-900 text-sm font-medium outline-none bg-slate-50/30 transition-all"
              />
            </div>

            <div>
              <label htmlFor="prof-pix" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                Chave PIX (para receber)
              </label>
              <input
                id="prof-pix"
                type="text"
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
                placeholder="CPF, CNPJ, celular ou e-mail"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 text-slate-900 text-sm font-medium outline-none bg-slate-50/30 transition-all"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              id="save-profile-btn"
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-blue-600/20 flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-[0.99]"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Alterações do Perfil</span>
            </button>
          </div>
        </form>
      </div>

      {/* Data Management & Demo Controls */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Gerenciamento de Dados (Demonstração vs Real)
        </h3>

        {demoNotice && (
          <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold">
            {demoNotice}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          <button
            id="reset-demo-data-btn"
            onClick={handleResetDemo}
            className="p-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
          >
            <RotateCcw className="w-4 h-4 text-blue-600" />
            <span>Restaurar Dados Demo</span>
          </button>

          <button
            id="clear-all-data-btn"
            onClick={handleClearData}
            className="p-3 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-700 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
          >
            <Trash2 className="w-4 h-4 text-rose-600" />
            <span>Limpar Dados (Usar Real)</span>
          </button>
        </div>
      </div>

      {/* Logout button */}
      <div className="pt-2">
        <button
          id="logout-btn"
          onClick={logout}
          className="w-full py-3.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
        >
          <LogOut className="w-4 h-4 text-slate-500" />
          <span>Sair da Conta</span>
        </button>
      </div>

      <div className="text-center text-xs text-slate-400 pt-2 flex items-center justify-center gap-1">
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>OrçaFácil v1.0 • Preparado para Supabase</span>
      </div>
    </div>
  );
};
