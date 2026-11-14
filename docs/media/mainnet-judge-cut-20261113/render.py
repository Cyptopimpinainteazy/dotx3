"""Reproducible narrated evidence cut. Run: uv run --with pillow python render.py."""
from pathlib import Path
import json,math,subprocess,textwrap,hashlib,shutil
from PIL import Image,ImageDraw,ImageFont
ROOT=Path(__file__).resolve().parent
AS=ROOT/'assets';OUT=ROOT/'output';OUT.mkdir(exist_ok=True)
n=json.loads((AS/'narration.json').read_text());r=json.loads((AS/'invoice06-verifier.json').read_text())
W,H=1920,1080
BG='#09111e';FG='#edf5fa';MUTED='#a4b4c9';ACCENT='#5ef0bf';PINK='#d69dff'
FONT='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf';BOLD=FONT.replace('.ttf','-Bold.ttf');MONO=FONT.replace('DejaVuSans.ttf','DejaVuSansMono.ttf')
def font(size,bold=False,mono=False):return ImageFont.truetype(MONO if mono else BOLD if bold else FONT,size)
def txt(d,xy,text,size=32,color=FG,bold=False,mono=False):
 d.text(xy,text,font=font(size,bold,mono),fill=color)
def wrap(d,text,x,y,width,size=32,color=FG,bold=False,mono=False,gap=12):
 f=font(size,bold,mono);line=''
 for word in text.split():
  candidate=(line+' '+word).strip()
  if d.textlength(candidate,font=f)>width and line:
   d.text((x,y),line,font=f,fill=color);y+=size+gap;line=word
  else:line=candidate
 if line:d.text((x,y),line,font=f,fill=color);y+=size+gap
 return y
def panel(d,box,title):
 d.rounded_rectangle(box,radius=24,fill='#101f31',outline='#29435c',width=2)
 txt(d,(box[0]+28,box[1]+22),title,25,ACCENT,True)
def plate(i,title,sub,label):
 im=Image.new('RGB',(W,H),BG);d=ImageDraw.Draw(im)
 for y in range(H):
  c=(9+int(5*y/H),17+int(8*y/H),30+int(12*y/H));d.line((0,y,W,y),fill=c)
 d.rectangle((0,0,W,8),fill=ACCENT)
 txt(d,(80,48),'X3 FORCE FIELD',32,FG,True);txt(d,(1300,54),label,24,ACCENT,True)
 txt(d,(80,130),title,68,FG,True);wrap(d,sub,82,231,1750,30,MUTED)
 d.rectangle((0,910,W,1040),fill='#050a13')
 for j in range(8):d.rounded_rectangle((80+j*220,880,80+j*220+195,886),radius=3,fill=ACCENT if j<=i else '#23374c')
 txt(d,(80,1048),'invoice_06  /  source: f6543af  /  archive replay, not a new payment',19,MUTED)
 txt(d,(1600,1048),f'{i+1:02d} / 08',19,MUTED)
 return im,d
plates=[]
im,d=plate(0,'Who decides who gets paid?','An agent proposes. The owner writes the rules. Deterministic checks decide.','ONE RECORDED PAYMENT')
for box,title,value,tail in [((80,355,895,820),'SOLANA MAINNET','25 USDC','Owner manually funded'),((1025,355,1840,820),'NEAR MAINNET','24.9952 USDC','Paid to x3lang.near')]:
 panel(d,box,title);txt(d,(box[0]+35,box[1]+125),value,72,ACCENT,True);txt(d,(box[0]+35,box[1]+270),tail,32);txt(d,(box[0]+35,box[1]+335),'Archived finalized transfer',25,MUTED)
plates.append(im)
im,d=plate(1,'The mandate is source code.','These are the original invoice_06 terms, not a different example policy.','SOURCE HASH MATCH')
panel(d,(80,335,1150,850),'ORIGINAL .x3 MANDATE — selected lines')
source=(AS/'mandate-proposed.x3').read_text()
lines=[x.strip() for x in source.splitlines() if any(k in x for k in ['per_payment','per_24h','allow recipients','allow assets','require slippage','require fees','approve above'])]
for j,line in enumerate(lines):txt(d,(112,410+j*55),line,30,FG,mono=True)
panel(d,(1190,335,1840,850),'OWNER-DEFINED LIMITS')
y=420
for line in ['25 USDC / payment','25 USDC / 24 hours','Only x3lang.near','Pinned refund wallet','Approval for this payment']:
 y=wrap(d,line,1222,y,580,33,FG,gap=23)
plates.append(im)
im,d=plate(2,'Unsafe edits are refused.','Real output from the verifier, run against the original mainnet source.','LOCAL / OFF-CHAIN')
panel(d,(80,335,1840,850),'RECORDED TERMINAL OUTPUT — invoice06_chain.py')
output=(AS/'invoice06-verifier.txt').read_text().splitlines();selected=[x for x in output if 'the same payment, edited:' in x or x.strip().startswith('ok  ')]
for j,line in enumerate(selected):txt(d,(112,405+j*44),line.strip(),29,ACCENT if j==0 else FG,mono=True)
plates.append(im)
im,d=plate(3,'A signature is not permission.','Owner approval came first. Guard then checked the signed 1Click quote.','NEAR MAINNET ARCHIVE')
panel(d,(80,335,1010,850),'RESTRICTED-AGENT ACCEPTANCE RECEIPT')
txt(d,(115,412),f"{r['guard']['ok']} / {r['guard']['checks']}",115,ACCENT,True);txt(d,(120,555),'Guard checks passed',39)
for j,t in enumerate(['agent_accept_quote','x3-agent.x3lang.near','Block 224149400','Eg75uehw…Agu153']):txt(d,(120,635+j*39),t,28,MUTED,mono=True)
panel(d,(1050,335,1840,850),'AUTHENTICATED TERMS')
txt(d,(1085,420),'24.770243 USDC',54,ACCENT,True);txt(d,(1085,500),'Signed quote minimum',30)
txt(d,(1085,585),'24.75 USDC',54,FG,True);txt(d,(1085,665),'Policy floor',30)
wrap(d,'Acceptance authorizes an address. It does not transfer funds.',1085,745,710,27,PINK)
plates.append(im)
im,d=plate(4,'Two finalized transfer records.','The owner manually signed the Solana deposit. The provider associates the two legs.','SOLANA + NEAR MAINNET')
for box,title,amount,account,tx in [((80,335,895,850),'SOLANA DEPOSIT','25.000000','Owner funding wallet',r['payment']['solana_tx']),((1025,335,1840,850),'NEAR PAYOUT','24.995200','intents.near → x3lang.near',r['payment']['payout_tx'])]:
 panel(d,box,title);txt(d,(box[0]+35,box[1]+110),amount,80,ACCENT,True);txt(d,(box[0]+35,box[1]+220),'USDC',36);wrap(d,account,box[0]+35,box[1]+295,740,30);txt(d,(box[0]+35,box[1]+390),tx[:12]+'…'+tx[-8:],27,MUTED,mono=True)
txt(d,(907,545),'84 s',31,PINK,True)
plates.append(im)
im,d=plate(5,'Recorded outcome ≠ chain proof.','The outcome is the agent’s report. Transfer receipts are separate evidence.','NEAR MAINNET ARCHIVE')
panel(d,(80,335,1130,850),'agent_record_outcome — stored result')
fields=[('status',r['outcome']['status']),('amount_out',r['outcome']['amount_out']),('floor_met',str(r['outcome']['floor_met']).lower()),('cites_payout',str(r['outcome']['cites_payout']).lower())]
for j,(k,v) in enumerate(fields):txt(d,(115,420+j*85),k,36,MUTED,mono=True);txt(d,(590,420+j*85),v,42,ACCENT,True)
panel(d,(1170,335,1840,850),'WHAT GUARD DOES NOT DO')
y=425
for line in ['Does not authenticate outcome hashes','Does not custody the swap funds','Does not prove cross-chain atomicity']:
 y=wrap(d,line,1205,y,590,35,FG,gap=14)+25
plates.append(im)
im,d=plate(6,'Six core. Three additional.','Nine indexed capabilities — each with a proof path and a boundary.','SEPARATE EVIDENCE LEVELS')
panel(d,(80,335,960,850),'CORE PAYMENT CAPABILITIES')
for j,t in enumerate(['Typed owner policy','Checks outside the model','Signed quote terms','Source-to-payment traceability','Restricted agent methods','Reproducible verification']):txt(d,(115,410+j*65),f'{j+1:02d}  '+t,32,FG)
panel(d,(1000,335,1840,850),'ADDITIONAL LOCAL PROTOTYPES')
y=420
for line in ['Signed child admission','Durable retirement + review','Scoped vault on NEAR Sandbox']:
 y=wrap(d,line,1035,y,760,36,FG,gap=14)+35
wrap(d,'Trusted local host / scripted jurors / no public-chain custody claim',1035,750,740,26,PINK)
plates.append(im)
im,d=plate(7,'Inspect it. Reproduce it.','Start with JUDGES.md. Follow the pinned snapshot and the five-link verifier.','LIMITS INCLUDED')
panel(d,(80,335,1010,850),'KEEP THESE BOUNDARIES VISIBLE')
y=420
for line in ['One owner-assisted ~$25 run','Guard is noncustodial','Owner FullAccess recovery key remains','No native X3VM execution on-chain']:
 y=wrap(d,line,115,y,850,34,FG,gap=14)+23
panel(d,(1050,335,1840,850),'PUBLIC SOURCE + PROOF')
txt(d,(1085,425),'github.com/',42,ACCENT,True);txt(d,(1085,490),'Cyptopimpinainteazy/',36,ACCENT,True);txt(d,(1085,550),'x3lang',64,ACCENT,True)
txt(d,(1085,665),'Pinned replay snapshot: cd19233',28,MUTED)
txt(d,(1085,725),'dotx3.net / proof',43,FG,True)
plates.append(im)
# Preserve exact source evidence and a machine-readable asset manifest.
for i,im in enumerate(plates):im.save(AS/f'scene-{i:02d}.png')
# Speech-timed caption groups, using returned word timestamps rather than guessed timings.
def stamp(t):
 cs=round(t*100);return f'{cs//360000}:{cs//6000%60:02}:{cs//100%60:02}.{cs%100:02}'
header='''[Script Info]\nScriptType: v4.00+\nPlayResX: 1920\nPlayResY: 1080\nWrapStyle: 0\n[V4+ Styles]\nFormat: Name,Fontname,Fontsize,PrimaryColour,SecondaryColour,OutlineColour,BackColour,Bold,Italic,Underline,StrikeOut,ScaleX,ScaleY,Spacing,Angle,BorderStyle,Outline,Shadow,Alignment,MarginL,MarginR,MarginV,Encoding\nStyle: Default,DejaVu Sans,43,&H00FFFFFF,&H000000FF,&H00050910,&H00050910,0,0,0,0,100,100,0,0,1,2,0,2,110,110,58,1\n[Events]\nFormat: Layer,Start,End,Style,Name,MarginL,MarginR,MarginV,Effect,Text\n'''
words=n['words'];caps=[];group=[]
for word in words:
 group.append(word)
 if len(group)>=8 or word['text'].endswith(('.', '?', ':', ';')):
  caps.append(group);group=[]
if group:caps.append(group)
ass=header;srt=[]
for i,group in enumerate(caps):
 start=group[0]['start_time'];end=group[-1]['end_time']+0.08;text=' '.join(w['text'] for w in group).replace('{','').replace('}','')
 ass+=f'Dialogue: 0,{stamp(start)},{stamp(end)},Default,,0,0,0,,{text}\n'
 def srtstamp(t):
  ms=round(t*1000);return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}'
 srt.append(f'{i+1}\n{srtstamp(start)} --> {srtstamp(end)}\n{text}\n')
(AS/'captions.ass').write_text(ass);(OUT/'x3-force-field-mainnet.srt').write_text('\n'.join(srt))
# No artificial holds or retiming: picture length derives from the narration master.
timeline=[]
for i in range(8):
 start=n['starts'][i];end=n['starts'][i+1] if i<7 else n['duration']
 timeline.append({'scene':i+1,'start':start,'end':end,'narration':n['paragraphs'][i]})
(ROOT/'timeline.json').write_text(json.dumps(timeline,indent=2)+'\n')
# This host's FFmpeg lacks libass; render caption states with Pillow at frame boundaries.
caption_intervals=[(g[0]['start_time'],g[-1]['end_time']+0.08,' '.join(w['text'] for w in g)) for g in caps]
boundaries={0,round(n['duration']*30)}
for t in n['starts']:boundaries.add(round(t*30))
for a,b,_ in caption_intervals:boundaries.update([round(a*30),round(b*30)])
boundaries=sorted(x for x in boundaries if 0<=x<=round(n['duration']*30))
concat=['ffconcat version 1.0']
for k,(a,b) in enumerate(zip(boundaries,boundaries[1:])):
 t=(a+b)/60
 i=max(j for j,start in enumerate(n['starts']) if start<=t)
 im=plates[i].copy();d=ImageDraw.Draw(im)
 caption=next((text for start,end,text in caption_intervals if start<=t<end),'')
 if caption:
  f=font(43);lines=[];line=''
  for word in caption.split():
   test=(line+' '+word).strip()
   if d.textlength(test,font=f)>1660 and line:lines.append(line);line=word
   else:line=test
  if line:lines.append(line)
  assert len(lines)<=2,(caption,lines)
  y=949 if len(lines)==1 else 924
  for line in lines:
   x=(W-d.textlength(line,font=f))/2;d.text((x,y),line,font=f,fill=FG);y+=53
 frame=AS/f'caption-state-{k:03d}.png';im.save(frame)
 concat += [f"file '{frame.as_posix()}'",'option framerate 30',f'duration {(b-a)/30:.9f}']
concat += [f"file '{frame.as_posix()}'", "option framerate 30"]
(AS/'timeline.ffconcat').write_text('\n'.join(concat)+'\n')
manifest={'source_commit':n['source_commit'],'dimensions':[1920,1080],'fps':30,'voice':{'provider':n['provider'],'voice':n['voice_name'],'voice_id':n['voice_id']},'audio_duration':n['duration'],'music':'none; narration owns the mix','evidence':'Original source excerpts and actual invoice verifier output over committed archived receipts. No new chain action.','asset_sha256':{p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in AS.iterdir() if p.suffix in ['.wav','.json','.x3','.txt']}}
(ROOT/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
cmd=['ffmpeg','-nostdin','-y','-v','warning','-f','concat','-safe','0','-i',str(AS/'timeline.ffconcat'),'-i',str(AS/'narration.wav'),'-map','0:v:0','-map','1:a:0','-vf',"fps=30,format=yuv420p",'-af','aresample=48000,loudnorm=I=-16:TP=-1.5:LRA=11','-t',str(n['duration']),'-c:v','libx264','-preset','fast','-crf','20','-c:a','aac','-ar','48000','-b:a','192k','-movflags','+faststart','-color_primaries','bt709','-color_trc','bt709','-colorspace','bt709',str(OUT/'x3-force-field-mainnet-20261113.mp4')]
with (ROOT/'render.log').open('w') as log:subprocess.run(cmd,check=True,stdout=log,stderr=log)
print('RENDERED',OUT/'x3-force-field-mainnet-20261113.mp4')
