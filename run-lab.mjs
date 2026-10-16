// run-lab.mjs: automates Lab 4 (variant 24) steps 1.4 - 3.12.
// Usage:  node run-lab.mjs [папка_проєкту] [ім'я_репозиторію]
// Requires: Node.js 20.19+, npm, Git (in PATH), Internet (npm install).
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const FILES = {"init/.gitignore": "node_modules/\n", "init/.prettierrc.json": "{\n  \"printWidth\": 90,\n  \"tabWidth\": 2,\n  \"useTabs\": false,\n  \"semi\": true,\n  \"singleQuote\": false,\n  \"quoteProps\": \"consistent\",\n  \"trailingComma\": \"all\",\n  \"bracketSpacing\": true,\n  \"arrowParens\": \"always\",\n  \"objectWrap\": \"collapse\",\n  \"experimentalOperatorPosition\": \"start\",\n  \"endOfLine\": \"lf\"\n}\n", "init/.prettierignore": "node_modules\npackage-lock.json\nlegacy\nreports\n", "init/eslint.config.js": "import js from '@eslint/js';\nimport globals from 'globals';\nimport eslintConfigPrettier from 'eslint-config-prettier/flat';\n\nexport default [\n  {\n    ignores: ['node_modules/**', 'legacy/**', 'reports/**'],\n  },\n  js.configs.recommended,\n  {\n    languageOptions: {\n      ecmaVersion: 'latest',\n      sourceType: 'module',\n      globals: {\n        ...globals.node,\n      },\n    },\n    rules: {\n      'object-shorthand': ['warn', 'always'],\n      'prefer-arrow-callback': 'error',\n      'logical-assignment-operators': ['warn', 'always'],\n      'guard-for-in': 'error',\n      'max-depth': ['warn', 3],\n      camelcase: 'error',\n    },\n  },\n  eslintConfigPrettier,\n];\n", "init/DEFECTS.md": "# Карта дефектів\n\nНомери рядків — у вихідному файлі src/app.js (коміт Add initial code with defects).\n\n| № | Рядок | Група | Опис дефекту | Прогноз | Виявлено | Виправлено |\n|---|-------|-------|--------------|---------|----------|------------|\n| 1 | 16–23 | Ф1 | змішані відступи: 1, 3, 8 пробілів і табуляція | Prettier, tabWidth, useTabs |  |  |\n| 2 | 55, 58, 164 | Ф2 | неоднакові пробіли навколо операторів і ком: price*(1 - …), (price,type), y+ 1 | Prettier, базове форматування |  |  |\n| 3 | 2, 5, 6 | Ф3 | лапки впереміш, є апостроф: \"I'm here\", 'Live music' | Prettier, singleQuote |  |  |\n| 4 | 3, 11 | Ф4 | частина інструкцій без ; | Prettier, semi |  |  |\n| 5 | 186 | Ф5 | виклик з 5 аргументами в одному рядку довжиною 134 символи | Prettier, printWidth |  |  |\n| 6 | 13, 165 | Ф6 | кілька інструкцій в одному рядку | Prettier, базове форматування |  |  |\n| 7 | 7–10, 11–12 | Ф7 | короткий об’єкт у кілька рядків і об’єкт із частковим перенесенням | Prettier, objectWrap |  |  |\n| 8 | 9, 23 | Ф8 | завершальна кома після останнього елемента є / немає | Prettier, trailingComma |  |  |\n| 9 | 13 | Ф9 | об’єкти {a: 1} і { b: 2 }: пробіли в дужках по-різному | Prettier, bracketSpacing |  |  |\n| 10 | 56–58 | Ф10 | стрілкові функції з одним параметром у дужках і без | Prettier, arrowParens |  |  |\n| 11 | 2 | Ф11 | ключ 'max-items' потребує лапок, інші ключі то з лапками, то без | Prettier, quoteProps |  |  |\n| 12 | 137–139 | Ф12 | довгий логічний вираз із 4 умов, довільно перенесений вручну | Prettier, printWidth, experimentalOperatorPosition |  |  |\n| 13 | 37–39, 67, 155, 31 | Ф13 | 3+ порожні рядки поспіль, пробіли в кінці рядків, } в одному рядку з кодом | Prettier, базове форматування |  |  |\n| 14 | 4 | К | змінна unusedTax оголошена, але не використана | ESLint, no-unused-vars |  |  |\n| 15 | 147 | К | функція oldCalc оголошена, але не викликається | ESLint, no-unused-vars |  |  |\n| 16 | 150 | К | звернення до неоголошеної змінної totl (функція не викликається) | ESLint, no-undef |  |  |\n| 17 | 95 | К | присвоєння в умові: if (status = \"done\") | ESLint, no-cond-assign |  |  |\n| 18 | 151 | К | код після return | ESLint, no-unreachable |  |  |\n| 19 | 3 | К | однакові ключі mode в об’єкті config | ESLint, no-dupe-keys |  |  |\n| 20 | 49 | К | однаковий case \"student\" у switch | ESLint, no-duplicate-case |  |  |\n| 21 | 80 | К | присвоєння параметра самому собі: buyerName = buyerName | ESLint, no-self-assign |  |  |\n| 22 | 83 | К | порожній блок if (seats.length === 0) {} | ESLint, no-empty |  |  |\n| 23 | 127 | К | порівняння з NaN: price === NaN | ESLint, use-isnan |  |  |\n| 24 | 132 | К | зайве перетворення на boolean: if (!!ev.active) | ESLint, no-extra-boolean-cast |  |  |\n| 25 | 27 | В | { eventId: eventId, … } у createTicket: не використано скорочений запис | ESLint, object-shorthand |  |  |\n| 26 | 91 | В | { id: id, buyer: …, tickets: tickets } у createOrder: не використано скорочений запис | ESLint, object-shorthand |  |  |\n| 27 | 158 | В | метод print: function () у reporter: не використано скорочений запис | ESLint, object-shorthand |  |  |\n| 28 | 31 | В | колбек find записано як function | ESLint, prefer-arrow-callback |  |  |\n| 29 | 35 | В | колбек filter записано як function | ESLint, prefer-arrow-callback |  |  |\n| 30 | 172 | В | колбек map записано як function | ESLint, prefer-arrow-callback |  |  |\n| 31 | 61 | В | currency = currency || \"UAH\" | ESLint, logical-assignment-operators |  |  |\n| 32 | 66 | В | unit = unit ?? \"\" | ESLint, logical-assignment-operators |  |  |\n| 33 | 176 | В | type = type || \"vip\" | ESLint, logical-assignment-operators |  |  |\n| 34 | 121 | В | for...in без перевірки власних властивостей (printStats) | ESLint, guard-for-in |  |  |\n| 35 | 198 | В | for...in без перевірки власних властивостей (основна частина) | ESLint, guard-for-in |  |  |\n| 36 | 103 | В | вкладеність блоків 4 рівні у validateOrder | ESLint, max-depth |  |  |\n| 37 | 84 | В | змінна total_price у snake_case | ESLint, camelcase |  |  |\n| 38 | 185 | В | змінна ticket_count у snake_case | ESLint, camelcase |  |  |\n| 39 | 46 | Л | знижка vip 0.2 замість 0.1 (замовлення 102: має бути 1620.00 UAH, а виводиться 1440.00 UAH) | жоден |  |  |\n| 40 | 73 | Л | умова seat <= event.capacity замість < (вільних місць має бути 117, а виводиться 118) | жоден |  |  |\n", "init/src/app.js": "// Concert agency: events, tickets and orders\nconst limits = { 'max-items': 6, \"minAge\": 16, maxPerOrder: 8, 'currency': \"UAH\" };\nconst config = { mode: \"test\", retries: 2, mode: \"prod\" }\nconst unusedTax = 0.2;\nconst greeting = \"I'm here\";\nconst motto = 'Live music';  \nconst point = {\n  x: 1,\n  y: 2\n};\nconst ticketBox = { event: 1, seats: [1, 2],\n  owner: \"Ira\" }\nconst tiny = {a: 1}; const tiny2 = { b: 2 }\n\nconst events = [\n{ id: 1, title: \"Rock Night\", city: 'Kyiv', basePrice: 800, capacity: 120, active: true },\n  { id: 2, title: 'Jazz Evening', city: \"Lviv\", basePrice: 650, capacity: 80, active: true },\n   { id: 3, title: \"Pop Festival\", city: \"Odesa\", basePrice: 1200, capacity: 300, active: false },\n\t{ id: 4, title: \"Classic Hall\", city: 'Kyiv', basePrice: 900, capacity: 150, active: true },\n        { id: 5, title: \"Indie Open Air\", city: \"Kharkiv\", basePrice: 500, capacity: 200, active: true },\n { id: 6, title: \"Electro Wave\", city: \"Dnipro\", basePrice: 700, capacity: 100, active: false },\n  { id: 7, title: 'Folk Fest', city: 'Lviv', basePrice: 450, capacity: 250, active: true },\n  { id: 8, title: \"Metal Storm\", city: \"Kyiv\", basePrice: 1000, capacity: 180, active: true },\n]\n\nfunction createTicket(eventId, seat, buyer, price) {\n\treturn { eventId: eventId, seat: seat, buyer: buyer, price: price };\n}\n\nfunction findEvent(id) {\n   return events.find(function (e) { return e.id === id; });\n}\n\nfunction getActiveEvents() {\n        return events.filter(function(e) { return e.active })\n}\n\n\n\n// discounts: student 15%, vip 10%, kids 30%\nconst calcDiscount = (type) => {\n    switch (type) {\n        case \"student\":\n            return 0.15;\n        case \"vip\":\n            return 0.2;\n        case \"kids\":\n            return 0.3;\n        case \"student\":\n            return 0.5;\n        default:\n            return 0;\n    }\n};\nconst applyDiscount = (price,type) => price*(1 - calcDiscount(type));\nconst isBigEvent = event => event.capacity >= 200\nconst getTitle = (e) => e.title;\nconst double = (x) => x*2, inc = y => y+ 1;\n\nfunction formatMoney(amount, currency) {\n  currency = currency || \"UAH\"\n  return amount.toFixed(2) + \" \" + currency;\n}\n\nfunction buildLine(label, value, unit) {\n  unit = unit ?? \"\";\n   \n\treturn `${label}: ${value} ${unit}`.trim()\n}\n\nfunction countFreeSeats(event, soldSeats) {\n\tlet free = 0;\n\tfor (let seat = 0; seat <= event.capacity; seat++) {\n        if (!soldSeats.includes(seat)) free++;\n\t}\n\treturn free  \n}\n\nfunction createOrder(id, buyerName, eventId, seats, type) {\n  buyerName = buyerName;\n  const event = findEvent(eventId)\n  if (!event) { throw new Error(\"No event \" + eventId) }\n  if (seats.length === 0) {}\n  let total_price = 0;\n  const tickets = [];\n  for (const seat of seats) {\n    const t = createTicket(eventId, seat, buyerName, applyDiscount(event.basePrice, type));\n    tickets.push(t);\n    total_price += t.price;\n  }\n  return { id: id, buyer: buyerName, tickets: tickets, total: total_price, status: \"new\" };\n}\n\nfunction closeOrder(status) {\n  if (status = \"done\") { return \"closed\" }\n  return \"open\"\n}\n\nfunction validateOrder(order) {\n  if (order) {\n    for (const t of order.tickets) {\n      if (t.price > 0) {\n        if (t.seat) {\n          return true;\n        }\n      }\n    }\n  }\n  return false\n}\n\nfunction countByCity(list) {\n  const stats = {};\n  for (const ev of list) {\n    stats[ev.city] = (stats[ev.city] || 0) + 1;\n  }\n  return stats\n}\n\nfunction printStats(stats) {\n  for (const city in stats) {\n    console.log(\"  \" + city + \": \" + stats[city]);\n  }\n}\n\nfunction checkPrice(price) {\n  if (price === NaN) { return \"bad price\"; }\n  return price > 0 ? \"ok\" : \"bad price\"\n}\n\nfunction label(ev) {\n  if (!!ev.active) { return \"on sale\"; }\n  return \"closed\";\n}\n\nfunction canSell(event, order) {\n  const sellable = event.active && order.tickets.length > 0 &&\n     order.tickets.length <= limits.maxPerOrder\n     && event.capacity > order.tickets.length\n  return sellable\n}\n\nfunction describeOrder(id, buyer, title, count, total) {\n  return `Order #${id}: ${buyer} bought ${count} ticket(s) for \"${title}\", total ${total}`\n}\n\nfunction oldCalc(x) { return x * 2 }\n\nfunction brokenReport() {\n\treturn totl + 1;\n  console.log(\"never printed\");\n}\n\n\n   \n\nconst reporter = {\n  print: function (msg) { console.log(msg) },\n  width: 30,\n};\n\n// ---- main part ----\nreporter.print(\"=== Concert agency report ===\")\nconsole.log(greeting +\" \"+motto)\nlet seatA = 1; let seatB = 2; console.log(seatA+seatB)\nconsole.log(\"Point sum: \" + (point.x + point.y) + \", box owner: \" + ticketBox.owner)\nconsole.log(\"Tiny: \" + (tiny.a + tiny2.b) + \", limit: \" + limits[\"max-items\"])\nconsole.log(\"Mode: \" + config.mode + \", double 4 = \" + double(4) + \", inc 4 = \" + inc(4))\n\nconst active = getActiveEvents()\nreporter.print(\"Active events: \" + active.length)\nreporter.print(\"Titles: \" + events.map(function (e) { return e.title }).join(\", \"))\nreporter.print(\"Big events: \" + events.filter(isBigEvent).map(getTitle).join(\", \"))\n\nlet type = process.argv[2]\ntype = type || \"vip\"\n\nconst orders = [\n  createOrder(101, \"Olena\", 1, [1, 2, 3], \"student\"),\n  createOrder(102, \"Taras\", 4, [10, 11], type),\n  createOrder(103, \"Ira\", 7, [5], \"kids\")\n]\n\nfor (const order of orders) {\n  const ticket_count = order.tickets.length\n  console.log(describeOrder(order.id, order.buyer, findEvent(order.tickets[0].eventId).title, ticket_count, formatMoney(order.total)))\n}\n\nconst revenue = orders.reduce((sum, o) => sum + o.total, 0)\nconsole.log(buildLine(\"Revenue\", formatMoney(revenue)))\nconsole.log(\"Valid orders: \" + orders.filter(validateOrder).length)\nconsole.log(\"Free seats, event 1: \" + countFreeSeats(events[0], [1, 2, 3]))\nconsole.log(\"Close 'new' order: \" + closeOrder(\"new\"))\nconsole.log(\"Price check: \" + checkPrice(100) + \", label: \" + label(events[2]))\nconsole.log(\"Can sell: \" + canSell(events[0], orders[0]))\nconsole.log(\"Events per city:\")\nprintStats(countByCity(events))\nfor (const city in countByCity(events)) { console.log(\"city key: \" + city) }\n\nconst count = orders.length\nif (count > 0) console.log(\"Orders total: \" + count)\n", "solution/app.js": "// Concert agency: events, tickets and orders\nconst limits = { \"max-items\": 6, \"minAge\": 16, \"maxPerOrder\": 8, \"currency\": \"UAH\" };\nconst config = { mode: \"prod\", retries: 2 };\nconst greeting = \"I'm here\";\nconst motto = \"Live music\";\nconst point = { x: 1, y: 2 };\nconst ticketBox = { event: 1, seats: [1, 2], owner: \"Ira\" };\nconst tiny = { a: 1 };\nconst tiny2 = { b: 2 };\n\nconst events = [\n  { id: 1, title: \"Rock Night\", city: \"Kyiv\", basePrice: 800, capacity: 120, active: true },\n  { id: 2, title: \"Jazz Evening\", city: \"Lviv\", basePrice: 650, capacity: 80, active: true },\n  { id: 3, title: \"Pop Festival\", city: \"Odesa\", basePrice: 1200, capacity: 300, active: false },\n  { id: 4, title: \"Classic Hall\", city: \"Kyiv\", basePrice: 900, capacity: 150, active: true },\n  { id: 5, title: \"Indie Open Air\", city: \"Kharkiv\", basePrice: 500, capacity: 200, active: true },\n  { id: 6, title: \"Electro Wave\", city: \"Dnipro\", basePrice: 700, capacity: 100, active: false },\n  { id: 7, title: \"Folk Fest\", city: \"Lviv\", basePrice: 450, capacity: 250, active: true },\n  { id: 8, title: \"Metal Storm\", city: \"Kyiv\", basePrice: 1000, capacity: 180, active: true },\n];\n\nfunction createTicket(eventId, seat, buyer, price) {\n  return { eventId, seat, buyer, price };\n}\n\nfunction findEvent(id) {\n  return events.find((e) => e.id === id);\n}\n\nfunction getActiveEvents() {\n  return events.filter((e) => e.active);\n}\n\n// discounts: student 15%, vip 10%, kids 30%\nconst calcDiscount = (type) => {\n  switch (type) {\n    case \"student\":\n      return 0.15;\n    case \"vip\":\n      return 0.1;\n    case \"kids\":\n      return 0.3;\n    case \"senior\":\n      return 0.5;\n    default:\n      return 0;\n  }\n};\nconst applyDiscount = (price, type) => price * (1 - calcDiscount(type));\nconst isBigEvent = (event) => event.capacity >= 200;\nconst getTitle = (e) => e.title;\nconst double = (x) => x * 2;\nconst inc = (y) => y + 1;\n\nfunction formatMoney(amount, currency) {\n  currency ||= \"UAH\";\n  return `${amount.toFixed(2)} ${currency}`;\n}\n\nfunction buildLine(label, value, unit) {\n  unit ??= \"\";\n  return `${label}: ${value} ${unit}`.trim();\n}\n\nfunction countFreeSeats(event, soldSeats) {\n  let free = 0;\n  for (let seat = 0; seat < event.capacity; seat++) {\n    if (!soldSeats.includes(seat)) free++;\n  }\n  return free;\n}\n\nfunction createOrder(id, buyerName, eventId, seats, type) {\n  const event = findEvent(eventId);\n  if (!event) {\n    throw new Error(`No event ${eventId}`);\n  }\n  if (seats.length === 0) {\n    throw new Error(\"No seats selected\");\n  }\n  let totalPrice = 0;\n  const tickets = [];\n  for (const seat of seats) {\n    const ticket = createTicket(eventId, seat, buyerName, applyDiscount(event.basePrice, type));\n    tickets.push(ticket);\n    totalPrice += ticket.price;\n  }\n  return { id, buyer: buyerName, tickets, total: totalPrice, status: \"new\" };\n}\n\nfunction closeOrder(status) {\n  if (status === \"done\") {\n    return \"closed\";\n  }\n  return \"open\";\n}\n\nfunction validateOrder(order) {\n  if (!order) {\n    return false;\n  }\n  return order.tickets.some((t) => t.price > 0 && Boolean(t.seat));\n}\n\nfunction countByCity(list) {\n  const stats = {};\n  for (const ev of list) {\n    stats[ev.city] = (stats[ev.city] || 0) + 1;\n  }\n  return stats;\n}\n\nfunction printStats(stats) {\n  for (const city in stats) {\n    if (Object.hasOwn(stats, city)) {\n      console.log(\"  \" + city + \": \" + stats[city]);\n    }\n  }\n}\n\nfunction checkPrice(price) {\n  if (Number.isNaN(price)) {\n    return \"bad price\";\n  }\n  return price > 0 ? \"ok\" : \"bad price\";\n}\n\nfunction label(ev) {\n  if (ev.active) {\n    return \"on sale\";\n  }\n  return \"closed\";\n}\n\nfunction canSell(event, order) {\n  const sellable =\n    event.active &&\n    order.tickets.length > 0 &&\n    order.tickets.length <= limits.maxPerOrder &&\n    event.capacity > order.tickets.length;\n  return sellable;\n}\n\nfunction describeOrder(id, buyer, title, count, total) {\n  return `Order #${id}: ${buyer} bought ${count} ticket(s) for \"${title}\", total ${total}`;\n}\n\nconst reporter = {\n  print(msg) {\n    console.log(msg);\n  },\n  width: 30,\n};\n\n// ---- main part ----\nreporter.print(\"=== Concert agency report ===\");\nconsole.log(greeting + \" \" + motto);\nconst seatA = 1;\nconst seatB = 2;\nconsole.log(seatA + seatB);\nconsole.log(\"Point sum: \" + (point.x + point.y) + \", box owner: \" + ticketBox.owner);\nconsole.log(\"Tiny: \" + (tiny.a + tiny2.b) + \", limit: \" + limits[\"max-items\"]);\nconsole.log(\"Mode: \" + config.mode + \", double 4 = \" + double(4) + \", inc 4 = \" + inc(4));\n\nconst active = getActiveEvents();\nreporter.print(\"Active events: \" + active.length);\nreporter.print(\"Titles: \" + events.map((e) => e.title).join(\", \"));\nreporter.print(\"Big events: \" + events.filter(isBigEvent).map(getTitle).join(\", \"));\n\nconst type = process.argv[2] || \"vip\";\n\nconst orders = [\n  createOrder(101, \"Olena\", 1, [1, 2, 3], \"student\"),\n  createOrder(102, \"Taras\", 4, [10, 11], type),\n  createOrder(103, \"Ira\", 7, [5], \"kids\"),\n];\n\nfor (const order of orders) {\n  const ticketCount = order.tickets.length;\n  const title = findEvent(order.tickets[0].eventId).title;\n  console.log(describeOrder(order.id, order.buyer, title, ticketCount, formatMoney(order.total)));\n}\n\nconst revenue = orders.reduce((sum, o) => sum + o.total, 0);\nconsole.log(buildLine(\"Revenue\", formatMoney(revenue)));\nconsole.log(\"Valid orders: \" + orders.filter(validateOrder).length);\nconsole.log(\"Free seats, event 1: \" + countFreeSeats(events[0], [1, 2, 3]));\nconsole.log(\"Close 'new' order: \" + closeOrder(\"new\"));\nconsole.log(\"Price check: \" + checkPrice(100) + \", label: \" + label(events[2]));\nconsole.log(\"Can sell: \" + canSell(events[0], orders[0]));\nconsole.log(\"Events per city:\");\nconst cityStats = countByCity(events);\nprintStats(cityStats);\nfor (const city in cityStats) {\n  if (Object.hasOwn(cityStats, city)) {\n    console.log(\"city key: \" + city);\n  }\n}\n\nconst count = orders.length;\nif (count > 0) console.log(\"Orders total: \" + count);\n"};
const REPO_NAME = process.argv[3] || "lab04-terebniov-ict326bd";
const DIR = path.resolve(
  process.argv[2] || path.join(os.homedir(), "Desktop", "Lab04_Terebnov_ICT126BD"),
);
const DATA = path.join(path.dirname(DIR), "lab04-report-data.txt");

const log = (m) => console.log(m);
const die = (m) => {
  try { fs.appendFileSync(DATA, "\nСТОП: " + m + "\n", "utf8"); } catch {}
  console.error("\nСТОП: " + m);
  console.error("Надішліть мені цей текст і файл " + DATA + " (якщо він є).");
  process.exit(1);
};

// ---------- helpers ----------
function run(cmd, opts = {}) {
  const r = spawnSync(cmd, {
    cwd: opts.cwd ?? DIR,
    shell: true,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
  return {
    code: r.status ?? 1,
    out: r.stdout ?? "",
    err: r.stderr ?? "",
    all: (r.stdout ?? "") + (r.stderr ?? ""),
  };
}

function record(title, cmd, r) {
  const text =
    `\n===== ${title} =====\n$ ${cmd}\n${r.all.trimEnd()}\n[exit code: ${r.code}]\n`;
  fs.appendFileSync(DATA, text, "utf8");
}

// run a command, store it in report data, return result
function step(title, cmd, opts = {}) {
  log("• " + title + ": " + cmd);
  const r = run(cmd, opts);
  record(title, cmd, r);
  if (opts.mustSucceed && r.code !== 0) {
    die(`команда «${cmd}» завершилась з кодом ${r.code}:\n${r.all}`);
  }
  return r;
}

function showFile(title, p) {
  log("• " + title);
  fs.appendFileSync(DATA, `\n===== ${title} =====\n${fs.readFileSync(path.join(DIR, p), "utf8")}\n`, "utf8");
}
const file = (p) => path.join(DIR, p);
const read = (p) => fs.readFileSync(file(p), "utf8");
const write = (p, t) => fs.writeFileSync(file(p), t, "utf8");
const copyFromKit = (from, to) => {
  const key = from.split(path.sep).join("/");
  fs.mkdirSync(path.dirname(file(to)), { recursive: true });
  fs.writeFileSync(file(to), FILES[key]);
};

function commit(msg) {
  step("git add", "git add .", { mustSucceed: true });
  step("git status", "git status --short", {});
  step("git commit", `git commit -m "${msg}"`, { mustSucceed: true });
}

// parse an ESLint stylish report: rule -> count, totals
function parseEslint(text) {
  const counts = {};
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^\s*\d+:\d+\s+(error|warning)\s+.*?\s+([@\w/-]+)\s*$/);
    if (m) counts[m[2]] = (counts[m[2]] || 0) + 1;
  }
  const summary = text.match(/✖.*problems?.*$/m)?.[0] ?? "(підсумкового рядка немає)";
  return { counts, summary };
}

const FIXABLE = new Set([
  "object-shorthand",
  "prefer-arrow-callback",
  "logical-assignment-operators",
  "no-extra-boolean-cast",
]);

// update DEFECTS.md columns Виявлено / Виправлено
function updateDefects(mode, eslintBefore, eslintAfterFix) {
  const lines = read("DEFECTS.md").split(/\r?\n/);
  const out = lines.map((line) => {
    if (!/^\|\s*\d+\s*\|/.test(line)) return line;
    const c = line.split("|").slice(1, -1).map((s) => s.trim());
    // c: [№, Рядок, Група, Опис, Прогноз, Виявлено, Виправлено]
    if (c.length < 7) return line;
    const group = c[2];
    const forecast = c[4];
    if (mode === "prettier" && group.startsWith("Ф")) {
      c[5] = "Prettier (prettier --check)";
      c[6] = "Prettier";
    }
    if (mode === "eslint" && (group === "К" || group === "В")) {
      const rule = forecast.replace(/^ESLint,\s*/, "");
      const before = eslintBefore.counts[rule] || 0;
      const after = eslintAfterFix.counts[rule] || 0;
      c[5] = before > 0 ? `ESLint (${rule})` : "не виявлено";
      if (before === 0) c[6] = "—";
      else if (after === 0 && FIXABLE.has(rule)) c[6] = "ESLint --fix";
      else if (after > 0 && after < before) c[6] = "ESLint --fix частково, решта вручну";
      else c[6] = "вручну";
    }
    if (mode === "logic" && group === "Л") {
      c[5] = "ні (жоден інструмент)";
      c[6] = "вручну";
    }
    return "| " + c.join(" | ") + " |";
  });
  write("DEFECTS.md", out.join("\n"));
}

function formatDefects() {
  step("prettier --write DEFECTS.md", "npx prettier --write DEFECTS.md", {});
}

// ---------- 0. checks ----------
fs.mkdirSync(path.dirname(DATA), { recursive: true });
fs.writeFileSync(DATA, `Lab04 report data, generated ${new Date().toISOString()}\n`, "utf8");
log("Папка проєкту: " + DIR);
if (fs.existsSync(DIR) && fs.readdirSync(DIR).length > 0) {
  die(
    "Папка проєкту не порожня. Вкажіть нову (порожню) папку: node run-lab.mjs C:\\шлях\\нова_папка",
  );
}
fs.mkdirSync(DIR, { recursive: true });

const vNode = run("node --version");
const vNpm = run("npm --version");
const vGit = run("git --version");
if (vGit.code !== 0) {
  die(
    "Git не знайдено в PATH. Встановіть Git for Windows (https://git-scm.com/download/win), " +
      "закрийте і знову відкрийте термінал та запустіть скрипт ще раз.",
  );
}
if (vNpm.code !== 0) die("npm не знайдено: " + vNpm.all);
step("Версія Node.js", "node --version", {});
step("Версія npm", "npm --version", {});
step("Версія Git", "git --version", {});
step("Версія Windows", "ver", {});
step("Версія VS Code", "code --version", {});

// ---------- 1.4 - 1.6 repo + packages ----------
step("git init", "git init -b main", { mustSucceed: true });
step("git autocrlf", "git config core.autocrlf false", {});
if (run("git config user.name").out.trim() === "") {
  step("git user.name", 'git config user.name "Alex134619"', {});
}
if (run("git config user.email").out.trim() === "") {
  step("git user.email", 'git config user.email "alex134619@users.noreply.github.com"', {});
}
step("npm init", "npm init -y", { mustSucceed: true });
step("npm pkg name", `npm pkg set name=${REPO_NAME}`, { mustSucceed: true });
step("npm pkg type", "npm pkg set type=module", { mustSucceed: true });
step(
  "npm install",
  "npm install --save-dev --save-exact prettier@3.9.9 eslint@10.12.0 @eslint/js@10.0.1 globals@17.13.0 eslint-config-prettier@10.1.8",
  { mustSucceed: true },
);

// ---------- 2.1 - 2.4 configs ----------
for (const f of [".gitignore", ".prettierrc.json", ".prettierignore", "eslint.config.js"]) {
  copyFromKit(path.join("init", f), f);
}
const pkg = JSON.parse(read("package.json"));
pkg.scripts = {
  format: "prettier --write .",
  "format:check": "prettier --check .",
  lint: "eslint .",
  "lint:fix": "eslint . --fix",
  check: "prettier --check . && eslint . --max-warnings 0",
};
write("package.json", JSON.stringify(pkg, null, 2) + "\n");
step("find-config-path", "npx prettier --find-config-path package.json", {});
step("eslint eslint.config.js", "npx eslint eslint.config.js", {});
commit("Configure Prettier and ESLint");

// ---------- 2.5 - 2.9 program, defects, legacy ----------
copyFromKit(path.join("init", "src", "app.js"), "src/app.js");
copyFromKit(path.join("init", "src", "app.js"), "legacy/old-report.js");
copyFromKit(path.join("init", "DEFECTS.md"), "DEFECTS.md");
const run1 = step("node src/app.js (початковий запуск)", "node src/app.js", {});
if (run1.code !== 0) die("src/app.js не запускається:\n" + run1.all);
commit("Add initial code with defects");
step("git show initial app.js", "git show HEAD:src/app.js", {});

// ---------- 3.1 ----------
fs.mkdirSync(file("reports"), { recursive: true });
write("reports/output-before.txt", run1.out);

// ---------- 3.2 ----------
step("3.2 prettier --check . (до форматування)", "npx prettier --check .", {});

// ---------- 3.3 ----------
step("3.3 eslint . -o reports/eslint-before.txt", "npx eslint . -o reports/eslint-before.txt", {});
const eBeforeText = read("reports/eslint-before.txt");
const eBefore = parseEslint(eBeforeText);
fs.appendFileSync(DATA, `\n----- eslint-before.txt -----\n${eBeforeText}\n`, "utf8");

// ---------- 3.4 syntax error experiment ----------
{
  const src = read("src/app.js");
  const idx = src.lastIndexOf("}");
  write("src/app.js", src.slice(0, idx) + src.slice(idx + 1));
  step("3.4 prettier --check src/app.js (синтаксична помилка)", "npx prettier --check src/app.js", {});
  step("3.4 eslint src/app.js (синтаксична помилка)", "npx eslint src/app.js", {});
  step("3.4 git restore src/app.js", "git restore src/app.js", { mustSucceed: true });
}

// ---------- 3.5 Prettier ----------
updateDefects("prettier", eBefore, eBefore);
updateDefects("logic", eBefore, eBefore);
step("3.5 prettier src/app.js (без запису, перші рядки)", "npx prettier src/app.js", {});
step("3.5 prettier --write .", "npx prettier --write .", { mustSucceed: true });
const chkAfter = step("3.5 prettier --check . (після)", "npx prettier --check .", {});
step("3.5 git diff --stat", "git diff --stat", {});
step("3.5 git diff src/app.js", "git diff src/app.js", {});
step("3.5 git diff eslint.config.js", "git diff eslint.config.js", {});
showFile("3.5 eslint.config.js (після Prettier)", "eslint.config.js");
showFile("3.5 DEFECTS.md після prettier", "DEFECTS.md");
const run2 = step("3.5 node src/app.js (після форматування)", "node src/app.js", {});
fs.appendFileSync(
  DATA,
  `\n[Порівняння виведення до/після форматування: ${run2.out === run1.out ? "ІДЕНТИЧНЕ" : "ВІДРІЗНЯЄТЬСЯ!"}]\n`,
  "utf8",
);
if (chkAfter.code !== 0) die("prettier --check . не пройшов після --write:\n" + chkAfter.all);
commit("Format code with Prettier");

// ---------- 3.6 options experiment ----------
{
  const cfg = JSON.parse(read(".prettierrc.json"));
  cfg.printWidth = 40;
  cfg.semi = false;
  write(".prettierrc.json", JSON.stringify(cfg, null, 2) + "\n");
  step("3.6 prettier --check src/app.js (printWidth 40, semi false)", "npx prettier --check src/app.js", {});
  step("3.6 prettier src/app.js (printWidth 40, semi false)", "npx prettier src/app.js", {});
  step("3.6 git restore .prettierrc.json", "git restore .prettierrc.json", { mustSucceed: true });
}

// ---------- 3.7 ESLint after format ----------
step("3.7 eslint . -o reports/eslint-after-format.txt", "npx eslint . -o reports/eslint-after-format.txt", {});
const eFmtText = read("reports/eslint-after-format.txt");
fs.appendFileSync(DATA, `\n----- eslint-after-format.txt -----\n${eFmtText}\n`, "utf8");
step("3.7 eslint . --quiet", "npx eslint . --quiet", {});
step("3.7 eslint . --max-warnings 0", "npx eslint . --max-warnings 0", {});

// ---------- 3.8 ESLint --fix ----------
step("3.8 eslint . --fix", "npx eslint . --fix", {});
step("3.8 git diff src/app.js (авто-виправлення ESLint)", "git diff src/app.js", {});
step("3.8 eslint . -o reports/eslint-after-fix.txt", "npx eslint . -o reports/eslint-after-fix.txt", {});
const eFixText = read("reports/eslint-after-fix.txt");
const eFix = parseEslint(eFixText);
fs.appendFileSync(DATA, `\n----- eslint-after-fix.txt -----\n${eFixText}\n`, "utf8");
const pchk = step("3.8 prettier --check . (після --fix)", "npx prettier --check .", {});
if (pchk.code !== 0) {
  step("3.8 npm run format (ESLint --fix порушив форматування)", "npm run format", {});
  fs.appendFileSync(DATA, "\n[ПІСЛЯ --fix prettier --check скаржився: виконано npm run format]\n", "utf8");
}
updateDefects("eslint", eBefore, eFix);
formatDefects();
commit("Apply ESLint autofixes");

// ---------- 3.9 manual fixes ----------
copyFromKit(path.join("solution", "app.js"), "src/app.js");
step("3.9 prettier --write src/app.js (форматування ручного виправлення)", "npx prettier --write src/app.js", {});
step("3.9 npm run lint", "npm run lint", {});
const run3 = step("3.9 node src/app.js", "node src/app.js", {});
if (run3.code !== 0) die("виправлена програма не запускається:\n" + run3.all);

// ---------- 3.10 config order experiment ----------
{
  const orig = read("eslint.config.js");
  const withCurly = orig.replace(/rules:\s*\{/, (m) => m + '\n      curly: "error",');
  write("eslint.config.js", withCurly);
  step("3.10 eslint src/app.js (curly додано, prettier-конфіг останній)", "npx eslint src/app.js", {});
  // move eslintConfigPrettier right after js.configs.recommended
  let moved = withCurly.replace(/\n\s*eslintConfigPrettier,\s*\n\];/, "\n];");
  moved = moved.replace(
    /js\.configs\.recommended,/,
    "js.configs.recommended,\n  eslintConfigPrettier,",
  );
  write("eslint.config.js", moved);
  step("3.10 eslint src/app.js (eslintConfigPrettier після recommended)", "npx eslint src/app.js", {});
  step("3.10 git restore eslint.config.js", "git restore eslint.config.js", { mustSucceed: true });
}

// ---------- 3.11 ignored files ----------
step("3.11 prettier --check legacy/old-report.js", "npx prettier --check legacy/old-report.js", {});
step("3.11 eslint legacy/old-report.js", "npx eslint legacy/old-report.js", {});

// ---------- 3.12 final check ----------
const finalCheck = step("3.12 npm run check", "npm run check", {});
if (finalCheck.code !== 0) {
  die("npm run check не пройшов:\n" + finalCheck.all);
}
const run4 = step("3.12 node src/app.js", "node src/app.js", { mustSucceed: true });
write("reports/output-after.txt", run4.out);
fs.appendFileSync(DATA, `\n----- output-before.txt -----\n${run1.out}\n----- output-after.txt -----\n${run4.out}\n`, "utf8");
showFile("final src/app.js", "src/app.js");
showFile("final DEFECTS.md", "DEFECTS.md");
showFile("final package.json", "package.json");
showFile("final eslint.config.js", "eslint.config.js");
showFile("final .prettierrc.json", ".prettierrc.json");
updateDefects("logic", eBefore, eFix);
formatDefects();
const finalCheck2 = step("npm run check (повторно після DEFECTS.md)", "npm run check", {});
if (finalCheck2.code !== 0) die("повторний npm run check не пройшов:\n" + finalCheck2.all);
commit("Fix remaining problems manually");

step("git log --oneline", "git log --oneline", {});
step("git show --stat HEAD~2", "git show --stat HEAD~2", {});
step("git show --stat HEAD~1", "git show --stat HEAD~1", {});
step("git status", "git status --short", {});

log("\nГОТОВО. Локальний репозиторій з 5 комітами: " + DIR);
log("Файл з даними для звіту: " + DATA);
log("\nЩоб опублікувати (спершу створіть ПОРОЖНІЙ репозиторій на GitHub):");
log(`  cd "${DIR}"`);
log(`  git remote add origin https://github.com/Alex134619/${REPO_NAME}.git`);
log("  git push -u origin main");
