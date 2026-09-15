'use client';
import { FormEvent, useState } from 'react';

const services = ['Meta Ads', 'Branding', 'Creative Production', 'AI Content', 'Multiple'];

export default function ContactPanel({open,onClose}:{open:boolean,onClose:()=>void}){
  const [done,setDone]=useState(false);
  const [service,setService]=useState('');
  const [sending,setSending]=useState(false);
  const [error,setError]=useState('');

  async function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault();
    if(!service){setError('Choose the service you need.');return;}
    setSending(true);setError('');
    const form=new FormData(e.currentTarget);
    try{
      const res=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
        name:form.get('name'),company:form.get('company'),email:form.get('email'),phone:form.get('phone'),service,description:form.get('description')
      })});
      const data=await res.json().catch(()=>({}));
      if(!res.ok) throw new Error(data.error||'We could not send your inquiry.');
      setDone(true);
    }catch(err){
      setError(err instanceof Error?err.message:'We could not send your inquiry. Please try again or message us on WhatsApp.');
    }finally{setSending(false);}
  }

  if(!open)return null;
  return <div className="contactOverlay"><button className="close" onClick={onClose}>CLOSE ×</button>{!done?<form onSubmit={submit}><span className="eyebrow">START A PROJECT</span><h2>Tell us what<br/>you’re building.</h2><div className="formGrid"><input name="name" required maxLength={120} placeholder="Your name"/><input name="company" maxLength={160} placeholder="Company (optional)"/><input name="email" required maxLength={254} type="email" placeholder="Email"/><input name="phone" maxLength={60} placeholder="Phone"/></div><div className="chips">{services.map(item=><button key={item} type="button" aria-pressed={service===item} onClick={()=>{setService(item);setError('')}} style={service===item?{background:'var(--ivory)',color:'var(--charcoal)'}:undefined}>{item}</button>)}</div><textarea name="description" required maxLength={5000} placeholder="Tell us briefly about the project."/>{error&&<p role="alert" style={{marginTop:'16px'}}>{error}</p>}<button className="submit" disabled={sending}>{sending?'SENDING…':'SEND PROJECT ↗'}</button></form>:<div className="success"><span className="eyebrow">RECEIVED</span><h2>WE’VE GOT IT.</h2><p>We’ll take a look and get back to you.</p><div className="successLinks"><a href="https://www.instagram.com/brand.lift.bl/" target="_blank" rel="noreferrer">Instagram ↗</a><a href="https://wa.me/201010298045" target="_blank" rel="noreferrer">WhatsApp ↗</a></div></div>}</div>
}
