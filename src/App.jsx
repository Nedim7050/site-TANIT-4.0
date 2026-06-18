import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Camera, Check, ChevronLeft, ChevronRight, Download, Feather, Mail, Menu, Music, Pause, Play, Users, Volume2, X } from 'lucide-react'
import { houses, keyAreas, leadership, logoUrl, quiz } from './data'
import owlAsset from './assets/tanit-owl-final.png'
import toteBagAsset from './assets/tanit-tote-v2-transparent.png'

const initialForm = {
  fullName:'', country:'Tunisia', entityName:'', lcName:'', position:'', cin:'', email:'', phone:'', emergencyPhone:'', gender:'', birthDate:'',
  allergies:'', allergyDetails:'', chronic:'', chronicDetails:'', dietary:'', goals:'', topics:'', support:'', communication:'', communicationOther:'', photoName:'', comments:'',
  room:'shared', bus:'none', tote:'no', quizAnswers:{}, house:'', terms:false
}

const steps = ['Identity','Wellbeing','Expectations','Support','Fees & extras','Sorting','The vow']

export function fileToBase64(file){
  return new Promise((resolve,reject)=>{
    const reader=new FileReader()
    reader.onload=()=>resolve(String(reader.result).split(',')[1]||'')
    reader.onerror=()=>reject(new Error('The selected photo could not be read.'))
    reader.readAsDataURL(file)
  })
}

async function optimizePhotoForUpload(file){
  if(!file||file.type==='image/gif'||file.size<100*1024)return file
  const imageUrl=URL.createObjectURL(file)
  try{
    const image=await new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(new Error('The selected photo could not be prepared.'));img.src=imageUrl})
    const maxDimension=640
    const scale=Math.min(1,maxDimension/Math.max(image.naturalWidth,image.naturalHeight))
    if(scale===1)return file
    const canvas=document.createElement('canvas')
    canvas.width=Math.round(image.naturalWidth*scale)
    canvas.height=Math.round(image.naturalHeight*scale)
    canvas.getContext('2d').drawImage(image,0,0,canvas.width,canvas.height)
    const blob=await new Promise((resolve,reject)=>canvas.toBlob(value=>value?resolve(value):reject(new Error('Photo optimization failed.')),file.type,file.type==='image/jpeg'?.58:undefined))
    if(blob.size>=file.size)return file
    return new File([blob],file.name,{type:file.type,lastModified:file.lastModified})
  }finally{URL.revokeObjectURL(imageUrl)}
}

function MagicalBackground(){
  return <div className="magic-bg" aria-hidden="true">
    <div className="aurora" />
    {[...Array(28)].map((_,i)=><i key={i} className="star" style={{'--x':`${(i*37)%100}%`,'--y':`${(i*53)%100}%`,'--d':`${2+(i%5)}s`}} />)}
    {[8,28,72,91].map((x,i)=><div key={x} className="candle" style={{left:`${x}%`,top:`${15+(i%2)*38}%`,animationDelay:`-${i}s`}}><b/><span/></div>)}
    {[...Array(6)].map((_,i)=><div key={i} className="flying-letter" style={{'--y':`${12+i*14}%`,'--delay':`${-i*3.4}s`}}>✉</div>)}
  </div>
}

function GlobalMagic(){return <div className="global-magic" aria-hidden="true">{[...Array(18)].map((_,i)=><i key={i} className="global-mote" style={{'--gx':`${(i*47)%100}vw`,'--gy':`${(i*61)%100}vh`,'--gs':`${2+(i%4)}px`,'--gd':`${9+(i%7)}s`,'--gdelay':`${-i*.8}s`}}/>)}<div className="global-runes">✦　◈　✦　◆　✦　◈　✦</div></div>}

function AnimatedLetters({text}){return <motion.span className="animated-letters" initial="hidden" animate="visible" variants={{visible:{transition:{staggerChildren:.16,delayChildren:1}}}}>{text.split('').map((char,i)=><motion.span key={`${char}-${i}`} variants={{hidden:{opacity:0,y:34,rotateX:-85,filter:'blur(9px)'},visible:{opacity:1,y:0,rotateX:0,filter:'blur(0px)',transition:{duration:1.15,ease:[.2,.8,.2,1]}}}}>{char===' '?<>&nbsp;</>:char}</motion.span>)}</motion.span>}

function OwlDelivery(){return <div className="owl-delivery" aria-hidden="true"><div className="delivery-owl"><img src={owlAsset} alt=""/></div><div className="delivery-trail">✦ · ✦ · ✦</div></div>}

function MagicTrail(){
  useEffect(()=>{const onMove=e=>{if(window.matchMedia('(pointer: coarse)').matches)return;const spark=document.createElement('i');spark.className='cursor-spark';spark.textContent=Math.random()>.6?'✦':'·';spark.style.left=`${e.clientX}px`;spark.style.top=`${e.clientY}px`;document.body.appendChild(spark);setTimeout(()=>spark.remove(),850)};window.addEventListener('pointermove',onMove,{passive:true});return()=>window.removeEventListener('pointermove',onMove)},[])
  return null
}

function MusicPlayer(){
  const audio=useRef(null),[playing,setPlaying]=useState(false),[available,setAvailable]=useState(true)
  const toggle=async()=>{if(!audio.current)return;if(playing){audio.current.pause();setPlaying(false)}else{try{await audio.current.play();setPlaying(true)}catch{setAvailable(false)}}}
  return <div className={`music-player ${playing?'playing':''}`}><audio ref={audio} src="/audio/tanit-theme.mp3" loop preload="metadata" onCanPlay={()=>setAvailable(true)} onError={()=>setAvailable(false)} onEnded={()=>setPlaying(false)}/><button onClick={toggle} aria-label={playing?'Pause magical ambience':'Play magical ambience'} title={available?'Magical ambience':'Audio file unavailable'}>{playing?<Pause/>:<Play/>}</button><div><Music/><span>{available?(playing?'ENCHANTED AMBIENCE':'PLAY THE THEME'):'AUDIO UNAVAILABLE'}</span></div>{playing&&<Volume2 className="sound-wave"/>}</div>
}

function SendingOverlay({stage,photoName}){
  const content={preparing:['PREPARING YOUR PORTRAIT','The academy is carefully resizing your image.'],encoding:['ENCHANTING THE PHOTOGRAPH','Turning your portrait into a secure magical scroll.'],sending:['SENDING YOUR OWL','Your registration and portrait are flying to the academy.'],sealing:['SEALING YOUR LETTER','Almost there — your invitation is being prepared.']}
  const [title,copy]=content[stage]||content.sending
  return <motion.div className="sending-overlay" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><div className="sending-stars">{[...Array(18)].map((_,i)=><i key={i} style={{'--i':i,left:`${(i*37)%100}%`,top:`${(i*53)%100}%`}}/>)}</div><motion.div className="sending-owl" animate={{y:[0,-12,0],rotate:[-2,2,-2]}} transition={{duration:1.8,repeat:Infinity}}><img src={owlAsset} alt="Owl carrying your registration"/></motion.div><div className="sending-envelope"><span>✉</span><i/></div><AnimatePresence mode="wait"><motion.div className="sending-copy" key={stage} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}><small>TANIT 4.0 · OWL POST</small><h3>{title}</h3><p>{copy}</p>{photoName&&<em>{photoName}</em>}</motion.div></AnimatePresence><div className="sending-progress"><i/></div><strong>Please keep this window open.</strong></motion.div>
}

function Nav({onRegister}){
  const [open,setOpen]=useState(false)
  const links=['home','about','team','contact']
  return <nav className="nav"><a href="#home" className="brand"><img src={logoUrl} alt="TANIT 4.0"/><div>TANIT <small>THE FOURTH CHAPTER</small></div></a>
    <button className="menu" onClick={()=>setOpen(!open)} aria-label="Toggle navigation">{open?<X/>:<Menu/>}</button>
    <div className={`nav-links ${open?'open':''}`}>{links.map(x=><a key={x} onClick={()=>setOpen(false)} href={`#${x}`}>{x==='team'?'The Keepers':x}</a>)}<button onClick={()=>{onRegister();setOpen(false)}} className="gold-button small">Register</button></div>
  </nav>
}

function SectionTitle({eyebrow,title,copy}){return <motion.div className="section-title" initial="hidden" whileInView="visible" viewport={{once:true,amount:.4}} variants={{hidden:{opacity:0,y:38},visible:{opacity:1,y:0,transition:{duration:.75,staggerChildren:.08}}}}><motion.span variants={{hidden:{opacity:0},visible:{opacity:1}}}>{eyebrow}</motion.span><h2>{title.split(' ').map((word,i)=><motion.span key={`${word}-${i}`} variants={{hidden:{opacity:0,y:26,filter:'blur(5px)'},visible:{opacity:1,y:0,filter:'blur(0)',transition:{duration:.6}}}}>{word}&nbsp;</motion.span>)}</h2>{copy&&<motion.p variants={{hidden:{opacity:0},visible:{opacity:1}}}>{copy}</motion.p>}<motion.div className="ornament" variants={{hidden:{opacity:0,scaleX:0},visible:{opacity:1,scaleX:1}}}>✦</motion.div></motion.div>}

function Home({onRegister}){
  return <section id="home" className="hero"><MagicalBackground/>
    <motion.div className="hero-content" initial={{opacity:0,y:36}} animate={{opacity:1,y:0}} transition={{duration:1.2}}>
      <p className="overline"><AnimatedLetters text="THE LETTER HAS ARRIVED"/></p><h1>WELCOME TO<br/><em>TANIT 4.0</em></h1>
      <div className="hero-divider"><i/>◆<i/></div>
      <p className="hero-copy">Four houses. One unforgettable conference.<br/>The gates of the academy are open — and your name is on the list.</p>
      <div className="hero-actions"><button onClick={onRegister} className="gold-button">Register now <ArrowRight size={18}/></button><a href="#about" className="ghost-button">Discover TANIT</a></div>
      <div className="scroll-cue"><span/>CROSS THE BRIDGE</div>
    </motion.div>
  </section>
}

function About(){
 const cards=[['01','The vision','A generation of leaders brave enough to imagine better—and skilled enough to build it.'],['02','The experience','Cinematic moments, honest conversations, powerful learning, and friendships that outlive the conference.'],['03','Why attend','Return home with sharper purpose, practical tools, a wider network, and a story worth telling.'],['04','What you will live','House challenges, enchanted evenings, inspiring plenaries, and the unmistakable energy of AIESEC.']]
 return <section id="about" className="section about"><SectionTitle eyebrow="THE STORY BEHIND THE SEAL" title="More than a conference. A chapter of legend." copy="TANIT 4.0 is where ambition finds its people and potential becomes a shared adventure."/><div className="story-grid">{cards.map((c,i)=><motion.article key={c[1]} className="parchment-card" initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.08}}><span>{c[0]}</span><h3>{c[1]}</h3><p>{c[2]}</p><i>✦</i></motion.article>)}</div></section>
}

function Houses(){return <section id="houses" className="section houses-section"><SectionTitle eyebrow="THE SORTING AWAITS" title="Four houses. One shared legend." copy="Your choices reveal more than a color. They reveal how you lead, create, care, and rise."/><div className="house-grid">{Object.entries(houses).map(([key,h],i)=><motion.article key={key} className={`house-card ${key}`} initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.1}}><div className="house-banner"><span>{h.icon}</span><i>HOUSE OF</i><h3>{h.name.replace(' House','')}</h3><b>{['IGNIS','ASTUTIA','SAPIENTIA','FIDELITAS'][i]}</b></div><p>{h.trait}</p><small>{['For those who step forward when others step back.','For minds that see the path before anyone else.','For spirits drawn to questions, wonder, and invention.','For the hearts that turn a group into a home.'][i]}</small></motion.article>)}</div><p className="sorting-note">The enchanted seal will choose your house after the six-question sorting ceremony.</p></section>}

function MemberPortrait({member,index}){const [revealed,setRevealed]=useState(false);return <motion.article className={`member-card ${member.hoverPhoto?'anbu-card':''}`} initial={{opacity:0,y:28}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.2}} transition={{delay:(index%4)*.08}}><button type="button" className={`member-portrait ${revealed?'revealed':''}`} onClick={()=>member.hoverPhoto&&setRevealed(v=>!v)} onMouseEnter={()=>member.hoverPhoto&&setRevealed(true)} onMouseLeave={()=>member.hoverPhoto&&setRevealed(false)} aria-label={member.hoverPhoto?`Reveal ${member.name} ANBU portrait`:member.name}><img className="member-base" src={member.photo} alt={member.name}/>{member.hoverPhoto&&<img className="member-hover" src={member.hoverPhoto} alt={`${member.name} ANBU portrait`}/>}<span className="portrait-glow"/><i>{member.hoverPhoto?(revealed?'MASK RESTORED':'REVEAL ANBU'):'TANIT 4.0'}</i></button><div className="member-meta"><span>0{index+1}</span><div><h4>{member.name}</h4><p>{member.role}</p></div></div></motion.article>}

function Team(){return <section id="team" className="section team"><SectionTitle eyebrow="THE ORGANIZING CABINET" title="The people behind the enchantment" copy="Every spell has a caster. Every unforgettable conference has a team."/><div className="leadership-stage"><motion.article className="leader-card manager" initial={{opacity:0,scale:.9}} whileInView={{opacity:1,scale:1}} viewport={{once:true}}><div className="leader-crown">✦</div><div className="leader-portrait"><img src={leadership[0].photo} alt={leadership[0].name}/></div><span>CONFERENCE MANAGER</span><h3>{leadership[0].name}</h3><p>“{leadership[0].quote}”</p></motion.article><motion.article className="leader-card ocp" initial={{opacity:0,y:25}} whileInView={{opacity:1,y:0}} viewport={{once:true}}><div className="leader-portrait"><img src={leadership[1].photo} alt={leadership[1].name}/></div><span>OCP</span><h3>{leadership[1].name}</h3><p>{leadership[1].area}</p></motion.article></div><div className="team-areas">{keyAreas.map((area,areaIndex)=><section className={`area-block ${area.key}`} key={area.key}><div className="area-heading"><span>KEY AREA 0{areaIndex+1}</span><h3>{area.name}</h3><small>{area.subtitle}</small><p>{area.description}</p></div><div className={`members-grid count-${area.members.length}`}>{area.members.map((member,i)=><MemberPortrait key={member.name} member={member} index={i}/>)}</div></section>)}</div></section>}

const Field=({label,required,error,children})=><label className={`field ${error?'invalid':''}`}><span>{label}{required&&<b> *</b>}</span>{children}{error&&<small>{error}</small>}</label>
const Input=(p)=><input {...p}/>
const RadioCards=({name,value,onChange,options})=><div className="radio-grid">{options.map(([v,l])=><label key={v} className={value===v?'selected':''}><input type="radio" name={name} value={v} checked={value===v} onChange={e=>onChange(e.target.value)}/><span>{value===v?<Check size={15}/>:null}</span>{l}</label>)}</div>

function FormStep({step,form,set,errors,selectedPhoto,setSelectedPhoto,photoError,setPhotoError}){
 const f=(key)=>(e)=>set(key,e.target.value)
 if(step===0)return <div className="form-grid"><Field label="Full name" required error={errors.fullName}><Input value={form.fullName} onChange={f('fullName')} placeholder="Your full name"/></Field><Field label="Country" required error={errors.country}><Input value={form.country} onChange={f('country')}/></Field><Field label="Entity name" required error={errors.entityName}><Input value={form.entityName} onChange={f('entityName')} placeholder="AIESEC entity"/></Field><Field label="LC name" required error={errors.lcName}><Input value={form.lcName} onChange={f('lcName')} placeholder="Local committee"/></Field><Field label="AIESEC position" required error={errors.position}><Input value={form.position} onChange={f('position')} placeholder="Your current role"/></Field><Field label="CIN number"><Input value={form.cin} onChange={f('cin')}/></Field><Field label="Email address" required error={errors.email}><Input type="email" value={form.email} onChange={f('email')} placeholder="you@example.com"/></Field><Field label="Phone number" required error={errors.phone}><Input type="tel" value={form.phone} onChange={f('phone')}/></Field><Field label="Emergency phone" required error={errors.emergencyPhone}><Input type="tel" value={form.emergencyPhone} onChange={f('emergencyPhone')}/></Field><Field label="Gender" required error={errors.gender}><select value={form.gender} onChange={f('gender')}><option value="">Choose one</option><option>Male</option><option>Female</option><option>Other</option></select></Field><Field label="Date of birth" required error={errors.birthDate}><Input type="date" value={form.birthDate} onChange={f('birthDate')}/></Field></div>
 if(step===1)return <div className="stack"><Field label="Do you have any allergies?" required error={errors.allergies}><RadioCards name="allergies" value={form.allergies} onChange={v=>set('allergies',v)} options={[["Yes","Yes"],["No","No"]]}/></Field>{form.allergies==='Yes'&&<Field label="Allergy details" required error={errors.allergyDetails}><textarea value={form.allergyDetails} onChange={f('allergyDetails')} placeholder="Please tell us what we should know"/></Field>}<Field label="Chronic medical conditions we should know about?" required error={errors.chronic}><RadioCards name="chronic" value={form.chronic} onChange={v=>set('chronic',v)} options={[["Yes","Yes"],["No","No"],["Other","Other"]]}/></Field>{['Yes','Other'].includes(form.chronic)&&<Field label="Condition details" required error={errors.chronicDetails}><textarea value={form.chronicDetails} onChange={f('chronicDetails')}/></Field>}<Field label="Dietary restrictions" required error={errors.dietary}><select value={form.dietary} onChange={f('dietary')}><option value="">Choose one</option><option>None</option><option>Vegetarian</option><option>Vegan</option><option>Gluten-free</option><option>Halal</option><option>Other</option></select></Field></div>
 if(step===2)return <div className="stack"><Field label="What are your main goals for attending the conference?" required error={errors.goals}><textarea value={form.goals} onChange={f('goals')} placeholder="Tell us what you hope to unlock…"/></Field><Field label="Which topics or sessions interest you most?" required error={errors.topics}><textarea value={form.topics} onChange={f('topics')} placeholder="Leadership, strategy, skills, culture…"/></Field></div>
 if(step===3)return <div className="stack"><Field label="How can our team support you during the event?"><textarea value={form.support} onChange={f('support')}/></Field><Field label="Preferred communication method" required error={errors.communication}><RadioCards name="communication" value={form.communication} onChange={v=>{set('communication',v);if(v!=='Other')set('communicationOther','')}} options={[["Email","Email"],["WhatsApp","WhatsApp"],["Other","Other"]]}/></Field>{form.communication==='Other'&&<motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}}><Field label="Please specify your communication method" required error={errors.communicationOther}><Input value={form.communicationOther} onChange={f('communicationOther')} placeholder="Telegram, phone call, Messenger…" autoFocus/></Field></motion.div>}<Field label="Upload a photo of yourself (JPG, PNG, GIF — max 50MB)" error={photoError}><input type="file" accept="image/jpeg,image/png,image/gif" onChange={e=>{const file=e.target.files?.[0]||null;setPhotoError('');if(!file){setSelectedPhoto(null);set('photoName','');return}if(!['image/jpeg','image/png','image/gif'].includes(file.type)){setSelectedPhoto(null);set('photoName','');setPhotoError('Only JPG, PNG, and GIF files are accepted.');e.target.value='';return}if(file.size>50*1024*1024){setSelectedPhoto(null);set('photoName','');setPhotoError('The photo must be smaller than 50MB.');e.target.value='';return}setSelectedPhoto(file);set('photoName',file.name)}}/>{selectedPhoto&&<motion.div className="selected-file" initial={{opacity:0,y:5}} animate={{opacity:1,y:0}}><Check size={14}/><span>{selectedPhoto.name}</span><small>{(selectedPhoto.size/1024/1024).toFixed(2)} MB</small></motion.div>}<small className="hint">Your photo will be securely uploaded with your registration.</small></Field><Field label="Final comments or special requests"><textarea value={form.comments} onChange={f('comments')}/></Field></div>
 if(step===4)return <div className="stack"><div className="fee-banner"><span>FULL CONFERENCE FEE</span><strong>105 <small>TND TOTAL</small></strong><p>The participation fee is 105 TND for the full conference. A minimum advance of 50 TND must be paid within 48 hours and is non-refundable on cancellation.</p></div><Field label="Accommodation"><RadioCards name="room" value={form.room} onChange={v=>set('room',v)} options={[["shared","Shared accommodation"],["single","Single room · +50 TND"]]}/></Field><Field label="Bus option"><RadioCards name="bus" value={form.bus} onChange={v=>set('bus',v)} options={[["none","No bus"],["round","Round trip · +30 TND"],["oneway","One-way · +20 TND"],["return","Return only · +20 TND"]]}/></Field><Field label="Tote bag"><RadioCards name="tote" value={form.tote} onChange={v=>set('tote',v)} options={[["no","No tote bag"],["yes","Yes · +15 TND"]]}/></Field><div className={`tote-simple ${form.tote==='yes'?'chosen':''}`}><img src={toteBagAsset} alt="Official TANIT 4.0 tote bag"/><div><h3>TANIT 4.0 TOTE BAG</h3><b>15 TND</b></div></div></div>
 if(step===5){const complete=quiz.every((_,i)=>form.quizAnswers[i]);const scores={phoenix:0,serpent:0,raven:0,badger:0};Object.values(form.quizAnswers).forEach(h=>scores[h]++);const sortedKey=Object.entries(scores).sort((a,b)=>b[1]-a[1])[0][0];const sorted=houses[sortedKey];const answerQuiz=(index,house)=>{const nextAnswers={...form.quizAnswers,[index]:house};set('quizAnswers',nextAnswers);if(quiz.every((_,i)=>nextAnswers[i])){const nextScores={phoenix:0,serpent:0,raven:0,badger:0};Object.values(nextAnswers).forEach(h=>nextScores[h]++);const nextHouse=Object.entries(nextScores).sort((a,b)=>b[1]-a[1])[0][0];set('house',houses[nextHouse].name)}};return <div className="quiz"><p className="quiz-intro">Six choices will reveal the house that matches your spirit.</p>{quiz.map((q,i)=><div className="quiz-question" key={q.q}><h3><span>{i+1}</span>{q.q}</h3><div className="quiz-options">{q.a.map(([answer,house])=><button type="button" key={answer} className={form.quizAnswers[i]===house?'active':''} onClick={()=>answerQuiz(i,house)}><i style={{color:houses[house].color}}>{houses[house].icon}</i>{answer}</button>)}</div>{errors[`quiz${i}`]&&<small className="error">Choose one answer to continue.</small>}</div>)}<AnimatePresence>{complete&&<motion.div className="sorting-reveal" style={{'--reveal':sorted.color}} initial={{opacity:0,scale:.8,y:20}} animate={{opacity:1,scale:1,y:0}} transition={{type:'spring',stiffness:95,damping:13}}><motion.div className="sorting-burst" initial={{rotate:0}} animate={{rotate:360}} transition={{duration:24,repeat:Infinity,ease:'linear'}}>✦　·　✦　·　✦　·　✦</motion.div><span>{sorted.icon}</span><small>THE SEAL HAS SPOKEN</small><h3>{sorted.name}</h3><p>{sorted.trait}</p><em>Your house is now sealed into your registration.</em></motion.div>}</AnimatePresence></div>}
 const terms=['I understand the fee for the full conference is 105 TND.','I understand I must pay an advance of at least 50 TND within 48 hours.','I understand the advance payment is non-refundable if I cancel.','I accept the 100% cancellation fee if I cancel after confirmation.','I agree to pay +50 TND if I choose a single room.','I understand bus fees are separate: 30 TND round trip or 20 TND one-way/return only.','I understand tote bag is optional and costs 15 TND.','I confirm my information is accurate and I will comply with the rules.','No refunds for no-shows or late cancellations.']
 return <div className="terms"><div className="terms-scroll">{terms.map(t=><p key={t}><Check size={15}/>{t}</p>)}</div><label className={`final-check ${form.terms?'checked':''}`}><input type="checkbox" checked={form.terms} onChange={e=>set('terms',e.target.checked)}/><span>{form.terms?<Check/>:null}</span><b>I fully agree to the terms and conditions outlined above.</b></label>{errors.terms&&<small className="error">You must accept the terms before sending your letter.</small>}</div>
}

function Registration({open,onClose}){
 const [step,setStep]=useState(0),[form,setForm]=useState(initialForm),[errors,setErrors]=useState({}),[sending,setSending]=useState(false),[success,setSuccess]=useState(false)
 const [selectedPhoto,setSelectedPhoto]=useState(null),[photoError,setPhotoError]=useState('')
 const [submissionStage,setSubmissionStage]=useState('preparing')
 const submitLock=useRef(false)
 useEffect(()=>{document.body.classList.toggle('modal-open',open);return()=>document.body.classList.remove('modal-open')},[open])
 const set=(k,v)=>{setForm(x=>({...x,[k]:v}));setErrors(x=>({...x,[k]:''}))}
 const validate=()=>{let e={};const req={0:['fullName','country','entityName','lcName','position','email','phone','emergencyPhone','gender','birthDate'],1:['allergies','chronic','dietary'],2:['goals','topics'],3:['communication']};(req[step]||[]).forEach(k=>{if(!form[k]?.trim())e[k]='This field is required.'});if(step===0&&form.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))e.email='Enter a valid email address.';if(step===1&&form.allergies==='Yes'&&!form.allergyDetails.trim())e.allergyDetails='Please add allergy details.';if(step===1&&['Yes','Other'].includes(form.chronic)&&!form.chronicDetails.trim())e.chronicDetails='Please add condition details.';if(step===3&&form.communication==='Other'&&!form.communicationOther.trim())e.communicationOther='Please specify your preferred method.';if(step===5)quiz.forEach((_,i)=>{if(!form.quizAnswers[i])e[`quiz${i}`]='Required'});if(step===6&&!form.terms)e.terms='Required';setErrors(e);return !Object.keys(e).length}
 const resultHouse=useMemo(()=>{const score={phoenix:0,serpent:0,raven:0,badger:0};Object.values(form.quizAnswers).forEach(h=>score[h]++);return Object.entries(score).sort((a,b)=>b[1]-a[1])[0][0]},[form.quizAnswers])
 const next=()=>{if(validate())setStep(s=>Math.min(6,s+1))}
 const submit=async()=>{
  if(submitLock.current||sending)return
  if(!validate()||photoError)return
  submitLock.current=true
  setSending(true)
  setErrors({})
  setSubmissionStage('preparing')
  try{
    const uploadPhoto=selectedPhoto?await optimizePhotoForUpload(selectedPhoto):null
    if(selectedPhoto)console.info('[TANIT Registration] Photo optimized:',{originalBytes:selectedPhoto.size,uploadBytes:uploadPhoto.size})
    setSubmissionStage('encoding')
    const photoBase64=uploadPhoto?await fileToBase64(uploadPhoto):''
    const busPrices={none:0,round:30,oneway:20,return:20}
    const totalPrice=105+(form.room==='single'?50:0)+(busPrices[form.bus]||0)+(form.tote==='yes'?15:0)
    const payload={fullName:form.fullName,country:form.country,entityName:form.entityName,lcName:form.lcName,aiesecPosition:form.position,cinNumber:form.cin,email:form.email,phone:form.phone,emergencyPhone:form.emergencyPhone,gender:form.gender,dateOfBirth:form.birthDate,allergies:form.allergies,allergyDetails:form.allergyDetails,chronicConditions:form.chronic,chronicDetails:form.chronicDetails,dietaryRestrictions:form.dietary,goals:form.goals,sessions:form.topics,support:form.support,communicationMethod:form.communication==='Other'?form.communicationOther:form.communication,photoName:selectedPhoto?.name||'',photoType:selectedPhoto?.type||'',photoBase64:uploadPhoto?photoBase64:'',finalComments:form.comments,singleRoom:form.room==='single'?'Yes (+50 TND)':'No (Shared accommodation)',busOption:form.bus,toteBag:form.tote,house:form.house||houses[resultHouse].name,totalPrice,termsAccepted:form.terms}
    const debugPayload={...payload,photoBase64:payload.photoBase64?`[Base64 omitted: ${payload.photoBase64.length} characters]`:''}
    console.info('[TANIT Registration] Submitting payload:',debugPayload)
    const url=import.meta.env.VITE_GOOGLE_SCRIPT_URL
    if(!url||url.includes('YOUR_APPS'))throw new Error('Google Apps Script URL is not configured.')
    setSubmissionStage('sending')
    const res=await fetch(url,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},redirect:'follow',body:JSON.stringify(payload)})
    if(!res.ok)throw new Error(`Registration service returned HTTP ${res.status}.`)
    setSubmissionStage('sealing')
    const data=await res.json()
    console.info('[TANIT Registration] Apps Script response:',data)
    if(!data.success){const driveDenied=/DriveApp|Drive photo access|رفض الدخول|Access denied/i.test(data.error||'');throw new Error(driveDenied?'Google Drive photo access is not authorized. The administrator must run authorizeDrive() in Apps Script, then redeploy the Web App.':(data.error||'Registration could not be saved.'))}
    setForm(x=>({...x,house:payload.house}))
    setSuccess(true)
  }catch(err){
    console.error('[TANIT Registration] Submission failed:',err)
    const message=err instanceof TypeError?'Unable to reach the registration service. Please check your connection and try again.':(err.message||'Registration could not be sent.')
    setErrors({submit:message})
  }finally{
    submitLock.current=false
    setSending(false)
  }
 }
 const downloadLetter=()=>{const c=document.createElement('canvas');c.width=1200;c.height=1500;const x=c.getContext('2d'),h=houses[resultHouse];const g=x.createLinearGradient(0,0,1200,1500);g.addColorStop(0,'#f3e5c3');g.addColorStop(1,'#c8aa70');x.fillStyle=g;x.fillRect(0,0,c.width,c.height);x.strokeStyle='#6f5128';x.lineWidth=8;x.strokeRect(55,55,1090,1390);x.strokeStyle=h.color;x.lineWidth=3;x.strokeRect(78,78,1044,1344);x.textAlign='center';x.fillStyle='#6f5128';x.font='28px Cinzel';x.fillText('BY ORDER OF THE TANIT ACADEMY',600,175);x.fillStyle='#2f2518';x.font='58px Cinzel';x.fillText('YOUR LETTER HAS ARRIVED',600,300);x.font='italic 42px serif';x.fillText('Dear',600,410);x.fillStyle='#76283a';x.font='66px Cinzel';x.fillText(form.fullName,600,500);x.fillStyle='#463821';x.font='34px serif';x.fillText('You are officially invited to TANIT 4.0',600,610);x.fillText('and have been assigned to',600,675);x.fillStyle=h.color;x.font='62px Cinzel';x.fillText(houses[resultHouse].name,600,790);x.font='105px serif';x.fillText(houses[resultHouse].icon,600,930);x.fillStyle='#463821';x.font='28px Cinzel';x.fillText(`${form.lcName}  ·  ${form.country}`,600,1040);x.font='italic 30px serif';x.fillText('The academy awaits you.',600,1170);x.fillStyle='#78273a';x.beginPath();x.arc(600,1310,62,0,Math.PI*2);x.fill();x.fillStyle='#e1bd63';x.font='50px Cinzel';x.fillText('T',600,1328);const a=document.createElement('a');a.download=`TANIT-4-letter-${form.fullName.replace(/\s+/g,'-')}.png`;a.href=c.toDataURL('image/png');a.click()}
  return <AnimatePresence>{open&&<motion.div className="modal" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><button className="modal-close" onClick={onClose} disabled={sending}><X/></button><AnimatePresence>{sending&&<SendingOverlay stage={submissionStage} photoName={selectedPhoto?.name}/>}</AnimatePresence>{success?<Success form={form} house={houses[resultHouse]} download={downloadLetter}/>:<motion.div className="form-shell" initial={{y:35,opacity:0,scale:.97}} animate={{y:0,opacity:1,scale:1}}><div className="form-aside"><div className="form-logo"><img src={logoUrl} alt="TANIT 4.0"/></div><div className="aside-fee"><span>CONFERENCE FEE</span><strong>105 <small>TND</small></strong><em>PER NIGHT</em></div><p>ENROLLMENT</p><h2>Claim your place at the academy.</h2><div className="step-list">{steps.map((s,i)=><button key={s} onClick={()=>i<step&&setStep(i)} className={`${i===step?'active':''} ${i<step?'done':''}`}><span>{i<step?<Check size={14}/>:i+1}</span><div><small>CHAPTER {i+1}</small>{s}</div></button>)}</div></div><div className="form-main"><div className="mobile-progress"><img src={logoUrl} alt=""/><span>Chapter {step+1} of 7</span><b>{steps[step]}</b><i><em style={{width:`${((step+1)/7)*100}%`}}/></i></div><AnimatePresence mode="wait" initial={false}><motion.div className="form-chapter" key={step} initial={{opacity:0,x:55,rotateY:5,scale:.985}} animate={{opacity:1,x:0,rotateY:0,scale:1}} exit={{opacity:0,x:-45,rotateY:-4,scale:.985}} transition={{duration:.42,ease:[.22,.75,.25,1]}}><div className="form-heading"><span>CHAPTER {step+1}</span><h2>{steps[step]}</h2><p>{['Tell us who will be receiving the letter.','Help us take thoughtful care of you.','What do you hope to discover?','Make your experience feel made for you.','Choose the details of your stay.','Let the academy reveal your house.','One final promise before your letter is sealed.'][step]}</p></div><FormStep step={step} form={form} set={set} errors={errors} selectedPhoto={selectedPhoto} setSelectedPhoto={setSelectedPhoto} photoError={photoError} setPhotoError={setPhotoError}/></motion.div></AnimatePresence>{errors.submit&&<div className="submit-error">{errors.submit}</div>}<div className="form-actions">{step>0?<button className="back" onClick={()=>setStep(s=>s-1)}><ChevronLeft/>Back</button>:<span/>}{step<6?<button className="gold-button" onClick={next}>Continue <ChevronRight/></button>:<button className="gold-button" onClick={submit} disabled={sending}>{sending?'Sending your owl…':'Seal & send registration'} {!sending&&<Feather/>}</button>}</div></div></motion.div>}</motion.div>}</AnimatePresence>
}

function Success({form,house,download}){return <div className="success"><div className="success-sky">{[...Array(42)].map((_,i)=><i key={i} style={{left:`${(i*43)%100}%`,top:`${(i*29)%100}%`,animationDelay:`-${i/4}s`}}/>)}<motion.div className="success-owl-image" initial={{x:'-120vw',y:60,rotate:-8}} animate={{x:'120vw',y:-35,rotate:5}} transition={{duration:1.6,ease:[.35,.05,.65,.95]}}><img src={owlAsset} alt="Owl delivering your TANIT letter"/></motion.div>{[...Array(18)].map((_,i)=><motion.b className="success-spark" key={i} initial={{opacity:0,scale:0,x:0,y:0}} animate={{opacity:[0,1,0],scale:[0,1.4,.4],x:Math.cos(i)*180,y:Math.sin(i)*180}} transition={{delay:.12+i*.018,duration:.8}}>✦</motion.b>)}</div><motion.div className="open-letter" initial={{scale:.72,rotateX:35,opacity:0,y:20}} animate={{scale:1,rotateX:0,opacity:1,y:0}} transition={{delay:.08,duration:.38,type:'spring',damping:20}}><motion.span className="mini-seal" initial={{scale:0,rotate:-80}} animate={{scale:1,rotate:0}} transition={{delay:.25,type:'spring'}}>T</motion.span><small>BY ORDER OF THE TANIT ACADEMY</small><h2>Your letter has arrived,<br/><em>{form.fullName}</em></h2><p>Welcome to TANIT 4.0</p><motion.div className="house-reveal" style={{'--house':house.color}} initial={{opacity:0,y:7}} animate={{opacity:1,y:0}} transition={{delay:.32}}><b>{house.icon}</b><div>You have been assigned to<strong>{house.name}</strong><small>{house.trait}</small></div></motion.div><motion.button className="gold-button" onClick={download} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} transition={{delay:.42}}><Download/> Download your letter</motion.button></motion.div></div>}

function Contact(){return <><section id="contact" className="section contact"><SectionTitle eyebrow="THE OWLERY" title="Send word to the academy" copy="Questions about your invitation? Our keepers are never far from the owlery."/><div className="contact-links"><a href="https://www.instagram.com/ittt_tanit/?hl=ar" target="_blank" rel="noreferrer"><Camera/><div><small>THE MOVING PORTRAITS</small>Instagram</div><ArrowRight/></a><a href="https://www.facebook.com/groups/1031234249068230?locale=fr_FR" target="_blank" rel="noreferrer"><Users/><div><small>THE COMMON ROOM</small>Facebook Group</div><ArrowRight/></a><a href="mailto:aminebenattaya2005@gmail.com"><Mail/><div><small>OWL POST</small>Email us</div><ArrowRight/></a></div></section><footer><div className="brand"><img src={logoUrl} alt="TANIT 4.0"/><div>TANIT <small>THE FOURTH CHAPTER</small></div></div></footer></>}

export default function App(){const [registration,setRegistration]=useState(false);return <><MagicTrail/><GlobalMagic/><OwlDelivery/><Nav onRegister={()=>setRegistration(true)}/><main><Home onRegister={()=>setRegistration(true)}/><About/><Houses/><Team/><Contact/></main><MusicPlayer/><Registration open={registration} onClose={()=>setRegistration(false)}/></>}
