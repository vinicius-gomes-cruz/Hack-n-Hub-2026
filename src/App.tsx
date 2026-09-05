import { ChangeEvent, FormEvent, useState } from 'react';
import './App.css';

const events = [
  {
    day: '08',
    month: 'SET',
    category: 'Música',
    title: 'Roda de Choro na Praça',
    place: 'Praça da Matriz',
    time: '18h30',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=80',
    tone: 'coral',
  },
  {
    day: '10',
    month: 'SET',
    category: 'Cinema',
    title: 'Cinema na Rua: O Auto da Compadecida',
    place: 'Coreto Municipal',
    time: '19h',
    image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=900&q=80',
    tone: 'gold',
  },
  {
    day: '12',
    month: 'SET',
    category: 'Exposição',
    title: 'Memórias do Nosso Lugar',
    place: 'Casa da Cultura',
    time: '09h às 17h',
    image: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=900&q=80',
    tone: 'blue',
  },
  {
    day: '14',
    month: 'SET',
    category: 'Teatro',
    title: 'A Menina e o Vento',
    place: 'Teatro Municipal',
    time: '16h',
    image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=900&q=80',
    tone: 'green',
  },
];

const notices = [
  { id: 'cultura-em-movimento', category: 'Fomento cultural', title: 'Cultura em Movimento 2026', description: 'Apoio a projetos que ocupem os espaços culturais e as praças da cidade.', deadline: '30 SET', value: 'R$ 5 mil a R$ 20 mil', status: 'Inscrições abertas' },
  { id: 'palco-aberto', category: 'Música e cena', title: 'Palco Aberto', description: 'Seleção de artistas e grupos para a programação dos equipamentos municipais.', deadline: '22 SET', value: 'Cachê de R$ 2 mil', status: 'Inscrições abertas' },
  { id: 'memoria-viva', category: 'Patrimônio', title: 'Memória Viva', description: 'Incentivo a iniciativas que registrem e compartilhem histórias do município.', deadline: '18 SET', value: 'R$ 8 mil por proposta', status: 'Inscrições abertas' },
  { id: 'arte-na-praca', category: 'Artes visuais', title: 'Arte na Praça', description: 'Chamamento para intervenções artísticas em espaços públicos.', deadline: '12 SET', value: 'R$ 6 mil por proposta', status: 'Últimos dias' },
];

const submissions = [
  { id: 'CM-2026-0841', applicant: 'Marina de Souza', proposal: 'Corpo-território: dança nas praças', notice: 'Cultura em Movimento 2026', date: '05 set, 14h20', documents: '3 de 3', status: 'Em análise' },
  { id: 'PA-2026-0317', applicant: 'Coletivo Roda Viva', proposal: 'Sons da feira livre', notice: 'Palco Aberto', date: '05 set, 10h42', documents: '3 de 3', status: 'Em análise' },
  { id: 'MV-2026-0098', applicant: 'João Augusto Lima', proposal: 'Memórias da Vila Esperança', notice: 'Memória Viva', date: '04 set, 16h08', documents: '3 de 3', status: 'Inscrição inválida' },
  { id: 'AP-2026-0142', applicant: 'Ateliê Horizonte', proposal: 'Cores do encontro', notice: 'Arte na Praça', date: '03 set, 09h15', documents: '3 de 3', status: 'Validada' },
];

const artistSubmissions = [
  { id: 'CM-2026-0841', notice: 'Cultura em Movimento 2026', proposal: 'Corpo-território: dança nas praças', submittedAt: '05 de setembro de 2026', submittedMonth: 'setembro', status: 'Em análise', documents: ['RG_Marina_Souza.pdf', 'Comprovante_endereco.pdf', 'Portfolio_Corpo_Territorio.pdf'], message: 'Sua inscrição foi recebida e aguarda a validação documental.' },
  { id: 'AP-2026-0142', notice: 'Arte na Praça', proposal: 'Cores do encontro', submittedAt: '18 de agosto de 2026', submittedMonth: 'agosto', status: 'Validada', documents: ['RG_Marina_Souza.pdf', 'Comprovante_endereco.pdf', 'Portfolio_Cores.pdf'], message: 'Documentação validada. A proposta seguirá para a etapa de seleção.' },
  { id: 'MV-2026-0098', notice: 'Memória Viva', proposal: 'Memórias da Vila Esperança', submittedAt: '04 de agosto de 2026', submittedMonth: 'agosto', status: 'Inscrição inválida', documents: ['RG_Joao_Augusto.pdf', 'Contrato_de_aluguel.pdf', 'Portfolio_Memorias.pdf'], message: 'A inscrição foi invalidada porque o arquivo enviado como comprovante de residência era um contrato de aluguel sem comprovação de endereço do proponente.' },
];

function App() {
  const [activeView, setActiveView] = useState<'agenda' | 'editais' | 'criar-edital' | 'administracao' | 'revisar-inscricao' | 'minhas-inscricoes'>('agenda');
  const [selectedNotice, setSelectedNotice] = useState<(typeof notices)[number] | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<(typeof submissions)[number] | null>(null);
  const [submissionStep, setSubmissionStep] = useState<1 | 2>(1);
  const [submittedNotices, setSubmittedNotices] = useState<Record<string, boolean>>({});
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File | undefined>>({});
  const [documentsConfirmed, setDocumentsConfirmed] = useState(false);
  const [applicantType, setApplicantType] = useState<'cpf' | 'cnpj'>('cpf');
  const [documentNumber, setDocumentNumber] = useState('');
  const [validationStatus, setValidationStatus] = useState<Record<string, string>>({});
  const [selectedArtistSubmission, setSelectedArtistSubmission] = useState<(typeof artistSubmissions)[number] | null>(null);
  const [artistDateFilter, setArtistDateFilter] = useState('todos');
  const [artistStatusFilter, setArtistStatusFilter] = useState('todos');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmissionStep(2);
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files ? event.target.files[0] : undefined;
    setUploadedFiles({ ...uploadedFiles, [event.target.name]: file });
  }

  function formatDocument(value: string, type: 'cpf' | 'cnpj') {
    const digits = value.replace(/\D/g, '').slice(0, type === 'cpf' ? 11 : 14);

    if (type === 'cpf') {
      return digits
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }

    return digits
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  }

  function openFile(file?: File) {
    if (file) {
      window.open(URL.createObjectURL(file), '_blank');
    }
  }

  function finalizeSubmission() {
    if (selectedNotice) {
      setSubmittedNotices({ ...submittedNotices, [selectedNotice.id]: true });
    }
  }

  if (activeView === 'minhas-inscricoes') {
    const filteredArtistSubmissions = artistSubmissions.filter((submission) => (
      (artistDateFilter === 'todos' || submission.submittedMonth === artistDateFilter)
      && (artistStatusFilter === 'todos' || submission.status === artistStatusFilter)
    ));

    return (
      <main className="app-shell">
        <header className="site-header"><button className="brand brand-button" type="button" onClick={() => setActiveView('agenda')} aria-label="Cultura em movimento, início"><span className="brand-mark">C</span><span>Cultura<br />em movimento</span></button><nav aria-label="Navegação principal"><button type="button" onClick={() => setActiveView('agenda')}>Agenda</button><button type="button" onClick={() => setActiveView('editais')}>Editais</button><button className="nav-active" type="button">Minhas inscrições</button><button type="button" onClick={() => setActiveView('administracao')}>Administração</button></nav><button className="calendar-button" type="button" onClick={() => setActiveView('editais')}>Ver editais</button></header>
        <section className="artist-submissions-page" aria-labelledby="artist-submissions-title">
          <div className="artist-heading"><p className="eyebrow">Área do artista</p><h1 id="artist-submissions-title">Minhas inscrições</h1><p>Acompanhe o andamento das propostas que você enviou para os editais.</p></div>
          <div className="artist-summary"><div><strong>3</strong><span>inscrições enviadas</span></div><div><strong>1</strong><span>em análise</span></div><div><strong>1</strong><span>validada</span></div><div><strong>1</strong><span>inválida</span></div></div>
          <div className="artist-filters" aria-label="Filtros de inscrições"><label>Data de envio<select value={artistDateFilter} onChange={(event) => setArtistDateFilter(event.target.value)}><option value="todos">Todos os períodos</option><option value="setembro">Setembro de 2026</option><option value="agosto">Agosto de 2026</option></select></label><label>Tipo da inscrição<select value={artistStatusFilter} onChange={(event) => setArtistStatusFilter(event.target.value)}><option value="todos">Todos os tipos</option><option value="Em análise">Em análise</option><option value="Validada">Validadas</option><option value="Inscrição inválida">Inválidas</option></select></label><span>{filteredArtistSubmissions.length} resultado{filteredArtistSubmissions.length === 1 ? '' : 's'}</span></div>
          <div className="artist-submission-list">
            {filteredArtistSubmissions.map((submission) => <article className="artist-submission-card" key={submission.id}>
              <div className={`artist-status ${submission.status === 'Validada' ? 'validated' : submission.status === 'Inscrição inválida' ? 'invalidated' : ''}`}><span>{submission.status === 'Validada' ? '✓' : submission.status === 'Inscrição inválida' ? '!' : '…'}</span><strong>{submission.status}</strong></div>
              <div className="artist-submission-info"><p className="event-category">{submission.notice}</p><h2>{submission.proposal}</h2><span>{submission.id} · Enviada em {submission.submittedAt}</span></div>
              <button className="review-button" type="button" onClick={() => setSelectedArtistSubmission(selectedArtistSubmission?.id === submission.id ? null : submission)}>{selectedArtistSubmission?.id === submission.id ? 'Fechar detalhes' : 'Ver detalhes'}</button>
              {selectedArtistSubmission?.id === submission.id && <div className="artist-submission-details"><p>{submission.message}</p><div className="artist-timeline"><span className="timeline-done">Inscrição enviada</span><span className={submission.status === 'Em análise' ? 'timeline-current' : 'timeline-done'}>Validação documental</span><span className={submission.status === 'Validada' ? 'timeline-current' : ''}>Resultado da validação</span></div><div className="artist-documents"><strong>Documentos enviados</strong>{submission.documents.map((document) => <div key={document}><span>PDF</span><p>{document}</p><button className="file-preview-button" type="button">Ver arquivo</button></div>)}</div></div>}
            </article>)}
            {filteredArtistSubmissions.length === 0 && <p className="no-submissions">Nenhuma inscrição encontrada com estes filtros.</p>}
          </div>
        </section>
      </main>
    );
  }

  if (activeView === 'revisar-inscricao' && selectedSubmission) {
    const status = validationStatus[selectedSubmission.id] || selectedSubmission.status;
    const documents = [
      { title: 'Documento de identidade (RG)', file: 'RG_Marina_Souza.pdf', state: 'Conferido' },
      { title: 'Comprovante de residência', file: 'Comprovante_endereco.pdf', state: 'Conferido' },
      { title: 'Portfólio artístico', file: 'Portfolio_Corpo_Territorio.pdf', state: 'Conferido' },
    ];
    return (
      <main className="app-shell">
        <header className="site-header"><button className="brand brand-button" type="button" onClick={() => setActiveView('agenda')} aria-label="Cultura em movimento, início"><span className="brand-mark">C</span><span>Cultura<br />em movimento</span></button><nav aria-label="Navegação principal"><button type="button" onClick={() => setActiveView('agenda')}>Agenda</button><button type="button" onClick={() => setActiveView('editais')}>Editais</button><button className="nav-active" type="button" onClick={() => setActiveView('administracao')}>Administração</button></nav><button className="calendar-button" type="button" onClick={() => setActiveView('administracao')}>Submissões</button></header>
        <section className="review-page" aria-labelledby="review-title">
          <div className="review-title"><button className="back-button" type="button" onClick={() => setActiveView('administracao')}>&larr; Voltar às submissões</button><p className="eyebrow">Revisão de inscrição</p><h1 id="review-title">{selectedSubmission.proposal}</h1><p>{selectedSubmission.id} · Recebida em {selectedSubmission.date}</p></div>
          <aside className="review-summary"><span className={`submission-status ${status === 'Validada' ? 'validated' : status === 'Inscrição inválida' ? 'invalidated' : ''}`}>{status}</span><strong>{selectedSubmission.notice}</strong><span>Proponente: {selectedSubmission.applicant}</span></aside>
          <div className="review-content">
            <section className="review-section"><div className="review-section-heading"><p className="eyebrow">01. Cadastro</p><h2>Dados do proponente</h2></div><dl className="data-list"><div><dt>Nome completo</dt><dd>{selectedSubmission.applicant}</dd></div><div><dt>Tipo de inscrição</dt><dd>Pessoa física</dd></div><div><dt>CPF</dt><dd>***.482.***-**</dd></div><div><dt>E-mail</dt><dd>marina.souza@email.com</dd></div><div><dt className="wide">Endereço</dt><dd className="wide">Rua das Acácias, 128 · Centro</dd></div></dl></section>
            <section className="review-section"><div className="review-section-heading"><p className="eyebrow">02. Proposta</p><h2>Resumo do projeto</h2></div><p className="proposal-text">Uma série de encontros de dança contemporânea em praças públicas, conduzidos por artistas locais e abertos à participação da comunidade. A proposta aproxima a criação artística do cotidiano e transforma espaços de convivência em palco.</p><div className="proposal-tags"><span>Artes cênicas</span><span>Artista individual</span><span>Praças municipais</span></div></section>
            <section className="review-section"><div className="review-section-heading"><p className="eyebrow">03. Anexos</p><h2>Documentos enviados</h2></div><div className="document-review-list">{documents.map((document) => <div className="document-review" key={document.title}><span className="document-check">✓</span><div><strong>{document.title}</strong><span>{document.file}</span></div><span className="document-state">{document.state}</span><button type="button" className="review-button">Visualizar</button></div>)}</div></section>
          </div>
          <aside className="decision-panel"><p className="eyebrow">Decisão administrativa</p><h2>Validar inscrição</h2><p>Confirme que os dados e documentos atendem aos requisitos do edital. Um documento inválido encerra a inscrição.</p><label>Observação para o histórico<textarea rows={4} placeholder="Adicione uma observação, se necessário." /></label><div><button className="invalidate-button" type="button" onClick={() => { setValidationStatus({ ...validationStatus, [selectedSubmission.id]: 'Inscrição inválida' }); setActiveView('administracao'); }}>Invalidar inscrição</button><button className="validate-button" type="button" onClick={() => { setValidationStatus({ ...validationStatus, [selectedSubmission.id]: 'Validada' }); setActiveView('administracao'); }}>Validar inscrição</button></div></aside>
        </section>
      </main>
    );
  }

  if (activeView === 'administracao') {
    return (
      <main className="app-shell">
        <header className="site-header">
          <button className="brand brand-button" type="button" onClick={() => setActiveView('agenda')} aria-label="Cultura em movimento, início"><span className="brand-mark">C</span><span>Cultura<br />em movimento</span></button>
          <nav aria-label="Navegação principal"><button type="button" onClick={() => setActiveView('agenda')}>Agenda</button><button type="button" onClick={() => setActiveView('editais')}>Editais</button><button type="button" onClick={() => setActiveView('minhas-inscricoes')}>Minhas inscrições</button><button className="nav-active" type="button">Administração</button></nav>
          <button className="calendar-button" type="button" onClick={() => setActiveView('editais')}>Ver editais</button>
        </header>
        <section className="admin-page" aria-labelledby="admin-title">
          <div className="admin-heading"><div><p className="eyebrow">Área administrativa</p><h1 id="admin-title">Submissões dos editais</h1><p>Revise documentos e valide as propostas recebidas.</p></div><button className="export-button" type="button">Exportar lista</button></div>
          <div className="admin-stats" aria-label="Resumo das submissões"><div><strong>28</strong><span>submissões recebidas</span></div><div><strong>11</strong><span>aguardando validação</span></div><div><strong>4</strong><span>inscrições inválidas</span></div><div><strong>13</strong><span>validadas</span></div></div>
          <div className="submission-toolbar"><div className="submission-filters"><button className="filter active" type="button">Todas</button><button className="filter" type="button">Em análise</button><button className="filter" type="button">Inválidas</button><button className="filter" type="button">Validadas</button></div><label className="search-field">Buscar<input type="search" placeholder="Nome ou protocolo" /></label></div>
          <div className="submission-list">
            <div className="submission-list-head"><span>Proponente e proposta</span><span>Edital</span><span>Documentos</span><span>Status</span><span>Ação</span></div>
            {submissions.map((submission) => {
              const status = validationStatus[submission.id] || submission.status;
              return <article className="submission-row" key={submission.id}>
                <div className="submission-main"><strong>{submission.applicant}</strong><span>{submission.proposal}</span><small>{submission.id} · {submission.date}</small></div>
                <span className="submission-notice">{submission.notice}</span>
                <span className={submission.documents === '3 de 3' ? 'documents-complete' : 'documents-missing'}>{submission.documents}</span>
                <span className={`submission-status ${status === 'Validada' ? 'validated' : status === 'Inscrição inválida' ? 'invalidated' : ''}`}>{status}</span>
                <div className="submission-actions"><button type="button" className="review-button" onClick={() => { setSelectedSubmission(submission); setActiveView('revisar-inscricao'); }}>Ver inscrição</button>{status === 'Em análise' && <button type="button" className="validate-button" onClick={() => setValidationStatus({ ...validationStatus, [submission.id]: 'Validada' })}>Validar</button>}</div>
              </article>;
            })}
          </div>
        </section>
      </main>
    );
  }

  if (activeView === 'criar-edital') {
    return (
      <main className="app-shell">
        <header className="site-header">
          <button className="brand brand-button" type="button" onClick={() => setActiveView('agenda')} aria-label="Cultura em movimento, início"><span className="brand-mark">C</span><span>Cultura<br />em movimento</span></button>
          <nav aria-label="Navegação principal"><button type="button" onClick={() => setActiveView('agenda')}>Agenda</button><button className="nav-active" type="button" onClick={() => setActiveView('editais')}>Editais</button><button type="button" onClick={() => setActiveView('administracao')}>Administração</button></nav>
          <button className="calendar-button" type="button" onClick={() => setActiveView('editais')}>Ver editais</button>
        </header>
        <section className="create-notice-page" aria-labelledby="create-notice-title">
          <div className="create-notice-intro">
            <button className="back-button" type="button" onClick={() => setActiveView('editais')}>&larr; Todos os editais</button>
            <p className="eyebrow">Área administrativa</p>
            <h1 id="create-notice-title">Criar novo edital</h1>
            <p>Monte as informações públicas e defina os documentos que artistas deverão enviar na inscrição.</p>
          </div>
          <form className="create-notice-form">
            <div className="form-heading"><p className="eyebrow">Informações do edital</p><h2>Dados principais</h2></div>
            <div className="form-grid">
              <label className="full-width">Título do edital *<input placeholder="Ex.: Prêmio Cultura Popular 2026" /></label>
              <label>Área cultural *<select defaultValue=""><option value="" disabled>Selecione uma área</option><option>Música</option><option>Artes visuais</option><option>Cultura popular</option></select></label>
              <label>Prazo de inscrição *<input type="date" /></label>
              <label className="full-width">Descrição curta *<textarea rows={4} placeholder="Apresente o objetivo e o público deste edital." /></label>
            </div>
            <div className="upload-builder">
              <div className="upload-builder-heading"><div><p className="eyebrow">Documentos da inscrição</p><h2>Campos de upload</h2></div><span className="field-count">3 campos</span></div>
              <p className="builder-copy">Configure os arquivos que o artista deverá anexar. Esta é uma demonstração do formulário.</p>
              <div className="upload-config-list">
                <div className="upload-config-item"><span className="field-number">1</span><label>Título do campo<input defaultValue="Portfólio artístico" /></label><label className="required-switch"><input type="checkbox" defaultChecked /> Obrigatório</label></div>
                <div className="upload-config-item"><span className="field-number">2</span><label>Título do campo<input defaultValue="Comprovante de residência" /></label><label className="required-switch"><input type="checkbox" defaultChecked /> Obrigatório</label></div>
                <div className="upload-config-item"><span className="field-number">3</span><label>Título do campo<input defaultValue="Carta de intenção" /></label><label className="required-switch"><input type="checkbox" /> Obrigatório</label></div>
              </div>
              <button className="add-field-button" type="button">+ Adicionar campo de upload</button>
            </div>
            <div className="form-actions"><span>Rascunho demonstrativo, não será publicado.</span><button className="details-button" type="button">Salvar edital <span aria-hidden="true">&rarr;</span></button></div>
          </form>
        </section>
      </main>
    );
  }

  if (activeView === 'editais' && selectedNotice === null) {
    return (
      <main className="app-shell">
        <header className="site-header">
          <button className="brand brand-button" type="button" onClick={() => setActiveView('agenda')} aria-label="Cultura em movimento, início"><span className="brand-mark">C</span><span>Cultura<br />em movimento</span></button>
          <nav aria-label="Navegação principal"><button type="button" onClick={() => setActiveView('agenda')}>Agenda</button><button className="nav-active" type="button">Editais</button><button type="button" onClick={() => setActiveView('administracao')}>Administração</button></nav>
          <button className="calendar-button" type="button" onClick={() => setActiveView('agenda')}>Ver agenda</button>
        </header>
        <section className="notices-page" aria-labelledby="notices-title">
          <div className="notices-heading">
            <p className="eyebrow">Oportunidades para artistas</p>
            <h1 id="notices-title">Editais de setembro</h1>
            <p>Encontre os chamamentos abertos neste mês e inscreva sua proposta.</p>
          </div>
          <div className="month-label"><span>04 editais abertos</span><div><button className="create-notice-button" type="button" onClick={() => setActiveView('criar-edital')}>+ Criar edital</button><strong>SET 2026</strong></div></div>
          <div className="notice-list">
            {notices.map((notice) => (
              <article className="notice-card" key={notice.id}>
                <div className="notice-deadline"><strong>{notice.deadline.split(' ')[0]}</strong><span>{notice.deadline.split(' ')[1]}</span><small>encerra</small></div>
                <div className="notice-info"><p className="event-category">{notice.category}</p><h2>{notice.title}</h2><p>{notice.description}</p></div>
                <div className="notice-action"><span className={notice.status === 'Últimos dias' ? 'closing' : ''}>{notice.status}</span><strong>{notice.value}</strong><button className="details-button" type="button" onClick={() => { setSelectedNotice(notice); setSubmissionStep(1); setUploadedFiles({}); setDocumentsConfirmed(false); }}>{submittedNotices[notice.id] ? 'Inscrição enviada' : 'Inscrever-se'} <span aria-hidden="true">&rarr;</span></button></div>
              </article>
            ))}
          </div>
        </section>
      </main>
    );
  }

  if (activeView === 'editais' && selectedNotice) {
    return (
      <main className="app-shell">
        <header className="site-header">
          <button className="brand brand-button" type="button" onClick={() => setActiveView('agenda')} aria-label="Cultura em movimento, início">
            <span className="brand-mark">C</span>
            <span>Cultura<br />em movimento</span>
          </button>
          <nav aria-label="Navegação principal">
            <button type="button" onClick={() => setActiveView('agenda')}>Agenda</button>
            <button className="nav-active" type="button" onClick={() => setSelectedNotice(null)}>Editais</button>
            <button type="button" onClick={() => setActiveView('administracao')}>Administração</button>
          </nav>
          <button className="calendar-button" type="button" onClick={() => setActiveView('agenda')}>Ver agenda</button>
        </header>

        <section className="edital-page" aria-labelledby="edital-title">
          <div className="edital-intro">
            <button className="back-button" type="button" onClick={() => setSelectedNotice(null)}>&larr; Todos os editais</button>
            <p className="eyebrow">{selectedNotice.category}</p>
            <h1 id="edital-title">{selectedNotice.title}</h1>
            <p>{selectedNotice.description}</p>
            <aside className="notice">
              <strong>Prazo de inscrição</strong>
              <span>até {selectedNotice.deadline} de 2026, 23h59</span>
            </aside>
            <dl className="edital-summary">
              <div><dt>Fomento</dt><dd>{selectedNotice.value}</dd></div>
              <div><dt>Quem pode</dt><dd>Artistas e coletivos locais</dd></div>
            </dl>
          </div>

          <section className="application-panel" aria-labelledby="form-title">
            {submittedNotices[selectedNotice.id] ? (
              <div className="success-message" role="status">
                <p className="eyebrow">Inscrição recebida</p>
                <h2>Seu projeto entrou na nossa lista.</h2>
                <p>Enviaremos uma confirmação para o e-mail informado sobre <strong>{selectedNotice.title}</strong>. Guarde este protocolo: <strong>CM-2026-0841</strong>.</p>
                <p className="single-submission-note">Esta inscrição já foi finalizada e não pode ser reenviada.</p>
                <button className="details-button" type="button" onClick={() => setSelectedNotice(null)}>Voltar aos editais</button>
              </div>
            ) : submissionStep === 2 ? (
              <div className="document-review-step">
                <div className="form-heading"><p className="eyebrow">Etapa 2 de 2</p><h2>Confira seus documentos</h2><p>Revise os arquivos enviados. Depois da confirmação, não será possível alterar ou reenviar a inscrição.</p></div>
                <div className="applicant-review"><span>Inscrição para</span><strong>{selectedNotice.title}</strong></div>
                <div className="applicant-document-list">
                  {[
                    { field: 'identity-document', title: 'Documento de identidade (RG)', required: true },
                    { field: 'address-proof', title: 'Comprovante de residência', required: true },
                    { field: 'portfolio', title: 'Portfólio ou material de apoio', required: false },
                  ].map((document) => {
                    const file = uploadedFiles[document.field];
                    return <div className="applicant-document" key={document.field}><span className={file ? 'document-check' : 'document-empty'}>{file ? '✓' : '!'}</span><div><strong>{document.title}{document.required ? ' *' : ''}</strong><span>{file ? file.name : 'Não enviado'}</span></div><button className="review-button" type="button" disabled={!file} onClick={() => openFile(file)}>Ver arquivo</button></div>;
                  })}
                </div>
                <div className="final-confirmation"><label><input type="checkbox" checked={documentsConfirmed} onChange={(event) => setDocumentsConfirmed(event.target.checked)} /> <span>Confirmo que conferi todos os documentos e dados desta inscrição.</span></label><div><button className="review-button" type="button" onClick={() => setSubmissionStep(1)}>Voltar e corrigir</button><button className="validate-button" type="button" disabled={!documentsConfirmed} onClick={finalizeSubmission}>Confirmar envio</button></div></div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-heading">
                  <p className="eyebrow">Etapa 1 de 2</p>
                  <h2 id="form-title">Dados da proposta</h2>
                  <p>Os campos marcados com * são obrigatórios.</p>
                </div>
                <div className="form-grid">
                  <label>{applicantType === 'cpf' ? 'Nome completo' : 'Razão social'} *<input name="name" required placeholder={applicantType === 'cpf' ? 'Como você se apresenta' : 'Nome da organização'} /></label>
                  <label>E-mail *<input name="email" type="email" required placeholder="voce@email.com" /></label>
                  <label>Tipo de inscrição *
                    <select name="applicant-type" value={applicantType} onChange={(event) => { setApplicantType(event.target.value === 'cnpj' ? 'cnpj' : 'cpf'); setDocumentNumber(''); }}>
                      <option value="cpf">Pessoa física (CPF)</option>
                      <option value="cnpj">Pessoa jurídica (CNPJ)</option>
                    </select>
                  </label>
                  <label>{applicantType === 'cpf' ? 'CPF' : 'CNPJ'} *
                    <input name={applicantType} required inputMode="numeric" value={documentNumber} maxLength={applicantType === 'cpf' ? 14 : 18} pattern={applicantType === 'cpf' ? "[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2}" : "[0-9]{2}\.[0-9]{3}\.[0-9]{3}/[0-9]{4}-[0-9]{2}"} title={applicantType === 'cpf' ? 'Digite um CPF válido' : 'Digite um CNPJ válido'} placeholder={applicantType === 'cpf' ? '000.000.000-00' : '00.000.000/0000-00'} onChange={(event) => setDocumentNumber(formatDocument(event.target.value, applicantType))} />
                  </label>
                  <label className="full-width">Nome da proposta *<input name="project" required placeholder="De um nome para o seu projeto" /></label>
                  <label>Área cultural *
                    <select name="area" required defaultValue="">
                      <option value="" disabled>Selecione uma linguagem</option>
                      <option>Música</option><option>Artes visuais</option><option>Teatro e dança</option><option>Literatura</option><option>Cultura popular</option>
                    </select>
                  </label>
                  <label>Você se inscreve como *
                    <select name="profile" required defaultValue=""><option value="" disabled>Selecione uma opção</option><option>Artista individual</option><option>Coletivo artístico</option><option>Grupo cultural</option></select>
                  </label>
                  <label className="full-width">Resumo da proposta *<textarea name="summary" required rows={5} placeholder="Conte brevemente o que você pretende realizar, para quem e onde." /></label>
                  <div className="document-section full-width">
                    <p className="document-heading">Documentos obrigatórios</p>
                    <p className="document-copy">Anexe os documentos de identificação exigidos para esta inscrição.</p>
                  </div>
                  <label className="upload-field">Documento de identidade (RG) *
                    <input name="identity-document" type="file" required accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} />
                    <span>PDF ou imagem, até 10 MB</span>
                    {uploadedFiles['identity-document'] && <button className="file-preview-button" type="button" onClick={() => openFile(uploadedFiles['identity-document'])}>Ver arquivo selecionado</button>}
                  </label>
                  <label className="upload-field">Comprovante de residência *
                    <input name="address-proof" type="file" required accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} />
                    <span>PDF ou imagem, até 10 MB</span>
                    {uploadedFiles['address-proof'] && <button className="file-preview-button" type="button" onClick={() => openFile(uploadedFiles['address-proof'])}>Ver arquivo selecionado</button>}
                  </label>
                  <label className="upload-field full-width">Portfólio ou material de apoio
                    <input name="portfolio" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} />
                    <span>PDF ou imagem, até 10 MB</span>
                    {uploadedFiles.portfolio && <button className="file-preview-button" type="button" onClick={() => openFile(uploadedFiles.portfolio)}>Ver arquivo selecionado</button>}
                  </label>
                  <label className="consent full-width"><input type="checkbox" required /> <span>Li e concordo com o regulamento do edital e com o uso dos meus dados para esta inscrição.</span></label>
                </div>
                <div className="form-actions"><span>Você revisará seus documentos antes do envio final.</span><button className="details-button" type="submit">Revisar inscrição <span aria-hidden="true">&rarr;</span></button></div>
              </form>
            )}
          </section>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Cultura em movimento, início">
          <span className="brand-mark">C</span>
          <span>Cultura<br />em movimento</span>
        </a>
        <nav aria-label="Navegação principal">
          <a className="nav-active" href="#agenda">Agenda</a>
          <button type="button" onClick={() => { setSelectedNotice(null); setActiveView('editais'); }}>Editais</button>
          <button type="button" onClick={() => setActiveView('minhas-inscricoes')}>Minhas inscrições</button>
          <button type="button" onClick={() => setActiveView('administracao')}>Administração</button>
        </nav>
        <button className="calendar-button" type="button">Ver calendario</button>
      </header>

      <section className="hero" id="inicio" aria-labelledby="page-title">
        <div>
          <p className="eyebrow">Agenda cultural do município</p>
          <h1 id="page-title">Tem coisa boa acontecendo perto de você.</h1>
          <p className="hero-copy">Descubra encontros, artistas e experiências que fazem a cidade pulsar.</p>
        </div>
        <p className="date-stamp"><strong>SET</strong><span>2026</span></p>
      </section>

      <section className="featured-event" aria-labelledby="featured-title">
        <img
          src="https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=1400&q=85"
          alt="Show ao vivo com luzes coloridas"
        />
        <div className="featured-content">
          <p className="eyebrow">Em destaque</p>
          <p className="event-category">Festival</p>
          <h2 id="featured-title">Festival Raízes da Cidade</h2>
          <p className="featured-description">Três dias de música, sabores e histórias que celebram quem faz a nossa cultura.</p>
          <dl className="event-details">
            <div><dt>Quando</dt><dd>18 a 20 de setembro</dd></div>
            <div><dt>Onde</dt><dd>Parque Municipal</dd></div>
          </dl>
          <button className="details-button" type="button">Conhecer evento <span aria-hidden="true">&rarr;</span></button>
        </div>
      </section>

      <section className="agenda" id="agenda" aria-labelledby="agenda-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Programe-se</p>
            <h2 id="agenda-title">Próximos eventos</h2>
          </div>
          <a href="#todos">Ver agenda completa <span aria-hidden="true">&rarr;</span></a>
        </div>
        <div className="filters" aria-label="Filtrar eventos por categoria">
          <button className="filter active" type="button">Todos</button>
          <button className="filter" type="button">Música</button>
          <button className="filter" type="button">Artes visuais</button>
          <button className="filter" type="button">Cena</button>
        </div>
        <div className="event-grid">
          {events.map((event) => (
            <article className="event-card" key={event.title}>
              <div className="event-image-wrap">
                <img src={event.image} alt="" />
                <time className={`date-badge ${event.tone}`} dateTime={`2026-09-${event.day}`}>
                  <strong>{event.day}</strong><span>{event.month}</span>
                </time>
              </div>
              <div className="card-content">
                <p className="event-category">{event.category}</p>
                <h3>{event.title}</h3>
                <p className="event-meta">{event.place} <span>&bull;</span> {event.time}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default App;