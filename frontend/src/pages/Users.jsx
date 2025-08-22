import React, { useEffect, useState } from 'react'
import api from '../services/api'
export default function Users(){
  const [rows,setRows]=useState([]); const [show,setShow]=useState(false); const [form,setForm]=useState({ username:'', password:'' })
  const load=async()=>{ const { data }=await api.get('/users'); setRows(data) }
  useEffect(()=>{ load(); },[])
  return (<div>
    <h2>User Maintenance</h2>
    <div className="card">
      <table className="table">
        <thead><tr><th>ID</th><th>Username</th><th>CreatedBy</th><th>Date</th><th></th></tr></thead>
        <tbody>{rows.map(r=>(<tr key={r.id}><td>{r.id}</td><td>{r.username}</td><td>{r.created_by}</td><td>{new Date(r.date_created).toLocaleString()}</td><td><button className="btn danger" onClick={async()=>{await api.delete('/users/'+r.id); load();}}>Delete</button></td></tr>))}</tbody>
      </table>
    </div>
    <button className="fab" onClick={()=>{setForm({ username:'', password:'' }); setShow(true)}}>+</button>
    {show && <Modal onClose={()=>setShow(false)}>
      <h3>New User</h3>
      <div className="row"><input placeholder="Username" value={form.username} onChange={e=>setForm({...form,username:e.target.value})}/></div>
      <div className="row"><input placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/></div>
      <div className="actions"><button className="btn" onClick={()=>setShow(false)}>Cancel</button><button className="btn primary" onClick={async()=>{ await api.post('/users', form); setShow(false); load(); }}>Save</button></div>
    </Modal>}
  </div>)
}
function Modal({children,onClose}){ return (<div className="modal-backdrop" onClick={onClose}><div className="modal" onClick={e=>e.stopPropagation()}>{children}</div></div>) }
