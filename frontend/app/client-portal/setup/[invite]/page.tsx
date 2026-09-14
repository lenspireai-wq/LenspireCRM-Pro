"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function ClientSetupPage(){
  const {invite}=useParams<{invite:string}>(); const router=useRouter();
  const [password,setPassword]=useState(""),[confirm,setConfirm]=useState(""),[error,setError]=useState(""),[busy,setBusy]=useState(false),[show,setShow]=useState(false);
  const submit=async(e:React.FormEvent)=>{e.preventDefault();if(password!==confirm){setError("PINs do not match.");return}setBusy(true);setError("");try{const {data}=await api.post("/client-portal/auth/setup/",{token:invite,password});router.replace(data.portal_url)}catch(problem:any){setError(problem.response?.data?.password||problem.response?.data?.detail||"Could not create PIN.")}finally{setBusy(false)}};
  return <main className="clientAuth"><form onSubmit={submit}><div className="clientAuthBrand"><img src="/ankit-studios-logo.png" alt="Ankit Studios" /><small>ANKIT STUDIOS · CLIENT PORTAL</small><span>Powered by LenspireCRM</span></div><h1>Create your 4-digit PIN</h1><p>This invitation can be used only once.</p><label>New PIN<input type={show?"text":"password"} inputMode="numeric" pattern="[0-9]{4}" maxLength={4} required value={password} onChange={e=>setPassword(e.target.value.replace(/\D/g,""))}/></label><label>Confirm PIN<input type={show?"text":"password"} inputMode="numeric" pattern="[0-9]{4}" maxLength={4} required value={confirm} onChange={e=>setConfirm(e.target.value.replace(/\D/g,""))}/></label><label className="clientShowPassword"><input type="checkbox" checked={show} onChange={e=>setShow(e.target.checked)}/> Show PIN</label>{error&&<div className="error">{error}</div>}<button className="primary" disabled={busy}>{busy?"Creating…":"Create PIN & Open Portal"}</button></form></main>
}
