import React, { useEffect, useState } from 'react'
import api from '../services/api'
export default function Transactions(){
  const [rows,setRows]=useState([]); const [q,setQ]=useState(''); const [from,setFrom]=useState(''); const [to,setTo]=useState('')
  const [show,setShow]=useState(false); const [form,setForm]=useState({ item_no:'', type:'IN', qty:1 })
  const load=async()=>{ const { data }=await api.get('/transactions',{ params:{ q, from, to } }); setRows(data) }
  useEffect(()=>{ load(); },[])
  return (<div>
    <h2>Transaction</h2>
    <div className="searchbar"><input placeholder="Search" value={q} onChange={e=>setQ(e.target.value)}/><input type="date" value={from} onChange={e=>setFrom(e.target.value)} /><input type="date" value={to} onChange={e=>setTo(e.target.value)} /><button onClick={load}>Search</button></div>
    <div className="card">
      <table className="table">
        <thead><tr><th>ItemNo</th><th>Description</th><th>Type</th><th>Qty</th><th>Date</th></tr></thead>
        <tbody>{rows.map(r=>(<tr key={r.id}><td>{r.item_no}</td><td>{r.item_description}</td><td><span className={r.type==='IN'?'badge in':'badge out'}>{r.type}</span></td><td>{r.qty}</td><td>{new Date(r.date_created).toLocaleString()}</td></tr>))}</tbody>
      </table>
    </div>
    <button className="fab" onClick={()=>{setForm({ item_no:'', type:'IN', qty:1 }); setShow(true)}}>+</button>
    {show && <Modal onClose={()=>setShow(false)}>
      <h3>New Transaction</h3>
      <div className="row"><input placeholder="Item No" value={form.item_no} onChange={e=>setForm({...form,item_no:e.target.value})}/></div>
      <div className="row"><select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}><option>IN</option><option>OUT</option></select><input type="number" value={form.qty} onChange={e=>setForm({...form,qty:e.target.value})}/></div>
      <div className="actions"><button className="btn" onClick={()=>setShow(false)}>Cancel</button><button className="btn primary" onClick={async()=>{ await api.post('/transactions', form); setShow(false); load(); }}>Save</button></div>
    </Modal>}
  </div>)
}
function Modal({children,onClose}){ return (<div className="modal-backdrop" onClick={onClose}><div className="modal" onClick={e=>e.stopPropagation()}>{children}</div></div>) }
