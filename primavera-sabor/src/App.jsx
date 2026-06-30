import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Bell,
  Camera,
  Check,
  ChevronRight,
  Clock3,
  CreditCard,
  LogOut,
  MapPin,
  MessageCircle,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  Trash2,
  Utensils,
  X,
} from 'lucide-react'
import heroImage from './assets/menu-hero.png'
import './App.css'

const WHATSAPP_NUMBER = '5599984360319'
const SERVICE_REQUESTS_KEY = 'primavera-sabor-service-requests'
const ADMIN_SESSION_KEY = 'primavera-sabor-admin-session'
const ADMIN_SOUND_KEY = 'primavera-sabor-admin-sound'

const EVENT_TYPES = {
  WAITER_CALL: 'WAITER_CALL',
  ORDER_CREATED: 'ORDER_CREATED',
  PAYMENT_REQUESTED: 'PAYMENT_REQUESTED',
}

const EVENT_TYPE_META = {
  [EVENT_TYPES.WAITER_CALL]: {
    label: 'Chamada de garçom',
    tone: 'service',
  },
  [EVENT_TYPES.ORDER_CREATED]: {
    label: 'Pedido da mesa',
    tone: 'order',
  },
  [EVENT_TYPES.PAYMENT_REQUESTED]: {
    label: 'Conta solicitada',
    tone: 'payment',
  },
}

const STATUS_LABELS = {
  pending: 'Pendente',
  in_progress: 'Em atendimento',
  done: 'Concluído',
}

const PAYMENT_TIMING = {
  AFTER: 'after',
  BEFORE: 'before',
}

const PAYMENT_TIMING_META = {
  [PAYMENT_TIMING.AFTER]: {
    label: 'Pagar depois',
    description: 'Na conta da mesa',
  },
  [PAYMENT_TIMING.BEFORE]: {
    label: 'Pagar antes',
    description: 'Acertar este pedido agora',
  },
}

const demoEmployees = [
  {
    username: 'garcom',
    pin: '1234',
    name: 'Garçom Demo',
    role: 'Atendimento',
  },
  {
    username: 'gerente',
    pin: '4321',
    name: 'Gerente Demo',
    role: 'Gerência',
  },
]

const store = {
  name: 'Primavera Sabor Codó',
  tagline: 'Pizzas, esfirras e espetinhos',
  hours: 'Segunda a sábado, 18:00 às 23:00',
  dineInNotice: 'Cardápio digital da mesa. Monte seu resumo e chame o garçom.',
  deliveryNotice: 'Pedidos para delivery pelo WhatsApp.',
  address: 'Rua Nazeu Quadros, 06',
  phone: '(99) 98436-0319',
  instagram:
    'https://www.instagram.com/primaverasabor?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
}

const menu = [
  {
    id: 'entradas',
    name: 'Entradas',
    description: 'Porções e petiscos',
    color: '#d2762f',
    products: [
      {
        id: 'batata-frita',
        name: 'Batata frita',
        description: 'Porção com molho rosé e sal a gosto.',
        price: null,
        position: '58% 54%',
      },
      {
        id: 'macaxeira-frita',
        name: 'Macaxeira frita',
        description: 'Porção com molho rosé e sal a gosto.',
        price: null,
        position: '48% 55%',
      },
      {
        id: 'torresmo',
        name: 'Torresmo',
        description: 'Acompanha farofa e vinagrete.',
        price: null,
        position: '64% 52%',
      },
      {
        id: 'camarao-alho-oleo',
        name: 'Camarão alho e óleo',
        description: 'Acompanha farofa e vinagrete.',
        price: null,
        position: '70% 52%',
      },
      {
        id: 'queijo-assado',
        name: 'Queijo assado',
        description: 'Queijo coalho, melaço e ervas finas.',
        price: null,
        position: '56% 45%',
      },
      {
        id: 'queijo-cubos',
        name: 'Queijo em cubos',
        description: 'Queijo coalho 140g, azeitona e ervas finas.',
        price: null,
        position: '54% 46%',
      },
      {
        id: 'pao-alho',
        name: 'Pão de alho',
        description: 'Recheado com creme de alho especial Primavera.',
        price: null,
        position: '62% 46%',
      },
      {
        id: 'coracao-galinha',
        name: 'Coração de galinha',
        description: 'Acompanha farofa e vinagrete.',
        price: null,
        position: '72% 56%',
      },
      {
        id: 'frango-dourado',
        name: 'Frango dourado',
        description: 'Acompanha farofa, vinagrete e macaxeira.',
        price: null,
        position: '74% 50%',
      },
      {
        id: 'entrada-espeto',
        name: 'Espeto',
        description: 'Espeto com farofa e vinagrete.',
        price: null,
        position: '80% 56%',
      },
      {
        id: 'picanha',
        name: 'Picanha',
        description: 'Picanha com farofa e vinagrete.',
        price: null,
        position: '82% 56%',
      },
    ],
  },
  {
    id: 'pizzas',
    name: 'Pizzas',
    description: 'P, M, G e GG',
    color: '#f0a33a',
    products: [
      {
        id: 'pizza-carne-seca',
        name: 'Carne seca',
        description: 'Pizza disponível nos tamanhos P, M, G e GG.',
        price: null,
        position: '47% 44%',
      },
      {
        id: 'pizza-carne-seca-catupiry',
        name: 'Carne seca com catupiry',
        description: 'Pizza disponível nos tamanhos P, M, G e GG.',
        price: null,
        position: '47% 44%',
      },
      {
        id: 'pizza-carne-seca-cheddar',
        name: 'Carne seca com cheddar',
        description: 'Pizza disponível nos tamanhos P, M, G e GG.',
        price: null,
        position: '47% 44%',
      },
      {
        id: 'pizza-frango',
        name: 'Frango',
        description: 'Pizza disponível nos tamanhos P, M, G e GG.',
        price: null,
        position: '50% 44%',
      },
      {
        id: 'pizza-frango-catupiry',
        name: 'Frango com catupiry',
        description: 'Pizza disponível nos tamanhos P, M, G e GG.',
        price: null,
        position: '50% 44%',
      },
      {
        id: 'pizza-frango-cheddar',
        name: 'Frango com cheddar',
        description: 'Pizza disponível nos tamanhos P, M, G e GG.',
        price: null,
        position: '50% 44%',
      },
      {
        id: 'pizza-calabresa',
        name: 'Calabresa',
        description: 'Pizza disponível nos tamanhos P, M, G e GG.',
        price: null,
        position: '52% 45%',
      },
      {
        id: 'pizza-mussarela',
        name: 'Mussarela',
        description: 'Pizza disponível nos tamanhos P, M, G e GG.',
        price: null,
        position: '52% 45%',
      },
      {
        id: 'pizza-a-moda',
        name: 'À moda',
        description: 'Frango com catupiry e cheddar.',
        price: null,
        position: '54% 44%',
      },
      {
        id: 'pizza-mista',
        name: 'Mista',
        description: 'Pizza disponível nos tamanhos P, M, G e GG.',
        price: null,
        position: '54% 44%',
      },
      {
        id: 'pizza-peperone',
        name: 'Peperone',
        description: 'Pizza disponível nos tamanhos P, M, G e GG.',
        price: null,
        position: '55% 44%',
      },
      {
        id: 'pizza-bacon',
        name: 'Bacon',
        description: 'Pizza disponível nos tamanhos P, M, G e GG.',
        price: null,
        position: '55% 44%',
      },
      {
        id: 'pizza-tres-queijos',
        name: '3 queijos',
        description: 'Mussarela, catupiry e cheddar.',
        price: null,
        position: '56% 44%',
      },
      {
        id: 'pizza-mexicana',
        name: 'Mexicana',
        description: 'Mussarela, calabresa e pimenta calabresa.',
        price: null,
        position: '56% 44%',
      },
      {
        id: 'pizza-caipira',
        name: 'Caipira',
        description: 'Mussarela, frango e milho.',
        price: null,
        position: '57% 44%',
      },
      {
        id: 'pizza-romeu-julieta',
        name: 'Romeu e Julieta',
        description: 'Mussarela, goiabada e leite condensado.',
        price: null,
        position: '58% 44%',
      },
      {
        id: 'pizza-banana-canela',
        name: 'Banana com canela',
        description: 'Pizza doce disponível nos tamanhos P, M, G e GG.',
        price: null,
        position: '58% 44%',
      },
    ],
  },
  {
    id: 'esfirras',
    name: 'Esfirras',
    description: 'Combo 8 unidades',
    color: '#b95a32',
    products: [
      {
        id: 'esfirra-mussarela',
        name: 'Mussarela',
        description: 'Esfirra aberta. Peça unidade ou combo com 8.',
        price: null,
        position: '38% 52%',
      },
      {
        id: 'esfirra-calabresa',
        name: 'Calabresa',
        description: 'Esfirra aberta. Peça unidade ou combo com 8.',
        price: null,
        position: '38% 52%',
      },
      {
        id: 'esfirra-frango',
        name: 'Frango',
        description: 'Esfirra aberta. Peça unidade ou combo com 8.',
        price: null,
        position: '40% 52%',
      },
      {
        id: 'esfirra-carne-seca',
        name: 'Carne seca',
        description: 'Esfirra aberta. Peça unidade ou combo com 8.',
        price: null,
        position: '42% 52%',
      },
      {
        id: 'esfirra-carne-moida',
        name: 'Carne moída',
        description: 'Esfirra aberta. Peça unidade ou combo com 8.',
        price: null,
        position: '42% 52%',
      },
      {
        id: 'esfirra-tres-queijos',
        name: '3 queijos',
        description: 'Esfirra aberta. Peça unidade ou combo com 8.',
        price: null,
        position: '44% 52%',
      },
      {
        id: 'esfirra-romeu-julieta',
        name: 'Romeu e Julieta',
        description: 'Esfirra aberta doce.',
        price: null,
        position: '44% 52%',
      },
      {
        id: 'esfirra-nutella-mms',
        name: 'Nutella com M&Ms',
        description: 'Esfirra aberta doce.',
        price: null,
        position: '45% 52%',
      },
      {
        id: 'esfirra-banana-canela',
        name: 'Banana com canela',
        description: 'Esfirra aberta doce.',
        price: null,
        position: '46% 52%',
      },
      {
        id: 'esfirra-leite-condensado',
        name: 'Leite condensado',
        description: 'Esfirra aberta doce.',
        price: null,
        position: '46% 52%',
      },
      {
        id: 'combo-esfirras',
        name: 'Combo de esfirras',
        description: 'Combo com 8 unidades. Adicionais: cheddar ou catupiry.',
        price: null,
        position: '42% 54%',
      },
    ],
  },
  {
    id: 'acompanhamentos',
    name: 'Acompanhamentos',
    description: 'Para pratos e espetos',
    color: '#6f8f42',
    products: [
      {
        id: 'arroz-cuxa',
        name: 'Arroz de cuxá',
        description: 'Acompanhamento tradicional da casa.',
        price: null,
        position: '68% 58%',
      },
      {
        id: 'arroz-calabresa-milho',
        name: 'Arroz de calabresa com milho',
        description: 'Acompanhamento servido conforme disponibilidade.',
        price: null,
        position: '68% 58%',
      },
      {
        id: 'arroz-branco',
        name: 'Arroz branco',
        description: 'Acompanhamento simples.',
        price: null,
        position: '68% 58%',
      },
      {
        id: 'feijao-carioca',
        name: 'Feijão carioca',
        description: 'Acompanhamento simples.',
        price: null,
        position: '68% 58%',
      },
      {
        id: 'creme-galinha',
        name: 'Creme de galinha',
        description: 'Acompanhamento cremoso da casa.',
        price: null,
        position: '68% 58%',
      },
      {
        id: 'macarrao',
        name: 'Macarrão',
        description: 'Acompanhamento servido conforme disponibilidade.',
        price: null,
        position: '68% 58%',
      },
      {
        id: 'macaxeira',
        name: 'Macaxeira',
        description: 'Acompanhamento servido conforme disponibilidade.',
        price: null,
        position: '68% 58%',
      },
      {
        id: 'farofa',
        name: 'Farofa',
        description: 'Acompanhamento para espetos e porções.',
        price: null,
        position: '68% 58%',
      },
      {
        id: 'vinagrete',
        name: 'Vinagrete',
        description: 'Acompanhamento para espetos e porções.',
        price: null,
        position: '68% 58%',
      },
      {
        id: 'salada-mista',
        name: 'Salada mista',
        description: 'Acompanhamento leve.',
        price: null,
        position: '68% 58%',
      },
    ],
  },
  {
    id: 'espetos',
    name: 'Espetos',
    description: 'Na brasa',
    color: '#c08b5a',
    products: [
      {
        id: 'espeto-boi',
        name: 'Boi',
        description: 'Espeto servido com acompanhamentos da casa.',
        price: null,
        position: '76% 56%',
      },
      {
        id: 'espeto-frango',
        name: 'Frango',
        description: 'Espeto servido com acompanhamentos da casa.',
        price: null,
        position: '76% 56%',
      },
      {
        id: 'espeto-porco',
        name: 'Porco',
        description: 'Espeto servido com acompanhamentos da casa.',
        price: null,
        position: '76% 56%',
      },
      {
        id: 'espeto-toscana',
        name: 'Toscana',
        description: 'Espeto servido com acompanhamentos da casa.',
        price: null,
        position: '76% 56%',
      },
      {
        id: 'espeto-picanha',
        name: 'Picanha',
        description: 'Espeto servido com acompanhamentos da casa.',
        price: null,
        position: '76% 56%',
      },
    ],
  },
  {
    id: 'especiais',
    name: 'Especiais',
    description: 'Extras da casa',
    color: '#e3c06f',
    products: [
      {
        id: 'arroz-cremoso-carne-seca',
        name: 'Arroz cremoso de carne seca',
        description: 'Especial Primavera Sabor.',
        price: null,
        position: '68% 58%',
      },
    ],
  },
]

const allProducts = menu.flatMap((category) =>
  category.products.map((product) => ({
    ...product,
    categoryId: category.id,
    categoryName: category.name,
    categoryColor: category.color,
  })),
)

const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

function getInitialTable() {
  if (typeof window === 'undefined') return ''

  return new URLSearchParams(window.location.search).get('mesa') ?? ''
}

function hasTableParam() {
  if (typeof window === 'undefined') return false

  return new URLSearchParams(window.location.search).has('mesa')
}

function formatTable(value) {
  const cleanValue = value.trim()

  if (!cleanValue) return ''
  if (/^\d+$/.test(cleanValue)) return cleanValue.padStart(2, '0')

  return cleanValue
}

function formatProductPrice(product) {
  return product.price == null ? 'Consultar valor' : currency.format(product.price)
}

function formatLineTotal(item) {
  return item.price == null ? 'valor a confirmar' : currency.format(item.price * item.quantity)
}

function getEventTypeMeta(type) {
  return EVENT_TYPE_META[type] ?? EVENT_TYPE_META[EVENT_TYPES.WAITER_CALL]
}

function getPaymentTimingMeta(value) {
  return PAYMENT_TIMING_META[value] ?? PAYMENT_TIMING_META[PAYMENT_TIMING.AFTER]
}

function getRequestPaymentLabel(request) {
  if (request.type === EVENT_TYPES.PAYMENT_REQUESTED) return 'Fechar conta agora'
  if (request.type !== EVENT_TYPES.ORDER_CREATED) return ''

  return `${getPaymentTimingMeta(request.paymentTiming).label} - ${request.total || 'A confirmar'}`
}

function getRequestStartLabel(type) {
  if (type === EVENT_TYPES.PAYMENT_REQUESTED) return 'Atender conta'
  if (type === EVENT_TYPES.ORDER_CREATED) return 'Atender pedido'

  return 'Atender chamado'
}

function getRequestCompletionLabel(type) {
  if (type === EVENT_TYPES.PAYMENT_REQUESTED) return 'Fechar conta'
  if (type === EVENT_TYPES.ORDER_CREATED) return 'Fechar pedido'

  return 'Concluir chamado'
}

function getRequestEmptyNote(type) {
  if (type === EVENT_TYPES.PAYMENT_REQUESTED) return 'A mesa pediu fechamento da conta.'
  if (type === EVENT_TYPES.ORDER_CREATED) return 'Pedido sem itens informados.'

  return 'A mesa pediu apenas atendimento.'
}

function buildEventMessage(type, table, itemCount) {
  const tableLabel = table || 'não informada'

  if (type === EVENT_TYPES.ORDER_CREATED) {
    return `Mesa ${tableLabel} enviou ${itemCount} ${itemCount === 1 ? 'item' : 'itens'} para atendimento`
  }

  if (type === EVENT_TYPES.PAYMENT_REQUESTED) {
    return `Mesa ${tableLabel} pediu fechamento da conta`
  }

  return `Mesa ${tableLabel} chamou o garçom`
}

function buildWhatsAppUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

function readSoundPreference() {
  if (typeof window === 'undefined') return true

  const savedPreference = window.localStorage.getItem(ADMIN_SOUND_KEY)
  return savedPreference === null ? true : savedPreference === 'true'
}

function writeSoundPreference(enabled) {
  if (typeof window === 'undefined') return

  window.localStorage.setItem(ADMIN_SOUND_KEY, String(enabled))
}

function playAdminAlert() {
  if (typeof window === 'undefined') return

  const AudioContext = window.AudioContext || window.webkitAudioContext
  if (!AudioContext) return

  const context = new AudioContext()
  const now = context.currentTime
  const oscillator = context.createOscillator()
  const gain = context.createGain()

  oscillator.type = 'sine'
  oscillator.frequency.setValueAtTime(880, now)
  oscillator.frequency.exponentialRampToValueAtTime(1180, now + 0.28)
  gain.gain.setValueAtTime(0.0001, now)
  gain.gain.exponentialRampToValueAtTime(0.18, now + 0.03)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42)

  oscillator.connect(gain)
  gain.connect(context.destination)
  void context.resume?.()
  oscillator.start(now)
  oscillator.stop(now + 0.44)
  window.setTimeout(() => void context.close(), 560)
}

function readServiceRequests() {
  if (typeof window === 'undefined') return []

  try {
    const savedRequests = window.localStorage.getItem(SERVICE_REQUESTS_KEY)
    const parsedRequests = savedRequests ? JSON.parse(savedRequests) : []

    if (!Array.isArray(parsedRequests)) return []

    return parsedRequests.map((request) => {
      const savedItems = Array.isArray(request.items) ? request.items : []
      const savedItemCount =
        typeof request.itemCount === 'number'
          ? request.itemCount
          : savedItems.reduce((sum, item) => sum + (item.quantity || 0), 0)
      const table = request.table || 'não informada'
      const type = Object.values(EVENT_TYPES).includes(request.type)
        ? request.type
        : savedItemCount > 0
          ? EVENT_TYPES.ORDER_CREATED
          : EVENT_TYPES.WAITER_CALL
      const items = type === EVENT_TYPES.ORDER_CREATED ? savedItems : []
      const itemCount = type === EVENT_TYPES.ORDER_CREATED ? savedItemCount : 0
      const paymentTiming = Object.values(PAYMENT_TIMING).includes(request.paymentTiming)
        ? request.paymentTiming
        : PAYMENT_TIMING.AFTER

      return {
        id: request.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        type,
        table,
        message: request.message || buildEventMessage(type, table, itemCount),
        status: ['pending', 'in_progress', 'done'].includes(request.status)
          ? request.status
          : 'pending',
        createdAt: request.createdAt || new Date().toISOString(),
        updatedAt: request.updatedAt || null,
        note: request.note || '',
        itemCount,
        total: type === EVENT_TYPES.ORDER_CREATED ? request.total || 'A confirmar' : 'A confirmar',
        paymentTiming,
        items,
      }
    })
  } catch {
    return []
  }
}

function writeServiceRequests(requests) {
  if (typeof window === 'undefined') return

  window.localStorage.setItem(SERVICE_REQUESTS_KEY, JSON.stringify(requests))
  window.dispatchEvent(new Event('service-requests-updated'))
}

function formatRequestTime(value) {
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(value))
}

function isAdminRoute() {
  if (typeof window === 'undefined') return false

  return window.location.pathname === '/admin'
}

function readAdminSession() {
  if (typeof window === 'undefined') return null

  try {
    const savedSession = window.localStorage.getItem(ADMIN_SESSION_KEY)
    return savedSession ? JSON.parse(savedSession) : null
  } catch {
    return null
  }
}

function writeAdminSession(employee) {
  if (typeof window === 'undefined') return

  window.localStorage.setItem(
    ADMIN_SESSION_KEY,
    JSON.stringify({
      name: employee.name,
      role: employee.role,
      username: employee.username,
      loggedAt: new Date().toISOString(),
    }),
  )
}

function clearAdminSession() {
  if (typeof window === 'undefined') return

  window.localStorage.removeItem(ADMIN_SESSION_KEY)
}

function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState('')
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    const employee = demoEmployees.find(
      (demoEmployee) =>
        demoEmployee.username === username.trim().toLowerCase() && demoEmployee.pin === pin.trim(),
    )

    if (!employee) {
      setError('Funcionário ou PIN inválido.')
      return
    }

    writeAdminSession(employee)
    setError('')
    onLogin(readAdminSession())
  }

  return (
    <div className="admin-login-shell">
      <main className="admin-login-card">
        <a className="brand" href="/" aria-label="Voltar ao cardápio">
          <span className="brand-mark">
            <Utensils size={18} aria-hidden="true" />
          </span>
          <span>
            <strong>Primavera Sabor</strong>
            <small>Área do funcionário</small>
          </span>
        </a>

        <div className="admin-login-heading">
          <span className="eyebrow">Admin</span>
          <h1>Entrar no painel</h1>
          <p>Acesso para acompanhar chamadas das mesas e organizar o atendimento.</p>
        </div>

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <label>
            <span>Funcionário</span>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Ex: garcom"
              autoComplete="username"
            />
          </label>

          <label>
            <span>PIN</span>
            <input
              value={pin}
              onChange={(event) => setPin(event.target.value)}
              placeholder="0000"
              inputMode="numeric"
              type="password"
              autoComplete="current-password"
            />
          </label>

          {error ? (
            <p className="admin-login-error" aria-live="polite">
              {error}
            </p>
          ) : null}

          <button className="checkout-button" type="submit">
            Entrar
          </button>
        </form>
      </main>
    </div>
  )
}

function AdminPanel({ employee, onLogout }) {
  const [requests, setRequests] = useState(readServiceRequests)
  const [filter, setFilter] = useState('open')
  const [typeFilter, setTypeFilter] = useState('all')
  const [soundEnabled, setSoundEnabled] = useState(readSoundPreference)
  const knownRequestIdsRef = useRef(new Set(requests.map((request) => request.id)))

  useEffect(() => {
    const syncRequests = () => {
      const nextRequests = readServiceRequests()
      const hasNewPendingRequest = nextRequests.some(
        (request) => request.status === 'pending' && !knownRequestIdsRef.current.has(request.id),
      )

      knownRequestIdsRef.current = new Set(nextRequests.map((request) => request.id))
      setRequests(nextRequests)

      if (soundEnabled && hasNewPendingRequest) {
        playAdminAlert()
      }
    }

    window.addEventListener('storage', syncRequests)
    window.addEventListener('service-requests-updated', syncRequests)
    const intervalId = window.setInterval(syncRequests, 3000)

    return () => {
      window.removeEventListener('storage', syncRequests)
      window.removeEventListener('service-requests-updated', syncRequests)
      window.clearInterval(intervalId)
    }
  }, [soundEnabled])

  const toggleSound = () => {
    setSoundEnabled((currentValue) => {
      const nextValue = !currentValue
      writeSoundPreference(nextValue)

      if (nextValue) {
        playAdminAlert()
      }

      return nextValue
    })
  }

  const updateRequestStatus = (requestId, status) => {
    const nextRequests = readServiceRequests().map((request) =>
      request.id === requestId ? { ...request, status, updatedAt: new Date().toISOString() } : request,
    )

    writeServiceRequests(nextRequests)
    setRequests(nextRequests)
  }

  const removeRequest = (requestId) => {
    const nextRequests = readServiceRequests().filter((request) => request.id !== requestId)
    writeServiceRequests(nextRequests)
    setRequests(nextRequests)
  }

  const clearCompleted = () => {
    const nextRequests = readServiceRequests().filter((request) => request.status !== 'done')
    writeServiceRequests(nextRequests)
    setRequests(nextRequests)
  }

  const pendingCount = requests.filter((request) => request.status === 'pending').length
  const progressCount = requests.filter((request) => request.status === 'in_progress').length
  const doneCount = requests.filter((request) => request.status === 'done').length
  const orderCount = requests.filter((request) => request.type === EVENT_TYPES.ORDER_CREATED).length
  const paymentCount = requests.filter((request) => request.type === EVENT_TYPES.PAYMENT_REQUESTED).length

  const filteredRequests = requests.filter((request) => {
    const matchesStatus =
      filter === 'all' || (filter === 'open' ? request.status !== 'done' : request.status === filter)
    const matchesType =
      typeFilter === 'all' ||
      (typeFilter === 'orders' && request.type === EVENT_TYPES.ORDER_CREATED) ||
      (typeFilter === 'payments' && request.type === EVENT_TYPES.PAYMENT_REQUESTED) ||
      (typeFilter === 'service' && request.type === EVENT_TYPES.WAITER_CALL)

    return matchesStatus && matchesType
  })

  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <a className="brand" href="/" aria-label="Voltar ao cardápio">
          <span className="brand-mark">
            <Utensils size={18} aria-hidden="true" />
          </span>
          <span>
            <strong>Admin Primavera</strong>
            <small>Chamadas de mesa</small>
          </span>
        </a>

        <div className="admin-user-actions">
          <button
            className={`action-button subtle sound-toggle ${soundEnabled ? 'active' : ''}`}
            type="button"
            onClick={toggleSound}
            aria-pressed={soundEnabled}
          >
            <Bell size={18} aria-hidden="true" />
            {soundEnabled ? 'Som ligado' : 'Som mudo'}
          </button>
          <div className="admin-user">
            <span>{employee?.role || 'Funcionário'}</span>
            <strong>{employee?.name || 'Equipe'}</strong>
          </div>
          <a className="action-button subtle" href="/?mesa=04">
            <MapPin size={18} aria-hidden="true" />
            Ver mesa 04
          </a>
          <button className="action-button subtle" type="button" onClick={onLogout}>
            <LogOut size={18} aria-hidden="true" />
            Sair
          </button>
        </div>
      </header>

      <main className="admin-main">
        <section className="admin-hero">
          <div>
            <span className="eyebrow">Painel interno</span>
            <h1>Atendimento das mesas</h1>
            <p>Fila das chamadas, pedidos de mesa e solicitações de conta para a equipe resolver sem perder ritmo.</p>
          </div>
          <button
            className="action-button subtle"
            type="button"
            onClick={clearCompleted}
            aria-label="Limpar concluídos"
            title="Limpar concluídos"
          >
            <Trash2 size={18} aria-hidden="true" />
            Limpar concluídos
          </button>
        </section>

        <section className="admin-stats" aria-label="Resumo do atendimento">
          <div>
            <span>Pendentes</span>
            <strong>{pendingCount}</strong>
          </div>
          <div>
            <span>Em atendimento</span>
            <strong>{progressCount}</strong>
          </div>
          <div>
            <span>Pedidos</span>
            <strong>{orderCount}</strong>
          </div>
          <div>
            <span>Contas</span>
            <strong>{paymentCount}</strong>
          </div>
          <div>
            <span>Concluídos</span>
            <strong>{doneCount}</strong>
          </div>
        </section>

        <section className="admin-filter-groups" aria-label="Filtros do painel">
          <div className="admin-filter-group">
            <span className="admin-filter-label">Tipo</span>
            <div className="admin-filters" aria-label="Tipo de solicitação">
              {[
                ['all', 'Todos'],
                ['orders', 'Pedidos'],
                ['payments', 'Contas'],
                ['service', 'Chamados'],
              ].map(([value, label]) => (
                <button
                  className={typeFilter === value ? 'active' : ''}
                  type="button"
                  key={value}
                  onClick={() => setTypeFilter(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="admin-filter-group">
            <span className="admin-filter-label">Andamento</span>
            <div className="admin-filters" aria-label="Status da solicitação">
              {[
                ['open', 'Abertos'],
                ['pending', 'Pendentes'],
                ['in_progress', 'Em atendimento'],
                ['done', 'Concluídos'],
                ['all', 'Todos'],
              ].map(([value, label]) => (
                <button
                  className={filter === value ? 'active' : ''}
                  type="button"
                  key={value}
                  onClick={() => setFilter(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="admin-list" aria-label="Solicitações">
          {filteredRequests.length ? (
            filteredRequests.map((request) => {
              const eventMeta = getEventTypeMeta(request.type)
              const paymentLabel = getRequestPaymentLabel(request)

              return (
                <article className={`admin-card ${eventMeta.tone} ${request.status}`} key={request.id}>
                  <div className="admin-card-head">
                    <div>
                      <span className="admin-table">Mesa {request.table}</span>
                      <span className={`event-type ${eventMeta.tone}`}>{eventMeta.label}</span>
                      <strong>{request.message}</strong>
                    </div>
                    <span className="admin-status">{STATUS_LABELS[request.status]}</span>
                  </div>

                  <div className="admin-meta-row">
                    <span>
                      <Clock3 size={16} aria-hidden="true" />
                      {formatRequestTime(request.createdAt)}
                    </span>
                    {request.type === EVENT_TYPES.ORDER_CREATED ? (
                      <span>
                        <ShoppingBag size={16} aria-hidden="true" />
                        {request.itemCount} {request.itemCount === 1 ? 'item' : 'itens'}
                      </span>
                    ) : null}
                    {paymentLabel ? (
                      <span>
                        <CreditCard size={16} aria-hidden="true" />
                        {paymentLabel}
                      </span>
                    ) : null}
                  </div>

                  {request.type === EVENT_TYPES.ORDER_CREATED && request.items.length ? (
                    <div className="admin-items">
                      {request.items.map((item) => (
                        <div key={`${request.id}-${item.id}`}>
                          <span>
                            {item.quantity}x {item.name}
                          </span>
                          <small>{item.lineTotal}</small>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="admin-empty-note">{getRequestEmptyNote(request.type)}</p>
                  )}

                  <div className="admin-note">
                    <span>Observação</span>
                    <p>{request.note || 'Sem observação.'}</p>
                  </div>

                  <div className="admin-card-actions">
                    {request.status === 'pending' ? (
                      <button
                        className="start-action"
                        type="button"
                        onClick={() => updateRequestStatus(request.id, 'in_progress')}
                      >
                        <Bell size={16} aria-hidden="true" />
                        {getRequestStartLabel(request.type)}
                      </button>
                    ) : null}
                    {request.status === 'pending' ? (
                      <span className="admin-action-hint">Fechamento liberado após atendimento.</span>
                    ) : null}
                    {request.status === 'in_progress' ? (
                      <button
                        className="complete-action"
                        type="button"
                        onClick={() => updateRequestStatus(request.id, 'done')}
                      >
                        <Check size={16} aria-hidden="true" />
                        {getRequestCompletionLabel(request.type)}
                      </button>
                    ) : null}
                    <button className="danger" type="button" onClick={() => removeRequest(request.id)}>
                      <Trash2 size={16} aria-hidden="true" />
                      Remover
                    </button>
                  </div>
                </article>
              )
            })
          ) : (
            <div className="admin-empty">
              <Bell size={28} aria-hidden="true" />
              <strong>Nenhuma chamada nesse filtro</strong>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

function CustomerMenu() {
  const isDineIn = hasTableParam()
  const [activeCategory, setActiveCategory] = useState(menu[0].id)
  const [searchTerm, setSearchTerm] = useState('')
  const [cart, setCart] = useState([])
  const [table, setTable] = useState(getInitialTable)
  const [note, setNote] = useState('')
  const [paymentTiming, setPaymentTiming] = useState(PAYMENT_TIMING.AFTER)
  const [waiterRequested, setWaiterRequested] = useState(false)
  const [lastWaiterRequest, setLastWaiterRequest] = useState(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [recentlyAddedId, setRecentlyAddedId] = useState('')
  const [addNotice, setAddNotice] = useState('')

  const now = new Date()
  const day = now.getDay()
  const isOperatingDay = day >= 1 && day <= 6
  const isOpen = isOperatingDay && now.getHours() >= 18 && now.getHours() < 23
  const formattedTable = formatTable(table)
  const activeCategoryData = menu.find((category) => category.id === activeCategory) ?? menu[0]

  const visibleProducts = useMemo(() => {
    const query = searchTerm.trim().toLocaleLowerCase('pt-BR')
    const selectedProducts = query
      ? allProducts
      : allProducts.filter((product) => product.categoryId === activeCategory)

    if (!query) return selectedProducts

    return selectedProducts.filter((product) =>
      `${product.name} ${product.description} ${product.categoryName}`
        .toLocaleLowerCase('pt-BR')
        .includes(query),
    )
  }, [activeCategory, searchTerm])

  const cartTotal = cart.reduce(
    (sum, item) => sum + (item.price == null ? 0 : item.price * item.quantity),
    0,
  )
  const hasPricedItems = cart.some((item) => item.price != null)
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  useEffect(() => {
    if (!recentlyAddedId && !addNotice) return undefined

    const timeoutId = window.setTimeout(() => {
      setRecentlyAddedId('')
      setAddNotice('')
    }, 1400)

    return () => window.clearTimeout(timeoutId)
  }, [addNotice, recentlyAddedId])

  const addToCart = (product) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.id === product.id)

      if (existingItem) {
        return currentCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }

      return [...currentCart, { ...product, quantity: 1 }]
    })
    setRecentlyAddedId(product.id)
    setAddNotice(`${product.name} entrou ${isDineIn ? 'no resumo' : 'no carrinho'}.`)
    setCartOpen(true)
  }

  const updateQuantity = (productId, nextQuantity) => {
    setCart((currentCart) => {
      if (nextQuantity <= 0) {
        return currentCart.filter((item) => item.id !== productId)
      }

      return currentCart.map((item) =>
        item.id === productId ? { ...item, quantity: nextQuantity } : item,
      )
    })
  }

  const orderMessage = useMemo(() => {
    const serviceLabel = isDineIn ? `mesa ${formattedTable || 'não informada'}` : 'delivery'
    const items = cart
      .map((item) => `${item.quantity}x ${item.name} - ${formatLineTotal(item)}`)
      .join('\n')
    const noteText = note.trim() || 'Sem observação.'
    const totalText = hasPricedItems ? currency.format(cartTotal) : 'A confirmar'

    return `Olá! Pedido ${serviceLabel} - Primavera Sabor:\n\n${items}\n\nTotal: ${totalText}\n\nObservação:\n${noteText}`
  }, [cart, cartTotal, formattedTable, hasPricedItems, isDineIn, note])

  const pushServiceEvent = (request) => {
    writeServiceRequests([request, ...readServiceRequests()])
    setWaiterRequested(true)
    setLastWaiterRequest(request)
    setAddNotice(`Solicitação enviada para a mesa ${request.table}.`)
  }

  const createServiceEvent = (type) => {
    const nowIso = new Date().toISOString()
    const tableLabel = formattedTable || 'não informada'
    const items =
      type === EVENT_TYPES.ORDER_CREATED
        ? cart.map((item) => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            categoryName: item.categoryName,
            lineTotal: formatLineTotal(item),
          }))
        : []
    const eventItemCount = items.reduce((sum, item) => sum + item.quantity, 0)

    return {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      type,
      table: tableLabel,
      message: buildEventMessage(type, tableLabel, eventItemCount),
      status: 'pending',
      createdAt: nowIso,
      updatedAt: null,
      note: note.trim(),
      itemCount: eventItemCount,
      total:
        type === EVENT_TYPES.ORDER_CREATED && hasPricedItems
          ? currency.format(cartTotal)
          : 'A confirmar',
      paymentTiming: type === EVENT_TYPES.ORDER_CREATED ? paymentTiming : PAYMENT_TIMING.AFTER,
      items,
    }
  }

  const handleWaiterCall = () => {
    pushServiceEvent(createServiceEvent(cart.length ? EVENT_TYPES.ORDER_CREATED : EVENT_TYPES.WAITER_CALL))
  }

  const handlePaymentRequest = () => {
    pushServiceEvent(createServiceEvent(EVENT_TYPES.PAYMENT_REQUESTED))
  }

  const scrollToMenu = () => {
    document.getElementById('cardapio')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Primavera Sabor Codó">
          <span className="brand-mark">
            <Utensils size={18} aria-hidden="true" />
          </span>
          <span>
            <strong>{store.name}</strong>
            <small>{store.tagline}</small>
          </span>
        </a>

        <nav className="top-actions" aria-label="Ações rápidas">
          <a
            className="icon-button"
            href={store.instagram}
            target="_blank"
            rel="noreferrer"
            aria-label="Abrir Instagram"
            title="Instagram"
          >
            <Camera size={19} aria-hidden="true" />
          </a>
          {isDineIn ? (
            <button className="action-button subtle" type="button" onClick={handleWaiterCall}>
              <Bell size={18} aria-hidden="true" />
              Chamar garçom
            </button>
          ) : (
            <a
              className="action-button subtle"
              href={buildWhatsAppUrl('Olá! Gostaria de fazer um pedido para delivery.')}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={18} aria-hidden="true" />
              WhatsApp delivery
            </a>
          )}
        </nav>
      </header>

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <img src={heroImage} alt="Pizza, esfirras e espetinhos em mesa de madeira" />
          <div className="hero-overlay" />
          <div className="hero-content">
            <div className="status-row">
              <span className={`status-pill ${isOpen ? 'open' : 'closed'}`}>
                {isOpen ? 'Aberto agora' : 'Fechado agora'}
              </span>
              <span className="hero-meta">
                <Clock3 size={17} aria-hidden="true" />
                {store.hours}
              </span>
            </div>

            <h1 id="hero-title">{store.name}</h1>
            <p>{isDineIn ? store.dineInNotice : store.deliveryNotice}</p>

            <div className="hero-actions">
              <button className="primary-button" type="button" onClick={scrollToMenu}>
                Ver cardápio
                <ChevronRight size={18} aria-hidden="true" />
              </button>
              {isDineIn ? (
                <button className="secondary-button" type="button" onClick={handleWaiterCall}>
                  <Bell size={18} aria-hidden="true" />
                  Chamar garçom
                </button>
              ) : (
                <a
                  className="secondary-button"
                  href={buildWhatsAppUrl('Olá! Gostaria de fazer um pedido para delivery.')}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle size={18} aria-hidden="true" />
                  WhatsApp
                </a>
              )}
            </div>
          </div>
        </section>

        <section className="order-strip" aria-label="Dados do atendimento">
          <div className="strip-facts">
            {isDineIn ? (
              <div>
                <span className="eyebrow">Mesa</span>
                <strong>{formattedTable || 'Informe sua mesa'}</strong>
              </div>
            ) : null}
            <div>
              <span className="eyebrow">Endereço</span>
              <strong>{store.address}</strong>
            </div>
            <div>
              <span className="eyebrow">{isDineIn ? 'Atendimento' : 'WhatsApp'}</span>
              <strong>{isDineIn ? 'Garçom presencial' : store.phone}</strong>
            </div>
          </div>

          {isDineIn ? (
            <label className="table-field">
              <MapPin size={18} aria-hidden="true" />
              <input
                value={table}
                onChange={(event) => setTable(event.target.value)}
                placeholder="Ex: 04"
                inputMode="numeric"
                aria-label="Número da mesa"
              />
            </label>
          ) : (
            <a
              className="action-button delivery-strip-button"
              href={buildWhatsAppUrl('Olá! Gostaria de fazer um pedido para delivery.')}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={18} aria-hidden="true" />
              Pedir delivery
            </a>
          )}
        </section>

        <section className="workspace" id="cardapio">
          <div className="menu-panel">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Cardápio</span>
                <h2>Escolha seu pedido</h2>
              </div>

              <label className="search-field">
                <Search size={19} aria-hidden="true" />
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Buscar produto"
                  aria-label="Buscar produto"
                />
                {searchTerm ? (
                  <button
                    className="clear-search"
                    type="button"
                    onClick={() => setSearchTerm('')}
                    aria-label="Limpar busca"
                    title="Limpar busca"
                  >
                    <X size={16} aria-hidden="true" />
                  </button>
                ) : null}
              </label>
            </div>

            <div className="category-tabs" aria-label="Categorias">
              {menu.map((category) => (
                <button
                  className={category.id === activeCategory && !searchTerm ? 'active' : ''}
                  type="button"
                  key={category.id}
                  onClick={() => {
                    setActiveCategory(category.id)
                    setSearchTerm('')
                  }}
                  style={{ '--category-color': category.color }}
                >
                  <span>{category.name}</span>
                  <small>{category.description}</small>
                </button>
              ))}
            </div>

            <div
              className="menu-context"
              style={{ '--category-color': activeCategoryData.color }}
            >
              <div>
                <span>{searchTerm ? 'Busca no cardápio' : activeCategoryData.name}</span>
                <p>
                  {searchTerm
                    ? `Resultados para "${searchTerm.trim()}"`
                    : activeCategoryData.description}
                </p>
              </div>
              <strong>
                {visibleProducts.length} {visibleProducts.length === 1 ? 'item' : 'itens'}
              </strong>
            </div>

            <div className="product-grid">
              {visibleProducts.map((product) => {
                const isRecentlyAdded = recentlyAddedId === product.id

                return (
                  <article
                    className={`product-card ${isRecentlyAdded ? 'just-added' : ''}`}
                    key={product.id}
                  >
                    <div className="product-photo">
                      <img
                        src={heroImage}
                        alt=""
                        aria-hidden="true"
                        style={{ objectPosition: product.position }}
                      />
                      <span style={{ backgroundColor: product.categoryColor }}>
                        {product.categoryName}
                      </span>
                    </div>

                    <div className="product-info">
                      <div>
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                      </div>
                      <div className="product-footer">
                        <strong>{formatProductPrice(product)}</strong>
                        <button
                          className={isRecentlyAdded ? 'added' : ''}
                          type="button"
                          onClick={() => addToCart(product)}
                        >
                          <Plus size={18} aria-hidden="true" />
                          {isRecentlyAdded ? 'Adicionado' : 'Adicionar'}
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>

            {!visibleProducts.length ? (
              <div className="empty-state">
                <Search size={24} aria-hidden="true" />
                <strong>Nenhum item encontrado</strong>
              </div>
            ) : null}
          </div>

          <button
            className={`cart-backdrop ${cartOpen ? 'visible' : ''}`}
            type="button"
            onClick={() => setCartOpen(false)}
            aria-label={isDineIn ? 'Fechar resumo da mesa' : 'Fechar carrinho'}
          />

          <aside
            id="cart-panel"
            className={`cart-panel ${cartOpen ? 'open' : ''}`}
            aria-label={isDineIn ? 'Resumo da mesa' : 'Carrinho'}
          >
            <div className="cart-header">
              <div>
                <span className="eyebrow">{isDineIn ? 'Resumo' : 'Carrinho'}</span>
                <h2>{isDineIn ? 'Para o garçom' : 'Seu pedido'}</h2>
              </div>
              <div className="cart-header-actions">
                <span className="cart-count">
                  <ShoppingBag size={17} aria-hidden="true" />
                  {itemCount}
                </span>
                <button
                  className="cart-close"
                  type="button"
                  onClick={() => setCartOpen(false)}
                  aria-label={isDineIn ? 'Fechar resumo da mesa' : 'Fechar carrinho'}
                  title="Fechar"
                >
                  <X size={18} aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="cart-items">
              {cart.length ? (
                cart.map((item) => (
                  <div className="cart-item" key={item.id}>
                    <div>
                      <strong>{item.name}</strong>
                      <small>{formatLineTotal(item)}</small>
                    </div>

                    <div className="quantity-control" aria-label={`Quantidade de ${item.name}`}>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        aria-label={`Diminuir ${item.name}`}
                        title="Diminuir"
                      >
                        <Minus size={15} aria-hidden="true" />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label={`Aumentar ${item.name}`}
                        title="Aumentar"
                      >
                        <Plus size={15} aria-hidden="true" />
                      </button>
                      <button
                        className="remove-item"
                        type="button"
                        onClick={() => updateQuantity(item.id, 0)}
                        aria-label={`Remover ${item.name}`}
                        title="Remover"
                      >
                        <Trash2 size={15} aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="cart-empty">
                  <ShoppingBag size={25} aria-hidden="true" />
                  <strong>Carrinho vazio</strong>
                </div>
              )}
            </div>

            <label className="note-field">
              <span>Observação</span>
              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder={
                  isDineIn
                    ? 'Ex: levar cardápio de bebidas ou tirar dúvidas.'
                    : 'Ex: pizza meia calabresa, sem cebola.'
                }
                rows="4"
              />
            </label>

            {isDineIn && cart.length ? (
              <fieldset className="payment-timing">
                <legend>Pagamento</legend>
                <div className="payment-options">
                  {Object.entries(PAYMENT_TIMING_META).map(([value, meta]) => (
                    <label
                      className={`payment-option ${paymentTiming === value ? 'active' : ''}`}
                      key={value}
                    >
                      <input
                        type="radio"
                        name="paymentTiming"
                        value={value}
                        checked={paymentTiming === value}
                        onChange={() => setPaymentTiming(value)}
                      />
                      <span>{meta.label}</span>
                      <small>{meta.description}</small>
                    </label>
                  ))}
                </div>
              </fieldset>
            ) : null}

            <div className="total-row">
              <span>Total</span>
              <strong>{hasPricedItems ? currency.format(cartTotal) : 'A confirmar'}</strong>
            </div>

            {isDineIn ? (
              <>
                <p className="service-note">
                  A equipe recebe sua solicitação no painel interno. Envie itens, tire dúvidas ou peça a conta.
                </p>
                <div className="service-actions">
                  <button className="checkout-button" type="button" onClick={handleWaiterCall}>
                    <Bell size={19} aria-hidden="true" />
                    {cart.length ? 'Enviar pedido' : 'Chamar garçom'}
                  </button>
                  <button
                    className="checkout-button secondary-checkout"
                    type="button"
                    onClick={handlePaymentRequest}
                  >
                    <CreditCard size={19} aria-hidden="true" />
                    Pedir conta
                  </button>
                </div>
              </>
            ) : (
              <a
                className={`checkout-button ${cart.length ? '' : 'disabled'}`}
                href={cart.length ? buildWhatsAppUrl(orderMessage) : undefined}
                target="_blank"
                rel="noreferrer"
                aria-disabled={!cart.length}
                onClick={(event) => {
                  if (!cart.length) event.preventDefault()
                }}
              >
                <MessageCircle size={19} aria-hidden="true" />
                Enviar pelo WhatsApp
              </a>
            )}
            {waiterRequested && isDineIn ? (
              <p className="waiter-status">
                {lastWaiterRequest?.message || 'Solicitação enviada para a equipe.'}
              </p>
            ) : null}
          </aside>
        </section>

        {addNotice ? (
          <div className="add-toast" role="status">
            <ShoppingBag size={18} aria-hidden="true" />
            {addNotice}
          </div>
        ) : null}

        <button
          className={`floating-cart ${cartOpen ? 'open' : ''} ${itemCount ? 'has-items' : ''}`}
          type="button"
          onClick={() => setCartOpen(true)}
          aria-controls="cart-panel"
          aria-expanded={cartOpen}
        >
          <span className="floating-cart-icon">
            <ShoppingBag size={20} aria-hidden="true" />
            {itemCount ? <em>{itemCount}</em> : null}
          </span>
          <span>{isDineIn ? 'Resumo da mesa' : 'Carrinho'}</span>
          <strong>
            {itemCount
              ? `${itemCount} ${itemCount === 1 ? 'item' : 'itens'}`
              : isDineIn
                ? 'Abrir resumo'
                : 'Abrir'}
          </strong>
        </button>
      </main>
    </div>
  )
}

function AdminArea() {
  const [employee, setEmployee] = useState(readAdminSession)

  const handleLogout = () => {
    clearAdminSession()
    setEmployee(null)
  }

  if (!employee) return <AdminLogin onLogin={setEmployee} />

  return <AdminPanel employee={employee} onLogout={handleLogout} />
}

function App() {
  return isAdminRoute() ? <AdminArea /> : <CustomerMenu />
}

export default App
