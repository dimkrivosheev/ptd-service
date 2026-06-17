import { Card, Field, Input, Select, Row, NavButtons } from "../FormFields";

const CURRENCIES = ["USD", "EUR", "RUB", "GBP", "JPY", "CNY", "AED"];
const emptyItem = () => ({ name: "", description: "", doc_name: "", doc_num: "", doc_date: "", weight: "", unit: "кг", value: "", currency: "USD" });

export default function StepGoods({ data, update, onNext, onPrev }) {
  const items = data.goods_items || [emptyItem()];
  const updItems = (arr) => update({ goods_items: arr });
  const updItem = (i, f, v) => { const a = [...items]; a[i] = { ...a[i], [f]: v }; updItems(a); };

  return (
    <>
      <Card title="Товары" subtitle="Раздел 3.3 + Раздел 4 — товары сверх нормы беспошлинного ввоза">
        <div className="info-box">Норма беспошлинного ввоза: стоимость до 1 000 € и вес до 25 кг (авиа — до 10 000 €). Декларируйте товары, превышающие эти нормы.</div>
        {items.map((item, i) => (
          <div key={i} className="item-block">
            <div className="item-header">
              <span>Товар {i + 1}</span>
              {items.length > 1 && <button className="btn btn-ghost btn-sm" onClick={() => updItems(items.filter((_, idx) => idx !== i))}>✕</button>}
            </div>
            <Field label="Наименование"><Input placeholder="Смартфон, ноутбук, часы..." value={item.name} onChange={(e) => updItem(i, "name", e.target.value)} /></Field>
            <Field label="Описание (марка, модель, серийный номер, цвет)"><Input placeholder="Apple iPhone 15 Pro, SN ABCD1234" value={item.description} onChange={(e) => updItem(i, "description", e.target.value)} /></Field>
            <Row cols={2}>
              <Field label="Количество / вес"><Input type="number" placeholder="1.5" value={item.weight} onChange={(e) => updItem(i, "weight", e.target.value)} /></Field>
              <Field label="Единица"><Select value={item.unit} onChange={(e) => updItem(i, "unit", e.target.value)}><option>кг</option><option>л</option><option>шт</option></Select></Field>
            </Row>
            <Row cols={2}>
              <Field label="Стоимость"><Input type="number" placeholder="500" value={item.value} onChange={(e) => updItem(i, "value", e.target.value)} /></Field>
              <Field label="Валюта"><Select value={item.currency} onChange={(e) => updItem(i, "currency", e.target.value)}>{CURRENCIES.map(c => <option key={c}>{c}</option>)}</Select></Field>
            </Row>
            <div className="section-label" style={{marginTop:10}}>Разрешительный документ (если есть)</div>
            <Field label="Наименование документа и орган выдачи"><Input placeholder="Сертификат, Роспотребнадзор..." value={item.doc_name} onChange={(e) => updItem(i, "doc_name", e.target.value)} /></Field>
            <Row cols={2}>
              <Field label="Номер"><Input placeholder="№ 12345" value={item.doc_num} onChange={(e) => updItem(i, "doc_num", e.target.value)} /></Field>
              <Field label="Дата"><Input type="date" value={item.doc_date} onChange={(e) => updItem(i, "doc_date", e.target.value)} /></Field>
            </Row>
          </div>
        ))}
        <button className="btn btn-ghost" onClick={() => updItems([...items, emptyItem()])} style={{marginTop:8}}>+ Добавить товар</button>
      </Card>
      <NavButtons onPrev={onPrev} onNext={onNext} />
    </>
  );
}
