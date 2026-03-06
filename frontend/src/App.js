// App.js — DermaAI: Full-featured skin analysis
import React, { useState, useRef, useEffect, useCallback } from 'react';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const LS = {
  get: (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

// ── FACE DETECTION ──
function useFaceDetection(videoRef, isActive) {
  const [hasFace, setHasFace] = useState(false);
  const [facePos, setFacePos] = useState('none');
  const [faceBox, setFaceBox] = useState(null);
  const [headAngle, setHeadAngle] = useState('center');
  const detRef = useRef(null);
  const native = useRef(false);

  useEffect(() => {
    if (!isActive) { setHasFace(false); setFacePos('none'); return; }
    if (window.FaceDetector) { try { detRef.current = new window.FaceDetector({ fastMode:true, maxDetectedFaces:1 }); native.current=true; } catch { native.current=false; } }
    const detect = async () => {
      const v = videoRef.current;
      if (!v || v.readyState !== 4) return;
      try {
        if (detRef.current && native.current) {
          const faces = await detRef.current.detect(v);
          if (faces.length > 0) {
            const f=faces[0].boundingBox, vw=v.videoWidth, vh=v.videoHeight;
            const cx=(f.x+f.width/2)/vw, cy=(f.y+f.height/2)/vh, ratio=f.width/vw;
            setHasFace(true); setFaceBox({cx,cy,ratio});
            setFacePos(ratio>0.65?'too-close':ratio<0.08?'too-far':'centered');
            setHeadAngle(cx<0.32?'turned-right':cx>0.68?'turned-left':cx<0.42?'slight-right':cx>0.58?'slight-left':'center');
          } else { setHasFace(false); setFacePos('none'); setFaceBox(null); setHeadAngle('center'); }
        } else {
          const c=document.createElement('canvas'); c.width=120; c.height=90;
          const ctx=c.getContext('2d'); ctx.drawImage(v,0,0,120,90);
          const d=ctx.getImageData(20,10,80,70); let skin=0;
          for(let i=0;i<d.data.length;i+=16){const r=d.data[i],g=d.data[i+1],b=d.data[i+2];if(r>50&&g>25&&b>10&&r>g&&(r-b)>8)skin++;}
          const detected=skin/(d.data.length/16)>0.08;
          setHasFace(detected); setFacePos(detected?'centered':'none');
          setFaceBox(detected?{cx:0.5,cy:0.45,ratio:0.3}:null);
          if(detected){const ld=ctx.getImageData(10,15,40,60),rd=ctx.getImageData(70,15,40,60);let ls=0,rs=0;for(let i=0;i<ld.data.length;i+=16){if(ld.data[i]>50&&ld.data[i+1]>25&&ld.data[i]>ld.data[i+1])ls++;}for(let i=0;i<rd.data.length;i+=16){if(rd.data[i]>50&&rd.data[i+1]>25&&rd.data[i]>rd.data[i+1])rs++;}const lp=ls/((ls+rs)||1);setHeadAngle(lp>0.62?'slight-right':lp<0.38?'slight-left':'center');}else setHeadAngle('center');
        }
      } catch{}
    };
    const iv=setInterval(detect,400); return()=>clearInterval(iv);
  }, [isActive, videoRef]);
  return { hasFace, facePos, faceBox, headAngle };
}

// ── FACE GUIDE ──
function FaceGuide({hasFace,facePos,targetAngle,faceBox,canCapture}){
  const color=!hasFace?'#ef4444':canCapture?'#22c55e':'#f59e0b';
  const msg=!hasFace?'Position your face in frame':facePos==='too-close'?'Move back':facePos==='too-far'?'Come closer':canCapture?'Ready! Tap capture':targetAngle==='left'?'Turn head LEFT':targetAngle==='right'?'Turn head RIGHT':'Face the camera';
  const ox=faceBox?(faceBox.cx-0.5)*35:0, oy=faceBox?(faceBox.cy-0.45)*25:0;
  const sc=faceBox?Math.min(Math.max(faceBox.ratio/0.28,0.8),1.25):1;
  return(
    <div className="face-guide">
      <svg viewBox="0 0 300 380" className={`guide-svg ${canCapture?'ready':''}`} style={{transform:`translate(${ox}px,${oy}px) scale(${sc})`,transition:'transform .25s ease-out'}}>
        <defs><filter id="gl"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
        <ellipse cx="150" cy="155" rx="78" ry="102" fill="none" stroke={color} strokeWidth={canCapture?3:1.8} strokeDasharray={canCapture?'none':'10,7'} opacity={canCapture?1:0.45} filter={canCapture?'url(#gl)':'none'} style={{transition:'all .35s'}}/>
        {targetAngle==='front'&&<g opacity="0.15" stroke={color} strokeWidth="0.7"><line x1="150" y1="70" x2="150" y2="240"/><line x1="78" y1="155" x2="222" y2="155"/></g>}
        {targetAngle==='left'&&<g opacity={canCapture?0.9:0.5}><path d="M82 105Q52 155 82 210" fill="none" stroke={color} strokeWidth="2.5" strokeDasharray={canCapture?'none':'5,4'}/><polygon points="77,103 87,103 82,90" fill={color}/><text x="36" y="162" fill={color} fontSize="16" fontWeight="700">45°</text></g>}
        {targetAngle==='right'&&<g opacity={canCapture?0.9:0.5}><path d="M218 105Q248 155 218 210" fill="none" stroke={color} strokeWidth="2.5" strokeDasharray={canCapture?'none':'5,4'}/><polygon points="213,103 223,103 218,90" fill={color}/><text x="245" y="162" fill={color} fontSize="16" fontWeight="700">45°</text></g>}
        {canCapture&&<ellipse cx="150" cy="155" rx="88" ry="112" fill="none" stroke={color} strokeWidth="1" opacity="0.35"><animate attributeName="rx" values="86;93;86" dur="2.2s" repeatCount="indefinite"/><animate attributeName="ry" values="110;117;110" dur="2.2s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.35;0.08;0.35" dur="2.2s" repeatCount="indefinite"/></ellipse>}
      </svg>
      <div className={`guide-msg ${canCapture?'ok':!hasFace?'err':'warn'}`}><span>{msg}</span></div>
    </div>
  );
}

// ── COMPARE SLIDER ──
function CompareSlider({imgBefore,imgAfter,labelBefore,labelAfter}){
  const [pos,setPos]=useState(50); const ref=useRef(null); const drag=useRef(false);
  const upd=useCallback((e)=>{if(!ref.current)return;const r=ref.current.getBoundingClientRect();const cx=e.touches?e.touches[0].clientX:e.clientX;setPos(Math.max(0,Math.min(100,((cx-r.left)/r.width)*100)));}, []);
  useEffect(()=>{const up=()=>{drag.current=false;};const mv=(e)=>{if(drag.current){e.preventDefault();upd(e);}};window.addEventListener('mouseup',up);window.addEventListener('mousemove',mv);window.addEventListener('touchend',up);window.addEventListener('touchmove',mv,{passive:false});return()=>{window.removeEventListener('mouseup',up);window.removeEventListener('mousemove',mv);window.removeEventListener('touchend',up);window.removeEventListener('touchmove',mv);};},[upd]);
  return(
    <div className="compare-slider" ref={ref} onMouseDown={e=>{drag.current=true;upd(e);}} onTouchStart={e=>{drag.current=true;upd(e);}}>
      <img src={imgAfter} alt="After" className="compare-img"/>
      <div className="compare-clip" style={{width:`${pos}%`}}><img src={imgBefore} alt="Before" className="compare-img"/></div>
      <div className="compare-line" style={{left:`${pos}%`}}><div className="compare-handle">| |</div></div>
      <span className="compare-label cl-before">{labelBefore}</span>
      <span className="compare-label cl-after">{labelAfter}</span>
    </div>
  );
}

// ── SCORE CHART ──
function ScoreChart({history}){
  if(!history||history.length<2)return null;
  const scores=history.slice(-10).map(h=>h.score);
  const min=Math.min(...scores)-5, max=Math.max(...scores)+5, range=max-min||1;
  const w=280,h=80,pad=10;
  const pts=scores.map((s,i)=>{const x=pad+(i/(scores.length-1))*(w-pad*2);const y=h-pad-((s-min)/range)*(h-pad*2);return`${x},${y}`;});
  const line=pts.join(' ');
  const area=`${pad},${h-pad} ${line} ${pad+((scores.length-1)/(scores.length-1))*(w-pad*2)},${h-pad}`;
  return(
    <div className="score-chart">
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
        <defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--accent)" stopOpacity="0.3"/><stop offset="100%" stopColor="var(--accent)" stopOpacity="0"/></linearGradient></defs>
        <polygon points={area} fill="url(#cg)"/>
        <polyline points={line} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        {pts.map((p,i)=>{const[x,y]=p.split(',');return <circle key={i} cx={x} cy={y} r="3" fill="var(--accent)" stroke="var(--card)" strokeWidth="1.5"/>;})}
      </svg>
      <div className="chart-labels">{history.slice(-10).map((h,i)=>(<span key={i} className="chart-date">{new Date(h.date).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</span>))}</div>
    </div>
  );
}

// ── PRODUCT CARD ──
function ProductCard({product}){
  const colors={cleanser:{bg:'#dbeafe',fg:'#1d4ed8'},serum:{bg:'#fce7f3',fg:'#be185d'},moisturizer:{bg:'#dcfce7',fg:'#15803d'},sunscreen:{bg:'#fef3c7',fg:'#b45309'},treatment:{bg:'#e0e7ff',fg:'#4338ca'},exfoliant:{bg:'#fee2e2',fg:'#b91c1c'}};
  const tc=colors[product.type?.toLowerCase()]||colors.treatment;
  return(
    <div className="product-card">
      <div className="product-type" style={{background:tc.bg,color:tc.fg}}>{product.type}</div>
      <h4>{product.name}</h4>
      <p className="product-key">{product.keyIngredient}</p>
      <p className="product-why">{product.purpose}</p>
      <div className="product-meta"><span>{product.frequency}</span>{product.when&&<span>{product.when}</span>}</div>
    </div>
  );
}

// ══════════════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════════════
function App(){
  const [theme,setTheme]=useState(LS.get('derma-theme','dark'));
  const [step,setStep]=useState('intro');
  const [images,setImages]=useState({});
  const [curAngle,setCurAngle]=useState('front');
  const [quality,setQuality]=useState(null);
  const [analysis,setAnalysis]=useState(null);
  const [error,setError]=useState(null);
  const [camReady,setCamReady]=useState(false);
  const [aStep,setAStep]=useState(0);
  const [pdfLoading,setPdfLoading]=useState(false);
  const [overrideReady,setOverrideReady]=useState(false);
  const [history,setHistory]=useState(LS.get('derma-history',[]));
  const [showHistory,setShowHistory]=useState(false);
  const [compareA,setCompareA]=useState(null);
  const [compareB,setCompareB]=useState(null);
  const [showCompare,setShowCompare]=useState(false);
  const [activeTab,setActiveTab]=useState('overview');

  const overTimer=useRef(null);
  const vidRef=useRef(null);
  const canRef=useRef(null);
  const stmRef=useRef(null);

  const {hasFace,facePos,faceBox,headAngle}=useFaceDetection(vidRef,step==='capture'&&camReady);
  const angles=[{id:'front',label:'Front',desc:'Look directly at camera'},{id:'left',label:'Left 45°',desc:'Turn head 45° left'},{id:'right',label:'Right 45°',desc:'Turn head 45° right'}];

  useEffect(()=>{document.documentElement.setAttribute('data-theme',theme);LS.set('derma-theme',theme);},[theme]);

  const isAngleOk=()=>{
    if(!hasFace||facePos==='too-close'||facePos==='too-far')return false;
    if(curAngle==='front')return['center','slight-left','slight-right'].includes(headAngle);
    if(curAngle==='left')return['turned-left','slight-left','center'].includes(headAngle);
    if(curAngle==='right')return['turned-right','slight-right','center'].includes(headAngle);
    return false;
  };
  const canCap=camReady&&hasFace&&facePos!=='too-close'&&facePos!=='too-far'&&(isAngleOk()||overrideReady);

  useEffect(()=>{setOverrideReady(false);if(overTimer.current)clearTimeout(overTimer.current);if(hasFace&&facePos!=='too-close'&&facePos!=='too-far'&&!isAngleOk()){overTimer.current=setTimeout(()=>setOverrideReady(true),4000);}return()=>{if(overTimer.current)clearTimeout(overTimer.current);};},[hasFace,facePos,headAngle,curAngle]); // eslint-disable-line
  useEffect(()=>setOverrideReady(false),[curAngle]);
  useEffect(()=>{return()=>{if(stmRef.current)stmRef.current.getTracks().forEach(t=>t.stop());};},[]);

  const startCam=async()=>{
    try{if(stmRef.current)stmRef.current.getTracks().forEach(t=>t.stop());setCamReady(false);setError(null);
    const ms=await navigator.mediaDevices.getUserMedia({video:{width:{ideal:1280,min:480},height:{ideal:720,min:360},facingMode:'user'}});
    stmRef.current=ms;setStep('capture');
    setTimeout(()=>{if(vidRef.current){vidRef.current.srcObject=ms;vidRef.current.onloadedmetadata=()=>vidRef.current.play().then(()=>setCamReady(true)).catch(()=>setError('Video failed'));}},120);
    }catch(e){setError(e.name==='NotAllowedError'?'Camera access denied.':`Camera error: ${e.message}`);}
  };

  useEffect(()=>{if(step==='capture'&&vidRef.current&&stmRef.current&&!vidRef.current.srcObject){vidRef.current.srcObject=stmRef.current;vidRef.current.onloadedmetadata=()=>vidRef.current.play().then(()=>setCamReady(true)).catch(console.error);}},[step]);

  const stopCam=useCallback(()=>{if(stmRef.current){stmRef.current.getTracks().forEach(t=>t.stop());stmRef.current=null;}if(vidRef.current)vidRef.current.srcObject=null;setCamReady(false);},[]);

  useEffect(()=>{if(step!=='capture'||!camReady)return;const iv=setInterval(async()=>{try{const c=canRef.current,v=vidRef.current;if(!c||!v||v.readyState!==4)return;c.width=v.videoWidth;c.height=v.videoHeight;c.getContext('2d').drawImage(v,0,0);const blob=await new Promise(r=>c.toBlob(r,'image/jpeg',0.5));if(!blob)return;const fd=new FormData();fd.append('image',new File([blob],'q.jpg',{type:'image/jpeg'}));const res=await fetch(`${API_URL}/api/check-quality`,{method:'POST',body:fd});if(res.ok)setQuality(await res.json());}catch{}},3500);return()=>clearInterval(iv);},[step,camReady]);

  const capture=()=>{if(!canCap)return;const c=canRef.current,v=vidRef.current;if(!c||!v||v.readyState!==4)return;c.width=v.videoWidth;c.height=v.videoHeight;c.getContext('2d').drawImage(v,0,0);const url=c.toDataURL('image/jpeg',0.92);const next={...images,[curAngle]:url};setImages(next);setOverrideReady(false);const idx=angles.findIndex(a=>a.id===curAngle);if(idx<angles.length-1)setCurAngle(angles[idx+1].id);else{stopCam();doAnalyze(next);}};

  const retake=(id)=>{setImages(p=>{const n={...p};delete n[id];return n;});setCurAngle(id);};

  const doAnalyze=async(imgs)=>{
    const src=imgs||images;setStep('analyzing');setError(null);setAStep(0);
    const t1=setTimeout(()=>setAStep(1),1200),t2=setTimeout(()=>setAStep(2),3500),t3=setTimeout(()=>setAStep(3),5500);
    try{
      if(!src.front)throw new Error('Front view required');
      const b=atob(src.front.split(',')[1]);const a=new Uint8Array(b.length);for(let i=0;i<b.length;i++)a[i]=b.charCodeAt(i);
      const fd=new FormData();fd.append('image',new File([a],'skin.jpg',{type:'image/jpeg'}));
      const res=await fetch(`${API_URL}/api/analyze`,{method:'POST',body:fd});
      if(!res.ok){const e=await res.json();throw new Error(e.error||'Analysis failed');}
      const data=await res.json();
      const result={...data.analysis,_images:src};
      setAnalysis(result);
      // Save history
      const tc=document.createElement('canvas');tc.width=80;tc.height=100;const ti=new Image();ti.src=src.front;
      await new Promise(r=>{ti.onload=r;setTimeout(r,500);});tc.getContext('2d').drawImage(ti,0,0,80,100);
      const entry={id:Date.now(),date:new Date().toISOString(),score:data.analysis.overallScore,skinType:data.analysis.skinType,summary:data.analysis.summary,issueCount:(data.analysis.detectedIssues||[]).length,thumb:tc.toDataURL('image/jpeg',0.5),frontImg:src.front};
      const updated=[...history,entry].slice(-20);setHistory(updated);LS.set('derma-history',updated);
      setStep('results');setActiveTab('overview');
    }catch(e){setError(e.message);setStep('intro');}
    finally{clearTimeout(t1);clearTimeout(t2);clearTimeout(t3);}
  };

  const downloadPdf=async()=>{setPdfLoading(true);try{const res=await fetch(`${API_URL}/api/generate-report`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({analysis,images:analysis._images,date:new Date().toISOString()})});if(!res.ok)throw new Error('PDF failed');const blob=await res.blob();const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download=`Skin_Report_${new Date().toISOString().split('T')[0]}.pdf`;link.click();URL.revokeObjectURL(url);}catch(e){setError('PDF: '+e.message);}finally{setPdfLoading(false);}};

  const share=(via)=>{const text=`DermaAI Skin Report\nScore: ${analysis?.overallScore}/100\nType: ${analysis?.skinType}\nDate: ${new Date().toLocaleDateString()}\n\nConditions: ${(analysis?.detectedIssues||[]).map(i=>i.issue).join(', ')||'None'}\n\nGenerated by DermaAI`;if(via==='whatsapp')window.open(`https://wa.me/?text=${encodeURIComponent(text)}`,'_blank');else if(via==='email')window.open(`mailto:?subject=My Skin Analysis Report&body=${encodeURIComponent(text)}`,'_blank');else{navigator.clipboard?.writeText(text);setError('Copied to clipboard!');setTimeout(()=>setError(null),2000);}};

  const reset=()=>{stopCam();setImages({});setCurAngle('front');setAnalysis(null);setError(null);setQuality(null);setCamReady(false);setStep('intro');setOverrideReady(false);setActiveTab('overview');};

  const cur=angles.find(a=>a.id===curAngle);
  const shutterLabel=!camReady?'Starting...':!hasFace?'No face detected':facePos==='too-close'?'Move back':facePos==='too-far'?'Come closer':canCap?'Capture':curAngle==='left'?'Turn head left...':curAngle==='right'?'Turn head right...':'Face the camera...';

  return(
    <div className="app">
      <button className="theme-toggle" onClick={()=>setTheme(t=>t==='dark'?'light':'dark')} title="Toggle theme">{theme==='dark'?'☀':'☾'}</button>

      {/* ═══ INTRO ═══ */}
      {step==='intro'&&(
        <div className="screen intro">
          <div className="intro-card">
            <span className="badge">DERMA · AI</span>
            <h1>Skin Analysis</h1>
            <p className="tagline">AI skin assessment with treatment plan, product recommendations & progress tracking</p>

            {history.length>0&&(
              <div className="history-peek">
                <div className="hp-head"><span>Your Score Trend</span><button className="btn-link" onClick={()=>setShowHistory(true)}>History ({history.length})</button></div>
                <ScoreChart history={history}/>
                <div className="hp-last">Last: <strong>{history[history.length-1].score}/100</strong> on {new Date(history[history.length-1].date).toLocaleDateString()}</div>
              </div>
            )}

            <div className="feat-row">
              {[{i:'🔬',t:'AI Detection',d:'Face validation before capture'},{i:'📐',t:'3-Angle Scan',d:'Front + left + right coverage'},{i:'📋',t:'PDF Report',d:'Doctor-style shareable report'},{i:'📊',t:'Track Progress',d:'History & before/after compare'}].map((f,i)=>(
                <div className="feat" key={i}><span className="feat-i">{f.i}</span><strong>{f.t}</strong><span>{f.d}</span></div>
              ))}
            </div>

            <div className="intro-actions">
              <button className="btn-go" onClick={startCam}>Begin Analysis →</button>
              {history.length>=2&&<button className="btn-compare" onClick={()=>{setCompareA(history[history.length-2]);setCompareB(history[history.length-1]);setShowCompare(true);}}>Compare Last Two</button>}
            </div>

            <div className="prep"><span className="prep-tag">Preparation</span><div className="prep-items">{['Good lighting','Clean face','Neutral expression','Steady hands'].map((t,i)=>(<span key={i} className="prep-item">{t}</span>))}</div></div>
          </div>

          {showHistory&&(<div className="modal-overlay" onClick={()=>setShowHistory(false)}><div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-head"><h2>Analysis History</h2><button onClick={()=>setShowHistory(false)}>✕</button></div>
            <div className="modal-body">
              {history.length===0?<p className="empty">No analyses yet</p>:(
                <div className="history-list">{[...history].reverse().map((h,i)=>(
                  <div key={h.id} className="history-item">
                    {h.thumb&&<img src={h.thumb} alt="" className="history-thumb"/>}
                    <div className="history-info">
                      <div className="h-date">{new Date(h.date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</div>
                      <div className="h-score" style={{color:h.score>=70?'var(--green)':h.score>=40?'var(--amber)':'var(--red)'}}>{h.score}/100</div>
                      <div className="h-type">{h.skinType} · {h.issueCount} issue{h.issueCount!==1?'s':''}</div>
                    </div>
                    {i<history.length-1&&<button className="btn-sm" onClick={()=>{setCompareA(h);setCompareB([...history].reverse()[i+1]);setShowCompare(true);setShowHistory(false);}}>Compare</button>}
                  </div>
                ))}</div>
              )}
              {history.length>0&&<button className="btn-danger" onClick={()=>{setHistory([]);LS.set('derma-history',[]);}}>Clear History</button>}
            </div>
          </div></div>)}

          {showCompare&&compareA&&compareB&&(<div className="modal-overlay" onClick={()=>setShowCompare(false)}><div className="modal modal-wide" onClick={e=>e.stopPropagation()}>
            <div className="modal-head"><h2>Before / After</h2><button onClick={()=>setShowCompare(false)}>✕</button></div>
            <div className="modal-body">
              {compareA.frontImg&&compareB.frontImg?<CompareSlider imgBefore={compareA.frontImg} imgAfter={compareB.frontImg} labelBefore={`${new Date(compareA.date).toLocaleDateString()} (${compareA.score})`} labelAfter={`${new Date(compareB.date).toLocaleDateString()} (${compareB.score})`}/>:
              <div className="compare-scores"><div className="cs-side"><h3>{new Date(compareA.date).toLocaleDateString()}</h3><div className="cs-num">{compareA.score}</div></div><div className="cs-arrow">→</div><div className="cs-side"><h3>{new Date(compareB.date).toLocaleDateString()}</h3><div className="cs-num">{compareB.score}</div></div></div>}
              <div className="compare-delta">Score change: <strong style={{color:compareB.score>=compareA.score?'var(--green)':'var(--red)'}}>{compareB.score>=compareA.score?'+':''}{compareB.score-compareA.score} pts</strong></div>
            </div>
          </div></div>)}
        </div>
      )}

      {/* ═══ CAPTURE ═══ */}
      {step==='capture'&&(
        <div className="screen capture">
          <header className="cap-head">
            <button className="btn-back" onClick={()=>{stopCam();reset();}}>← Back</button>
            <div className="cap-steps">{angles.map(a=>(<span key={a.id} className={`cap-pill ${images[a.id]?'done':''} ${curAngle===a.id?'cur':''}`}>{images[a.id]?'✓ ':''}{a.label}</span>))}</div>
          </header>
          <div className="cap-body">
            <div className="cam-wrap">
              <video ref={vidRef} autoPlay playsInline muted className="cam-video"/>
              <canvas ref={canRef} style={{display:'none'}}/>
              {!camReady&&<div className="cam-loading"><div className="spin"/><p>Initializing camera...</p></div>}
              {camReady&&<FaceGuide hasFace={hasFace} facePos={facePos} targetAngle={curAngle} faceBox={faceBox} canCapture={canCap}/>}
              {quality?.quality?.resolution&&<div className="q-tags"><span className={`q-tag ${quality.quality.lighting.isGood?'g':'w'}`}>{quality.quality.lighting.isGood?'☀':'◐'} Light</span><span className={`q-tag ${quality.quality.sharpness.isGood?'g':'w'}`}>{quality.quality.sharpness.isGood?'◉':'~'} Focus</span></div>}
            </div>
            <div className="cap-side">
              <div className="angle-info"><div className="angle-num">{angles.findIndex(a=>a.id===curAngle)+1}<span>/{angles.length}</span></div><h3>{cur?.label}</h3><p>{cur?.desc}</p></div>
              <button className={`btn-shutter ${canCap?'go':''}`} onClick={capture} disabled={!canCap}><span className="shutter-ring"><span className="shutter-dot"/></span><span className="shutter-label">{shutterLabel}</span></button>
              {hasFace&&!isAngleOk()&&!overrideReady&&<p className="override-hint">Hold still... capture enables shortly</p>}
              {overrideReady&&!isAngleOk()&&<p className="override-hint ready">Capture enabled!</p>}
              <div className="thumbs">{angles.map(a=>(<div key={a.id} className={`thumb ${images[a.id]?'taken':''} ${curAngle===a.id&&!images[a.id]?'active':''}`}>{images[a.id]?(<><img src={images[a.id]} alt={a.label}/><button className="thumb-x" onClick={()=>retake(a.id)}>↻</button><span className="thumb-ok">✓</span></>):<span className="thumb-lbl">{a.label}</span>}</div>))}</div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ ANALYZING ═══ */}
      {step==='analyzing'&&(
        <div className="screen analyze"><div className="analyze-card">
          {images.front&&<div className="scan-avatar"><img src={images.front} alt="face"/><div className="scan-bar"/></div>}
          <h2>Analyzing Your Skin</h2><p className="analyze-sub">AI assessment in progress</p>
          <div className="analyze-steps">{['Verifying quality','Detecting conditions','Analyzing zones','Building plan'].map((l,i)=>(<div key={i} className={`a-step ${aStep>=i?'on':''} ${aStep>i?'done':''}`}><span className="a-dot">{aStep>i?'✓':aStep===i?'●':'○'}</span>{l}</div>))}</div>
        </div></div>
      )}

      {/* ═══ RESULTS ═══ */}
      {step==='results'&&analysis&&(
        <div className="screen results">
          <header className="res-head">
            <div><h1>Skin Report</h1><span className="res-date">{new Date().toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})}</span></div>
            <div className="res-actions">
              <button className="btn-pdf" onClick={downloadPdf} disabled={pdfLoading}>{pdfLoading?'...':'PDF'}</button>
              <button className="btn-share" onClick={()=>share('whatsapp')}>WhatsApp</button>
              <button className="btn-share" onClick={()=>share('email')}>Email</button>
              <button className="btn-again" onClick={reset}>+ New</button>
            </div>
          </header>

          <div className="res-tabs">{[{id:'overview',l:'Overview'},{id:'zones',l:'Zones'},{id:'treatment',l:'Treatment'},{id:'products',l:'Products'},{id:'lifestyle',l:'Lifestyle'}].map(t=>(<button key={t.id} className={`res-tab ${activeTab===t.id?'active':''}`} onClick={()=>setActiveTab(t.id)}>{t.l}</button>))}</div>

          <div className="res-body">
            {activeTab==='overview'&&(<>
              {analysis._images&&<section className="card photos-card"><h2>Photos</h2><div className="photo-row">{angles.map(a=>analysis._images[a.id]&&(<figure key={a.id} className="photo-fig"><img src={analysis._images[a.id]} alt={a.label}/><figcaption>{a.label}</figcaption></figure>))}</div></section>}
              <section className="card score-card"><div className="score-left"><h2>Overall Assessment</h2><p className="score-summary">{analysis.summary}</p><span className="meta-chip">Skin Type: <strong>{analysis.skinType}</strong></span></div><div className="score-right"><div className="score-ring"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="50" fill="none" stroke="var(--border)" strokeWidth="10"/><circle cx="60" cy="60" r="50" fill="none" stroke={analysis.overallScore>=70?'var(--green)':analysis.overallScore>=40?'var(--amber)':'var(--red)'} strokeWidth="10" strokeLinecap="round" strokeDasharray={`${(analysis.overallScore/100)*314} 314`} transform="rotate(-90 60 60)" style={{transition:'stroke-dasharray 1.5s ease'}}/></svg><div className="score-val">{analysis.overallScore}<span>/100</span></div></div></div></section>
              {history.length>=2&&<section className="card"><h2>Score Trend</h2><ScoreChart history={history}/></section>}
              <section className="card"><h2>Detected Conditions</h2>{analysis.detectedIssues?.length>0?(<div className="issues">{analysis.detectedIssues.map((is,i)=>(<div key={i} className={`issue sev-${is.severity}`}><div className="issue-top"><h3>{is.issue}</h3><span className="sev">{is.severity}</span></div><p>{is.description}</p>{is.affected_areas?.length>0&&<small className="areas">Areas: {is.affected_areas.join(', ')}</small>}</div>))}</div>):<p className="empty-msg">No significant conditions found</p>}</section>
            </>)}

            {activeTab==='zones'&&analysis.zoneAnalysis&&<section className="card"><h2>Facial Zone Analysis</h2><div className="zones">{Object.entries(analysis.zoneAnalysis).map(([z,d])=>(<div key={z} className={`zone c-${d.condition}`}><div className="zone-head"><span className="zone-name">{z.replace(/([A-Z])/g,' $1').trim()}</span><span className="zone-sc">{d.score}/10</span></div><span className="zone-cond">{d.condition}</span>{d.detail&&<p className="zone-detail">{d.detail}</p>}{d.issues?.length>0&&<ul>{d.issues.map((x,i)=><li key={i}>{x}</li>)}</ul>}</div>))}</div></section>}

            {activeTab==='treatment'&&(<>
              {analysis.treatmentRecommendations?.length>0&&<section className="card"><h2>Treatment Plan</h2><div className="treatments">{analysis.treatmentRecommendations.map((t,i)=>(<div key={i} className="treat"><h3>{t.treatment}</h3><p>{t.purpose}</p><div className="treat-meta"><small>{t.frequency}</small>{t.notes&&<small className="treat-note">{t.notes}</small>}</div></div>))}</div></section>}
              {analysis.homeCareRoutine&&<section className="card"><h2>Daily Routine</h2><div className="routine-cols"><div><h3>Morning</h3><ol>{analysis.homeCareRoutine.morning?.map((s,i)=><li key={i}>{s}</li>)}</ol></div><div><h3>Evening</h3><ol>{analysis.homeCareRoutine.evening?.map((s,i)=><li key={i}>{s}</li>)}</ol></div></div></section>}
              {analysis.progressTimeline&&<section className="card"><h2>Timeline</h2><div className="timeline">{Object.entries(analysis.progressTimeline).map(([p,c])=>(<div key={p} className="tl-item"><div className="tl-dot"/><div><strong>{p.replace(/([A-Z])/g,' $1').trim()}</strong><p>{c}</p></div></div>))}</div></section>}
            </>)}

            {activeTab==='products'&&<section className="card"><h2>Recommended Products</h2><p className="products-intro">Based on your skin analysis:</p><div className="products-grid">
              <ProductCard product={{type:'Cleanser',name:'Gentle Foaming Cleanser',keyIngredient:'Salicylic Acid 0.5%',purpose:'Removes impurities without stripping',frequency:'Twice daily',when:'AM & PM'}}/>
              <ProductCard product={{type:'Serum',name:'Niacinamide Serum',keyIngredient:'Niacinamide 10% + Zinc 1%',purpose:'Reduces pores and balances oil',frequency:'Once daily',when:'AM'}}/>
              <ProductCard product={{type:'Moisturizer',name:'Barrier Repair Cream',keyIngredient:'Ceramides + Hyaluronic Acid',purpose:'Strengthens barrier, locks moisture',frequency:'Twice daily',when:'AM & PM'}}/>
              <ProductCard product={{type:'Sunscreen',name:'SPF 50 Broad Spectrum',keyIngredient:'Zinc Oxide + Niacinamide',purpose:'UV protection, no white cast',frequency:'Every morning',when:'Reapply 2hrs'}}/>
              {analysis.detectedIssues?.some(i=>i.issue?.toLowerCase().includes('acne'))&&<ProductCard product={{type:'Treatment',name:'Spot Treatment',keyIngredient:'Benzoyl Peroxide 2.5%',purpose:'Targets active breakouts',frequency:'As needed',when:'PM only'}}/>}
              {analysis.detectedIssues?.some(i=>i.issue?.toLowerCase().includes('dark'))&&<ProductCard product={{type:'Serum',name:'Vitamin C Serum',keyIngredient:'L-Ascorbic Acid 15%',purpose:'Brightens dark spots',frequency:'Once daily',when:'AM before SPF'}}/>}
            </div></section>}

            {activeTab==='lifestyle'&&analysis.lifestyleSuggestions&&<section className="card"><h2>Lifestyle</h2><div className="life-cols">{Object.entries(analysis.lifestyleSuggestions).map(([c,items])=>(<div key={c}><h3>{c.charAt(0).toUpperCase()+c.slice(1)}</h3><ul>{items?.map((s,i)=><li key={i}>{s}</li>)}</ul></div>))}</div></section>}

            <p className="disclaimer">This AI report is for informational purposes only. Consult a dermatologist for diagnosis and treatment.</p>
          </div>

          <footer className="res-foot">
            <button className="btn-primary" onClick={reset}>New Analysis</button>
            <button className="btn-outline" onClick={downloadPdf} disabled={pdfLoading}>{pdfLoading?'...':'Download PDF'}</button>
            <button className="btn-outline" onClick={()=>share('whatsapp')}>WhatsApp</button>
            <button className="btn-outline" onClick={()=>share('email')}>Email</button>
          </footer>
        </div>
      )}

      {error&&<div className="toast"><span>{error}</span><button onClick={()=>setError(null)}>✕</button></div>}
    </div>
  );
}

export default App;