import React from 'react'
const stats=[{title:'Total Items',value:128},{title:'Low Stock',value:6},{title:'Total Transactions (30d)',value:342}]
export default function Dashboard(){return (<div className="space-y-6">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{stats.map(s=>(<div key={s.title} className="p-4 bg-white dark:bg-gray-800 rounded shadow flex flex-col"><div className="text-sm text-gray-500 dark:text-gray-300">{s.title}</div><div className="text-2xl font-bold">{s.value}</div></div>))}</div>
  <div className="bg-white dark:bg-gray-800 p-4 rounded shadow"><h3 className="font-semibold mb-2">Recent Transactions</h3><table className="min-w-full text-sm"><thead><tr className="text-left text-gray-500 dark:text-gray-300"><th>When</th><th>Item</th><th>Change</th><th>Ref</th></tr></thead><tbody><tr><td>2025-08-12</td><td>Keyboard (SKU001)</td><td className="text-green-600">+50</td><td>PO#1001</td></tr><tr><td>2025-08-13</td><td>Mouse (SKU002)</td><td className="text-red-600">-5</td><td>SALE#2001</td></tr></tbody></table></div>
</div>)}
