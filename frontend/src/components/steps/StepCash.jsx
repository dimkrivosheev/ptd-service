import { useState } from "react";
import { Card, Field, Input, Select, Row, RadioGroup, NavButtons } from "../FormFields";

const CURRENCIES = ["USD","EUR","RUB","GBP","JPY","CNY","AED","CHF","KZT","GEL","AMD","BYN"];
const SOURCES = [
  { key: "salary",      label: "Зарплата / доходы от бизнеса" },
  { key: "dividends",   label: "Дивиденды / доходы от участия в капитале" },
  { key: "property",    label: "Доходы от реализации имущества" },
  { key: "transfers",   label: "Безвозмездные трансферты (матпомощь, гранты)" },
  { key: "pension",     label: "Пенсия, стипендия, соцпособия, алименты" },
  { key: "rent",        label: "Доходы от аренды" },
  { key: "loan",        label: "Заёмные средства" },
  { key: "inheritance", label: "Наследство" },
  { key: "other",       label: "Прочее" },
];
const PURPOSES = [
  { key: "expenses",    label: "Текущие расходы (товары и услуги)" },
  { key: "investment",  label: "Инвестиции, в т.ч. недвижимость" },
  { key: "transfer_p",  label: "Безвозмездные трансферты физлицам" },
  { key: "transfer_l",  label: "Благотворительность / пожертвования юрлицам" },
  { key: "other",       label: "Прочее" },
];

export default function StepCash({ data, update, onNext, onPrev }) {
  const d = data;
  const cash = d.cash || { banknotes: [{ amount: "", currency: "USD" }], cheques: "", instruments: [], own: true, sources: [], purposes: [], transport: "auto", other_source: "", other_purpose: "" };

  const updCash = (patch) => update({ cash: { ...cash, ...patch } });

  const addBanknote = () => updCash({ banknotes: [...(cash.banknotes || []), { amount: "", currency: "USD" }] });
  const updBanknote = (i, field, val) => {
    const arr = [...(cash.banknotes || [])];
    arr[i] = { ...arr[i], [field]: val };
    updCash({ banknotes: arr });
  };
  const removeBanknote = (i) => updCash({ banknotes: cash.banknotes.filter((_, idx) => idx !== i) });

  const toggleSource = (key) => {
    const arr = cash.sources || [];
    updCash({ sources: arr.includes(key) ? arr.filter((k) => k !== key) : [...arr, key] });
  };
  const togglePurpose = (key) => {
    const arr = cash.purposes || [];
    updCash({ purposes: arr.includes(key) ? arr.filter((k) => k !== key) : [...arr, key] });
  };

  return (
    <>
      <Card title="Наличные денежные средства" subtitle="Раздел 3.1 + Приложение к ПТД">

        {/* Банкноты */}
        <div className="section-label">Банкноты и монеты</div>
        {(cash.banknotes || []).map((b, i) => (
          <Row cols={2} key={i}>
            <Field label={`Сумма ${i + 1}`}>
              <Input type="number" placeholder="10000" value={b.amount} onChange={(e) => updBanknote(i, "amount", e.target.value)} />
            </Field>
            <Field label="Валюта">
              <div style={{ display: "flex", gap: 8 }}>
                <Select value={b.currency} onChange={(e) => updBanknote(i, "currency", e.target.value)} style={{ flex: 1 }}>
                  {CURRENCIES.map((c) => <option key={c}>{c}</option>)}
                </Select>
                {i > 0 && <button className="btn btn-ghost btn-sm" onClick={() => removeBanknote(i)}>✕</button>}
              </div>
            </Field>
          </Row>
        ))}
        <button className="btn btn-ghost btn-sm" onClick={addBanknote} style={{ marginBottom: 16 }}>+ Добавить валюту</button>

        {/* Дорожные чеки */}
        <Field label="Дорожные чеки (сумма в USD-эквиваленте, если есть)">
          <Input type="number" placeholder="0" value={cash.cheques || ""} onChange={(e) => updCash({ cheques: e.target.value })} />
        </Field>

        <div className="divider" />

        {/* Дата рождения (для Приложения) */}
        <div className="section-label">Дополнительные сведения (Приложение к ПТД)</div>
        <Row cols={2}>
          <Field label="Дата рождения декларанта">
            <Input type="date" value={d.birth_date || ""} onChange={(e) => update({ birth_date: e.target.value })} />
          </Field>
          <Field label="Номер и дата визы (если есть)">
            <Input placeholder="Visa № / дата" value={cash.visa || ""} onChange={(e) => updCash({ visa: e.target.value })} />
          </Field>
        </Row>

        {/* Владелец */}
        <Field label="Декларант является собственником средств?">
          <RadioGroup
            name="cash_own"
            value={cash.own ? "yes" : "no"}
            onChange={(v) => updCash({ own: v === "yes" })}
            options={[{ value: "yes", label: "Да, мои средства" }, { value: "no", label: "Нет, везу для другого лица" }]}
          />
        </Field>

        {!cash.own && (
          <Card title="Сведения о владельце средств" subtitle="Раздел 3 Приложения">
            <Field label="ФИО или наименование организации">
              <Input value={cash.owner_name || ""} onChange={(e) => updCash({ owner_name: e.target.value })} />
            </Field>
            <Field label="Адрес владельца">
              <Input value={cash.owner_address || ""} onChange={(e) => updCash({ owner_address: e.target.value })} />
            </Field>
            <Field label="Сумма / количество и наименование инструментов">
              <Input value={cash.owner_amount || ""} onChange={(e) => updCash({ owner_amount: e.target.value })} />
            </Field>
          </Card>
        )}

        {/* Источник */}
        <div className="section-label">Источник происхождения средств</div>
        <div className="checkbox-grid">
          {SOURCES.map((s) => (
            <label key={s.key} className={`check-option ${(cash.sources || []).includes(s.key) ? "active" : ""}`} onClick={() => toggleSource(s.key)}>
              <span className="check-box">{(cash.sources || []).includes(s.key) ? "✓" : ""}</span>
              {s.label}
            </label>
          ))}
        </div>
        {(cash.sources || []).includes("other") && (
          <Field label="Укажите источник">
            <Input value={cash.other_source || ""} onChange={(e) => updCash({ other_source: e.target.value })} />
          </Field>
        )}

        {/* Цель */}
        <div className="section-label" style={{ marginTop: 16 }}>Предполагаемое использование средств</div>
        <div className="checkbox-grid">
          {PURPOSES.map((p) => (
            <label key={p.key} className={`check-option ${(cash.purposes || []).includes(p.key) ? "active" : ""}`} onClick={() => togglePurpose(p.key)}>
              <span className="check-box">{(cash.purposes || []).includes(p.key) ? "✓" : ""}</span>
              {p.label}
            </label>
          ))}
        </div>
        {(cash.purposes || []).includes("other") && (
          <Field label="Укажите цель">
            <Input value={cash.other_purpose || ""} onChange={(e) => updCash({ other_purpose: e.target.value })} />
          </Field>
        )}

        {/* Вид транспорта */}
        <div className="section-label" style={{ marginTop: 16 }}>Вид транспорта перевозки средств</div>
        <RadioGroup
          name="cash_transport"
          value={cash.transport || "auto"}
          onChange={(v) => updCash({ transport: v })}
          options={[
            { value: "air", label: "Воздушный" },
            { value: "auto", label: "Автомобильный" },
            { value: "rail", label: "Железнодорожный" },
            { value: "sea", label: "Водный" },
          ]}
        />
      </Card>

      <NavButtons onPrev={onPrev} onNext={onNext} />
    </>
  );
}
