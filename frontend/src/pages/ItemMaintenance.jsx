import React,{useMemo,useState} from 'react'
import Modal from '../components/Modal.jsx'
const initial=[{id:1,itemno:'SKU001',description:'Keyboard',unit:'pc',price:450,quantity:45},{id:2,itemno:'SKU002',description:'Mouse',unit:'pc',price:250,quantity:100}]
export default function ItemMaintenance(){
  const [items,setItems]=useState(initial)
  const [q,setQ]=useState(''); const [open,setOpen]=useState(false); const [editing,setEditing]=useState(null)
  const [form,setForm]=useState({itemno:'',description:'',unit:'pc',price:0,quantity:0})
  const filtered=useMemo(()=>items.filter(i=>(i.itemno+i.description).toLowerCase().includes(q.toLowerCase())),[q,items])
  const startAdd=()=>{setEditing(null);setForm({itemno:'',description:'',unit:'pc',price:0,quantity:0});setOpen(true)}
  const startEdit=(it)=>{setEditing(it.id);setForm({...it});setOpen(true)}
  const save=(e)=>{e.preventDefault(); if(editing){setItems(items.map(i=>i.id===editing?{...form,id:editing}:i))}else{setItems([{...form,id:Date.now()},...items])} setOpen(false)}
  const remove=(id)=>{if(confirm('Delete this item?')) setItems(items.filter(i=>i.id!==id))}
  return (<div className="space-y-4">
    <div className="bg-white dark:bg-gray-800 p-3 rounded shadow flex items-center gap-2"><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search items..." className="px-3 py-2 rounded border dark:bg-gray-900 flex-1"/></div>
    <div className="bg-white dark:bg-gray-800 p-3 rounded shadow"><table className="min-w-full text-sm"><thead><tr className="text-left text-gray-500 dark:text-gray-300"><th>Item No</th><th>Description</th><th>Unit</th><th>Price</th><th>Qty</th><th>Actions</th></tr></thead><tbody>{filtered.map(i=>(<tr key={i.id}><td>{i.itemno}</td><td>{i.description}</td><td>{i.unit}</td><td>{i.price}</td><td>{i.quantity}</td><td className="space-x-2"><button onClick={()=>startEdit(i)} className="px-2 py-1 bg-yellow-500 text-white rounded">Edit</button><button onClick={()=>remove(i.id)} className="px-2 py-1 bg-red-600 text-white rounded">Delete</button></td></tr>))}{filtered.length===0&&<tr><td colSpan="6" className="text-center py-4 text-gray-500">No items</td></tr>}</tbody></table></div>
    <button className="fab" onClick={startAdd}>+</button>
    <Modal open={open} title={editing?'Edit Item':'Add Item'} onClose={()=>setOpen(false)}>
      <form onSubmit={save} className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input required value={form.itemno} onChange={e=>setForm({...form,itemno:e.target.value})} placeholder="Item No" className="px-3 py-2 rounded border dark:bg-gray-900"/>
        <input required value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Description" className="px-3 py-2 rounded border dark:bg-gray-900"/>
        <input required value={form.unit} onChange={e=>setForm({...form,unit:e.target.value})} placeholder="Unit" className="px-3 py-2 rounded border dark:bg-gray-900"/>
        <input type="number" required value={form.price} onChange={e=>setForm({...form,price:parseFloat(e.target.value||0)})} placeholder="Price" className="px-3 py-2 rounded border dark:bg-gray-900"/>
        <input type="number" required value={form.quantity} onChange={e=>setForm({...form,quantity:parseInt(e.target.value||0)})} placeholder="Quantity" className="px-3 py-2 rounded border dark:bg-gray-900"/>
        <div className="md:col-span-2 flex justify-end gap-2"><button type="button" onClick={()=>setOpen(false)} className="px-3 py-2 rounded border">Cancel</button><button className="px-3 py-2 bg-indigo-600 text-white rounded">{editing?'Update':'Save'}</button></div>
      </form>
    </Modal>
  </div>)}
