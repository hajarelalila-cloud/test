import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { Play, RotateCcw, Zap, Info, Eye, Settings } from 'lucide-react';

export const FallingObjectDemo: React.FC = () => {
  const { t, language } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [slowMotion, setSlowMotion] = useState(false);
  const [showPhysics, setShowPhysics] = useState(false);
  const [selectedMass, setSelectedMass] = useState(1.0);
  const [selectedHeight, setSelectedHeight] = useState(1.0);
  const objectRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);

  const steps = [
    { 
      text: t.fallingStep1, 
      duration: 1500,
      physics: "الجسم في حالة سكون نسبي في الزمكان المسطح"
    },
    { 
      text: t.fallingStep2, 
      duration: 2500,
      physics: "يبدأ الجسم بالتسارع بمعدل 9.8 م/ث² نحو مركز الأرض"
    },
    { 
      text: t.fallingStep3, 
      duration: 3000,
      physics: "الجسم يتبع الخط الجيوديسي (أقصر مسار) في الزمكان المنحني"
    }
  ];

  const startAnimation = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentStep(0);
    
    // Clear previous trail
    if (trailRef.current) {
      trailRef.current.innerHTML = '';
    }
    
    const runStep = (step: number) => {
      if (step >= steps.length) {
        setIsAnimating(false);
        return;
      }
      
      setCurrentStep(step);
      const duration = steps[step].duration * (slowMotion ? 2.5 : 1);
      
      // Add trail points during animation
      if (step > 0) {
        addTrailPoint(step);
      }
      
      setTimeout(() => runStep(step + 1), duration);
    };
    
    runStep(0);
  };

  const addTrailPoint = (step: number) => {
    if (!trailRef.current) return;
    
    const trailPoint = document.createElement('div');
    trailPoint.className = 'absolute w-2 h-2 bg-yellow-300 rounded-full opacity-60 animate-pulse';
    
    // Position based on step
    const positions = [
      { top: '20%', left: '50%' },
      { top: '50%', left: '50%' },
      { top: '75%', left: '50%' }
    ];
    
    if (positions[step - 1]) {
      trailPoint.style.top = positions[step - 1].top;
      trailPoint.style.left = positions[step - 1].left;
      trailPoint.style.transform = 'translate(-50%, -50%)';
      trailRef.current.appendChild(trailPoint);
      
      // Fade out after delay
      setTimeout(() => {
        if (trailPoint.parentNode) {
          trailPoint.style.opacity = '0';
          setTimeout(() => {
            if (trailPoint.parentNode) {
              trailPoint.parentNode.removeChild(trailPoint);
            }
          }, 1000);
        }
      }, 2000);
    }
  };

  const reset = () => {
    setCurrentStep(0);
    setIsAnimating(false);
    if (trailRef.current) {
      trailRef.current.innerHTML = '';
    }
  };

  const toggleSlowMotion = () => {
    setSlowMotion(!slowMotion);
  };

  const togglePhysics = () => {
    setShowPhysics(!showPhysics);
  };

  // Calculate fall time based on height and mass
  const calculateFallTime = () => {
    const g = 9.8; // m/s²
    const height = selectedHeight * 10; // meters
    return Math.sqrt(2 * height / g).toFixed(2);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 rounded-2xl shadow-2xl overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-indigo-800/50 to-purple-800/50 backdrop-blur-sm">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 text-center">
          {t.fallingTitle}
        </h2>
        <p className="text-white/80 max-w-2xl mx-auto text-center mb-4">
          {t.fallingDescription}
        </p>
        
        {/* Physics Parameters */}
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <div className="bg-white/10 rounded-lg px-3 py-2">
            <span className="text-white/70">الكتلة: </span>
            <span className="text-white font-semibold">{selectedMass.toFixed(1)} كغ</span>
          </div>
          <div className="bg-white/10 rounded-lg px-3 py-2">
            <span className="text-white/70">الارتفاع: </span>
            <span className="text-white font-semibold">{(selectedHeight * 10).toFixed(1)} م</span>
          </div>
          <div className="bg-white/10 rounded-lg px-3 py-2">
            <span className="text-white/70">زمن السقوط: </span>
            <span className="text-white font-semibold">{calculateFallTime()} ث</span>
          </div>
        </div>
      </div>

      {/* Enhanced Animation Container */}
      <div className="relative bg-black/30 rounded-xl m-6 p-8 min-h-[400px] overflow-hidden border border-white/10">
        {/* Advanced Spacetime Grid Background */}
        <div className="absolute inset-0 opacity-30">
          <svg width="100%" height="100%" className="w-full h-full">
            <defs>
              <pattern id="enhanced-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="white" strokeWidth="0.5"/>
                <circle cx="15" cy="15" r="1" fill="white" opacity="0.3"/>
              </pattern>
              <radialGradient id="earth-gravity" cx="50%" cy="85%" r="60%">
                <stop offset="0%" stopColor="rgba(100,200,255,0.8)"/>
                <stop offset="50%" stopColor="rgba(100,150,255,0.4)"/>
                <stop offset="100%" stopColor="rgba(100,100,255,0.1)"/>
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#enhanced-grid)" />
            <ellipse cx="50%" cy="85%" rx="40%" ry="30%" fill="url(#earth-gravity)" />
          </svg>
        </div>

        {/* Curvature Visualization */}
        {currentStep >= 2 && (
          <div className="absolute inset-0 pointer-events-none">
            <svg width="100%" height="100%" className="w-full h-full">
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              {/* Spacetime curvature lines */}
              <path
                d="M 10% 70% Q 50% 60% 90% 70%"
                stroke="rgba(100,200,255,0.8)"
                strokeWidth="2"
                fill="none"
                strokeDasharray="5,5"
                filter="url(#glow)"
                className="animate-pulse"
              />
              <path
                d="M 20% 75% Q 50% 65% 80% 75%"
                stroke="rgba(150,200,255,0.6)"
                strokeWidth="1.5"
                fill="none"
                strokeDasharray="3,3"
                filter="url(#glow)"
                className="animate-pulse"
              />
              <path
                d="M 30% 80% Q 50% 70% 70% 80%"
                stroke="rgba(200,200,255,0.4)"
                strokeWidth="1"
                fill="none"
                strokeDasharray="2,2"
                filter="url(#glow)"
                className="animate-pulse"
              />
            </svg>
          </div>
        )}

        {/* Enhanced Earth */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-24 rounded-full shadow-2xl flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-green-400 to-blue-600 rounded-full"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20 rounded-full"></div>
          <div className="relative z-10 text-3xl">🌍</div>
          
          {/* Gravitational field visualization */}
          {showPhysics && (
            <div className="absolute inset-0 -m-8">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="absolute border border-blue-300/30 rounded-full animate-pulse"
                  style={{
                    width: `${(i + 1) * 40}px`,
                    height: `${(i + 1) * 40}px`,
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    animationDelay: `${i * 0.2}s`
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Trail container */}
        <div ref={trailRef} className="absolute inset-0 pointer-events-none" />

        {/* Enhanced Falling Object */}
        <div
          ref={objectRef}
          className={`absolute w-8 h-8 rounded-full shadow-2xl transition-all duration-1000 ease-in-out flex items-center justify-center z-20
            ${currentStep === 0 ? 'top-4 left-1/2 transform -translate-x-1/2' : ''}
            ${currentStep === 1 ? 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' : ''}
            ${currentStep >= 2 ? 'bottom-24 left-1/2 transform -translate-x-1/2' : ''}
          `}
          style={{
            background: `radial-gradient(circle, #ffd700, #ffaa00)`,
            boxShadow: '0 0 20px rgba(255, 215, 0, 0.6), 0 0 40px rgba(255, 215, 0, 0.3)',
            transform: `translate(-50%, 0) scale(${selectedMass})`
          }}
        >
          <span className="text-lg">⚽</span>
          
          {/* Velocity vector */}
          {currentStep >= 1 && showPhysics && (
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
              <div className="flex flex-col items-center">
                <div className="w-0.5 h-6 bg-red-400 animate-pulse"></div>
                <div className="text-xs text-red-400 font-bold">v</div>
              </div>
            </div>
          )}
        </div>

        {/* Force Arrows */}
        {currentStep >= 1 && showPhysics && (
          <div className={`absolute transition-all duration-500 ${language === 'ar' ? 'right-8' : 'left-8'} top-1/2 transform -translate-y-1/2`}>
            <div className="flex flex-col items-center text-white/80">
              <div className="text-3xl mb-2 animate-bounce">⬇️</div>
              <div className="text-xs font-medium bg-black/50 px-2 py-1 rounded">
                F = mg = {(selectedMass * 9.8).toFixed(1)}N
              </div>
            </div>
          </div>
        )}

        {/* Physics Explanation Overlay */}
        {showPhysics && currentStep > 0 && (
          <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md rounded-xl p-4 max-w-xs">
            <h4 className="text-white font-bold text-sm mb-2">الفيزياء الحالية:</h4>
            <p className="text-white/80 text-xs leading-relaxed">
              {steps[currentStep]?.physics}
            </p>
            <div className="mt-2 text-xs text-yellow-300">
              التسارع: 9.8 م/ث² ⬇️
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Step Indicator */}
      <div className="mx-6 mb-6 bg-gradient-to-r from-black/60 to-black/40 backdrop-blur-md rounded-xl p-6 border border-white/10">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full mx-1 transition-all duration-300 ${
                  index <= currentStep ? 'bg-yellow-400 shadow-lg' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
          
          <div className="text-lg font-semibold text-white mb-3">
            {currentStep < steps.length ? steps[currentStep].text : '🎯 اكتمل المشهد!'}
          </div>
          
          {currentStep >= steps.length && (
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg p-4 border border-yellow-500/30">
              <div className="text-yellow-300 font-bold mb-2">💡 الشرح النهائي:</div>
              <div className="text-white/90 text-sm leading-relaxed">
                {t.fallingExplanation}
              </div>
              <div className="mt-3 text-xs text-blue-300">
                <strong>معادلة أينشتاين:</strong> Gμν = 8πTμν
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Controls */}
      <div className="p-6 bg-black/40 backdrop-blur-sm border-t border-white/10">
        {/* Parameter Controls */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-lg p-4">
            <label className="block text-white text-sm font-medium mb-2">كتلة الجسم (كغ)</label>
            <input
              type="range"
              min="0.5"
              max="3.0"
              step="0.1"
              value={selectedMass}
              onChange={(e) => setSelectedMass(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            />
            <div className="text-white/70 text-xs mt-1">{selectedMass.toFixed(1)} كغ</div>
          </div>
          
          <div className="bg-white/10 rounded-lg p-4">
            <label className="block text-white text-sm font-medium mb-2">الارتفاع الابتدائي (م)</label>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={selectedHeight}
              onChange={(e) => setSelectedHeight(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            />
            <div className="text-white/70 text-xs mt-1">{(selectedHeight * 10).toFixed(1)} م</div>
          </div>
        </div>

        {/* Main Controls */}
        <div className="flex justify-center gap-4 flex-wrap mb-4">
          <button
            onClick={startAnimation}
            disabled={isAnimating}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 
                     text-white px-6 py-3 rounded-full transition-all duration-300
                     hover:scale-105 active:scale-95 shadow-lg disabled:hover:scale-100"
          >
            <Play size={18} />
            {isAnimating ? 'جاري التشغيل...' : t.replay}
          </button>

          <button
            onClick={toggleSlowMotion}
            className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300
                       hover:scale-105 active:scale-95 shadow-lg
                       ${slowMotion 
                         ? 'bg-orange-600 hover:bg-orange-700' 
                         : 'bg-blue-600 hover:bg-blue-700'
                       } text-white`}
          >
            <Zap size={18} />
            {slowMotion ? 'سرعة عادية' : t.slowMotion}
          </button>

          <button
            onClick={togglePhysics}
            className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300
                       hover:scale-105 active:scale-95 shadow-lg
                       ${showPhysics 
                         ? 'bg-purple-600 hover:bg-purple-700' 
                         : 'bg-gray-600 hover:bg-gray-700'
                       } text-white`}
          >
            <Eye size={18} />
            {showPhysics ? 'إخفاء الفيزياء' : 'إظهار الفيزياء'}
          </button>

          <button
            onClick={reset}
            className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 
                     text-white px-6 py-3 rounded-full transition-all duration-300
                     hover:scale-105 active:scale-95 shadow-lg"
          >
            <RotateCcw size={18} />
            {t.reset}
          </button>
        </div>

        {/* Physics Information Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-lg p-3 border border-blue-500/30">
            <h4 className="text-blue-300 font-semibold mb-1 flex items-center gap-2">
              <Info size={16} />
              قانون الجاذبية
            </h4>
            <p className="text-white/80">F = GMm/r²</p>
            <p className="text-white/60 text-xs mt-1">قوة الجذب تتناسب عكسياً مع مربع المسافة</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-600/20 to-teal-600/20 rounded-lg p-3 border border-green-500/30">
            <h4 className="text-green-300 font-semibold mb-1 flex items-center gap-2">
              <Settings size={16} />
              معادلات الحركة
            </h4>
            <p className="text-white/80">v = gt, s = ½gt²</p>
            <p className="text-white/60 text-xs mt-1">السرعة والمسافة في السقوط الحر</p>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 rounded-lg p-3 border border-yellow-500/30">
            <h4 className="text-yellow-300 font-semibold mb-1 flex items-center gap-2">
              <Zap size={16} />
              الطاقة
            </h4>
            <p className="text-white/80">E = mgh → ½mv²</p>
            <p className="text-white/60 text-xs mt-1">تحول الطاقة الكامنة إلى حركية</p>
          </div>
        </div>
      </div>
    </div>
  );
};