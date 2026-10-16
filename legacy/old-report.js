// Concert agency: events, tickets and orders
const limits = { 'max-items': 6, "minAge": 16, maxPerOrder: 8, 'currency': "UAH" };
const config = { mode: "test", retries: 2, mode: "prod" }
const unusedTax = 0.2;
const greeting = "I'm here";
const motto = 'Live music';  
const point = {
  x: 1,
  y: 2
};
const ticketBox = { event: 1, seats: [1, 2],
  owner: "Ira" }
const tiny = {a: 1}; const tiny2 = { b: 2 }

const events = [
{ id: 1, title: "Rock Night", city: 'Kyiv', basePrice: 800, capacity: 120, active: true },
  { id: 2, title: 'Jazz Evening', city: "Lviv", basePrice: 650, capacity: 80, active: true },
   { id: 3, title: "Pop Festival", city: "Odesa", basePrice: 1200, capacity: 300, active: false },
	{ id: 4, title: "Classic Hall", city: 'Kyiv', basePrice: 900, capacity: 150, active: true },
        { id: 5, title: "Indie Open Air", city: "Kharkiv", basePrice: 500, capacity: 200, active: true },
 { id: 6, title: "Electro Wave", city: "Dnipro", basePrice: 700, capacity: 100, active: false },
  { id: 7, title: 'Folk Fest', city: 'Lviv', basePrice: 450, capacity: 250, active: true },
  { id: 8, title: "Metal Storm", city: "Kyiv", basePrice: 1000, capacity: 180, active: true },
]

function createTicket(eventId, seat, buyer, price) {
	return { eventId: eventId, seat: seat, buyer: buyer, price: price };
}

function findEvent(id) {
   return events.find(function (e) { return e.id === id; });
}

function getActiveEvents() {
        return events.filter(function(e) { return e.active })
}



// discounts: student 15%, vip 10%, kids 30%
const calcDiscount = (type) => {
    switch (type) {
        case "student":
            return 0.15;
        case "vip":
            return 0.2;
        case "kids":
            return 0.3;
        case "student":
            return 0.5;
        default:
            return 0;
    }
};
const applyDiscount = (price,type) => price*(1 - calcDiscount(type));
const isBigEvent = event => event.capacity >= 200
const getTitle = (e) => e.title;
const double = (x) => x*2, inc = y => y+ 1;

function formatMoney(amount, currency) {
  currency = currency || "UAH"
  return amount.toFixed(2) + " " + currency;
}

function buildLine(label, value, unit) {
  unit = unit ?? "";
   
	return `${label}: ${value} ${unit}`.trim()
}

function countFreeSeats(event, soldSeats) {
	let free = 0;
	for (let seat = 0; seat <= event.capacity; seat++) {
        if (!soldSeats.includes(seat)) free++;
	}
	return free  
}

function createOrder(id, buyerName, eventId, seats, type) {
  buyerName = buyerName;
  const event = findEvent(eventId)
  if (!event) { throw new Error("No event " + eventId) }
  if (seats.length === 0) {}
  let total_price = 0;
  const tickets = [];
  for (const seat of seats) {
    const t = createTicket(eventId, seat, buyerName, applyDiscount(event.basePrice, type));
    tickets.push(t);
    total_price += t.price;
  }
  return { id: id, buyer: buyerName, tickets: tickets, total: total_price, status: "new" };
}

function closeOrder(status) {
  if (status = "done") { return "closed" }
  return "open"
}

function validateOrder(order) {
  if (order) {
    for (const t of order.tickets) {
      if (t.price > 0) {
        if (t.seat) {
          return true;
        }
      }
    }
  }
  return false
}

function countByCity(list) {
  const stats = {};
  for (const ev of list) {
    stats[ev.city] = (stats[ev.city] || 0) + 1;
  }
  return stats
}

function printStats(stats) {
  for (const city in stats) {
    console.log("  " + city + ": " + stats[city]);
  }
}

function checkPrice(price) {
  if (price === NaN) { return "bad price"; }
  return price > 0 ? "ok" : "bad price"
}

function label(ev) {
  if (!!ev.active) { return "on sale"; }
  return "closed";
}

function canSell(event, order) {
  const sellable = event.active && order.tickets.length > 0 &&
     order.tickets.length <= limits.maxPerOrder
     && event.capacity > order.tickets.length
  return sellable
}

function describeOrder(id, buyer, title, count, total) {
  return `Order #${id}: ${buyer} bought ${count} ticket(s) for "${title}", total ${total}`
}

function oldCalc(x) { return x * 2 }

function brokenReport() {
	return totl + 1;
  console.log("never printed");
}


   

const reporter = {
  print: function (msg) { console.log(msg) },
  width: 30,
};

// ---- main part ----
reporter.print("=== Concert agency report ===")
console.log(greeting +" "+motto)
let seatA = 1; let seatB = 2; console.log(seatA+seatB)
console.log("Point sum: " + (point.x + point.y) + ", box owner: " + ticketBox.owner)
console.log("Tiny: " + (tiny.a + tiny2.b) + ", limit: " + limits["max-items"])
console.log("Mode: " + config.mode + ", double 4 = " + double(4) + ", inc 4 = " + inc(4))

const active = getActiveEvents()
reporter.print("Active events: " + active.length)
reporter.print("Titles: " + events.map(function (e) { return e.title }).join(", "))
reporter.print("Big events: " + events.filter(isBigEvent).map(getTitle).join(", "))

let type = process.argv[2]
type = type || "vip"

const orders = [
  createOrder(101, "Olena", 1, [1, 2, 3], "student"),
  createOrder(102, "Taras", 4, [10, 11], type),
  createOrder(103, "Ira", 7, [5], "kids")
]

for (const order of orders) {
  const ticket_count = order.tickets.length
  console.log(describeOrder(order.id, order.buyer, findEvent(order.tickets[0].eventId).title, ticket_count, formatMoney(order.total)))
}

const revenue = orders.reduce((sum, o) => sum + o.total, 0)
console.log(buildLine("Revenue", formatMoney(revenue)))
console.log("Valid orders: " + orders.filter(validateOrder).length)
console.log("Free seats, event 1: " + countFreeSeats(events[0], [1, 2, 3]))
console.log("Close 'new' order: " + closeOrder("new"))
console.log("Price check: " + checkPrice(100) + ", label: " + label(events[2]))
console.log("Can sell: " + canSell(events[0], orders[0]))
console.log("Events per city:")
printStats(countByCity(events))
for (const city in countByCity(events)) { console.log("city key: " + city) }

const count = orders.length
if (count > 0) console.log("Orders total: " + count)
