import React, { useEffect, useState } from 'react'
import api from '../services/api'
export default function UOM(){
  const [rows,setRows]=useState([]); const [q,setQ]=useState(''); const [show,setShow]=useState(false); const [form,setForm]=useState({ id:null, description:'' })
  const load=async()=>{ const { data } = await api.get('/uom'); setRows(data) }
  useEffect(()=>{ load(); },[])
  return (<div>
    <h2>UOM</h2>
    <div className="searchbar"><input placeholder="Search" value={q} onChange={e=>setQ(e.target.value)}/></div>
    <div className="card">
      <table className="table">
        <thead><tr><th>No.</th><th>Description</th><th>CreatedBy</th><th>Date</th><th></th></tr></thead>
        <tbody>{rows.filter(r=>r.description.toLowerCase().includes(q.toLowerCase())).map(r=>(<tr key={r.id}><td>{r.id}</td><td>{r.description}</td><td>{r.created_by}</td><td>{new Date(r.date_created).toLocaleString()}</td><td><button className="btn" onClick={()=>{setForm(r); setShow(true)}}>Edit</button></td></tr>))}</tbody>
      </table>
    </div>
    <button className="fab" onClick={()=>{setForm({ id:null, description:'' }); setShow(true)}}>+</button>
    {show && <Modal onClose={()=>setShow(false)}>
      <h3>{form.id? 'Edit UOM':'New UOM'}</h3>
      <div className="row"><input placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></div>
      <div className="actions"><button className="btn" onClick={()=>setShow(false)}>Cancel</button><button className="btn primary" onClick={async()=>{ if (form.id) await api.put('/uom/'+form.id, { description: form.description }); else await api.post('/uom', { description: form.description }); setShow(false); load(); }}>Save</button></div>
    </Modal>}
  </div>)
}
function Modal({children,onClose}){ return (<div className="modal-backdrop" onClick={onClose}><div className="modal" onClick={e=>e.stopPropagation()}>{children}</div></div>) }
