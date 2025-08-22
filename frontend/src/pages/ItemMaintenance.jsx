import React, { useEffect, useState } from 'react'
import api from '../services/api'

export default function ItemMaintenance(){
  const [rows,setRows]=useState([])
  const [q,setQ]=useState('')
  const [show,setShow]=useState(false)
  const [form,setForm]=useState({ item_no:'', description:'', unit_price:0, uom_id:'', qty_available:0 })
  const [uoms,setUoms]=useState([])

  const load=async()=>{
    const { data } = await api.get('/items', { params:{ q } })
    setRows(data)
  }
  const loadUOM=async()=>{
    const { data } = await api.get('/uom')
    setUoms(data)
  }
  useEffect(()=>{ load(); loadUOM(); },[])

  return (<div>
    <h2>Item Maintenance</h2>
    <div className="searchbar">
      <input placeholder="Search" value={q} onChange={e=>setQ(e.target.value)}/>
      <button onClick={load}>Search</button>
    </div>
    <div className="card">
      <table className="table">
        <thead><tr><th>ItemNo</th><th>Description</th><th>UnitPrice</th><th>UOM</th><th>QtyAvailable</th><th></th></tr></thead>
        <tbody>
          {rows.map(r=>(
            <tr key={r.item_no}>
              <td>{r.item_no}</td><td>{r.description}</td><td>{Number(r.unit_price).toFixed(2)}</td><td>{r.uom||''}</td><td>{r.qty_available}</td>
              <td><button className="btn" onClick={()=>{setForm({ ...r }); setShow(true)}}>Edit</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <button className="fab" onClick={()=>{setForm({ item_no:'', description:'', unit_price:0, uom_id:'', qty_available:0 }); setShow(true)}}>+</button>
    {show && <Modal onClose={()=>setShow(false)}>
      <h3>{form?.item_no ? 'Edit Item' : 'New Item'}</h3>
      <div className="row"><input placeholder="Item No" value={form.item_no} onChange={e=>setForm({...form,item_no:e.target.value})} disabled={!!rows.find(r=>r.item_no===form.item_no)}/></div>
      <div className="row"><input placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></div>
      <div className="row"><input placeholder="Unit Price" type="number" value={form.unit_price} onChange={e=>setForm({...form,unit_price:e.target.value})}/></div>
      <div className="row">
        <select value={form.uom_id||''} onChange={e=>setForm({...form,uom_id:e.target.value})}>
          <option value="">Select UOM</option>
          {uoms.map(u=><option key={u.id} value={u.id}>{u.description}</option>)}
        </select>
        <input placeholder="Qty Available" type="number" value={form.qty_available} onChange={e=>setForm({...form,qty_available:e.target.value})}/>
      </div>
      <div className="actions">
        <button className="btn" onClick={()=>setShow(false)}>Cancel</button>
        <button className="btn primary" onClick={async()=>{
          if (rows.find(r=>r.item_no===form.item_no)) await api.put('/items/'+form.item_no, form);
          else await api.post('/items', form);
          setShow(false); load();
        }}>Save</button>
      </div>
    </Modal>}
  </div>)
}
function Modal({children,onClose}){ return (<div className="modal-backdrop" onClick={onClose}><div className="modal" onClick={e=>e.stopPropagation()}>{children}</div></div>) }
