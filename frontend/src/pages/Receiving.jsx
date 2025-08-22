import React, { useEffect, useState } from 'react'
import api from '../services/api'
export default function Receiving(){
  const [rows,setRows]=useState([]); const [q,setQ]=useState(''); const [from,setFrom]=useState(''); const [to,setTo]=useState('')
  const [show,setShow]=useState(false); const [form,setForm]=useState({ item_no:'', qty:1, reference_no:'', delivery_date:'' })
  const load=async()=>{ const { data }=await api.get('/receiving',{ params:{ q, from, to } }); setRows(data) }
  useEffect(()=>{ load(); },[])
  return (<div>
    <h2>Receiving</h2>
    <div className="searchbar"><input placeholder="Search" value={q} onChange={e=>setQ(e.target.value)}/><input type="date" value={from} onChange={e=>setFrom(e.target.value)} /><input type="date" value={to} onChange={e=>setTo(e.target.value)} /><button onClick={load}>Search</button></div>
    <div className="card">
      <table className="table">
        <thead><tr><th>ItemNo</th><th>Description</th><th>Qty</th><th>Reference#</th><th>DeliveryDate</th><th>ReceivedBy</th></tr></thead>
        <tbody>{rows.map(r=>(<tr key={r.id}><td>{r.item_no}</td><td>{r.description}</td><td>{r.qty}</td><td>{r.reference_no||''}</td><td>{r.delivery_date||''}</td><td>{r.received_by||''}</td></tr>))}</tbody>
      </table>
    </div>
    <button className="fab" onClick={()=>{setForm({ item_no:'', qty:1, reference_no:'', delivery_date:'' }); setShow(true)}}>+</button>
    {show && <Modal onClose={()=>setShow(false)}>
      <h3>New Receiving</h3>
      <div className="row"><input placeholder="Item No" value={form.item_no} onChange={e=>setForm({...form,item_no:e.target.value})}/></div>
      <div className="row"><input placeholder="Qty" type="number" value={form.qty} onChange={e=>setForm({...form,qty:e.target.value})}/></div>
      <div className="row"><input placeholder="Reference#" value={form.reference_no} onChange={e=>setForm({...form,reference_no:e.target.value})}/></div>
      <div className="row"><input type="date" value={form.delivery_date} onChange={e=>setForm({...form,delivery_date:e.target.value})}/></div>
      <div className="actions"><button className="btn" onClick={()=>setShow(false)}>Cancel</button><button className="btn primary" onClick={async()=>{ await api.post('/receiving', form); setShow(false); load(); }}>Save</button></div>
    </Modal>}
  </div>)
}
function Modal({children,onClose}){ return (<div className="modal-backdrop" onClick={onClose}><div className="modal" onClick={e=>e.stopPropagation()}>{children}</div></div>) }
