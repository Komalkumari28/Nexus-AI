import { ChatWorkspace } from './components/ChatWorkspace'
import { useChatStore } from './store/useChatStore'
import { useAuthStore } from './store/useAuthStore'
import { useEffect, Suspense } from 'react'
import { AuthModal } from './components/auth/AuthModal'

const LoadingScreen = () => (
  <div className="h-screen w-full flex flex-col items-center justify-center bg-[#020203]">
    <div className="relative mb-6">
      <div className="absolute inset-0 bg-primary/20 blur-3xl animate-pulse rounded-full" />
      <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center relative z-10">
        <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    </div>
    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 animate-pulse">Establishing Neural Link</p>
  </div>
);

function App() {
  const { settings } = useChatStore()
  const { user, loading, initialize } = useAuthStore()

  useEffect(() => {
    initialize()
  }, [])

  useEffect(() => {
    const root = window.document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  }, [settings.theme])

  if (loading) return <LoadingScreen />;

  return (
    <div className="antialiased font-sans selection:bg-primary/30 selection:text-white min-h-screen bg-background transition-colors duration-500 overflow-hidden">
      <Suspense fallback={<LoadingScreen />}>
        {user ? (
          <ChatWorkspace />
        ) : (
          <div className="h-screen w-full flex items-center justify-center bg-[#020203]">
            <AuthModal isOpen={true} onClose={() => {}} />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#1e1b4b33,_transparent)] pointer-events-none" />
          </div>
        )}
      </Suspense>
    </div>
  )
}

export default App
