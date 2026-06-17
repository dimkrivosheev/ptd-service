import { Card, Field, Input, Select, Row, NavButtons } from "../FormFields";
const empty = () => ({ name:"", substance:"", form:"", dosage:"", quantity:"", unit:"уп.", doc_name:"", doc_num:"", doc_date:"", doc_issuer:"" });

export default function StepMeds({ data, update, onNext, onPrev }) {
  const items = data.meds_items || [empty()];
  const upd = (arr) => update({ meds_items: arr });
  const updItem = (i, f, v) => { const a=[...items]; a[i]={...a[i],[f]:v}; upd(a); };
  return (
    <>
      <Card title="Лекарственные средства" subtitle="Раздел 3.6 + Раздел 4 — наркотические, психотропные и их прекурсоры">
        <div className="info-box">Декларируются только наркотические/психотропные препараты (списки I–V). Обычные лекарства (аспирин, антибиотики) не декларируются. Требуется рецепт врача.</div>
        {items.map((item, i) => (
          <div key={i} className="item-block">
            <div className="item-header"><span>Препарат {i+1}</span>{items.length>1&&<button className="btn btn-ghost btn-sm" onClick={()=>upd(items.filter((_,idx)=>idx!==i))}>✕</button>}</div>
            <Field label="Торговое наименование препарата"><Input placeholder="Трамадол, Кодеин..." value={item.name} onChange={e=>updItem(i,"name",e.target.value)} /></Field>
            <Field label="МНН (действующее вещество)"><Input placeholder="Tramadol hydrochloride" value={item.substance} onChange={e=>updItem(i,"substance",e.target.value)} /></Field>
            <Row cols={2}>
              <Field label="Форма выпуска"><Select value={item.form} onChange={e=>updItem(i,"form",e.target.value)}><option value="">— выберите —</option><option>Таблетки</option><option>Капсулы</option><option>Раствор для инъекций</option><option>Пластырь</option><option>Сироп</option><option>Суппозитории</option></Select></Field>
              <Field label="Дозировка"><Input placeholder="50 мг" value={item.dosage} onChange={e=>updItem(i,"dosage",e.target.value)} /></Field>
            </Row>
            <Row cols={2}>
              <Field label="Количество"><Input type="number" placeholder="2" value={item.quantity} onChange={e=>updItem(i,"quantity",e.target.value)} /></Field>
              <Field label="Единица"><Select value={item.unit} onChange={e=>updItem(i,"unit",e.target.value)}><option>уп.</option><option>ампул</option><option>таблеток</option><option>мл</option></Select></Field>
            </Row>
            <div className="section-label" style={{marginTop:10}}>Рецепт / разрешение</div>
            <Field label="Наименование документа и орган выдачи"><Input placeholder="Рецепт врача, ФСКН / МВД..." value={item.doc_name} onChange={e=>updItem(i,"doc_name",e.target.value)} /></Field>
            <Row cols={2}>
              <Field label="Номер"><Input value={item.doc_num} onChange={e=>updItem(i,"doc_num",e.target.value)} /></Field>
              <Field label="Дата"><Input type="date" value={item.doc_date} onChange={e=>updItem(i,"doc_date",e.target.value)} /></Field>
            </Row>
          </div>
        ))}
        <button className="btn btn-ghost" onClick={()=>upd([...items,empty()])} style={{marginTop:8}}>+ Добавить препарат</button>
      </Card>
      <NavButtons onPrev={onPrev} onNext={onNext} />
    </>
  );
}
