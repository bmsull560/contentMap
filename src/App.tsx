import { useState, useEffect } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LandingPage } from './components/LandingPage';
import { AuditRequestForm } from './components/AuditRequestForm';
import { AuditProcessor } from './components/AuditProcessor';
import { AuditReport } from './components/AuditReport';

type AppState = 'landing' | 'form' | 'processing' | 'report';

function App() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [requestId, setRequestId] = useState<string>('');
  const [reportId, setReportId] = useState<string>('');

  useEffect(() => {
    document.title = appState === 'landing'
      ? 'Content Mapping Audit - Optimize Your Sales Content Strategy | $299'
      : 'Content Mapping Audit';
  }, [appState]);

  const handleGetStarted = () => {
    setAppState('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFormSuccess = (id: string) => {
    setRequestId(id);
    setAppState('processing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewReport = (id: string) => {
    setReportId(id);
    setAppState('report');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setAppState('landing');
    setRequestId('');
    setReportId('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ErrorBoundary>
      {appState === 'landing' && <LandingPage onGetStarted={handleGetStarted} />}
      {appState === 'form' && (
        <AuditRequestForm onBack={handleBackToHome} onSuccess={handleFormSuccess} />
      )}
      {appState === 'processing' && requestId && (
        <AuditProcessor requestId={requestId} onViewReport={handleViewReport} />
      )}
      {appState === 'report' && reportId && (
        <AuditReport reportId={reportId} onBack={handleBackToHome} />
      )}
    </ErrorBoundary>
  );
}

export default App;
