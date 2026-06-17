import { Card, NavButtons } from "../FormFields";

const BAGGAGE_OPTS = [
  { key: "accompanied",   label: "2.1. Сопровождаемый багаж, включая ручную кладь" },
  { key: "unaccompanied", label: "2.2. Несопровождаемый багаж (следующий отдельно от лица)" },
  { key: "delivered",     label: "2.3. Доставляемые (пересылаемые) товары без въезда/выезда лица" },
];

const DIRECTION_OPTS = [
  { key: "import",      label: "Ввоз (свободное обращение)" },
  { key: "export",      label: "Вывоз" },
  { key: "temp_export", label: "Временный вывоз" },
  { key: "transit",     label: "Транзит (для товаров, ввозимых со льготой)" },
];

function RadioRow({ label, checked, onChange }) {
  return (
    <div className={`check-option ${checked ? "active" : ""}`} onClick={onChange}>
      <span className="check-box" style={{ borderRadius: "50%" }}>{checked ? "✓" : ""}</span>
      <span>{label}</span>
    </div>
  );
}

export default function StepBaggage({ data, update, onNext, onPrev }) {
  const baggage = data.baggage_type || "";
  const direction = data.direction || "";
  const selected = data.selected_types || [];
  const hasGoods = selected.some(k => k !== "vehicle");

  return (
    <>
      <Card title="Способ перемещения" subtitle="Раздел 2 — выберите один вариант, повторный клик снимает выбор">
        <div className="checkbox-grid">
          {BAGGAGE_OPTS.map(o => (
            <RadioRow key={o.key} label={o.label} checked={baggage === o.key}
              onChange={() => update({ baggage_type: baggage === o.key ? "" : o.key })} />
          ))}
        </div>
      </Card>

      {hasGoods && (
        <Card title="Направление перемещения товаров" subtitle="Раздел 3 — цель ввоза или вывоза. Направление для ТС указывается отдельно в разделе 5">
          <div className="checkbox-grid">
            {DIRECTION_OPTS.map(o => (
              <RadioRow key={o.key} label={o.label} checked={direction === o.key}
                onChange={() => update({ direction: direction === o.key ? "" : o.key })} />
            ))}
          </div>
        </Card>
      )}

      <NavButtons onPrev={onPrev} onNext={onNext} />
    </>
  );
}
