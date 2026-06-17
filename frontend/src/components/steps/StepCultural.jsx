import { Card, Field, Input, Select, Row, NavButtons } from "../FormFields";
const CURRENCIES = ["USD","EUR","RUB","GBP"];
const empty = () => ({ name:"", description:"", date_create:"", doc_name:"", doc_num:"", doc_date:"", doc_issuer:"", weight:"", value:"", currency:"USD" });

export default function StepCultural({ data, update, onNext, onPrev }) {
  const items = data.cultural_items || [empty()];
  const upd = (arr) => update({ cultural_items: arr });
  const updItem = (i, f, v) => { const a=[...items]; a[i]={...a[i],[f]:v}; upd(a); };
  return (
    <>
      <Card title="Культурные ценности" subtitle="Раздел 3.4 + Раздел 4 — картины, антиквариат, иконы, монеты, рукописи">
        <div className="info-box">Ввоз/вывоз культурных ценностей требует заключения Министерства культуры РФ. Укажите каждый предмет отдельно.</div>
        {items.map((item, i) => (
          <div key={i} className="item-block">
            <div className="item-header"><span>Предмет {i+1}</span>{items.length>1&&<button className="btn btn-ghost btn-sm" onClick={()=>upd(items.filter((_,idx)=>idx!==i))}>✕</button>}</div>
            <Field label="Наименование предмета"><Input placeholder="Икона, живопись, монета..." value={item.name} onChange={e=>updItem(i,"name",e.target.value)} /></Field>
            <Field label="Описание (автор, техника, материал, размер, особые признаки)"><Input placeholder="Масло на холсте, 60x80 см, подпись автора..." value={item.description} onChange={e=>updItem(i,"description",e.target.value)} /></Field>
            <Row cols={2}>
              <Field label="Дата (период) создания"><Input placeholder="XIX век / 1875" value={item.date_create} onChange={e=>updItem(i,"date_create",e.target.value)} /></Field>
              <Field label="Стоимость"><Input type="number" placeholder="5000" value={item.value} onChange={e=>updItem(i,"value",e.target.value)} /></Field>
            </Row>
            <Row cols={2}>
              <Field label="Валюта"><Select value={item.currency} onChange={e=>updItem(i,"currency",e.target.value)}>{CURRENCIES.map(c=><option key={c}>{c}</option>)}</Select></Field>
              <Field label="Вес (кг)"><Input type="number" placeholder="2.5" value={item.weight} onChange={e=>updItem(i,"weight",e.target.value)} /></Field>
            </Row>
            <div className="section-label" style={{marginTop:10}}>Разрешительный документ Минкультуры</div>
            <Field label="Наименование документа и орган выдачи"><Input placeholder="Заключение Минкультуры России" value={item.doc_name} onChange={e=>updItem(i,"doc_name",e.target.value)} /></Field>
            <Row cols={2}>
              <Field label="Номер"><Input placeholder="№ 12345" value={item.doc_num} onChange={e=>updItem(i,"doc_num",e.target.value)} /></Field>
              <Field label="Дата"><Input type="date" value={item.doc_date} onChange={e=>updItem(i,"doc_date",e.target.value)} /></Field>
            </Row>
          </div>
        ))}
        <button className="btn btn-ghost" onClick={()=>upd([...items,empty()])} style={{marginTop:8}}>+ Добавить предмет</button>
      </Card>
      <NavButtons onPrev={onPrev} onNext={onNext} />
    </>
  );
}
