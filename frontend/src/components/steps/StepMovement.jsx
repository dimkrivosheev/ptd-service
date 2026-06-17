import { Card, Field, NavButtons } from "../FormFields";

const BAGGAGE_OPTS = [
  { key: "accompanied", label: "2.1. Сопровождаемый багаж, включая ручную кладь" },
  { key: "unaccompanied", label: "2.2. Несопровождаемый багаж (следующий отдельно от лица)" },
  { key: "delivered", label: "2.3. Доставляемые (пересылаемые) товары без въезда/выезда лица" },
];

const DIRECTION_OPTS = [
  { key: "import", label: "Ввоз (свободное обращение)" },
  { key: "export", label: "Вывоз" },
  { key: "temp_export", label: "Временный вывоз" },
  { key: "transit", label: "Транзит (для товаров, ввозимых со льготой)" },
];

const ITEMS_OPTS = [
  { key: "cash",        label: "3.1. Наличные денежные средства и (или) дорожные чеки свыше 10 000 $ в эквиваленте, векселя, чеки, ценные бумаги *" },
  { key: "льгота",     label: "3.2. Товары, ввозимые с освобождением от уплаты таможенных пошлин, налогов (ввоз со льготой)" },
  { key: "goods",       label: "3.3. Товары, стоимость, вес и (или) количество которых превышают нормы ввоза без уплаты таможенных пошлин, налогов" },
  { key: "cultural",    label: "3.4. Культурные ценности" },
  { key: "weapons",     label: "3.5. Гражданское и служебное оружие, его основные (составные) части, патроны к нему" },
  { key: "meds",        label: "3.6. Наркотические средства, психотропные вещества, их прекурсоры в виде лекарственных средств" },
  { key: "animals",     label: "3.7. Животные, растения" },
  { key: "minerals",    label: "3.8. Коллекционные материалы по минералогии, палеонтологии, кости ископаемых животных" },
  { key: "bio",         label: "3.9. Образцы биологических материалов человека" },
  { key: "other",       label: "3.10. Другие товары, в отношении которых подлежат соблюдению запреты и ограничения" },
  { key: "vehicle",     label: "5. Транспортное средство (авто, мото, прицеп, водное, воздушное судно)" },
];

function CheckRow({ label, checked, onChange }) {
  return (
    <div className={`check-option ${checked ? "active" : ""}`} onClick={onChange}>
      <span className="check-box">{checked ? "✓" : ""}</span>
      <span>{label}</span>
    </div>
  );
}

function RadioRow({ label, checked, onChange }) {
  return (
    <div className={`check-option ${checked ? "active" : ""}`} onClick={onChange}>
      <span className="check-box" style={{ borderRadius: "50%" }}>{checked ? "✓" : ""}</span>
      <span>{label}</span>
    </div>
  );
}

export default function StepMovement({ data, update, onNext, onPrev }) {
  const d = data;
  const selected = d.selected_types || [];
  const baggage = d.baggage_type || "";
  const direction = d.direction || "";

  const toggleBaggage = (key) => update({ baggage_type: baggage === key ? "" : key });
  const toggleDirection = (key) => update({ direction: direction === key ? "" : key });
  const toggleType = (key) => {
    const arr = selected.includes(key) ? selected.filter(k => k !== key) : [...selected, key];
    update({ selected_types: arr });
  };

  return (
    <>
      <Card title="Способ перемещения" subtitle="Раздел 2 — выберите один вариант">
        <div className="checkbox-grid">
          {BAGGAGE_OPTS.map(o => (
            <RadioRow key={o.key} label={o.label} checked={baggage === o.key} onChange={() => toggleBaggage(o.key)} />
          ))}
        </div>
      </Card>

      <Card title="Направление" subtitle="Раздел 3 — цель перемещения товаров">
        <div className="checkbox-grid">
          {DIRECTION_OPTS.map(o => (
            <RadioRow key={o.key} label={o.label} checked={direction === o.key} onChange={() => toggleDirection(o.key)} />
          ))}
        </div>
      </Card>

      <Card title="Что перемещаете?" subtitle="Разделы 3.1–3.10 и 5 — отметьте всё что везёте">
        <div className="info-box">Отметьте все пункты, которые относятся к вашей ситуации. Для каждого отмеченного пункта будет отдельный шаг заполнения.</div>
        <div className="checkbox-grid">
          {ITEMS_OPTS.map(o => (
            <CheckRow key={o.key} label={o.label} checked={selected.includes(o.key)} onChange={() => toggleType(o.key)} />
          ))}
        </div>
      </Card>

      <NavButtons onPrev={onPrev} onNext={selected.length > 0 ? onNext : null} nextLabel="Далее →" disabled={selected.length === 0} />
    </>
  );
}
