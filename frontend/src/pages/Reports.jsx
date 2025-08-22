import React, { useEffect, useState } from 'react'
import api from '../services/api'
export default function Reports(){
  const [rows,setRows]=useState([])
  const load=async()=>{ const { data } = await api.get('/reports/inventory'); setRows(data) }
  useEffect(()=>{ load(); },[])
  return (<div>
    <h2>Reports</h2>
    <div className="card">
      <div className="actions" style={{justifyContent:'space-between'}}>
        <div>Current Stock Preview</div>
        <a className="btn primary" href="/api/reports/inventory/export" target="_blank" rel="noreferrer">Export to Excel</a>
      </div>
      <table className="table" style={{marginTop:8}}>
        <thead><tr><th>ItemNo</th><th>Description</th><th>CurrentStock</th></tr></thead>
        <tbody>{rows.map((r,i)=>(<tr key={i}><td>{r.item_no}</td><td>{r.description}</td><td>{r.current_stock}</td></tr>))}</tbody>
      </table>
    </div>
  </div>)
}
