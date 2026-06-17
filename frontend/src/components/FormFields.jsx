import { useState, useRef, useEffect } from "react";

const COUNTRIES = ['Австралия','Австрия','Азербайджан','Албания','Алжир','Ангола','Андорра','Аргентина','Армения','Афганистан','Багамы','Бангладеш','Бахрейн','Беларусь','Бельгия','Болгария','Боливия','Босния и Герцеговина','Бразилия','Великобритания','Венгрия','Венесуэла','Вьетнам','Германия','Греция','Грузия','Дания','Египет','Израиль','Индия','Индонезия','Иордания','Ирак','Иран','Ирландия','Исландия','Испания','Италия','Казахстан','Камбоджа','Канада','Катар','Кения','Кипр','Китай','Колумбия','Республика Корея','Куба','Кувейт','Кыргызстан','Латвия','Ливан','Литва','Люксембург','Малайзия','Мальта','Марокко','Мексика','Молдова','Монголия','Нидерланды','Новая Зеландия','Норвегия','ОАЭ','Оман','Пакистан','Панама','Перу','Польша','Португалия','Россия','Румыния','Саудовская Аравия','Сербия','Сингапур','Сирия','Словакия','Словения','США','Таджикистан','Таиланд','Танзания','Тунис','Туркменистан','Турция','Узбекистан','Украина','Уругвай','Филиппины','Финляндия','Франция','Хорватия','Чехия','Чили','Швейцария','Швеция','Эстония','Япония'];

// Общий input
export function Field({ label, hint, children }) {
  return (
    <div className="field">
      {label && <label className="field-label">{label}</label>}
      {children}
      {hint && <div className="field-hint">{hint}</div>}
    </div>
  );
}

export function Input({ ...props }) {
  return <input className="input" {...props} />;
}

export function Select({ children, ...props }) {
  return <select className="input" {...props}>{children}</select>;
}

// Сетки
export function Row({ cols = 2, children }) {
  return <div className={`row-${cols}`}>{children}</div>;
}

// Автодополнение стран
export function CountryInput({ value, onChange, placeholder = "Введите название..." }) {
  const [query, setQuery] = useState(value || "");
  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState(-1);
  const ref = useRef();

  useEffect(() => { setQuery(value || ""); }, [value]);

  const matches = query.length > 0
    ? COUNTRIES.filter((c) => c.toLowerCase().startsWith(query.toLowerCase())).slice(0, 8)
    : [];

  const select = (country) => {
    setQuery(country);
    onChange(country);
    setOpen(false);
    setHi(-1);
  };

  const handleKey = (e) => {
    if (!open || !matches.length) return;
    if (e.key === "ArrowDown") { setHi((h) => Math.min(h + 1, matches.length - 1)); e.preventDefault(); }
    else if (e.key === "ArrowUp") { setHi((h) => Math.max(h - 1, 0)); e.preventDefault(); }
    else if (e.key === "Enter" && hi >= 0) { select(matches[hi]); e.preventDefault(); }
    else if (e.key === "Escape") setOpen(false);
  };

  return (
    <div className="ac-wrap" ref={ref}>
      <input
        className="input"
        value={query}
        placeholder={placeholder}
        autoComplete="off"
        onChange={(e) => { setQuery(e.target.value); setOpen(true); setHi(-1); onChange(e.target.value); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onKeyDown={handleKey}
      />
      {open && matches.length > 0 && (
        <div className="ac-list">
          {matches.map((c, i) => (
            <div
              key={c}
              className={`ac-item ${i === hi ? "hl" : ""}`}
              onMouseDown={(e) => { e.preventDefault(); select(c); }}
            >{c}</div>
          ))}
        </div>
      )}
    </div>
  );
}

// Dadata адрес
const DADATA_TOKEN = 'd46912b1c8b1add94bbfdaa75bc24cf5ff18fdd7';
export function AddressInput({ value, onChange }) {
  const [query, setQuery] = useState(value || "");
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const timer = useRef();

  useEffect(() => { setQuery(value || ""); }, [value]);

  const fetchSuggestions = (val) => {
    clearTimeout(timer.current);
    if (!val || val.length < 3) { setSuggestions([]); return; }
    timer.current = setTimeout(async () => {
      try {
        const r = await fetch('https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Token ' + DADATA_TOKEN },
          body: JSON.stringify({ query: val, count: 7, locations: [{ country: 'Россия' }] }),
        });
        const d = await r.json();
        setSuggestions(d.suggestions || []);
        setOpen(true);
      } catch {}
    }, 300);
  };

  return (
    <div className="ac-wrap">
      <input
        className="input"
        value={query}
        placeholder="Начните вводить адрес..."
        autoComplete="off"
        onChange={(e) => { setQuery(e.target.value); onChange(e.target.value); fetchSuggestions(e.target.value); }}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
      />
      {open && suggestions.length > 0 && (
        <div className="ac-list">
          {suggestions.map((s) => (
            <div key={s.value} className="ac-item" onMouseDown={(e) => { e.preventDefault(); setQuery(s.value); onChange(s.value); setOpen(false); }}>
              {s.value}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Radio group (кастомный)
export function RadioGroup({ name, options, value, onChange, toggleable = false }) {
  return (
    <div className="radio-group">
      {options.map((opt) => (
        <div
          key={opt.value}
          className={`radio-option ${value === opt.value ? "sel" : ""}`}
          onClick={() => { if (toggleable && value === opt.value) { onChange(""); } else { onChange(opt.value); } }}
        >
          <span className="radio-dot" />
          <span className="radio-label">{opt.label}</span>
        </div>
      ))}
    </div>
  );
}

// Кнопки навигации
export function NavButtons({ onPrev, onNext, nextLabel = "Далее →", prevLabel = "← Назад", disabled = false }) {
  return (
    <div className="nav-btns">
      {onPrev && <button className="btn btn-ghost" onClick={onPrev}>{prevLabel}</button>}
      {onNext && <button className="btn btn-primary" onClick={onNext} disabled={disabled}>{nextLabel}</button>}
    </div>
  );
}

// Card wrapper
export function Card({ title, subtitle, children }) {
  return (
    <div className="card">
      {title && <div className="card-title">{title}</div>}
      {subtitle && <div className="card-sub">{subtitle}</div>}
      {children}
    </div>
  );
}
