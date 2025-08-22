import React, { useEffect, useState } from 'react'
import api from '../services/api'
export default function ItemDiscount(){
  const [rows,setRows]=useState([]); const [q,setQ]=useState(''); const [show,setShow]=useState(false)
  const [form,setForm]=useState({ item_no:'', discount_amt:0, start_date:'', end_date:'' })
  const load=async()=>{ const { data }=await api.get('/discounts',{ params:{ q } }); setRows(data) }
  useEffect(()=>{ load(); },[])
  return (<div>
    <h2>Item Discount</h2>
    <div className="searchbar"><input placeholder="Search" value={q} onChange={e=>setQ(e.target.value)}/><button onClick={load}>Search</button></div>
    <div className="card">
      <table className="table">
        <thead><tr><th>ItemNo</th><th>Description</th><th>Discount</th><th>Start</th><th>End</th><th></th></tr></thead>
        <tbody>{rows.map(r=>(<tr key={r.id}><td>{r.item_no}</td><td>{r.item_description}</td><td>{Number(r.discount_amt).toFixed(2)}</td><td>{r.start_date}</td><td>{r.end_date}</td><td><button className="btn" onClick={()=>{setForm(r); setShow(true)}}>Edit</button></td></tr>))}</tbody>
      </table>
    </div>
    <button className="fab" onClick={()=>{setForm({ item_no:'', discount_amt:0, start_date:'', end_date:'' }); setShow(true)}}>+</button>
    {show && <Modal onClose={()=>setShow(false)}>
      <h3>{form?.id ? 'Edit Discount' : 'New Discount'}</h3>
      <div className="row"><input placeholder="Item No" value={form.item_no||''} onChange={e=>setForm({...form,item_no:e.target.value})}/></div>
      <div className="row"><input placeholder="Discount Amount" type="number" value={form.discount_amt||0} onChange={e=>setForm({...form,discount_amt:e.target.value})}/></div>
      <div className="row"><input type="date" value={form.start_date?.substring(0,10)||''} onChange={e=>setForm({...form,start_date:e.target.value})}/><input type="date" value={form.end_date?.substring(0,10)||''} onChange={e=>setForm({...form,end_date:e.target.value})}/></div>
      <div className="actions"><button className="btn" onClick={()=>setShow(false)}>Cancel</button><button className="btn primary" onClick={async()=>{ if (form.id) await api.put('/discounts/'+form.id, form); else await api.post('/discounts', form); setShow(false); load(); }}>Save</button></div>
    </Modal>}
  </div>)
}
function Modal({children,onClose}){ return (<div className="modal-backdrop" onClick={onClose}><div className="modal" onClick={e=>e.stopPropagation()}>{children}</div></div>) }
