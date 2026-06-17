import { Card, Field, Input, Select, Row, NavButtons } from "../FormFields";

const CURRENCIES = ["USD", "EUR", "RUB", "GBP", "JPY", "CNY", "AED"];
const empty = () => ({ name: "", description: "", doc_name: "", doc_num: "", doc_date: "", doc_issuer: "", weight: "", unit: "кг", value: "", currency: "USD" });

export default function StepLgota({ data, update, onNext, onPrev }) {
  const items = data.lgota_items || [empty()];
  const upd = (arr) => update({ lgota_items: arr });
  const updItem = (i, f, v) => { const a = [...items]; a[i] = { ...a[i], [f]: v }; upd(a); };

  return (
    <>
      <Card title="Товары с освобождением от пошлин" subtitle="Раздел 3.2 — ввоз со льготой">
        <div className="info-box">Товары, ввозимые иностранными физлицами на период пребывания без уплаты пошлин. Укажите каждый товар и документ, подтверждающий льготу.</div>
        {items.map((item, i) => (
          <div key={i} className="item-block">
            <div className="item-header">
              <span>Товар {i + 1}</span>
              {items.length > 1 && <button className="btn btn-ghost btn-sm" onClick={() => upd(items.filter((_, idx) => idx !== i))}>✕</button>}
            </div>
            <Field label="Наименование товара"><Input placeholder="Ноутбук, фотоаппарат..." value={item.name} onChange={(e) => updItem(i, "name", e.target.value)} /></Field>
            <Field label="Описание (марка, модель, серийный номер)"><Input value={item.description} onChange={(e) => updItem(i, "description", e.target.value)} /></Field>
            <Row cols={2}>
              <Field label="Количество / вес"><Input type="number" value={item.weight} onChange={(e) => updItem(i, "weight", e.target.value)} /></Field>
              <Field label="Единица"><Select value={item.unit} onChange={(e) => updItem(i, "unit", e.target.value)}><option>кг</option><option>л</option><option>шт</option></Select></Field>
            </Row>
            <Row cols={2}>
              <Field label="Стоимость"><Input type="number" value={item.value} onChange={(e) => updItem(i, "value", e.target.value)} /></Field>
              <Field label="Валюта"><Select value={item.currency} onChange={(e) => updItem(i, "currency", e.target.value)}>{CURRENCIES.map(c => <option key={c}>{c}</option>)}</Select></Field>
            </Row>
            <div className="section-label" style={{ marginTop: 10 }}>Документ, подтверждающий льготу</div>
            <Field label="Наименование документа и орган выдачи"><Input placeholder="Разрешение, свидетельство..." value={item.doc_name} onChange={(e) => updItem(i, "doc_name", e.target.value)} /></Field>
            <Row cols={2}>
              <Field label="Номер"><Input value={item.doc_num} onChange={(e) => updItem(i, "doc_num", e.target.value)} /></Field>
              <Field label="Дата"><Input type="date" value={item.doc_date} onChange={(e) => updItem(i, "doc_date", e.target.value)} /></Field>
            </Row>
          </div>
        ))}
        <button className="btn btn-ghost" onClick={() => upd([...items, empty()])} style={{ marginTop: 8 }}>+ Добавить товар</button>
      </Card>
      <NavButtons onPrev={onPrev} onNext={onNext} />
    </>
  );
}
