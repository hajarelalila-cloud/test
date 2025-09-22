import React from 'react';
import { LanguageToggle } from './components/LanguageToggle';
import { Header } from './components/Header';
import { InteractiveScene } from './components/InteractiveScene';
import { FallingObjectDemo } from './components/FallingObjectDemo';
import { KnowledgeSection } from './components/KnowledgeSection';
import { useLanguage } from './hooks/useLanguage';

function App() {
  const { language } = useLanguage();

  return (
    <div 
      className={`min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 
                  ${language === 'ar' ? 'font-arabic' : 'font-sans'}`}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Language Toggle */}
      <LanguageToggle />

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-8 space-y-12">
        {/* Interactive 3D Scene */}
        <section>
          <InteractiveScene />
        </section>

        {/* Falling Objects Demo */}
        <section>
          <FallingObjectDemo />
        </section>

        {/* Knowledge Section */}
        <section>
          <KnowledgeSection />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black/30 backdrop-blur-sm border-t border-white/10 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white/70 text-sm">
            Made with ❤️ for curious minds • Powered by Three.js & React
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;