"use client";
import { useEffect, useRef, useState } from "react";
import type { Roll } from "@/lib/game";
import "./board-animation.css";
import { boardCoordinates, LADDERS, SNAKES } from "@/lib/board";
const point=(n:number)=>{const p=boardCoordinates(n);return{x:p.column*70+35,y:p.row*70+35}};
type Spot = {x:number; y:number} | null;
const spot=(n:number):Spot => n ? point(n) : null;
export function Board({positions,username,playerColour,lastRoll,onAnimationChange}:{positions:{child:number;bot:number};username:string;playerColour:string;lastRoll?:Roll;onAnimationChange?:(running:boolean)=>void}){
 const [shown,setShown]=useState<Record<"child"|"bot",Spot>>(()=>({child:spot(positions.child),bot:spot(positions.bot)}));
 const [hopCount,setHopCount]=useState(0);
 const [motion,setMotion]=useState<"hop"|"slide"|"climb"|"still">("still");
 const previous=useRef(lastRoll ? `${lastRoll.at}:${lastRoll.actor}:${lastRoll.from}:${lastRoll.to}` : "");
 const key=lastRoll ? `${lastRoll.at}:${lastRoll.actor}:${lastRoll.from}:${lastRoll.to}` : "";
 useEffect(()=>{
  if(!lastRoll || key===previous.current)return;
  previous.current=key;
  const {actor,from,landed,to,jump}=lastRoll;
  if(window.matchMedia("(prefers-reduced-motion: reduce)").matches || landed===from){setShown({child:spot(positions.child),bot:spot(positions.bot)});onAnimationChange?.(false);return;}
  onAnimationChange?.(true);
  const timers:ReturnType<typeof setTimeout>[]=[];
  const schedule=(delay:number,fn:()=>void)=>timers.push(setTimeout(fn,delay));
  let elapsed=0;
  setShown(current=>({...current,[actor]:spot(from || 1)}));
  for(let n=from+1;n<=landed;n++){
   elapsed+=220;
   const square=n;
   schedule(elapsed,()=>{setMotion("hop");setHopCount(n=>n+1);setShown(current=>({...current,[actor]:spot(square)}));});
  }
  if(jump){
   elapsed+=230;
   const start=point(landed),end=point(to);
   if(jump==="snake"){
    const i=Object.keys(SNAKES).findIndex(n=>Number(n)===landed),bend=i%2===0?45:-45;
    for(let step=1;step<=20;step++){
     const t=step/20,u=1-t;
     const x=u*u*u*start.x+3*u*u*t*(start.x+bend)+3*u*t*t*(end.x-bend)+t*t*t*end.x;
     const y=u*u*u*start.y+3*u*u*t*(start.y+45)+3*u*t*t*(end.y-50)+t*t*t*end.y;
     elapsed+=40;schedule(elapsed,()=>{setMotion("slide");setShown(current=>({...current,[actor]:{x,y}}));});
    }
   }else{
    elapsed+=850;schedule(elapsed-850,()=>{setMotion("climb");setShown(current=>({...current,[actor]:end}));});
   }
  }
  schedule(elapsed+250,()=>{setMotion("still");setShown({child:spot(positions.child),bot:spot(positions.bot)});onAnimationChange?.(false)});
  return()=>{timers.forEach(clearTimeout);onAnimationChange?.(false)};
 },[key]);

 return <div className="board-wrap"><div className="board-topline"><span><i className="player-dot" style={{backgroundColor:playerColour}}/> You</span><span><i className="pip-dot"/> Pip</span></div><div className="board" role="img" aria-label={`Snakes and ladders board. You are on ${positions.child===0?"start":`square ${positions.child}`}. Pip is on ${positions.bot===0?"start":`square ${positions.bot}`}. Finish at 49.`}>
  <div className="board-grid" aria-hidden="true">{Array.from({length:49},(_,i)=>{const row=Math.floor(i/7),col=i%7;const fromBottom=6-row;const n=fromBottom*7+(fromBottom%2===0?col:6-col)+1;return <div key={n} className={`board-cell cell-${(row+col)%3} ${n===49?"finish-cell":""}`}><span>{n}</span>{n===49&&<b className="finish-flag" aria-label="Finish">⚑</b>}{n===1&&<small>Start</small>}</div>})}</div>
  <svg className="board-paths" viewBox="0 0 490 490" aria-hidden="true">
   {Object.entries(LADDERS).map(([a,b])=>{const p=point(+a),q=point(b),dx=q.x-p.x,dy=q.y-p.y,l=Math.hypot(dx,dy),nx=-dy/l*9,ny=dx/l*9;const steps=Math.max(3,Math.round(l/22));return <g key={a} strokeLinecap="round"><path d={`M${p.x+nx},${p.y+ny}L${q.x+nx},${q.y+ny}M${p.x-nx},${p.y-ny}L${q.x-nx},${q.y-ny}`} stroke="#B48145" strokeWidth="5"/>{Array.from({length:steps},(_,i)=>{const t=(i+.5)/steps;return <path key={i} d={`M${p.x+dx*t+nx},${p.y+dy*t+ny}L${p.x+dx*t-nx},${p.y+dy*t-ny}`} stroke="#D4A365" strokeWidth="4"/>})}</g>})}
   {Object.entries(SNAKES).map(([a,b],i)=>{const p=point(+a),q=point(b),bend=i%2===0?45:-45;const d=`M${p.x},${p.y}C${p.x+bend},${p.y+45} ${q.x-bend},${q.y-50} ${q.x},${q.y}`;return <g key={a}><path d={d} fill="none" stroke={i%2===0?"#6DAB92":"#9B80BE"} strokeWidth="12" strokeLinecap="round"/><path d={d} fill="none" stroke="#FFFFFF" strokeOpacity=".45" strokeWidth="3" strokeDasharray="2 12" strokeLinecap="round"/><path d={`M${p.x-8} ${p.y+5} Q${p.x-14} ${p.y-4} ${p.x-8} ${p.y-10} Q${p.x} ${p.y-17} ${p.x+9} ${p.y-10} L${p.x+14} ${p.y-5} Q${p.x+15} ${p.y} ${p.x+9} ${p.y+3} Q${p.x} ${p.y+8} ${p.x-8} ${p.y+5}Z`} fill={i%2===0?"#6DAB92":"#9B80BE"} stroke={i%2===0?"#4F8872":"#8067A2"} strokeWidth="1.5"/><circle cx={p.x+4} cy={p.y-7} r="2" fill="#26394A"/><circle cx={p.x+4.5} cy={p.y-7.5} r=".6" fill="#fff"/><path d={`M${p.x+13} ${p.y-3} l5 1 m0 0 3-2 m-3 2 3 2`} fill="none" stroke="#C77278" strokeWidth="1.4" strokeLinecap="round"/></g>})}
  </svg>
  {(["child","bot"] as const).map(actor=>{const p=shown[actor];if(!p)return null;const shared=positions.child===positions.bot;const moving=lastRoll?.actor===actor?motion:"still";return <div key={actor} className={`board-token token-${actor} ${shared?"shared-token":""} motion-${moving}`} style={{left:`${p.x/490*100+(shared?(actor==="child"?-2.2:2.2):0)}%`,top:`${(p.y+8.4)/490*100}%`,...(actor==="child"?{backgroundColor:playerColour}:{})}} aria-hidden="true"><span key={moving==="hop"?hopCount:"still"}>{actor==="child"?"✦":"●"}</span></div>})}
 </div><div className="board-bottomline"><span>Climb the ladders. Slide down the snakes.</span><span>Finish on 49 <span aria-hidden="true">⚑</span></span></div></div>
}
