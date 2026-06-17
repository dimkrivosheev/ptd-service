import { Card, Field, Input, Select, Row, NavButtons } from "../FormFields";
const CURRENCIES = ["USD","EUR","RUB"];
const empty = () => ({ type:"", brand:"", model:"", serial:"", caliber:"", ammo_count:"", doc_name:"", doc_num:"", doc_date:"", doc_issuer:"", value:"", currency:"USD" });

export default function StepWeapons({ data, update, onNext, onPrev }) {
  const items = data.weapons_items || [empty()];
  const upd = (arr) => update({ weapons_items: arr });
  const updItem = (i, f, v) => { const a=[...items]; a[i]={...a[i],[f]:v}; upd(a); };
  return (
    <>
      <Card title="Оружие" subtitle="Раздел 3.5 + Раздел 4 — гражданское и служебное оружие, части, патроны">
        <div className="info-box">Требуются разрешение МВД на ввоз/вывоз и лицензия. Физлицам разрешено не более 5 единиц оружия и 1 000 патронов.</div>
        {items.map((item, i) => (
          <div key={i} className="item-block">
            <div className="item-header"><span>Оружие {i+1}</span>{items.length>1&&<button className="btn btn-ghost btn-sm" onClick={()=>upd(items.filter((_,idx)=>idx!==i))}>✕</button>}</div>
            <Row cols={2}>
              <Field label="Вид оружия">
                <Select value={item.type} onChange={e=>updItem(i,"type",e.target.value)}>
                  <option value="">— выберите —</option>
                  <option>Охотничье ружьё</option>
                  <option>Охотничий карабин</option>
                  <option>Спортивный пистолет</option>
                  <option>Спортивная винтовка</option>
                  <option>Газовый пистолет</option>
                  <option>Основная часть оружия</option>
                  <option>Патроны</option>
                </Select>
              </Field>
              <Field label="Марка / модель"><Input placeholder="Beretta CX4 Storm" value={item.model} onChange={e=>updItem(i,"model",e.target.value)} /></Field>
            </Row>
            <Row cols={2}>
              <Field label="Серийный номер"><Input placeholder="AB12345" value={item.serial} onChange={e=>updItem(i,"serial",e.target.value)} /></Field>
              <Field label="Калибр"><Input placeholder="9×19 / .308 Win" value={item.caliber} onChange={e=>updItem(i,"caliber",e.target.value)} /></Field>
            </Row>
            <Row cols={2}>
              <Field label="Количество патронов"><Input type="number" placeholder="100" value={item.ammo_count} onChange={e=>updItem(i,"ammo_count",e.target.value)} /></Field>
              <Field label="Стоимость"><Input type="number" placeholder="1500" value={item.value} onChange={e=>updItem(i,"value",e.target.value)} /></Field>
            </Row>
            <div className="section-label" style={{marginTop:10}}>Разрешительный документ (МВД / Росгвардия)</div>
            <Field label="Наименование документа и орган выдачи"><Input placeholder="Разрешение МВД России на ввоз оружия" value={item.doc_name} onChange={e=>updItem(i,"doc_name",e.target.value)} /></Field>
            <Row cols={2}>
              <Field label="Номер"><Input value={item.doc_num} onChange={e=>updItem(i,"doc_num",e.target.value)} /></Field>
              <Field label="Дата"><Input type="date" value={item.doc_date} onChange={e=>updItem(i,"doc_date",e.target.value)} /></Field>
            </Row>
          </div>
        ))}
        <button className="btn btn-ghost" onClick={()=>upd([...items,empty()])} style={{marginTop:8}}>+ Добавить единицу</button>
      </Card>
      <NavButtons onPrev={onPrev} onNext={onNext} />
    </>
  );
}
