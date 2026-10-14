import { useMemo, useState } from 'react'

const menu = [
  { id: 'latte', category: 'Minuman', name: 'Solok Latte', note: 'Espresso, susu segar & gula melaka', price: 11, icon: '☕', tone: 'coffee' },
  { id: 'americano', category: 'Minuman', name: 'Americano', note: 'Double shot espresso yang bersih', price: 8, icon: '◒', tone: 'dark' },
  { id: 'matcha', category: 'Minuman', name: 'Matcha Cloud', note: 'Matcha premium dengan krim lembut', price: 13, icon: '🍵', tone: 'matcha' },
  { id: 'mocha', category: 'Minuman', name: 'Mocha', note: 'Coklat gelap & espresso', price: 12, icon: '◉', tone: 'cocoa' },
  { id: 'croffle', category: 'Makanan', name: 'Kaya Butter Croffle', note: 'Rangup, kaya pandan & mentega', price: 10, icon: '▱', tone: 'pastry' },
  { id: 'toast', category: 'Makanan', name: 'Sourdough Toastie', note: 'Ayam panggang, keju & salad', price: 15, icon: '◫', tone: 'toast' },
  { id: 'pasta', category: 'Makanan', name: 'Creamy Mushroom Pasta', note: 'Cendawan, parmesan & herba', price: 18, icon: '◌', tone: 'pasta' },
  { id: 'tiramisu', category: 'Dessert', name: 'Tiramisu', note: 'Mascarpone & kopi SolokBrew', price: 14, icon: '▤', tone: 'tiramisu' },
  { id: 'cake', category: 'Dessert', name: 'Burnt Cheesecake', note: 'Lembut di tengah, karamel di luar', price: 14, icon: '◒', tone: 'cake' },
]

const money = value => `RM${value.toFixed(2)}`
const tableFromUrl = new URLSearchParams(window.location.search).get('table') || '07'

function App() {
  const [step, setStep] = useState('welcome')
  const [customer, setCustomer] = useState({ name: '', phone: '' })
  const [category, setCategory] = useState('Semua')
  const [cart, setCart] = useState([])
  const [notice, setNotice] = useState('')
  const [orderNo, setOrderNo] = useState('')

  const filtered = category === 'Semua' ? menu : menu.filter(item => item.category === category)
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const orderTotal = subtotal

  function addItem(item) {
    setCart(current => {
      const found = current.find(entry => entry.id === item.id)
      return found ? current.map(entry => entry.id === item.id ? { ...entry, quantity: entry.quantity + 1 } : entry) : [...current, { ...item, quantity: 1 }]
    })
    setNotice(`${item.name} ditambah ke troli`)
    window.setTimeout(() => setNotice(''), 1800)
  }
  function changeQuantity(id, delta) {
    setCart(current => current.map(item => item.id === id ? { ...item, quantity: item.quantity + delta } : item).filter(item => item.quantity > 0))
  }
  function startOrdering(event) {
    event.preventDefault()
    if (customer.name.trim() && customer.phone.trim().length >= 9) setStep('menu')
  }
  function confirmOrder() {
    setOrderNo(`SB-${Math.floor(1000 + Math.random() * 9000)}`)
    setStep('receipt')
  }

  if (step === 'welcome') return <Welcome customer={customer} setCustomer={setCustomer} onSubmit={startOrdering} />
  if (step === 'receipt') return <Receipt customer={customer} cart={cart} total={orderTotal} orderNo={orderNo} onNewOrder={() => { setCart([]); setStep('menu') }} />

  return <main className="app-shell">
    <header className="topbar"><Brand /><button className="table-badge" title="Nombor meja daripada QR"><span>Meja</span>{tableFromUrl}</button></header>
    <section className="greeting"><p>Hai, {customer.name.split(' ')[0]} <span>✦</span></p><h1>Apa yang anda mahu hari ini?</h1><small>Pesan dari meja anda. Bayar di kaunter selepas checkout.</small></section>
    <nav className="category-tabs" aria-label="Kategori menu">{['Semua', 'Minuman', 'Makanan', 'Dessert'].map(tab => <button key={tab} className={category === tab ? 'active' : ''} onClick={() => setCategory(tab)}>{tab}</button>)}</nav>
    <section className="menu-grid">{filtered.map(item => <article className="menu-card" key={item.id}><div className={`food-art ${item.tone}`}><span>{item.icon}</span></div><div className="card-copy"><p className="item-name">{item.name}</p><p className="item-note">{item.note}</p><div className="card-bottom"><strong>{money(item.price)}</strong><button className="add-button" onClick={() => addItem(item)} aria-label={`Tambah ${item.name}`}>+</button></div></div></article>)}</section>
    {notice && <div className="toast">✓ {notice}</div>}
    {totalItems > 0 && <button className="cart-bar" onClick={() => setStep('cart')}><span className="cart-count">{totalItems}</span><span>Lihat troli</span><strong>{money(orderTotal)} <b>›</b></strong></button>}
  </main>
}

function Welcome({ customer, setCustomer, onSubmit }) { return <main className="welcome-page"><div className="welcome-card"><Brand /><div className="welcome-art"><span>☕</span><i>✦</i><b>✦</b></div><div className="intro"><p className="eyebrow">SELAMAT DATANG KE</p><h1>Kopi baik,<br />hari yang lebih baik.</h1><p>Pesan terus dari meja anda — santai, cepat dan mudah.</p></div><div className="table-card"><span>◈</span><div><small>ANDA BERADA DI</small><strong>Meja {tableFromUrl}</strong></div></div><form onSubmit={onSubmit}><label>Nama anda<input required value={customer.name} onChange={e => setCustomer({ ...customer, name: e.target.value })} placeholder="Contoh: Aina" /></label><label>Nombor telefon<input required type="tel" inputMode="numeric" value={customer.phone} onChange={e => setCustomer({ ...customer, phone: e.target.value })} placeholder="Contoh: 012 345 6789" /></label><button className="primary" type="submit">Mula buat pesanan <span>→</span></button></form><p className="privacy">Dengan meneruskan, anda bersetuju untuk menggunakan maklumat ini bagi pesanan anda.</p></div></main> }
function Brand() { return <div className="brand"><span className="brand-mark">s</span><span>solok<span>brew</span></span></div> }
function Cart({ cart, subtotal, onChange, onBack, onCheckout }) { return <main className="app-shell cart-page"><header className="topbar"><button className="back" onClick={onBack}>←</button><Brand /><span className="table-mini">Meja {tableFromUrl}</span></header><h1>Troli anda</h1><p className="muted">Semak pesanan sebelum checkout.</p><div className="cart-items">{cart.map(item => <article className="cart-item" key={item.id}><div className={`food-art mini ${item.tone}`}><span>{item.icon}</span></div><div><strong>{item.name}</strong><p>{money(item.price)}</p></div><div className="quantity"><button onClick={() => onChange(item.id, -1)}>−</button><span>{item.quantity}</span><button onClick={() => onChange(item.id, 1)}>+</button></div></article>)}</div><section className="summary"><div><span>Jumlah kecil</span><strong>{money(subtotal)}</strong></div><div><span>Caj servis</span><strong>RM0.00</strong></div><hr /><div className="total"><span>Jumlah</span><strong>{money(subtotal)}</strong></div></section><div className="payment-note"><span>◉</span><p><strong>Bayar di kaunter</strong><br />Sila tunjukkan nombor pesanan anda selepas checkout.</p></div><button className="primary checkout" onClick={onCheckout}>Checkout pesanan <span>→</span></button></main> }
function Receipt({ customer, cart, total, orderNo, onNewOrder }) { return <main className="receipt-page"><div className="receipt-card"><Brand /><div className="success-ring">✓</div><p className="eyebrow">PESANAN BERJAYA DICIPTA</p><h1>Terima kasih,<br />{customer.name}!</h1><p className="receipt-lead">Pesanan anda sedang menunggu bayaran di kaunter.</p><div className="order-number"><small>NOMBOR PESANAN</small><strong>{orderNo}</strong><span>Meja {tableFromUrl}</span></div><div className="receipt-lines">{cart.map(item => <div key={item.id}><span>{item.quantity}× {item.name}</span><strong>{money(item.price * item.quantity)}</strong></div>)}<hr /><div className="grand"><span>Jumlah perlu dibayar</span><strong>{money(total)}</strong></div></div><div className="counter-callout"><span>☕</span><p><strong>Langkah seterusnya</strong><br />Sila ke kaunter dan maklumkan nombor pesanan <b>{orderNo}</b> untuk membuat bayaran.</p></div><button className="secondary" onClick={onNewOrder}>Tambah pesanan lain</button></div></main> }

// Kept separate so menu screen stays focused.
const originalApp = App
function WrappedApp() {
  const [step, setStep] = useState('welcome'); const [customer, setCustomer] = useState({name:'',phone:''}); const [cart, setCart] = useState([])
  // This wrapper is intentionally replaced below by the integrated state variant.
  return null
}

export default function SolokBrewApp() {
  const [step, setStep] = useState('welcome'); const [customer, setCustomer] = useState({ name: '', phone: '' }); const [cart, setCart] = useState([]); const [category, setCategory] = useState('Semua'); const [notice, setNotice] = useState(''); const [orderNo, setOrderNo] = useState('')
  const totalItems = useMemo(() => cart.reduce((s, x) => s + x.quantity, 0), [cart]); const subtotal = useMemo(() => cart.reduce((s, x) => s + x.price * x.quantity, 0), [cart]); const filtered = category === 'Semua' ? menu : menu.filter(x => x.category === category)
  const add = item => { setCart(c => { const x = c.find(i => i.id === item.id); return x ? c.map(i => i.id === item.id ? {...i, quantity:i.quantity+1} : i) : [...c,{...item,quantity:1}] }); setNotice(`${item.name} ditambah ke troli`); setTimeout(() => setNotice(''), 1600) }
  const change = (id, delta) => setCart(c => c.map(i => i.id === id ? {...i,quantity:i.quantity+delta} : i).filter(i => i.quantity > 0))
  if (step === 'welcome') return <Welcome customer={customer} setCustomer={setCustomer} onSubmit={e => { e.preventDefault(); if (customer.name.trim() && customer.phone.trim().length >= 9) setStep('menu') }} />
  if (step === 'cart') return <Cart cart={cart} subtotal={subtotal} onChange={change} onBack={() => setStep('menu')} onCheckout={() => { setOrderNo(`SB-${Math.floor(1000 + Math.random()*9000)}`); setStep('receipt') }} />
  if (step === 'receipt') return <Receipt customer={customer} cart={cart} total={subtotal} orderNo={orderNo} onNewOrder={() => {setCart([]);setStep('menu')}} />
  return <main className="app-shell"><header className="topbar"><Brand /><button className="table-badge"><span>Meja</span>{tableFromUrl}</button></header><section className="greeting"><p>Hai, {customer.name.split(' ')[0]} <span>✦</span></p><h1>Apa yang anda mahu hari ini?</h1><small>Pesan dari meja anda. Bayar di kaunter selepas checkout.</small></section><nav className="category-tabs">{['Semua','Minuman','Makanan','Dessert'].map(tab => <button key={tab} className={category===tab?'active':''} onClick={() => setCategory(tab)}>{tab}</button>)}</nav><section className="menu-grid">{filtered.map(item => <article className="menu-card" key={item.id}><div className={`food-art ${item.tone}`}><span>{item.icon}</span></div><div className="card-copy"><p className="item-name">{item.name}</p><p className="item-note">{item.note}</p><div className="card-bottom"><strong>{money(item.price)}</strong><button className="add-button" onClick={() => add(item)}>+</button></div></div></article>)}</section>{notice && <div className="toast">✓ {notice}</div>}{totalItems>0 && <button className="cart-bar" onClick={() => setStep('cart')}><span className="cart-count">{totalItems}</span><span>Lihat troli</span><strong>{money(subtotal)} <b>›</b></strong></button>}</main>
}
