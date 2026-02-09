
import React from 'react';
import { BarChart2, ShieldCheck, Mail, Lock, Chrome, Github } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white rounded-[48px] p-12 shadow-2xl shadow-gray-200/50 border border-white">
          <div className="flex flex-col items-center mb-12">
            <div className="w-16 h-16 bg-black rounded-[24px] flex items-center justify-center mb-6 shadow-xl shadow-black/20">
              <BarChart2 size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Welcome Back</h1>
            <p className="text-gray-400 font-medium mt-2">HBS 매장 데이터 허브에 오신 것을 환영합니다.</p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="email" 
                placeholder="Email Address" 
                defaultValue="admin@hbs-hub.com"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-black transition-all outline-none"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="password" 
                placeholder="Password" 
                defaultValue="••••••••"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-black transition-all outline-none"
              />
            </div>

            <div className="flex items-center justify-between px-2 pt-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="w-4 h-4 rounded border border-gray-300 flex items-center justify-center group-hover:border-black transition-all">
                  <div className="w-2 h-2 bg-black rounded-[1px]"></div>
                </div>
                <span className="text-xs text-gray-500 font-bold">자동 로그인</span>
              </label>
              <button className="text-xs font-bold text-gray-900 hover:underline">비밀번호 찾기</button>
            </div>

            <button 
              onClick={onLogin}
              className="w-full py-4 bg-black text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-black/10 mt-4 flex items-center justify-center gap-3"
            >
              <ShieldCheck size={18} />
              Sign In to Hub
            </button>

            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-4 text-gray-300 font-bold tracking-widest">Or continue with</span></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 py-3.5 bg-white border border-gray-100 rounded-2xl text-xs font-bold hover:bg-gray-50 transition-all shadow-sm">
                <Chrome size={18} />
                Google
              </button>
              <button className="flex items-center justify-center gap-2 py-3.5 bg-white border border-gray-100 rounded-2xl text-xs font-bold hover:bg-gray-50 transition-all shadow-sm">
                <Github size={18} />
                GitHub
              </button>
            </div>
          </div>
        </div>
        
        <p className="text-center text-xs text-gray-400 font-medium mt-8">
          HBS Enterprise Solutions © 2024. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
