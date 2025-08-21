import React,{useMemo,useState} from 'react'
import Modal from '../components/Modal.jsx'
const initial=[{id:1,when:'2025-08-12',itemno:'SKU001',description:'Keyboard',change:+50,type:'IN',ref:'PO#1001'},{id:2,when:'2025-08-13',itemno:'SKU002',description:'Mouse',change:-5,type:'OUT',ref:'SALE#2001'}]
export default function Transactions(){
  const [rows,setRows]=useState(initial)
  const [q,setQ]=useState(''); const [open,setOpen]=useState(false); const [editing,setEditing]=useState(null)
  const [form,setForm]=useState({when:'',itemno:'',description:'',change:0,type:'IN',ref:''})
  const filtered=useMemo(()=>rows.filter(r=>(r.itemno+r.description+r.ref).toLowerCase().includes(q.toLowerCase())),[q,rows])
  const startAdd=()=>{setEditing(null);setForm({when:new Date().toISOString().slice(0,10),itemno:'',description:'',change:0,type:'IN',ref:''});setOpen(true)}
  const startEdit=(row)=>{setEditing(row.id);setForm({...row});setOpen(true)}
  const save=(e)=>{e.preventDefault(); if(editing){setRows(rows.map(r=>r.id===editing?{...form,id:editing}:r))}else{setRows([{...form,id:Date.now()},...rows])} setOpen(false)}
  const remove=(id)=>{if(confirm('Delete this transaction?')) setRows(rows.filter(r=>r.id!==id))}
  return (<div className="space-y-4">
    <div className="bg-white dark:bg-gray-800 p-3 rounded shadow flex items-center gap-2"><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search transactions..." className="px-3 py-2 rounded border dark:bg-gray-900 flex-1"/></div>
    <div className="bg-white dark:bg-gray-800 p-3 rounded shadow"><table className="min-w-full text-sm"><thead><tr className="text-left text-gray-500 dark:text-gray-300"><th>Date</th><th>Item No</th><th>Description</th><th>Change</th><th>Type</th><th>Ref</th><th>Actions</th></tr></thead><tbody>{filtered.map(r=>(<tr key={r.id}><td>{r.when}</td><td>{r.itemno}</td><td>{r.description}</td><td className={r.change>0?'text-green-600':'text-red-600'}>{r.change}</td><td>{r.type}</td><td>{r.ref}</td><td className="space-x-2"><button onClick={()=>startEdit(r)} className="px-2 py-1 bg-yellow-500 text-white rounded">Edit</button><button onClick={()=>remove(r.id)} className="px-2 py-1 bg-red-600 text-white rounded">Delete</button></td></tr>))}{filtered.length===0&&<tr><td colSpan="7" className="text-center py-4 text-gray-500">No transactions</td></tr>}</tbody></table></div>
    <button className="fab" onClick={startAdd}>+</button>
    <Modal open={open} title={editing?'Edit Transaction':'Add Transaction'} onClose={()=>setOpen(false)}>
      <form onSubmit={save} className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input type="date" required value={form.when} onChange={e=>setForm({...form,when:e.target.value})} className="px-3 py-2 rounded border dark:bg-gray-900"/>
        <input required value={form.itemno} onChange={e=>setForm({...form,itemno:e.target.value})} placeholder="Item No" className="px-3 py-2 rounded border dark:bg-gray-900"/>
        <input required value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Description" className="px-3 py-2 rounded border dark:bg-gray-900"/>
        <input type="number" required value={form.change} onChange={e=>setForm({...form,change:parseInt(e.target.value||0)})} placeholder="Change (+/-)" className="px-3 py-2 rounded border dark:bg-gray-900"/>
        <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})} className="px-3 py-2 rounded border dark:bg-gray-900"><option>IN</option><option>OUT</option></select>
        <input value={form.ref} onChange={e=>setForm({...form,ref:e.target.value})} placeholder="Reference (PO#/Sale#)" className="px-3 py-2 rounded border dark:bg-gray-900"/>
        <div className="md:col-span-2 flex justify-end gap-2"><button type="button" onClick={()=>setOpen(false)} className="px-3 py-2 rounded border">Cancel</button><button className="px-3 py-2 bg-indigo-600 text-white rounded">{editing?'Update':'Save'}</button></div>
      </form>
    </Modal>
  </div>)}
