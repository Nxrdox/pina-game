import { useEffect, useMemo, useState } from 'react'

const pouImage = new URL('./assets/hero.png', import.meta.url).href
const SAVE_KEY = 'pina-game-save-v1'

const DEFAULT_SAVE = {
  fome: 70,
  energia: 60,
  diversao: 80,
  limpeza: 50,
  score: 0,
  cosmeticoAtivo: null,
  cosmeticosComprados: [],
}

function carregarProgresso() {
  try {
    const salvo = localStorage.getItem(SAVE_KEY)
    if (!salvo) return DEFAULT_SAVE

    const dados = JSON.parse(salvo)

    return {
      ...DEFAULT_SAVE,
      ...dados,
      cosmeticosComprados: Array.isArray(dados.cosmeticosComprados) ? dados.cosmeticosComprados : [],
    }
  } catch {
    return DEFAULT_SAVE
  }
}

function salvarProgresso(dados) {
  localStorage.setItem(SAVE_KEY, JSON.stringify(dados))
}

const COSMETICOS = [
  { id: 'headset', nome: 'Headset Gamer', emoji: '🎧', imagem: new URL('./assets/cosmeticos/headset.jpeg', import.meta.url).href, descricao: 'Som nas veias, score nas veia', multiplicador: 1.5, preco: 200 },
  { id: 'bone', nome: 'Boné Streetwear', emoji: '🧢', imagem: new URL('./assets/cosmeticos/bone.jpeg', import.meta.url).href, descricao: 'Drip ativado, score dobrado', multiplicador: 1.3, preco: 100 },
  { id: 'pirata', nome: 'Chapéu Pirata', emoji: '☠️', imagem: new URL('./assets/cosmeticos/pirata.jpeg', import.meta.url).href, descricao: 'Saqueia o scoreboard', multiplicador: 1.8, preco: 350 },
  { id: 'samurai', nome: 'Elmo Samurai', emoji: '⚔️', imagem: new URL('./assets/cosmeticos/samurai.jpeg', import.meta.url).href, descricao: 'Honra e score infinito', multiplicador: 2.5, preco: 800 },
  { id: 'coroa', nome: 'Coroa do Rei', emoji: '👑', imagem: new URL('./assets/cosmeticos/coroa.jpeg', import.meta.url).href, descricao: 'O rei do score', multiplicador: 3.0, preco: 1500 },
  { id: 'cavaleiro', nome: 'Elmo Medieval', emoji: '🛡️', imagem: new URL('./assets/cosmeticos/cavaleiro.jpeg', import.meta.url).href, descricao: 'Defende o score a qualquer custo', multiplicador: 2.0, preco: 600 },
  { id: 'vr', nome: 'Óculos VR', emoji: '🥽', imagem: new URL('./assets/cosmeticos/vr.jpeg', import.meta.url).href, descricao: 'Score em realidade aumentada', multiplicador: 2.2, preco: 700 },
  { id: 'cyberpunk', nome: 'Visor Cyberpunk', emoji: '🔵', imagem: new URL('./assets/cosmeticos/cyberpunk.jpeg', import.meta.url).href, descricao: 'Futuro chegou, score também', multiplicador: 2.8, preco: 1000 },
  { id: 'bandana', nome: 'Bandana Swag', emoji: '🎀', imagem: new URL('./assets/cosmeticos/bandana.jpeg', import.meta.url).href, descricao: 'Estilo e score juntos', multiplicador: 1.6, preco: 250 },
  { id: 'fedora', nome: 'Fedora Clássico', emoji: '🎩', imagem: new URL('./assets/cosmeticos/fedora.jpeg', import.meta.url).href, descricao: 'Classe que multiplica', multiplicador: 1.9, preco: 450 },
]

const MINIGAMES = [
  {
    id: 'volei',
    nome: 'Vôlei',
    emoji: '🏐',
    descricao: 'Clique quando a bola estiver na área verde para rebater.',
  },
  {
    id: 'comida',
    nome: 'Comida do Céu',
    emoji: '🍔',
    descricao: 'Pegue as comidas e desvie das bombas.',
  },
  {
    id: 'escalada',
    nome: 'Escalada',
    emoji: '🧗',
    descricao: 'Escolha o lado correto para subir sem cair.',
  },
]

function clamp(value, min = 0, max = 100) {
  return Math.min(Math.max(value, min), max)
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function Character({ cosmeticoAtivo, animando }) {
  const cosmetico = COSMETICOS.find(c => c.id === cosmeticoAtivo)
  const personagemImagem = cosmetico?.imagem || pouImage

  return (
    <div className={`relative flex flex-col items-center transition-transform duration-300 ${animando ? 'scale-110 rotate-2' : ''}`}>
      <div className="absolute -bottom-10 w-64 h-20 bg-black/40 blur-2xl rounded-full" />

      <div className="bg-yellow-100 rounded-[40%] p-3 border-4 border-orange-300 shadow-[0_10px_30px_rgba(0,0,0,0.2)] w-[260px] h-[300px] flex items-center justify-center overflow-hidden backdrop-blur-xl">
        <img
          src={personagemImagem}
          alt={cosmetico ? `Personagem com ${cosmetico.nome}` : 'Personagem'}
          className="w-full h-full object-cover rounded-[30%] saturate-110 contrast-105"
        />
      </div>
    </div>
  )
}

function VolleyballGame({ onFinish, multiplicador }) {
  const [tempo, setTempo] = useState(20)
  const [pontos, setPontos] = useState(0)
  const [bola, setBola] = useState(10)
  const [direcao, setDirecao] = useState(1)
  const [mensagem, setMensagem] = useState('Acerte a bola na zona verde!')

  useEffect(() => {
    const timer = setInterval(() => {
      setTempo(t => {
        if (t <= 1) {
          clearInterval(timer)
          const ganho = Math.round(pontos * 8 * multiplicador)
          onFinish(ganho, `Fim do vôlei! Você fez ${pontos} rebatidas e ganhou ${ganho}⭐`)
          return 0
        }
        return t - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [pontos, multiplicador, onFinish])

  useEffect(() => {
    const movimento = setInterval(() => {
      setBola(pos => {
        if (pos >= 92) {
          setDirecao(-1)
          return 92
        }
        if (pos <= 4) {
          setDirecao(1)
          return 4
        }
        return pos + direcao * 4
      })
    }, 80)

    return () => clearInterval(movimento)
  }, [direcao])

  const rebater = () => {
    if (bola >= 40 && bola <= 60) {
      setPontos(p => p + 1)
      setMensagem('Boa! Rebatida perfeita 🏐')
    } else {
      setMensagem('Errou o tempo da bola!')
    }
  }

  return (
    <div className="p-4 space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-black text-slate-800">🏐 Vôlei</h2>
        <p className="text-sm font-bold text-slate-600">Tempo: {tempo}s • Rebatidas: {pontos}</p>
      </div>

      <div className="relative h-56 bg-gradient-to-b from-sky-300 to-emerald-300 rounded-3xl border-4 border-white overflow-hidden shadow-inner">
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-white/70" />
        <div className="absolute left-[40%] right-[40%] bottom-4 h-12 rounded-2xl bg-green-500/70 border-2 border-green-800" />
        <div className="absolute bottom-8 text-5xl transition-all duration-75" style={{ left: `${bola}%` }}>🏐</div>
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-5xl">🧍</div>
      </div>

      <button onClick={rebater} className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-2xl p-4 font-black text-xl shadow-lg active:scale-95 transition">
        Rebater!
      </button>

      <p className="text-center font-bold text-slate-700">{mensagem}</p>
    </div>
  )
}

function FallingFoodGame({ onFinish, multiplicador }) {
  const [tempo, setTempo] = useState(25)
  const [pontos, setPontos] = useState(0)
  const [player, setPlayer] = useState(45)
  const [items, setItems] = useState([])

  useEffect(() => {
    const timer = setInterval(() => {
      setTempo(t => {
        if (t <= 1) {
          clearInterval(timer)
          const ganho = Math.round(Math.max(pontos, 0) * 5 * multiplicador)
          onFinish(ganho, `Fim da chuva de comida! Pontuação: ${pontos}. Você ganhou ${ganho}⭐`)
          return 0
        }
        return t - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [pontos, multiplicador, onFinish])

  useEffect(() => {
    const spawn = setInterval(() => {
      setItems(prev => [
        ...prev,
        {
          id: crypto.randomUUID(),
          x: randomBetween(5, 90),
          y: 0,
          tipo: Math.random() > 0.2 ? 'food' : 'bomb',
          emoji: Math.random() > 0.2 ? ['🍔', '🍕', '🍎', '🍩'][randomBetween(0, 3)] : '💣',
        },
      ])
    }, 700)

    const fall = setInterval(() => {
      setItems(prev => {
        const updated = prev.map(item => ({ ...item, y: item.y + 6 }))
        const remaining = []

        updated.forEach(item => {
          const pegou = item.y >= 78 && Math.abs(item.x - player) <= 12

          if (pegou) {
            if (item.tipo === 'food') setPontos(p => p + 1)
            else setPontos(p => Math.max(p - 2, 0))
            return
          }

          if (item.y < 100) remaining.push(item)
        })

        return remaining
      })
    }, 120)

    return () => {
      clearInterval(spawn)
      clearInterval(fall)
    }
  }, [player])

  const mover = (amount) => {
    setPlayer(p => clamp(p + amount, 0, 90))
  }

  return (
    <div className="p-4 space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-black text-slate-800">🍔 Comida do Céu</h2>
        <p className="text-sm font-bold text-slate-600">Tempo: {tempo}s • Comidas: {pontos}</p>
      </div>

      <div className="relative h-72 bg-gradient-to-b from-blue-300 to-lime-300 rounded-3xl border-4 border-white overflow-hidden shadow-inner">
        {items.map(item => (
          <div key={item.id} className="absolute text-4xl transition-all duration-100" style={{ left: `${item.x}%`, top: `${item.y}%` }}>
            {item.emoji}
          </div>
        ))}
        <div className="absolute bottom-2 text-5xl transition-all duration-100" style={{ left: `${player}%` }}>🧺</div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => mover(-14)} className="bg-orange-500 hover:bg-orange-400 text-white rounded-2xl p-4 font-black text-xl shadow-lg active:scale-95 transition">⬅️ Esquerda</button>
        <button onClick={() => mover(14)} className="bg-orange-500 hover:bg-orange-400 text-white rounded-2xl p-4 font-black text-xl shadow-lg active:scale-95 transition">Direita ➡️</button>
      </div>
    </div>
  )
}

function ClimbingGame({ onFinish, multiplicador }) {
  const [tempo, setTempo] = useState(25)
  const [altura, setAltura] = useState(0)
  const [ladoSeguro, setLadoSeguro] = useState(() => (Math.random() > 0.5 ? 'esquerda' : 'direita'))
  const [mensagem, setMensagem] = useState('Escolha um lado para subir!')

  useEffect(() => {
    const timer = setInterval(() => {
      setTempo(t => {
        if (t <= 1) {
          clearInterval(timer)
          const ganho = Math.round(altura * 4 * multiplicador)
          onFinish(ganho, `Fim da escalada! Altura: ${altura}m. Você ganhou ${ganho}⭐`)
          return 0
        }
        return t - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [altura, multiplicador, onFinish])

  const subir = (lado) => {
    if (lado === ladoSeguro) {
      setAltura(a => a + 5)
      setMensagem('Subiu com segurança! 🧗')
    } else {
      setAltura(a => Math.max(a - 6, 0))
      setMensagem('Escorregou! Perdeu altura 😬')
    }

    setLadoSeguro(Math.random() > 0.5 ? 'esquerda' : 'direita')
  }

  return (
    <div className="p-4 space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-black text-slate-800">🧗 Escalada</h2>
        <p className="text-sm font-bold text-slate-600">Tempo: {tempo}s • Altura: {altura}m</p>
      </div>

      <div className="relative h-72 bg-gradient-to-b from-slate-300 to-stone-500 rounded-3xl border-4 border-white overflow-hidden shadow-inner">
        <div className="absolute left-[20%] top-0 bottom-0 w-4 bg-stone-700/60 rounded-full" />
        <div className="absolute right-[20%] top-0 bottom-0 w-4 bg-stone-700/60 rounded-full" />
        <div className="absolute left-[20%] top-8 text-3xl">🪨</div>
        <div className="absolute right-[20%] top-24 text-3xl">🪨</div>
        <div className="absolute left-[20%] top-40 text-3xl">🪨</div>
        <div className="absolute right-[20%] top-56 text-3xl">🪨</div>
        <div className="absolute left-1/2 -translate-x-1/2 text-6xl transition-all duration-300" style={{ bottom: `${clamp(altura, 0, 100) * 2}px` }}>🧗</div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => subir('esquerda')} className="bg-stone-700 hover:bg-stone-600 text-white rounded-2xl p-4 font-black text-xl shadow-lg active:scale-95 transition">⬅️ Esquerda</button>
        <button onClick={() => subir('direita')} className="bg-stone-700 hover:bg-stone-600 text-white rounded-2xl p-4 font-black text-xl shadow-lg active:scale-95 transition">Direita ➡️</button>
      </div>

      <p className="text-center font-bold text-slate-700">{mensagem}</p>
      <p className="text-center text-xs font-bold text-slate-500">Dica secreta: o lado seguro muda a cada tentativa.</p>
    </div>
  )
}

export default function App() {
  const progressoInicial = useMemo(() => carregarProgresso(), [])

  const [fome, setFome] = useState(progressoInicial.fome)
  const [energia, setEnergia] = useState(progressoInicial.energia)
  const [diversao, setDiversao] = useState(progressoInicial.diversao)
  const [limpeza, setLimpeza] = useState(progressoInicial.limpeza)
  const [score, setScore] = useState(progressoInicial.score)
  const [mensagem, setMensagem] = useState('Progresso carregado automaticamente.')
  const [animando, setAnimando] = useState(false)
  const [cosmeticoAtivo, setCosmeticoAtivo] = useState(progressoInicial.cosmeticoAtivo)
  const [cosmeticosComprados, setCosmeticosComprados] = useState(progressoInicial.cosmeticosComprados)
  const [aba, setAba] = useState('jogo')
  const [scoreFloat, setScoreFloat] = useState(null)
  const [minigameAtivo, setMinigameAtivo] = useState(null)

  const multiplicador = useMemo(() => {
    if (!cosmeticoAtivo) return 1
    return COSMETICOS.find(c => c.id === cosmeticoAtivo)?.multiplicador || 1
  }, [cosmeticoAtivo])

  useEffect(() => {
    salvarProgresso({
      fome,
      energia,
      diversao,
      limpeza,
      score,
      cosmeticoAtivo,
      cosmeticosComprados,
    })
  }, [fome, energia, diversao, limpeza, score, cosmeticoAtivo, cosmeticosComprados])

  useEffect(() => {
    if (minigameAtivo) return

    const interval = setInterval(() => {
      setFome(v => Math.max(v - 1, 0))
      setEnergia(v => Math.max(v - 1, 0))
      setDiversao(v => Math.max(v - 1, 0))
      setLimpeza(v => Math.max(v - 1, 0))
    }, 5000)

    return () => clearInterval(interval)
  }, [minigameAtivo])

  const animar = () => {
    setAnimando(true)
    setTimeout(() => setAnimando(false), 400)
  }

  const ganharScore = (base, msg) => {
    const ganho = Math.round(base * multiplicador)
    setScore(v => v + ganho)
    setScoreFloat(`+${ganho}`)
    setTimeout(() => setScoreFloat(null), 1200)
    setMensagem(msg + (multiplicador > 1 ? ` (x${multiplicador} bônus!)` : ''))
    animar()
  }

  const finalizarMinigame = (ganho, msg) => {
    setScore(v => v + ganho)
    setScoreFloat(`+${ganho}`)
    setTimeout(() => setScoreFloat(null), 1200)
    setMensagem(msg)
    setMinigameAtivo(null)
    setAba('jogo')
    setDiversao(v => clamp(v + 15))
    setEnergia(v => clamp(v - 10))
    animar()
  }

  const alimentar = () => {
    setFome(v => clamp(v + 20))
    ganharScore(10, 'Você alimentou o personagem 🍔')
  }

  const jogar = () => {
    setDiversao(v => clamp(v + 25))
    setEnergia(v => clamp(v - 10))
    ganharScore(15, 'Ele se divertiu 🎮')
  }

  const dormir = () => {
    setEnergia(v => clamp(v + 30))
    ganharScore(5, 'Hora de dormir 😴')
  }

  const limpar = () => {
    setLimpeza(v => clamp(v + 30))
    ganharScore(8, 'Banho tomado 🛁')
  }

  const comprar = (cosmetico) => {
    if (score < cosmetico.preco) {
      setMensagem('Score insuficiente! 😢')
      return
    }

    if (cosmeticosComprados.includes(cosmetico.id)) {
      setMensagem('Você já tem esse cosmético!')
      return
    }

    setScore(v => v - cosmetico.preco)
    setCosmeticosComprados(prev => [...prev, cosmetico.id])
    setCosmeticoAtivo(cosmetico.id)
    setMensagem(`${cosmetico.nome} equipado! Multiplicador x${cosmetico.multiplicador}`)
    setAba('jogo')
  }

  const equipar = (id) => {
    if (cosmeticoAtivo === id) {
      setCosmeticoAtivo(null)
      setMensagem('Cosmético removido')
      return
    }

    const c = COSMETICOS.find(c => c.id === id)
    setCosmeticoAtivo(id)
    setMensagem(`${c.nome} equipado! Multiplicador x${c.multiplicador}`)
  }

  const iniciarMinigame = (id) => {
    if (energia < 10) {
      setMensagem('Energia baixa demais para jogar minigame. Durma primeiro 😴')
      setAba('jogo')
      return
    }

    setMinigameAtivo(id)
  }

  const sairDoJogo = () => {
    salvarProgresso({
      fome,
      energia,
      diversao,
      limpeza,
      score,
      cosmeticoAtivo,
      cosmeticosComprados,
    })

    window.close()
  }

  const bars = [
    { label: 'Fome', value: fome },
    { label: 'Energia', value: energia },
    { label: 'Diversão', value: diversao },
    { label: 'Limpeza', value: limpeza },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 via-cyan-200 to-yellow-100 flex flex-col items-center justify-center p-6 font-sans overflow-hidden relative">
      <div className="bg-gradient-to-b from-yellow-200 to-orange-300 rounded-[45px] shadow-[0_15px_50px_rgba(0,0,0,0.25)] border-4 border-orange-400 w-full max-w-md overflow-hidden backdrop-blur-xl">
        <div className="bg-white/60 backdrop-blur-sm p-4 border-b border-orange-300">
          <div className="flex justify-between items-center mb-3">
            <div className="relative">
              <div className="text-3xl font-black text-orange-500 drop-shadow-md">{score.toLocaleString()}</div>
              <div className="text-xs font-bold text-slate-600">SCORE ⭐</div>
              {scoreFloat && (
                <div className="absolute -top-7 left-0 text-green-600 font-black text-xl animate-bounce pointer-events-none">
                  {scoreFloat}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={sairDoJogo}
                title="Sair do jogo"
                className="bg-red-500 hover:bg-red-400 text-white rounded-xl w-12 h-12 flex items-center justify-center shadow font-black text-xl active:scale-95 transition"
              >
                ✕
              </button>

              {multiplicador > 1 && (
                <div className="bg-yellow-400 text-black text-xs font-black rounded-full px-3 py-1 shadow">
                  x{multiplicador} 🔥
                </div>
              )}
              <div className="bg-lime-400 rounded-xl w-12 h-12 flex items-center justify-center shadow-inner text-2xl">
                {cosmeticoAtivo ? COSMETICOS.find(c => c.id === cosmeticoAtivo)?.emoji : '⚡'}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            {[
              { id: 'jogo', label: '🎮 Jogo' },
              { id: 'minigames', label: '🏆 Minigames' },
              { id: 'loja', label: '🛍️ Loja' },
              ...(cosmeticosComprados.length > 0 ? [{ id: 'armario', label: '👗 Armário' }] : []),
            ].map(t => (
              <button
                key={t.id}
                onClick={() => {
                  setMinigameAtivo(null)
                  setAba(t.id)
                }}
                className={`flex-1 py-1.5 rounded-xl text-[11px] font-black transition-all ${aba === t.id ? 'bg-orange-500 text-white shadow' : 'bg-white/50 text-slate-600 hover:bg-white/80'}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {aba === 'jogo' && !minigameAtivo && (
          <>
            <div className="relative bg-gradient-to-b from-sky-400 to-blue-500 h-[400px] flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[length:20px_20px]" />
              <Character cosmeticoAtivo={cosmeticoAtivo} animando={animando} />
            </div>

            <div className="bg-black/30 backdrop-blur-md p-5 space-y-4 border-t border-yellow-300">
              {bars.map(bar => (
                <div key={bar.label}>
                  <div className="flex justify-between text-white font-bold mb-1 text-lg">
                    <span>{bar.label}</span><span>{bar.value}%</span>
                  </div>
                  <div className="w-full h-5 bg-black/40 rounded-full overflow-hidden border border-black/30">
                    <div
                      className="h-full bg-gradient-to-r from-lime-400 to-green-500 rounded-full transition-all duration-500 shadow-[0_0_20px_rgba(168,85,247,0.8)]"
                      style={{ width: `${bar.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-black/40 backdrop-blur-md p-4 grid grid-cols-2 gap-4 text-white border-t border-violet-500/30">
              <button onClick={alimentar} className="bg-orange-500 hover:scale-105 transition-transform rounded-2xl p-3 font-bold text-xl shadow-lg">
                🍔 Alimentar<div className="text-xs opacity-70">+10⭐</div>
              </button>
              <button onClick={jogar} className="bg-blue-500 hover:scale-105 transition-transform rounded-2xl p-3 font-bold text-xl shadow-lg">
                🎮 Jogar<div className="text-xs opacity-70">+15⭐</div>
              </button>
              <button onClick={dormir} className="bg-indigo-500 hover:scale-105 transition-transform rounded-2xl p-3 font-bold text-xl shadow-lg">
                😴 Dormir<div className="text-xs opacity-70">+5⭐</div>
              </button>
              <button onClick={limpar} className="bg-cyan-500 hover:scale-105 transition-transform rounded-2xl p-3 font-bold text-xl shadow-lg">
                🛁 Limpar<div className="text-xs opacity-70">+8⭐</div>
              </button>
            </div>
          </>
        )}

        {aba === 'minigames' && !minigameAtivo && (
          <div className="p-4 space-y-4 max-h-[620px] overflow-y-auto">
            <div className="text-center">
              <h2 className="text-2xl font-black text-slate-800">Minigames</h2>
              <p className="text-xs font-bold text-slate-600">Jogue para ganhar score. Cosméticos multiplicam o prêmio.</p>
            </div>

            {MINIGAMES.map(game => (
              <button
                key={game.id}
                onClick={() => iniciarMinigame(game.id)}
                className="w-full bg-white/70 hover:bg-white border-2 border-orange-200 rounded-3xl p-4 flex items-center gap-4 text-left shadow active:scale-95 transition"
              >
                <div className="text-5xl">{game.emoji}</div>
                <div className="flex-1">
                  <div className="font-black text-slate-800 text-lg">{game.nome}</div>
                  <div className="text-xs font-bold text-slate-500">{game.descricao}</div>
                </div>
                <div className="text-xl">▶️</div>
              </button>
            ))}
          </div>
        )}

        {minigameAtivo === 'volei' && <VolleyballGame onFinish={finalizarMinigame} multiplicador={multiplicador} />}
        {minigameAtivo === 'comida' && <FallingFoodGame onFinish={finalizarMinigame} multiplicador={multiplicador} />}
        {minigameAtivo === 'escalada' && <ClimbingGame onFinish={finalizarMinigame} multiplicador={multiplicador} />}

        {aba === 'loja' && !minigameAtivo && (
          <div className="p-4 space-y-3 max-h-[520px] overflow-y-auto">
            <p className="text-slate-600 text-xs text-center font-bold">Gaste score em cosméticos que multiplicam o ganho!</p>

            {COSMETICOS.map(c => {
              const comprado = cosmeticosComprados.includes(c.id)
              const podePagar = score >= c.preco

              return (
                <div key={c.id} className={`flex items-center gap-3 rounded-2xl p-3 border-2 transition-all ${comprado ? 'bg-green-100 border-green-400' : 'bg-white/50 border-orange-200'}`}>
                  <div className="w-14 h-14 rounded-xl flex-shrink-0 border-2 border-orange-300 bg-white/70 overflow-hidden">
                    <img src={c.imagem} alt={c.nome} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-slate-800 font-black text-sm">{c.nome}</div>
                    <div className="text-slate-500 text-xs">{c.descricao}</div>
                    <div className="text-orange-500 text-xs font-black">x{c.multiplicador} score</div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <div className="text-orange-600 text-sm font-black">⭐{c.preco}</div>
                    {comprado ? (
                      <span className="text-green-600 text-xs font-black">✓ Comprado</span>
                    ) : (
                      <button
                        onClick={() => comprar(c)}
                        disabled={!podePagar}
                        className={`text-xs font-black px-3 py-1 rounded-full transition-all ${podePagar ? 'bg-orange-500 text-white hover:bg-orange-400' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                      >
                        Comprar
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {aba === 'armario' && !minigameAtivo && (
          <div className="p-4 space-y-3 max-h-[520px] overflow-y-auto">
            <p className="text-slate-600 text-xs text-center font-bold">Clique para equipar/desequipar</p>

            {cosmeticosComprados.map(id => {
              const c = COSMETICOS.find(c => c.id === id)
              const ativo = cosmeticoAtivo === id

              return (
                <button
                  key={id}
                  onClick={() => equipar(id)}
                  className={`w-full flex items-center gap-3 rounded-2xl p-3 border-2 transition-all ${ativo ? 'bg-yellow-100 border-yellow-400' : 'bg-white/50 border-orange-200 hover:bg-orange-50'}`}
                >
                  <div className="w-14 h-14 rounded-xl flex-shrink-0 border-2 border-orange-300 bg-white/70 overflow-hidden">
                    <img src={c.imagem} alt={c.nome} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-slate-800 font-black text-sm">{c.nome}</div>
                    <div className="text-orange-500 text-xs font-black">x{c.multiplicador} score</div>
                  </div>
                  {ativo && <span className="text-yellow-600 font-black text-sm">✓ Ativo</span>}
                </button>
              )
            })}
          </div>
        )}
      </div>

      <div className="mt-5 bg-white/80 backdrop-blur-md rounded-2xl px-6 py-4 shadow-xl text-center max-w-md w-full">
        <h2 className="font-black text-xl text-slate-800 mb-1">Status</h2>
        <p className="text-slate-700 font-semibold">{mensagem}</p>
      </div>
    </div>
  )
}
