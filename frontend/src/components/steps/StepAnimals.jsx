import { Card, Field, Input, Select, Row, NavButtons } from "../FormFields";
const empty = () => ({ type:"", species:"", count:1, age:"", doc_vet:"", doc_cites_num:"", doc_cites_date:"", microchip:"" });

export default function StepAnimals({ data, update, onNext, onPrev }) {
  const items = data.animals_items || [empty()];
  const upd = (arr) => update({ animals_items: arr });
  const updItem = (i, f, v) => { const a=[...items]; a[i]={...a[i],[f]:v}; upd(a); };
  return (
    <>
      <Card title="Животные и растения" subtitle="Раздел 3.7 + Раздел 4">
        <div className="info-box">Для ввоза домашних животных нужны ветеринарное свидетельство и чип. Для диких/редких видов — разрешение CITES (СИТЕС).</div>
        {items.map((item, i) => (
          <div key={i} className="item-block">
            <div className="item-header"><span>Животное/растение {i+1}</span>{items.length>1&&<button className="btn btn-ghost btn-sm" onClick={()=>upd(items.filter((_,idx)=>idx!==i))}>✕</button>}</div>
            <Row cols={2}>
              <Field label="Категория">
                <Select value={item.type} onChange={e=>updItem(i,"type",e.target.value)}>
                  <option value="">— выберите —</option>
                  <option>Домашнее животное (кошка/собака)</option>
                  <option>Птица</option>
                  <option>Рептилия</option>
                  <option>Рыба</option>
                  <option>Грызун</option>
                  <option>Дикое животное (CITES)</option>
                  <option>Растение</option>
                  <option>Семена</option>
                </Select>
              </Field>
              <Field label="Вид (порода)"><Input placeholder="Лабрадор / Ficus benjamina" value={item.species} onChange={e=>updItem(i,"species",e.target.value)} /></Field>
            </Row>
            <Row cols={2}>
              <Field label="Количество"><Input type="number" min="1" value={item.count} onChange={e=>updItem(i,"count",e.target.value)} /></Field>
              <Field label="Возраст"><Input placeholder="3 года / 5 лет" value={item.age} onChange={e=>updItem(i,"age",e.target.value)} /></Field>
            </Row>
            <Field label="Номер микрочипа (для животных)"><Input placeholder="643098100123456" value={item.microchip} onChange={e=>updItem(i,"microchip",e.target.value)} /></Field>
            <div className="section-label" style={{marginTop:10}}>Ветеринарные документы</div>
            <Field label="Ветеринарное свидетельство / сертификат (номер и орган выдачи)"><Input placeholder="№ 12345, Россельхознадзор" value={item.doc_vet} onChange={e=>updItem(i,"doc_vet",e.target.value)} /></Field>
            <Field label="Разрешение CITES (номер и дата, если применимо)">
              <Row cols={2}>
                <Input placeholder="RU/YYYYНН/XXXXX" value={item.doc_cites_num} onChange={e=>updItem(i,"doc_cites_num",e.target.value)} />
                <Input type="date" value={item.doc_cites_date} onChange={e=>updItem(i,"doc_cites_date",e.target.value)} />
              </Row>
            </Field>
          </div>
        ))}
        <button className="btn btn-ghost" onClick={()=>upd([...items,empty()])} style={{marginTop:8}}>+ Добавить животное/растение</button>
      </Card>
      <NavButtons onPrev={onPrev} onNext={onNext} />
    </>
  );
}
