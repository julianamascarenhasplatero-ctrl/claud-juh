'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@open-design/components';
import { ArrowDownToLine, ArrowLeft, ArrowUpRight, Check, Code2, Monitor, Palette, Plus, Smartphone, Sparkles, Upload } from 'lucide-react';
import { artifact, brief, contrast, initialProject, logoSvg, parseProject, templates, tokens, type StudioProject } from './artifacts';
import styles from './DesignStudio.module.css';

const storageKey = 'juh-design:studio:v1';
export default function DesignStudio() {
  const [project, setProject] = useState<StudioProject>(initialProject);
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState('');
  const [group, setGroup] = useState('Todos');
  const [view, setView] = useState<'preview' | 'code'>('preview');
  const [mobile, setMobile] = useState(false);
  const file = useRef<HTMLInputElement>(null);
  useEffect(() => { try { const stored = localStorage.getItem(storageKey); if (stored) setProject(parseProject(JSON.parse(stored))); } catch { setStatus('Não foi possível recuperar o projeto salvo. Importe um backup para continuar.'); } setReady(true); }, []);
  useEffect(() => { if (!ready) return; try { localStorage.setItem(storageKey, JSON.stringify(project)); setStatus('Alterações salvas neste navegador'); } catch { setStatus('Armazenamento indisponível. Exporte o projeto para guardar suas alterações.'); } }, [project, ready]);
  const update = <K extends keyof StudioProject>(key: K, value: StudioProject[K]) => setProject(p => ({ ...p, [key]: value }));
  const html = artifact(project);
  const current = templates.find(t => t.id === project.template)!;
  function download(content: string, ext: string, mime: string) { const url = URL.createObjectURL(new Blob([content], { type: mime })); const a = document.createElement('a'); a.href = url; a.download = `juh-${project.template}.${ext}`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); setStatus(`Arquivo ${ext.toUpperCase()} exportado`); }
  async function importFile(selected?: File) { if (!selected) return; try { if (selected.size > 200000) throw new Error('Arquivo muito grande. Limite: 200 KB.'); setProject(parseProject(JSON.parse(await selected.text()))); setStatus('Projeto importado'); } catch (error) { setStatus(error instanceof Error ? error.message : 'Não foi possível importar.'); } if (file.current) file.current.value = ''; }
  function handoff() { try { sessionStorage.setItem('juh-design:brief', brief(project)); window.location.assign('/'); } catch { setStatus('Não foi possível transferir. Exporte o briefing e cole na conversa do OpenDesign.'); } }
  return <main className={styles.studio} lang="pt-BR">
    <aside className={styles.sidebar}>
      <a className={styles.logo} href="/estudio"><span>j.</span> juh design<small>SEU ESTÚDIO CRIATIVO</small></a>
      <Button className={styles.newProject} onClick={() => { if (window.confirm('Começar um novo projeto? Exporte o atual se quiser mantê-lo.')) { setProject(initialProject); setGroup('Todos'); } }}><Plus size={16}/> Novo projeto</Button>
      <p className={styles.label}>ESPAÇO DE CRIAÇÃO</p>
      <nav aria-label="Áreas de design">{['Todos', ...new Set(templates.map(t => t.group))].map((item, i) => <Button key={item} className={`${styles.navItem} ${group === item ? styles.active : ''}`} onClick={() => setGroup(item)} aria-pressed={group === item}><span>{['◈','▤','◐','▧','◇','▦','⊞'][i]}</span>{item}</Button>)}</nav>
      <div className={styles.sidebarBottom}><div className={styles.note}><Sparkles size={18}/><strong>Da ideia à expressão.</strong><p>Explore no estúdio. Refine com IA no OpenDesign.</p><Button onClick={handoff}>Continuar com IA <ArrowUpRight size={14}/></Button></div><a href="/"><ArrowLeft size={14}/> Abrir OpenDesign</a></div>
    </aside>
    <div className={styles.workspace}>
      <header className={styles.topbar}><span>Workspace <span className={styles.slash}>/</span> <b>Estúdio de design</b></span><div><span className={styles.local}><i/> Local</span><Button onClick={() => file.current?.click()}><Upload size={14}/> Importar</Button><Button className={styles.darkButton} onClick={() => download(JSON.stringify(project,null,2),'json','application/json')}><ArrowDownToLine size={14}/> Salvar projeto</Button></div></header>
      <input ref={file} type="file" accept=".json,application/json" hidden onChange={e => void importFile(e.target.files?.[0])}/>
      <section className={styles.heading}><div><p className={styles.label}>UM ESPAÇO PARA SUAS PRÓXIMAS IDEIAS</p><h1>O que vamos criar <em>hoje?</em></h1><p>Sua marca, do primeiro conceito ao último detalhe.</p></div><span className={styles.edition}>JUH DESIGN<br/>ESTÚDIO / 01</span></section>
      <section className={styles.templates} aria-label="Modelos de criação">{templates.filter(t => group === 'Todos' || t.group === group).map((t, i) => <Button key={t.id} onClick={() => update('template',t.id)} className={`${styles.template} ${project.template === t.id ? styles.selected : ''}`} aria-pressed={project.template === t.id}><span className={styles.templateIcon}>{['◰','▥','⊞','Aa','◐','▤','◇','▦','◈'][templates.indexOf(t)]}</span><strong>{t.name}</strong><small>{t.description}</small><span className={styles.templateNumber}>{String(i+1).padStart(2,'0')} {project.template === t.id ? '✓' : '↗'}</span></Button>)}</section>
      <section className={styles.editor} aria-label="Editor do projeto">
        <div className={styles.editorHeader}><div><span className={styles.dot}/><strong>{current.name}</strong><span className={styles.badge}>EDITÁVEL</span></div><span className={styles.saved}><Check size={13}/> <span role="status">{status}</span></span></div>
        <div className={styles.editorBody}>
          <div className={styles.controls}><h2><Palette size={15}/> Direção criativa</h2><label>Nome da marca<input value={project.brand} maxLength={80} onChange={e => update('brand',e.target.value)}/></label><label>Título principal<textarea rows={2} value={project.title} maxLength={300} onChange={e => update('title',e.target.value)}/></label><label>Descrição / atmosfera<textarea rows={3} value={project.body} maxLength={2000} onChange={e => update('body',e.target.value)}/></label><div className={styles.colors}><label>Principal<input type="color" value={project.color} onChange={e => update('color',e.target.value)}/><small>{project.color}</small></label><label>Fundo<input type="color" value={project.background} onChange={e => update('background',e.target.value)}/><small>{project.background}</small></label></div><p className={styles.contrast}>Contraste: {contrast(project.color,project.background).toFixed(2)}:1 · {contrast(project.color,project.background)>=4.5 ? 'AA texto normal' : 'Abaixo de AA'}</p><label>Tipografia<select value={project.font} onChange={e => update('font',e.target.value as StudioProject['font'])}><option value="serif">Editorial · Serifada</option><option value="sans-serif">Contemporânea · Sem serifa</option></select></label><label>Cantos · {project.radius}px<input type="range" min="0" max="40" value={project.radius} onChange={e => update('radius',Number(e.target.value))}/></label><label>Chamada para ação<input value={project.cta} maxLength={100} onChange={e => update('cta',e.target.value)}/></label><label>Conteúdo<textarea rows={5} value={project.items} maxLength={12000} onChange={e => update('items',e.target.value)}/><small>Um item ou slide por linha: título | descrição</small></label></div>
          <div className={styles.canvas}><div className={styles.canvasToolbar}><div><Button aria-pressed={view==='preview'} onClick={()=>setView('preview')}>Prévia</Button><Button aria-pressed={view==='code'} onClick={()=>setView('code')}><Code2 size={13}/> Código HTML</Button></div><div><Button aria-label="Prévia desktop" aria-pressed={!mobile} onClick={()=>setMobile(false)}><Monitor size={15}/></Button><Button aria-label="Prévia celular" aria-pressed={mobile} onClick={()=>setMobile(true)}><Smartphone size={15}/></Button></div></div><div className={styles.previewArea}>{view==='preview' ? <iframe title={`Prévia de ${current.name}`} sandbox="allow-scripts" srcDoc={html} className={mobile ? styles.mobile : styles.desktop}/> : <textarea className={styles.code} readOnly aria-label="Código HTML para exportação" value={html}/>}</div><div className={styles.exportbar}><span>PRONTO PARA GANHAR O MUNDO</span><div><Button onClick={()=>download(brief(project),'md','text/markdown')}>Briefing</Button><Button onClick={()=>download(JSON.stringify(tokens(project),null,2),'tokens.json','application/json')}>Tokens</Button><Button onClick={()=>download(logoSvg(project),'svg','image/svg+xml')}>Logo SVG</Button><Button className={styles.darkButton} onClick={()=>download(html,'html','text/html')}><ArrowDownToLine size={14}/> Exportar HTML</Button></div></div></div>
        </div>
      </section><footer className={styles.footer}>Modelos locais editáveis · A geração por IA requer um modelo configurado no OpenDesign.<Button onClick={handoff}><Sparkles size={14}/> Refinar este briefing com IA <ArrowUpRight size={14}/></Button></footer>
    </div>
  </main>;
}
