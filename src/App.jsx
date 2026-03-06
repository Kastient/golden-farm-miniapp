import { startTransition, useEffect, useEffectEvent, useRef, useState } from 'react'
import './App.css'

const MAX_FARMS_PER_TYPE = 10
const TREASURE_COOLDOWN_SECONDS = 180
const EGG_HUNT_COOLDOWN_SECONDS = 55
const SPAWNER_SLOT_COUNT = 3
const MAX_SPAWNER_POWER_LEVEL = 12
const LOCAL_STORAGE_KEY = 'golden-farm-local-v3'
const CLOUD_STORAGE_KEY = 'golden_farm_state_v3'
const ADMIN_TELEGRAM_ID = 6037580694
const DEFAULT_USERNAME = 'UserName телеграмм'

const CATEGORIES = [
  { id: 'crops', title: 'Фермы', icon: '/minecraft/wheat.png' },
  { id: 'mobs', title: 'Фермы мобов', icon: '/minecraft/bone.png' },
  { id: 'spawners', title: 'Спавнеры', icon: '/minecraft/egg_zombie.png' },
  { id: 'boosters', title: 'Бустеры', icon: '/minecraft/potion_strength.png' },
]

const FARM_CATALOG = [
  {
    id: 'wheat',
    category: 'crops',
    title: 'Ферма пшеницы',
    subtitle: 'Стартовая ферма',
    image: '/minecraft/wheat.png',
    accent: '#f1c65a',
    baseCost: 48,
    income: 1.2,
    blurb: 'Лёгкий старт и стабильный доход.',
  },
  {
    id: 'carrot',
    category: 'crops',
    title: 'Ферма морковки',
    subtitle: 'Быстрый рост',
    image: '/minecraft/carrot.png',
    accent: '#ff8a3d',
    baseCost: 120,
    income: 3.1,
    blurb: 'Даёт больше золота уже с первых минут.',
  },
  {
    id: 'potato',
    category: 'crops',
    title: 'Ферма картошки',
    subtitle: 'Надёжный урожай',
    image: '/minecraft/potato.png',
    accent: '#cfb56c',
    baseCost: 310,
    income: 7.8,
    blurb: 'Сильный середняк для стабильного буста.',
  },
  {
    id: 'berries',
    category: 'crops',
    title: 'Ферма сладких ягод',
    subtitle: 'Редкий урожай',
    image: '/minecraft/sweet_berries.png',
    accent: '#ff4f7d',
    baseCost: 760,
    income: 17.5,
    blurb: 'Редкая ферма с заметным ускорением прогресса.',
  },
  {
    id: 'melon',
    category: 'crops',
    title: 'Ферма арбузов',
    subtitle: 'Финальный буст',
    image: '/minecraft/melon_slice.png',
    accent: '#63dd6d',
    baseCost: 1850,
    income: 39,
    blurb: 'Крупный доход и самый сочный визуал.',
  },
  {
    id: 'skeleton',
    category: 'mobs',
    title: 'Ферма скелетов',
    subtitle: 'Костяной дроп',
    image: '/minecraft/bone.png',
    accent: '#e5e5d8',
    baseCost: 240,
    income: 5.2,
    blurb: 'Скелеты стабильно приносят кости и золото.',
  },
  {
    id: 'zombie',
    category: 'mobs',
    title: 'Ферма зомби',
    subtitle: 'Тёмный доход',
    image: '/minecraft/rotten_flesh.png',
    accent: '#79b44d',
    baseCost: 540,
    income: 12.4,
    blurb: 'Медленнее на старте, но отлично разгоняет доход.',
  },
  {
    id: 'cow',
    category: 'mobs',
    title: 'Ферма коров',
    subtitle: 'Кожа и ресурс',
    image: '/minecraft/leather.png',
    accent: '#b5835b',
    baseCost: 900,
    income: 18.8,
    blurb: 'Спокойная ферма с плотной экономикой.',
  },
  {
    id: 'pig',
    category: 'mobs',
    title: 'Ферма свиней',
    subtitle: 'Сочный дроп',
    image: '/minecraft/porkchop.png',
    accent: '#ff9da3',
    baseCost: 1350,
    income: 26.5,
    blurb: 'Хороший апгрейд перед поздней стадией.',
  },
  {
    id: 'spider',
    category: 'mobs',
    title: 'Ферма пауков',
    subtitle: 'Нити и темп',
    image: '/minecraft/string.png',
    accent: '#c7d3df',
    baseCost: 1780,
    income: 34.2,
    blurb: 'Даёт быстрый поток монет и усиливает темп игры.',
  },
  {
    id: 'slime',
    category: 'mobs',
    title: 'Ферма слизней',
    subtitle: 'Редкая добыча',
    image: '/minecraft/slime_ball.png',
    accent: '#8cff90',
    baseCost: 2360,
    income: 45.8,
    blurb: 'Редкая моб-ферма с жирным апгрейдом дохода.',
  },
  {
    id: 'creeper',
    category: 'mobs',
    title: 'Ферма криперов',
    subtitle: 'Взрывной буст',
    image: '/minecraft/gunpowder.png',
    accent: '#9fce4b',
    baseCost: 3200,
    income: 61,
    blurb: 'Финальная моб-ферма с самым мощным ростом золота.',
  },
]

const BOOSTER_CATALOG = [
  {
    id: 'strength_1',
    title: 'Зелье силы I',
    subtitle: 'Боевой тонус',
    icon: '/minecraft/potion_strength.png',
    accent: '#f4be58',
    cost: 180,
    durationSeconds: 10 * 60,
    incomeMultiplier: 1.35,
    collectMultiplier: 1,
    priceMultiplier: 1,
    effectLabel: '+35% к доходу/сек',
    blurb: 'Поднимает производительность ферм и моб-ферм на 10 минут.',
  },
  {
    id: 'strength_2',
    title: 'Зелье силы II',
    subtitle: 'Элитный буст',
    icon: '/minecraft/potion_strength.png',
    accent: '#ffd86e',
    cost: 420,
    durationSeconds: 7 * 60,
    incomeMultiplier: 1.8,
    collectMultiplier: 1,
    priceMultiplier: 1,
    effectLabel: '+80% к доходу/сек',
    blurb: 'Сильный краткий буст для быстрого разгона казны.',
  },
  {
    id: 'luck',
    title: 'Зелье удачи',
    subtitle: 'Жадный сбор',
    icon: '/minecraft/potion_luck.png',
    accent: '#80df96',
    cost: 250,
    durationSeconds: 9 * 60,
    incomeMultiplier: 1,
    collectMultiplier: 1.25,
    priceMultiplier: 1,
    effectLabel: '+25% к кнопке "Собрать"',
    blurb: 'Каждый сбор готового золота приносит на четверть больше.',
  },
  {
    id: 'swiftness',
    title: 'Зелье стремительности',
    subtitle: 'Быстрый рынок',
    icon: '/minecraft/potion_swiftness.png',
    accent: '#95d1ff',
    cost: 320,
    durationSeconds: 12 * 60,
    incomeMultiplier: 1,
    collectMultiplier: 1,
    priceMultiplier: 0.82,
    effectLabel: '-18% к цене ферм',
    blurb: 'Временно снижает стоимость покупки всех ферм.',
  },
]

const BOOSTERS_BY_ID = BOOSTER_CATALOG.reduce((accumulator, booster) => {
  accumulator[booster.id] = booster
  return accumulator
}, {})

const SPAWNER_CATALOG = [
  {
    id: 'zombie',
    title: 'Яйцо зомби',
    icon: '/minecraft/egg_zombie.png',
    income: 18,
    weight: 24,
    accent: '#7bb251',
  },
  {
    id: 'skeleton',
    title: 'Яйцо скелета',
    icon: '/minecraft/egg_skeleton.png',
    income: 24,
    weight: 20,
    accent: '#d8ddd6',
  },
  {
    id: 'spider',
    title: 'Яйцо паука',
    icon: '/minecraft/egg_spider.png',
    income: 30,
    weight: 18,
    accent: '#5f4e76',
  },
  {
    id: 'cow',
    title: 'Яйцо коровы',
    icon: '/minecraft/egg_cow.png',
    income: 37,
    weight: 16,
    accent: '#a87e62',
  },
  {
    id: 'slime',
    title: 'Яйцо слизня',
    icon: '/minecraft/egg_slime.png',
    income: 45,
    weight: 13,
    accent: '#74db7f',
  },
  {
    id: 'creeper',
    title: 'Яйцо крипера',
    icon: '/minecraft/egg_creeper.png',
    income: 56,
    weight: 9,
    accent: '#8ccf52',
  },
]

const SPAWNERS_BY_ID = SPAWNER_CATALOG.reduce((accumulator, spawner) => {
  accumulator[spawner.id] = spawner
  return accumulator
}, {})

const formatter = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1 })

const createFarmState = () =>
  FARM_CATALOG.reduce((accumulator, farm) => {
    accumulator[farm.id] = 0
    return accumulator
  }, {})

const createEggInventoryState = () =>
  SPAWNER_CATALOG.reduce((accumulator, spawner) => {
    accumulator[spawner.id] = 0
    return accumulator
  }, {})

const roundToTenth = (value) => Math.round(value * 10) / 10

const formatCoins = (value) => formatter.format(roundToTenth(value))

const getIncomePerSecond = (farms) =>
  FARM_CATALOG.reduce((total, farm) => total + (farms[farm.id] || 0) * farm.income, 0)

const getSpawnerPowerMultiplier = (spawnerPowerLevel) =>
  1 + Math.max(0, spawnerPowerLevel - 1) * 0.12

const getSpawnerIncomePerSecond = (spawnerSlots, spawnerPowerLevel = 1) => {
  const base = spawnerSlots.reduce((total, slot) => {
    if (!slot) {
      return total
    }

    return total + (SPAWNERS_BY_ID[slot]?.income || 0)
  }, 0)

  return base * getSpawnerPowerMultiplier(spawnerPowerLevel)
}

const getSpawnerPowerUpgradeCost = (level) => {
  if (level >= MAX_SPAWNER_POWER_LEVEL) {
    return null
  }

  return Math.round(140 * Math.pow(1.85, level - 1))
}

const sanitizeEggInventory = (eggInventory) => {
  const clean = createEggInventoryState()
  for (const spawner of SPAWNER_CATALOG) {
    const count = Number(eggInventory?.[spawner.id] ?? 0)
    clean[spawner.id] = Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0
  }
  return clean
}

const sanitizeSpawnerSlots = (spawnerSlots) => {
  const fallback = Array.from({ length: SPAWNER_SLOT_COUNT }, () => null)
  if (!Array.isArray(spawnerSlots)) {
    return fallback
  }

  return fallback.map((_, index) => {
    const value = spawnerSlots[index]
    return SPAWNERS_BY_ID[value] ? value : null
  })
}

const sanitizeActiveBoosts = (activeBoosts, now = Date.now()) =>
  Array.isArray(activeBoosts)
    ? activeBoosts
        .filter((boost) => {
          const booster = BOOSTERS_BY_ID[boost?.boosterId]
          const expiresAt = Number(boost?.expiresAt)
          return booster && Number.isFinite(expiresAt) && expiresAt > now
        })
        .map((boost) => ({
          boosterId: boost.boosterId,
          expiresAt: Number(boost.expiresAt),
        }))
    : []

const getBoostTotals = (activeBoosts, atTime = Date.now()) => {
  const active = sanitizeActiveBoosts(activeBoosts, atTime)
  return active.reduce(
    (totals, boost) => {
      const booster = BOOSTERS_BY_ID[boost.boosterId]
      return {
        incomeMultiplier: totals.incomeMultiplier * booster.incomeMultiplier,
        collectMultiplier: totals.collectMultiplier * booster.collectMultiplier,
        priceMultiplier: totals.priceMultiplier * booster.priceMultiplier,
      }
    },
    {
      incomeMultiplier: 1,
      collectMultiplier: 1,
      priceMultiplier: 1,
    },
  )
}

const getIncomeForPeriod = (farms, spawnerSlots, spawnerPowerLevel, activeBoosts, fromTime, toTime) => {
  const baseIncome =
    getIncomePerSecond(farms) + getSpawnerIncomePerSecond(spawnerSlots, spawnerPowerLevel)
  if (baseIncome <= 0 || toTime <= fromTime) {
    return 0
  }

  const splitPoints = [fromTime, toTime]
  for (const boost of sanitizeActiveBoosts(activeBoosts, fromTime)) {
    if (boost.expiresAt > fromTime && boost.expiresAt < toTime) {
      splitPoints.push(boost.expiresAt)
    }
  }

  splitPoints.sort((a, b) => a - b)
  let earned = 0

  for (let index = 0; index < splitPoints.length - 1; index += 1) {
    const segmentStart = splitPoints[index]
    const segmentEnd = splitPoints[index + 1]
    const sampleTime = Math.min(segmentEnd - 1, segmentStart + 1)
    const { incomeMultiplier } = getBoostTotals(activeBoosts, sampleTime)
    earned += baseIncome * incomeMultiplier * ((segmentEnd - segmentStart) / 1000)
  }

  return earned
}

const getFarmPrice = (farm, owned, priceMultiplier = 1) => {
  if (owned >= MAX_FARMS_PER_TYPE) {
    return null
  }

  if (farm.id === 'wheat' && owned === 0) {
    return 0
  }

  return Math.max(1, Math.round(farm.baseCost * Math.pow(1.34, owned) * priceMultiplier))
}

const getRank = (lifetimeCollected) => {
  if (lifetimeCollected >= 12000) return 'Король автоматизации'
  if (lifetimeCollected >= 5000) return 'Империя урожая'
  if (lifetimeCollected >= 1800) return 'Мастер полей'
  if (lifetimeCollected >= 600) return 'Фермер-торговец'
  return 'Новичок фермы'
}

const createDefaultState = () => ({
  username: DEFAULT_USERNAME,
  balance: 90,
  pendingIncome: 0,
  lifetimeCollected: 0,
  farms: createFarmState(),
  eggInventory: createEggInventoryState(),
  spawnerSlots: Array.from({ length: SPAWNER_SLOT_COUNT }, () => null),
  nextEggHuntAt: Date.now(),
  eggHunts: 0,
  spawnerPowerLevel: 1,
  activeBoosts: [],
  nextTreasureAt: Date.now(),
  treasureOpens: 0,
  lastUpdatedAt: Date.now(),
})

const createDefaultStateForCurrentUser = () => ({
  ...createDefaultState(),
  username: detectTelegramUsername() || DEFAULT_USERNAME,
})

const formatTimer = (seconds) => {
  const safe = Math.max(0, Math.floor(seconds))
  const hours = Math.floor(safe / 3600)
  const minutes = Math.floor((safe % 3600) / 60)
  const secs = safe % 60
  const mm = String(minutes).padStart(2, '0')
  const ss = String(secs).padStart(2, '0')

  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}:${mm}:${ss}`
  }

  return `${mm}:${ss}`
}

const getTelegramUser = () => {
  if (typeof window === 'undefined') {
    return null
  }

  return window.Telegram?.WebApp?.initDataUnsafe?.user ?? null
}

const detectTelegramUsername = () => {
  const user = getTelegramUser()
  if (!user) {
    return ''
  }

  if (user.username) {
    return `@${user.username}`
  }

  return [user.first_name, user.last_name].filter(Boolean).join(' ')
}

const getCloudStorage = () => {
  if (typeof window === 'undefined') {
    return null
  }

  return window.Telegram?.WebApp?.CloudStorage ?? null
}

const buildHydratedState = (parsed, fallback, now = Date.now()) => {
  const farms = createFarmState()
  const eggInventory = sanitizeEggInventory(parsed?.eggInventory)
  const spawnerSlots = sanitizeSpawnerSlots(parsed?.spawnerSlots)

  for (const farm of FARM_CATALOG) {
    const count = Number(parsed?.farms?.[farm.id] ?? 0)
    farms[farm.id] = Number.isFinite(count)
      ? Math.min(MAX_FARMS_PER_TYPE, Math.max(0, Math.floor(count)))
      : 0
  }

  const lastUpdatedAt = Number(parsed?.lastUpdatedAt ?? now)
  const activeBoosts = sanitizeActiveBoosts(parsed?.activeBoosts, now)
  const spawnerPowerLevel = Math.min(
    MAX_SPAWNER_POWER_LEVEL,
    Math.max(1, Math.floor(Number(parsed?.spawnerPowerLevel ?? 1))),
  )
  const offlineIncome = getIncomeForPeriod(
    farms,
    spawnerSlots,
    spawnerPowerLevel,
    activeBoosts,
    lastUpdatedAt,
    now,
  )

  return {
    username: detectTelegramUsername() || parsed?.username || fallback.username,
    balance: Math.max(0, Number(parsed?.balance ?? fallback.balance)),
    pendingIncome: roundToTenth(Math.max(0, Number(parsed?.pendingIncome ?? 0)) + offlineIncome),
    lifetimeCollected: Math.max(0, Number(parsed?.lifetimeCollected ?? 0)),
    farms,
    eggInventory,
    spawnerSlots,
    nextEggHuntAt: Math.max(now, Number(parsed?.nextEggHuntAt ?? now)),
    eggHunts: Math.max(0, Number(parsed?.eggHunts ?? 0)),
    spawnerPowerLevel,
    activeBoosts,
    nextTreasureAt: Math.max(now, Number(parsed?.nextTreasureAt ?? now)),
    treasureOpens: Math.max(0, Number(parsed?.treasureOpens ?? 0)),
    lastUpdatedAt: now,
  }
}

const hydrateState = () => {
  const fallback = createDefaultStateForCurrentUser()

  if (typeof window === 'undefined') {
    return fallback
  }

  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY)

    if (!raw) {
      return fallback
    }

    const parsed = JSON.parse(raw)
    return buildHydratedState(parsed, fallback)
  } catch {
    return fallback
  }
}

const useAnimatedValue = (target, duration = 420) => {
  const [value, setValue] = useState(target)

  useEffect(() => {
    let frameId = 0
    const startedAt = performance.now()
    const initialValue = value

    const animate = (now) => {
      const progress = Math.min(1, (now - startedAt) / duration)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(initialValue + (target - initialValue) * eased)
      if (progress < 1) {
        frameId = requestAnimationFrame(animate)
      }
    }

    frameId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameId)
  }, [duration, target])

  return value
}

function App() {
  const [game, setGame] = useState(hydrateState)
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id)
  const [flights, setFlights] = useState([])
  const [toasts, setToasts] = useState([])
  const [celebrationFarm, setCelebrationFarm] = useState('')
  const [cloudReady, setCloudReady] = useState(false)
  const balanceBadgeRef = useRef(null)
  const collectButtonRef = useRef(null)
  const treasureButtonRef = useRef(null)
  const eggHuntButtonRef = useRef(null)
  const nextIdRef = useRef(1)

  const animatedBalance = useAnimatedValue(game.balance)
  const animatedPending = useAnimatedValue(game.pendingIncome)
  const now = game.lastUpdatedAt
  const telegramUser = getTelegramUser()
  const isTelegramSession = Boolean(telegramUser?.id && getCloudStorage())
  const isAdmin = telegramUser?.id === ADMIN_TELEGRAM_ID
  const activeBoosts = sanitizeActiveBoosts(game.activeBoosts, now)
  const boostTotals = getBoostTotals(activeBoosts, now)
  const farmIncomePerSecond = getIncomePerSecond(game.farms)
  const spawnerIncomePerSecond = getSpawnerIncomePerSecond(game.spawnerSlots, game.spawnerPowerLevel)
  const baseIncomePerSecond = farmIncomePerSecond + spawnerIncomePerSecond
  const incomePerSecond = baseIncomePerSecond * boostTotals.incomeMultiplier
  const totalFarms = Object.values(game.farms).reduce((total, count) => total + count, 0)
  const filledSpawnerSlots = game.spawnerSlots.filter(Boolean).length
  const collectDisabled = game.pendingIncome < 0.5
  const profileName = game.username.trim() || DEFAULT_USERNAME
  const normalizedCategory = CATEGORIES.some((category) => category.id === activeCategory)
    ? activeCategory
    : CATEGORIES[0].id
  const isSpawnerCategory = normalizedCategory === 'spawners'
  const isBoosterCategory = normalizedCategory === 'boosters'
  const showTreasureSystems = normalizedCategory === 'crops' || normalizedCategory === 'mobs'
  const showSpawnerSystems = isSpawnerCategory
  const showSystemsSection = showTreasureSystems || showSpawnerSystems
  const showShopPanel = !isSpawnerCategory

  const visibleFarms = isBoosterCategory || isSpawnerCategory
    ? []
    : FARM_CATALOG.filter((farm) => farm.category === normalizedCategory)

  const treasureReadyInSeconds = Math.max(0, Math.ceil((game.nextTreasureAt - now) / 1000))
  const canOpenTreasure = treasureReadyInSeconds === 0
  const eggHuntReadyInSeconds = Math.max(0, Math.ceil((game.nextEggHuntAt - now) / 1000))
  const canHuntEggs = eggHuntReadyInSeconds === 0

  const activeBoostCards = activeBoosts
    .map((boost) => {
      const booster = BOOSTERS_BY_ID[boost.boosterId]
      if (!booster) {
        return null
      }

      return {
        ...booster,
        expiresAt: boost.expiresAt,
        remainingSeconds: Math.max(0, Math.ceil((boost.expiresAt - now) / 1000)),
      }
    })
    .filter(Boolean)
    .sort((left, right) => left.expiresAt - right.expiresAt)

  const activeBoostById = activeBoostCards.reduce((accumulator, boost) => {
    accumulator[boost.id] = boost
    return accumulator
  }, {})

  const categoryStats = CATEGORIES.map((category) => {
    if (category.id === 'boosters') {
      return { ...category, count: activeBoostCards.length }
    }
    if (category.id === 'spawners') {
      return { ...category, count: filledSpawnerSlots }
    }

    const farms = FARM_CATALOG.filter((farm) => farm.category === category.id)
    return {
      ...category,
      count: farms.reduce((total, farm) => total + (game.farms[farm.id] || 0), 0),
    }
  })

  const pushToast = useEffectEvent((message, tone = 'gold') => {
    const toastId = nextIdRef.current++

    startTransition(() => {
      setToasts((current) => [...current, { id: toastId, message, tone }])
    })

    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== toastId))
    }, 2200)
  })

  const spawnFlights = useEffectEvent((fromRect, toRect, icon, variant, count) => {
    const entries = Array.from({ length: count }, (_, index) => ({
      id: nextIdRef.current++,
      icon,
      variant,
      delay: index * 70,
      duration: 850 + index * 45,
      startX: fromRect.left + fromRect.width / 2 + (Math.random() - 0.5) * fromRect.width * 0.5,
      startY: fromRect.top + fromRect.height / 2 + (Math.random() - 0.5) * fromRect.height * 0.5,
      endX: toRect.left + toRect.width / 2 + (Math.random() - 0.5) * 22,
      endY: toRect.top + toRect.height / 2 + (Math.random() - 0.5) * 22,
      rotation: Math.round((Math.random() - 0.5) * 44),
    }))

    startTransition(() => {
      setFlights((current) => [...current, ...entries])
    })

    window.setTimeout(() => {
      setFlights((current) =>
        current.filter((flight) => !entries.some((entry) => entry.id === flight.id)),
      )
    }, 1700)
  })

  const spawnBurst = useEffectEvent((rect, icon, variant = 'reward') => {
    spawnFlights(
      rect,
      {
        left: rect.left + (Math.random() - 0.5) * 80,
        top: rect.top - 120,
        width: 20,
        height: 20,
      },
      icon,
      variant,
      4,
    )
  })

  const advanceEconomy = useEffectEvent(() => {
    setGame((current) => {
      const now = Date.now()
      const elapsedSeconds = Math.max(0, (now - current.lastUpdatedAt) / 1000)

      if (elapsedSeconds < 0.75) {
        return current
      }

      const cleanedBoosts = sanitizeActiveBoosts(current.activeBoosts, now)
      const earnedIncome = getIncomeForPeriod(
        current.farms,
        current.spawnerSlots,
        current.spawnerPowerLevel,
        current.activeBoosts,
        current.lastUpdatedAt,
        now,
      )

      return {
        ...current,
        pendingIncome: roundToTenth(current.pendingIncome + earnedIncome),
        activeBoosts: cleanedBoosts,
        lastUpdatedAt: now,
      }
    })
  })

  useEffect(() => {
    document.title = 'Golden Farm Mini App'

    const telegramApp = window.Telegram?.WebApp
    telegramApp?.ready()
    telegramApp?.expand()
    const cloudStorage = getCloudStorage()

    if (!telegramApp || !cloudStorage || !getTelegramUser()?.id) {
      setGame(hydrateState())
      setCloudReady(true)
      return
    }

    cloudStorage.getItem(CLOUD_STORAGE_KEY, (error, value) => {
      if (error || !value) {
        setGame(createDefaultStateForCurrentUser())
        setCloudReady(true)
        return
      }

      try {
        const parsed = JSON.parse(value)
        setGame(buildHydratedState(parsed, createDefaultStateForCurrentUser()))
      } catch {
        setGame(createDefaultStateForCurrentUser())
      } finally {
        setCloudReady(true)
      }
    })
  }, [])

  useEffect(() => {
    const timerId = window.setInterval(() => {
      advanceEconomy()
    }, 1000)

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        advanceEconomy()
      }
    }

    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      window.clearInterval(timerId)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [advanceEconomy])

  useEffect(() => {
    if (!cloudReady) {
      return
    }

    const payload = JSON.stringify(game)
    window.localStorage.setItem(LOCAL_STORAGE_KEY, payload)

    if (isTelegramSession) {
      getCloudStorage()?.setItem(CLOUD_STORAGE_KEY, payload, () => {})
    }
  }, [cloudReady, game, isTelegramSession])

  const handleResetCurrentProfile = () => {
    const nextState = createDefaultStateForCurrentUser()

    window.localStorage.removeItem(LOCAL_STORAGE_KEY)
    if (isTelegramSession) {
      getCloudStorage()?.removeItem(CLOUD_STORAGE_KEY, () => {})
    }

    setGame(nextState)
    pushToast('Профиль сброшен', 'danger')
  }

  const handleCollect = () => {
    if (collectDisabled) {
      return
    }

    const amount = game.pendingIncome
    const collected = roundToTenth(amount * boostTotals.collectMultiplier)
    const collectRect = collectButtonRef.current?.getBoundingClientRect()
    const balanceRect = balanceBadgeRef.current?.getBoundingClientRect()

    if (collectRect && balanceRect) {
      spawnFlights(collectRect, balanceRect, '/minecraft/gold_nugget.png', 'collect', 10)
    }

    window.navigator.vibrate?.(35)

    setGame((current) => ({
      ...current,
      balance: roundToTenth(current.balance + collected),
      pendingIncome: 0,
      lifetimeCollected: roundToTenth(current.lifetimeCollected + collected),
      activeBoosts: sanitizeActiveBoosts(current.activeBoosts),
      lastUpdatedAt: Date.now(),
    }))

    const bonus = roundToTenth(collected - amount)
    pushToast(
      bonus > 0
        ? `Собрано ${formatCoins(collected)} (+${formatCoins(bonus)} от бафов)`
        : `+${formatCoins(collected)} золота отправлено в баланс`,
    )
  }

  const handleBuyFarm = (farm, target) => {
    const priceMultiplier = getBoostTotals(game.activeBoosts).priceMultiplier
    const owned = game.farms[farm.id] || 0

    if (owned >= MAX_FARMS_PER_TYPE) {
      pushToast(`Лимит для "${farm.title}" уже достигнут: ${MAX_FARMS_PER_TYPE}/10`, 'danger')
      return
    }

    const price = getFarmPrice(farm, owned, priceMultiplier)
    if (price === null) {
      return
    }

    if (price > game.balance) {
      pushToast(`Нужно ещё ${formatCoins(price - game.balance)} золота для "${farm.title}"`, 'danger')
      return
    }

    const buttonRect = target.getBoundingClientRect()
    const balanceRect = balanceBadgeRef.current?.getBoundingClientRect()

    if (price > 0 && balanceRect) {
      spawnFlights(balanceRect, buttonRect, '/minecraft/gold_ingot.png', 'spend', 7)
    }

    spawnBurst(buttonRect, farm.image)
    setCelebrationFarm(farm.id)

    window.setTimeout(() => {
      setCelebrationFarm((current) => (current === farm.id ? '' : current))
    }, 700)

    setGame((current) => {
      const currentPriceMultiplier = getBoostTotals(current.activeBoosts).priceMultiplier
      const currentOwned = current.farms[farm.id] || 0
      const currentPrice = getFarmPrice(farm, currentOwned, currentPriceMultiplier)

      if (
        currentOwned >= MAX_FARMS_PER_TYPE ||
        currentPrice === null ||
        currentPrice > current.balance
      ) {
        return current
      }

      return {
        ...current,
        balance: roundToTenth(current.balance - currentPrice),
        farms: {
          ...current.farms,
          [farm.id]: currentOwned + 1,
        },
        activeBoosts: sanitizeActiveBoosts(current.activeBoosts),
        lastUpdatedAt: Date.now(),
      }
    })

    pushToast(
      price === 0 ? `Первая "${farm.title}" получена бесплатно` : `Куплена "${farm.title}"`,
      'green',
    )
  }

  const handleBuyBooster = (booster, target) => {
    if (booster.cost > game.balance) {
      pushToast(`Не хватает ${formatCoins(booster.cost - game.balance)} золота`, 'danger')
      return
    }

    const buttonRect = target.getBoundingClientRect()
    const balanceRect = balanceBadgeRef.current?.getBoundingClientRect()

    if (balanceRect) {
      spawnFlights(balanceRect, buttonRect, '/minecraft/gold_ingot.png', 'spend', 5)
    }

    spawnBurst(buttonRect, booster.icon, 'reward')

    setGame((current) => {
      const now = Date.now()
      const cleanedBoosts = sanitizeActiveBoosts(current.activeBoosts, now)
      const currentBoost = cleanedBoosts.find((entry) => entry.boosterId === booster.id)
      const nextExpiresAt = currentBoost
        ? currentBoost.expiresAt + booster.durationSeconds * 1000
        : now + booster.durationSeconds * 1000

      return {
        ...current,
        balance: roundToTenth(current.balance - booster.cost),
        activeBoosts: [
          ...cleanedBoosts.filter((entry) => entry.boosterId !== booster.id),
          { boosterId: booster.id, expiresAt: nextExpiresAt },
        ],
        lastUpdatedAt: now,
      }
    })

    pushToast(`Активировано: ${booster.title}`, 'green')
  }

  const handleOpenTreasure = () => {
    if (!canOpenTreasure) {
      pushToast(`Сундук откроется через ${formatTimer(treasureReadyInSeconds)}`, 'danger')
      return
    }

    const baseReward =
      40 + totalFarms * 4 + Math.min(140, Math.floor(game.lifetimeCollected / 180))
    const randomBonus = Math.floor(Math.random() * 55)
    const luckyJackpot = Math.random() < 0.14
    const jackpotBonus = luckyJackpot ? Math.floor(baseReward * 1.8) + 60 : 0
    const reward = roundToTenth(baseReward + randomBonus + jackpotBonus)

    const treasureRect = treasureButtonRef.current?.getBoundingClientRect()
    const balanceRect = balanceBadgeRef.current?.getBoundingClientRect()
    if (treasureRect && balanceRect) {
      spawnFlights(treasureRect, balanceRect, '/minecraft/gold_ingot.png', 'collect', 9)
    }

    setGame((current) => ({
      ...current,
      balance: roundToTenth(current.balance + reward),
      lifetimeCollected: roundToTenth(current.lifetimeCollected + reward),
      nextTreasureAt: Date.now() + TREASURE_COOLDOWN_SECONDS * 1000,
      treasureOpens: current.treasureOpens + 1,
      lastUpdatedAt: Date.now(),
    }))

    pushToast(
      luckyJackpot
        ? `Сундук: ${formatCoins(reward)} золота (джекпот!)`
        : `Сундук: +${formatCoins(reward)} золота`,
      'green',
    )
  }

  const rollEggDrop = () => {
    const totalWeight = SPAWNER_CATALOG.reduce((sum, egg) => sum + egg.weight, 0)
    let roll = Math.random() * totalWeight

    for (const egg of SPAWNER_CATALOG) {
      roll -= egg.weight
      if (roll <= 0) {
        return egg
      }
    }

    return SPAWNER_CATALOG[0]
  }

  const handleHuntEggs = () => {
    if (!canHuntEggs) {
      pushToast(`Охота будет готова через ${formatTimer(eggHuntReadyInSeconds)}`, 'danger')
      return
    }

    const droppedEgg = rollEggDrop()
    const amount = Math.random() < 0.14 ? 2 : 1
    const huntRect = eggHuntButtonRef.current?.getBoundingClientRect()
    const balanceRect = balanceBadgeRef.current?.getBoundingClientRect()

    if (huntRect && balanceRect) {
      spawnFlights(huntRect, balanceRect, droppedEgg.icon, 'reward', 4)
    }

    setGame((current) => ({
      ...current,
      eggInventory: {
        ...current.eggInventory,
        [droppedEgg.id]: (current.eggInventory[droppedEgg.id] || 0) + amount,
      },
      nextEggHuntAt: Date.now() + EGG_HUNT_COOLDOWN_SECONDS * 1000,
      eggHunts: current.eggHunts + 1,
      lastUpdatedAt: Date.now(),
    }))

    pushToast(`Добыто: ${droppedEgg.title} x${amount}`, 'green')
  }

  const handleInsertEggToSpawner = (eggId) => {
    if (!SPAWNERS_BY_ID[eggId]) {
      return
    }

    if ((game.eggInventory[eggId] || 0) < 1) {
      pushToast('Сначала выбей это яйцо в охоте', 'danger')
      return
    }

    const emptySlotIndex = game.spawnerSlots.findIndex((slot) => !slot)
    if (emptySlotIndex < 0) {
      pushToast('Все слоты заняты. Освободи один слот.', 'danger')
      return
    }

    setGame((current) => ({
      ...current,
      eggInventory: {
        ...current.eggInventory,
        [eggId]: (current.eggInventory[eggId] || 0) - 1,
      },
      spawnerSlots: current.spawnerSlots.map((slot, index) =>
        index === emptySlotIndex ? eggId : slot,
      ),
      lastUpdatedAt: Date.now(),
    }))

    pushToast(`Вставлено в спавнер: ${SPAWNERS_BY_ID[eggId].title}`, 'gold')
  }

  const handleEjectSpawnerSlot = (slotIndex) => {
    const eggId = game.spawnerSlots[slotIndex]
    if (!eggId) {
      return
    }

    setGame((current) => ({
      ...current,
      eggInventory: {
        ...current.eggInventory,
        [eggId]: (current.eggInventory[eggId] || 0) + 1,
      },
      spawnerSlots: current.spawnerSlots.map((slot, index) => (index === slotIndex ? null : slot)),
      lastUpdatedAt: Date.now(),
    }))

    pushToast(`Яйцо возвращено в инвентарь`, 'gold')
  }

  const handleUpgradeSpawnerPower = () => {
    const upgradeCost = getSpawnerPowerUpgradeCost(game.spawnerPowerLevel)
    if (upgradeCost === null) {
      pushToast('Спавнер прокачан до максимума', 'gold')
      return
    }

    if (game.balance < upgradeCost) {
      pushToast(`Не хватает ${formatCoins(upgradeCost - game.balance)} золота`, 'danger')
      return
    }

    setGame((current) => ({
      ...current,
      balance: roundToTenth(current.balance - upgradeCost),
      spawnerPowerLevel: Math.min(MAX_SPAWNER_POWER_LEVEL, current.spawnerPowerLevel + 1),
      lastUpdatedAt: Date.now(),
    }))

    pushToast(`Уровень спавнера повышен`, 'green')
  }

  return (
    <main className="app-shell">
      <div className="backdrop-grid" />
      <div className="backdrop-glow backdrop-glow-left" />
      <div className="backdrop-glow backdrop-glow-right" />

      <header className="top-hud panel">
        <div className="hud-brand">
          <div className="hud-brand-title">
            <span className="eyebrow">Mini App • Idle Farming • Minecraft Style</span>
            <strong>Golden Farm</strong>
            <span className="hud-username">{profileName}</span>
          </div>
          <span className="hud-rank">{getRank(game.lifetimeCollected)}</span>
        </div>

        <div className="hud-summary">
          <div className="hud-balance-card" ref={balanceBadgeRef}>
            <img src="/minecraft/gold_ingot.png" alt="Золото" />
            <div>
              <span>Баланс</span>
              <strong>{formatCoins(animatedBalance)}</strong>
            </div>
          </div>

          <div className="hud-stat">
            <span>Готово к сбору</span>
            <strong>{formatCoins(animatedPending)}</strong>
          </div>

          <div className="hud-stat">
            <span>Доход/сек</span>
            <strong>{formatCoins(incomePerSecond)}</strong>
          </div>

          <div className="hud-stat">
            <span>Ферм всего</span>
            <strong>{totalFarms}</strong>
          </div>

          <button
            className="collect-button hud-collect"
            onClick={handleCollect}
            disabled={collectDisabled}
            ref={collectButtonRef}
          >
            <img src="/minecraft/gold_nugget.png" alt="" aria-hidden="true" />
            <span>Собрать</span>
          </button>
        </div>

        <div className="hud-tabs">
          {categoryStats.map((category) => (
            <button
              className={normalizedCategory === category.id ? 'hud-tab is-active' : 'hud-tab'}
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              type="button"
            >
              <img src={category.icon} alt="" aria-hidden="true" />
              <span>{category.title}</span>
              <b>{category.count}</b>
            </button>
          ))}
        </div>
      </header>

      {isAdmin ? (
        <section className="panel admin-panel">
          <div className="admin-panel-head">
            <div>
              <span className="section-kicker">Админка</span>
              <h2>Управление профилем</h2>
            </div>
            <span className="admin-badge">ID {ADMIN_TELEGRAM_ID}</span>
          </div>

          <div className="admin-actions">
            <button className="admin-button admin-button-danger" onClick={handleResetCurrentProfile} type="button">
              Сбросить мой профиль
            </button>
          </div>

          <p className="admin-note">
            Глобально удалить данные всех пользователей из Telegram Mini App нельзя без серверной базы.
            В этом обновлении старые сохранения уже отключены новой версией ключа, а дальше у каждого
            аккаунта свой профиль в Telegram CloudStorage.
          </p>
        </section>
      ) : null}

      {showSystemsSection ? (
        <section
          className={
            showTreasureSystems && showSpawnerSystems
              ? 'systems-grid'
              : 'systems-grid systems-grid-single'
          }
        >
          {showTreasureSystems ? (
            <article className="panel system-panel treasure-panel">
              <div className="section-heading">
                <span className="section-kicker">Добыча</span>
                <h2>Медный сундук шахтёра</h2>
              </div>
              <p className="system-note">
                Раз в {Math.floor(TREASURE_COOLDOWN_SECONDS / 60)} минуты выдаёт золото с шансом джекпота.
              </p>
              <button
                className={canOpenTreasure ? 'treasure-button' : 'treasure-button is-cooldown'}
                onClick={handleOpenTreasure}
                ref={treasureButtonRef}
                type="button"
              >
                <img src="/minecraft/copper_chest.png" alt="" aria-hidden="true" />
                <span>{canOpenTreasure ? 'Открыть сундук' : formatTimer(treasureReadyInSeconds)}</span>
              </button>
              <div className="system-footnote">Открыто сундуков: {game.treasureOpens}</div>
            </article>
          ) : null}

          {showSpawnerSystems ? (
            <article className="panel system-panel spawner-panel">
              <div className="section-heading">
                <span className="section-kicker">Новая механика</span>
                <h2>Спавнерная ферма</h2>
              </div>
              <p className="system-note">
                Выбивай яйца, вставляй их в спавнер и получай пассивный доход от мобов.
              </p>

              <div className="spawner-actions">
                <button
                  className={canHuntEggs ? 'hunt-button' : 'hunt-button is-cooldown'}
                  onClick={handleHuntEggs}
                  ref={eggHuntButtonRef}
                  type="button"
                >
                  <img src="/minecraft/egg_zombie.png" alt="" aria-hidden="true" />
                  <span>{canHuntEggs ? 'Охота на яйца' : formatTimer(eggHuntReadyInSeconds)}</span>
                </button>

                <button className="upgrade-button" onClick={handleUpgradeSpawnerPower} type="button">
                  <img src="/minecraft/gold_ingot.png" alt="" aria-hidden="true" />
                  <span>
                    {getSpawnerPowerUpgradeCost(game.spawnerPowerLevel) === null
                      ? `Ур. спавнера: MAX`
                      : `Ур. ${game.spawnerPowerLevel} -> ${game.spawnerPowerLevel + 1} (${formatCoins(
                          getSpawnerPowerUpgradeCost(game.spawnerPowerLevel),
                        )})`}
                  </span>
                </button>
              </div>

              <div className="spawner-slots">
                {Array.from({ length: SPAWNER_SLOT_COUNT }, (_, index) => {
                  const eggId = game.spawnerSlots[index]
                  const egg = eggId ? SPAWNERS_BY_ID[eggId] : null

                  return (
                    <article className="spawner-slot-card" key={`slot-${index}`}>
                      <span>Слот {index + 1}</span>
                      {egg ? (
                        <>
                          <div className="spawner-slot-main">
                            <img src={egg.icon} alt={egg.title} />
                            <b>{egg.title}</b>
                          </div>
                          <small>+{formatCoins(egg.income * getSpawnerPowerMultiplier(game.spawnerPowerLevel))}/сек</small>
                          <button onClick={() => handleEjectSpawnerSlot(index)} type="button">
                            Извлечь
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="spawner-slot-main spawner-slot-empty">
                            <b>Пусто</b>
                          </div>
                          <small>Вставь яйцо из инвентаря</small>
                        </>
                      )}
                    </article>
                  )
                })}
              </div>

              <div className="egg-inventory">
                {SPAWNER_CATALOG.map((egg) => (
                  <article className="egg-card" key={egg.id} style={{ '--accent': egg.accent }}>
                    <div className="egg-card-top">
                      <img src={egg.icon} alt={egg.title} />
                      <div>
                        <strong>{egg.title}</strong>
                        <span>В рюкзаке: {game.eggInventory[egg.id] || 0}</span>
                      </div>
                    </div>
                    <div className="egg-card-bottom">
                      <small>+{formatCoins(egg.income)}/сек базово</small>
                      <button
                        className={(game.eggInventory[egg.id] || 0) < 1 ? 'is-disabled' : ''}
                        onClick={() => handleInsertEggToSpawner(egg.id)}
                        type="button"
                      >
                        В спавнер
                      </button>
                    </div>
                  </article>
                ))}
              </div>
              <div className="system-footnote">Охот на яйца: {game.eggHunts}</div>
            </article>
          ) : null}
        </section>
      ) : null}

      {showShopPanel ? (
        <section className="panel shop-panel">
          <div className="section-heading">
            <span className="section-kicker">
              {isBoosterCategory ? 'Бустеры' : 'Магазин'}
            </span>
            <h2>
              {isBoosterCategory
                ? 'Зелья и эффекты'
                : CATEGORIES.find((category) => category.id === normalizedCategory)?.title || CATEGORIES[0].title}
            </h2>
          </div>

          {isBoosterCategory ? (
            <div className="boosters-grid">
              {BOOSTER_CATALOG.map((booster) => {
                const activeBoost = activeBoostById[booster.id]
                const isAffordable = booster.cost <= game.balance

                return (
                  <article className="booster-card" key={booster.id} style={{ '--accent': booster.accent }}>
                    <div className="booster-card-top">
                      <div className="booster-icon">
                        <img src={booster.icon} alt={booster.title} />
                      </div>
                      <div>
                        <span className="shop-subtitle">{booster.subtitle}</span>
                        <h3>{booster.title}</h3>
                      </div>
                    </div>

                    <p>{booster.blurb}</p>

                    <div className="booster-metrics">
                      <div>
                        <span>Эффект</span>
                        <strong>{booster.effectLabel}</strong>
                      </div>
                      <div>
                        <span>Длительность</span>
                        <strong>{formatTimer(booster.durationSeconds)}</strong>
                      </div>
                      <div>
                        <span>Цена</span>
                        <strong>{formatCoins(booster.cost)}</strong>
                      </div>
                      <div>
                        <span>Статус</span>
                        <strong>{activeBoost ? `Активен: ${formatTimer(activeBoost.remainingSeconds)}` : 'Не активен'}</strong>
                      </div>
                    </div>

                    <button
                      className={!isAffordable ? 'buy-button is-locked' : 'buy-button'}
                      onClick={(event) => handleBuyBooster(booster, event.currentTarget)}
                    >
                      <img src={booster.icon} alt="" aria-hidden="true" />
                      <span>{activeBoost ? `Продлить за ${formatCoins(booster.cost)}` : `Выпить за ${formatCoins(booster.cost)}`}</span>
                    </button>
                  </article>
                )
              })}
            </div>
          ) : (
            <div className="shop-grid">
              {visibleFarms.map((farm) => {
                const owned = game.farms[farm.id] || 0
                const price = getFarmPrice(farm, owned, boostTotals.priceMultiplier)
                const isMaxed = owned >= MAX_FARMS_PER_TYPE
                const isAffordable = price !== null && price <= game.balance
                const className =
                  celebrationFarm === farm.id ? 'shop-card is-celebrating' : 'shop-card'

                return (
                  <article className={className} key={farm.id} style={{ '--accent': farm.accent }}>
                    <div className="shop-card-top">
                      <div className="shop-icon">
                        <img src={farm.image} alt={farm.title} />
                      </div>
                      <div>
                        <span className="shop-subtitle">{farm.subtitle}</span>
                        <h3>{farm.title}</h3>
                      </div>
                    </div>

                    <p>{farm.blurb}</p>

                    <div className="shop-metrics">
                      <div>
                        <span>Доход</span>
                        <strong>+{formatCoins(farm.income)}/сек</strong>
                      </div>
                      <div>
                        <span>В наличии</span>
                        <strong>
                          {owned}/{MAX_FARMS_PER_TYPE}
                        </strong>
                      </div>
                    </div>

                    <button
                      className={isMaxed || !isAffordable ? 'buy-button is-locked' : 'buy-button'}
                      disabled={isMaxed}
                      onClick={(event) => handleBuyFarm(farm, event.currentTarget)}
                    >
                      <img src="/minecraft/gold_ingot.png" alt="" aria-hidden="true" />
                      <span>
                        {isMaxed
                          ? 'Лимит 10/10'
                          : price === 0
                            ? 'Забрать бесплатно'
                            : `Купить за ${formatCoins(price)}`}
                      </span>
                    </button>
                  </article>
                )
              })}
            </div>
          )}
        </section>
      ) : null}

      <div className="toast-stack">
        {toasts.map((toast) => (
          <div className={`toast toast-${toast.tone}`} key={toast.id}>
            {toast.message}
          </div>
        ))}
      </div>

      <div className="flight-layer" aria-hidden="true">
        {flights.map((flight) => (
          <img
            alt=""
            className={`coin-flight coin-flight-${flight.variant}`}
            key={flight.id}
            src={flight.icon}
            style={{
              '--delay': `${flight.delay}ms`,
              '--duration': `${flight.duration}ms`,
              '--start-x': `${flight.startX}px`,
              '--start-y': `${flight.startY}px`,
              '--end-x': `${flight.endX}px`,
              '--end-y': `${flight.endY}px`,
              '--rotation': `${flight.rotation}deg`,
            }}
          />
        ))}
      </div>
    </main>
  )
}

export default App
