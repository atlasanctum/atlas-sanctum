import React, {useEffect, useState} from 'react'

export default function App(){
  const [health, setHealth] = useState(null)
  useEffect(()=>{
    fetch('/health').then(r=>r.json()).then(setHealth).catch(()=>setHealth({status:'unreachable'}))
  },[])

  return (
    <div style={{fontFamily:'system-ui,Arial',padding:24}}>
      <h1>Atlas Sanctum — MVP Frontend</h1>
      <p>Backend health: {health ? health.status : 'loading...'}</p>
      <ul>
        <li><a href="/api/auth/login">Auth (login)</a></li>
        <li><a href="/api/assets">Assets</a></li>
        <li><a href="/api/marketplace/listings">Marketplace Listings</a></li>
      </ul>
    </div>
  )
}
