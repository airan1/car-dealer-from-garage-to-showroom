"use client";

import "@fontsource/montserrat-alternates/400.css";
import "@fontsource/montserrat-alternates/500.css";
import "@fontsource/montserrat-alternates/600.css";
import "@fontsource/montserrat-alternates/700.css";
import "@fontsource/montserrat-alternates/800.css";
import "@fontsource/montserrat-alternates/900.css";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import {
  CarFront,
  Building2,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  ClipboardList,
  CircleGauge,
  Cog,
  Gavel,
  Gift,
  Heart,
  House,
  Landmark,
  MoonStar,
  CreditCard,
  MessageCircle,
  PackageX,
  ReceiptText,
  ScanSearch,
  ShieldCheck,
  ShoppingCart,
  SquareParking,
  Store,
  TrendingUp,
  Trophy,
  Truck,
  TimerReset,
  Handshake,
  Hammer,
  BadgePercent,
  Megaphone,
  Volume2,
  VolumeX,
  Warehouse,
  Wrench,
  X,
  type LucideIcon,
} from "lucide-react";
import "./sales.css";
import "./readability.css";
import "./game.css";
import "./glass.css";
import { translateGameText } from "./i18n";

type Screen =
  | "desktop"
  | "auction"
  | "liveAuction"
  | "garage"
  | "parts"
  | "service"
  | "messages"
  | "mail"
  | "bank"
  | "development";
type Part = {
  id: string;
  name: string;
  price: number;
  eta: number;
  quality: "Оригинал" | "Аналог" | "Б/у";
  required: boolean;
  category: string;
  icon: string;
  brand: string;
  description: string;
};
const shopVehicles = [
  { id: "camry", label: "Toyota Camry", years: "2018–2021", factor: 1 },
  { id: "accord", label: "Honda Accord", years: "2018–2021", factor: 1.08 },
  { id: "mustang", label: "Ford Mustang", years: "2018–2020", factor: 1.28 },
  { id: "bmw", label: "BMW 330i", years: "2019–2021", factor: 1.55 },
  { id: "tesla", label: "Tesla Model 3", years: "2019–2021", factor: 1.7 },
  { id: "cayenne", label: "Porsche Cayenne", years: "2018–2020", factor: 2.15 },
  { id: "rav4", label: "Toyota RAV4", years: "2019–2021", factor: 1.16 },
  { id: "lexus", label: "Lexus RX 350", years: "2018–2020", factor: 1.62 },
  { id: "mercedes", label: "Mercedes C300", years: "2019–2021", factor: 1.58 },
  {
    id: "challenger",
    label: "Dodge Challenger",
    years: "2018–2020",
    factor: 1.48,
  },
  { id: "audi", label: "Audi Q5", years: "2019–2021", factor: 1.64 },
  {
    id: "tiguan",
    label: "Volkswagen Tiguan",
    years: "2018–2021",
    factor: 1.22,
  },
  { id: "mazda", label: "Mazda CX-5", years: "2019–2021", factor: 1.19 },
  { id: "subaru", label: "Subaru Forester", years: "2019–2021", factor: 1.24 },
  { id: "altima", label: "Nissan Altima", years: "2019–2021", factor: 1.12 },
  { id: "sonata", label: "Hyundai Sonata", years: "2019–2021", factor: 1.13 },
  { id: "k5", label: "Kia K5", years: "2020–2021", factor: 1.15 },
  { id: "malibu", label: "Chevrolet Malibu", years: "2018–2020", factor: 1.1 },
  { id: "rogue", label: "Nissan Rogue", years: "2019–2021", factor: 1.2 },
  { id: "cherokee", label: "Jeep Grand Cherokee", years: "2018–2020", factor: 1.42 },
  { id: "xc60", label: "Volvo XC60", years: "2019–2021", factor: 1.58 },
  { id: "rdx", label: "Acura RDX", years: "2019–2021", factor: 1.52 },
  { id: "qx50", label: "Infiniti QX50", years: "2019–2021", factor: 1.49 },
  { id: "camaro", label: "Chevrolet Camaro", years: "2018–2020", factor: 1.45 },
];
type PartOption = {
  label: "Оригинал" | "Аналог" | "Б/у";
  priceFactor: number;
  eta: number;
  warranty: string;
  quality: number;
  note: string;
};
type ClientLead = {
  id: string;
  name: string;
  initials: string;
  city: string;
  car: string;
  budget: number;
  deadline: number;
  requirement: string;
  day: number;
  read: boolean;
};
type DealResult = {
  buyer: string;
  vehicleTitle: string;
  vehicleYear: number;
  price: number;
  invested: number;
  profit: number;
  xp: number;
  reputation: number;
  quality: number;
};
type GameEvent = {
  title: string;
  text: string;
  effect: string;
  tone: "good" | "bad" | "neutral";
};
type RoulettePrize = {
  label: string;
  shortLabel: string;
  kind: "money" | "xp" | "reputation";
  value: number;
  color: string;
};
type AchievementMetric =
  | "deals"
  | "vin"
  | "favorites"
  | "reputation"
  | "level"
  | "upgrades"
  | "streak"
  | "garage"
  | "roulette"
  | "balance";
type GameAchievement = {
  id: string;
  title: string;
  description: string;
  metric: AchievementMetric;
  target: number;
  reward: number;
  Icon: LucideIcon;
};

const gameAchievements: GameAchievement[] = [
  { id: "first-deal", title: "Первая прибыль", description: "Завершите первую сделку", metric: "deals", target: 1, reward: 500, Icon: Handshake },
  { id: "dealer-five", title: "Дилер набирает обороты", description: "Завершите 5 сделок", metric: "deals", target: 5, reward: 1500, Icon: TrendingUp },
  { id: "dealer-ten", title: "Король авторынка", description: "Завершите 10 сделок", metric: "deals", target: 10, reward: 3000, Icon: Trophy },
  { id: "vin-expert", title: "Никаких сюрпризов", description: "Проверьте VIN у 5 автомобилей", metric: "vin", target: 5, reward: 750, Icon: ShieldCheck },
  { id: "watchlist", title: "Охотник за лотами", description: "Добавьте 5 машин в избранное", metric: "favorites", target: 5, reward: 500, Icon: Heart },
  { id: "trusted", title: "Надёжный дилер", description: "Получите 10 репутации", metric: "reputation", target: 10, reward: 1000, Icon: BadgePercent },
  { id: "level-five", title: "Растущий бизнес", description: "Достигните 5 уровня компании", metric: "level", target: 5, reward: 1500, Icon: Building2 },
  { id: "upgrade-five", title: "Первые инвестиции", description: "Купите 5 улучшений компании", metric: "upgrades", target: 5, reward: 800, Icon: Wrench },
  { id: "upgrade-fifteen", title: "Серьёзная компания", description: "Купите 15 улучшений компании", metric: "upgrades", target: 15, reward: 2200, Icon: Warehouse },
  { id: "hot-streak", title: "На волне", description: "Проведите 3 прибыльные сделки подряд", metric: "streak", target: 3, reward: 1200, Icon: Gavel },
  { id: "three-cars", title: "Полный гараж", description: "Держите 3 автомобиля одновременно", metric: "garage", target: 3, reward: 1000, Icon: CarFront },
  { id: "lucky-spin", title: "Любимчик удачи", description: "Сыграйте в часовую рулетку", metric: "roulette", target: 1, reward: 300, Icon: Gift },
  { id: "cash-fifty", title: "Финансовая подушка", description: "Накопите $50 000 на счёте", metric: "balance", target: 50000, reward: 2500, Icon: Landmark },
];

const roulettePrizes: RoulettePrize[] = [
  { label: "$250 на счёт", shortLabel: "$250", kind: "money", value: 250, color: "#1c79d6" },
  { label: "+40 XP", shortLabel: "40 XP", kind: "xp", value: 40, color: "#7449c7" },
  { label: "$500 на счёт", shortLabel: "$500", kind: "money", value: 500, color: "#198d6a" },
  { label: "+1 репутация", shortLabel: "+1 ★", kind: "reputation", value: 1, color: "#be7b18" },
  { label: "$750 на счёт", shortLabel: "$750", kind: "money", value: 750, color: "#1761ad" },
  { label: "Джекпот $1 000", shortLabel: "$1K", kind: "money", value: 1000, color: "#ae3f57" },
];

type TutorialStage =
  | "contract"
  | "auction"
  | "bidding"
  | "delivery"
  | "shipping"
  | "diagnosis"
  | "repair"
  | "sale"
  | "finish";

const tutorialSteps: Record<
  TutorialStage,
  {
    eyebrow: string;
    title: string;
    text: string;
    action: string;
    target: Screen;
  }
> = {
  contract: {
    eyebrow: "ШАГ 1 · ПЕРВЫЙ КЛИЕНТ",
    title: "Алексей уже ждёт ответа",
    text: "Открой заказ, проверь бюджет и подтверди условия. У клиентов нет дедлайнов и штрафов за ожидание — время важно только для доставки и ремонта.",
    action: "Открыть заказ",
    target: "messages",
  },
  auction: {
    eyebrow: "ШАГ 2 · ПОИСК АВТОМОБИЛЯ",
    title: "Найдём подходящую Camry",
    text: "На аукционе сравни цену, пробег и риск. Для первого клиента нужна Toyota Camry 2018–2020 без серьёзного удара.",
    action: "Перейти к лотам",
    target: "auction",
  },
  bidding: {
    eyebrow: "ШАГ 3 · ЖИВЫЕ ТОРГИ",
    title: "Не спеши со ставкой",
    text: "Базовый вход стоит $300. Дождись пятисекундного отсчёта и повышай ставку аккуратно. Если уйдёшь со страницы, лот будет потерян.",
    action: "Продолжить торги",
    target: "liveAuction",
  },
  delivery: {
    eyebrow: "ШАГ 4 · ДОСТАВКА",
    title: "Выбери скорость доставки",
    text: "Экспресс дороже, зато машина приедет сразу. Стандартная доставка дешевле и займёт около 10 минут реального времени.",
    action: "Оформить автомобиль",
    target: "garage",
  },
  shipping: {
    eyebrow: "ШАГ 5 · МАШИНА В ПУТИ",
    title: "Время идёт само",
    text: "Пока автомобиль едет, можешь заниматься другими задачами или закрыть игру. Таймер продолжит работу автоматически, а реклама сократит ожидание на 30 минут.",
    action: "Посмотреть автомобиль",
    target: "garage",
  },
  diagnosis: {
    eyebrow: "ШАГ 6 · ДИАГНОСТИКА",
    title: "Сначала узнаем все дефекты",
    text: "Диагностика покажет обязательные детали и стоимость работ. Без неё ремонт начинать нельзя.",
    action: "Открыть автосервис",
    target: "service",
  },
  repair: {
    eyebrow: "ШАГ 7 · РЕМОНТ",
    title: "Собери машину в автосервисе",
    text: "Выбери качество обязательных деталей прямо в заказ-наряде, забери их и запусти ремонт. Отдельного автомагазина в игре нет.",
    action: "Продолжить ремонт",
    target: "service",
  },
  sale: {
    eyebrow: "ШАГ 8 · ПРОДАЖА",
    title: "Пора вернуть вложения",
    text: "Клиент уже может осмотреть машину. Открой заказ, оцени прибыль и закрой свою первую сделку.",
    action: "Перейти к клиенту",
    target: "messages",
  },
  finish: {
    eyebrow: "ОБУЧЕНИЕ ЗАВЕРШЕНО",
    title: "Теперь ты настоящий дилер",
    text: "Дальше выбирай контракты сам, развивай гараж и следи за деньгами. Я появлюсь снова, когда будет действительно важный совет.",
    action: "Начать свободную игру",
    target: "desktop",
  },
};

const tutorialStageOrder: TutorialStage[] = [
  "contract",
  "auction",
  "bidding",
  "delivery",
  "shipping",
  "diagnosis",
  "repair",
  "sale",
  "finish",
];

type RewardedVideoCallbacks = {
  onOpen?: () => void;
  onRewarded: () => void;
  onClose?: (wasShown: boolean) => void;
  onError?: (error: unknown) => void;
};

type YandexPlayer = {
  getData: (keys?: string[]) => Promise<Record<string, unknown>>;
  setData: (data: Record<string, unknown>, flush?: boolean) => Promise<void>;
};

type YandexGamesSdk = {
  adv: {
    showRewardedVideo: (options: {
      callbacks: RewardedVideoCallbacks;
    }) => void;
  };
  features?: {
    LoadingAPI?: { ready: () => void };
    GameplayAPI?: { start: () => void; stop: () => void };
  };
  environment?: { i18n?: { lang?: string } };
  getPlayer?: (options?: { scopes?: boolean }) => Promise<YandexPlayer>;
  on?: (event: "game_api_pause" | "game_api_resume", callback: () => void) => void;
  off?: (event: "game_api_pause" | "game_api_resume", callback: () => void) => void;
};

declare global {
  interface Window {
    YaGames?: { init: () => Promise<YandexGamesSdk> };
    ysdk?: YandexGamesSdk;
    __yandexSdkPromise?: Promise<YandexGamesSdk | null>;
  }
}

let yandexSdkPromise: Promise<YandexGamesSdk | null> | null = null;

function loadYandexGamesSdk() {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (window.ysdk) return Promise.resolve(window.ysdk);
  if (window.__yandexSdkPromise) {
    yandexSdkPromise = window.__yandexSdkPromise;
    return yandexSdkPromise;
  }
  if (yandexSdkPromise) return yandexSdkPromise;

  yandexSdkPromise = new Promise<YandexGamesSdk | null>((resolve) => {
    const initialize = () => {
      if (!window.YaGames) {
        resolve(null);
        return;
      }
      window.__yandexSdkPromise = window.YaGames
        .init()
        .then((sdk) => {
          window.ysdk = sdk;
          return sdk;
        })
        .catch(() => null);
      window.__yandexSdkPromise.then(resolve);
    };

    if (window.YaGames) {
      initialize();
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-yandex-games-sdk="true"]',
    );
    if (existing) {
      existing.addEventListener("load", initialize, { once: true });
      existing.addEventListener("error", () => resolve(null), { once: true });
      return;
    }

    const script = document.createElement("script");
    // Yandex proxies this relative URL for games uploaded as an archive.
    script.src = "/sdk.js";
    script.async = true;
    script.dataset.yandexGamesSdk = "true";
    script.addEventListener("load", initialize, { once: true });
    script.addEventListener("error", () => resolve(null), { once: true });
    document.head.appendChild(script);
  });

  return yandexSdkPromise;
}

type ShippingPlan = "economy" | "standard" | "express";
type SupplierId = "express" | "standard" | "economy";
type UpgradeBranchId = "garage" | "auction" | "parts" | "service" | "marketing";
type UpgradeStep = 1 | 2 | 3 | 4 | 5;
type CompanyUpgradeId = `${UpgradeBranchId}-step-${UpgradeStep}`;
type CompanyUpgrade = {
  id: CompanyUpgradeId;
  branch: UpgradeBranchId;
  step: UpgradeStep;
  name: string;
  description: string;
  effect: string;
  cost: number;
  level: number;
  Icon: LucideIcon;
};

const upgradeBranches: {
  id: UpgradeBranchId;
  title: string;
  description: string;
  Icon: LucideIcon;
  steps: Omit<CompanyUpgrade, "branch" | "Icon">[];
}[] = [
  {
    id: "garage",
    title: "Гараж и стоянка",
    description: "Больше автомобилей одновременно в работе.",
    Icon: Warehouse,
    steps: [
      { id: "garage-step-1", step: 1, name: "Второй подъёмник", description: "Место для ещё одного проекта.", effect: "+1 слот", cost: 6000, level: 1 },
      { id: "garage-step-2", step: 2, name: "Двор под хранение", description: "Безопасная площадка рядом с гаражом.", effect: "+1 слот", cost: 14000, level: 2 },
      { id: "garage-step-3", step: 3, name: "Крытая стоянка", description: "Защищённое хранение машин клиентов.", effect: "+1 слот", cost: 26000, level: 4 },
      { id: "garage-step-4", step: 4, name: "Второй бокс", description: "Отдельная зона приёмки автомобилей.", effect: "+1 слот", cost: 42000, level: 6 },
      { id: "garage-step-5", step: 5, name: "Дилерский комплекс", description: "Полноценная площадка большого дилера.", effect: "+1 слот", cost: 65000, level: 8 },
    ],
  },
  {
    id: "auction",
    title: "Аукцион и брокер",
    description: "Снижайте стоимость участия в торгах.",
    Icon: Gavel,
    steps: [
      { id: "auction-step-1", step: 1, name: "Знакомый брокер", description: "Первая скидка на вход в торги.", effect: "Вход −$30", cost: 5000, level: 1 },
      { id: "auction-step-2", step: 2, name: "Постоянный участник", description: "Аукцион снижает сервисный сбор.", effect: "Вход −$60", cost: 12000, level: 2 },
      { id: "auction-step-3", step: 3, name: "Дилерская лицензия", description: "Доступ к профессиональному тарифу.", effect: "Вход −$90", cost: 22000, level: 4 },
      { id: "auction-step-4", step: 4, name: "VIP-аккаунт", description: "Приоритетная регистрация на торги.", effect: "Вход −$120", cost: 36000, level: 6 },
      { id: "auction-step-5", step: 5, name: "Партнёр аукциона", description: "Максимальная постоянная скидка.", effect: "Вход −$150", cost: 55000, level: 8 },
    ],
  },
  {
    id: "parts",
    title: "Поставщики деталей",
    description: "Оптовые цены на каждую следующую машину.",
    Icon: ShoppingCart,
    steps: [
      { id: "parts-step-1", step: 1, name: "Скидочная карта", description: "Базовая скидка у поставщиков.", effect: "Детали −8%", cost: 6000, level: 1 },
      { id: "parts-step-2", step: 2, name: "Клуб поставщиков", description: "Постоянные заказы дают лучшую цену.", effect: "Детали −16%", cost: 14000, level: 3 },
      { id: "parts-step-3", step: 3, name: "Оптовый договор", description: "Закупки напрямую со склада.", effect: "Детали −24%", cost: 26000, level: 4 },
      { id: "parts-step-4", step: 4, name: "Собственный склад", description: "Меньше посредников и наценок.", effect: "Детали −32%", cost: 42000, level: 6 },
      { id: "parts-step-5", step: 5, name: "Импорт деталей", description: "Лучшие цены для крупной компании.", effect: "Детали −40%", cost: 65000, level: 8 },
    ],
  },
  {
    id: "service",
    title: "Мастерская",
    description: "Снижайте стоимость работ и переделок.",
    Icon: Wrench,
    steps: [
      { id: "service-step-1", step: 1, name: "Новый инструмент", description: "Работы выполняются быстрее и точнее.", effect: "Работы −8% · ремонт −4 мин", cost: 8000, level: 1 },
      { id: "service-step-2", step: 2, name: "Опытный мастер", description: "Меньше лишних часов в заказ-наряде.", effect: "Работы −16% · ремонт −8 мин", cost: 18000, level: 3 },
      { id: "service-step-3", step: 3, name: "Диагностический стенд", description: "Точнее смета и меньше переделок.", effect: "Работы −24% · ремонт −12 мин", cost: 32000, level: 5 },
      { id: "service-step-4", step: 4, name: "Кузовной цех", description: "Сложный ремонт внутри компании.", effect: "Работы −32% · ремонт −16 мин", cost: 50000, level: 7 },
      { id: "service-step-5", step: 5, name: "Сервис премиум-класса", description: "Максимальная эффективность ремонта.", effect: "Работы −40% · ремонт −20 мин", cost: 75000, level: 9 },
    ],
  },
  {
    id: "marketing",
    title: "Реклама и продажи",
    description: "Больше бонусов и быстрее свободная продажа.",
    Icon: Megaphone,
    steps: [
      { id: "marketing-step-1", step: 1, name: "Объявления в городе", description: "Первые постоянные рекламные партнёры.", effect: "Реклама +$100", cost: 7000, level: 1 },
      { id: "marketing-step-2", step: 2, name: "Автомобильный блог", description: "Больше покупателей видит машины.", effect: "Реклама +$250", cost: 16000, level: 3 },
      { id: "marketing-step-3", step: 3, name: "Медиа-команда", description: "Профессиональные объявления и ролики.", effect: "Реклама +$450", cost: 30000, level: 5 },
      { id: "marketing-step-4", step: 4, name: "Региональная сеть", description: "Покупатели из соседних городов.", effect: "Реклама +$700", cost: 48000, level: 7 },
      { id: "marketing-step-5", step: 5, name: "Национальный бренд", description: "Максимальный доход партнёрской рекламы.", effect: "Реклама +$1000", cost: 70000, level: 9 },
    ],
  },
];

const companyUpgradeCatalog: CompanyUpgrade[] = upgradeBranches.flatMap((branch) =>
  branch.steps.map((upgrade) => ({ ...upgrade, branch: branch.id, Icon: branch.Icon })),
);

const shippingPlans = {
  economy: {
    label: "Экономичная",
    price: 1800,
    days: 2,
    note: "Дешевле, прибытие примерно через 20 минут",
  },
  standard: {
    label: "Стандартная",
    price: 2800,
    days: 1,
    note: "Машина будет в гараже примерно через 10 минут",
  },
  express: {
    label: "Срочная",
    price: 4500,
    days: 0,
    note: "Машина сразу появится в гараже",
  },
};

const suppliers = {
  express: {
    label: "Express Parts",
    factor: 1.28,
    eta: 1,
    reliability: 98,
    note: "Самая быстрая доставка",
  },
  standard: {
    label: "Standard Auto",
    factor: 1,
    eta: 1,
    reliability: 92,
    note: "Баланс цены и срока",
  },
  economy: {
    label: "Economy Warehouse",
    factor: 0.78,
    eta: 2,
    reliability: 78,
    note: "Дешевле, возможна задержка на 1–2 дня",
  },
};

const clientPool = [
  {
    name: "Ирина Соколова",
    initials: "ИС",
    city: "Казань",
    car: "Honda Accord 2018–2021",
    budget: 20500,
    deadline: 12,
    requirement: "Только целые подушки безопасности",
  },
  {
    name: "Максим Орлов",
    initials: "МО",
    city: "Москва",
    car: "Ford Mustang EcoBoost",
    budget: 27000,
    deadline: 18,
    requirement: "Небольшой пробег, цвет не важен",
  },
  {
    name: "Денис Волков",
    initials: "ДВ",
    city: "Минск",
    car: "BMW 330i 2019–2021",
    budget: 31500,
    deadline: 15,
    requirement: "Без затопления и серьёзной геометрии",
  },
  {
    name: "Анна Миронова",
    initials: "АМ",
    city: "Санкт-Петербург",
    car: "Tesla Model 3",
    budget: 30000,
    deadline: 10,
    requirement: "Батарея не ниже 90%, без ошибок зарядки",
  },
  {
    name: "Роман Беляев",
    initials: "РБ",
    city: "Сочи",
    car: "Porsche Cayenne",
    budget: 48000,
    deadline: 25,
    requirement: "Богатая комплектация и прозрачная история",
  },
  {
    name: "Олег Крылов",
    initials: "ОК",
    city: "Самара",
    car: "Toyota RAV4 2019–2021",
    budget: 28500,
    deadline: 16,
    requirement: "Полный привод, без повреждений силовых элементов",
  },
  {
    name: "Мария Левина",
    initials: "МЛ",
    city: "Москва",
    car: "Lexus RX 350 2018–2020",
    budget: 39000,
    deadline: 20,
    requirement: "Светлый салон и прозрачная сервисная история",
  },
  {
    name: "Артур Громов",
    initials: "АГ",
    city: "Тула",
    car: "Mercedes-Benz C300 2019–2021",
    budget: 35000,
    deadline: 14,
    requirement: "AMG-пакет желателен, без затопления",
  },
  {
    name: "Виктор Савин",
    initials: "ВС",
    city: "Краснодар",
    car: "Dodge Challenger 2018–2020",
    budget: 38000,
    deadline: 22,
    requirement: "Двигатель V8, кузов без серьёзной геометрии",
  },
  {
    name: "Егор Беляев",
    initials: "ЕБ",
    city: "Москва",
    car: "Audi Q5 2019–2021",
    budget: 39500,
    deadline: 18,
    requirement: "Quattro, без повреждений коробки и силовых элементов",
  },
  {
    name: "Наталья Романова",
    initials: "НР",
    city: "Воронеж",
    car: "Volkswagen Tiguan 2018–2021",
    budget: 27500,
    deadline: 15,
    requirement: "Полный привод и исправная система безопасности",
  },
  {
    name: "Павел Котов",
    initials: "ПК",
    city: "Ростов-на-Дону",
    car: "Mazda CX-5 2019–2021",
    budget: 29000,
    deadline: 14,
    requirement: "Без затопления, желательно красный кузов",
  },
  {
    name: "Алина Морозова",
    initials: "АМ",
    city: "Пермь",
    car: "Subaru Forester 2019–2021",
    budget: 30500,
    deadline: 19,
    requirement: "Полный привод, ровная геометрия и живые подушки",
  },
  {
    name: "Сергей Власов",
    initials: "СВ",
    city: "Москва",
    car: "Nissan Altima 2019–2021",
    budget: 24500,
    deadline: 13,
    requirement: "Без затопления и с целыми подушками безопасности",
  },
  {
    name: "Кирилл Фомин",
    initials: "КФ",
    city: "Казань",
    car: "Hyundai Sonata 2019–2021",
    budget: 27000,
    deadline: 16,
    requirement: "Комплектация N Line желательна, без сильного удара",
  },
  {
    name: "Дарья Белова",
    initials: "ДБ",
    city: "Сочи",
    car: "Kia K5 2020–2021",
    budget: 28500,
    deadline: 14,
    requirement: "Пробег до 80 000 км и ровная геометрия",
  },
  {
    name: "Антон Жуков",
    initials: "АЖ",
    city: "Самара",
    car: "Chevrolet Malibu 2018–2020",
    budget: 23500,
    deadline: 15,
    requirement: "Главное — недорогой ремонт и чистый салон",
  },
  {
    name: "Ольга Федина",
    initials: "ОФ",
    city: "Воронеж",
    car: "Nissan Rogue 2019–2021",
    budget: 29000,
    deadline: 17,
    requirement: "Без повреждений коробки и силовых элементов",
  },
  {
    name: "Михаил Корнеев",
    initials: "МК",
    city: "Краснодар",
    car: "Jeep Grand Cherokee 2018–2020",
    budget: 39000,
    deadline: 20,
    requirement: "Полный привод и прозрачная сервисная история",
  },
  {
    name: "Елена Грачева",
    initials: "ЕГ",
    city: "Санкт-Петербург",
    car: "Volvo XC60 2019–2021",
    budget: 42500,
    deadline: 18,
    requirement: "Все системы безопасности должны работать",
  },
  {
    name: "Илья Зорин",
    initials: "ИЗ",
    city: "Москва",
    car: "Acura RDX 2019–2021",
    budget: 41000,
    deadline: 17,
    requirement: "Комплектация Technology и без затопления",
  },
  {
    name: "Вера Лапина",
    initials: "ВЛ",
    city: "Тула",
    car: "Infiniti QX50 2019–2021",
    budget: 40500,
    deadline: 19,
    requirement: "Светлый салон, небольшой пробег и целые подушки",
  },
  {
    name: "Дмитрий Серов",
    initials: "ДС",
    city: "Ростов-на-Дону",
    car: "Chevrolet Camaro 2018–2020",
    budget: 38500,
    deadline: 21,
    requirement: "Кузов без серьёзной геометрии, цвет не важен",
  },
];

const alexContract: ClientLead = {
  id: "001",
  name: "Алексей Ковалёв",
  initials: "АК",
  city: "Москва",
  car: "Toyota Camry 2018–2020",
  budget: 18000,
  deadline: 14,
  requirement: "До 90 000 км, без сильного удара",
  day: 1,
  read: true,
};

const baseLots = [
  {
    id: 1,
    unlockDay: 1,
    year: 2018,
    title: "Toyota Camry SE",
    damage: "Удар сзади слева",
    bid: 4200,
    mileage: "71 240 км",
    docs: "Salvage",
    risk: "Низкий",
    marker: "green",
    x: 25,
    y: 62,
    image: "cars/camry-silver-rear.jpg",
  },
  {
    id: 2,
    unlockDay: 1,
    year: 2019,
    title: "Toyota Camry XSE",
    damage: "Удар спереди слева",
    bid: 3900,
    mileage: "48 100 км",
    docs: "Salvage",
    risk: "Средний",
    marker: "yellow",
    x: 17,
    y: 59,
    image: "cars/camry-blue-front.jpg",
  },
  {
    id: 3,
    unlockDay: 1,
    year: 2020,
    title: "Toyota Camry LE",
    damage: "Следы затопления",
    bid: 3000,
    mileage: "32 900 км",
    docs: "Flood",
    risk: "Высокий",
    marker: "red",
    x: 53,
    y: 73,
    image: "cars/camry-black-side.jpg",
  },
  {
    id: 4,
    unlockDay: 3,
    year: 2020,
    title: "Toyota Camry Hybrid",
    damage: "Задний бампер",
    bid: 4800,
    mileage: "55 300 км",
    docs: "Salvage",
    risk: "Средний",
    marker: "yellow",
    x: 82,
    y: 58,
    image: "cars/camry-red-rear.jpg",
  },
  {
    id: 5,
    unlockDay: 5,
    year: 2021,
    title: "Toyota Camry LE",
    damage: "Переднее правое крыло",
    bid: 5200,
    mileage: "39 850 км",
    docs: "Salvage",
    risk: "Низкий",
    marker: "green",
    x: 80,
    y: 58,
    image: "cars/camry-gray-front.jpg",
  },
  {
    id: 6,
    unlockDay: 7,
    year: 2019,
    title: "Toyota Camry SE",
    damage: "Правая дверь",
    bid: 3600,
    mileage: "83 110 км",
    docs: "Salvage",
    risk: "Средний",
    marker: "yellow",
    x: 70,
    y: 53,
    image: "cars/camry-clean.jpg",
  },
  {
    id: 7,
    unlockDay: 1,
    year: 2019,
    title: "Honda Accord Sport",
    damage: "Передний бампер",
    bid: 4100,
    mileage: "68 420 км",
    docs: "Salvage",
    risk: "Низкий",
    marker: "green",
    x: 20,
    y: 61,
    image: "cars/accord.jpg",
  },
  {
    id: 8,
    unlockDay: 2,
    year: 2018,
    title: "Ford Mustang EcoBoost",
    damage: "Заднее правое крыло",
    bid: 6200,
    mileage: "74 900 км",
    docs: "Salvage",
    risk: "Средний",
    marker: "yellow",
    x: 77,
    y: 55,
    image: "cars/mustang.jpg",
  },
  {
    id: 9,
    unlockDay: 4,
    year: 2020,
    title: "BMW 330i",
    damage: "Передняя подвеска",
    bid: 5500,
    mileage: "59 110 км",
    docs: "Salvage",
    risk: "Высокий",
    marker: "red",
    x: 71,
    y: 69,
    image: "cars/bmw-330i.jpg",
  },
  {
    id: 10,
    unlockDay: 6,
    year: 2020,
    title: "Tesla Model 3",
    damage: "Порог и батарейный щит",
    bid: 6500,
    mileage: "61 500 км",
    docs: "Salvage",
    risk: "Высокий",
    marker: "red",
    x: 58,
    y: 75,
    image: "cars/model-3.jpg",
  },
  {
    id: 11,
    unlockDay: 9,
    year: 2019,
    title: "Porsche Cayenne",
    damage: "Задняя дверь и крыло",
    bid: 9500,
    mileage: "79 300 км",
    docs: "Salvage",
    risk: "Высокий",
    marker: "red",
    x: 35,
    y: 52,
    image: "cars/cayenne.jpg",
  },
  {
    id: 12,
    unlockDay: 2,
    year: 2020,
    title: "Toyota RAV4 XLE",
    damage: "Передняя левая дверь",
    bid: 5300,
    mileage: "64 800 км",
    docs: "Salvage",
    risk: "Низкий",
    marker: "green",
    x: 58,
    y: 52,
    image: "cars/rav4.jpg",
  },
  {
    id: 13,
    unlockDay: 3,
    year: 2019,
    title: "Lexus RX 350",
    damage: "Удар сзади справа",
    bid: 7000,
    mileage: "72 450 км",
    docs: "Salvage",
    risk: "Средний",
    marker: "yellow",
    x: 76,
    y: 58,
    image: "cars/lexus-rx.jpg",
  },
  {
    id: 14,
    unlockDay: 5,
    year: 2020,
    title: "Mercedes-Benz C300",
    damage: "Передняя подвеска",
    bid: 6100,
    mileage: "58 900 км",
    docs: "Salvage",
    risk: "Высокий",
    marker: "red",
    x: 29,
    y: 70,
    image: "cars/mercedes-c300.jpg",
  },
  {
    id: 15,
    unlockDay: 7,
    year: 2019,
    title: "Dodge Challenger R/T",
    damage: "Заднее левое крыло",
    bid: 7500,
    mileage: "69 200 км",
    docs: "Salvage",
    risk: "Средний",
    marker: "yellow",
    x: 72,
    y: 54,
    image: "cars/challenger.jpg",
  },
  {
    id: 16,
    unlockDay: 4,
    year: 2019,
    title: "Toyota RAV4 LE",
    damage: "Крышка багажника",
    bid: 4600,
    mileage: "82 300 км",
    docs: "Salvage",
    risk: "Средний",
    marker: "yellow",
    x: 71,
    y: 48,
    image: "cars/rav4-blue-rear.jpg",
  },
  {
    id: 17,
    unlockDay: 8,
    year: 2021,
    title: "Toyota RAV4 XLE",
    damage: "Передний правый угол",
    bid: 6500,
    mileage: "41 600 км",
    docs: "Clean",
    risk: "Низкий",
    marker: "green",
    x: 79,
    y: 59,
    image: "cars/rav4-white-side.jpg",
  },
  {
    id: 18,
    unlockDay: 5,
    year: 2018,
    title: "Lexus RX 350",
    damage: "Задний бампер",
    bid: 6500,
    mileage: "91 700 км",
    docs: "Salvage",
    risk: "Средний",
    marker: "yellow",
    x: 25,
    y: 58,
    image: "cars/lexus-rx-blue-rear.jpg",
  },
  {
    id: 19,
    unlockDay: 9,
    year: 2020,
    title: "Lexus RX 350 F Sport",
    damage: "Следы затопления",
    bid: 7800,
    mileage: "53 200 км",
    docs: "Flood",
    risk: "Высокий",
    marker: "red",
    x: 55,
    y: 70,
    image: "cars/lexus-rx-gray-front.jpg",
  },
  {
    id: 20,
    unlockDay: 6,
    year: 2019,
    title: "Mercedes-Benz C300",
    damage: "Задняя левая четверть",
    bid: 5800,
    mileage: "76 400 км",
    docs: "Salvage",
    risk: "Средний",
    marker: "yellow",
    x: 27,
    y: 55,
    image: "cars/mercedes-c300-black-rear.jpg",
  },
  {
    id: 21,
    unlockDay: 10,
    year: 2021,
    title: "Mercedes-Benz C300 AMG",
    damage: "Удар спереди",
    bid: 7500,
    mileage: "38 900 км",
    docs: "Salvage",
    risk: "Высокий",
    marker: "red",
    x: 75,
    y: 62,
    image: "cars/mercedes-c300-blue-front.jpg",
  },
  {
    id: 22,
    unlockDay: 7,
    year: 2018,
    title: "Dodge Challenger SXT",
    damage: "Задняя панель",
    bid: 6000,
    mileage: "88 100 км",
    docs: "Salvage",
    risk: "Средний",
    marker: "yellow",
    x: 23,
    y: 53,
    image: "cars/challenger-black-rear.jpg",
  },
  {
    id: 23,
    unlockDay: 11,
    year: 2020,
    title: "Dodge Challenger R/T",
    damage: "Передняя подвеска",
    bid: 8200,
    mileage: "44 700 км",
    docs: "Salvage",
    risk: "Высокий",
    marker: "red",
    x: 72,
    y: 70,
    image: "cars/challenger-white-front.jpg",
  },
  {
    id: 24,
    unlockDay: 3,
    year: 2020,
    title: "Audi Q5 Premium Quattro",
    damage: "Передний левый угол",
    bid: 5600,
    mileage: "61 800 км",
    docs: "Salvage",
    risk: "Высокий",
    marker: "red",
    x: 28,
    y: 64,
    image: "cars/audi-q5-gray-front.jpg",
  },
  {
    id: 25,
    unlockDay: 4,
    year: 2019,
    title: "Volkswagen Tiguan SE",
    damage: "Заднее правое крыло",
    bid: 4300,
    mileage: "78 450 км",
    docs: "Salvage",
    risk: "Средний",
    marker: "yellow",
    x: 69,
    y: 53,
    image: "cars/tiguan-blue-rear.jpg",
  },
  {
    id: 26,
    unlockDay: 5,
    year: 2021,
    title: "Mazda CX-5 Touring",
    damage: "Бампер и край капота",
    bid: 5200,
    mileage: "43 900 км",
    docs: "Salvage",
    risk: "Низкий",
    marker: "green",
    x: 32,
    y: 66,
    image: "cars/mazda-cx5-red-front.jpg",
  },
  {
    id: 27,
    unlockDay: 6,
    year: 2020,
    title: "Subaru Forester Premium",
    damage: "Левое крыло и подвеска",
    bid: 4800,
    mileage: "67 200 км",
    docs: "Salvage",
    risk: "Средний",
    marker: "yellow",
    x: 25,
    y: 59,
    image: "cars/subaru-forester-white-front.jpg",
  },
  {
    id: 28, unlockDay: 2, year: 2020, title: "Honda Accord EX-L",
    damage: "Задняя левая дверь", bid: 4400, mileage: "57 300 км",
    docs: "Salvage", risk: "Средний", marker: "yellow", x: 72, y: 54,
    image: "cars/accord.jpg",
  },
  {
    id: 29, unlockDay: 4, year: 2019, title: "Ford Mustang GT",
    damage: "Передний правый угол", bid: 6900, mileage: "81 600 км",
    docs: "Salvage", risk: "Высокий", marker: "red", x: 74, y: 65,
    image: "cars/mustang.jpg",
  },
  {
    id: 30, unlockDay: 5, year: 2019, title: "BMW 330i xDrive",
    damage: "Задний бампер", bid: 5900, mileage: "72 800 км",
    docs: "Salvage", risk: "Средний", marker: "yellow", x: 76, y: 57,
    image: "cars/bmw-330i.jpg",
  },
  {
    id: 31, unlockDay: 7, year: 2021, title: "Tesla Model 3 Long Range",
    damage: "Передняя левая дверь", bid: 7200, mileage: "49 400 км",
    docs: "Salvage", risk: "Средний", marker: "yellow", x: 31, y: 55,
    image: "cars/model-3.jpg",
  },
  {
    id: 32, unlockDay: 10, year: 2020, title: "Porsche Cayenne S",
    damage: "Переднее левое крыло", bid: 10800, mileage: "66 100 км",
    docs: "Salvage", risk: "Высокий", marker: "red", x: 29, y: 60,
    image: "cars/cayenne.jpg",
  },
  {
    id: 33, unlockDay: 4, year: 2019, title: "Audi Q5 Premium Plus",
    damage: "Удар сзади", bid: 5100, mileage: "88 900 км",
    docs: "Salvage", risk: "Средний", marker: "yellow", x: 76, y: 57,
    image: "cars/audi-q5-gray-front.jpg",
  },
  {
    id: 34, unlockDay: 6, year: 2020, title: "Volkswagen Tiguan SEL",
    damage: "Передний бампер", bid: 4700, mileage: "63 500 км",
    docs: "Salvage", risk: "Низкий", marker: "green", x: 25, y: 63,
    image: "cars/tiguan-blue-rear.jpg",
  },
  {
    id: 35, unlockDay: 7, year: 2020, title: "Mazda CX-5 Grand Touring",
    damage: "Задняя дверь", bid: 5000, mileage: "70 200 км",
    docs: "Salvage", risk: "Средний", marker: "yellow", x: 72, y: 54,
    image: "cars/mazda-cx5-red-front.jpg",
  },
  {
    id: 36, unlockDay: 8, year: 2021, title: "Subaru Forester Limited",
    damage: "Задний правый угол", bid: 5400, mileage: "52 700 км",
    docs: "Salvage", risk: "Низкий", marker: "green", x: 75, y: 58,
    image: "cars/subaru-forester-white-front.jpg",
  },
  {
    id: 37,
    unlockDay: 3,
    year: 2020,
    title: "Honda Accord Touring",
    damage: "Передняя левая дверь",
    bid: 4750,
    mileage: "54 800 км",
    docs: "Salvage",
    risk: "Низкий",
    marker: "green",
    x: 27,
    y: 55,
    image: "cars/accord.jpg",
  },
  {
    id: 38,
    unlockDay: 5,
    year: 2020,
    title: "Ford Mustang Premium",
    damage: "Задняя панель и фонарь",
    bid: 6450,
    mileage: "62 300 км",
    docs: "Salvage",
    risk: "Средний",
    marker: "yellow",
    x: 77,
    y: 51,
    image: "cars/mustang.jpg",
  },
  {
    id: 39,
    unlockDay: 6,
    year: 2021,
    title: "BMW 330i M Sport",
    damage: "Удар спереди справа",
    bid: 6750,
    mileage: "46 900 км",
    docs: "Salvage",
    risk: "Высокий",
    marker: "red",
    x: 73,
    y: 64,
    image: "cars/bmw-330i.jpg",
  },
  {
    id: 40,
    unlockDay: 8,
    year: 2020,
    title: "Audi Q5 S line Quattro",
    damage: "Задняя левая четверть",
    bid: 6250,
    mileage: "58 600 км",
    docs: "Salvage",
    risk: "Средний",
    marker: "yellow",
    x: 24,
    y: 55,
    image: "cars/audi-q5-gray-front.jpg",
  },
  {
    id: 41,
    unlockDay: 11,
    year: 2021,
    title: "Toyota RAV4 Adventure",
    damage: "Передняя подвеска и крыло",
    bid: 6900,
    mileage: "37 400 км",
    docs: "Salvage",
    risk: "Высокий",
    marker: "red",
    x: 29,
    y: 67,
    image: "cars/rav4-white-side.jpg",
  },
  {
    id: 42,
    unlockDay: 1,
    year: 2020,
    title: "Nissan Altima SR",
    damage: "Передний левый угол",
    bid: 3950,
    mileage: "76 200 км",
    docs: "Salvage",
    risk: "Низкий",
    marker: "green",
    x: 26,
    y: 63,
    image: "cars/nissan-altima-sr.webp",
  },
  {
    id: 43,
    unlockDay: 2,
    year: 2021,
    title: "Hyundai Sonata N Line",
    damage: "Удар сзади слева",
    bid: 4550,
    mileage: "51 600 км",
    docs: "Salvage",
    risk: "Низкий",
    marker: "green",
    x: 25,
    y: 56,
    image: "cars/hyundai-sonata-n-line.webp",
  },
  {
    id: 44,
    unlockDay: 3,
    year: 2021,
    title: "Kia K5 GT-Line",
    damage: "Удар спереди справа",
    bid: 4700,
    mileage: "47 300 км",
    docs: "Salvage",
    risk: "Высокий",
    marker: "red",
    x: 76,
    y: 64,
    image: "cars/kia-k5-gt-line.webp",
  },
  {
    id: 45,
    unlockDay: 4,
    year: 2019,
    title: "Chevrolet Malibu LT",
    damage: "Задний бампер",
    bid: 3750,
    mileage: "86 900 км",
    docs: "Salvage",
    risk: "Низкий",
    marker: "green",
    x: 74,
    y: 57,
    image: "cars/chevrolet-malibu-lt.webp",
  },
  {
    id: 46,
    unlockDay: 5,
    year: 2020,
    title: "Nissan Rogue SV",
    damage: "Переднее левое крыло",
    bid: 4900,
    mileage: "68 800 км",
    docs: "Salvage",
    risk: "Средний",
    marker: "yellow",
    x: 28,
    y: 61,
    image: "cars/nissan-rogue-sv.webp",
  },
  {
    id: 47,
    unlockDay: 6,
    year: 2019,
    title: "Jeep Grand Cherokee Limited",
    damage: "Крышка багажника",
    bid: 6400,
    mileage: "79 100 км",
    docs: "Salvage",
    risk: "Средний",
    marker: "yellow",
    x: 75,
    y: 53,
    image: "cars/jeep-grand-cherokee-limited.webp",
  },
  {
    id: 48,
    unlockDay: 7,
    year: 2020,
    title: "Volvo XC60 Momentum",
    damage: "Правая дверь",
    bid: 6800,
    mileage: "62 500 км",
    docs: "Salvage",
    risk: "Средний",
    marker: "yellow",
    x: 69,
    y: 53,
    image: "cars/volvo-xc60-momentum.webp",
  },
  {
    id: 49,
    unlockDay: 8,
    year: 2020,
    title: "Acura RDX Technology",
    damage: "Бампер и край капота",
    bid: 7100,
    mileage: "55 700 км",
    docs: "Salvage",
    risk: "Высокий",
    marker: "red",
    x: 30,
    y: 65,
    image: "cars/acura-rdx-technology.webp",
  },
  {
    id: 50,
    unlockDay: 9,
    year: 2021,
    title: "Infiniti QX50 Luxe",
    damage: "Заднее правое крыло",
    bid: 7350,
    mileage: "44 800 км",
    docs: "Salvage",
    risk: "Средний",
    marker: "yellow",
    x: 77,
    y: 55,
    image: "cars/infiniti-qx50-luxe.webp",
  },
  {
    id: 51,
    unlockDay: 12,
    year: 2019,
    title: "Chevrolet Camaro LT1",
    damage: "Передний левый угол",
    bid: 7200,
    mileage: "63 600 км",
    docs: "Salvage",
    risk: "Высокий",
    marker: "red",
    x: 27,
    y: 64,
    image: "cars/chevrolet-camaro-lt1.webp",
  },
];

// Alternate photos keep the safe and risky versions visually distinct.  High
// risk still means hidden repair risk, not a visibly totalled vehicle.
const generatedRiskImages: Record<
  string,
  Partial<Record<"Низкий" | "Высокий", string>>
> = {
  "honda accord": { "Высокий": "cars/accord-high-cosmetic.png" },
  "ford mustang": { "Низкий": "cars/mustang-low-cosmetic.png" },
  "bmw 330i": { "Низкий": "cars/bmw-330i-low-cosmetic.png" },
  "tesla model": { "Низкий": "cars/tesla-model3-low-cosmetic.png" },
  "porsche cayenne": { "Низкий": "cars/cayenne-low-cosmetic.png" },
  "audi q5": { "Низкий": "cars/audi-q5-low-cosmetic.png" },
  "volkswagen tiguan": { "Высокий": "cars/tiguan-high-cosmetic.png" },
  "mazda cx-5": { "Высокий": "cars/mazda-cx5-high-cosmetic.png" },
  "subaru forester": { "Высокий": "cars/subaru-forester-high-cosmetic.png" },
  "nissan altima": { "Высокий": "cars/altima-high-cosmetic.png" },
  "hyundai sonata": { "Высокий": "cars/sonata-high-cosmetic.png" },
  "kia k5": { "Низкий": "cars/kia-k5-low-cosmetic.png" },
  "chevrolet malibu": { "Высокий": "cars/malibu-high-cosmetic.png" },
  "chevrolet camaro": { "Низкий": "cars/camaro-low-cosmetic.png" },
  "nissan rogue": {
    "Низкий": "cars/rogue-low-cosmetic.png",
    "Высокий": "cars/rogue-high-cosmetic.png",
  },
  "jeep grand": {
    "Низкий": "cars/jeep-grand-cherokee-low-cosmetic.png",
    "Высокий": "cars/jeep-grand-cherokee-high-cosmetic.png",
  },
  "volvo xc60": {
    "Низкий": "cars/volvo-xc60-low-cosmetic.png",
    "Высокий": "cars/volvo-xc60-high-cosmetic.png",
  },
  "acura rdx": {
    "Низкий": "cars/acura-rdx-low-cosmetic.png",
    "Высокий": "cars/acura-rdx-high-cosmetic.png",
  },
  "infiniti qx50": {
    "Низкий": "cars/infiniti-qx50-low-cosmetic.png",
    "Высокий": "cars/infiniti-qx50-high-cosmetic.png",
  },
};

// Every requested model must offer a real choice: a safer, more expensive lot
// and a cheaper high-risk lot. Missing variants are generated from an existing
// listing while using a separate photo whenever one is available.
const lots = (() => {
  const groups = new Map<string, (typeof baseLots)[number][]>();
  for (const lot of baseLots) {
    const key = lot.title.toLowerCase().split(" ").slice(0, 2).join(" ");
    groups.set(key, [...(groups.get(key) || []), lot]);
  }
  const generated: (typeof baseLots)[number][] = [];
  let generatedId = 1000;
  for (const [key, variants] of groups.entries()) {
    const safest = [...variants].sort((a, b) =>
      a.risk === "Низкий" ? -1 : b.risk === "Низкий" ? 1 : 0,
    )[0];
    if (!variants.some((lot) => lot.risk === "Низкий")) {
      generated.push({
        ...safest,
        id: generatedId++,
        bid: Math.round((safest.bid * 1.22) / 50) * 50,
        damage: "Лёгкие косметические повреждения",
        docs: "Salvage",
        risk: "Низкий",
        marker: "green",
        image: generatedRiskImages[key]?.["Низкий"] || safest.image,
      });
    }
    if (!variants.some((lot) => lot.risk === "Высокий")) {
      generated.push({
        ...variants[variants.length - 1],
        id: generatedId++,
        bid: Math.round((variants[variants.length - 1].bid * 0.72) / 50) * 50,
        damage: "Царапины кузова и возможные скрытые дефекты",
        docs: "Salvage",
        risk: "Высокий",
        marker: "red",
        image:
          generatedRiskImages[key]?.["Высокий"] ||
          variants[variants.length - 1].image,
      });
    }
  }
  return [...baseLots, ...generated];
})();

type GarageVehicle = {
  id: number;
  lot: (typeof lots)[number];
  purchasePrice: number;
  auctionFeePaid?: number;
  ownedImage: string;
  diagnosed: boolean;
  ordered: string[];
  orderedAtDay: Record<string, number>;
  partSuppliers: Record<string, SupplierId>;
  selectedPartOptions: Record<string, number>;
  delivered: string[];
  repaired: boolean;
  shippingPlan: ShippingPlan;
  arrivalDay: number | null;
  repairCompleteDay: number | null;
  repairCompleteAt?: number | null;
  negotiationRound: number;
  clientWalkedAway: boolean;
  askingPrice: number;
  listedDay: number | null;
  assignedContractId: string | null;
};

const catalog: Part[] = [
  {
    id: "bumper",
    name: "Бампер передний",
    price: 420,
    eta: 2,
    quality: "Аналог",
    required: true,
    category: "Кузов",
    icon: "▰",
    brand: "BodyLine",
    description: "Бампер под покраску с отверстиями под датчики",
  },
  {
    id: "headlight",
    name: "Фара левая LED",
    price: 620,
    eta: 4,
    quality: "Оригинал",
    required: true,
    category: "Оптика",
    icon: "◫",
    brand: "LumaTech",
    description: "LED-модуль, корректор и блок розжига в сборе",
  },
  {
    id: "radiator",
    name: "Радиатор охлаждения",
    price: 310,
    eta: 1,
    quality: "Аналог",
    required: true,
    category: "Охлаждение",
    icon: "▦",
    brand: "ThermoDrive",
    description: "Алюминиевый радиатор двигателя с усиленной рамкой",
  },
  {
    id: "sensor",
    name: "Датчик удара SRS",
    price: 180,
    eta: 2,
    quality: "Оригинал",
    required: true,
    category: "Электрика",
    icon: "◎",
    brand: "SafeMotion",
    description: "Фронтальный датчик системы пассивной безопасности",
  },
  {
    id: "bracket",
    name: "Комплект креплений бампера",
    price: 85,
    eta: 1,
    quality: "Оригинал",
    required: true,
    category: "Кузов",
    icon: "⌁",
    brand: "FixPro",
    description: "Направляющие, клипсы и крепёж для установки",
  },
  {
    id: "hood",
    name: "Капот",
    price: 690,
    eta: 3,
    quality: "Аналог",
    required: false,
    category: "Кузов",
    icon: "▱",
    brand: "BodyLine",
    description: "Стальная кузовная панель в транспортировочном грунте",
  },
  {
    id: "fender",
    name: "Крыло переднее левое",
    price: 280,
    eta: 2,
    quality: "Аналог",
    required: false,
    category: "Кузов",
    icon: "◩",
    brand: "BodyLine",
    description: "Крыло без повторителя, подготовлено под окраску",
  },
  {
    id: "door",
    name: "Дверь передняя левая",
    price: 760,
    eta: 4,
    quality: "Б/у",
    required: false,
    category: "Кузов",
    icon: "▯",
    brand: "AutoPanel",
    description: "Каркас двери без обшивки и электрооборудования",
  },
  {
    id: "taillight",
    name: "Фонарь задний LED",
    price: 390,
    eta: 2,
    quality: "Аналог",
    required: false,
    category: "Оптика",
    icon: "◧",
    brand: "LumaTech",
    description: "Задний светодиодный фонарь наружной секции",
  },
  {
    id: "condenser",
    name: "Радиатор кондиционера",
    price: 260,
    eta: 2,
    quality: "Аналог",
    required: false,
    category: "Охлаждение",
    icon: "▥",
    brand: "ColdFlow",
    description: "Конденсер климатической системы с осушителем",
  },
  {
    id: "fan",
    name: "Диффузор с вентилятором",
    price: 330,
    eta: 3,
    quality: "Аналог",
    required: false,
    category: "Охлаждение",
    icon: "✣",
    brand: "ThermoDrive",
    description: "Электровентилятор охлаждения в сборе",
  },
  {
    id: "airbag",
    name: "Подушка безопасности водителя",
    price: 880,
    eta: 5,
    quality: "Оригинал",
    required: false,
    category: "Безопасность",
    icon: "◉",
    brand: "SafeMotion",
    description: "Модуль airbag рулевого колеса, без следов срабатывания",
  },
  {
    id: "belt",
    name: "Ремень безопасности с пиропатроном",
    price: 240,
    eta: 3,
    quality: "Оригинал",
    required: false,
    category: "Безопасность",
    icon: "⌇",
    brand: "SafeMotion",
    description: "Передний ремень с преднатяжителем",
  },
  {
    id: "arm",
    name: "Рычаг передней подвески",
    price: 210,
    eta: 2,
    quality: "Аналог",
    required: false,
    category: "Подвеска",
    icon: "⌁",
    brand: "RoadCore",
    description: "Нижний рычаг с сайлентблоками и шаровой",
  },
  {
    id: "shock",
    name: "Амортизатор передний",
    price: 290,
    eta: 2,
    quality: "Аналог",
    required: false,
    category: "Подвеска",
    icon: "↕",
    brand: "RoadCore",
    description: "Газомасляная стойка передней подвески",
  },
  {
    id: "mirror",
    name: "Зеркало боковое",
    price: 350,
    eta: 3,
    quality: "Аналог",
    required: false,
    category: "Электрика",
    icon: "◒",
    brand: "VisionParts",
    description: "Электропривод, обогрев и повторитель поворота",
  },
  {
    id: "camera",
    name: "Камера переднего обзора",
    price: 470,
    eta: 4,
    quality: "Оригинал",
    required: false,
    category: "Электрика",
    icon: "◉",
    brand: "VisionParts",
    description: "Камера систем помощи водителю с калибровкой",
  },
  {
    id: "rearBumper",
    name: "Бампер задний",
    price: 390,
    eta: 2,
    quality: "Аналог",
    required: false,
    category: "Кузов",
    icon: "▰",
    brand: "BodyLine",
    description: "Задний бампер под покраску с креплениями датчиков",
  },
  {
    id: "rearReinforcement",
    name: "Усилитель заднего бампера",
    price: 240,
    eta: 2,
    quality: "Аналог",
    required: false,
    category: "Кузов",
    icon: "═",
    brand: "FixPro",
    description: "Стальная балка и энергопоглощающие элементы",
  },
  {
    id: "trunk",
    name: "Крышка багажника",
    price: 780,
    eta: 4,
    quality: "Б/у",
    required: false,
    category: "Кузов",
    icon: "▱",
    brand: "AutoPanel",
    description: "Крышка багажника без обшивки и замка",
  },
  {
    id: "rearPanel",
    name: "Задняя кузовная панель",
    price: 510,
    eta: 4,
    quality: "Аналог",
    required: false,
    category: "Кузов",
    icon: "▤",
    brand: "BodyLine",
    description: "Внутренняя панель багажного отсека под сварку",
  },
  {
    id: "hub",
    name: "Ступица колеса",
    price: 260,
    eta: 2,
    quality: "Аналог",
    required: false,
    category: "Подвеска",
    icon: "◉",
    brand: "RoadCore",
    description: "Ступичный узел с подшипником и датчиком ABS",
  },
  {
    id: "tieRod",
    name: "Рулевая тяга",
    price: 170,
    eta: 2,
    quality: "Аналог",
    required: false,
    category: "Подвеска",
    icon: "↔",
    brand: "RoadCore",
    description: "Тяга рулевого управления с наконечником",
  },
  {
    id: "controlUnit",
    name: "Блок управления кузовом",
    price: 720,
    eta: 4,
    quality: "Оригинал",
    required: false,
    category: "Электрика",
    icon: "▣",
    brand: "SafeMotion",
    description: "Электронный BCM с программированием под автомобиль",
  },
  {
    id: "wiring",
    name: "Жгут салонной проводки",
    price: 560,
    eta: 5,
    quality: "Оригинал",
    required: false,
    category: "Электрика",
    icon: "⌇",
    brand: "SafeMotion",
    description: "Основной жгут проводки после воздействия воды",
  },
];

const money = (n: number) => `$${n.toLocaleString("en-US")}`;
const suggestedSalePrice = (
  lot: (typeof lots)[number],
  paid: number,
) => {
  const rate = lot.risk === "Высокий" ? 0.28 : lot.risk === "Средний" ? 0.45 : 0.7;
  const floor = lot.risk === "Высокий" ? 5500 : lot.risk === "Средний" ? 8500 : 10500;
  return Math.round((paid + Math.max(floor, paid * rate)) / 50) * 50;
};
const VIN_REPORT_PRICE = 400;
type GameSound =
  | "click"
  | "type"
  | "notification"
  | "success"
  | "error"
  | "money"
  | "tick"
  | "auctionWin";

let gameAudioContext: AudioContext | null = null;

function playGameSound(sound: GameSound, enabled = true) {
  if (!enabled || typeof window === "undefined") return;
  try {
    gameAudioContext ??= new AudioContext();
    const context = gameAudioContext;
    if (context.state === "suspended") void context.resume();
    const now = context.currentTime;
    const note = (
      frequency: number,
      offset: number,
      duration: number,
      volume: number,
      type: OscillatorType = "sine",
    ) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, now + offset);
      gain.gain.setValueAtTime(0.0001, now + offset);
      gain.gain.exponentialRampToValueAtTime(volume, now + offset + 0.008);
      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        now + offset + duration,
      );
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(now + offset);
      oscillator.stop(now + offset + duration + 0.02);
    };
    if (sound === "click") note(420, 0, 0.045, 0.018, "triangle");
    if (sound === "type") note(520 + Math.random() * 90, 0, 0.025, 0.008, "triangle");
    if (sound === "notification") {
      note(660, 0, 0.1, 0.028, "sine");
      note(880, 0.09, 0.14, 0.025, "sine");
    }
    if (sound === "success") {
      note(523, 0, 0.11, 0.032, "triangle");
      note(659, 0.1, 0.12, 0.032, "triangle");
      note(784, 0.2, 0.2, 0.034, "triangle");
    }
    if (sound === "money") {
      note(1047, 0, 0.08, 0.025, "sine");
      note(1319, 0.07, 0.1, 0.025, "sine");
    }
    if (sound === "error") {
      note(220, 0, 0.12, 0.03, "sawtooth");
      note(165, 0.11, 0.18, 0.025, "sawtooth");
    }
    if (sound === "tick") note(760, 0, 0.06, 0.024, "square");
    if (sound === "auctionWin") {
      note(392, 0, 0.14, 0.034, "triangle");
      note(523, 0.12, 0.16, 0.036, "triangle");
      note(659, 0.26, 0.18, 0.038, "triangle");
      note(784, 0.42, 0.32, 0.04, "triangle");
    }
  } catch {
    // Audio is optional and may be blocked until the first user interaction.
  }
}

const partOptions: PartOption[] = [
  {
    label: "Оригинал",
    priceFactor: 1.35,
    eta: 4,
    warranty: "12 мес.",
    quality: 100,
    note: "Максимальная надёжность",
  },
  {
    label: "Аналог",
    priceFactor: 1,
    eta: 2,
    warranty: "6 мес.",
    quality: 82,
    note: "Баланс цены и качества",
  },
  {
    label: "Б/у",
    priceFactor: 0.62,
    eta: 1,
    warranty: "14 дней",
    quality: 62,
    note: "Дёшево, возможен износ",
  },
];

export default function Home() {
  const [language, setLanguage] = useState<"ru" | "en">("ru");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicVolume, setMusicVolume] = useState(11);
  const [screen, setScreen] = useState<Screen>("desktop");
  const [balance, setBalance] = useState(15000);
  const [day, setDay] = useState(1);
  const [owned, setOwned] = useState(false);
  const [purchasePrice, setPurchasePrice] = useState(9200);
  const [auctionFeePaid, setAuctionFeePaid] = useState(300);
  const [ownedImage, setOwnedImage] = useState("cars/camry-blue-front.jpg");
  const [ownedLot, setOwnedLot] = useState<(typeof lots)[number] | null>(null);
  const [garageVehicles, setGarageVehicles] = useState<GarageVehicle[]>([]);
  const garageVehiclesRef = useRef<GarageVehicle[]>([]);
  const garageLoadedRef = useRef(false);
  const [saveReady, setSaveReady] = useState(false);
  const [activeGarageId, setActiveGarageId] = useState<number | null>(null);
  const [completedDeals, setCompletedDeals] = useState(0);
  const [closedLotIds, setClosedLotIds] = useState<number[]>([]);
  const [favoriteLotIds, setFavoriteLotIds] = useState<number[]>([]);
  const [auctionFavoritesOnly, setAuctionFavoritesOnly] = useState(false);
  const [activeChat, setActiveChat] = useState<string>("client");
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const [clientLeads, setClientLeads] = useState<ClientLead[]>([]);
  const [incomingLead, setIncomingLead] = useState<ClientLead | null>(null);
  const [incomingLeadClosing, setIncomingLeadClosing] = useState(false);
  const incomingLeadCloseTimer = useRef<number | null>(null);
  const [chatReplies, setChatReplies] = useState<Record<string, string[]>>({});
  const [budgetNegotiations, setBudgetNegotiations] = useState<
    Record<string, "full" | "compromise" | "refused">
  >({});
  const [declinedLeadIds, setDeclinedLeadIds] = useState<string[]>([]);
  const [resolvedLeadDays, setResolvedLeadDays] = useState<Record<string, number>>({});
  const [acceptedContracts, setAcceptedContracts] = useState<string[]>([]);
  const [contractAcceptedDays, setContractAcceptedDays] = useState<
    Record<string, number>
  >({});
  const [alexOrderDeclined, setAlexOrderDeclined] = useState(false);
  const [alexResolvedDay, setAlexResolvedDay] = useState<number | null>(null);
  const [assignedContractId, setAssignedContractId] = useState<string | null>(
    null,
  );
  const [playerName, setPlayerName] = useState("");
  const [nameDraft, setNameDraft] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyDraft, setCompanyDraft] = useState("");
  const [profileReady, setProfileReady] = useState(false);
  const [tutorialStatus, setTutorialStatus] = useState<
    "active" | "skipped" | "completed"
  >("active");
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const lastTutorialStage = useRef<TutorialStage | null>(null);
  const [vinReports, setVinReports] = useState<number[]>([]);
  const [selectedReport, setSelectedReport] = useState<number | null>(null);
  const [vinModalOpen, setVinModalOpen] = useState(false);
  const [auctionLot, setAuctionLot] = useState<(typeof lots)[number] | null>(
    null,
  );
  const [diagnosed, setDiagnosed] = useState(false);
  const [ordered, setOrdered] = useState<string[]>([]);
  const [orderedAtDay, setOrderedAtDay] = useState<Record<string, number>>({});
  const [partSuppliers, setPartSuppliers] = useState<
    Record<string, SupplierId>
  >({});
  const [selectedPartOptions, setSelectedPartOptions] = useState<
    Record<string, number>
  >({});
  const [delivered, setDelivered] = useState<string[]>([]);
  const [repaired, setRepaired] = useState(false);
  const [sold, setSold] = useState(false);
  const [loanPrincipal, setLoanPrincipal] = useState(0);
  const [loanBalance, setLoanBalance] = useState(0);
  const [loanPayment, setLoanPayment] = useState(0);
  const [loanRate, setLoanRate] = useState(0);
  const [loanTerm, setLoanTerm] = useState(0);
  const [paymentsMade, setPaymentsMade] = useState(0);
  const [negotiationRound, setNegotiationRound] = useState(0);
  const [clientWalkedAway, setClientWalkedAway] = useState(false);
  const [askingPrice, setAskingPrice] = useState(18000);
  const [listedDay, setListedDay] = useState<number | null>(null);
  const [partSearch, setPartSearch] = useState("");
  const [shopVehicle, setShopVehicle] = useState("camry");
  const [partCategory, setPartCategory] = useState("Все");
  const [toast, setToast] = useState("Новый заказ: Toyota Camry до $18 000");
  const [toastVisible, setToastVisible] = useState(true);
  const lastSoundToast = useRef(toast);
  const [xp, setXp] = useState(0);
  const [reputation, setReputation] = useState(0);
  const [dealStreak, setDealStreak] = useState(0);
  const [dealResult, setDealResult] = useState<DealResult | null>(null);
  const [gameEvent, setGameEvent] = useState<GameEvent | null>(null);
  const [rewardAdOpen, setRewardAdOpen] = useState(false);
  const [rewardAdSeconds, setRewardAdSeconds] = useState(5);
  const [rewardAdStatus, setRewardAdStatus] = useState<
    "idle" | "loading" | "showing"
  >("idle");
  const [rewardAdMode, setRewardAdMode] = useState<"money" | "delivery" | "repair">("money");
  const [repairTimeCreditMinutes, setRepairTimeCreditMinutes] = useState(0);
  const [companyUpgrades, setCompanyUpgrades] = useState<CompanyUpgradeId[]>(
    [],
  );
  const [rouletteOpen, setRouletteOpen] = useState(false);
  const [rouletteSpinning, setRouletteSpinning] = useState(false);
  const [rouletteResult, setRouletteResult] = useState<number | null>(null);
  const [rouletteRotation, setRouletteRotation] = useState(0);
  const [rouletteLastSpinAt, setRouletteLastSpinAt] = useState(0);
  const [tutorialTypedText, setTutorialTypedText] = useState("");
  const [clockNow, setClockNow] = useState(() => Date.now());
  const [nextCycleAt, setNextCycleAt] = useState(() => Date.now() + 10 * 60 * 1000);
  const [auctionVisibleIds, setAuctionVisibleIds] = useState<number[]>(() =>
    lots.slice(0, 11).map((lot) => lot.id),
  );
  const [nextAuctionLotAt, setNextAuctionLotAt] = useState(
    () => Date.now() + 2 * 60 * 1000,
  );
  const [achievementsOpen, setAchievementsOpen] = useState(false);
  const [unlockedAchievementIds, setUnlockedAchievementIds] = useState<string[]>([]);
  const [achievementToastId, setAchievementToastId] = useState<string | null>(null);
  const [pendingPurchase, setPendingPurchase] = useState<{
    lot: (typeof lots)[number];
    bid: number;
  } | null>(null);
  const [shippingPlan, setShippingPlan] = useState<ShippingPlan>("standard");
  const [arrivalDay, setArrivalDay] = useState<number | null>(null);
  const [repairCompleteDay, setRepairCompleteDay] = useState<number | null>(
    null,
  );
  const [repairCompleteAt, setRepairCompleteAt] = useState<number | null>(null);
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const cloudPlayerRef = useRef<YandexPlayer | null>(null);
  const cloudHydratedRef = useRef(false);
  const cloudSaveTimerRef = useRef<number | null>(null);
  const [pendingLoan, setPendingLoan] = useState<{
    amount: number;
    term: number;
    rate: number;
  } | null>(null);

  const damageText = (ownedLot?.damage || "").toLowerCase();
  const damagePartIds =
    damageText.includes("сзад") ||
    damageText.includes("багаж") ||
    damageText.includes("задн")
      ? ["rearBumper", "rearReinforcement", "trunk", "taillight", "rearPanel"]
      : damageText.includes("двер") ||
          damageText.includes("крыл") ||
          damageText.includes("порог")
        ? ["door", "fender", "mirror", "airbag", "belt"]
        : damageText.includes("подвес") || damageText.includes("колес")
          ? ["arm", "shock", "hub", "tieRod", "sensor"]
          : damageText.includes("затоп")
            ? ["controlUnit", "wiring", "sensor", "camera", "belt"]
            : ["bumper", "headlight", "radiator", "sensor", "bracket"];
  const requiredPartCount =
    ownedLot?.risk === "Высокий" ? 5 : ownedLot?.risk === "Средний" ? 4 : 3;
  const requiredCatalog = catalog
    .filter((p) => damagePartIds.includes(p.id))
    .slice(0, requiredPartCount);
  const inTransit = owned && arrivalDay !== null && day < arrivalDay;
  const deliveryRemainingMs = inTransit
    ? Math.max(0, nextCycleAt - clockNow) +
      Math.max(0, (arrivalDay ?? day) - day - 1) * 10 * 60 * 1000
    : 0;
  const deliveryRemainingLabel = `${String(Math.floor(deliveryRemainingMs / 60000)).padStart(2, "0")}:${String(Math.floor((deliveryRemainingMs % 60000) / 1000)).padStart(2, "0")}`;
  const repairInProgress =
    repairCompleteAt !== null && clockNow < repairCompleteAt;
  const repairFinishedByTime =
    repairCompleteAt !== null && clockNow >= repairCompleteAt;
  const progress = sold
    ? 100
    : listedDay !== null
      ? 94
      : clientWalkedAway
        ? 89
        : repaired || repairFinishedByTime
          ? 86
          : requiredCatalog.every((p) => delivered.includes(p.id))
            ? 72
            : diagnosed
              ? 55
              : inTransit
                ? 18
                : owned
                  ? 28
                  : 8;
  const allReady = requiredCatalog.every((p) => delivered.includes(p.id));
  const unread =
    (owned && !diagnosed ? 1 : 0) + clientLeads.filter((c) => !c.read).length;
  const currentLead = clientLeads.find((c) => `lead-${c.id}` === activeChat);
  const orderedClientLeads = [...clientLeads].sort((a, b) => {
    const aResolved = resolvedLeadDays[a.id] !== undefined ? 1 : 0;
    const bResolved = resolvedLeadDays[b.id] !== undefined ? 1 : 0;
    if (aResolved !== bResolved) return aResolved - bResolved;
    if (a.read !== b.read) return a.read ? 1 : -1;
    return b.day - a.day;
  });
  const alexOrderAccepted = acceptedContracts.includes(alexContract.id);
  const alexConversationVisible =
    alexResolvedDay === null || day - alexResolvedDay < 2;
  const activeContracts = [
    ...(alexOrderAccepted ? [alexContract] : []),
    ...clientLeads.filter((c) => acceptedContracts.includes(c.id)),
  ];
  const leadMatchesLot = (lead: ClientLead, lot: (typeof lots)[number]) => {
    const wanted = lead.car.toLowerCase().split(" ").slice(0, 2);
    const actual = lot.title.toLowerCase();
    return (
      wanted.every((word) => actual.includes(word)) &&
      lot.year >= 2018 &&
      lot.year <= 2021
    );
  };
  const marketDemandLeads = [
    ...(!alexOrderDeclined && alexResolvedDay === null ? [alexContract] : []),
    ...clientLeads.filter(
      (lead) =>
        resolvedLeadDays[lead.id] === undefined &&
        !declinedLeadIds.includes(lead.id),
    ),
  ];
  const requiredMarketPairIds = new Set<number>();
  for (const lead of marketDemandLeads) {
    const matchingLots = lots.filter(
      (lot) => !closedLotIds.includes(lot.id) && leadMatchesLot(lead, lot),
    );
    const safeLot = matchingLots.find((lot) => lot.risk === "Низкий");
    const riskyLot = matchingLots.find((lot) => lot.risk === "Высокий");
    if (safeLot) requiredMarketPairIds.add(safeLot.id);
    if (riskyLot) requiredMarketPairIds.add(riskyLot.id);
  }
  const marketCandidateLots = lots
    .filter(
      (lot) =>
        (auctionVisibleIds.includes(lot.id) || requiredMarketPairIds.has(lot.id)) &&
        !closedLotIds.includes(lot.id),
    )
    .sort((a, b) => {
      const requiredDifference =
        Number(requiredMarketPairIds.has(b.id)) -
        Number(requiredMarketPairIds.has(a.id));
      return requiredDifference || b.id - a.id;
    });
  // Never show the same photograph twice in one auction refresh. This also
  // keeps duplicate trims from looking like duplicated cards.
  const availableLots = marketCandidateLots.filter(
    (lot, index, candidates) =>
      candidates.findIndex((candidate) => candidate.image === lot.image) === index,
  );
  const displayedAuctionLots = auctionFavoritesOnly
    ? availableLots.filter((lot) => favoriteLotIds.includes(lot.id))
    : availableLots;
  const auctionRefreshRemaining = Math.max(0, nextAuctionLotAt - clockNow);
  const auctionRefreshTimer = `${String(Math.floor(auctionRefreshRemaining / 60000)).padStart(2, "0")}:${String(Math.floor((auctionRefreshRemaining % 60000) / 1000)).padStart(2, "0")}`;
  const activeVehicle = ownedLot || lots[0];
  const hasCompanyUpgrade = (id: CompanyUpgradeId) =>
    companyUpgrades.includes(id);
  const upgradeLevel = (branch: UpgradeBranchId) =>
    companyUpgrades.filter((id) => id.startsWith(`${branch}-step-`)).length;
  const garageUpgradeLevel = upgradeLevel("garage");
  const auctionUpgradeLevel = upgradeLevel("auction");
  const partsUpgradeLevel = upgradeLevel("parts");
  const serviceUpgradeLevel = upgradeLevel("service");
  const marketingUpgradeLevel = upgradeLevel("marketing");
  const purchasedGarageCapacity =
    1 + garageUpgradeLevel;
  // Older saves could already contain several cars from before slots existed.
  // Keep every owned car and only enforce the new limit on future purchases.
  const garageCapacity = Math.max(purchasedGarageCapacity, garageVehicles.length);
  const occupiedGarageSlots = garageVehicles.length + (pendingPurchase ? 1 : 0);
  const firstServiceOrderFree = completedDeals === 0;
  const vinReportPrice = firstServiceOrderFree ? 0 : VIN_REPORT_PRICE;
  const regularAuctionFee = Math.max(150, 300 - auctionUpgradeLevel * 30);
  const auctionFee = firstServiceOrderFree ? 0 : regularAuctionFee;
  const partsPriceMultiplier = 1 - partsUpgradeLevel * 0.08;
  const servicePriceMultiplier = 1 - serviceUpgradeLevel * 0.08;
  const rewardAdAmount = 750 + [0, 50, 100, 175, 250, 350][marketingUpgradeLevel];
  const leadMatchesVehicle = (lead: ClientLead) =>
    leadMatchesLot(lead, activeVehicle);
  const matchingLeads = clientLeads.filter(leadMatchesVehicle);
  const currentLeadGarageVehicle = currentLead
    ? garageVehicles.find(
        (vehicle) =>
          leadMatchesLot(currentLead, vehicle.lot) &&
          (vehicle.assignedContractId === null ||
            vehicle.assignedContractId === currentLead.id),
      )
    : undefined;
  const assignedContract = pendingPurchase
    ? activeContracts.find((contract) =>
        leadMatchesLot(contract, pendingPurchase.lot),
      )
    : activeContracts.find((c) => c.id === assignedContractId);
  const currentLeadMatches = currentLead
    ? leadMatchesVehicle(currentLead) &&
      acceptedContracts.includes(currentLead.id) &&
      assignedContractId === currentLead.id
    : false;
  const matchesAlexOrder =
    activeVehicle.title.includes("Toyota Camry") &&
    activeVehicle.year >= 2018 &&
    activeVehicle.year <= 2020;
  const activeVin = `US-${activeVehicle.year}-${43820 + activeVehicle.id}-${String(activeVehicle.id).padStart(3, "0")}`;
  const projectedSale = suggestedSalePrice(activeVehicle, purchasePrice);
  const riskMultiplier =
    activeVehicle.risk === "Высокий"
      ? 1.6
      : activeVehicle.risk === "Средний"
        ? 1.25
        : 1;
  const regularDiagnosticCost = Math.round(
      ((activeVehicle.risk === "Высокий"
        ? 1400
        : activeVehicle.risk === "Средний"
          ? 950
          : 650) *
        servicePriceMultiplier) /
        50,
    ) * 50;
  const diagnosticCost = firstServiceOrderFree ? 0 : regularDiagnosticCost;
  const regularRepairCost =
    Math.round((2100 * riskMultiplier * servicePriceMultiplier) / 50) * 50;
  const repairCost = firstServiceOrderFree ? 0 : regularRepairCost;
  const baseRepairDurationMinutes =
    requiredPartCount >= 5 ? 60 : requiredPartCount === 4 ? 45 : 30;
  const repairDurationMinutes = Math.max(
    15,
    baseRepairDurationMinutes - serviceUpgradeLevel * 5,
  );
  const effectiveRepairDurationMinutes = Math.max(
    1,
    repairDurationMinutes - repairTimeCreditMinutes,
  );
  const repairRemainingMs = Math.max(
    0,
    (repairCompleteAt ?? clockNow) - clockNow,
  );
  const repairRemainingLabel = `${String(Math.floor(repairRemainingMs / 60000)).padStart(2, "0")}:${String(Math.floor((repairRemainingMs % 60000) / 1000)).padStart(2, "0")}`;
  const defectCount =
    activeVehicle.risk === "Высокий"
      ? 9
      : activeVehicle.risk === "Средний"
        ? 7
        : 5;
  const selectedOption = (id: string) =>
    partOptions[selectedPartOptions[id] ?? 1];
  const selectedSupplier = (id: string) =>
    suppliers[partSuppliers[id] ?? "standard"];
  const regularPartPriceForOption = (part: Part, optionIndex: number) =>
    Math.round(
      (part.price *
        (shopVehicles.find((v) => v.id === shopVehicle)?.factor || 1) *
        partOptions[optionIndex].priceFactor *
        selectedSupplier(part.id).factor *
        partsPriceMultiplier *
        (activeVehicle.risk === "Высокий"
          ? 1.45
          : activeVehicle.risk === "Средний"
            ? 1.2
            : 1)) /
        5,
    ) * 5;
  const partPriceForOption = (part: Part, optionIndex: number) =>
    firstServiceOrderFree ? 0 : regularPartPriceForOption(part, optionIndex);
  const partPrice = (part: Part) =>
    partPriceForOption(part, selectedPartOptions[part.id] ?? 1);
  const filteredCatalog = catalog.filter(
    (part) =>
      (partCategory === "Все" || part.category === partCategory) &&
      (part.name.toLowerCase().includes(partSearch.trim().toLowerCase()) ||
        part.id.includes(partSearch.trim().toLowerCase())),
  );
  const requiredPartIds = new Set(requiredCatalog.map((part) => part.id));
  const requiredShopCatalog = diagnosed
    ? [...requiredCatalog].sort((a, b) => {
        const status = (part: Part) =>
          delivered.includes(part.id) ? 2 : ordered.includes(part.id) ? 1 : 0;
        return status(a) - status(b);
      })
    : [];
  const freeShopCatalog = filteredCatalog.filter(
    (part) => !requiredPartIds.has(part.id),
  );
  const displayedShopCatalog = diagnosed
    ? [...requiredShopCatalog, ...freeShopCatalog]
    : filteredCatalog;
  const orderedPartsTotal = ordered.reduce((s, id) => {
    const part = catalog.find((p) => p.id === id);
    return s + (part ? partPrice(part) : 0);
  }, 0);
  const partsQuality = ordered.length
    ? Math.round(
        ordered.reduce((s, id) => s + selectedOption(id).quality, 0) /
          ordered.length,
      )
    : 0;
  const shippingCost = firstServiceOrderFree
    ? 0
    : shippingPlans[shippingPlan].price;
  const priceWithTutorialFree = (regularPrice: number, actualPrice = regularPrice) =>
    firstServiceOrderFree ? (
      <span className="tutorial-free-price">
        <del>{money(regularPrice)}</del>
        <em>БЕСПЛАТНО</em>
      </span>
    ) : (
      money(actualPrice)
    );
  const transportCost = owned ? shippingCost : 0;
  const totalInvested =
    purchasePrice +
    auctionFeePaid +
    transportCost +
    orderedPartsTotal +
    (diagnosed ? diagnosticCost : 0) +
    (repaired ? repairCost : 0);
  const receivedRequiredParts = requiredCatalog.filter((part) =>
    delivered.includes(part.id),
  ).length;
  const orderedRequiredParts = requiredCatalog.filter((part) =>
    ordered.includes(part.id),
  ).length;
  const serviceReadiness = repaired
    ? 100
    : repairInProgress
      ? 82
      : allReady && diagnosed
        ? 68
        : diagnosed
          ? Math.round(
              30 +
                (receivedRequiredParts / Math.max(1, requiredCatalog.length)) *
                  34,
            )
          : 14;
  const serviceWorkOrderTotal = repairCost + orderedPartsTotal;
  const serviceDamageMarkers = requiredCatalog.map((part, index) => {
    const offsets = [
      [-9, 5],
      [4, -4],
      [10, 7],
      [-3, 13],
      [14, 16],
    ];
    const [xOffset, yOffset] = offsets[index] || [index * 3, index * 2];
    return {
      part,
      x: Math.min(89, Math.max(11, activeVehicle.x + xOffset)),
      y: Math.min(82, Math.max(18, activeVehicle.y + yOffset)),
    };
  });
  const cheapPartsCount = ordered.filter(
    (id) => selectedOption(id).label === "Б/у",
  ).length;
  const qualityDiscount =
    cheapPartsCount >= 4
      ? 0.18
      : cheapPartsCount >= 2
        ? 0.1
        : partsQuality < 80
          ? 0.05
          : 0;
  const bargainDiscount =
    partsQuality >= 95
      ? 0
      : partsQuality >= 82
        ? 0.025
        : partsQuality >= 70
          ? 0.06
          : 0.1;
  const initialClientOffer =
    Math.round((projectedSale * (1 - qualityDiscount - bargainDiscount)) / 50) *
    50;
  const negotiatedOffer = Math.min(
    projectedSale,
    initialClientOffer +
      negotiationRound *
        Math.round(((projectedSale - initialClientOffer) * 0.42) / 50) *
        50,
  );
  const currentLeadOffer = currentLead
    ? Math.min(
        currentLead.budget,
        Math.round(negotiatedOffer / 50) * 50,
      )
    : negotiatedOffer;
  const mileageNumber = Number(activeVehicle.mileage.replace(/\D/g, ""));
  const fairMarketPrice =
    Math.round(
      (projectedSale * (0.78 + partsQuality / 500) -
        Math.max(0, mileageNumber - 50000) * 0.025) /
        100,
    ) * 100;
  const listingPriceRatio = askingPrice / Math.max(1, fairMarketPrice);
  const baseExpectedSaleDays = Math.min(
    15,
    Math.max(
      1,
      Math.round(
        2 +
          (100 - partsQuality) / 9 +
          Math.max(0, listingPriceRatio - 1) * 18 +
          Math.max(0, mileageNumber - 70000) / 25000,
      ),
    ),
  );
  const expectedSaleDays = Math.max(
    1,
    baseExpectedSaleDays - Math.ceil(marketingUpgradeLevel / 2),
  );
  const daysListed = listedDay === null ? 0 : day - listedDay;
  const tutorialStage: TutorialStage =
    completedDeals > 0
      ? "finish"
      : repaired
        ? "sale"
        : owned && diagnosed
          ? "repair"
            : owned && !inTransit
              ? "diagnosis"
              : owned && inTransit
                ? "shipping"
                : pendingPurchase
                  ? "delivery"
                  : screen === "liveAuction" && auctionLot
                    ? "bidding"
                    : alexOrderAccepted
                      ? "auction"
                      : "contract";
  const tutorialStep = tutorialSteps[tutorialStage];
  const tutorialStepNumber = tutorialStageOrder.indexOf(tutorialStage) + 1;
  const tutorialTargetScreen = tutorialStep.target;
  const newestLead = clientLeads[0];
  const companyLevel = Math.floor(xp / 300) + 1;
  const levelXp = xp % 300;
  const achievementProgress = (achievement: GameAchievement) => {
    const values: Record<AchievementMetric, number> = {
      deals: completedDeals,
      vin: vinReports.length,
      favorites: favoriteLotIds.length,
      reputation,
      level: companyLevel,
      upgrades: companyUpgrades.length,
      streak: dealStreak,
      garage: garageVehicles.length,
      roulette: rouletteLastSpinAt > 0 ? 1 : 0,
      balance,
    };
    return Math.min(achievement.target, values[achievement.metric]);
  };
  const achievementToast = achievementToastId
    ? gameAchievements.find((achievement) => achievement.id === achievementToastId) || null
    : null;
  const AchievementToastIcon = achievementToast?.Icon || Trophy;
  const dailyMissions = [
    {
      text: "Проверить VIN автомобиля",
      done: vinReports.length > 0,
      reward: 40,
    },
    {
      text: owned
        ? "Продвинуть автомобиль по ремонту"
        : "Купить автомобиль на аукционе",
      done: owned && diagnosed,
      reward: 70,
    },
    {
      text: "Закрыть прибыльную сделку",
      done: sold && (dealResult?.profit || 0) > 0,
      reward: 120,
    },
  ];
  const rewardAdAvailable = rewardAdStatus === "idle";
  const rouletteRemaining = Math.max(
    0,
    60 * 60 * 1000 - (clockNow - rouletteLastSpinAt),
  );
  const rouletteReady = rouletteRemaining === 0 && !rouletteSpinning;
  const rouletteTimer = `${String(Math.floor(rouletteRemaining / 3600000)).padStart(2, "0")}:${String(Math.floor((rouletteRemaining % 3600000) / 60000)).padStart(2, "0")}:${String(Math.floor((rouletteRemaining % 60000) / 1000)).padStart(2, "0")}`;
  const dashboard = sold
    ? {
        kicker: "СДЕЛКА ЗАВЕРШЕНА",
        heading: `${activeVehicle.title} продан`,
        text: `Деньги зачислены на бизнес-счёт · завершено сделок: ${completedDeals}`,
        button: "Посмотреть финансы",
        target: "bank" as Screen,
      }
    : listedDay !== null
      ? {
          kicker: "СВОБОДНЫЙ РЫНОК",
          heading: `${activeVehicle.title} в продаже ${daysListed} дн.`,
          text: `Цена ${money(askingPrice)} · рынок ${money(fairMarketPrice)} · ожидаемый срок около ${expectedSaleDays} дн.${daysListed >= 3 && listingPriceRatio > 1.05 ? " Цена выше рынка — стоит снизить." : ""}`,
          button: "Управлять объявлением",
          target: "garage" as Screen,
        }
      : clientWalkedAway && repaired
        ? {
            kicker: "КЛИЕНТ ОТКАЗАЛСЯ",
            heading: "Выставьте автомобиль на свободный рынок",
            text: `${activeVehicle.year} ${activeVehicle.title} готов к продаже · ориентир ${money(fairMarketPrice)}`,
            button: "Назначить цену",
            target: "garage" as Screen,
          }
        : repaired
          ? {
              kicker: "ПРОДАЖА",
              heading: "Автомобиль готов — получите предложение клиента",
              text: `Качество ремонта ${partsQuality}% · вложено ${money(totalInvested)} · прогноз ${money(projectedSale)}`,
              button: "Открыть переговоры",
              target: "messages" as Screen,
            }
          : owned && diagnosed && allReady
            ? {
                kicker: "АВТОСЕРВИС",
                heading: "Все детали получены — начинайте ремонт",
                text: `${activeVehicle.title} · работы ${money(repairCost)} · качество комплекта ${partsQuality}%`,
                button: "Открыть заказ-наряд",
                target: "service" as Screen,
              }
            : owned && diagnosed
              ? {
                  kicker: "АВТОСЕРВИС",
                  heading: `Выберите детали: ${requiredCatalog.filter((p) => delivered.includes(p.id)).length} из ${requiredCatalog.length}`,
                  text: `${activeVehicle.title} · качество деталей напрямую влияет на предложение клиента`,
                  button: "Продолжить ремонт",
                  target: "service" as Screen,
                }
              : owned
                ? {
                    kicker: "АВТОМОБИЛЬ В РАБОТЕ",
                    heading: `${activeVehicle.title} прибыл в сервис`,
                    text: `${activeVehicle.year} год · ${activeVehicle.mileage} · требуется диагностика`,
                    button: "Начать диагностику",
                    target: "service" as Screen,
                  }
                : newestLead
                  ? {
                      kicker: "НОВАЯ ЗАЯВКА",
                      heading: `${newestLead.name} ищет ${newestLead.car}`,
                      text: `Бюджет ${money(newestLead.budget)} · без дедлайна · ${newestLead.requirement}`,
                      button: "Открыть заявку",
                      target: "messages" as Screen,
                    }
                  : alexOrderAccepted
                    ? {
                        kicker: "ПЕРВЫЙ КОНТРАКТ",
                        heading: "Найдите Toyota Camry для Алексея",
                        text: "2018–2020 год · бюджет клиента до $18 000 · без серьёзных повреждений",
                        button: "Перейти к лотам",
                        target: "auction" as Screen,
                      }
                    : {
                        kicker: "НОВЫЙ ЗАКАЗ",
                        heading: "Алексей ждёт подтверждения заказа",
                        text: "Toyota Camry 2018–2020 · бюджет до $18 000 · сначала согласуйте условия",
                        button: "Открыть заказ",
                        target: "messages" as Screen,
                      };
  const creditLimit = 10000 + completedDeals * 5000;
  const creditAvailable = Math.max(0, creditLimit - loanPrincipal);
  const arrivingTomorrow = ordered.filter(
    (id) =>
      !delivered.includes(id) &&
      day + 1 - (orderedAtDay[id] ?? day) >= selectedSupplier(id).eta,
  );
  const tomorrowLots = lots.filter(
    (lot) => lot.unlockDay === day + 1 && !closedLotIds.includes(lot.id),
  );
  const paymentTomorrow = loanBalance > 0 && (day + 1) % 7 === 0;
  const officeRent = 160;
  const dataSubscriptions = 60;
  const communications = 40;
  const vehicleStorage =
    owned && !sold ? Math.max(25, 90 - garageUpgradeLevel * 13) : 0;
  const dailyOverhead =
    officeRent + dataSubscriptions + communications + vehicleStorage;
  const urgentTask =
    owned && !sold
      ? !diagnosed
        ? "Автомобиль ожидает диагностику"
        : !allReady
          ? "Ремонт ожидает поставку деталей"
          : !repaired
            ? "Все детали получены — можно начать ремонт"
            : "Автомобиль готов к продаже"
      : null;

  const title = useMemo(
    () =>
      ({
        desktop: "Рабочий стол",
        auction: "Аукцион",
        liveAuction: "Живые торги",
        garage: "Мои автомобили",
        parts: "Запчасти",
        service: "Автосервис",
        messages: "Заказы клиентов",
        mail: "Почта и документы",
        bank: "Финансы",
        development: "Развитие компании",
      })[screen],
    [screen],
  );

  useEffect(() => {
    const resetKey = "cardealer-clean-reset-2026-09-19-time-v1";
    if (!window.localStorage.getItem(resetKey)) {
      Object.keys(window.localStorage).forEach((key) => {
        if (key.startsWith("cardealer-") || key.startsWith("autoimport-")) {
          window.localStorage.removeItem(key);
        }
      });
      window.localStorage.setItem(resetKey, "done");
      window.location.reload();
      return;
    }
    const savedLanguage = window.localStorage.getItem("cardealer-language");
    if (savedLanguage === "en") setLanguage("en");
    const savedTutorial = window.localStorage.getItem(
      "cardealer-tutorial-status",
    );
    if (savedTutorial === "completed" || savedTutorial === "skipped") {
      setTutorialStatus(savedTutorial);
    }
    const saved = window.localStorage.getItem("autoimport-player-name");
    const savedCompany = window.localStorage.getItem("autoimport-company-name");
    if (saved && savedCompany) {
      setPlayerName(saved);
      setNameDraft(saved);
      setCompanyName(savedCompany);
      setCompanyDraft(savedCompany);
      setProfileReady(true);
    }
    const unifiedSave = window.localStorage.getItem("cardealer-save-v2");
    if (unifiedSave) {
      try {
        const savedGame = JSON.parse(unifiedSave) as Record<string, any>;
        const hasImpossibleOrphan =
          savedGame.day === 1 &&
          savedGame.balance === 15000 &&
          savedGame.completedDeals === 0 &&
          Array.isArray(savedGame.garageVehicles) &&
          savedGame.garageVehicles.some(
            (vehicle: GarageVehicle) => (vehicle?.lot?.unlockDay || 1) > 1,
          );
        if (hasImpossibleOrphan) {
          window.localStorage.removeItem("cardealer-save-v2");
          window.localStorage.removeItem("cardealer-garage");
          garageVehiclesRef.current = [];
          setGarageVehicles([]);
          setOwned(false);
          setOwnedLot(null);
          setActiveGarageId(null);
          garageLoadedRef.current = true;
          setSaveReady(true);
          return;
        }
        if (typeof savedGame.balance === "number") setBalance(savedGame.balance);
        if (typeof savedGame.day === "number") setDay(savedGame.day);
        if (typeof savedGame.reputation === "number")
          setReputation(savedGame.reputation);
        if (typeof savedGame.xp === "number") setXp(savedGame.xp);
        if (typeof savedGame.completedDeals === "number")
          setCompletedDeals(savedGame.completedDeals);
        if (typeof savedGame.dealStreak === "number")
          setDealStreak(savedGame.dealStreak);
        if (Array.isArray(savedGame.closedLotIds))
          setClosedLotIds(savedGame.closedLotIds);
        if (Array.isArray(savedGame.favoriteLotIds))
          setFavoriteLotIds(savedGame.favoriteLotIds);
        if (Array.isArray(savedGame.clientLeads))
          setClientLeads(savedGame.clientLeads);
        if (Array.isArray(savedGame.acceptedContracts))
          setAcceptedContracts(savedGame.acceptedContracts);
        if (Array.isArray(savedGame.declinedLeadIds))
          setDeclinedLeadIds(savedGame.declinedLeadIds);
        if (savedGame.resolvedLeadDays && typeof savedGame.resolvedLeadDays === "object")
          setResolvedLeadDays(savedGame.resolvedLeadDays);
        if (Array.isArray(savedGame.vinReports))
          setVinReports(savedGame.vinReports);
        if (savedGame.chatReplies && typeof savedGame.chatReplies === "object")
          setChatReplies(savedGame.chatReplies);
        if (
          savedGame.budgetNegotiations &&
          typeof savedGame.budgetNegotiations === "object"
        )
          setBudgetNegotiations(savedGame.budgetNegotiations);
        if (
          savedGame.contractAcceptedDays &&
          typeof savedGame.contractAcceptedDays === "object"
        )
          setContractAcceptedDays(savedGame.contractAcceptedDays);
        if (typeof savedGame.activeChat === "string")
          setActiveChat(savedGame.activeChat);
        if (typeof savedGame.alexOrderDeclined === "boolean")
          setAlexOrderDeclined(savedGame.alexOrderDeclined);
        if (typeof savedGame.alexResolvedDay === "number")
          setAlexResolvedDay(savedGame.alexResolvedDay);
        if (typeof savedGame.auctionFavoritesOnly === "boolean")
          setAuctionFavoritesOnly(savedGame.auctionFavoritesOnly);
        if (typeof savedGame.loanPrincipal === "number")
          setLoanPrincipal(savedGame.loanPrincipal);
        if (typeof savedGame.loanBalance === "number")
          setLoanBalance(savedGame.loanBalance);
        if (typeof savedGame.loanPayment === "number")
          setLoanPayment(savedGame.loanPayment);
        if (typeof savedGame.loanRate === "number")
          setLoanRate(savedGame.loanRate);
        if (typeof savedGame.loanTerm === "number")
          setLoanTerm(savedGame.loanTerm);
        if (typeof savedGame.paymentsMade === "number")
          setPaymentsMade(savedGame.paymentsMade);
        if (typeof savedGame.repairTimeCreditMinutes === "number")
          setRepairTimeCreditMinutes(savedGame.repairTimeCreditMinutes);
        if (typeof savedGame.nextCycleAt === "number")
          setNextCycleAt(Math.max(Date.now() + 30_000, savedGame.nextCycleAt));
        if (Array.isArray(savedGame.auctionVisibleIds))
          setAuctionVisibleIds(savedGame.auctionVisibleIds);
        if (typeof savedGame.nextAuctionLotAt === "number")
          setNextAuctionLotAt(Math.max(Date.now() + 15_000, savedGame.nextAuctionLotAt));
        if (Array.isArray(savedGame.companyUpgrades))
          setCompanyUpgrades(() => {
            const legacyUpgradeMap: Record<string, CompanyUpgradeId> = {
              "garage-2": "garage-step-1",
              "garage-3": "garage-step-2",
              broker: "auction-step-1",
              "parts-club": "parts-step-1",
              "service-master": "service-step-1",
              marketing: "marketing-step-1",
            };
            return [
              ...new Set(
                savedGame.companyUpgrades
                  .map((id: unknown) =>
                    typeof id === "string" ? legacyUpgradeMap[id] || id : "",
                  )
                  .filter((id: string) =>
                    companyUpgradeCatalog.some((upgrade) => upgrade.id === id),
                  ),
              ),
            ] as CompanyUpgradeId[];
          });
        if (Array.isArray(savedGame.unlockedAchievementIds))
          setUnlockedAchievementIds(
            savedGame.unlockedAchievementIds.filter((id: unknown) =>
              typeof id === "string" &&
              gameAchievements.some((achievement) => achievement.id === id),
            ),
          );
        if (typeof savedGame.sold === "boolean") setSold(savedGame.sold);
        if (savedGame.dealResult) setDealResult(savedGame.dealResult);
        if (savedGame.pendingPurchase) setPendingPurchase(savedGame.pendingPurchase);
        if (savedGame.selectedReport !== undefined)
          setSelectedReport(savedGame.selectedReport);
        const validScreens: Screen[] = [
          "desktop", "auction", "garage", "parts", "service", "messages", "mail", "bank", "development",
        ];
        if (validScreens.includes(savedGame.screen)) setScreen(savedGame.screen);

        const savedGarage = Array.isArray(savedGame.garageVehicles)
          ? (savedGame.garageVehicles as GarageVehicle[])
          : [];
        const valid = savedGarage
          .filter((vehicle) => vehicle?.lot && typeof vehicle.id === "number")
          .map((vehicle) => ({
            ...vehicle,
            lot: lots.find((lot) => lot.id === vehicle.id) || vehicle.lot,
          }));
        if (valid.length) {
          garageVehiclesRef.current = valid;
          setGarageVehicles(valid);
          const active =
            valid.find((vehicle) => vehicle.id === savedGame.activeGarageId) ||
            valid[0];
          loadGarageVehicle(active);
        }
      } catch {
        window.localStorage.removeItem("cardealer-save-v2");
      }
    } else {
      // Remove the old garage-only save: it caused an orphan vehicle to appear
      // while every other part of the game returned to day one.
      window.localStorage.removeItem("cardealer-garage");
      garageVehiclesRef.current = [];
      setGarageVehicles([]);
      setOwned(false);
      setOwnedLot(null);
      setActiveGarageId(null);
    }
    const savedFavorites = window.localStorage.getItem(
      "cardealer-favorite-lots",
    );
    if (!unifiedSave && savedFavorites) {
      try {
        setFavoriteLotIds(JSON.parse(savedFavorites));
      } catch {
        window.localStorage.removeItem("cardealer-favorite-lots");
      }
    }
    garageLoadedRef.current = true;
    setSaveReady(true);
  }, []);
  useEffect(() => {
    if (!saveReady || !profileReady || tutorialStatus !== "active") return;
    if (lastTutorialStage.current === tutorialStage) return;
    lastTutorialStage.current = tutorialStage;
    const timer = window.setTimeout(() => setTutorialOpen(true), 420);
    return () => window.clearTimeout(timer);
  }, [profileReady, saveReady, tutorialStage, tutorialStatus]);
  useEffect(() => {
    if (!tutorialOpen || tutorialStatus !== "active") {
      setTutorialTypedText("");
      return;
    }
    const fullText = tutorialStep.text;
    setTutorialTypedText("");
    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setTutorialTypedText(fullText.slice(0, index));
      if (index % 3 === 0 && fullText[index - 1] !== " ") {
        playGameSound("type", soundEnabled);
      }
      if (index >= fullText.length) window.clearInterval(timer);
    }, 18);
    return () => window.clearInterval(timer);
  }, [tutorialOpen, tutorialStage, tutorialStatus, tutorialStep.text, soundEnabled]);
  useEffect(() => {
    if (!saveReady) return;
    const current = currentGarageSnapshot();
    const savedGarage = current
      ? garageVehiclesRef.current.map((vehicle) =>
          vehicle.id === current.id ? current : vehicle,
        )
      : garageVehiclesRef.current;
    const serializedSave = JSON.stringify({
        screen,
        balance,
        day,
        reputation,
        xp,
        completedDeals,
        dealStreak,
        closedLotIds,
        favoriteLotIds,
        auctionFavoritesOnly,
        activeChat,
        clientLeads,
        chatReplies,
        budgetNegotiations,
        declinedLeadIds,
        resolvedLeadDays,
        acceptedContracts,
        contractAcceptedDays,
        alexOrderDeclined,
        alexResolvedDay,
        vinReports,
        selectedReport,
        loanPrincipal,
        loanBalance,
        loanPayment,
        loanRate,
        loanTerm,
        paymentsMade,
        repairTimeCreditMinutes,
        nextCycleAt,
        auctionVisibleIds,
        nextAuctionLotAt,
        companyUpgrades,
        unlockedAchievementIds,
        sold,
        dealResult,
        pendingPurchase,
        activeGarageId,
        garageVehicles: savedGarage,
      });
    window.localStorage.setItem("cardealer-save-v2", serializedSave);
    if (cloudHydratedRef.current && cloudPlayerRef.current) {
      if (cloudSaveTimerRef.current) window.clearTimeout(cloudSaveTimerRef.current);
      cloudSaveTimerRef.current = window.setTimeout(() => {
        const savedAt = Date.now();
        window.localStorage.setItem("cardealer-save-updated-at", String(savedAt));
        void cloudPlayerRef.current
          ?.setData(
            {
              cardealerSave: serializedSave,
              playerName,
              companyName,
              tutorialStatus,
              language,
              savedAt,
            },
            true,
          )
          .catch(() => undefined);
      }, 1200);
    }
  });
  useEffect(() => {
    if (!saveReady || achievementToastId) return;
    const nextAchievement = gameAchievements.find(
      (achievement) =>
        !unlockedAchievementIds.includes(achievement.id) &&
        achievementProgress(achievement) >= achievement.target,
    );
    if (!nextAchievement) return;
    setUnlockedAchievementIds((ids) => [...ids, nextAchievement.id]);
    setBalance((value) => value + nextAchievement.reward);
    setAchievementToastId(nextAchievement.id);
    playGameSound("success", soundEnabled);
  }, [
    saveReady,
    achievementToastId,
    unlockedAchievementIds,
    completedDeals,
    vinReports.length,
    favoriteLotIds.length,
    reputation,
    companyLevel,
    companyUpgrades.length,
    dealStreak,
    garageVehicles.length,
    rouletteLastSpinAt,
    balance,
    soundEnabled,
  ]);
  useEffect(() => {
    if (!achievementToastId) return;
    const timer = window.setTimeout(() => setAchievementToastId(null), 4800);
    return () => window.clearTimeout(timer);
  }, [achievementToastId]);
  useEffect(() => {
    window.localStorage.setItem("cardealer-language", language);
    document.documentElement.lang = language;
    if (language !== "en") return;

    const root = document.querySelector<HTMLElement>(".game-shell");
    if (!root) return;
    const translateTextNode = (node: Node) => {
      if (node.nodeType !== Node.TEXT_NODE) return;
      const parent = node.parentElement;
      if (!parent || parent.closest("script, style, [data-no-translate]")) return;
      const current = node.nodeValue || "";
      const translated = translateGameText(current);
      if (translated !== current) node.nodeValue = translated;
    };
    const translateAttributes = (element: Element) => {
      for (const attribute of ["placeholder", "title", "aria-label"]) {
        const value = element.getAttribute(attribute);
        if (!value) continue;
        const translated = translateGameText(value);
        if (translated !== value) element.setAttribute(attribute, translated);
      }
    };
    const translateTree = (target: Node) => {
      if (target.nodeType === Node.TEXT_NODE) {
        translateTextNode(target);
        return;
      }
      if (!(target instanceof Element)) return;
      if (target.closest("script, style, [data-no-translate]")) return;

      translateAttributes(target);
      const walker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT);
      let node = walker.nextNode();
      while (node) {
        translateTextNode(node);
        node = walker.nextNode();
      }
      for (const element of target.querySelectorAll(
        "[placeholder], [title], [aria-label]",
      )) {
        translateAttributes(element);
      }
    };
    translateTree(root);

    let frame = 0;
    const pendingNodes = new Set<Node>();
    let observer: MutationObserver;
    const flushTranslations = () => {
      frame = 0;
      const nodes = [...pendingNodes];
      pendingNodes.clear();
      for (const node of nodes) translateTree(node);
      // Translation writes also create mutation records. Drop those records so
      // the observer does not repeatedly translate its own DOM changes.
      observer.takeRecords();
    };
    observer = new MutationObserver((records) => {
      for (const record of records) {
        if (record.type === "childList") {
          for (const node of record.addedNodes) pendingNodes.add(node);
        } else {
          pendingNodes.add(record.target);
        }
      }
      if (!frame && pendingNodes.size) {
        frame = window.requestAnimationFrame(flushTranslations);
      }
    });
    observer.observe(root, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["placeholder", "title", "aria-label"],
    });
    return () => {
      observer.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
      pendingNodes.clear();
    };
  }, [language]);
  useEffect(() => {
    const savedSound = window.localStorage.getItem("cardealer-sound");
    if (savedSound === "off") setSoundEnabled(false);
    const savedMusicVolume = Number(
      window.localStorage.getItem("cardealer-music-volume") || 11,
    );
    if (Number.isFinite(savedMusicVolume)) {
      setMusicVolume(Math.max(0, Math.min(100, savedMusicVolume)));
    }
  }, []);
  useEffect(() => {
    window.localStorage.setItem(
      "cardealer-sound",
      soundEnabled ? "on" : "off",
    );
  }, [soundEnabled]);
  useEffect(() => {
    window.localStorage.setItem("cardealer-music-volume", String(musicVolume));
  }, [musicVolume]);
  useEffect(() => {
    if (lastSoundToast.current === toast) return;
    lastSoundToast.current = toast;
    const normalized = toast.toLowerCase();
    if (
      normalized.includes("недостаточно") ||
      normalized.includes("потерян") ||
      normalized.includes("отказ") ||
      normalized.includes("просроч")
    ) {
      playGameSound("error", soundEnabled);
    } else if (
      normalized.includes("зачислен") ||
      normalized.includes("купил") ||
      normalized.includes("продан")
    ) {
      playGameSound("money", soundEnabled);
    } else if (
      normalized.includes("готов") ||
      normalized.includes("заверш") ||
      normalized.includes("подписан")
    ) {
      playGameSound("success", soundEnabled);
    } else {
      playGameSound("notification", soundEnabled);
    }
  }, [toast, soundEnabled]);
  useEffect(() => {
    if (!saveReady || !profileReady) return;
    const arrivedToday = clientLeads.filter((lead) => lead.day === day).length;
    const dailyLimit = (day + reputation) % 3 === 0 ? 3 : 2;
    if (arrivedToday >= dailyLimit) return;
    const usedNames = new Set(clientLeads.map((lead) => lead.name));
    const hasAuctionLot = (template: Omit<ClientLead, "id" | "day" | "read">) =>
      lots.some(
        (lot) =>
          !closedLotIds.includes(lot.id) &&
          leadMatchesLot(template as ClientLead, lot),
      );
    const unusedTemplates = clientPool.filter(
      (template) => !usedNames.has(template.name) && hasAuctionLot(template),
    );
    const recentNames = new Set(clientLeads.slice(0, 3).map((lead) => lead.name));
    const availableTemplates = unusedTemplates.length
      ? unusedTemplates
      : clientPool.filter(
          (template) => !recentNames.has(template.name) && hasAuctionLot(template),
        );
    if (!availableTemplates.length) return;
    const baseDelay = arrivedToday === 0 ? 18_000 : 45_000;
    const randomWindow = arrivedToday === 0 ? 20_000 : 40_000;
    const timer = window.setTimeout(() => {
      const template =
        availableTemplates[
          (day * 7 + arrivedToday * 3 + completedDeals) %
            availableTemplates.length
        ];
      const lead: ClientLead = {
        ...template,
        id: `${day}-${template.initials}-${Date.now()}`,
        day,
        read: false,
      };
      const matchingLots = lots.filter(
        (lot) => !closedLotIds.includes(lot.id) && leadMatchesLot(lead, lot),
      );
      const safeLot = matchingLots.find((lot) => lot.risk === "Низкий");
      const riskyLot = matchingLots.find((lot) => lot.risk === "Высокий");
      setAuctionVisibleIds((ids) => [
        ...new Set([
          ...(safeLot ? [safeLot.id] : []),
          ...(riskyLot ? [riskyLot.id] : []),
          ...ids,
        ]),
      ].slice(0, 14));
      setClientLeads((leads) => [lead, ...leads]);
      setIncomingLeadClosing(false);
      setIncomingLead(lead);
      playGameSound("notification", soundEnabled);
    }, baseDelay + Math.round(Math.random() * randomWindow));
    return () => window.clearTimeout(timer);
  }, [
    day,
    auctionVisibleIds,
    closedLotIds,
    clientLeads,
    completedDeals,
    profileReady,
    reputation,
    saveReady,
    soundEnabled,
  ]);
  useEffect(() => {
    if (!saveReady) return;
    setClientLeads((leads) => {
      const filtered = leads.filter(
        (lead) =>
          acceptedContracts.includes(lead.id) ||
          resolvedLeadDays[lead.id] !== undefined ||
          lots.some(
            (lot) =>
              auctionVisibleIds.includes(lot.id) &&
              !closedLotIds.includes(lot.id) &&
              leadMatchesLot(lead, lot),
          ),
      );
      return filtered.length === leads.length ? leads : filtered;
    });
  }, [saveReady, day, auctionVisibleIds, closedLotIds, acceptedContracts, resolvedLeadDays]);
  useEffect(() => {
    if (!incomingLead) return;
    const timer = window.setTimeout(() => {
      setIncomingLeadClosing(true);
      incomingLeadCloseTimer.current = window.setTimeout(() => {
        setIncomingLead(null);
        setIncomingLeadClosing(false);
      }, 320);
    }, 11_000);
    return () => window.clearTimeout(timer);
  }, [incomingLead]);
  useEffect(() => {
    setToastVisible(true);
    const timer = window.setTimeout(() => setToastVisible(false), 5_500);
    return () => window.clearTimeout(timer);
  }, [toast]);
  useEffect(
    () => () => {
      if (incomingLeadCloseTimer.current)
        window.clearTimeout(incomingLeadCloseTimer.current);
    },
    [],
  );
  function toggleFavoriteLot(lot: (typeof lots)[number]) {
    setFavoriteLotIds((values) => {
      const isFavorite = values.includes(lot.id);
      const next = isFavorite
        ? values.filter((id) => id !== lot.id)
        : [...values, lot.id];
      window.localStorage.setItem(
        "cardealer-favorite-lots",
        JSON.stringify(next),
      );
      setToast(
        isFavorite
          ? `${lot.title} удалена из избранного`
          : `${lot.title} добавлена в избранное`,
      );
      return next;
    });
  }
  useEffect(() => {
    if (!ownedLot) return;
    const title = ownedLot.title.toLowerCase();
    setShopVehicle(
      title.includes("accord")
        ? "accord"
        : title.includes("mustang")
          ? "mustang"
          : title.includes("rav4")
            ? "rav4"
            : title.includes("lexus")
              ? "lexus"
              : title.includes("mercedes")
                ? "mercedes"
                : title.includes("challenger")
                  ? "challenger"
                  : title.includes("audi")
                    ? "audi"
                    : title.includes("tiguan")
                      ? "tiguan"
                      : title.includes("mazda")
                        ? "mazda"
                      : title.includes("subaru")
                          ? "subaru"
                          : title.includes("altima")
                            ? "altima"
                            : title.includes("sonata")
                              ? "sonata"
                              : title.includes("kia k5")
                                ? "k5"
                                : title.includes("malibu")
                                  ? "malibu"
                                  : title.includes("rogue")
                                    ? "rogue"
                                    : title.includes("grand cherokee")
                                      ? "cherokee"
                                      : title.includes("volvo xc60")
                                        ? "xc60"
                                        : title.includes("acura rdx")
                                          ? "rdx"
                                          : title.includes("infiniti qx50")
                                            ? "qx50"
                                            : title.includes("camaro")
                                              ? "camaro"
                          : title.includes("bmw")
                            ? "bmw"
                            : title.includes("tesla")
                              ? "tesla"
                              : title.includes("cayenne")
                                ? "cayenne"
                                : "camry",
    );
  }, [ownedLot]);
  useEffect(() => {
    if (!garageLoadedRef.current || activeGarageId === null || !ownedLot)
      return;
    const snapshot = currentGarageSnapshot();
    if (!snapshot) return;
    const updated = garageVehiclesRef.current.map((vehicle) =>
      vehicle.id === activeGarageId ? snapshot : vehicle,
    );
    garageVehiclesRef.current = updated;
    setGarageVehicles(updated);
    window.localStorage.setItem("cardealer-garage", JSON.stringify(updated));
  }, [
    activeGarageId,
    ownedLot,
    purchasePrice,
    auctionFeePaid,
    ownedImage,
    diagnosed,
    ordered,
    orderedAtDay,
    partSuppliers,
    selectedPartOptions,
    delivered,
    repaired,
    shippingPlan,
    arrivalDay,
    repairCompleteDay,
    repairCompleteAt,
    negotiationRound,
    clientWalkedAway,
    askingPrice,
    listedDay,
    assignedContractId,
  ]);
  useEffect(() => {
    if (repairCompleteAt !== null && clockNow >= repairCompleteAt && !repaired) {
      setRepaired(true);
      setRepairCompleteAt(null);
      setToast(
        `Ремонт ${ownedLot?.title || "автомобиля"} завершён. Машина готова к продаже`,
      );
    }
  }, [clockNow, repairCompleteAt, repaired, ownedLot]);
  useEffect(() => {
    if (!rewardAdOpen || rewardAdSeconds <= 0) return;
    const timer = window.setTimeout(
      () => setRewardAdSeconds((v) => v - 1),
      1000,
    );
    return () => window.clearTimeout(timer);
  }, [rewardAdOpen, rewardAdSeconds]);
  useEffect(() => {
    const savedSpin = Number(
      window.localStorage.getItem("cardealer-roulette-last") || 0,
    );
    if (Number.isFinite(savedSpin)) setRouletteLastSpinAt(savedSpin);
    const timer = window.setInterval(() => setClockNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  useEffect(() => {
    if (!saveReady || !profileReady || clockNow < nextCycleAt) return;
    setNextCycleAt(Date.now() + 10 * 60 * 1000);
    nextDay();
  }, [clockNow, nextCycleAt, saveReady, profileReady]);
  useEffect(() => {
    if (!saveReady || !profileReady || clockNow < nextAuctionLotAt) return;
    const candidates = lots.filter(
      (lot) =>
        !auctionVisibleIds.includes(lot.id) && !closedLotIds.includes(lot.id),
    );
    if (candidates.length) {
      const nextLot = candidates[Math.floor(Math.random() * candidates.length)];
      setAuctionVisibleIds((ids) => {
        const next = [nextLot.id, ...ids];
        if (next.length <= 12) return next;
        const removableIndex = next.findLastIndex(
          (id) => !favoriteLotIds.includes(id) && id !== nextLot.id,
        );
        if (removableIndex >= 0) next.splice(removableIndex, 1);
        return next.slice(0, 12);
      });
      setToast(`На аукционе появился новый лот: ${nextLot.title}`);
    }
    setNextAuctionLotAt(
      Date.now() + (90 + Math.floor(Math.random() * 91)) * 1000,
    );
  }, [
    clockNow,
    nextAuctionLotAt,
    saveReady,
    profileReady,
    auctionVisibleIds,
    closedLotIds,
    favoriteLotIds,
  ]);
  useEffect(() => {
    const audio = musicRef.current;
    if (!audio) return;
    audio.volume = musicVolume / 100;
    if (musicVolume === 0 || !profileReady) {
      audio.pause();
      return;
    }
    void audio.play().catch(() => {
      // Browsers allow background music after the first player interaction.
    });
  }, [musicVolume, profileReady]);
  useEffect(() => {
    const startMusic = () => {
      if (musicVolume === 0 || !profileReady || !musicRef.current) return;
      musicRef.current.volume = musicVolume / 100;
      void musicRef.current.play().catch(() => undefined);
    };
    window.addEventListener("pointerdown", startMusic, { once: true });
    return () => window.removeEventListener("pointerdown", startMusic);
  }, [musicVolume, profileReady]);
  useEffect(() => {
    const host = window.location.hostname;
    const isLocal =
      host === "localhost" ||
      host === "127.0.0.1" ||
      host === "0.0.0.0" ||
      /^192\.168\./.test(host) ||
      /^10\./.test(host) ||
      /^172\.(1[6-9]|2\d|3[01])\./.test(host);
    if (isLocal) return;

    let sdk: YandexGamesSdk | null = null;
    let resumeMusic = false;
    const pauseGame = () => {
      const audio = musicRef.current;
      resumeMusic = Boolean(audio && !audio.paused);
      audio?.pause();
      sdk?.features?.GameplayAPI?.stop();
    };
    const resumeGame = () => {
      sdk?.features?.GameplayAPI?.start();
      if (resumeMusic && musicRef.current) {
        void musicRef.current.play().catch(() => undefined);
      }
      resumeMusic = false;
    };
    const handleVisibility = () => {
      if (document.hidden) pauseGame();
      else resumeGame();
    };

    void loadYandexGamesSdk().then(async (loadedSdk) => {
      if (!loadedSdk) return;
      sdk = loadedSdk;
      sdk.features?.LoadingAPI?.ready();
      sdk.features?.GameplayAPI?.start();
      if (!window.localStorage.getItem("cardealer-language-manual")) {
        setLanguage(loadedSdk.environment?.i18n?.lang?.startsWith("en") ? "en" : "ru");
      }
      if (loadedSdk.getPlayer) {
        try {
          const player = await loadedSdk.getPlayer({ scopes: false });
          const cloud = await player.getData([
            "cardealerSave",
            "playerName",
            "companyName",
            "tutorialStatus",
            "language",
            "savedAt",
          ]);
          const remoteSavedAt = Number(cloud.savedAt) || 0;
          const localSavedAt = Number(
            window.localStorage.getItem("cardealer-save-updated-at"),
          ) || 0;
          if (
            typeof cloud.cardealerSave === "string" &&
            remoteSavedAt > localSavedAt
          ) {
            window.localStorage.setItem("cardealer-save-v2", cloud.cardealerSave);
            window.localStorage.setItem(
              "cardealer-save-updated-at",
              String(remoteSavedAt),
            );
            if (typeof cloud.playerName === "string") {
              window.localStorage.setItem("autoimport-player-name", cloud.playerName);
            }
            if (typeof cloud.companyName === "string") {
              window.localStorage.setItem("autoimport-company-name", cloud.companyName);
            }
            if (typeof cloud.tutorialStatus === "string") {
              window.localStorage.setItem(
                "cardealer-tutorial-status",
                cloud.tutorialStatus,
              );
            }
            if (cloud.language === "ru" || cloud.language === "en") {
              window.localStorage.setItem("cardealer-language", cloud.language);
            }
            window.location.reload();
            return;
          }
          cloudPlayerRef.current = player;
          cloudHydratedRef.current = true;
          const localSave = window.localStorage.getItem("cardealer-save-v2");
          if (localSave) {
            const savedAt = Date.now();
            window.localStorage.setItem("cardealer-save-updated-at", String(savedAt));
            void player.setData(
              {
                cardealerSave: localSave,
                playerName:
                  window.localStorage.getItem("autoimport-player-name") || "",
                companyName:
                  window.localStorage.getItem("autoimport-company-name") || "",
                tutorialStatus:
                  window.localStorage.getItem("cardealer-tutorial-status") ||
                  "active",
                language:
                  window.localStorage.getItem("cardealer-language") || "ru",
                savedAt,
              },
              true,
            ).catch(() => undefined);
          }
        } catch {
          // The game remains playable with a local save if cloud storage is unavailable.
        }
      }
      sdk.on?.("game_api_pause", pauseGame);
      sdk.on?.("game_api_resume", resumeGame);
    });
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      sdk?.off?.("game_api_pause", pauseGame);
      sdk?.off?.("game_api_resume", resumeGame);
    };
  }, []);

  function saveProfile() {
    const clean = nameDraft.trim();
    const company = companyDraft.trim();
    if (clean.length < 2 || company.length < 2) return;
    setPlayerName(clean);
    setCompanyName(company);
    setProfileReady(true);
    setNextCycleAt(Date.now() + 10 * 60 * 1000);
    setNextAuctionLotAt(Date.now() + 2 * 60 * 1000);
    setTutorialStatus("active");
    setTutorialOpen(true);
    lastTutorialStage.current = "contract";
    window.localStorage.setItem("autoimport-player-name", clean);
    window.localStorage.setItem("autoimport-company-name", company);
    window.localStorage.removeItem("cardealer-tutorial-status");
    setToast(`Компания ${company} зарегистрирована`);
  }
  function requestVin(lot: (typeof lots)[number]) {
    if (vinReports.includes(lot.id)) {
      setSelectedReport(lot.id);
      setVinModalOpen(true);
      return;
    }
    if (balance < vinReportPrice)
      return setToast("Недостаточно денег для VIN-проверки");
    setBalance((b) => b - vinReportPrice);
    setVinReports((ids) => [...ids, lot.id]);
    setSelectedReport(lot.id);
    setVinModalOpen(true);
    setToast(
      `VIN-проверка завершена${firstServiceOrderFree ? " бесплатно" : ""}: ${lot.risk.toLowerCase()} риск`,
    );
  }

  function buyCar(lot: (typeof lots)[number], winningBid?: number) {
    if (occupiedGarageSlots >= garageCapacity) {
      setToast(
        `Гараж заполнен: ${garageVehicles.length}/${garageCapacity}. Купите новое место в развитии компании`,
      );
      setScreen("development");
      return;
    }
    const finalPrice = winningBid || lot.bid + 1200;
    setClosedLotIds((ids) => [...new Set([...ids, lot.id])]);
    setPendingPurchase({ lot, bid: finalPrice });
    setShippingPlan("standard");
    setScreen("garage");
  }
  function currentGarageSnapshot(): GarageVehicle | null {
    if (!ownedLot) return null;
    return {
      id: ownedLot.id,
      lot: ownedLot,
      purchasePrice,
      auctionFeePaid,
      ownedImage,
      diagnosed,
      ordered,
      orderedAtDay,
      partSuppliers,
      selectedPartOptions,
      delivered,
      repaired,
      shippingPlan,
      arrivalDay,
      repairCompleteDay,
      repairCompleteAt,
      negotiationRound,
      clientWalkedAway,
      askingPrice,
      listedDay,
      assignedContractId,
    };
  }
  function loadGarageVehicle(vehicle: GarageVehicle) {
    setActiveGarageId(vehicle.id);
    setOwned(true);
    setOwnedLot(vehicle.lot);
    setPurchasePrice(vehicle.purchasePrice);
    setAuctionFeePaid(vehicle.auctionFeePaid ?? 150);
    setOwnedImage(vehicle.ownedImage);
    setDiagnosed(vehicle.diagnosed);
    setOrdered(vehicle.ordered);
    setOrderedAtDay(vehicle.orderedAtDay);
    setPartSuppliers(vehicle.partSuppliers);
    setSelectedPartOptions(vehicle.selectedPartOptions);
    setDelivered(vehicle.delivered);
    setRepaired(vehicle.repaired);
    setShippingPlan(vehicle.shippingPlan);
    setArrivalDay(vehicle.arrivalDay);
    setRepairCompleteDay(vehicle.repairCompleteDay);
    setRepairCompleteAt(vehicle.repairCompleteAt ?? null);
    setNegotiationRound(vehicle.negotiationRound);
    setClientWalkedAway(vehicle.clientWalkedAway);
    setAskingPrice(vehicle.askingPrice);
    setListedDay(vehicle.listedDay);
    setAssignedContractId(vehicle.assignedContractId);
    setSold(false);
  }
  function selectGarageVehicle(id: number) {
    const current = currentGarageSnapshot();
    if (current) {
      garageVehiclesRef.current = garageVehiclesRef.current.map((vehicle) =>
        vehicle.id === current.id ? current : vehicle,
      );
      setGarageVehicles(garageVehiclesRef.current);
    }
    const next = garageVehiclesRef.current.find((vehicle) => vehicle.id === id);
    if (next) loadGarageVehicle(next);
  }
  function linkGarageVehicleToLead(
    lead: ClientLead,
    vehicle: GarageVehicle,
  ) {
    if (!acceptedContracts.includes(lead.id)) {
      setToast("Сначала подтвердите бюджет и условия контракта");
      return;
    }
    if (
      vehicle.assignedContractId &&
      vehicle.assignedContractId !== lead.id
    ) {
      setToast("Этот автомобиль уже связан с другим контрактом");
      return;
    }
    const current = currentGarageSnapshot();
    const savedGarage = current
      ? garageVehiclesRef.current.map((item) =>
          item.id === current.id ? current : item,
        )
      : garageVehiclesRef.current;
    const updated = savedGarage.map((item) =>
      item.id === vehicle.id
        ? { ...item, assignedContractId: lead.id }
        : item.assignedContractId === lead.id
          ? { ...item, assignedContractId: null }
          : item,
    );
    const linked = updated.find((item) => item.id === vehicle.id);
    if (!linked) return;
    garageVehiclesRef.current = updated;
    setGarageVehicles(updated);
    window.localStorage.setItem("cardealer-garage", JSON.stringify(updated));
    loadGarageVehicle(linked);
    setToast(`${vehicle.lot.title} связан с контрактом ${lead.name}`);
    if (!linked.repaired) setScreen("garage");
  }
  function confirmPurchase() {
    if (!pendingPurchase) return;
    if (garageVehicles.length >= garageCapacity) {
      setToast("Нет свободного места. Сначала расширьте гараж");
      setScreen("development");
      return;
    }
    const { lot, bid: finalPrice } = pendingPurchase;
    const plan = shippingPlans[shippingPlan];
    const effectivePurchasePrice = firstServiceOrderFree ? 0 : finalPrice;
    const effectiveShippingPrice = firstServiceOrderFree ? 0 : plan.price;
    const total = effectivePurchasePrice + effectiveShippingPrice;
    const automaticContractId =
      activeContracts.find((contract) => leadMatchesLot(contract, lot))?.id ??
      null;
    if (automaticContractId) {
      const contract = activeContracts.find(
        (lead) => lead.id === automaticContractId,
      );
      if (contract && !leadMatchesLot(contract, lot))
        return setToast(
          `${lot.title} не соответствует контракту ${contract.name}`,
        );
    }
    if (balance < total)
      return setToast(
        `Для оформления не хватает ${money(total - balance)}. Откройте банк.`,
      );
    const previous = currentGarageSnapshot();
    const newVehicle: GarageVehicle = {
      id: lot.id,
      lot,
      purchasePrice: effectivePurchasePrice,
      auctionFeePaid: auctionFee,
      ownedImage: lot.image,
      diagnosed: false,
      ordered: [],
      orderedAtDay: {},
      partSuppliers: {},
      selectedPartOptions: {},
      delivered: [],
      repaired: false,
      shippingPlan,
      arrivalDay: day + plan.days,
      repairCompleteDay: null,
      repairCompleteAt: null,
      negotiationRound: 0,
      clientWalkedAway: false,
      askingPrice: suggestedSalePrice(lot, finalPrice),
      listedDay: null,
      assignedContractId: automaticContractId,
    };
    const savedVehicles = previous
      ? garageVehiclesRef.current.map((vehicle) =>
          vehicle.id === previous.id ? previous : vehicle,
        )
      : garageVehiclesRef.current;
    const nextGarage = [
      ...savedVehicles.filter((vehicle) => vehicle.id !== lot.id),
      newVehicle,
    ];
    garageVehiclesRef.current = nextGarage;
    setGarageVehicles(nextGarage);
    window.localStorage.setItem("cardealer-garage", JSON.stringify(nextGarage));
    setActiveGarageId(lot.id);
    setOwned(true);
    setOwnedLot(lot);
    setAuctionFeePaid(auctionFee);
    setSold(false);
    setDiagnosed(false);
    setOrdered([]);
    setOrderedAtDay({});
    setPartSuppliers({});
    setSelectedPartOptions({});
    setDelivered([]);
    setRepaired(false);
    setNegotiationRound(0);
    setClientWalkedAway(false);
    setListedDay(null);
    setAskingPrice(suggestedSalePrice(lot, finalPrice));
    setAssignedContractId(automaticContractId);
    setPurchasePrice(effectivePurchasePrice);
    setOwnedImage(lot.image);
    setBalance((b) => b - total);
    setArrivalDay(day + plan.days);
    setRepairCompleteDay(null);
    setRepairCompleteAt(null);
    setPendingPurchase(null);
    setToast(
      firstServiceOrderFree
        ? `Учебный грант оплатил ${lot.title} и доставку. С баланса ничего не списано`
        : plan.days
          ? `Договор подписан. ${lot.title} прибудет примерно через ${plan.days * 10} мин.`
          : `Договор подписан. ${lot.title} уже в вашем гараже`,
    );
    setScreen("garage");
  }
  function openAuction(lot: (typeof lots)[number]) {
    if (occupiedGarageSlots >= garageCapacity) {
      setToast(
        `Все места заняты: ${occupiedGarageSlots}/${garageCapacity}. Расширьте гараж`,
      );
      setScreen("development");
      return;
    }
    setAuctionLot(lot);
    setScreen("liveAuction");
  }
  function navigateTo(target: Screen) {
    if (screen === "liveAuction" && auctionLot && target !== "liveAuction") {
      setClosedLotIds((ids) => [...new Set([...ids, auctionLot.id])]);
      setToast(
        `Вы покинули аукционный зал. Лот #${43820 + auctionLot.id} потерян`,
      );
    }
    setScreen(target);
  }
  function handleTutorialAction() {
    if (tutorialStage === "finish") {
      setTutorialStatus("completed");
      setTutorialOpen(false);
      window.localStorage.setItem("cardealer-tutorial-status", "completed");
      setScreen("desktop");
      setToast("Обучение завершено. Алекс остаётся на связи");
      return;
    }
    if (tutorialStage === "contract" || tutorialStage === "sale") {
      setActiveChat("client");
    }
    navigateTo(tutorialTargetScreen);
    setTutorialOpen(false);
  }
  function skipTutorial() {
    setTutorialStatus("skipped");
    setTutorialOpen(false);
    window.localStorage.setItem("cardealer-tutorial-status", "skipped");
    setToast("Обучение пропущено. Все разделы доступны");
  }
  function registerAuction() {
    if (balance < auctionFee) {
      setToast(`Для участия в торгах требуется ${money(auctionFee)}`);
      return false;
    }
    setBalance((b) => b - auctionFee);
    setToast(
      firstServiceOrderFree
        ? "Регистрация подтверждена · учебный сбор бесплатный"
        : `Регистрация подтверждена · сбор ${money(auctionFee)} списан`,
    );
    return true;
  }

  function buyCompanyUpgrade(upgradeId: CompanyUpgradeId) {
    const upgrade = companyUpgradeCatalog.find((item) => item.id === upgradeId);
    if (!upgrade || hasCompanyUpgrade(upgradeId)) return;
    if (companyLevel < upgrade.level) {
      setToast(`Улучшение откроется на уровне ${upgrade.level}`);
      return;
    }
    const previousUpgradeId =
      upgrade.step > 1
        ? (`${upgrade.branch}-step-${upgrade.step - 1}` as CompanyUpgradeId)
        : null;
    if (previousUpgradeId && !hasCompanyUpgrade(previousUpgradeId)) {
      setToast("Сначала купите предыдущую ступень этой ветки");
      return;
    }
    if (balance < upgrade.cost) {
      setToast(`Для улучшения не хватает ${money(upgrade.cost - balance)}`);
      return;
    }
    setBalance((value) => value - upgrade.cost);
    setCompanyUpgrades((values) => [...values, upgradeId]);
    setToast(`${upgrade.name} куплено · ${upgrade.effect}`);
  }
  function spinHourlyRoulette() {
    if (!rouletteReady) return;
    const prizeIndex = Math.floor(Math.random() * roulettePrizes.length);
    setRouletteResult(null);
    setRouletteSpinning(true);
    setRouletteRotation((value) => value + 1440 + (360 - prizeIndex * 60));
    window.setTimeout(() => {
      const prize = roulettePrizes[prizeIndex];
      if (prize.kind === "money") setBalance((value) => value + prize.value);
      if (prize.kind === "xp") setXp((value) => value + prize.value);
      if (prize.kind === "reputation")
        setReputation((value) => value + prize.value);
      const now = Date.now();
      setRouletteLastSpinAt(now);
      setClockNow(now);
      window.localStorage.setItem("cardealer-roulette-last", String(now));
      setRouletteResult(prizeIndex);
      setRouletteSpinning(false);
      playGameSound("success", soundEnabled);
      setToast(`Часовая рулетка: ${prize.label}`);
    }, 2800);
  }
  function diagnose() {
    if (!owned || diagnosed || inTransit) return;
    if (balance < diagnosticCost)
      return setToast(
        `Для диагностики не хватает ${money(diagnosticCost - balance)}. Откройте банк.`,
      );
    setDiagnosed(true);
    setBalance((b) => b - diagnosticCost);
    setToast(
      `Диагностика завершена без смены дня: найдено ${defectCount} дефектов`,
    );
  }
  function order(part: Part) {
    const option = selectedOption(part.id);
    const price = partPrice(part);
    if (ordered.includes(part.id)) return setToast(`${part.name} уже заказана`);
    if (balance < price) return setToast("Недостаточно денег для заказа");
    setOrdered((v) => [...v, part.id]);
    setOrderedAtDay((v) => ({ ...v, [part.id]: day }));
    setDelivered((v) => [...new Set([...v, part.id])]);
    setBalance((b) => b - price);
    setToast(
      firstServiceOrderFree
        ? `${part.name}: вариант «${option.label}» получен бесплатно для обучения`
        : `${part.name}: выбран вариант «${option.label}» за ${money(price)}`,
    );
  }
  function nextDay() {
    const nextGameDay = day + 1;
    const expiredLeadIds = clientLeads
      .filter((lead) => {
        const resolvedDay = resolvedLeadDays[lead.id];
        return resolvedDay !== undefined && nextGameDay - resolvedDay >= 2;
      })
      .map((lead) => lead.id);
    if (expiredLeadIds.length) {
      setClientLeads((leads) =>
        leads.filter((lead) => !expiredLeadIds.includes(lead.id)),
      );
      setDeclinedLeadIds((ids) =>
        ids.filter((id) => !expiredLeadIds.includes(id)),
      );
      setChatReplies((messages) => {
        const next = { ...messages };
        expiredLeadIds.forEach((id) => delete next[`lead-${id}`]);
        return next;
      });
      setBudgetNegotiations((negotiations) => {
        const next = { ...negotiations };
        expiredLeadIds.forEach((id) => delete next[id]);
        return next;
      });
      setResolvedLeadDays((days) => {
        const next = { ...days };
        expiredLeadIds.forEach((id) => delete next[id]);
        return next;
      });
      if (expiredLeadIds.some((id) => activeChat === `lead-${id}`)) {
        setActiveChat("client");
        setMobileChatOpen(false);
      }
    }
    if (
      alexResolvedDay !== null &&
      nextGameDay - alexResolvedDay >= 2 &&
      activeChat === "client"
    ) {
      const nextLead = clientLeads.find(
        (lead) => !expiredLeadIds.includes(lead.id),
      );
      setActiveChat(nextLead ? `lead-${nextLead.id}` : "service");
      setMobileChatOpen(false);
    }
    setDay((d) => d + 1);
    setBalance((b) => b - dailyOverhead);
    const eventIndex = (day + completedDeals) % 4;
    if (eventIndex === 0 && completedDeals > 0 && dealStreak > 0) {
      setBalance((b) => b + 350);
      setGameEvent({
        title: "Бонус от логистической компании",
        text: "За серию заказов партнёр вернул часть комиссии.",
        effect: "+$350 на счёт",
        tone: "good",
      });
    } else if (eventIndex === 1 && owned && !sold) {
      setBalance((b) => b - 180);
      setGameEvent({
        title: "Дополнительное хранение",
        text: "Порт выставил счёт за внеплановый день хранения автомобиля.",
        effect: "−$180",
        tone: "bad",
      });
    } else if (eventIndex === 2 && reputation > 1) {
      setReputation((v) => v + 1);
      setGameEvent({
        title: "Хороший отзыв",
        text: "Клиент порекомендовал вашу компанию знакомым.",
        effect: "+1 репутация",
        tone: "good",
      });
    } else
      setGameEvent({
        title: "Обычный рабочий цикл",
        text: "Бонусов нет. Расходы списаны, результат зависит от ваших сделок.",
        effect: "Без бонуса",
        tone: "neutral",
      });
    if (loanBalance > 0 && (day + 1) % 7 === 0) {
      const payment = Math.min(loanPayment, loanBalance);
      if (balance >= payment) {
        setBalance((b) => b - payment);
        setLoanBalance((v) => Math.max(0, v - payment));
        setPaymentsMade((v) => v + 1);
        setToast(`Списан кредитный платёж ${money(payment)}`);
      } else {
        const penalty = Math.round(loanBalance * 0.03);
        setLoanBalance((v) => v + penalty);
        setToast(`Просрочка кредита: начислен штраф ${money(penalty)}`);
      }
    }
    setDelivered((v) => [
      ...new Set([
        ...v,
        ...ordered.filter((id) => {
          const supplier = selectedSupplier(id);
          const delay =
            supplier.reliability < 85 && (day + id.length) % 4 === 0 ? 1 : 0;
          return day + 1 - (orderedAtDay[id] ?? day) >= supplier.eta + delay;
        }),
      ]),
    ]);
    if (listedDay !== null && !sold) {
      const nextDaysListed = day + 1 - listedDay;
      if (nextDaysListed >= expectedSaleDays) {
        completeSale(askingPrice, "Покупатель с рынка");
        return;
      }
      if (nextDaysListed >= 3)
        setToast(
          `${activeVehicle.title} уже ${nextDaysListed} дн. в продаже. ${listingPriceRatio > 1.05 ? "Цена выше рынка — возможно, стоит снизить." : "Покупатели смотрят объявление, ожидайте."}`,
        );
    }
    setToast(`Прошёл расчётный период: расходы ${money(dailyOverhead)}`);
  }
  function dismissIncomingLead() {
    if (!incomingLead || incomingLeadClosing) return;
    setIncomingLeadClosing(true);
    if (incomingLeadCloseTimer.current)
      window.clearTimeout(incomingLeadCloseTimer.current);
    incomingLeadCloseTimer.current = window.setTimeout(() => {
      setIncomingLead(null);
      setIncomingLeadClosing(false);
    }, 320);
  }
  function openLead(id: string) {
    setClientLeads((v) =>
      v.map((c) => (c.id === id ? { ...c, read: true } : c)),
    );
    setActiveChat(`lead-${id}`);
    setMobileChatOpen(true);
  }
  function acceptContract(id: string) {
    const lead = clientLeads.find((client) => client.id === id);
    setAcceptedContracts((v) => (v.includes(id) ? v : [...v, id]));
    setDeclinedLeadIds((values) => values.filter((leadId) => leadId !== id));
    setResolvedLeadDays((values) => {
      const next = { ...values };
      delete next[id];
      return next;
    });
    setContractAcceptedDays((v) => ({ ...v, [id]: v[id] ?? day }));
    if (lead) {
      const matchingVehicle = garageVehiclesRef.current.find(
        (vehicle) =>
          vehicle.assignedContractId === null && leadMatchesLot(lead, vehicle.lot),
      );
      if (matchingVehicle) {
        const updated = garageVehiclesRef.current.map((vehicle) =>
          vehicle.id === matchingVehicle.id
            ? { ...vehicle, assignedContractId: id }
            : vehicle,
        );
        garageVehiclesRef.current = updated;
        setGarageVehicles(updated);
        if (activeGarageId === matchingVehicle.id) setAssignedContractId(id);
      }
    }
    setToast("Условия подтверждены. Подходящая машина привяжется автоматически");
  }
  function declineLeadContract(lead: ClientLead) {
    const isAccepted = acceptedContracts.includes(lead.id);
    setAcceptedContracts((values) =>
      values.filter((contractId) => contractId !== lead.id),
    );
    setContractAcceptedDays((values) => {
      const next = { ...values };
      delete next[lead.id];
      return next;
    });
    setDeclinedLeadIds((values) =>
      values.includes(lead.id) ? values : [...values, lead.id],
    );
    setResolvedLeadDays((values) => ({ ...values, [lead.id]: day }));
    if (assignedContractId === lead.id) setAssignedContractId(null);
    const updatedGarage = garageVehiclesRef.current.map((vehicle) =>
      vehicle.assignedContractId === lead.id
        ? { ...vehicle, assignedContractId: null }
        : vehicle,
    );
    garageVehiclesRef.current = updatedGarage;
    setGarageVehicles(updatedGarage);
    window.localStorage.setItem(
      "cardealer-garage",
      JSON.stringify(updatedGarage),
    );
    if (isAccepted) {
      setReputation((value) => Math.max(0, value - 1));
      setToast(
        `${lead.name}: контракт расторгнут · −1 репутация. Автомобиль остался в гараже`,
      );
    } else {
      setToast(`${lead.name}: заявка отклонена без штрафа`);
    }
  }
  function negotiateClientBudget(lead: ClientLead) {
    if (budgetNegotiations[lead.id]) {
      setToast("Клиент уже дал окончательный ответ по бюджету");
      return;
    }
    const idScore = [...lead.id].reduce(
      (sum, char) => sum + char.charCodeAt(0),
      0,
    );
    const strictRequirement =
      /без|только|цел|полный|не важен|небольш/i.test(lead.requirement);
    const agreementScore = (idScore * 17 + completedDeals * 11 + day * 7) % 100;
    const fullLimit = Math.min(
      55,
      28 + reputation * 4 + completedDeals * 2 + (strictRequirement ? 7 : 0),
    );
    const compromiseLimit = Math.min(92, fullLimit + 42 + reputation * 2);
    const result: "full" | "compromise" | "refused" =
      agreementScore < fullLimit
        ? "full"
        : agreementScore < compromiseLimit
          ? "compromise"
          : "refused";
    const increase = result === "full" ? 0.1 : result === "compromise" ? 0.05 : 0;
    const newBudget = Math.round((lead.budget * (1 + increase)) / 50) * 50;
    setBudgetNegotiations((values) => ({ ...values, [lead.id]: result }));
    if (increase) {
      setClientLeads((values) =>
        values.map((client) =>
          client.id === lead.id ? { ...client, budget: newBudget } : client,
        ),
      );
      setChatReplies((values) => ({
        ...values,
        [`lead-${lead.id}`]: [
          ...(values[`lead-${lead.id}`] || []),
          `Попросил пересмотреть бюджет: ${result === "full" ? "+10%" : "+5%"}.`,
        ],
      }));
      setToast(
        result === "full"
          ? `${lead.name} согласился увеличить бюджет до ${money(newBudget)}`
          : `${lead.name} предложил компромисс: бюджет ${money(newBudget)}`,
      );
    } else {
      setToast(
        `${lead.name} оставил прежний бюджет ${money(lead.budget)} — это окончательное решение`,
      );
    }
  }
  function acceptAlexOrder() {
    setAcceptedContracts((v) =>
      v.includes(alexContract.id) ? v : [...v, alexContract.id],
    );
    setContractAcceptedDays((v) => ({
      ...v,
      [alexContract.id]: v[alexContract.id] ?? day,
    }));
    setAlexOrderDeclined(false);
    setToast("Заказ #001 подтверждён. Можно подбирать Toyota Camry");
  }
  function declineAlexOrder() {
    setAcceptedContracts((v) =>
      v.filter((id) => id !== alexContract.id),
    );
    setContractAcceptedDays((v) => {
      const next = { ...v };
      delete next[alexContract.id];
      return next;
    });
    if (assignedContractId === alexContract.id) setAssignedContractId(null);
    setAlexOrderDeclined(true);
    setToast("Вы отказались от заказа #001. Контракт не активирован");
  }
  function deleteConversation(id: string) {
    if (acceptedContracts.includes(id)) {
      setChatReplies((v) => ({ ...v, [`lead-${id}`]: [] }));
      setToast("Сообщения очищены. Активный контракт сохранён в задачах");
    } else {
      setClientLeads((v) => v.filter((lead) => lead.id !== id));
      setActiveChat("client");
      setToast("Диалог удалён");
    }
  }
  function repair() {
    if (!allReady || repairInProgress || repaired)
      return setToast(
        "Ремонт заблокирован: не все обязательные детали на складе",
      );
    if (balance < repairCost)
      return setToast(
        `Для начала ремонта не хватает ${money(repairCost - balance)}. Откройте банк.`,
      );
    setBalance((b) => b - repairCost);
    setRepairCompleteDay(null);
    const actualDuration = Math.max(
      1,
      repairDurationMinutes - repairTimeCreditMinutes,
    );
    setRepairCompleteAt(Date.now() + actualDuration * 60 * 1000);
    setRepairTimeCreditMinutes(0);
    setClockNow(Date.now());
    setToast(
      firstServiceOrderFree
        ? `Учебный ремонт запущен бесплатно · займёт ${actualDuration} мин.`
        : `Ремонт запущен за ${money(repairCost)} · займёт ${actualDuration} мин.`,
    );
  }
  function sell(finalPrice = negotiatedOffer, buyerName = "Алексей Ковалёв") {
    if (!repaired || sold) return;
    if (buyerName === alexContract.name) {
      setAcceptedContracts((v) =>
        v.filter((id) => id !== alexContract.id),
      );
      setAlexResolvedDay(day);
      if (assignedContractId === alexContract.id) setAssignedContractId(null);
    }
    completeSale(finalPrice, buyerName);
    setScreen("messages");
  }
  function completeSale(finalPrice: number, buyerName: string) {
    const profit = finalPrice - totalInvested;
    const earnedXp =
      100 +
      Math.max(0, Math.round(profit / 100)) +
      Math.round(partsQuality / 2);
    const rep =
      profit > 0 ? (partsQuality >= 90 ? 3 : partsQuality >= 75 ? 2 : 1) : -1;
    const completedLead = clientLeads.find(
      (lead) => lead.id === assignedContractId || lead.name === buyerName,
    );
    if (completedLead) {
      setResolvedLeadDays((values) => ({ ...values, [completedLead.id]: day }));
    }
    const remainingVehicles = garageVehiclesRef.current.filter(
      (vehicle) => vehicle.id !== activeGarageId,
    );
    garageVehiclesRef.current = remainingVehicles;
    setGarageVehicles(remainingVehicles);
    window.localStorage.setItem(
      "cardealer-garage",
      JSON.stringify(remainingVehicles),
    );
    if (remainingVehicles.length) {
      loadGarageVehicle(remainingVehicles[0]);
    } else {
      setSold(true);
      setOwned(false);
      setOwnedLot(null);
      setActiveGarageId(null);
    }
    if (assignedContractId) {
      setAcceptedContracts((v) => v.filter((id) => id !== assignedContractId));
      setAssignedContractId(null);
    }
    setCompletedDeals((v) => v + 1);
    setBalance((b) => b + finalPrice);
    setXp((v) => v + earnedXp);
    setReputation((v) => Math.max(0, v + rep));
    setDealStreak((v) => (profit > 0 ? v + 1 : 0));
    setDealResult({
      buyer: buyerName,
      vehicleTitle: activeVehicle.title,
      vehicleYear: activeVehicle.year,
      price: finalPrice,
      invested: totalInvested,
      profit,
      xp: earnedXp,
      reputation: rep,
      quality: partsQuality,
    });
    setToast(
      `${buyerName} купил автомобиль за ${money(finalPrice)}. Сделка закрыта`,
    );
  }
  function grantRewardAd(mode: "money" | "delivery" | "repair" = rewardAdMode) {
    if (mode === "delivery" && arrivalDay !== null && arrivalDay > day) {
      setArrivalDay((value) =>
        value === null ? value : Math.max(day, value - 3),
      );
    } else if (mode === "repair") {
      if (repairCompleteAt !== null) {
        const nextCompletion = Math.max(
          Date.now(),
          repairCompleteAt - 30 * 60 * 1000,
        );
        setRepairCompleteAt(nextCompletion);
        setClockNow(Date.now());
      } else {
        setRepairTimeCreditMinutes((minutes) => minutes + 30);
      }
    } else {
      setBalance((b) => b + rewardAdAmount);
    }
    setRewardAdOpen(false);
    setRewardAdStatus("idle");
    setRewardAdSeconds(5);
    setToast(
      mode === "delivery" && arrivalDay !== null && arrivalDay > day
        ? "Реклама просмотрена: доставка ускорена на 30 минут"
        : mode === "repair"
          ? repairCompleteAt !== null
            ? "Реклама просмотрена: ремонт ускорен на 30 минут"
            : "Получен купон: следующий ремонт на 30 минут быстрее"
          : `Спонсорский бонус зачислен: +${money(rewardAdAmount)}`,
    );
  }
  async function openRewardAd(mode: "money" | "delivery" | "repair" = "money") {
    if (!rewardAdAvailable) return;
    setRewardAdMode(mode);
    setRewardAdStatus("loading");

    const host = window.location.hostname;
    const isLocalTest =
      host === "localhost" ||
      host === "127.0.0.1" ||
      host === "0.0.0.0" ||
      /^192\.168\./.test(host) ||
      /^10\./.test(host) ||
      /^172\.(1[6-9]|2\d|3[01])\./.test(host);
    if (isLocalTest) {
      setRewardAdSeconds(3);
      setRewardAdOpen(true);
      setRewardAdStatus("idle");
      return;
    }

    const sdk = await loadYandexGamesSdk();
    if (!sdk) {
      setRewardAdStatus("idle");
      setToast("Реклама временно недоступна. Попробуйте чуть позже");
      return;
    }

    let rewardGranted = false;
    let musicWasPlaying = false;
    const pauseForAd = () => {
      musicWasPlaying = Boolean(musicRef.current && !musicRef.current.paused);
      musicRef.current?.pause();
      sdk.features?.GameplayAPI?.stop();
    };
    const resumeAfterAd = () => {
      sdk.features?.GameplayAPI?.start();
      if (musicWasPlaying && musicRef.current) {
        void musicRef.current.play().catch(() => undefined);
      }
    };
    try {
      sdk.adv.showRewardedVideo({
        callbacks: {
          onOpen: () => {
            pauseForAd();
            setRewardAdStatus("showing");
          },
          onRewarded: () => {
            if (rewardGranted) return;
            rewardGranted = true;
            grantRewardAd(mode);
          },
          onClose: () => {
            resumeAfterAd();
            setRewardAdStatus("idle");
            if (!rewardGranted) {
              setToast(
                mode === "repair"
                  ? "Досмотрите рекламу до конца, чтобы сократить ремонт на 30 минут"
                  : mode === "delivery"
                    ? "Досмотрите рекламу до конца, чтобы ускорить доставку"
                    : `Досмотрите рекламу до конца, чтобы получить ${money(rewardAdAmount)}`,
              );
            }
          },
          onError: () => {
            resumeAfterAd();
            setRewardAdStatus("idle");
            setToast("Реклама временно недоступна. Попробуйте чуть позже");
          },
        },
      });
    } catch {
      resumeAfterAd();
      setRewardAdStatus("idle");
      setToast("Не удалось запустить рекламу. Попробуйте ещё раз");
    }
  }
  function claimRewardAd() {
    if (rewardAdSeconds > 0) return;
    grantRewardAd(rewardAdMode);
  }
  function counterOffer() {
    if (negotiationRound >= 2) {
      setClientWalkedAway(true);
      setToast("Клиент отказался от сделки после жёсткого торга");
      return;
    }
    setNegotiationRound((v) => v + 1);
    setToast("Клиент немного повысил предложение");
  }
  function listForSale() {
    if (!repaired || sold || listedDay !== null) return;
    if (askingPrice < 1000) return setToast("Укажите корректную цену продажи");
    setListedDay(day);
    setToast(
      `Объявление опубликовано за ${money(askingPrice)}. Прогноз продажи: около ${expectedSaleDays} дн.`,
    );
  }
  function lowerListingPrice() {
    const nextPrice = Math.max(
      totalInvested,
      Math.round((askingPrice * 0.94) / 100) * 100,
    );
    setAskingPrice(nextPrice);
    setListedDay(day);
    setToast(
      `Цена снижена до ${money(nextPrice)}. Объявление поднято в выдаче`,
    );
  }
  function takeLoan(amount: number, term: number, rate: number) {
    if (loanBalance > 0 || amount > creditAvailable) return;
    const total = Math.round(amount * (1 + rate / 100));
    const weekly = Math.ceil(total / term);
    setLoanPrincipal(amount);
    setLoanBalance(total);
    setLoanPayment(weekly);
    setLoanRate(rate);
    setLoanTerm(term);
    setPaymentsMade(0);
    setBalance((b) => b + amount);
    setToast(`Кредит ${money(amount)} одобрен. На счёт зачислены средства`);
  }
  function requestLoan(amount: number, term: number, rate: number) {
    if (loanBalance > 0 || amount > creditAvailable) return;
    setPendingLoan({ amount, term, rate });
  }
  function repayLoan() {
    if (!loanBalance) return;
    const payment = Math.min(balance, loanBalance);
    if (!payment) return setToast("На счёте нет средств для погашения");
    setBalance((b) => b - payment);
    setLoanBalance((v) => Math.max(0, v - payment));
    setToast(
      payment === loanBalance
        ? "Кредит полностью погашен"
        : `Внесено досрочно ${money(payment)}`,
    );
    if (payment === loanBalance) {
      setLoanPrincipal(0);
      setLoanPayment(0);
      setLoanTerm(0);
    }
  }

  const apps: {
    id: Screen;
    icon: LucideIcon;
    name: string;
    note?: string;
    disabled?: boolean;
  }[] = [
    {
      id: "auction",
      icon: Gavel,
      name: "Аукцион",
      note: `${availableLots.length} активных лота`,
    },
    {
      id: "garage",
      icon: CarFront,
      name: "Мои авто",
      note: garageVehicles.length
        ? `${garageVehicles.length} авто в работе`
        : "Гараж свободен",
    },
    {
      id: "service",
      icon: Wrench,
      name: "Автосервис",
      note: diagnosed && !repaired ? "Требует деталей" : undefined,
    },
    {
      id: "messages",
      icon: MessageCircle,
      name: "Заказы",
      note: `${unread} непрочитано`,
    },
    { id: "bank", icon: Landmark, name: "Банк", note: money(balance) },
    {
      id: "development",
      icon: Building2,
      name: "Развитие",
      note: `${companyUpgrades.length}/25 улучшений`,
    },
  ];

  const featuredLot = availableLots[0] || lots[0];
  const hasActiveProject = owned && ownedLot !== null;
  const dashboardVehicle = ownedLot || featuredLot;
  const dashboardContracts = (
    activeContracts.length
      ? activeContracts
      : [alexContract, ...clientLeads.filter((lead) => !lead.read)]
  ).slice(0, 2);
  const missingPartsCount = requiredCatalog.filter(
    (part) => !delivered.includes(part.id),
  ).length;
  const dashboardUrgent: {
    title: string;
    note: string;
    meta: string;
    tone: "blue" | "green" | "amber" | "red";
    Icon: LucideIcon;
    target: Screen;
    leadId?: string;
  }[] = [];
  if (owned && inTransit) {
    dashboardUrgent.push({
      title: "Автомобиль находится в пути",
      note: `${activeVehicle.title} · стандартная доставка`,
      meta: deliveryRemainingLabel,
      tone: "blue",
      Icon: Truck,
      target: "garage",
    });
  } else if (owned && !diagnosed) {
    dashboardUrgent.push({
      title: "Нужна диагностика",
      note: `${activeVehicle.title} готов к осмотру`,
      meta: "СЕГОДНЯ",
      tone: "amber",
      Icon: ScanSearch,
      target: "service",
    });
  } else if (owned && diagnosed && missingPartsCount > 0) {
    dashboardUrgent.push({
      title: "Не хватает деталей",
      note: `${missingPartsCount} поз. блокируют ремонт`,
      meta: "СРОЧНО",
      tone: "red",
      Icon: PackageX,
      target: "service",
    });
  } else if (owned && allReady && !repaired) {
    dashboardUrgent.push({
      title: "Детали готовы",
      note: "Можно начинать ремонт",
      meta: "НА СКЛАДЕ",
      tone: "green",
      Icon: CircleCheck,
      target: "service",
    });
  }
  const waitingLead = clientLeads.find((lead) => !lead.read) || clientLeads[0];
  if (waitingLead) {
    dashboardUrgent.push({
      title: `${waitingLead.name} ждёт ответа`,
      note: `${waitingLead.car} · бюджет ${money(waitingLead.budget)}`,
      meta: acceptedContracts.includes(waitingLead.id) ? "АКТИВЕН" : "НОВЫЙ",
      tone: "amber",
      Icon: MessageCircle,
      target: "messages",
      leadId: waitingLead.id,
    });
  }
  if (loanBalance > 0) {
    dashboardUrgent.push({
      title: "Платёж по кредиту",
      note: `${money(Math.min(loanPayment, loanBalance))} будет списано автоматически`,
      meta: "АВТОПЛАТЁЖ",
      tone: paymentTomorrow ? "red" : "amber",
      Icon: CreditCard,
      target: "bank",
    });
  }
  if (dashboardUrgent.length < 3) {
    dashboardUrgent.push({
      title: `${availableLots.length} лотов доступны`,
      note: `Новый выгодный вариант: ${featuredLot.title}`,
      meta: `ОТ ${money(featuredLot.bid)}`,
      tone: "blue",
      Icon: Gavel,
      target: "auction",
    });
  }
  if (dashboardUrgent.length < 3) {
    dashboardUrgent.push({
      title: "Расходы компании",
      note: "Офис, связь и хранение автомобилей",
      meta: money(dailyOverhead),
      tone: "green",
      Icon: ReceiptText,
      target: "bank",
    });
  }
  const dashboardStages = [
    {
      label: "Аукцион",
      done: hasActiveProject,
      target: "auction" as Screen,
    },
    {
      label: "Доставка",
      done: hasActiveProject && !inTransit,
      target: "garage" as Screen,
    },
    {
      label: "Диагностика",
      done: hasActiveProject && diagnosed,
      target: "service" as Screen,
    },
    {
      label: "Детали",
      done: hasActiveProject && diagnosed && allReady,
      target: "service" as Screen,
    },
    {
      label: "Ремонт",
      done: hasActiveProject && repaired,
      target: "service" as Screen,
    },
    {
      label: "Продажа",
      done: hasActiveProject && sold,
      target: "messages" as Screen,
    },
  ];
  const firstPendingDashboardStage = dashboardStages.findIndex(
    (stage) => !stage.done,
  );
  const currentDashboardStage =
    firstPendingDashboardStage === -1
      ? dashboardStages.length - 1
      : firstPendingDashboardStage;

  return (
    <main
      className="game-shell"
      key={language}
      onContextMenu={(event) => event.preventDefault()}
      onClickCapture={(event) => {
        const target = event.target as HTMLElement;
        if (target.closest("button") && !target.closest(".sound-toggle")) {
          playGameSound("click", soundEnabled);
        }
      }}
    >
      <audio
        ref={musicRef}
        src="audio/keys-of-confidence.mp3"
        loop
        preload="auto"
      />
      {profileReady && (
        <div className="game-ambient-parts" aria-hidden="true">
          <span className="ambient-car-one"><CarFront /></span>
          <span className="ambient-wrench"><Wrench /></span>
          <span className="ambient-gear"><Cog /></span>
          <span className="ambient-hammer"><Hammer /></span>
          <span className="ambient-car-two"><CarFront /></span>
          <span className="ambient-gauge"><CircleGauge /></span>
        </div>
      )}
      {profileReady && <header className="topbar">
        <button className="brand" onClick={() => navigateTo("desktop")}>
          <span className="brand-mascot">
            <img src="mechanic-mascot-crop.png" alt="" />
          </span>
          <span className="brand-name">
            <b>CarDealer</b>
            <small>game</small>
          </span>
        </button>
        <div className="top-stats">
          <span>
            <small>ЦИКЛ</small>
            {day}
          </span>
          <span>
            <small>БАЛАНС</small>
            {money(balance)}
          </span>
          <span>
            <small>РЕПУТАЦИЯ</small>
            <b className="rating">★</b> {reputation}
          </span>
          <span className="level-chip">
            <small>УРОВЕНЬ</small>
            {companyLevel}
          </span>
          <div className="top-tasks" tabIndex={0}>
            <span className="top-tasks-trigger">
              <small>ЗАДАЧИ</small>
              <b>{activeContracts.length}</b>
              <i />
            </span>
            <section className="tasks-popover">
              <header>
                <div>
                  <small>АКТИВНЫЕ КОНТРАКТЫ</small>
                  <b>Задачи компании</b>
                </div>
                <span>{activeContracts.length}</span>
              </header>
              {activeContracts.length ? (
                <div className="tasks-list">
                  {activeContracts.map((contract) => {
                    const linkedVehicle = garageVehicles.find(
                      (vehicle) =>
                        vehicle.assignedContractId === contract.id,
                    );
                    return (
                      <article
                        key={contract.id}
                      >
                        <span className="task-avatar">
                          {contract.initials}
                        </span>
                        <div>
                          <b>{contract.name}</b>
                          <p>{contract.car}</p>
                          <small>
                            {linkedVehicle
                              ? `${linkedVehicle.lot.year} ${linkedVehicle.lot.title}`
                              : "Идёт подбор автомобиля"}
                          </small>
                        </div>
                        <aside>
                          <b>{money(contract.budget)}</b>
                          <small>БЕЗ ДЕДЛАЙНА</small>
                        </aside>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="tasks-empty">
                  <b>Активных задач нет</b>
                  <small>Принятые заказы клиентов появятся здесь</small>
                </div>
              )}
              <footer>Наведите на «Задачи», чтобы проверить активные заказы</footer>
            </section>
          </div>
          <button
            className="sponsor-ad-button"
            onClick={() => openRewardAd("money")}
            disabled={!rewardAdAvailable}
            title={`Посмотреть рекламу и получить ${money(rewardAdAmount)}`}
          >
            <span>▶</span>
            <b>Получить {money(rewardAdAmount)}</b>
          </button>
          <div className="header-more" tabIndex={0}>
            <button className="header-more-trigger" aria-label="Открыть меню" title="Меню">
              <span>•••</span>
            </button>
            <div className="header-more-menu">
          <button
            className="achievements-trigger"
            onClick={() => setAchievementsOpen(true)}
            title="Достижения"
            aria-label="Открыть достижения"
          >
            <Trophy aria-hidden="true" />
            <span>{unlockedAchievementIds.length}/{gameAchievements.length}</span>
          </button>
          <button
            className={`roulette-trigger ${rouletteReady ? "ready" : ""}`}
            onClick={() => {
              setRouletteResult(null);
              setRouletteOpen(true);
            }}
            title="Часовая рулетка"
          >
            <Gift aria-hidden="true" />
            <span>{rouletteReady ? "КРУТИТЬ" : rouletteTimer}</span>
          </button>
          <button
            className={`sound-toggle ${soundEnabled ? "active" : ""}`}
            onClick={() => {
              const next = !soundEnabled;
              setSoundEnabled(next);
              if (next) playGameSound("success", true);
            }}
            title={soundEnabled ? "Выключить звук" : "Включить звук"}
            aria-label={soundEnabled ? "Выключить звук" : "Включить звук"}
          >
            {soundEnabled ? <Volume2 aria-hidden="true" /> : <VolumeX aria-hidden="true" />}
          </button>
          <label className="music-volume-control">
            <span><Volume2 aria-hidden="true" /> Музыка</span>
            <input
              type="range"
              min="0"
              max="40"
              step="1"
              value={musicVolume}
              onChange={(event) => setMusicVolume(Number(event.target.value))}
              aria-label="Громкость музыки"
            />
            <b>{musicVolume}%</b>
          </label>
          <button
            className="language-toggle"
            onClick={() => {
              window.localStorage.setItem("cardealer-language-manual", "true");
              setLanguage((value) => (value === "ru" ? "en" : "ru"));
            }}
            title={language === "ru" ? "Switch to English" : "Переключить на русский"}
            aria-label={language === "ru" ? "Switch to English" : "Переключить на русский"}
          >
            <span className={language === "ru" ? "active" : ""}>RU</span>
            <i />
            <span className={language === "en" ? "active" : ""}>EN</span>
          </button>
            </div>
          </div>
        </div>
      </header>}

      <div className="workspace">
        <aside className="dock" aria-label="Навигация">
          <button
            onClick={() => navigateTo("desktop")}
            className={`${screen === "desktop" ? "active" : ""} ${
              tutorialStatus === "active" && tutorialTargetScreen === "desktop"
                ? "tutorial-focus"
                : ""
            }`}
          >
            <House aria-hidden="true" />
            <em>Главная</em>
          </button>
          {apps.map((a) => {
            const AppIcon = a.icon;
            return (
              <button
                key={a.id}
                onClick={() => navigateTo(a.id)}
                className={`${screen === a.id ? "active" : ""} ${
                  tutorialStatus === "active" && tutorialTargetScreen === a.id
                    ? "tutorial-focus"
                    : ""
                }`}
              >
                <AppIcon aria-hidden="true" />
                <em>{a.name}</em>
                {a.id === "messages" && unread > 0 && <i>{unread}</i>}
              </button>
            );
          })}
        </aside>

        <section className="content">
          {screen !== "desktop" && (
            <div className="page-heading">
              <div>
                <p>ЛИЧНЫЙ КАБИНЕТ / {title.toUpperCase()}</p>
                <h1>{title}</h1>
              </div>
            </div>
          )}

          {screen === "desktop" && (
            <section className="dealer-dashboard">
              <div className="dashboard-main-row">
                <article className={`active-project-card ${!hasActiveProject ? "empty-project" : ""}`}>
                  {hasActiveProject && (
                    <img
                      src={ownedImage}
                      alt={`${dashboardVehicle.year} ${dashboardVehicle.title}`}
                    />
                  )}
                  <div className="project-shade" />
                  <div className="project-heading">
                    <span>{hasActiveProject ? "АКТИВНЫЙ ПРОЕКТ" : "РАБОЧИЙ ГАРАЖ"}</span>
                    <h2>
                      {hasActiveProject ? (
                        <>{dashboardVehicle.title} <small>{dashboardVehicle.year}</small></>
                      ) : (
                        <>Нет активного проекта</>
                      )}
                    </h2>
                    {hasActiveProject ? (
                      <div className="project-chips">
                        <b>{dashboardVehicle.mileage}</b>
                        <b className="warning">{dashboardVehicle.docs}</b>
                        <b className={vinReports.includes(dashboardVehicle.id) ? "success" : "warning"}>
                          {vinReports.includes(dashboardVehicle.id)
                            ? "VIN проверен"
                            : "VIN не проверен"}
                        </b>
                      </div>
                    ) : (
                      <p className="empty-project-copy">
                        Выберите автомобиль на аукционе — после покупки здесь появятся его этапы, расходы и следующий шаг.
                      </p>
                    )}
                  </div>
                  <div className="project-controls">
                    {hasActiveProject && (
                      <div className="dashboard-journey">
                        {dashboardStages.map((stage, index) => (
                          <button
                            key={stage.label}
                            className={`${stage.done ? "done" : ""} ${index === currentDashboardStage ? "current" : ""}`}
                            onClick={() => setScreen(stage.target)}
                          >
                            <i>{stage.done ? "✓" : index + 1}</i>
                            <span>{stage.label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                    <div className="project-action-row">
                      <div className="project-money">
                        <span><small>КУПЛЕНА</small><b>{hasActiveProject ? money(purchasePrice) : "—"}</b></span>
                        <span><small>ВЛОЖЕНО</small><b>{hasActiveProject ? money(totalInvested) : "—"}</b></span>
                        <span><small>ПРОГНОЗ</small><b>{hasActiveProject ? money(projectedSale) : "—"}</b></span>
                      </div>
                      <button
                        className="next-action"
                        onClick={() => {
                          if (!hasActiveProject) {
                            setScreen("auction");
                            return;
                          }
                          if (dashboard.target === "messages" && newestLead && !owned)
                            openLead(newestLead.id);
                          setScreen(dashboard.target);
                        }}
                      >
                        <small>СЛЕДУЮЩИЙ ШАГ</small>
                        <b>{hasActiveProject ? dashboard.button : "Выбрать автомобиль"} →</b>
                      </button>
                    </div>
                  </div>
                </article>

                <aside className="urgent-board">
                  <header><span><CircleAlert aria-hidden="true" /></span><b>СРОЧНЫЕ ДЕЛА</b></header>
                  {dashboardUrgent.slice(0, 3).map((item) => (
                    <button
                      key={`${item.title}-${item.meta}`}
                      className={item.tone}
                      onClick={() => {
                        if (item.leadId) openLead(item.leadId);
                        else setScreen(item.target);
                      }}
                    >
                      <i><item.Icon aria-hidden="true" /></i>
                      <span><b>{item.title}</b><small>{item.note}</small></span>
                      <em>{item.meta}</em>
                      <strong><ChevronRight aria-hidden="true" /></strong>
                    </button>
                  ))}
                </aside>
              </div>

              <div className="dashboard-bottom-row">
                <article className="dashboard-box contracts-box">
                  <header><b>▣ КОНТРАКТЫ</b><button onClick={() => setScreen("messages")}>Все →</button></header>
                  <div>
                    {dashboardContracts.map((contract) => {
                      const accepted = acceptedContracts.includes(contract.id);
                      return (
                        <button key={contract.id} onClick={() => openLead(contract.id)}>
                          <i>{contract.initials}</i>
                          <span>
                            <b>{contract.car}</b>
                            <small>{contract.name} · бюджет {money(contract.budget)}</small>
                          </span>
                          <em>{accepted ? "АКТИВЕН" : "НОВЫЙ"}</em>
                        </button>
                      );
                    })}
                  </div>
                </article>

                <article className="dashboard-box events-box">
                  <header><b>● СОБЫТИЯ</b><button onClick={() => setScreen("messages")}>Все →</button></header>
                  <div><i className="blue" /><span><b>{toast}</b><small>Только что</small></span></div>
                  <div><i className="green" /><span><b>{vinReports.length ? "Последняя VIN-проверка завершена" : "Новые лоты доступны"}</b><small>Система</small></span></div>
                  <div><i className="amber" /><span><b>{dealStreak ? `Серия прибыльных сделок: ${dealStreak}` : `Расходы сегодня: ${money(dailyOverhead)}`}</b><small>Компания</small></span></div>
                </article>

                <article className="dashboard-box development-box">
                  <header>
                    <div><b className="development-title"><TrendingUp aria-hidden="true" /> РАЗВИТИЕ КОМПАНИИ</b><small>Уровень {companyLevel} · {levelXp}/300 XP</small></div>
                    <span className="mini-xp"><i style={{ width: `${levelXp / 3}%` }} /></span>
                    <button className="development-open" onClick={() => setScreen("development")}>Улучшить →</button>
                  </header>
                  <div className="development-path">
                    {[
                      { name: "Гараж", level: 1, Icon: Warehouse },
                      { name: "Сервис", level: 2, Icon: Wrench },
                      { name: "Стоянка", level: 4, Icon: SquareParking },
                      { name: "Автосалон", level: 6, Icon: Store },
                    ].map((stage, index) => (
                      <span key={stage.name} className={companyLevel >= stage.level ? "unlocked" : ""}>
                        <i><stage.Icon aria-hidden="true" /></i>
                        <b>{stage.name}</b>
                        <small>{companyLevel >= stage.level ? "ОТКРЫТО" : `УРОВЕНЬ ${stage.level}`}</small>
                        {index < 3 && <em><ChevronRight aria-hidden="true" /></em>}
                      </span>
                    ))}
                  </div>
                </article>

                <article className="featured-lot-card" onClick={() => setScreen("auction")}>
                  <img src={featuredLot.image} alt={featuredLot.title} />
                  <div className="featured-lot-shade" />
                  <span>ВЫГОДНЫЙ ЛОТ</span>
                  <h3>{featuredLot.title}</h3>
                  <small>{featuredLot.year} · {featuredLot.damage}</small>
                  <div><small>ТЕКУЩАЯ СТАВКА</small><b>{money(featuredLot.bid)}</b></div>
                  <button>Открыть лот →</button>
                </article>
              </div>
            </section>
          )}

          {screen === "development" && (
            <section className="company-development">
              <article className="development-hero">
                <div>
                  <small>ШТАБ-КВАРТИРА · УРОВЕНЬ {companyLevel}</small>
                  <h2>{companyName || "Ваша компания"}</h2>
                  <p>
                    Вкладывайте прибыль в постоянные бонусы. Улучшения остаются
                    у компании и помогают во всех следующих сделках.
                  </p>
                </div>
                <div className="garage-capacity">
                  <span><Warehouse aria-hidden="true" /></span>
                  <div>
                    <small>ВМЕСТИМОСТЬ ГАРАЖА</small>
                    <b>{garageVehicles.length} / {garageCapacity}</b>
                    <em>Свободно: {garageCapacity - garageVehicles.length}</em>
                  </div>
                </div>
              </article>

              <div className="upgrade-branches">
                {upgradeBranches.map((branch) => {
                  const BranchIcon = branch.Icon;
                  const branchLevel = upgradeLevel(branch.id);
                  return (
                    <article className="upgrade-branch" key={branch.id}>
                      <header>
                        <span><BranchIcon aria-hidden="true" /></span>
                        <div>
                          <small>ВЕТКА РАЗВИТИЯ</small>
                          <h3>{branch.title}</h3>
                          <p>{branch.description}</p>
                        </div>
                        <b>{branchLevel}/5</b>
                      </header>
                      <div className="upgrade-ladder">
                        {branch.steps.map((upgrade) => {
                          const bought = hasCompanyUpgrade(upgrade.id);
                          const levelLocked = companyLevel < upgrade.level;
                          const previousUpgradeId =
                            upgrade.step > 1
                              ? (`${branch.id}-step-${upgrade.step - 1}` as CompanyUpgradeId)
                              : null;
                          const prerequisiteLocked = Boolean(
                            previousUpgradeId && !hasCompanyUpgrade(previousUpgradeId),
                          );
                          const UpgradeIcon = branch.Icon;
                          return (
                            <section
                              key={upgrade.id}
                              className={`upgrade-card ${bought ? "bought" : ""} ${levelLocked || prerequisiteLocked ? "locked" : ""}`}
                            >
                              <div className="upgrade-step-number">{upgrade.step}</div>
                              <div className="upgrade-icon"><UpgradeIcon aria-hidden="true" /></div>
                              <div className="upgrade-copy">
                                <small>{bought ? "УСТАНОВЛЕНО" : `УРОВЕНЬ ${upgrade.level}`}</small>
                                <h3>{upgrade.name}</h3>
                                <p>{upgrade.description}</p>
                                <strong>{upgrade.effect}</strong>
                              </div>
                              <button
                                disabled={bought || levelLocked || prerequisiteLocked}
                                onClick={() => buyCompanyUpgrade(upgrade.id)}
                              >
                                {bought
                                  ? "Куплено ✓"
                                  : levelLocked
                                    ? `Нужен уровень ${upgrade.level}`
                                    : prerequisiteLocked
                                      ? "Сначала предыдущий шаг"
                                      : `Купить · ${money(upgrade.cost)}`}
                              </button>
                            </section>
                          );
                        })}
                      </div>
                    </article>
                  );
                })}
              </div>

              <article className="active-bonuses">
                <header>
                  <div><TrendingUp aria-hidden="true" /></div>
                  <span><small>ЭФФЕКТЫ КОМПАНИИ</small><b>Активные бонусы</b></span>
                </header>
                <div>
                  <span><small>ГАРАЖ</small><b>Слотов: {garageCapacity}</b></span>
                  <span><small>АУКЦИОН</small><b>Вход {priceWithTutorialFree(regularAuctionFee, auctionFee)}</b></span>
                  <span><small>ЗАПЧАСТИ</small><b>{partsUpgradeLevel ? `−${partsUpgradeLevel * 5}%` : "Обычная цена"}</b></span>
                  <span><small>СЕРВИС</small><b>{serviceUpgradeLevel ? `−${serviceUpgradeLevel * 5}%` : "Обычная цена"}</b></span>
                  <span><small>РЕКЛАМА</small><b>+{money(rewardAdAmount)}</b></span>
                </div>
              </article>
            </section>
          )}

          {screen === "auction" && (
            <section className="panel">
              <div className="panel-tools">
                <div className="filters">
                  <button
                    className={!auctionFavoritesOnly ? "selected" : ""}
                    onClick={() => setAuctionFavoritesOnly(false)}
                  >
                    Все лоты
                  </button>
                  <button
                    className={auctionFavoritesOnly ? "selected favorite-filter" : "favorite-filter"}
                    onClick={() => setAuctionFavoritesOnly(true)}
                  >
                    <Heart aria-hidden="true" /> Избранное · {favoriteLotIds.length}
                  </button>
                </div>
                <span>
                  Активно {availableLots.length} · новый лот через {auctionRefreshTimer}
                </span>
              </div>
              <div className="lots">
                {displayedAuctionLots.map((lot, idx) => (
                  <article
                    key={lot.id}
                    className={`${idx === 0 && !auctionFavoritesOnly ? "recommended" : ""} ${favoriteLotIds.includes(lot.id) ? "favorite-lot" : ""}`}
                  >
                    {idx === 0 && <div className="ribbon">РЕКОМЕНДУЕМ</div>}
                    {lot.unlockDay === day && day > 1 && (
                      <div className="ribbon new-lot">НОВЫЙ ЛОТ</div>
                    )}
                    <div className="lot-photo">
                      <img src={lot.image} alt={`${lot.year} ${lot.title}`} />
                      <button
                        className={`favorite-lot-button ${favoriteLotIds.includes(lot.id) ? "active" : ""}`}
                        onClick={() => toggleFavoriteLot(lot)}
                        aria-label={
                          favoriteLotIds.includes(lot.id)
                            ? "Удалить из избранного"
                            : "Добавить в избранное"
                        }
                        title={
                          favoriteLotIds.includes(lot.id)
                            ? "Удалить из избранного"
                            : "Добавить в избранное"
                        }
                      >
                        <Heart aria-hidden="true" />
                      </button>
                      <button
                        style={{ left: `${lot.x}%`, top: `${lot.y}%` }}
                        className="damage-marker yellow"
                        aria-label={`Заявлено: ${lot.damage}`}
                        onClick={() =>
                          setToast(
                            `Заявлено: ${lot.damage}. Реальный риск доступен в VIN-отчёте`,
                          )
                        }
                      >
                        <i />
                        <span>{lot.damage}</span>
                      </button>
                      <b>{lot.title.split(" ")[0].toUpperCase()}</b>
                      <small>ФОТО 1/4 · LOT #{43820 + lot.id}</small>
                    </div>
                    <div className="lot-body">
                      {vinReports.includes(lot.id) ? (
                        <button
                          className="vin-ready"
                          onClick={() => {
                            setSelectedReport(lot.id);
                            setVinModalOpen(true);
                          }}
                        >
                          ✓ VIN ПРОВЕРЕН · ОТКРЫТЬ
                        </button>
                      ) : (
                        <span className="risk-unknown">РИСК НЕ ПРОВЕРЕН</span>
                      )}
                      <h3>
                        {lot.year} {lot.title}
                      </h3>
                      <dl>
                        <div>
                          <dt>Пробег</dt>
                          <dd>{lot.mileage}</dd>
                        </div>
                        <div>
                          <dt>Заявлено</dt>
                          <dd>{lot.damage}</dd>
                        </div>
                        <div>
                          <dt>Документы</dt>
                          <dd>{lot.docs}</dd>
                        </div>
                      </dl>
                      <div className="bid">
                        <span>
                          <small>ТЕКУЩАЯ СТАВКА</small>
                          <b>{money(lot.bid)}</b>
                        </span>
                        <div className="bid-actions">
                          <button
                            className="vin-button"
                            onClick={() => requestVin(lot)}
                          >
                            {vinReports.includes(lot.id)
                              ? "Открыть отчёт"
                              : firstServiceOrderFree
                                ? <><del>{money(VIN_REPORT_PRICE)}</del> · БЕСПЛАТНО</>
                                : `VIN · ${money(vinReportPrice)}`}
                          </button>
                          <button
                            className="buy-button"
                            onClick={() => openAuction(lot)}
                          >
                            Участвовать
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
                {auctionFavoritesOnly && displayedAuctionLots.length === 0 && (
                  <div className="favorites-empty">
                    <Heart aria-hidden="true" />
                    <h3>В избранном пока пусто</h3>
                    <p>
                      Нажмите на сердце на карточке автомобиля, чтобы сохранить
                      интересный лот.
                    </p>
                    <button onClick={() => setAuctionFavoritesOnly(false)}>
                      Показать все лоты
                    </button>
                  </div>
                )}
              </div>
            </section>
          )}

          {screen === "liveAuction" && auctionLot && (
            <LiveAuction
              lot={auctionLot}
              balance={balance}
              participationFee={auctionFee}
              regularParticipationFee={regularAuctionFee}
              tutorialFree={firstServiceOrderFree}
              soundEnabled={soundEnabled}
              onBack={() => setScreen("auction")}
              onRegister={registerAuction}
              onAbandon={() => {
                setClosedLotIds((ids) => [...new Set([...ids, auctionLot.id])]);
                setToast(
                  `Вы покинули торги. Лот #${43820 + auctionLot.id} закрыт и удалён`,
                );
                setScreen("auction");
              }}
              onLose={() => {
                setClosedLotIds((ids) => [...new Set([...ids, auctionLot.id])]);
                setToast(
                  `Лот #${43820 + auctionLot.id} продан другому участнику и удалён с аукциона`,
                );
              }}
              onWin={(bid) => buyCar(auctionLot, bid)}
            />
          )}

          {screen === "garage" && (
            <EmptyGuard
              when={garageVehicles.length > 0 || pendingPurchase !== null}
              text={
                sold
                  ? "Автомобиль продан"
                  : "Вы ещё не купили ни одного автомобиля"
              }
              description={
                sold
                  ? "Сделка сохранена в финансовой истории. Найдите следующий автомобиль на аукционе."
                  : undefined
              }
              action={() => setScreen(sold ? "bank" : "auction")}
              label={sold ? "Открыть историю сделки" : "Открыть аукцион"}
            >
              {pendingPurchase ? (
                <section className="purchase-contract">
                  <header>
                    <div>
                      <small>
                        ДОГОВОР ПОКУПКИ · LOT #{43820 + pendingPurchase.lot.id}
                      </small>
                      <h2>Подтвердите импорт автомобиля</h2>
                    </div>
                    <b>
                      {pendingPurchase.lot.year} {pendingPurchase.lot.title}
                    </b>
                  </header>
                  <div className="contract-grid">
                    <article>
                      <img
                        src={pendingPurchase.lot.image}
                        alt={pendingPurchase.lot.title}
                      />
                      <h3>{pendingPurchase.lot.damage}</h3>
                      <p>
                        После подтверждения автомобиль появится в «Моих авто» со
                        статусом доставки.
                      </p>
                    </article>
                    <div>
                      <h3>Контракт определяется автоматически</h3>
                      <div className="automatic-contract-note">
                        {activeContracts.find((contract) =>
                          leadMatchesLot(contract, pendingPurchase.lot),
                        ) ? (
                          <>
                            <CircleCheck aria-hidden="true" />
                            <span>
                              <b>
                                Подходит заказу {activeContracts.find((contract) =>
                                  leadMatchesLot(contract, pendingPurchase.lot),
                                )?.name}
                              </b>
                              <small>
                                Машина будет прикреплена к клиенту после оплаты автоматически.
                              </small>
                            </span>
                          </>
                        ) : (
                          <>
                            <CarFront aria-hidden="true" />
                            <span>
                              <b>Покупка для свободного рынка</b>
                              <small>Активного заказа на эту модель сейчас нет.</small>
                            </span>
                          </>
                        )}
                      </div>
                      <h3>Способ доставки</h3>
                      <div className="shipping-options">
                        {(
                          Object.entries(shippingPlans) as [
                            ShippingPlan,
                            (typeof shippingPlans)[ShippingPlan],
                          ][]
                        ).map(([id, plan]) => (
                          <button
                            key={id}
                            className={shippingPlan === id ? "selected" : ""}
                            onClick={() => setShippingPlan(id)}
                          >
                            <span>
                              <b>{plan.label}</b>
                              <small>{plan.note}</small>
                            </span>
                            <strong>
                              {priceWithTutorialFree(
                                plan.price,
                                firstServiceOrderFree ? 0 : plan.price,
                              )}{" "}
                              · {plan.days ? `${plan.days * 10} мин.` : "сразу"}
                            </strong>
                          </button>
                        ))}
                      </div>
                      {assignedContract && (
                        <div className="deadline-forecast">
                          <span>
                            Контракт: <b>{assignedContract.name}</b>
                          </span>
                          <span>
                            Срок клиента: <b>без дедлайна</b>
                          </span>
                        </div>
                      )}
                      <dl className="contract-costs">
                        <div>
                          <dt>Победная ставка</dt>
                          <dd>{priceWithTutorialFree(pendingPurchase.bid, firstServiceOrderFree ? 0 : pendingPurchase.bid)}</dd>
                        </div>
                        <div>
                          <dt>Сбор аукциона</dt>
                          <dd>Оплачен · {priceWithTutorialFree(regularAuctionFee, auctionFee)}</dd>
                        </div>
                        <div>
                          <dt>Брокер, порт, перевозка и оформление</dt>
                          <dd>{priceWithTutorialFree(shippingPlans[shippingPlan].price, shippingCost)}</dd>
                        </div>
                        <div className="total">
                          <dt>К оплате сейчас</dt>
                          <dd>
                            {firstServiceOrderFree
                              ? <strong className="tutorial-total-free">БЕСПЛАТНО</strong>
                              : money(pendingPurchase.bid + shippingCost)}
                          </dd>
                        </div>
                      </dl>
                      {balance <
                        (firstServiceOrderFree ? 0 : pendingPurchase.bid) +
                          shippingCost && (
                        <p className="contract-warning">
                          Недостаточно средств. Можно оформить кредит в банке.
                        </p>
                      )}
                      <div className="contract-actions">
                        <button onClick={() => setScreen("bank")}>
                          Открыть банк
                        </button>
                        <button className="primary" onClick={confirmPurchase}>
                          {firstServiceOrderFree ? "Получить по учебному гранту" : "Подписать и оплатить"}
                        </button>
                      </div>
                    </div>
                  </div>
                </section>
              ) : (
                <>
                {garageVehicles.length > 0 && (
                  <section className="garage-switcher" aria-label="Автомобили в гараже">
                    <header>
                      <div>
                        <small>МОЙ ГАРАЖ</small>
                        <b>{garageVehicles.length} авто в работе</b>
                      </div>
                      <button onClick={() => setScreen("auction")}>+ Купить ещё</button>
                    </header>
                    <div>
                      {garageVehicles.map((vehicle) => {
                        const arriving =
                          vehicle.arrivalDay !== null && day < vehicle.arrivalDay;
                        const status = arriving
                          ? `В пути · ${vehicle.id === activeGarageId ? deliveryRemainingLabel : "доставка идёт"}`
                          : vehicle.repaired
                            ? "Готова к продаже"
                            : vehicle.diagnosed
                              ? "Ремонт / запчасти"
                              : "Нужна диагностика";
                        return (
                          <button
                            key={vehicle.id}
                            className={vehicle.id === activeGarageId ? "active" : ""}
                            onClick={() => selectGarageVehicle(vehicle.id)}
                          >
                            <img src={vehicle.lot.image} alt="" />
                            <span>
                              <b>{vehicle.lot.year} {vehicle.lot.title}</b>
                              <small>{status}</small>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </section>
                )}
                <section className="vehicle-layout">
                  <article className="vehicle-card">
                    <div className="vehicle-title">
                      <span>
                        {activeVehicle.title.split(" ")[0].toUpperCase()}
                      </span>
                      <h2>
                        {activeVehicle.title.split(" ").slice(1).join(" ")}{" "}
                        <small>{activeVehicle.year}</small>
                      </h2>
                      <p>VIN: {activeVin}</p>
                    </div>
                    <div className="large-car">
                      <img
                        src={ownedImage}
                        alt={`${activeVehicle.year} ${activeVehicle.title}`}
                      />
                      <button
                        style={{
                          left: `${activeVehicle.x}%`,
                          top: `${activeVehicle.y}%`,
                        }}
                        className={`damage-marker ${activeVehicle.marker}`}
                        aria-label={activeVehicle.damage}
                      >
                        <i />
                        <span>{activeVehicle.damage}</span>
                      </button>
                      <b>{activeVehicle.title.split(" ")[0].toUpperCase()}</b>
                    </div>
                    <div className="status-line">
                      <i />
                      <span>
                        {sold
                          ? "Продана"
                          : inTransit
                            ? `В пути · осталось ${deliveryRemainingLabel}`
                            : repairInProgress
                              ? `В ремонте · осталось ${repairRemainingLabel}`
                              : repaired
                                ? "Готова к продаже"
                                : diagnosed
                                  ? "Ожидание деталей"
                                  : "Прибыла в сервис"}
                      </span>
                    </div>
                  </article>
                  <div className="vehicle-info">
                    <div className="summary">
                      <span>
                        <small>КУПЛЕНА</small>
                        {money(purchasePrice)}
                      </span>
                      <span>
                        <small>ВЛОЖЕНО</small>
                        {money(totalInvested)}
                      </span>
                      <span>
                        <small>ПРОГНОЗ</small>
                        {money(projectedSale)}
                      </span>
                    </div>
                    {assignedContract && (
                      <div className="assigned-contract">
                        <small>АВТОМОБИЛЬ ЗАКРЕПЛЁН ЗА КОНТРАКТОМ</small>
                        <b>
                          {assignedContract.name} · {assignedContract.car}
                        </b>
                        <span>
                          Бюджет {money(assignedContract.budget)} · без дедлайна
                        </span>
                      </div>
                    )}
                    <h3>Путь автомобиля</h3>
                    <div className="timeline">
                      <div className="done">
                        <i>✓</i>
                        <b>Аукцион</b>
                        <small>Лот выигран</small>
                      </div>
                      <div className={inTransit ? "current" : "done"}>
                        <i>{inTransit ? "2" : "✓"}</i>
                        <b>Доставка</b>
                        <small>
                          {inTransit
                            ? `${shippingPlans[shippingPlan].label} · ${deliveryRemainingLabel}`
                            : "Прибыла в сервис"}
                        </small>
                      </div>
                      <div className={diagnosed ? "done" : "current"}>
                        <i>{diagnosed ? "✓" : "3"}</i>
                        <b>Диагностика</b>
                        <small>
                          {diagnosed
                            ? `${defectCount} дефектов`
                            : "Ожидает решения"}
                        </small>
                      </div>
                      <div
                        className={
                          repaired ? "done" : diagnosed ? "current" : ""
                        }
                      >
                        <i>{repaired ? "✓" : "4"}</i>
                        <b>Ремонт</b>
                        <small>
                          {repaired
                            ? "Завершён"
                            : allReady
                              ? "Можно начать"
                              : "Нужны детали"}
                        </small>
                      </div>
                    </div>
                    {inTransit && (
                      <div className="transit-notice">
                        <b>Автомобиль находится в пути</b>
                        <span>
                          Диагностика станет доступна примерно через {deliveryRemainingLabel}.
                          Содержание начисляется каждый расчётный период.
                        </span>
                        <button
                          onClick={() => openRewardAd("delivery")}
                          disabled={!rewardAdAvailable}
                        >
                          <TimerReset aria-hidden="true" />
                          {rewardAdAvailable
                            ? "Реклама: ускорить на 30 минут"
                            : "Рекламный бонус недоступен"}
                        </button>
                      </div>
                    )}
                    {!diagnosed && !inTransit && (
                      <button
                        className="primary wide"
                        onClick={() => setScreen("service")}
                      >
                        Провести диагностику →
                      </button>
                    )}
                    {diagnosed && !repaired && !repairInProgress && (
                      <button
                        className="primary wide"
                        onClick={() => setScreen("service")}
                      >
                        Выбрать детали и отремонтировать →
                      </button>
                    )}
                    {repaired && !sold && (
                      <div className="garage-sale-options">
                        <div className="buyer-route">
                          <div>
                            <small>ПРОДАЖА ПО ЗАЯВКЕ</small>
                            <b>
                              {matchingLeads.length
                                ? `Подходящих клиентов: ${matchingLeads.length}`
                                : matchesAlexOrder && alexOrderAccepted
                                  ? "Подходит заказ Алексея"
                                  : "Подходящих заявок пока нет"}
                            </b>
                            <span>
                              {matchingLeads.length
                                ? `${matchingLeads[0].name} ищет ${matchingLeads[0].car} · бюджет ${money(matchingLeads[0].budget)}`
                                : matchesAlexOrder && alexOrderAccepted
                                  ? "Toyota Camry 2018–2020 · бюджет $18 000"
                                  : "Можно дождаться клиента или выставить машину прямо сейчас"}
                            </span>
                          </div>
                          {(matchingLeads.length > 0 ||
                            (matchesAlexOrder && alexOrderAccepted)) && (
                            <button
                              onClick={() => {
                                if (matchingLeads[0])
                                  openLead(matchingLeads[0].id);
                                else setActiveChat("client");
                                setScreen("messages");
                              }}
                            >
                              Открыть подходящего клиента →
                            </button>
                          )}
                        </div>
                        <div className="sale-waiting">
                          <div className="market-listing">
                            <div>
                              <b>
                                {listedDay === null
                                  ? "Выставить на свободный рынок"
                                  : `В продаже ${daysListed} дн.`}
                              </b>
                              <span>
                                Рыночная оценка {money(fairMarketPrice)} ·
                                прогноз {expectedSaleDays} дн.
                              </span>
                            </div>
                            <label>
                              Цена продажи
                              <input
                                type="number"
                                value={askingPrice}
                                disabled={listedDay !== null}
                                onChange={(e) =>
                                  setAskingPrice(Number(e.target.value))
                                }
                              />
                            </label>
                            {listedDay === null ? (
                              <button className="primary" onClick={listForSale}>
                                Опубликовать объявление
                              </button>
                            ) : (
                              <button
                                className="primary"
                                onClick={lowerListingPrice}
                              >
                                Снизить цену на 6%
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
                </>
              )}
            </EmptyGuard>
          )}

          {screen === "service" && (
            <EmptyGuard
              when={owned && !inTransit}
              text="Сначала приобретите автомобиль"
              description={
                inTransit
                  ? `Автомобиль ещё в пути. Осталось примерно ${deliveryRemainingLabel}; до прибытия диагностика недоступна.`
                  : undefined
              }
              action={() => setScreen(inTransit ? "garage" : "auction")}
              label={inTransit ? "Вернуться в мои авто" : "Перейти к лотам"}
            >
              <section className="repair-hub">
                {garageVehicles.length > 1 && (
                  <div className="repair-vehicle-strip">
                    <span>АВТОМОБИЛИ В СЕРВИСЕ</span>
                    <div>
                      {garageVehicles.map((vehicle) => (
                        <button
                          key={vehicle.id}
                          className={vehicle.id === activeGarageId ? "active" : ""}
                          onClick={() => selectGarageVehicle(vehicle.id)}
                        >
                          <img src={vehicle.lot.image} alt="" />
                          <span>
                            <b>{vehicle.lot.title}</b>
                            <small>{vehicle.diagnosed ? "Заказ-наряд открыт" : "Нужна диагностика"}</small>
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="repair-hub-grid">
                  <article className="repair-hub-stage">
                    <img
                      src={ownedImage}
                      alt={`${activeVehicle.year} ${activeVehicle.title}`}
                    />
                    <div className="repair-stage-shade" />
                    <header className="repair-car-heading">
                      <div>
                        <small>АВТОМОБИЛЬ В РАБОТЕ</small>
                        <h2>{activeVehicle.title} <em>{activeVehicle.year}</em></h2>
                        <span>{activeVin}</span>
                      </div>
                      <b className={`repair-risk risk-${activeVehicle.risk.toLowerCase()}`}>
                        {diagnosed ? `${defectCount} дефектов` : activeVehicle.damage}
                      </b>
                    </header>

                    {diagnosed ? (
                      <div className="repair-damage-markers">
                        {serviceDamageMarkers.map(({ part, x, y }, index) => (
                          <button
                            key={part.id}
                            style={{ left: `${x}%`, top: `${y}%` }}
                            title={part.name}
                            onClick={() => setToast(`${index + 1}. ${part.name}: ${delivered.includes(part.id) ? "на складе" : ordered.includes(part.id) ? "в пути" : "нужно заказать"}`)}
                          >
                            {index + 1}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <button
                        className="repair-primary-marker"
                        style={{ left: `${activeVehicle.x}%`, top: `${activeVehicle.y}%` }}
                        title={activeVehicle.damage}
                      >
                        !
                      </button>
                    )}

                    <div className="repair-readiness-card">
                      <div
                        className="repair-readiness-ring"
                        style={{ "--repair-progress": `${serviceReadiness * 3.6}deg` } as React.CSSProperties}
                      >
                        <span>{serviceReadiness}%</span>
                      </div>
                      <p>
                        <small>ГОТОВНОСТЬ</small>
                        <b>
                          {repaired
                            ? "Автомобиль готов"
                            : repairInProgress
                              ? `Осталось ${repairRemainingLabel}`
                              : diagnosed
                                ? `${receivedRequiredParts}/${requiredCatalog.length} деталей на складе`
                                : "Ожидает диагностику"}
                        </b>
                      </p>
                    </div>

                    <div className="repair-stage-controls">
                      <div className="repair-stage-flow">
                        {[
                          { label: "Приёмка", done: true, active: !diagnosed },
                          { label: "Диагностика", done: diagnosed, active: !diagnosed },
                          { label: "Детали", done: diagnosed && allReady, active: diagnosed && !allReady },
                          { label: "Ремонт", done: repaired, active: allReady && !repaired },
                          { label: "Контроль", done: repaired, active: repairInProgress },
                          { label: "Готово", done: repaired, active: repaired },
                        ].map((stage, index) => (
                          <span
                            key={stage.label}
                            className={`${stage.done ? "done" : ""} ${stage.active ? "active" : ""}`}
                          >
                            <i>{stage.done ? "✓" : index + 1}</i>
                            <b>{stage.label}</b>
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>

                  <aside className="repair-work-order">
                    <header>
                      <div>
                        <small>ЦИФРОВОЙ ЗАКАЗ-НАРЯД</small>
                        <h2>№{String(activeVehicle.id + 13).padStart(3, "0")}</h2>
                      </div>
                      <span className={repaired ? "complete" : ""}>
                        {repaired
                          ? "ЗАВЕРШЁН"
                          : repairInProgress
                            ? "В РАБОТЕ"
                            : diagnosed
                              ? "ОТКРЫТ"
                              : "ДИАГНОСТИКА"}
                      </span>
                    </header>

                    {firstServiceOrderFree && (
                      <div className="first-order-free">
                        <Gift aria-hidden="true" />
                        <span>
                          <b>Первый учебный заказ полностью бесплатно</b>
                          <small>Автомобиль, VIN, сбор, доставка, детали, диагностика и ремонт оплачены учебным грантом.</small>
                        </span>
                      </div>
                    )}

                    <div className="repair-order-summary">
                      <span><ClipboardList aria-hidden="true" /><small>ПОВРЕЖДЕНИЕ</small><b>{activeVehicle.damage}</b></span>
                      <span><CircleGauge aria-hidden="true" /><small>СРОК РЕМОНТА</small><b>{repairInProgress ? repairRemainingLabel : `${effectiveRepairDurationMinutes} мин.`}</b></span>
                      <span><ShieldCheck aria-hidden="true" /><small>КАЧЕСТВО</small><b>{partsQuality ? `${partsQuality}%` : "—"}</b></span>
                    </div>

                    <div className="repair-order-list">
                      <div className="repair-order-title">
                        <span>
                          <small>КОМПЛЕКТ ДЛЯ РЕМОНТА</small>
                          <b>{diagnosed ? `Соберите ${requiredCatalog.length} детали` : "Скрыто до осмотра"}</b>
                        </span>
                        {diagnosed && <em>{receivedRequiredParts}/{requiredCatalog.length}</em>}
                      </div>
                      {diagnosed ? (
                        requiredCatalog.map((part, index) => {
                          const isDelivered = delivered.includes(part.id);
                          const option = selectedOption(part.id);
                          return (
                            <article
                              key={part.id}
                              className={`repair-part-choice ${isDelivered ? "stock" : "missing"}`}
                            >
                              <i><Wrench aria-hidden="true" /><span>{index + 1}</span></i>
                              <span className="repair-part-name">
                                <b>{part.name}</b>
                                <small>
                                  {isDelivered
                                    ? `${option.label} · готово к установке`
                                    : "Выберите вариант и заберите деталь"}
                                </small>
                              </span>
                              {isDelivered ? (
                                <em>ГОТОВО</em>
                              ) : (
                                <div className="repair-part-buy">
                                  <div className="repair-quality-picks">
                                    {partOptions.map((partOption, optionIndex) => (
                                      <button
                                        key={partOption.label}
                                        className={(selectedPartOptions[part.id] ?? 1) === optionIndex ? "active" : ""}
                                        onClick={() =>
                                          setSelectedPartOptions((values) => ({
                                            ...values,
                                            [part.id]: optionIndex,
                                          }))
                                        }
                                      >
                                        <span>
                                          <b>{partOption.label}</b>
                                          <small>{partOption.quality}%</small>
                                        </span>
                                        <strong>
                                          {priceWithTutorialFree(
                                            regularPartPriceForOption(part, optionIndex),
                                            partPriceForOption(part, optionIndex),
                                          )}
                                        </strong>
                                      </button>
                                    ))}
                                  </div>
                                  <button className="repair-buy-button" onClick={() => order(part)}>
                                    <ShoppingCart aria-hidden="true" />
                                    {firstServiceOrderFree
                                      ? <>Забрать · <del>{money(regularPartPriceForOption(part, selectedPartOptions[part.id] ?? 1))}</del> БЕСПЛАТНО</>
                                      : <>Забрать за {money(partPrice(part))}</>}
                                  </button>
                                </div>
                              )}
                            </article>
                          );
                        })
                      ) : (
                        <div className="repair-diagnostic-prompt">
                          <CircleGauge aria-hidden="true" />
                          <div>
                            <b>{activeVehicle.risk === "Высокий" ? "Углублённая диагностика" : "Стандартная диагностика"}</b>
                            <p>После осмотра появятся точные повреждения, детали и итоговая смета.</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="repair-cost-strip">
                      <span><small>РАБОТА</small><b>{priceWithTutorialFree(regularRepairCost, repairCost)}</b></span>
                      <span><small>ДЕТАЛИ</small><b>{diagnosed ? (firstServiceOrderFree ? "БЕСПЛАТНО" : money(orderedPartsTotal)) : "—"}</b></span>
                      <span><small>ИТОГО</small><b>{firstServiceOrderFree ? "БЕСПЛАТНО" : diagnosed ? money(serviceWorkOrderTotal) : money(diagnosticCost)}</b></span>
                    </div>

                    <div className="repair-order-actions">
                      {!diagnosed ? (
                        <button className="repair-shop-action" onClick={diagnose}>
                          <CircleGauge aria-hidden="true" />
                          <span>Провести диагностику · {priceWithTutorialFree(regularDiagnosticCost, diagnosticCost)}</span>
                        </button>
                      ) : (
                        <button
                          className="repair-shop-action"
                          disabled
                        >
                          <ShoppingCart aria-hidden="true" />
                          {allReady
                            ? "Комплект собран"
                            : `Осталось забрать: ${requiredCatalog.length - orderedRequiredParts}`}
                        </button>
                      )}
                      {diagnosed && (
                        <button
                          className={`repair-start-action ${allReady && !repaired && !repairInProgress ? "ready" : ""}`}
                          onClick={repaired ? () => setScreen("garage") : repair}
                          disabled={!allReady || repairInProgress}
                        >
                          <Wrench aria-hidden="true" />
                          {repaired
                            ? "Вернуться к автомобилю"
                            : repairInProgress
                              ? `Ремонт идёт · ${repairRemainingLabel}`
                              : allReady
                                ? firstServiceOrderFree
                                  ? <>Начать ремонт · {effectiveRepairDurationMinutes} мин. · <del>{money(regularRepairCost)}</del> БЕСПЛАТНО</>
                                  : `Начать ремонт · ${effectiveRepairDurationMinutes} мин. · ${money(repairCost)}`
                                : "Ремонт заблокирован — нужны детали"}
                        </button>
                      )}
                      {repairInProgress && (
                        <button
                          className="repair-ad-action"
                          onClick={() => openRewardAd("repair")}
                          disabled={!rewardAdAvailable}
                        >
                          <TimerReset aria-hidden="true" />
                          {rewardAdAvailable
                            ? "Реклама: сократить ремонт на 30 минут"
                            : "Ускорение временно недоступно"}
                        </button>
                      )}
                    </div>
                  </aside>
                </div>
              </section>
            </EmptyGuard>
          )}

          {screen === "parts" && (
            <section className="parts-shop">
              <header>
                <div>
                  <span className="eyebrow">
                    МАГАЗИН ЗАПЧАСТЕЙ
                  </span>
                  <h2>Каталог деталей</h2>
                  <p>
                    Выберите автомобиль, качество и срок доставки
                  </p>
                </div>
                <div className="parts-progress">
                  <b>
                    {delivered.length}/{catalog.length}
                  </b>
                  <small>НА СКЛАДЕ</small>
                </div>
              </header>
              <div className="vehicle-picker">
                <small>АВТОМОБИЛЬ</small>
                <div>
                  {shopVehicles.map((vehicle) => (
                    <button
                      key={vehicle.id}
                      className={shopVehicle === vehicle.id ? "selected" : ""}
                      onClick={() =>
                        shopVehicle === vehicle.id ||
                        (setShopVehicle(vehicle.id), setSelectedPartOptions({}))
                      }
                    >
                      <b>{vehicle.label}</b>
                      <span>{vehicle.years}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="parts-catalog-tools">
                <label>
                  ⌕
                  <input
                    value={partSearch}
                    onChange={(e) => setPartSearch(e.target.value)}
                    placeholder="Поиск по названию или артикулу"
                    aria-label="Поиск запчастей"
                  />
                </label>
                <span>
                  {diagnosed
                    ? `${requiredShopCatalog.length} по наряду · ${freeShopCatalog.length} в каталоге`
                    : `${filteredCatalog.length} товаров найдено`}
                </span>
                {diagnosed && (
                  <button onClick={() => setScreen("service")}>
                    Вернуться к заказ-наряду →
                  </button>
                )}
              </div>
              <div className="category-tabs">
                {[
                  "Все",
                  "Кузов",
                  "Оптика",
                  "Охлаждение",
                  "Безопасность",
                  "Подвеска",
                  "Электрика",
                ].map((category) => (
                  <button
                    key={category}
                    className={partCategory === category ? "active" : ""}
                    onClick={() => setPartCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <div className="parts-summary-bar">
                <span>
                  Автомобиль{" "}
                  <b>{shopVehicles.find((v) => v.id === shopVehicle)?.label}</b>
                </span>
                <span>
                  Заказано <b>{ordered.length}</b>
                </span>
                <span>
                  Среднее качество{" "}
                  <b>
                    {partsQuality || "—"}
                    {partsQuality ? "%" : ""}
                  </b>
                </span>
                <span>
                  Потрачено <b>{money(orderedPartsTotal)}</b>
                </span>
              </div>
              <div className="part-cards shop-product-grid">
                {diagnosed && (
                  <div className="work-order-priority-head">
                    <div>
                      <small>ЗАКАЗ-НАРЯД №{String(activeVehicle.id).padStart(3, "0")}</small>
                      <h3>Обязательные детали</h3>
                      <p>
                        {activeVehicle.year} {activeVehicle.title} · {activeVehicle.damage}
                      </p>
                    </div>
                    <b>
                      {requiredCatalog.filter((part) => delivered.includes(part.id)).length}
                      /{requiredCatalog.length} на складе
                    </b>
                  </div>
                )}
                {displayedShopCatalog.map((part, index) => {
                  const isOrdered = ordered.includes(part.id);
                  const isDelivered = delivered.includes(part.id);
                  const isRequired = requiredPartIds.has(part.id);
                  const choice = selectedPartOptions[part.id] ?? 1;
                  const option = partOptions[choice];
                  const supplierId = partSuppliers[part.id] ?? "standard";
                  const supplier = suppliers[supplierId];
                  return (
                    <Fragment key={part.id}>
                    {diagnosed &&
                      index === requiredShopCatalog.length &&
                      freeShopCatalog.length > 0 && (
                        <div className="free-catalog-divider">
                          <span>СВОБОДНЫЙ КАТАЛОГ</span>
                          <b>Дополнительные совместимые запчасти</b>
                        </div>
                      )}
                    <article className={isRequired ? "work-order-part" : ""}>
                      {isRequired && (
                        <div className="work-order-ribbon">
                          {isDelivered
                            ? "ПО НАРЯДУ · ПОЛУЧЕНО"
                            : isOrdered
                              ? "ПО НАРЯДУ · В ПУТИ"
                              : "ПО НАРЯДУ · НУЖНО ЗАКАЗАТЬ"}
                        </div>
                      )}
                      <div className="part-card-head">
                        <span className="generic-part-image">{part.icon}</span>
                        <div>
                          <small>
                            {part.brand} · {part.category}
                          </small>
                          <h3>{part.name}</h3>
                          <p>{part.description}</p>
                          <div className="fitment">
                            ✓{" "}
                            {
                              shopVehicles.find((v) => v.id === shopVehicle)
                                ?.label
                            }{" "}
                            ·{" "}
                            {
                              shopVehicles.find((v) => v.id === shopVehicle)
                                ?.years
                            }
                            {isRequired && <b>НУЖНО ПО ЗАКАЗ-НАРЯДУ</b>}
                          </div>
                        </div>
                        <span
                          className={`part-state ${isDelivered ? "received" : isOrdered ? "ordered" : ""}`}
                        >
                          {isDelivered
                            ? "НА СКЛАДЕ"
                            : isOrdered
                              ? "В ПУТИ"
                              : "НЕ ЗАКАЗАНО"}
                        </span>
                      </div>
                      <div className="option-grid">
                        {partOptions.map((item, i) => (
                          <button
                            key={item.label}
                            disabled={isOrdered}
                            className={choice === i ? "selected" : ""}
                            onClick={() =>
                              setSelectedPartOptions((v) => ({
                                ...v,
                                [part.id]: i,
                              }))
                            }
                          >
                            <span>
                              <b>{item.label}</b>
                            </span>
                            <span>
                              <strong>
                                {priceWithTutorialFree(
                                  regularPartPriceForOption(part, i),
                                  partPriceForOption(part, i),
                                )}
                              </strong>
                              <small>гарантия {item.warranty}</small>
                            </span>
                            <i>{item.quality}% качество</i>
                          </button>
                        ))}
                      </div>
                      <div className="supplier-grid">
                        {(
                          Object.entries(suppliers) as [
                            SupplierId,
                            (typeof suppliers)[SupplierId],
                          ][]
                        ).map(([id, item]) => (
                          <button
                            key={id}
                            disabled={isOrdered}
                            className={supplierId === id ? "selected" : ""}
                            onClick={() =>
                              setPartSuppliers((v) => ({ ...v, [part.id]: id }))
                            }
                          >
                            <span>
                              <b>{item.label}</b>
                            </span>
                            <strong>
                              {item.eta} дн. · {item.reliability}%
                            </strong>
                          </button>
                        ))}
                      </div>
                      <footer>
                        <div>
                          <span>
                            Выбрано: <b>{option.label}</b>
                          </span>
                          <span>
                            Поставщик: <b>{supplier.label}</b>
                          </span>
                          <span>
                            Доставка: <b>{supplier.eta} дн.</b>
                          </span>
                          <span>
                            Гарантия: <b>{option.warranty}</b>
                          </span>
                        </div>
                        <button
                          onClick={() => order(part)}
                          disabled={isOrdered}
                        >
                          {isDelivered
                            ? "Получено"
                            : isOrdered
                              ? `Заказано · ${money(partPrice(part))}`
                              : firstServiceOrderFree
                                ? <>Заказать · <del>{money(regularPartPriceForOption(part, choice))}</del> БЕСПЛАТНО</>
                                : `Заказать · ${money(partPrice(part))}`}
                        </button>
                      </footer>
                    </article>
                    </Fragment>
                  );
                })}
              </div>
              <div className="parts-footer">
                <p>
                  Комплект:{" "}
                  <b>
                    {ordered.length}/{catalog.length}
                  </b>{" "}
                  · потрачено <b>{money(orderedPartsTotal)}</b>
                </p>
                <button onClick={() => setScreen("service")}>
                  Вернуться в автосервис →
                </button>
              </div>
            </section>
          )}

          {screen === "messages" && (
            <section
              className={`inbox game-orders ${mobileChatOpen ? "mobile-chat-open" : ""}`}
            >
              <aside className="inbox-list">
                <div className="inbox-title">
                  <h2>Клиенты</h2>
                  <span>{activeContracts.length} активных</span>
                </div>
                {alexConversationVisible && (
                  <button
                    onClick={() => {
                      setActiveChat("client");
                      setMobileChatOpen(true);
                    }}
                    className={`thread ${activeChat === "client" ? "active" : ""} ${alexResolvedDay !== null ? "resolved" : ""}`}
                  >
                    <span className="avatar client">АК</span>
                    <p>
                      <b>Алексей · клиент</b>
                      <small>
                        {alexResolvedDay !== null
                          ? "Спасибо, машина отличная!"
                          : alexOrderAccepted
                            ? "Есть новости по заказу?"
                            : alexOrderDeclined
                              ? "Заказ отклонён"
                              : "Ждёт подтверждения заказа"}
                      </small>
                      {alexOrderAccepted ? (
                        <em className="contract-badge">КОНТРАКТ</em>
                      ) : alexResolvedDay !== null ? (
                        <em className="history-badge">СДЕЛКА ЗАВЕРШЕНА</em>
                      ) : null}
                    </p>
                    <time>{alexResolvedDay !== null ? "завершено" : "сейчас"}</time>
                  </button>
                )}
                {orderedClientLeads.map((lead) => (
                  <button
                    key={lead.id}
                    onClick={() => openLead(lead.id)}
                    className={`thread ${activeChat === `lead-${lead.id}` ? "active" : ""} ${resolvedLeadDays[lead.id] !== undefined ? "resolved" : ""}`}
                  >
                    <span className="avatar client">{lead.initials}</span>
                    <p>
                      <b>
                        {lead.name}
                        {!lead.read && <i className="new-dot" />}
                      </b>
                      <small>
                        {resolvedLeadDays[lead.id] !== undefined
                          ? declinedLeadIds.includes(lead.id)
                            ? "Заявка отклонена"
                            : "Сделка завершена"
                          : `Ищу ${lead.car}`}
                      </small>
                      {acceptedContracts.includes(lead.id) ? (
                        <em className="contract-badge">КОНТРАКТ</em>
                      ) : resolvedLeadDays[lead.id] !== undefined ? (
                        <em className="history-badge">СКОРО ИСЧЕЗНЕТ</em>
                      ) : null}
                    </p>
                    <time>{lead.read ? "заявка" : "новое"}</time>
                  </button>
                ))}
              </aside>
              <div className="conversation">
                <header>
                  <button
                    className="mobile-chat-back"
                    onClick={() => setMobileChatOpen(false)}
                    aria-label="Вернуться к списку сообщений"
                  >
                    ←
                  </button>
                  <span
                    className={`avatar ${currentLead ? "client" : activeChat}`}
                  >
                    {currentLead?.initials ||
                      (activeChat === "client"
                        ? "АК"
                        : activeChat === "service"
                          ? "СТО"
                          : "БР")}
                  </span>
                  <div>
                    <b>
                      {currentLead?.name ||
                        (activeChat === "client"
                          ? "Алексей Ковалёв"
                          : activeChat === "service"
                            ? "North Auto Service"
                            : "Марина · таможенный брокер")}
                    </b>
                    <small>
                      <i />{" "}
                      {currentLead
                        ? `новая заявка · ${currentLead.city}`
                        : activeChat === "client"
                          ? "клиент по заказу #001"
                          : activeChat === "service"
                            ? "ремонт и диагностика"
                            : "доставка и документы"}
                    </small>
                  </div>
                  {currentLead && (
                    <button
                      className="delete-chat"
                      onClick={() => deleteConversation(currentLead.id)}
                    >
                      Удалить
                    </button>
                  )}
                </header>
                {!currentLead && <div className="chat-date">СЕГОДНЯ</div>}
                {currentLead && (
                  <>
                    <div
                      className={`deal-brief new-lead ${acceptedContracts.includes(currentLead.id) ? "accepted" : ""}`}
                    >
                      <span>
                        {resolvedLeadDays[currentLead.id] !== undefined
                          ? declinedLeadIds.includes(currentLead.id)
                            ? "ЗАЯВКА ЗАКРЫТА"
                            : "СДЕЛКА ЗАВЕРШЕНА"
                          : acceptedContracts.includes(currentLead.id)
                          ? "АКТИВНЫЙ КОНТРАКТ"
                          : declinedLeadIds.includes(currentLead.id)
                            ? "ЗАЯВКА ОТКЛОНЕНА"
                          : "УСЛОВИЯ НА СОГЛАСОВАНИИ"}{" "}
                        · #{currentLead.id}
                      </span>
                      <h3>{currentLead.car}</h3>
                      <div className="order-facts">
                        <b><small>БЮДЖЕТ</small>{money(currentLead.budget)}</b>
                        <b><small>СРОК</small>БЕЗ ДЕДЛАЙНА</b>
                        <b><small>ГОРОД</small>{currentLead.city}</b>
                      </div>
                      <p className="order-request">Нужно: {currentLead.requirement}</p>
                      <p className="contract-deadline">
                        {resolvedLeadDays[currentLead.id] !== undefined
                          ? declinedLeadIds.includes(currentLead.id)
                            ? "Заявка закрыта. Диалог скоро исчезнет из списка."
                            : "Клиент доволен покупкой. Диалог скоро переместится в историю."
                          : acceptedContracts.includes(currentLead.id)
                          ? "Контракт активен · клиент спокойно ждёт результат"
                          : "Срок не ограничен — спокойно оцените заказ и выберите автомобиль."}
                      </p>
                      {budgetNegotiations[currentLead.id] && (
                        <div
                          className={`budget-response ${budgetNegotiations[currentLead.id]}`}
                        >
                          <b>
                            {budgetNegotiations[currentLead.id] === "full"
                              ? `Клиент согласовал повышение до ${money(currentLead.budget)}`
                              : budgetNegotiations[currentLead.id] === "compromise"
                                ? `Компромиссный бюджет: ${money(currentLead.budget)}`
                                : `Клиент оставил бюджет ${money(currentLead.budget)}`}
                          </b>
                          <small>
                            {budgetNegotiations[currentLead.id] === "full"
                              ? "Запрос +10% принят полностью."
                              : budgetNegotiations[currentLead.id] === "compromise"
                                ? "Вместо +10% клиент согласился на +5%."
                                : "Дальнейший торг по бюджету недоступен."}
                          </small>
                        </div>
                      )}
                      {resolvedLeadDays[currentLead.id] !== undefined ? (
                        <div className="completed-contract-note">
                          <CircleCheck aria-hidden="true" />
                          <span>
                            <b>
                              {declinedLeadIds.includes(currentLead.id)
                                ? "Заявка закрыта"
                                : "Клиент доволен автомобилем"}
                            </b>
                            <small>
                              {declinedLeadIds.includes(currentLead.id)
                                ? "Никаких дальнейших действий не требуется."
                                : "Оплата получена, сделка полностью завершена."}
                            </small>
                          </span>
                        </div>
                      ) : acceptedContracts.includes(currentLead.id) ? (
                        <div className="contract-buttons active-contract-actions">
                          <button className="primary-action" onClick={() => setScreen("auction")}>
                            Искать автомобиль
                          </button>
                          <button
                            className="danger-action"
                            onClick={() => declineLeadContract(currentLead)}
                          >
                            Расторгнуть контракт
                          </button>
                        </div>
                      ) : declinedLeadIds.includes(currentLead.id) ? (
                        <div className="declined-contract-note">
                          <b>Вы отказались от этой заявки</b>
                          <small>
                            Таймер и штрафы не действуют. Заявку можно вернуть в
                            работу.
                          </small>
                          <button onClick={() => acceptContract(currentLead.id)}>
                            Вернуть и принять контракт
                          </button>
                        </div>
                      ) : (
                        <div className="contract-buttons">
                          <button className="primary-action" onClick={() => acceptContract(currentLead.id)}>
                            Принять заказ
                          </button>
                          <button
                            className="negotiate-action"
                            onClick={() => negotiateClientBudget(currentLead)}
                            disabled={Boolean(budgetNegotiations[currentLead.id])}
                          >
                            {budgetNegotiations[currentLead.id]
                              ? "Бюджет согласован"
                              : "Попросить +10%"}
                          </button>
                          <button
                            className="danger-action"
                            onClick={() => declineLeadContract(currentLead)}
                          >
                            Отказаться
                          </button>
                        </div>
                      )}
                    </div>
                    {!sold &&
                      acceptedContracts.includes(currentLead.id) &&
                      (repaired || currentLeadGarageVehicle) && (
                      <div
                        className={`lead-match-card ${currentLeadMatches ? "match" : "mismatch"}`}
                      >
                        {currentLeadMatches ? (
                          <>
                            <small>АВТОМОБИЛЬ СООТВЕТСТВУЕТ ЗАЯВКЕ</small>
                            <h3>
                              {activeVehicle.year} {activeVehicle.title}
                            </h3>
                            <p>
                              Клиент осмотрел автомобиль и предлагает{" "}
                              <b>{money(currentLeadOffer)}</b>. Качество ремонта{" "}
                              {partsQuality}%.
                            </p>
                            <div>
                              <span>
                                Ваша прибыль{" "}
                                <b
                                  className={
                                    currentLeadOffer - totalInvested < 0
                                      ? "loss"
                                      : ""
                                  }
                                >
                                  {money(currentLeadOffer - totalInvested)}
                                </b>
                              </span>
                              <button
                                onClick={() =>
                                  sell(currentLeadOffer, currentLead.name)
                                }
                              >
                                Продать клиенту за {money(currentLeadOffer)}
                              </button>
                            </div>
                          </>
                        ) : currentLeadGarageVehicle ? (
                          <>
                            <small>ПОДХОДЯЩИЙ АВТОМОБИЛЬ НАЙДЕН В ГАРАЖЕ</small>
                            <h3>
                              {currentLeadGarageVehicle.lot.year}{" "}
                              {currentLeadGarageVehicle.lot.title}
                            </h3>
                            <p>
                              Этот автомобиль соответствует заявке {currentLead.name}.{" "}
                              {currentLeadGarageVehicle.repaired
                                ? "Ремонт завершён — машина автоматически закреплена за подходящим клиентом."
                                : "Сначала откройте автомобиль и завершите его ремонт."}
                            </p>
                            <button
                              onClick={() => {
                                selectGarageVehicle(currentLeadGarageVehicle.id);
                                setScreen("garage");
                              }}
                            >
                              Открыть подходящий автомобиль →
                            </button>
                          </>
                        ) : (
                          <>
                            <small>НЕ СООТВЕТСТВУЕТ ЗАЯВКЕ</small>
                            <h3>{activeVehicle.title} не подходит</h3>
                            <p>
                              Сейчас выбран {activeVehicle.title}, а клиент ищет{" "}
                              {currentLead.car}. Подходящего свободного
                              автомобиля в гараже пока нет.
                            </p>
                            <button onClick={() => setScreen("garage")}>
                              Открыть продажу автомобиля →
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </>
                )}
                {activeChat === "client" && (
                  <>
                    <div className="bubble incoming">
                      Ищу Toyota Camry 2018–2020. Бюджет до $18 000. Главное —
                      без серьёзного удара.<time>09:42</time>
                    </div>
                    {alexResolvedDay !== null ? (
                      <div className="deal-brief completed-order">
                        <span>СДЕЛКА ЗАВЕРШЕНА · #001</span>
                        <h3>Алексей доволен автомобилем</h3>
                        <p>
                          Спасибо! Машина полностью устраивает. Оплата уже на
                          счёте компании — больше никаких действий не требуется.
                        </p>
                        <div className="completed-contract-note">
                          <CircleCheck aria-hidden="true" />
                          <span>
                            <b>Заказ закрыт</b>
                            <small>Этот диалог скоро исчезнет из активного списка.</small>
                          </span>
                        </div>
                      </div>
                    ) : !alexOrderAccepted ? (
                      <div
                        className={`deal-brief new-lead ${alexOrderDeclined ? "declined" : ""}`}
                      >
                        <span>
                          {alexOrderDeclined
                            ? "ЗАКАЗ ОТКЛОНЁН"
                            : "УСЛОВИЯ НА СОГЛАСОВАНИИ"}{" "}
                          · #001
                        </span>
                        <h3>Toyota Camry 2018–2020</h3>
                        <div>
                          <b>Бюджет $18 000</b>
                          <b>Без дедлайна</b>
                          <b>Москва</b>
                        </div>
                        <p>До 90 000 км, без сильного удара.</p>
                        <p className="contract-deadline">
                          После подтверждения заказ станет активным, а подходящая
                          машина определится автоматически. Штрафов за время нет.
                        </p>
                        <div className="contract-buttons">
                          <button onClick={declineAlexOrder}>
                            {alexOrderDeclined ? "Оставить отклонённым" : "Отказаться"}
                          </button>
                          <button onClick={acceptAlexOrder}>
                            {alexOrderDeclined
                              ? "Вернуться и принять заказ"
                              : "Принять заказ"}
                          </button>
                        </div>
                      </div>
                    ) : repaired && !sold ? (
                      <>
                        <div className="bubble incoming offer-message">
                          Посмотрел итоговый отчёт и фотографии. Готов забрать
                          автомобиль за {money(projectedSale)}. Оформляем?
                          <time>сейчас</time>
                        </div>
                        <div
                          className={`client-offer ${qualityDiscount >= 0.1 ? "low-quality" : ""}`}
                        >
                          <span>ПРЕДЛОЖЕНИЕ КЛИЕНТА · ЗАКАЗ #001</span>
                          {!matchesAlexOrder ? (
                            <div className="offer-problem">
                              <b>Автомобиль не соответствует заказу</b>
                              <small>
                                Алексей заказывал Toyota Camry 2018–2020. Эту
                                машину ему продать нельзя.
                              </small>
                            </div>
                          ) : clientWalkedAway ? (
                            <div className="offer-problem">
                              <b>Клиент вышел из сделки</b>
                              <small>
                                Вы слишком долго торговались. Ищите другого
                                покупателя.
                              </small>
                            </div>
                          ) : (
                            <>
                              <h3>{money(negotiatedOffer)}</h3>
                              <p>
                                {activeVehicle.year} {activeVehicle.title} ·
                                оплата на бизнес-счёт
                              </p>
                              {qualityDiscount > 0 && (
                                <div className="quality-warning">
                                  <b>Клиент заметил дешёвые детали</b>
                                  <small>
                                    {cheapPartsCount} деталей б/у · снижение
                                    цены на {Math.round(qualityDiscount * 100)}%
                                  </small>
                                </div>
                              )}
                              <div>
                                <small>Ваша прибыль</small>
                                <b
                                  className={
                                    negotiatedOffer - totalInvested < 0
                                      ? "loss"
                                      : ""
                                  }
                                >
                                  {money(negotiatedOffer - totalInvested)}
                                </b>
                              </div>
                              <div className="offer-actions">
                                <button onClick={() => sell(negotiatedOffer)}>
                                  Принять {money(negotiatedOffer)}
                                </button>
                                {negotiatedOffer < projectedSale && (
                                  <button
                                    className="counter"
                                    onClick={counterOffer}
                                  >
                                    Торговаться · хочу {money(projectedSale)}
                                  </button>
                                )}
                              </div>
                              <small className="bargain-note">
                                {partsQuality >= 95
                                  ? "Качество отличное — клиент не стал торговаться."
                                  : `Качество ремонта ${partsQuality}%. Чем дешевле детали, тем жёстче торг.`}
                              </small>
                            </>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="deal-brief">
                        <span>АКТИВНЫЙ КОНТРАКТ · ЗАКАЗ #001</span>
                        <h3>Toyota Camry · до $18 000</h3>
                        <div>
                          <b>2018–2020</b>
                          <b>До 90 000 км</b>
                          <b>Без сильного удара</b>
                        </div>
                        <button
                          onClick={() => setScreen(sold ? "bank" : "auction")}
                        >
                          {sold ? "Сделка завершена" : "Посмотреть лоты →"}
                        </button>
                      </div>
                    )}
                  </>
                )}
                {activeChat === "service" && (
                  <>
                    <div className="bubble incoming">
                      {owned
                        ? diagnosed
                          ? "Диагностика завершена. Нужны запчасти перед началом работ."
                          : "Машина принята. Подтвердите стандартную диагностику за $250."
                        : "Свободно одно место. Можем принять следующий автомобиль."}
                      <time>10:18</time>
                    </div>
                    <div className="chat-action">
                      <b>
                        {owned
                          ? diagnosed
                            ? "Задача: заказать детали"
                            : "Задача: подтвердить диагностику"
                          : "Нет активных задач"}
                      </b>
                      {owned && (
                        <button
                          onClick={() =>
                            setScreen(diagnosed ? "parts" : "service")
                          }
                        >
                          Выполнить →
                        </button>
                      )}
                    </div>
                  </>
                )}
                {activeChat === "broker" && (
                  <>
                    <div className="bubble incoming">
                      Для оформления понадобятся инвойс, Bill of Sale и копия
                      Title. Я сообщу, если таможня запросит дополнительные
                      сведения.<time>вчера</time>
                    </div>
                    <div className="chat-action">
                      <b>
                        Документы:{" "}
                        {owned ? "2 из 3 получено" : "нет активной доставки"}
                      </b>
                    </div>
                  </>
                )}
                {(chatReplies[activeChat] || []).map((message, index) => (
                  <div
                    className="bubble outgoing"
                    key={`${activeChat}-${index}`}
                  >
                    {message}
                    <time>только что · ✓✓</time>
                  </div>
                ))}
              </div>
            </section>
          )}

          {screen === "mail" && (
            <section className="mail-app">
              <aside>
                <div className="mail-brand">
                  <b>MAILROOM</b>
                  <small>
                    {playerName} · {companyName}
                  </small>
                </div>
                <button className="active">
                  Входящие <b>{vinReports.length}</b>
                </button>
                <button>Документы</button>
                <button>Архив</button>
              </aside>
              <div className="mail-list">
                <header>
                  <h2>Входящие</h2>
                  <span>{vinReports.length} писем</span>
                </header>
                {vinReports.length === 0 ? (
                  <div className="mail-empty">
                    <span>✉</span>
                    <h3>Документов пока нет</h3>
                    <p>Закажите VIN-проверку в карточке аукционного лота.</p>
                    <button onClick={() => setScreen("auction")}>
                      Перейти на аукцион
                    </button>
                  </div>
                ) : (
                  vinReports.map((id) => {
                    const lot = lots.find((l) => l.id === id)!;
                    return (
                      <button
                        key={id}
                        onClick={() => setSelectedReport(id)}
                        className={selectedReport === id ? "selected" : ""}
                      >
                        <i />
                        <div>
                          <b>National Vehicle Records</b>
                          <span>
                            VIN History Report · {lot.year} {lot.title}
                          </span>
                          <small>
                            Документ VR-{43820 + id}-US готов к просмотру
                          </small>
                        </div>
                        <time>сегодня</time>
                      </button>
                    );
                  })
                )}
              </div>
              <div className="mail-reader">
                {selectedReport ? (
                  <VinDocument
                    lot={lots.find((l) => l.id === selectedReport)!}
                    playerName={playerName}
                  />
                ) : (
                  <div className="reader-empty">Выберите документ слева</div>
                )}
              </div>
            </section>
          )}

          {screen === "bank" && (
            <section className="bank-app simple-bank">
              <header className="bank-titlebar">
                <div>
                  <small>КАССА КОМПАНИИ</small>
                  <b>Деньги на покупку и ремонт автомобилей</b>
                </div>
                <span><i /> {companyName}</span>
              </header>
              <div className="bank-overview">
                <article className="bank-card">
                  <div className="bank-card-top">
                    <small>AI BANK</small>
                    <em>BUSINESS</em>
                  </div>
                  <div className="bank-card-chip" aria-hidden="true" />
                  <small className="bank-account-name">
                    БИЗНЕС-СЧЁТ · {companyName.toUpperCase()}
                  </small>
                  <h2>{money(balance)}</h2>
                  <span>ДОСТУПНО НА СЧЁТЕ</span>
                  <div className="bank-card-bottom">
                    <b>{playerName || "Владелец компании"}</b>
                    <em>•••• 4821</em>
                  </div>
                </article>
                <article className="bank-metrics">
                  <div className="cash">
                    <small>СВОБОДНЫЕ СРЕДСТВА</small>
                    <b>{money(balance)}</b>
                    <span>Доступно для новых сделок</span>
                  </div>
                  <div className="assets">
                    <small>ВЛОЖЕНО В АВТО</small>
                    <b>{owned && !sold ? money(totalInvested) : "$0"}</b>
                    <span>Активы компании в работе</span>
                  </div>
                  <div className="debt-metric">
                    <small>КРЕДИТНЫЙ ДОЛГ</small>
                    <b className={loanBalance ? "debt" : ""}>
                      {money(loanBalance)}
                    </b>
                    <span>{loanBalance ? "Требует погашения" : "Обязательств нет"}</span>
                  </div>
                  <div className="deals">
                    <small>ЗАВЕРШЕНО СДЕЛОК</small>
                    <b>{completedDeals}</b>
                    <span>Кредитный рейтинг A−</span>
                  </div>
                </article>
              </div>
              <div className="bank-columns">
                <article className="credit-panel">
                  <header>
                    <div>
                      <small>ФИНАНСИРОВАНИЕ БИЗНЕСА</small>
                      <h3>
                        {loanBalance ? "Активный кредит" : "Кредитная линия"}
                      </h3>
                    </div>
                    <span className="credit-score">
                      A− <small>РЕЙТИНГ</small>
                    </span>
                  </header>
                  {loanBalance ? (
                    <>
                      <div className="loan-total">
                        <small>ОСТАЛОСЬ ПОГАСИТЬ</small>
                        <strong>{money(loanBalance)}</strong>
                        <span>
                          из{" "}
                          {money(
                            Math.round(loanPrincipal * (1 + loanRate / 100)),
                          )}
                        </span>
                      </div>
                      <div className="loan-progress">
                        <i
                          style={{
                            width: `${Math.min(100, (paymentsMade / Math.max(1, loanTerm)) * 100)}%`,
                          }}
                        />
                      </div>
                      <dl className="loan-details">
                        <div>
                          <dt>Ставка</dt>
                          <dd>{loanRate}% за срок</dd>
                        </div>
                        <div>
                          <dt>Платёж</dt>
                          <dd>{money(loanPayment)} / 7 дней</dd>
                        </div>
                        <div>
                          <dt>Следующее списание</dt>
                          <dd>через {7 - (day % 7)} дн.</dd>
                        </div>
                      </dl>
                      <button className="repay" onClick={repayLoan}>
                        Погасить досрочно ·{" "}
                        {money(Math.min(balance, loanBalance))}
                      </button>
                    </>
                  ) : (
                    <>
                      <p>Если денег не хватает на текущую сделку, можно один раз взять кредит. Платёж списывается каждые 7 игровых дней.</p>
                      <div className="loan-offers">
                        <button onClick={() => requestLoan(5000, 5, 12)}>
                          <span>
                            <b>Взять $5 000</b>
                            <small>5 платежей · переплата 12%</small>
                          </span>
                          <em>$1 120 / 7 дней</em>
                        </button>
                      </div>
                    </>
                  )}
                  {pendingLoan && !loanBalance && (
                    <div className="loan-confirm">
                      <small>ПОДТВЕРЖДЕНИЕ КРЕДИТА</small>
                      <h3>Договор на {money(pendingLoan.amount)}</h3>
                      <p>
                        Ставка {pendingLoan.rate}% · {pendingLoan.term} платежей
                        · общий долг{" "}
                        {money(
                          Math.round(
                            pendingLoan.amount * (1 + pendingLoan.rate / 100),
                          ),
                        )}
                      </p>
                      <b>
                        Платёж раз в 7 дней:{" "}
                        {money(
                          Math.ceil(
                            Math.round(
                              pendingLoan.amount * (1 + pendingLoan.rate / 100),
                            ) / pendingLoan.term,
                          ),
                        )}
                      </b>
                      <span>
                        При недостатке средств начисляется штраф 3% от остатка
                        долга.
                      </span>
                      <div>
                        <button onClick={() => setPendingLoan(null)}>
                          Отмена
                        </button>
                        <button
                          className="primary"
                          onClick={() => {
                            takeLoan(
                              pendingLoan.amount,
                              pendingLoan.term,
                              pendingLoan.rate,
                            );
                            setPendingLoan(null);
                          }}
                        >
                          Подтвердить кредит
                        </button>
                      </div>
                    </div>
                  )}
                </article>
                <article className="transactions">
                  <header>
                    <h3>Последние операции</h3>
                    <button>Все операции</button>
                  </header>
                  <div>
                    <i className="out">OPS</i>
                    <span>
                      <b>Содержание бизнеса</b>
                      <small>
                        Офис, базы, связь{vehicleStorage ? ", хранение" : ""}
                      </small>
                    </span>
                    <em>− {money(dailyOverhead)} / день</em>
                  </div>
                  <div>
                    <i className="out">VIN</i>
                    <span>
                      <b>Проверки и документы</b>
                      <small>National Vehicle Records</small>
                    </span>
                    <em>− {money(vinReports.length * VIN_REPORT_PRICE)}</em>
                  </div>
                  {owned && (
                    <div>
                      <i className="out">AU</i>
                      <span>
                        <b>Покупка автомобиля</b>
                        <small>
                          {activeVehicle.title} · LOT #
                          {43820 + activeVehicle.id}
                        </small>
                      </span>
                      <em>− {money(purchasePrice)}</em>
                    </div>
                  )}
                  {loanPrincipal > 0 && (
                    <div>
                      <i className="in">CR</i>
                      <span>
                        <b>Кредит зачислен</b>
                        <small>Финансирование бизнеса</small>
                      </span>
                      <em className="positive">+ {money(loanPrincipal)}</em>
                    </div>
                  )}
                  {sold && (
                    <div>
                      <i className="in">SL</i>
                      <span>
                        <b>Продажа автомобиля</b>
                        <small>Сделка завершена</small>
                      </span>
                      <em className="positive">+ {money(projectedSale)}</em>
                    </div>
                  )}
                </article>
              </div>
              <div className="emergency-funding">
                  <div className="funding-icon">▶</div>
                  <div>
                    <small>БОНУС ОТ ПАРТНЁРА</small>
                    <h3>Получите деньги на развитие</h3>
                    <p>
                      Посмотрите короткую рекламу и получите <b>{money(rewardAdAmount)}</b> на
                      аукцион, доставку или запчасти. Возвращать не нужно.
                    </p>
                    <span>Доступно всегда · каждый просмотр даёт награду</span>
                  </div>
                  <button onClick={() => openRewardAd("money")} disabled={!rewardAdAvailable}>
                    {rewardAdStatus === "loading"
                      ? "Загрузка…"
                      : rewardAdStatus === "showing"
                        ? "Реклама идёт…"
                        : `Смотреть рекламу · +${money(rewardAdAmount)}`}
                  </button>
                </div>
            </section>
          )}
        </section>
      </div>
      {incomingLead && (
        <aside
          className={`incoming-message ${incomingLeadClosing ? "closing" : ""}`}
          role="status"
          aria-live="polite"
        >
          <div className="incoming-message-icon">
            <MessageCircle aria-hidden="true" />
          </div>
          <div className="incoming-message-copy">
            <small>НОВОЕ СООБЩЕНИЕ</small>
            <b>{incomingLead.name}</b>
            <p>
              Ищу {incomingLead.car}. Бюджет до {money(incomingLead.budget)}.
              {" "}{incomingLead.requirement}
            </p>
            <button
              onClick={() => {
                openLead(incomingLead.id);
                setScreen("messages");
                dismissIncomingLead();
              }}
            >
              Открыть диалог →
            </button>
          </div>
          <button
            className="incoming-message-close"
            onClick={dismissIncomingLead}
            aria-label="Закрыть уведомление"
          >
            ×
          </button>
          <i className="incoming-message-timer" />
        </aside>
      )}
      {toastVisible && (
        <div className="toast" key={toast}>
          <i /> {toast}
        </div>
      )}
      {achievementToast && (
        <aside className="achievement-unlocked" role="status" aria-live="polite">
          <span><AchievementToastIcon aria-hidden="true" /></span>
          <div>
            <small>ДОСТИЖЕНИЕ ОТКРЫТО</small>
            <b>{achievementToast.title}</b>
            <p>{achievementToast.description}</p>
          </div>
          <strong>+{money(achievementToast.reward)}</strong>
          <button onClick={() => setAchievementToastId(null)} aria-label="Закрыть уведомление">
            <X aria-hidden="true" />
          </button>
        </aside>
      )}
      {vinModalOpen && selectedReport !== null && (
        <div className="vin-quick-overlay">
          <section className="vin-quick-dialog" role="dialog" aria-modal="true" aria-label="VIN-отчёт">
            <header>
              <div>
                <small>РЕЗУЛЬТАТ ПРОВЕРКИ</small>
                <b>{lots.find((lot) => lot.id === selectedReport)?.title}</b>
              </div>
              <button onClick={() => setVinModalOpen(false)} aria-label="Закрыть VIN-отчёт">×</button>
            </header>
            <VinDocument
              lot={lots.find((lot) => lot.id === selectedReport)!}
              playerName={playerName}
            />
          </section>
        </div>
      )}
      {gameEvent && (
        <div className="reward-overlay">
          <section className={`event-card ${gameEvent.tone}`}>
            <span className="event-icon">
              {gameEvent.tone === "good"
                ? "★"
                : gameEvent.tone === "bad"
                  ? "!"
                  : "↗"}
            </span>
            <small>СОБЫТИЕ НОВОГО ДНЯ</small>
            <h2>{gameEvent.title}</h2>
            <p>{gameEvent.text}</p>
            <b>{gameEvent.effect}</b>
            <button onClick={() => setGameEvent(null)}>
              Продолжить работу →
            </button>
          </section>
        </div>
      )}
      {achievementsOpen && (
        <div className="reward-overlay" onClick={() => setAchievementsOpen(false)}>
          <section
            className="achievements-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="Достижения"
            onClick={(event) => event.stopPropagation()}
          >
            <header>
              <div className="achievements-title-icon"><Trophy aria-hidden="true" /></div>
              <div>
                <small>КАРЬЕРА ДИЛЕРА</small>
                <h2>Достижения</h2>
                <p>Открыто {unlockedAchievementIds.length} из {gameAchievements.length}</p>
              </div>
              <button onClick={() => setAchievementsOpen(false)} aria-label="Закрыть достижения">
                <X aria-hidden="true" />
              </button>
            </header>
            <div className="achievement-summary">
              <span>
                <small>ПРОГРЕСС</small>
                <b>{Math.round((unlockedAchievementIds.length / gameAchievements.length) * 100)}%</b>
              </span>
              <div><i style={{ width: `${(unlockedAchievementIds.length / gameAchievements.length) * 100}%` }} /></div>
              <em>Награды начисляются автоматически</em>
            </div>
            <div className="achievements-grid">
              {gameAchievements.map((achievement) => {
                const unlocked = unlockedAchievementIds.includes(achievement.id);
                const progress = achievementProgress(achievement);
                const AchievementIcon = achievement.Icon;
                return (
                  <article key={achievement.id} className={unlocked ? "unlocked" : "locked"}>
                    <span><AchievementIcon aria-hidden="true" /></span>
                    <div>
                      <small>{unlocked ? "ПОЛУЧЕНО" : `${progress}/${achievement.target}`}</small>
                      <h3>{achievement.title}</h3>
                      <p>{achievement.description}</p>
                      <div className="achievement-progress"><i style={{ width: `${(progress / achievement.target) * 100}%` }} /></div>
                    </div>
                    <b>+{money(achievement.reward)}</b>
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      )}
      {rouletteOpen && (
        <div className="reward-overlay">
          <section className="hourly-roulette" role="dialog" aria-modal="true">
            <button
              className="roulette-close"
              onClick={() => setRouletteOpen(false)}
              disabled={rouletteSpinning}
              aria-label="Закрыть рулетку"
            >
              <X aria-hidden="true" />
            </button>
            <small>БОНУС КАЖДЫЙ ЧАС</small>
            <h2>Рулетка дилера</h2>
            <p>Испытайте удачу — все призы сразу попадают на счёт компании.</p>
            <div className="roulette-stage">
              <i className="roulette-pointer" />
              <div
                className={`roulette-wheel ${rouletteSpinning ? "spinning" : ""}`}
                style={{ transform: `rotate(${rouletteRotation}deg)` }}
              >
                {roulettePrizes.map((prize, index) => (
                  <span
                    key={prize.shortLabel}
                    style={{ transform: `rotate(${index * 60 + 30}deg) translateY(-112px) rotate(-${index * 60 + 30}deg)` }}
                  >
                    {prize.shortLabel}
                  </span>
                ))}
              </div>
              <div className="roulette-hub"><Gift aria-hidden="true" /></div>
            </div>
            {rouletteResult !== null ? (
              <div className="roulette-result">
                <small>ВАШ ПРИЗ</small>
                <b>{roulettePrizes[rouletteResult].label}</b>
              </div>
            ) : (
              <div className="roulette-wait">
                {rouletteReady ? "Бесплатная попытка готова" : `Следующая попытка через ${rouletteTimer}`}
              </div>
            )}
            <button
              className="roulette-spin"
              onClick={spinHourlyRoulette}
              disabled={!rouletteReady}
            >
              {rouletteSpinning
                ? "Крутим…"
                : rouletteReady
                  ? "Крутить бесплатно"
                  : `Вернуться через ${rouletteTimer}`}
            </button>
          </section>
        </div>
      )}
      {rewardAdOpen && (
        <div className="reward-overlay">
          <section className="rewarded-ad">
            <header>
              <span>РЕКЛАМА</span>
              <b>ПАРТНЁР ИГРЫ</b>
            </header>
            <div className="ad-placeholder">
              <i>AI</i>
              <small>ЛОКАЛЬНЫЙ ТЕСТ</small>
              <h2>
                {rewardAdMode === "delivery"
                  ? "Ускорение доставки"
                  : rewardAdMode === "repair"
                    ? "Ускорение ремонта"
                    : "Денежный бонус"}
              </h2>
              <p>
                На Яндекс Играх это окно заменит настоящая награждаемая реклама.
              </p>
            </div>
            <footer>
              <span>
                {rewardAdSeconds > 0
                  ? `Награда через ${rewardAdSeconds} сек.`
                  : "Реклама просмотрена полностью"}
              </span>
              <button disabled={rewardAdSeconds > 0} onClick={claimRewardAd}>
                {rewardAdSeconds > 0
                  ? `Подождите ${rewardAdSeconds}`
                    : rewardAdMode === "delivery"
                    ? "Ускорить доставку на 30 минут"
                    : rewardAdMode === "repair"
                      ? "Сократить ремонт на 30 минут"
                    : `Получить +${money(rewardAdAmount)}`}
              </button>
            </footer>
          </section>
        </div>
      )}
      {dealResult && (
        <div className="reward-overlay">
          <section className="deal-result">
            <div className="result-burst">✓</div>
            <small>СДЕЛКА ЗАКРЫТА</small>
            <h1>
              {dealResult.profit >= 0 ? "Отличная работа!" : "Убыточная сделка"}
            </h1>
            <p>
              {dealResult.vehicleTitle
                ? `${dealResult.vehicleYear} ${dealResult.vehicleTitle}`
                : dealResult.buyer === alexContract.name
                  ? alexContract.car
                  : clientLeads.find((lead) => lead.name === dealResult.buyer)
                      ?.car || `${activeVehicle.year} ${activeVehicle.title}`} купил{" "}
              {dealResult.buyer}
            </p>
            <div className="result-money">
              <span>
                <small>ПРОДАЖА</small>
                <b>{money(dealResult.price)}</b>
              </span>
              <span>
                <small>ВЛОЖЕНО</small>
                <b>{money(dealResult.invested ?? dealResult.price - dealResult.profit)}</b>
              </span>
              <span className={dealResult.profit >= 0 ? "profit" : "loss"}>
                <small>РЕЗУЛЬТАТ</small>
                <b>
                  {dealResult.profit >= 0 ? "+" : ""}
                  {money(dealResult.profit)}
                </b>
              </span>
            </div>
            <div className="result-rewards">
              <span>
                <b>+{dealResult.xp} XP</b>
                <small>Опыт компании</small>
              </span>
              <span>
                <b>
                  {dealResult.reputation >= 0 ? "+" : ""}
                  {dealResult.reputation} ★
                </b>
                <small>Репутация</small>
              </span>
              <span>
                <b>{dealResult.quality}%</b>
                <small>Качество ремонта</small>
              </span>
            </div>
            <button
              onClick={() => {
                setDealResult(null);
                setScreen("desktop");
              }}
            >
              Получить награды и продолжить →
            </button>
          </section>
        </div>
      )}
      {profileReady &&
        tutorialStatus === "active" &&
        !rewardAdOpen &&
        !rouletteOpen &&
        !achievementsOpen &&
        !dealResult &&
        !gameEvent &&
        !vinModalOpen &&
        (tutorialOpen ? (
          <aside className="alex-tutorial" aria-live="polite">
            <header>
              <span className="alex-tutorial-avatar">
                <img src="mechanic-mascot-crop.png" alt="" />
              </span>
              <div>
                <small>АЛЕКС · НАСТАВНИК</small>
                <b>{tutorialStep.eyebrow}</b>
              </div>
              <button
                className="alex-tutorial-close"
                onClick={() => setTutorialOpen(false)}
                aria-label="Свернуть подсказку Алекса"
                title="Свернуть"
              >
                <X aria-hidden="true" />
              </button>
            </header>
            <div className="alex-tutorial-body">
              <h2>{tutorialStep.title}</h2>
              <p className="alex-typed-text">
                {tutorialTypedText}
                {tutorialTypedText.length < tutorialStep.text.length && (
                  <i aria-hidden="true" />
                )}
              </p>
            </div>
            <div className="alex-tutorial-progress" aria-label="Прогресс обучения">
              {tutorialStageOrder.map((stage, index) => (
                <i
                  key={stage}
                  className={
                    index < tutorialStepNumber
                      ? index === tutorialStepNumber - 1
                        ? "current"
                        : "done"
                      : ""
                  }
                />
              ))}
            </div>
            <footer>
              <button className="alex-tutorial-skip" onClick={skipTutorial}>
                Пропустить обучение
              </button>
              <button className="alex-tutorial-action" onClick={handleTutorialAction}>
                {tutorialStep.action} <ChevronRight aria-hidden="true" />
              </button>
            </footer>
          </aside>
        ) : (
          <button
            className="alex-tutorial-mini"
            onClick={() => setTutorialOpen(true)}
            aria-label="Открыть подсказку Алекса"
          >
            <img src="mechanic-mascot-crop.png" alt="" />
            <span>
              <small>НУЖНА ПОМОЩЬ?</small>
              <b>Спросить Алекса</b>
            </span>
            <MessageCircle aria-hidden="true" />
          </button>
        ))}
      {!profileReady && (
        <div className="onboarding">
          <div className="onboarding-backdrop" aria-hidden="true">
            <img
              className="onboarding-car"
              src="cars/bmw-330i.jpg"
              alt=""
            />
            <span className="floating-part float-car-one"><CarFront /></span>
            <span className="floating-part float-wrench"><Wrench /></span>
            <span className="floating-part float-gear"><Cog /></span>
            <span className="floating-part float-gavel"><Gavel /></span>
            <span className="floating-part float-wheel"><CircleGauge /></span>
            <span className="floating-part float-car-two"><CarFront /></span>
          </div>

          <button
            type="button"
            className="onboarding-language-toggle"
            onClick={() => {
              window.localStorage.setItem("cardealer-language-manual", "true");
              setLanguage((value) => (value === "ru" ? "en" : "ru"));
            }}
            aria-label={language === "ru" ? "Switch to English" : "Переключиться на русский"}
            title={language === "ru" ? "Switch to English" : "Переключиться на русский"}
          >
            <span className={language === "ru" ? "active" : ""}>RU</span>
            <i aria-hidden="true" />
            <span className={language === "en" ? "active" : ""}>EN</span>
          </button>

          <section className="onboarding-stage">
            <div className="onboarding-copy">
              <div className="onboarding-logo">
                <span><CarFront aria-hidden="true" /></span>
                <b>CarDealer <i>game</i></b>
              </div>
              <small className="onboarding-kicker">ТВОЙ ПЕРВЫЙ АВТОБИЗНЕС</small>
              <h1>
                ИЗ ГАРАЖА — <span>В АВТОСАЛОН</span>
              </h1>
              <p className="onboarding-lead">
                Покупай автомобили на аукционах, восстанавливай их и продавай
                дороже. Начни с одного гаража и построй компанию мечты.
              </p>

              <form
                className="onboarding-card"
                onSubmit={(e) => {
                  e.preventDefault();
                  saveProfile();
                }}
              >
                <header>
                  <span>СОЗДАНИЕ КОМПАНИИ</span>
                  <b>ПРОФИЛЬ ДИЛЕРА</b>
                </header>
                <div className="onboarding-progress"><i /></div>
                <div className="onboarding-fields">
                  <label>
                    ТВОЁ ИМЯ
                    <input
                      autoFocus
                      value={nameDraft}
                      onChange={(e) => setNameDraft(e.target.value)}
                      placeholder="Как тебя называть?"
                      maxLength={36}
                    />
                  </label>
                  <label>
                    НАЗВАНИЕ КОМПАНИИ
                    <input
                      value={companyDraft}
                      onChange={(e) => setCompanyDraft(e.target.value)}
                      placeholder="Например, North Star Auto"
                      maxLength={32}
                    />
                  </label>
                </div>
                <button
                  disabled={
                    nameDraft.trim().length < 2 || companyDraft.trim().length < 2
                  }
                >
                  ОТКРЫТЬ ГАРАЖ <ChevronRight aria-hidden="true" />
                </button>
                <em>Дальше Алекс проведёт тебя через первую сделку</em>
              </form>
            </div>

            <aside className="onboarding-alex">
              <div className="alex-speech">
                <small>АЛЕКС · ТВОЙ НАПАРНИК</small>
                <b>Привет! Как мне тебя называть, босс?</b>
                <span>Давай превратим этот гараж в настоящий автосалон.</span>
              </div>
              <img src="mechanic-mascot.png" alt="Алекс, механик-наставник" />
            </aside>
          </section>
        </div>
      )}
    </main>
  );
}

function EmptyGuard({
  when,
  children,
  text,
  description,
  action,
  label,
}: {
  when: boolean;
  children: React.ReactNode;
  text: string;
  description?: string;
  action: () => void;
  label: string;
}) {
  if (when) return children;
  return (
    <div className="empty">
      <div className="empty-ambient-parts" aria-hidden="true">
        <CarFront />
        <Wrench />
        <Cog />
        <Hammer />
        <CircleGauge />
      </div>
      <span>◇</span>
      <h2>{text}</h2>
      <p>
        {description ||
          "Продолжите первый контракт, чтобы открыть этот раздел."}
      </p>
      <button className="primary" onClick={action}>
        {label} →
      </button>
    </div>
  );
}

function VinDocument({
  lot,
  playerName,
}: {
  lot: (typeof lots)[number];
  playerName: string;
}) {
  const severe = lot.risk === "Высокий";
  const riskClass =
    lot.risk === "Низкий" ? "low" : lot.risk === "Средний" ? "medium" : "high";
  const riskScore =
    lot.risk === "Низкий" ? 24 : lot.risk === "Средний" ? 57 : 86;
  return (
    <div className="vin-paper">
      <div className="paper-actions">
        <span>VIN HISTORY REPORT</span>
        <button onClick={() => window.print()}>Печать</button>
      </div>
      <article>
        <header>
          <div className="report-logo">
            <b>NVR</b>
            <span>
              NATIONAL
              <br />
              VEHICLE RECORDS
            </span>
          </div>
          <div>
            <small>REPORT NUMBER</small>
            <b>VR-{43820 + lot.id}-US</b>
            <small>ISSUED: AUG {13 + lot.unlockDay}, 2026</small>
          </div>
        </header>
        <div className="report-title">
          <small>VEHICLE HISTORY & TITLE VERIFICATION</small>
          <h1>
            {lot.year} {lot.title}
          </h1>
          <p>
            VIN: 4T1B11HK{lot.year}U{43820 + lot.id}
          </p>
        </div>
        <div className={`risk-panel ${riskClass}`}>
          <div className="risk-score">
            <span>{riskScore}</span>
            <small>ИЗ 100</small>
          </div>
          <div>
            <small>ИТОГОВАЯ ОЦЕНКА РИСКА</small>
            <h2>{lot.risk.toUpperCase()} РИСК</h2>
            <p>
              {lot.risk === "Низкий"
                ? "История прозрачная. Вероятность крупных скрытых расходов невысока."
                : lot.risk === "Средний"
                  ? "Есть существенные факторы риска. Нужны диагностика и запас бюджета."
                  : "Покупка опасна. Возможны крупные скрытые повреждения и серьёзный убыток."}
            </p>
            <div className="risk-scale">
              <i style={{ width: `${riskScore}%` }} />
            </div>
            <div className="risk-labels">
              <span>НИЗКИЙ</span>
              <span>СРЕДНИЙ</span>
              <span>ВЫСОКИЙ</span>
            </div>
          </div>
        </div>
        <section className="report-summary">
          <div>
            <small>ТЕКУЩИЙ ПРОБЕГ</small>
            <b>{lot.mileage}</b>
          </div>
          <div>
            <small>СТАТУС TITLE</small>
            <b className={lot.docs === "Flood" ? "bad" : "warn"}>{lot.docs}</b>
          </div>
          <div>
            <small>УРОВЕНЬ РИСКА</small>
            <b className={severe ? "bad" : "warn"}>{lot.risk}</b>
          </div>
        </section>
        <h2>История автомобиля</h2>
        <table>
          <tbody>
            <tr>
              <td>03/2019</td>
              <td>Первичная регистрация</td>
              <td>New Jersey, USA</td>
              <td className="ok">Подтверждено</td>
            </tr>
            <tr>
              <td>08/2022</td>
              <td>Техническое обслуживание</td>
              <td>Authorized Service</td>
              <td className="ok">Пробег проверен</td>
            </tr>
            <tr>
              <td>07/2026</td>
              <td>Страховой случай</td>
              <td>{lot.damage}</td>
              <td className="flag">Заявлен ущерб</td>
            </tr>
            <tr>
              <td>08/2026</td>
              <td>Выставлен на аукцион</td>
              <td>New Jersey, USA</td>
              <td>{lot.docs}</td>
            </tr>
          </tbody>
        </table>
        <h2>Результат проверки</h2>
        <div className={`report-verdict ${severe ? "danger" : ""}`}>
          <b>
            {severe ? "ТРЕБУЕТСЯ УГЛУБЛЁННАЯ ПРОВЕРКА" : "ИСТОРИЯ ПОДТВЕРЖДЕНА"}
          </b>
          <p>
            {lot.docs === "Flood"
              ? "Обнаружена запись о затоплении. Возможны скрытые повреждения электроники и коррозия."
              : `Зафиксировано повреждение: ${lot.damage}. Записей о скручивании пробега не обнаружено.`}
          </p>
        </div>
        <footer>
          <div>
            <small>ОТЧЁТ ЗАКАЗАН</small>
            <b>{playerName}</b>
            <span>Лицензированный автоимпортёр</span>
          </div>
          <div className="stamp">
            <b>VERIFIED</b>
            <span>
              NVR · USA
              <br />
              DIGITAL SEAL
            </span>
          </div>
          <div className="signature">
            A. Richardson<small>AUTHORIZED INSPECTOR</small>
          </div>
        </footer>
        <p className="report-note">
          Электронный документ сформирован на основании данных страховых
          компаний, регистрационных органов и аукционных площадок США.
          Используется в игровых целях.
        </p>
      </article>
    </div>
  );
}

function LiveAuction({
  lot,
  balance,
  participationFee,
  regularParticipationFee,
  tutorialFree,
  soundEnabled,
  onBack,
  onRegister,
  onAbandon,
  onLose,
  onWin,
}: {
  lot: (typeof lots)[number];
  balance: number;
  participationFee: number;
  regularParticipationFee: number;
  tutorialFree: boolean;
  soundEnabled: boolean;
  onBack: () => void;
  onRegister: () => boolean;
  onAbandon: () => void;
  onLose: () => void;
  onWin: (bid: number) => void;
}) {
  const [currentBid, setCurrentBid] = useState(lot.bid);
  const [leader, setLeader] = useState<"bot" | "player">("bot");
  const [time, setTime] = useState(24);
  const [registered, setRegistered] = useState(false);
  const [startsIn, setStartsIn] = useState(5);
  const [thinking, setThinking] = useState(false);
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState<"won" | "lost" | null>(null);
  const timeRef = useRef(time);
  const [history, setHistory] = useState([
    { who: "BidMaster_21", amount: lot.bid },
  ]);
  const increment = currentBid < 5000 ? 100 : currentBid < 10000 ? 250 : 500;
  const nextBid = currentBid + increment;
  const botLimit =
    lot.bid +
    (lot.risk === "Низкий" ? 1400 : lot.risk === "Средний" ? 1100 : 750);
  const recommendedLimit =
    lot.bid +
    (lot.risk === "Низкий" ? 2100 : lot.risk === "Средний" ? 1700 : 1200);
  const fees = participationFee + shippingPlans.standard.price + 1050;

  useEffect(() => {
    timeRef.current = time;
  }, [time]);

  useEffect(() => {
    if (finished || !registered || startsIn > 0) return;
    const tick = window.setInterval(
      () => setTime((t) => Math.max(0, t - 1)),
      1000,
    );
    return () => window.clearInterval(tick);
  }, [finished, registered, startsIn]);

  useEffect(() => {
    if (!registered || startsIn <= 0) return;
    const tick = window.setInterval(
      () => setStartsIn((v) => Math.max(0, v - 1)),
      1000,
    );
    return () => window.clearInterval(tick);
  }, [registered, startsIn]);

  useEffect(() => {
    if (time !== 0 || finished) return;
    setFinished(true);
    if (leader === "player") {
      setResult("won");
      playGameSound("auctionWin", soundEnabled);
    } else {
      setResult("lost");
      playGameSound("error", soundEnabled);
      onLose();
    }
  }, [time, finished, leader, currentBid, onWin, onLose, soundEnabled]);

  useEffect(() => {
    if (!registered || startsIn > 0 || finished || time > 3) return;
    playGameSound("tick", soundEnabled);
  }, [time, registered, startsIn, finished, soundEnabled]);

  function placeBid() {
    if (
      !registered ||
      startsIn > 0 ||
      finished ||
      thinking ||
      time <= 2 ||
      (!tutorialFree && nextBid > balance)
    )
      return;
    const playerBid = nextBid;
    setCurrentBid(playerBid);
    playGameSound("money", soundEnabled);
    setLeader("player");
    setHistory((h) => [{ who: "ВЫ", amount: playerBid }, ...h].slice(0, 5));
    if (time < 8) setTime(8);
    if (playerBid < botLimit) {
      setThinking(true);
      const responseDelay = 900 + Math.round(Math.random() * 2800);
      window.setTimeout(() => {
        if (timeRef.current <= 2) {
          setThinking(false);
          return;
        }
        const botBid = playerBid + (playerBid < 10000 ? 250 : 500);
        setCurrentBid(botBid);
        setLeader("bot");
        setHistory((h) =>
          [
            { who: lot.id === 2 ? "AutoKing" : "BidMaster_21", amount: botBid },
            ...h,
          ].slice(0, 5),
        );
        setThinking(false);
        setTime((t) => Math.max(t, 7));
      }, responseDelay);
    }
  }

  return (
    <section className="live-auction">
      <div className="auction-stage">
        <div className="live-head">
          <button onClick={registered ? onAbandon : onBack}>
            ← {registered ? "Покинуть торги и потерять лот" : "Назад к лотам"}
          </button>
          <span>
            <i /> LIVE · ЗАЛ B3
          </span>
        </div>
        <div className="auction-car">
          <img src={lot.image} alt={`${lot.year} ${lot.title}`} />
          <div className="auction-lot">
            LOT #{43820 + lot.id}
            <small>
              {lot.docs} · {lot.mileage}
            </small>
          </div>
        </div>
        <div className="vehicle-strip">
          <span>
            <small>АВТОМОБИЛЬ</small>
            {lot.year} {lot.title}
          </span>
          <span>
            <small>ПОВРЕЖДЕНИЕ</small>
            {lot.damage}
          </span>
          <span>
            <small>ЛОКАЦИЯ</small>New Jersey, NJ
          </span>
        </div>
      </div>
      <aside
        className={`bid-console ${
          !registered
            ? "is-registration"
            : startsIn > 0
              ? "is-countdown"
              : "is-live"
        }`}
      >
        {!registered && (
          <div className="auction-registration">
            <span><Gavel aria-hidden="true" /></span>
            <small>РЕГИСТРАЦИЯ НА ТОРГИ</small>
            <h2>Вход в аукционный зал</h2>
            <p>
              Участие в торгах по этому лоту стоит{" "}
              <b>
                {tutorialFree ? (
                  <span className="tutorial-free-price">
                    <del>{money(regularParticipationFee)}</del>
                    <em>БЕСПЛАТНО</em>
                  </span>
                ) : (
                  money(participationFee)
                )}
              </b>. После
              регистрации выход из зала закроет лот — вернуться к нему будет
              нельзя.
            </p>
            <div>
              <small>ЛОТ</small>
              <b>#{43820 + lot.id}</b>
              <small>БАЛАНС ПОСЛЕ ВХОДА</small>
              <b>{money(balance - participationFee)}</b>
            </div>
            <button
              disabled={balance < participationFee}
              onClick={() => {
                if (onRegister()) setRegistered(true);
              }}
            >
              {balance < participationFee
                ? "Недостаточно денег"
                : tutorialFree
                  ? "Зарегистрироваться бесплатно"
                  : `Оплатить ${money(participationFee)} и зарегистрироваться`}
            </button>
            <em>Сбор не возвращается при проигрыше или выходе</em>
          </div>
        )}
        {registered && startsIn > 0 && (
          <div className="auction-countdown">
            <small>
              ВЫ ЗАРЕГИСТРИРОВАНЫ · СБОР{" "}
              {tutorialFree ? "БЕСПЛАТНО" : `${money(participationFee)} ОПЛАЧЕН`}
            </small>
            <span>{startsIn}</span>
            <h2>Торги начнутся через</h2>
            <p>Приготовьтесь. Начальная ставка {money(lot.bid)}.</p>
            <button onClick={onAbandon}>Отказаться и потерять лот</button>
          </div>
        )}
        <div className="console-top">
          <span>{startsIn > 0 ? "ОЖИДАНИЕ СТАРТА" : "ЖИВЫЕ ТОРГИ"}</span>
          <b className={time <= 7 ? "urgent" : ""}>
            00:{String(time).padStart(2, "0")}
          </b>
        </div>
        <div
          className={`bid-ring ${leader === "player" ? "leading" : ""}`}
          style={
            {
              "--auction-progress": `${((startsIn > 0 ? startsIn : time) / (startsIn > 0 ? 5 : 24)) * 360}deg`,
            } as React.CSSProperties
          }
        >
          <div>
            <small>
              {startsIn > 0
                ? `СТАРТ ЧЕРЕЗ ${startsIn}`
                : leader === "player"
                  ? "ВАША СТАВКА ЛИДИРУЕТ"
                  : thinking
                    ? "УЧАСТНИК ДУМАЕТ…"
                    : "ТЕКУЩАЯ СТАВКА"}
            </small>
            <strong>{money(currentBid)}</strong>
            <span>
              {leader === "player" ? "Вы — лидер" : "Ставка другого участника"}
            </span>
          </div>
        </div>
        <div className="bid-estimate">
          <span>
            Следующая ставка <b>{money(nextBid)}</b>
          </span>
          <span>
            Итого с расходами <b>{money(nextBid + fees)}</b>
          </span>
          <span>
            Ваш умный лимит{" "}
            <b className={nextBid > recommendedLimit ? "danger" : "safe"}>
              {money(recommendedLimit)}
            </b>
          </span>
        </div>
        {nextBid > recommendedLimit && (
          <div className="limit-warning">
            ⚠ Ставка выше расчётного лимита. Прогнозируемая прибыль становится
            слишком низкой.
          </div>
        )}
        <button
          className="place-bid"
          onClick={placeBid}
          disabled={
            !registered ||
            startsIn > 0 ||
            finished ||
            thinking ||
            time <= 2 ||
            (!tutorialFree && nextBid > balance)
          }
        >
          {time <= 2
            ? "Ставки закрыты"
            : thinking
              ? "Ждём ответ…"
              : `Перебить · ${money(nextBid)}`}
        </button>
        <p className="bid-hint">
          Ставка окончательная. Если вы лидер в момент окончания таймера —
          автомобиль ваш.
        </p>
        <div className="bid-history">
          <h3>
            Последние ставки <span>{history.length} участников</span>
          </h3>
          {history.map((item, i) => (
            <div key={`${item.who}-${item.amount}-${i}`}>
              <i className={item.who === "ВЫ" ? "you" : ""} />
              <span>{item.who}</span>
              <b>{money(item.amount)}</b>
            </div>
          ))}
        </div>
        {result && (
          <div className={`auction-result ${result}`} role="status">
            {result === "won" ? (
              <>
                <div className="auction-win-icon">
                  <Trophy aria-hidden="true" />
                </div>
                <small>ПОБЕДА В АУКЦИОНЕ</small>
                <strong>Лот выигран!</strong>
                <p>
                  Поздравляем — ваша ставка оказалась последней. Автомобиль
                  закреплён за вашей компанией.
                </p>
                <div className="auction-win-summary">
                  <span>
                    <small>ПОБЕДНАЯ СТАВКА</small>
                    <b>{money(currentBid)}</b>
                  </span>
                  <span>
                    <small>ЛОТ</small>
                    <b>#{43820 + lot.id}</b>
                  </span>
                </div>
                <button onClick={() => onWin(currentBid)}>
                  Оформить покупку →
                </button>
                <em>После оформления автомобиль появится в разделе «Мои авто»</em>
              </>
            ) : (
              <>
                <strong>ТОРГИ ЗАВЕРШЕНЫ</strong>
                <span>Вы не были лидером</span>
                <button onClick={onBack}>Вернуться к лотам</button>
              </>
            )}
          </div>
        )}
      </aside>
    </section>
  );
}
