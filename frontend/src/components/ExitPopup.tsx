'use client';
import { useEffect, useRef, useState } from 'react';
import { EyeOff, AlertTriangle, ArrowRight, Ghost } from 'lucide-react';

export default function ExitPopup() {
  const [show, setShow] = useState(false);
  const [stayed, setStayed] = useState(false);
  const triggered = useRef(false);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 10 && !triggered.current) {
        triggered.current = true;
        setShow(true);
      }
    };
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="glass-panel p-8 max-w-sm w-full text-center border border-violet-500/30 shadow-2xl relative">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-violet-600 to-rose-500 p-[1.5px] mb-4 shadow-lg shadow-violet-500/30">
          <div className="w-full h-full bg-[#0d0d15] rounded-[14px] flex items-center justify-center text-2xl">
            {stayed ? '🤔' : '🫥'}
          </div>
        </div>

        {stayed ? (
          <div>
            <h2 className="text-base font-bold text-white mb-2">You Decided to Stay.</h2>
            <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
              3 new transmissions just hit the network. You still cannot see any of them, but we appreciate your curiosity.
            </p>
            <button
              onClick={() => setShow(false)}
              className="btn-gradient w-full py-2.5 text-xs"
            >
              Continue Wondering
            </button>
          </div>
        ) : (
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-300 text-[10px] font-bold uppercase tracking-wider mb-2">
              <AlertTriangle className="w-3 h-3" />
              <span>FOMO Warning</span>
            </div>

            <h2 className="text-lg font-bold text-white mb-2">
              Are you sure you want to leave?
            </h2>
            <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
              Someone just posted the most life-changing take of the century. You will miss never being able to read it.
            </p>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => setStayed(true)}
                className="btn-gradient w-full py-2.5 text-xs shadow-lg shadow-violet-500/20"
              >
                Stay and wonder what it was
              </button>
              <button
                onClick={() => setShow(false)}
                className="text-[11px] text-zinc-400 hover:text-zinc-300 py-1 transition-colors"
              >
                I'll leave anyway
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
