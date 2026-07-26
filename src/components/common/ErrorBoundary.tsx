import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 my-4 bg-rose-50/80 border border-rose-200 rounded-2xl text-slate-900 space-y-3">
          <div className="flex items-center gap-2.5 text-rose-700">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <h3 className="font-bold text-sm">
              {this.props.fallbackTitle || 'Un problème est survenu dans ce composant'}
            </h3>
          </div>
          <p className="text-xs text-rose-600/90 leading-relaxed font-medium">
            {this.state.error?.message || 'Une erreur inattendue s\'est produite. Veuillez réessayer.'}
          </p>
          <button
            onClick={this.handleReset}
            className="px-4 py-2 text-xs font-bold text-rose-700 bg-white hover:bg-rose-100/60 border border-rose-300 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Réinitialiser la vue</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
