import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-[32px] border border-red-100 shadow-sm max-w-md w-full text-center space-y-4">
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto text-xl font-bold">
              ⚠️
            </div>
            <h2 className="font-display text-xl font-black text-stone-900">
              Erro no Painel Administrativo
            </h2>
            <p className="text-sm text-stone-500 leading-relaxed">
              Ocorreu um erro ao carregar os dados. Geralmente isso acontece quando o backend do Convex não foi totalmente atualizado.
            </p>
            <div className="bg-red-50 text-red-700 text-xs font-mono p-3 rounded-xl break-all text-left">
              {this.state.error?.message}
            </div>
            <p className="text-xs text-stone-400">
              Tente rodar <code className="bg-stone-100 px-1 py-0.5 rounded font-bold text-stone-700">npx convex dev</code> ou <code className="bg-stone-100 px-1 py-0.5 rounded font-bold text-stone-700">npx convex deploy</code> no terminal do seu projeto para sincronizar as funções de banco de dados.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-stone-900 text-white font-bold text-xs px-6 py-3 rounded-xl hover:bg-stone-800 transition-colors w-full"
            >
              Recarregar Página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
