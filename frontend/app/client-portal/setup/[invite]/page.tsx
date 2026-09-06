"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function ClientSetupPage(){
  const {invite}=useParams<{invite:string}>(); const router=useRouter();
  const [password,setPassword]=useState(""),[confirm,setConfirm]=useState(""),[error,setError]=useState(""),[busy,setBusy]=useState(false),[show,setShow]=useState(false);
  const submit=async(e:React.FormEvent)=>{e.preventDefault();if(password!==confirm){setError("Passwords do not match.");return}setBusy(true);setError("");try{const {data}=await api.post("/client-portal/auth/setup/",{token:invite,password});router.replace(data.portal_url)}catch(problem:any){setError(problem.response?.data?.password||problem.response?.data?.detail||"Could not create password.")}finally{setBusy(false)}};
  return <main className="clientAuth"><form onSubmit={submit}><small>LENSPIRECRM · CLIENT PORTAL</small><h1>Create your password</h1><p>This invitation can be used only once.</p><label>New Password<input type={show?"text":"password"} minLength={10} required value={password} onChange={e=>setPassword(e.target.value)}/></label><label>Confirm Password<input type={show?"text":"password"} minLength={10} required value={confirm} onChange={e=>setConfirm(e.target.value)}/></label><label className="clientShowPassword"><input type="checkbox" checked={show} onChange={e=>setShow(e.target.checked)}/> Show password</label>{error&&<div className="error">{error}</div>}<button className="primary" disabled={busy}>{busy?"Creating…":"Create Password & Open Portal"}</button></form></main>
}
