import { useEffect, useState } from 'react';
import { Download, Monitor, X } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

export default function InstallAppButton() {
  const { language, t } = useApp();
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const standalone = window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone;
    setIsInstalled(Boolean(standalone));

    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
      setShowHelp(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  if (isInstalled) return null;

  const isArabic = language === 'ar';
  const isFrench = language === 'fr';
  const buttonLabel = isArabic ? 'تثبيت التطبيق' : isFrench ? "Installer l'application" : 'Install app';
  const helpTitle = isArabic ? 'تثبيت مدير الديون على الكمبيوتر' : isFrench ? "Installer le gestionnaire sur l'ordinateur" : 'Install Debt Manager on your computer';
  const helpText = isArabic
    ? 'اضغط على أيقونة التثبيت في شريط عنوان المتصفح، أو افتح قائمة المتصفح واختر «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية». بعد التثبيت سيعمل التطبيق في نافذة مستقلة مثل أي تطبيق سطح مكتب.'
    : isFrench
      ? "Cliquez sur l'icône d'installation dans la barre d'adresse, ou ouvrez le menu du navigateur et choisissez « Installer l'application ». L'application s'ouvrira ensuite dans une fenêtre indépendante."
      : 'Select the install icon in the browser address bar, or open the browser menu and choose “Install app”. After installation, the app opens in its own desktop window.';

  const handleInstall = async () => {
    if (!installPrompt) {
      setShowHelp(true);
      return;
    }
    installPrompt.prompt();
    const result = await installPrompt.userChoice;
    if (result.outcome === 'accepted') setInstallPrompt(null);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleInstall}
        className="inline-flex items-center gap-2 rounded-xl bg-white/20 px-3 py-2 text-xs font-bold text-white shadow-sm backdrop-blur-sm transition hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/70"
        title={buttonLabel}
      >
        <Download className="h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline">{buttonLabel}</span>
      </button>

      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="install-dialog-title">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 text-start shadow-2xl dark:bg-gray-800">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                  <Monitor className="h-6 w-6" aria-hidden="true" />
                </div>
                <h2 id="install-dialog-title" className="font-bold text-gray-900 dark:text-white">{helpTitle}</h2>
              </div>
              <button type="button" onClick={() => setShowHelp(false)} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-white" aria-label={t('close')}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm leading-7 text-gray-600 dark:text-gray-300">{helpText}</p>
            <button type="button" onClick={() => setShowHelp(false)} className="mt-5 w-full rounded-xl bg-emerald-500 px-4 py-3 font-bold text-white transition hover:bg-emerald-600">{t('close')}</button>
          </div>
        </div>
      )}
    </>
  );
}

export function registerPwaServiceWorker() {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch((error) => {
        console.error('PWA service worker registration failed:', error);
      });
    });
  }
}

export function usePwaServiceWorker() {
  useEffect(() => registerPwaServiceWorker(), []);
}

export { Download };
