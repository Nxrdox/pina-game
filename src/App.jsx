import pouImage from './assets/hero.png'
import { useState, useEffect } from 'react'

export default function App() {
  const [fome, setFome] = useState(70);
  const [energia, setEnergia] = useState(60);
  const [diversao, setDiversao] = useState(80);
  const [limpeza, setLimpeza] = useState(50);
  const [moedas, setMoedas] = useState(2995);
  const [mensagem, setMensagem] = useState('Seu personagem está vivo.');
  const [animando, setAnimando] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFome((v) => Math.max(v - 1, 0));
      setEnergia((v) => Math.max(v - 1, 0));
      setDiversao((v) => Math.max(v - 1, 0));
      setLimpeza((v) => Math.max(v - 1, 0));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const animar = () => {
    setAnimando(true);
    setTimeout(() => setAnimando(false), 400);
  };

  const alimentar = () => {
    setFome((v) => Math.min(v + 20, 100));
    setMoedas((v) => v - 10);
    setMensagem('Você alimentou o personagem 🍔');
    animar();
  };

  const jogar = () => {
    setDiversao((v) => Math.min(v + 25, 100));
    setEnergia((v) => Math.max(v - 10, 0));
    setMoedas((v) => v + 15);
    setMensagem('Ele se divertiu 🎮');
    animar();
  };

  const dormir = () => {
    setEnergia((v) => Math.min(v + 30, 100));
    setMensagem('Hora de dormir 😴');
    animar();
  };

  const limpar = () => {
    setLimpeza((v) => Math.min(v + 30, 100));
    setMensagem('Banho tomado 🛁');
    animar();
  };

  const bars = [
    { label: 'Fome', value: fome },
    { label: 'Energia', value: energia },
    { label: 'Diversão', value: diversao },
    { label: 'Limpeza', value: limpeza },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 via-cyan-200 to-yellow-100 flex flex-col items-center justify-center p-6 font-sans overflow-hidden relative">
      <div className="bg-gradient-to-b from-yellow-200 to-orange-300 rounded-[45px] shadow-[0_15px_50px_rgba(0,0,0,0.25)] border-4 border-orange-400 w-full max-w-md overflow-hidden backdrop-blur-xl">
        <div className="bg-white/60 backdrop-blur-sm p-4 flex justify-between items-center border-b border-orange-300">
          <div>
            <div className="text-3xl font-black text-orange-500 drop-shadow-md">{moedas}</div>
            <div className="text-xs font-bold text-slate-600">MOEDAS</div>
          </div>

          <div className="flex gap-3 text-2xl">
            <div className="bg-lime-400 rounded-xl w-12 h-12 flex items-center justify-center shadow-inner">+</div>
            <div className="bg-lime-400 rounded-xl w-12 h-12 flex items-center justify-center shadow-inner">⚡</div>
          </div>
        </div>

        <div className="relative bg-gradient-to-b from-sky-400 to-blue-500 h-[500px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[length:20px_20px]" />

          <div
            className={`relative flex flex-col items-center transition-transform duration-300 ${animando ? 'scale-110 rotate-2' : ''}`}
          >
            <div className="absolute -bottom-10 w-64 h-20 bg-black/40 blur-2xl rounded-full" />

            <div className="bg-yellow-100 rounded-[40%] p-3 border-4 border-orange-300 shadow-[0_10px_30px_rgba(0,0,0,0.2)] w-[290px] h-[330px] flex items-center justify-center overflow-hidden backdrop-blur-xl">
              <img
                src={pouImage}
                alt="Pou personalizado"
                className="w-full h-full object-cover rounded-[30%] saturate-110 contrast-105"
              />
            </div>
          </div>
        </div>

        <div className="bg-black/30 backdrop-blur-md p-5 space-y-4 border-t border-yellow-300">
          {bars.map((bar) => (
            <div key={bar.label}>
              <div className="flex justify-between text-white font-bold mb-1 text-lg">
                <span>{bar.label}</span>
                <span>{bar.value}%</span>
              </div>

              <div className="w-full h-5 bg-black/40 rounded-full overflow-hidden border border-black/30">
                <div className="h-full bg-gradient-to-r from-lime-400 to-green-500 rounded-full transition-all duration-500 shadow-[0_0_20px_rgba(168,85,247,0.8)]"
                  style={{ width: `${bar.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="bg-black/40 backdrop-blur-md p-4 grid grid-cols-2 gap-4 text-white border-t border-violet-500/30">
          <button
            onClick={alimentar}
            className="bg-orange-500 hover:scale-105 transition-transform rounded-2xl p-3 font-bold text-xl shadow-lg"
          >
            🍔 Alimentar
          </button>

          <button
            onClick={jogar}
            className="bg-blue-500 hover:scale-105 transition-transform rounded-2xl p-3 font-bold text-xl shadow-lg"
          >
            🎮 Jogar
          </button>

          <button
            onClick={dormir}
            className="bg-indigo-500 hover:scale-105 transition-transform rounded-2xl p-3 font-bold text-xl shadow-lg"
          >
            😴 Dormir
          </button>

          <button
            onClick={limpar}
            className="bg-cyan-500 hover:scale-105 transition-transform rounded-2xl p-3 font-bold text-xl shadow-lg"
          >
            🛁 Limpar
          </button>
        </div>
      </div>

      <div className="mt-5 bg-white/80 backdrop-blur-md rounded-2xl px-6 py-4 shadow-xl text-center max-w-md w-full">
        <h2 className="font-black text-xl text-slate-800 mb-1">Status</h2>
        <p className="text-slate-700 font-semibold">{mensagem}</p>
      </div>
    </div>
  );
}
