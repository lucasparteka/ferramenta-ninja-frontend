/* ------------------------------------------------------------------ */
/*  Calculadora de Rescisão Trabalhista                                */
/*  Estilo "engineering tool" — radius curto, mono em números,         */
/*  hierarquia densa, CTA primária ancorada no painel de resultado.    */
/* ------------------------------------------------------------------ */

const { useState, useMemo, useEffect, useCallback, useRef } = React;

/* ============= TOKENS / PRIMITIVES ================================ */

const SectionLabel = ({ children, hint }) => (
  <div style={{
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 8,
    paddingBottom: 8,
    marginBottom: 14,
    borderBottom: '1px solid var(--border)',
  }}>
    <span style={{
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: 'var(--fg-muted)',
    }}>{children}</span>
    {hint && <span style={{ fontSize: 11, color: 'var(--fg-subtle)' }}>{hint}</span>}
  </div>
);

const Field = ({ label, children, hint, error, htmlFor }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
    <label htmlFor={htmlFor} style={{
      fontSize: 12,
      fontWeight: 500,
      color: 'var(--fg-strong)',
      letterSpacing: '-0.005em',
    }}>{label}</label>
    {children}
    {(hint || error) && (
      <span style={{
        fontSize: 11,
        color: error ? 'var(--danger)' : 'var(--fg-subtle)',
      }}>{error || hint}</span>
    )}
  </div>
);

const inputBase = {
  height: 34,
  padding: '0 10px',
  background: 'var(--surface)',
  border: '1px solid var(--border-strong)',
  borderRadius: 'var(--r-sm)',
  fontSize: 13,
  color: 'var(--fg-strong)',
  outline: 'none',
  width: '100%',
  transition: 'border-color .12s, box-shadow .12s',
};

const Input = ({ adornStart, adornEnd, numeric, ...props }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{
      position: 'relative',
      display: 'flex',
      alignItems: 'stretch',
      borderRadius: 'var(--r-sm)',
      border: `1px solid ${focused ? 'var(--primary)' : 'var(--border-strong)'}`,
      background: 'var(--surface)',
      boxShadow: focused ? '0 0 0 3px rgba(37,99,235,.12)' : 'none',
      transition: 'border-color .12s, box-shadow .12s',
    }}>
      {adornStart && (
        <span style={{
          display: 'flex', alignItems: 'center', paddingLeft: 10, paddingRight: 6,
          fontSize: 12, color: 'var(--fg-muted)', fontWeight: 500,
          borderRight: '1px solid var(--border)',
        }} className="mono">{adornStart}</span>
      )}
      <input
        {...props}
        onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
        onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
        style={{
          flex: 1,
          height: 32,
          minWidth: 0,
          padding: adornStart ? '0 10px 0 10px' : '0 10px',
          background: 'transparent',
          border: 0,
          outline: 'none',
          color: 'var(--fg-strong)',
          fontSize: 13,
          ...(numeric ? { fontFamily: 'JetBrains Mono, ui-monospace, monospace', fontFeatureSettings: '"tnum"' } : {}),
        }}
      />
      {adornEnd && (
        <span style={{
          display: 'flex', alignItems: 'center', paddingRight: 10, paddingLeft: 6,
          fontSize: 12, color: 'var(--fg-subtle)',
        }}>{adornEnd}</span>
      )}
    </div>
  );
};

const Select = ({ value, onChange, options, ...props }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{
      position: 'relative',
      borderRadius: 'var(--r-sm)',
      border: `1px solid ${focused ? 'var(--primary)' : 'var(--border-strong)'}`,
      background: 'var(--surface)',
      boxShadow: focused ? '0 0 0 3px rgba(37,99,235,.12)' : 'none',
      transition: 'border-color .12s, box-shadow .12s',
    }}>
      <select
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          appearance: 'none',
          width: '100%',
          height: 32,
          padding: '0 30px 0 10px',
          background: 'transparent',
          border: 0,
          outline: 'none',
          fontSize: 13,
          color: 'var(--fg-strong)',
          cursor: 'pointer',
        }}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
        style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--fg-muted)' }}>
        <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
};

const Segmented = ({ value, onChange, options }) => (
  <div role="radiogroup" style={{
    display: 'inline-flex',
    background: 'var(--surface-3)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--r-sm)',
    padding: 2,
    gap: 2,
    width: '100%',
  }}>
    {options.map((o) => {
      const active = value === o.value;
      return (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={active}
          onClick={() => onChange(o.value)}
          className="focus-ring"
          style={{
            flex: 1,
            height: 26,
            padding: '0 10px',
            background: active ? 'var(--surface)' : 'transparent',
            color: active ? 'var(--fg-strong)' : 'var(--fg-muted)',
            border: 0,
            borderRadius: 'var(--r-xs)',
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: active ? 600 : 500,
            boxShadow: active ? 'var(--shadow-sm)' : 'none',
            transition: 'background .12s, color .12s, box-shadow .12s',
          }}
        >{o.label}</button>
      );
    })}
  </div>
);

const Checkbox = ({ checked, onChange, children, id }) => (
  <label htmlFor={id} style={{
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
    cursor: 'pointer',
    padding: '8px 10px',
    border: `1px solid ${checked ? 'var(--primary)' : 'var(--border)'}`,
    background: checked ? 'var(--primary-soft)' : 'var(--surface)',
    borderRadius: 'var(--r-sm)',
    transition: 'background .12s, border-color .12s',
  }}>
    <input
      id={id}
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      style={{
        appearance: 'none',
        WebkitAppearance: 'none',
        width: 14,
        height: 14,
        marginTop: 1,
        flexShrink: 0,
        background: checked ? 'var(--primary)' : 'var(--surface)',
        border: `1px solid ${checked ? 'var(--primary)' : 'var(--border-strong)'}`,
        borderRadius: 3,
        display: 'grid',
        placeItems: 'center',
        cursor: 'pointer',
      }}
    />
    {checked && (
      <svg width="10" height="10" viewBox="0 0 16 16" fill="none"
        style={{ position: 'absolute', marginLeft: 2, marginTop: 3, pointerEvents: 'none' }}>
        <path d="M3 8.5 6.5 12 13 4.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )}
    <span style={{ fontSize: 12.5, color: 'var(--fg-strong)', lineHeight: 1.4 }}>{children}</span>
  </label>
);

const Button = ({ variant = 'primary', size = 'md', icon, children, ...props }) => {
  const sizes = {
    sm: { height: 28, padding: '0 10px', fontSize: 12 },
    md: { height: 34, padding: '0 14px', fontSize: 13 },
    lg: { height: 40, padding: '0 16px', fontSize: 13 },
  };
  const variants = {
    primary: {
      background: 'var(--primary)',
      color: 'var(--primary-fg)',
      border: '1px solid var(--primary)',
      boxShadow: 'var(--shadow-sm)',
    },
    outline: {
      background: 'var(--surface)',
      color: 'var(--fg-strong)',
      border: '1px solid var(--border-strong)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--fg-muted)',
      border: '1px solid transparent',
    },
  };
  return (
    <button
      {...props}
      className="focus-ring"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        borderRadius: 'var(--r-sm)',
        cursor: 'pointer',
        fontWeight: 500,
        letterSpacing: '-0.005em',
        transition: 'background .12s, border-color .12s, color .12s',
        ...sizes[size],
        ...variants[variant],
      }}
    >
      {icon}
      {children}
    </button>
  );
};

const Chip = ({ children, tone = 'neutral' }) => {
  const tones = {
    neutral: { bg: 'var(--surface-3)', fg: 'var(--fg-muted)', bd: 'var(--border)' },
    info:    { bg: 'var(--primary-soft)', fg: 'var(--primary-strong)', bd: 'rgba(37,99,235,.18)' },
    warn:    { bg: 'var(--warning-soft)', fg: 'var(--warning)', bd: 'rgba(180,83,9,.2)' },
    success: { bg: 'var(--success-soft)', fg: 'var(--success)', bd: 'rgba(4,120,87,.2)' },
    danger:  { bg: 'var(--danger-soft)', fg: 'var(--danger)', bd: 'rgba(220,38,38,.2)' },
  }[tone];
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      height: 20,
      padding: '0 7px',
      background: tones.bg,
      color: tones.fg,
      border: `1px solid ${tones.bd}`,
      borderRadius: 'var(--r-xs)',
      fontSize: 10.5,
      fontWeight: 600,
      letterSpacing: '0.02em',
      textTransform: 'uppercase',
    }}>{children}</span>
  );
};

/* ============= ICONS (lucide-style, 1.5px stroke) ================= */

const Icon = ({ name, size = 14 }) => {
  const paths = {
    calendar: 'M8 2v4 M16 2v4 M3 10h18 M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z',
    moon: 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z',
    sun: 'M12 3v1 M12 20v1 M3 12h1 M20 12h1 M5.6 5.6l.7.7 M17.7 17.7l.7.7 M5.6 18.4l.7-.7 M17.7 6.3l.7-.7',
    chevron: 'm6 9 6 6 6-6',
    arrow_right: 'M5 12h14 M12 5l7 7-7 7',
    rotate: 'M3 12a9 9 0 1 0 3-6.7L3 8 M3 3v5h5',
    copy: 'M8 4v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7.3a2 2 0 0 0-.6-1.4l-3.3-3.3A2 2 0 0 0 14.7 2H10a2 2 0 0 0-2 2z M16 18v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2',
    download: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3',
    sparkle: 'M12 3v4 M12 17v4 M3 12h4 M17 12h4 M5.6 5.6 8 8 M16 16l2.4 2.4 M5.6 18.4 8 16 M16 8l2.4-2.4',
    check: 'M20 6 9 17l-5-5',
    info: 'M12 8h.01 M11 12h1v4h1 M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z',
    alert: 'M12 9v4 M12 17h.01 M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z',
    clock: 'M12 6v6l4 2 M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z',
    minus: 'M5 12h14',
    equals: 'M5 9h14 M5 15h14',
    file: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8',
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name].split(' M').map((d, i) => (
        <path key={i} d={(i === 0 ? '' : 'M') + d} />
      ))}
    </svg>
  );
};

/* ============= DOMAIN: tabela INSS/IRRF 2025 (simplificada) ======== */

const INSS_TABLE = [
  { upTo: 1518.00, rate: 0.075, deduct: 0 },
  { upTo: 2793.88, rate: 0.09,  deduct: 22.77 },
  { upTo: 4190.83, rate: 0.12,  deduct: 106.59 },
  { upTo: 8157.41, rate: 0.14,  deduct: 190.40 },
];
const INSS_TETO = 951.62;

const IRRF_TABLE = [
  { upTo: 2428.80, rate: 0.0,    deduct: 0 },
  { upTo: 2826.65, rate: 0.075,  deduct: 182.16 },
  { upTo: 3751.05, rate: 0.15,   deduct: 394.16 },
  { upTo: 4664.68, rate: 0.225,  deduct: 675.49 },
  { upTo: Infinity, rate: 0.275, deduct: 908.73 },
];
const DEPENDENT_DEDUCTION = 189.59;

function calcInss(base) {
  if (base <= 0) return 0;
  for (const f of INSS_TABLE) {
    if (base <= f.upTo) return Math.max(0, base * f.rate - f.deduct);
  }
  return INSS_TETO;
}
function calcIrrf(base, dependents = 0) {
  const taxable = Math.max(0, base - dependents * DEPENDENT_DEDUCTION);
  for (const f of IRRF_TABLE) {
    if (taxable <= f.upTo) return Math.max(0, taxable * f.rate - f.deduct);
  }
  return 0;
}

function diffMonthsDays(from, to) {
  if (!from || !to || to < from) return { years: 0, months: 0, days: 0, totalMonths: 0, totalDays: 0 };
  let y = to.getFullYear() - from.getFullYear();
  let m = to.getMonth() - from.getMonth();
  let d = to.getDate() - from.getDate();
  if (d < 0) {
    m -= 1;
    const prev = new Date(to.getFullYear(), to.getMonth(), 0);
    d += prev.getDate();
  }
  if (m < 0) { y -= 1; m += 12; }
  const totalMonths = y * 12 + m + (d >= 15 ? 1 : 0);
  const totalDays = Math.round((to - from) / 86400000);
  return { years: y, months: m, days: d, totalMonths, totalDays };
}

/* AVISO PRÉVIO LEI 12.506: 30 dias + 3/ano completo, máx 90 */
function avisoDias(yearsCompletos) {
  return Math.min(90, 30 + 3 * Math.max(0, yearsCompletos));
}

const MOTIVOS = [
  { value: 'sem_justa_causa', label: 'Demissão sem justa causa', avisoEmpresa: true,  fgts40: true,  segDes: true },
  { value: 'pedido_demissao', label: 'Pedido de demissão',       avisoEmpresa: false, fgts40: false, segDes: false },
  { value: 'comum_acordo',    label: 'Acordo entre as partes',   avisoEmpresa: true,  fgts40: false, fgts20: true, segDes: false },
  { value: 'fim_contrato',    label: 'Fim de contrato determinado', avisoEmpresa: false, fgts40: false, segDes: false },
  { value: 'justa_causa',     label: 'Justa causa',              avisoEmpresa: false, fgts40: false, segDes: false, semDireitos: true },
  { value: 'rescisao_indireta', label: 'Rescisão indireta',      avisoEmpresa: true,  fgts40: true,  segDes: true },
];

function calcular(state) {
  const { salario, admissao, rescisao, motivo, avisoTipo, fgtsAtual, dependentes, feriasVencidas, decimoPago } = state;
  const m = MOTIVOS.find((mm) => mm.value === motivo);
  const adm = admissao ? new Date(admissao + 'T12:00:00') : null;
  const res = rescisao ? new Date(rescisao + 'T12:00:00') : null;
  const tempo = diffMonthsDays(adm, res);
  const diasAviso = m?.avisoEmpresa ? avisoDias(tempo.years) : 0;
  const dataAvisoFim = res && diasAviso ? new Date(res.getTime() + diasAviso * 86400000) : res;

  const saldo_dias = res ? res.getDate() : 0;
  const saldo = salario / 30 * saldo_dias;

  const mesesP13 = Math.min(12, Math.max(0, (res ? res.getMonth() + 1 : 0) - (saldo_dias >= 15 ? 0 : 1)));
  const decimo_proporcional = decimoPago ? 0 : salario / 12 * mesesP13;

  const ferias_proporcionais_meses = tempo.totalMonths % 12;
  const ferias_proporcionais = salario / 12 * ferias_proporcionais_meses;
  const ferias_vencidas_val = feriasVencidas ? salario : 0;
  const ferias_total = ferias_proporcionais + ferias_vencidas_val;
  const um_terco_ferias = ferias_total / 3;

  const aviso_indenizado = (m?.avisoEmpresa && avisoTipo === 'indenizado') ? salario / 30 * diasAviso : 0;
  const aviso_trabalhado = (m?.avisoEmpresa && avisoTipo === 'trabalhado') ? salario / 30 * diasAviso : 0;
  const decimo_aviso = aviso_indenizado ? aviso_indenizado / 12 : 0;

  const fgts_deposito = (salario * 0.08) * Math.max(1, tempo.totalMonths);
  const fgts_base = fgtsAtual > 0 ? fgtsAtual : fgts_deposito;
  const multa_fgts = m?.fgts40 ? fgts_base * 0.4 : (m?.fgts20 ? fgts_base * 0.2 : 0);

  const bruto = saldo + decimo_proporcional + ferias_total + um_terco_ferias
              + aviso_indenizado + aviso_trabalhado + decimo_aviso + multa_fgts;

  const baseInss = saldo + aviso_trabalhado + decimo_proporcional + decimo_aviso;
  const inss = calcInss(baseInss);
  const baseIrrf = baseInss - inss;
  const irrf = calcIrrf(baseIrrf, dependentes);

  const liquido = Math.max(0, bruto - inss - irrf);

  const semSeguro = !m?.segDes;

  return {
    motivo: m,
    tempo,
    diasAviso,
    dataAvisoFim,
    parcelas: {
      saldo,
      decimo_proporcional,
      ferias_proporcionais,
      ferias_vencidas: ferias_vencidas_val,
      um_terco_ferias,
      aviso_indenizado,
      aviso_trabalhado,
      decimo_aviso,
      multa_fgts,
    },
    bruto,
    inss,
    irrf,
    liquido,
    semSeguro,
  };
}

/* ============= FORMATTERS ========================================= */

const fmtBRL = (v, opts = {}) => {
  const n = Number.isFinite(v) ? v : 0;
  const abs = Math.abs(n);
  const s = abs.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return (opts.signed && n < 0 ? '−\u00a0' : '') + (opts.bare ? s : 'R$\u00a0' + s);
};
const fmtBRLSplit = (v) => {
  const [reais, cent] = (Number.isFinite(v) ? v : 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).split(',');
  return { reais, cent };
};

function parseBRLInput(s) {
  const cleaned = String(s).replace(/[^\d]/g, '');
  if (!cleaned) return 0;
  return parseInt(cleaned, 10) / 100;
}
function formatBRLInput(v) {
  return v.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/* ============= HEADER ============================================ */

function Header({ theme, onToggleTheme }) {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 30,
      background: 'var(--bg-translucent)',
      backdropFilter: 'saturate(180%) blur(8px)',
      WebkitBackdropFilter: 'saturate(180%) blur(8px)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{
        maxWidth: 1280, margin: '0 auto',
        height: 56, padding: '0 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <a href="#" style={{
          display: 'inline-flex', alignItems: 'center', gap: 1,
          fontWeight: 700, fontSize: 16, letterSpacing: '-0.02em',
          color: 'var(--fg-strong)', textDecoration: 'none',
        }}>
          <span style={{ color: 'var(--primary)' }}>ferramenta</span>
          <span style={{ color: 'var(--fg-muted)' }}>.ninja</span>
        </a>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {['Início', 'Ferramentas', 'Blog'].map((l) => (
            <a key={l} href="#" style={{
              padding: '6px 10px', fontSize: 13, color: 'var(--fg-muted)',
              textDecoration: 'none', borderRadius: 'var(--r-sm)',
            }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-3)'}
               onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>{l}</a>
          ))}
          <a href="#" style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '6px 10px', fontSize: 13, color: 'var(--fg-muted)',
            textDecoration: 'none', borderRadius: 'var(--r-sm)',
          }}>Categorias <Icon name="chevron" size={12}/></a>
          <span style={{ width: 1, height: 18, background: 'var(--border)', margin: '0 6px' }}/>
          <button onClick={onToggleTheme} aria-label="Alternar tema"
            className="focus-ring"
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 30, height: 30, background: 'transparent',
              border: '1px solid var(--border)',
              borderRadius: 'var(--r-sm)', color: 'var(--fg-muted)', cursor: 'pointer',
            }}>
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={14}/>
          </button>
        </nav>
      </div>
    </header>
  );
}

/* ============= PAGE HEAD (breadcrumb + title) ===================== */

function PageHead({ result }) {
  return (
    <div style={{ paddingTop: 28, paddingBottom: 20 }}>
      <nav aria-label="breadcrumb" style={{
        display: 'flex', gap: 6, alignItems: 'center',
        fontSize: 12, color: 'var(--fg-subtle)', marginBottom: 14,
      }}>
        <a href="#" style={{ color: 'var(--fg-muted)', textDecoration: 'none' }}>Início</a>
        <span>/</span>
        <a href="#" style={{ color: 'var(--fg-muted)', textDecoration: 'none' }}>Calculadoras</a>
        <span>/</span>
        <span style={{ color: 'var(--fg-strong)' }}>Calculadora de Rescisão</span>
      </nav>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <h1 style={{
              margin: 0, fontSize: 26, fontWeight: 700, letterSpacing: '-0.025em',
              color: 'var(--fg-strong)',
            }}>Calculadora de Rescisão Trabalhista</h1>
            <Chip tone="info">CLT · 2026</Chip>
          </div>
          <p style={{ margin: 0, fontSize: 13.5, color: 'var(--fg-muted)', maxWidth: 640 }}>
            Verbas rescisórias com aviso prévio, 13º proporcional, férias e multa do FGTS.
            Atualizada com a tabela INSS/IRRF vigente.
          </p>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 11.5, color: 'var(--fg-subtle)',
          padding: '6px 10px', background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--r-sm)', whiteSpace: 'nowrap',
        }}>
          <Icon name="clock" size={12}/>
          <span>Cálculo atualizado</span>
          <span className="mono" style={{ color: 'var(--fg-muted)' }}>· {new Date().toLocaleDateString('pt-BR')}</span>
        </div>
      </div>
    </div>
  );
}

/* ============= FORM ============================================= */

const DEFAULT_STATE = {
  salario: 8800,
  admissao: '2020-01-01',
  rescisao: '2026-05-08',
  motivo: 'sem_justa_causa',
  avisoTipo: 'indenizado',
  fgtsAtual: 0,
  dependentes: 0,
  feriasVencidas: false,
  decimoPago: false,
};

function CurrencyInput({ value, onChange, id }) {
  const [text, setText] = useState(formatBRLInput(value));
  useEffect(() => { setText(formatBRLInput(value)); }, [value]);
  return (
    <Input
      id={id}
      adornStart="R$"
      value={text}
      numeric
      onChange={(e) => {
        const raw = e.target.value;
        const num = parseBRLInput(raw);
        setText(formatBRLInput(num));
        onChange(num);
      }}
      placeholder="0,00"
      inputMode="decimal"
    />
  );
}

function Form({ state, setState, onCalc, onReset }) {
  const set = (k) => (v) => setState((s) => ({ ...s, [k]: v?.target ? v.target.value : v }));

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--r-md)',
      overflow: 'hidden',
    }}>
      {/* Form sections */}
      <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 22 }}>
        <section>
          <SectionLabel hint="Dados básicos do contrato">Vínculo empregatício</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 14 }}>
            <Field label="Salário bruto mensal" htmlFor="salario">
              <CurrencyInput id="salario" value={state.salario} onChange={set('salario')}/>
            </Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Field label="Data de admissão" htmlFor="admissao">
                <Input id="admissao" type="date" value={state.admissao} onChange={set('admissao')} numeric/>
              </Field>
              <Field label="Data de rescisão" htmlFor="rescisao">
                <Input id="rescisao" type="date" value={state.rescisao} onChange={set('rescisao')} numeric/>
              </Field>
            </div>
          </div>
        </section>

        <div style={{ height: 1, background: 'var(--border)' }}/>

        <section>
          <SectionLabel>Tipo de rescisão</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 14 }}>
            <Field label="Motivo da rescisão" htmlFor="motivo">
              <Select id="motivo" value={state.motivo} onChange={set('motivo')}
                options={MOTIVOS.map((m) => ({ value: m.value, label: m.label }))}/>
            </Field>
            <Field label="Aviso prévio">
              <Segmented value={state.avisoTipo} onChange={set('avisoTipo')}
                options={[
                  { value: 'indenizado', label: 'Indenizado' },
                  { value: 'trabalhado', label: 'Trabalhado' },
                  { value: 'dispensado', label: 'Dispensado' },
                ]}/>
            </Field>
          </div>
        </section>

        <div style={{ height: 1, background: 'var(--border)' }}/>

        <section>
          <SectionLabel hint="Opcional — afina o cálculo">Informações adicionais</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 12 }}>
            <Field label="Saldo do FGTS atual" hint="Em branco usa estimativa de 8% do salário" htmlFor="fgts">
              <CurrencyInput id="fgts" value={state.fgtsAtual} onChange={set('fgtsAtual')}/>
            </Field>
            <Field label="Dependentes para IRRF" htmlFor="deps">
              <Input id="deps" type="number" min="0" max="10" value={state.dependentes}
                onChange={(e) => set('dependentes')(Number(e.target.value || 0))} numeric/>
            </Field>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Checkbox id="ferias-v" checked={state.feriasVencidas} onChange={set('feriasVencidas')}>
              Possui férias vencidas
            </Checkbox>
            <Checkbox id="decimo-p" checked={state.decimoPago} onChange={set('decimoPago')}>
              13º deste ano já recebido
            </Checkbox>
          </div>
        </section>
      </div>

      {/* Footer toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 22px',
        background: 'var(--surface-2)',
        borderTop: '1px solid var(--border)',
      }}>
        <span style={{ fontSize: 11.5, color: 'var(--fg-subtle)', display: 'inline-flex', gap: 6, alignItems: 'center' }}>
          <Icon name="info" size={12}/>
          O cálculo é atualizado automaticamente
        </span>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="ghost" size="sm" icon={<Icon name="rotate" size={12}/>} onClick={onReset}>
            Resetar
          </Button>
          <Button variant="outline" size="sm" icon={<Icon name="sparkle" size={12}/>}>
            Carregar exemplo
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ============= RESULT PANEL ====================================== */

function ResultRow({ label, value, signed = false, dim, strong, subdued, mono = true }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16,
      padding: '6px 0',
      opacity: subdued ? 0.5 : 1,
    }}>
      <span style={{
        fontSize: 12.5,
        color: dim ? 'var(--fg-subtle)' : 'var(--fg-strong)',
        fontWeight: strong ? 600 : 400,
      }}>{label}</span>
      <span className={mono ? 'mono' : ''} style={{
        fontSize: 12.5,
        color: dim ? 'var(--fg-subtle)' : 'var(--fg-strong)',
        fontWeight: strong ? 600 : 500,
        whiteSpace: 'nowrap',
      }}>{typeof value === 'number' ? fmtBRL(value, { signed }) : value}</span>
    </div>
  );
}

function ResultPanel({ result, state }) {
  const r = result;
  const split = fmtBRLSplit(r.liquido);

  return (
    <aside style={{
      position: 'sticky', top: 80,
      display: 'flex', flexDirection: 'column', gap: 12,
    }}>
      {/* HERO */}
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r-md)',
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '14px 18px',
          background: 'linear-gradient(180deg, var(--surface) 0%, var(--surface-3) 100%)',
          borderBottom: '1px solid var(--border)',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            fontSize: 10.5, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
            color: 'var(--fg-muted)', marginBottom: 8,
          }}>
            <span>Total líquido a receber</span>
            <Chip tone="success">Estimativa</Chip>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }} className="mono">
            <span style={{ fontSize: 14, color: 'var(--fg-muted)', fontWeight: 500 }}>R$</span>
            <span style={{ fontSize: 32, fontWeight: 600, color: 'var(--fg-strong)', letterSpacing: '-0.03em', lineHeight: 1 }}>
              {split.reais}
            </span>
            <span style={{ fontSize: 18, color: 'var(--fg-muted)', fontWeight: 500, letterSpacing: '-0.02em' }}>
              ,{split.cent}
            </span>
          </div>
          <div style={{
            marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: '0 14px',
            fontSize: 11.5, color: 'var(--fg-muted)',
          }}>
            <span>Bruto <span className="mono" style={{ color: 'var(--fg-strong)' }}>{fmtBRL(r.bruto, { bare: true })}</span></span>
            <span>· INSS <span className="mono" style={{ color: 'var(--fg-strong)' }}>{fmtBRL(r.inss, { bare: true })}</span></span>
            <span>· IRRF <span className="mono" style={{ color: 'var(--fg-strong)' }}>{fmtBRL(r.irrf, { bare: true })}</span></span>
          </div>
        </div>

        {/* Breakdown */}
        <div style={{ padding: '12px 18px' }}>
          <div style={{
            fontSize: 10.5, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
            color: 'var(--fg-muted)', marginBottom: 4,
          }}>Detalhamento</div>
          <ResultRow label="Saldo de salário" value={r.parcelas.saldo} />
          {r.parcelas.decimo_proporcional > 0 && (
            <ResultRow label="13º proporcional" value={r.parcelas.decimo_proporcional} />
          )}
          {r.parcelas.aviso_indenizado > 0 && (
            <ResultRow label={`Aviso prévio (${r.diasAviso}d)`} value={r.parcelas.aviso_indenizado}/>
          )}
          {r.parcelas.aviso_trabalhado > 0 && (
            <ResultRow label={`Aviso trabalhado (${r.diasAviso}d)`} value={r.parcelas.aviso_trabalhado}/>
          )}
          {r.parcelas.decimo_aviso > 0 && (
            <ResultRow label="13º sobre aviso" value={r.parcelas.decimo_aviso}/>
          )}
          {(r.parcelas.ferias_proporcionais > 0 || r.parcelas.ferias_vencidas > 0) && (
            <>
              <ResultRow
                label={`Férias ${r.parcelas.ferias_vencidas > 0 ? '(prop. + venc.)' : 'proporcionais'}`}
                value={r.parcelas.ferias_proporcionais + r.parcelas.ferias_vencidas}/>
              <ResultRow label="+ 1/3 constitucional" value={r.parcelas.um_terco_ferias} dim/>
            </>
          )}
          {r.parcelas.multa_fgts > 0 && (
            <ResultRow label={`Multa ${r.motivo.fgts40 ? '40' : '20'}% FGTS`} value={r.parcelas.multa_fgts}/>
          )}

          <div style={{ height: 1, background: 'var(--border)', margin: '8px 0' }}/>
          <ResultRow label="(−) INSS" value={-r.inss} signed dim/>
          <ResultRow label="(−) IRRF" value={-r.irrf} signed dim/>
          <div style={{ height: 1, background: 'var(--border)', margin: '8px 0' }}/>
          <ResultRow label="Total líquido" value={r.liquido} strong/>
        </div>

        {/* Meta */}
        <div style={{
          padding: '10px 18px',
          background: 'var(--surface-3)',
          borderTop: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column', gap: 4,
          fontSize: 11.5, color: 'var(--fg-muted)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Tempo de empresa</span>
            <span className="mono" style={{ color: 'var(--fg-strong)' }}>
              {r.tempo.years}a {r.tempo.months}m {r.tempo.days}d
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Aviso prévio devido</span>
            <span className="mono" style={{ color: 'var(--fg-strong)' }}>{r.diasAviso} dias</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Seguro-desemprego</span>
            <span style={{ color: r.semSeguro ? 'var(--warning)' : 'var(--success)', fontWeight: 500 }}>
              {r.semSeguro ? 'Sem direito' : 'Com direito'}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div style={{
          display: 'flex', gap: 8, padding: 12,
          borderTop: '1px solid var(--border)',
        }}>
          <Button variant="primary" size="md" icon={<Icon name="copy" size={13}/>} style={{ flex: 1 }}>
            Copiar resumo
          </Button>
          <Button variant="outline" size="md" icon={<Icon name="download" size={13}/>}>
            PDF
          </Button>
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{
        display: 'flex', gap: 8, alignItems: 'flex-start',
        padding: '10px 12px',
        background: 'var(--warning-soft)',
        border: '1px solid rgba(180,83,9,.18)',
        borderRadius: 'var(--r-sm)',
        fontSize: 11.5, color: 'var(--warning)',
        lineHeight: 1.5,
      }}>
        <span style={{ marginTop: 1 }}><Icon name="alert" size={13}/></span>
        <span style={{ color: 'var(--fg-muted)' }}>
          Estimativa orientativa baseada em CLT vigente. Para casos específicos
          (insalubridade, comissões, horas extras habituais) consulte um contador.
        </span>
      </div>
    </aside>
  );
}

/* ============= RELATED TOOLS ===================================== */

const RELATED = [
  { title: 'Salário Líquido', desc: 'INSS, IRRF e descontos', accent: '#2563eb' },
  { title: 'Calc. de Porcentagem', desc: 'Cálculos rápidos', accent: '#7c3aed' },
  { title: 'Calc. de 13º Salário', desc: 'Duas parcelas, INSS e IRRF', accent: '#0891b2' },
  { title: 'Calc. Adicional Noturno', desc: '20%, 25%, hora reduzida', accent: '#d97706' },
  { title: 'Calc. de Férias', desc: 'Abono pecuniário, 1/3', accent: '#16a34a' },
];

function RelatedTools() {
  return (
    <section style={{ padding: '32px 0 56px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
        <h2 style={{
          margin: 0, fontSize: 14, fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--fg-strong)',
        }}>Ferramentas relacionadas</h2>
        <a href="#" style={{
          fontSize: 12, color: 'var(--fg-muted)', textDecoration: 'none',
          display: 'inline-flex', alignItems: 'center', gap: 4,
        }}>
          Ver todas em Calculadoras <Icon name="arrow_right" size={12}/>
        </a>
      </div>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10,
      }}>
        {RELATED.map((t) => (
          <a key={t.title} href="#" style={{
            display: 'flex', flexDirection: 'column', gap: 4,
            padding: '12px 14px',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--r-sm)',
            textDecoration: 'none',
            transition: 'border-color .12s, transform .12s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: t.accent }}/>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--fg-strong)' }}>{t.title}</span>
            </div>
            <span style={{ fontSize: 11.5, color: 'var(--fg-subtle)' }}>{t.desc}</span>
          </a>
        ))}
      </div>
    </section>
  );
}

/* ============= APP =============================================== */

function App() {
  const [theme, setTheme] = useState('light');
  const [state, setState] = useState(DEFAULT_STATE);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const result = useMemo(() => calcular(state), [state]);

  return (
    <>
      <Header theme={theme} onToggleTheme={() => setTheme((t) => t === 'dark' ? 'light' : 'dark')}/>
      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <PageHead result={result}/>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 380px',
          gap: 20,
          alignItems: 'start',
        }}>
          <Form
            state={state}
            setState={setState}
            onReset={() => setState(DEFAULT_STATE)}
          />
          <ResultPanel result={result} state={state}/>
        </div>
        <RelatedTools/>
      </main>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
