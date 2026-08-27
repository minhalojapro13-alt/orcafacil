import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FileCheck, LogIn, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

interface LoginViewProps {
  onSwitchToRegister: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onSwitchToRegister }) => {
  const { login, loginAsDemo } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Por favor, informe seu e-mail.');
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
      login(email.trim(), password);
      setLoading(false);
    }, 200);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Logo & Header */}
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20 mb-3">
            <FileCheck className="w-8 h-8 stroke-[2.5]" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            OrçaFácil
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-xs font-medium">
            Crie seu orçamento profissional pelo celular em segundos.
          </p>
        </div>

        {/* Card */}
        <div className="mt-8 bg-white py-8 px-5 sm:px-8 shadow-sm rounded-2xl border border-slate-200">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="login-email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                E-mail
              </label>
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seuemail@exemplo.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 text-slate-900 placeholder:text-slate-400 text-sm font-medium transition-all outline-none bg-slate-50/30"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="login-password" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Senha
                </label>
                <span className="text-[11px] text-slate-400">Qualquer senha no MVP</span>
              </div>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 text-slate-900 placeholder:text-slate-400 text-sm font-medium transition-all outline-none bg-slate-50/30"
              />
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Entrar</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <button
              id="login-demo-btn"
              type="button"
              onClick={loginAsDemo}
              className="w-full py-3 px-4 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100/60 text-blue-700 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Acessar com Dados de Demonstração</span>
            </button>
            <p className="mt-1.5 text-center text-[11px] text-slate-400 font-medium">
              Conta de teste com clientes e orçamentos já cadastrados
            </p>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-600 font-medium">
              Não tem uma conta?{' '}
              <button
                id="login-to-register-btn"
                type="button"
                onClick={onSwitchToRegister}
                className="font-bold text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center gap-1 cursor-pointer"
              >
                Criar conta <ArrowRight className="w-3 h-3" />
              </button>
            </p>
          </div>
        </div>

        {/* Security badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
          <ShieldCheck className="w-4 h-4 text-slate-400" />
          <span>OrçaFácil MVP • Seus dados salvos com segurança</span>
        </div>
      </div>
    </div>
  );
};
