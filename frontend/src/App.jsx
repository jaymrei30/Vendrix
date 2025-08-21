import React,{useState} from 'react'
import Header from './components/Header.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ItemMaintenance from './pages/ItemMaintenance.jsx'
import Transactions from './pages/Transactions.jsx'
import Reports from './pages/Reports.jsx'
import ImportItems from './pages/ImportItems.jsx'
export default function App(){
  const [page,setPage]=useState('dashboard')
  const [sidebarOpen,setSidebarOpen]=useState(false)
  return (<div className="min-h-screen flex">
    <aside className={(sidebarOpen?'translate-x-0':'-translate-x-full md:translate-x-0')+' fixed z-20 inset-y-0 left-0 transform bg-white dark:bg-gray-800 w-64 p-4 shadow-lg transition-transform duration-200'}>
      <nav className="space-y-2">
        {[['dashboard','Dashboard'],['maintenance','Item Maintenance'],['transactions','Transactions'],['reports','Reports'],['import','Import Items']].map(([key,label])=>(
          <button key={key} className={'w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 '+(page===key?'bg-gray-100 dark:bg-gray-700':'')} onClick={()=>{setPage(key);setSidebarOpen(false)}}>{label}</button>
        ))}
      </nav>
    </aside>
    <div className="flex-1 md:pl-64">
      <Header onToggleSidebar={()=>setSidebarOpen(!sidebarOpen)}/>
      <main className="p-4 space-y-6">
        {page==='dashboard'&&<Dashboard/>}
        {page==='maintenance'&&<ItemMaintenance/>}
        {page==='transactions'&&<Transactions/>}
        {page==='reports'&&<Reports/>}
        {page==='import'&&<ImportItems/>}
      </main>
    </div>
  </div>)}
