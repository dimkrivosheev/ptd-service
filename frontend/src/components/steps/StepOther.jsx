import { Card, Field, Input, Select, Row, NavButtons } from "../FormFields";

const CURRENCIES = ["USD", "EUR", "RUB"];
const SECTIONS = {
  minerals: { num: "3.8", title: "Коллекционные материалы", hint: "Минералы, палеонтология, кости ископаемых животных" },
  bio:      { num: "3.9", title: "Биологические материалы", hint: "Образцы биологических материалов человека" },
  other:    { num: "3.10", title: "Прочие товары с запретами/ограничениями", hint: "Товары, требующие разрешительных документов" },
};

const empty = () => ({ name: "", description: "", doc_name: "", doc_num: "", doc_date: "", weight: "", unit: "кг", value: "", currency: "USD" });

export default function StepOther({ data, update, onNext, onPrev }) {
  const selected = data.selected_types || [];
  const activeKeys = ["minerals", "bio", "other"].filter(k => selected.includes(k));

  return (
    <>
      {activeKeys.map(key => {
        const sec = SECTIONS[key];
        const items = data[`${key}_items`] || [empty()];
        const upd = (arr) => update({ [`${key}_items`]: arr });
        const updItem = (i, f, v) => { const a = [...items]; a[i] = { ...a[i], [f]: v }; upd(a); };

        return (
          <Card key={key} title={`${sec.num}. ${sec.title}`} subtitle={sec.hint}>
            {items.map((item, i) => (
              <div key={i} className="item-block">
                <div className="item-header">
                  <span>Позиция {i + 1}</span>
                  {items.length > 1 && <button className="btn btn-ghost btn-sm" onClick={() => upd(items.filter((_, idx) => idx !== i))}>✕</button>}
                </div>
                <Field label="Наименование и описание"><Input value={item.name} onChange={(e) => updItem(i, "name", e.target.value)} /></Field>
                <Field label="Идентификационный номер / отличительные признаки"><Input value={item.description} onChange={(e) => updItem(i, "description", e.target.value)} /></Field>
                <Row cols={2}>
                  <Field label="Кол-во / вес"><Input type="number" value={item.weight} onChange={(e) => updItem(i, "weight", e.target.value)} /></Field>
                  <Field label="Единица"><Select value={item.unit} onChange={(e) => updItem(i, "unit", e.target.value)}><option>кг</option><option>шт</option><option>л</option></Select></Field>
                </Row>
                <Row cols={2}>
                  <Field label="Стоимость"><Input type="number" value={item.value} onChange={(e) => updItem(i, "value", e.target.value)} /></Field>
                  <Field label="Валюта"><Select value={item.currency} onChange={(e) => updItem(i, "currency", e.target.value)}>{CURRENCIES.map(c => <option key={c}>{c}</option>)}</Select></Field>
                </Row>
                <div className="section-label" style={{ marginTop: 10 }}>Разрешительный документ</div>
                <Field label="Наименование документа и орган выдачи"><Input value={item.doc_name} onChange={(e) => updItem(i, "doc_name", e.target.value)} /></Field>
                <Row cols={2}>
                  <Field label="Номер"><Input value={item.doc_num} onChange={(e) => updItem(i, "doc_num", e.target.value)} /></Field>
                  <Field label="Дата"><Input type="date" value={item.doc_date} onChange={(e) => updItem(i, "doc_date", e.target.value)} /></Field>
                </Row>
              </div>
            ))}
            <button className="btn btn-ghost" onClick={() => upd([...items, empty()])} style={{ marginTop: 8 }}>+ Добавить</button>
          </Card>
        );
      })}
      <NavButtons onPrev={onPrev} onNext={onNext} />
    </>
  );
}
