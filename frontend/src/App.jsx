import React, { useEffect, useState } from 'react'
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom'
import ItemMaintenance from './pages/ItemMaintenance'
import ItemDiscount from './pages/ItemDiscount'
import Transactions from './pages/Transactions'
import Receiving from './pages/Receiving'
import UOM from './pages/UOM'
import Users from './pages/Users'
import Reports from './pages/Reports'
import api from './services/api'

function App(){
  const [open, setOpen] = useState(true)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(()=>{
    const token = localStorage.getItem('token')
    if (!token) navigate('/login')
    else setUser({ username: localStorage.getItem('username') || 'admin' })
  },[])

  return (
    <div className="app">
      <aside className={open?'drawer':'drawer closed'}>
        <div className="brand">
          <div className="logo"></div>
          {open && <strong>Vendrix</strong>}
        </div>
        <div className="menu">
          <NavLink to="/" end>Items</NavLink>
          <NavLink to="/discounts">Discounts</NavLink>
          <NavLink to="/transactions">Transactions</NavLink>
          <NavLink to="/receiving">Receiving</NavLink>
          <NavLink to="/uom">UOM</NavLink>
          <NavLink to="/users">Users</NavLink>
          <NavLink to="/reports">Reports</NavLink>
        </div>
      </aside>
      <main className="main">
        <div className="topbar">
          <div className="title">Backoffice</div>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <button className="btn" onClick={()=>setOpen(!open)}>{open?'Hide':'Show'} Menu</button>
            <div className="user">{user? user.username : ''}</div>
          </div>
        </div>
        <div className="content">
          <Routes>
            <Route path="/" element={<ItemMaintenance/>}/>
            <Route path="/discounts" element={<ItemDiscount/>}/>
            <Route path="/transactions" element={<Transactions/>}/>
            <Route path="/receiving" element={<Receiving/>}/>
            <Route path="/uom" element={<UOM/>}/>
            <Route path="/users" element={<Users/>}/>
            <Route path="/reports" element={<Reports/>}/>
            <Route path="/login" element={<Login setUser={setUser}/>}/>
          </Routes>
        </div>
      </main>
    </div>
  )
}

function Login({ setUser }){
  const [username,setUsername]=useState('admin')
  const [password,setPassword]=useState('password')
  const navigate = useNavigate()
  const [err,setErr]=useState('')

  const submit=async(e)=>{
    e.preventDefault()
    try{
      const { data } = await api.post('/auth/login',{ username,password })
      localStorage.setItem('token', data.token)
      localStorage.setItem('username', data.user.username)
      setUser(data.user); navigate('/')
    }catch(e){ setErr('Invalid credentials') }
  }

  return (
    <div style={{display:'grid',placeItems:'center',height:'70vh'}}>
      <form onSubmit={submit} className="card" style={{minWidth:320}}>
        <h3>Login</h3>
        {err && <div style={{color:'var(--danger)'}}>{err}</div>}
        <div className="row"><input placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)}/></div>
        <div className="row"><input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)}/></div>
        <div className="actions"><button className="btn primary" type="submit">Login</button></div>
      </form>
    </div>
  )
}

export default App
