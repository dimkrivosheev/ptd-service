import { Card, NavButtons } from "../FormFields";

const ITEMS_OPTS = [
  { key: "vehicle",  icon: "🚗", label: "Транспортное средство", desc: "Авто, мотоцикл, прицеп, водное или воздушное судно — раздел 5" },
  { key: "cash",     icon: "💵", label: "Наличные и денежные инструменты", desc: "Свыше 10 000 $ в эквиваленте, векселя, чеки, ценные бумаги — раздел 3.1" },
  { key: "льгота",  icon: "🏷", label: "Товары со льготой (освобождение от пошлин)", desc: "Ввоз без уплаты таможенных пошлин — раздел 3.2" },
  { key: "goods",    icon: "📦", label: "Товары сверх нормы", desc: "Стоимость, вес или количество превышают нормы беспошлинного ввоза — раздел 3.3" },
  { key: "cultural", icon: "🖼", label: "Культурные ценности", desc: "Картины, антиквариат, иконы, монеты, рукописи — раздел 3.4" },
  { key: "weapons",  icon: "🔫", label: "Оружие и патроны", desc: "Гражданское и служебное оружие, основные части, патроны — раздел 3.5" },
  { key: "meds",     icon: "💊", label: "Наркотические и психотропные лекарства", desc: "Наркотические средства, психотропные вещества в виде лекарств — раздел 3.6" },
  { key: "animals",  icon: "🐾", label: "Животные и растения", desc: "Домашние питомцы, дикие животные, растения — раздел 3.7" },
  { key: "minerals", icon: "🪨", label: "Коллекционные материалы", desc: "Минералогия, палеонтология, кости ископаемых животных — раздел 3.8" },
  { key: "bio",      icon: "🧬", label: "Биологические материалы", desc: "Образцы биологических материалов человека — раздел 3.9" },
  { key: "other",    icon: "📋", label: "Прочие товары с запретами", desc: "Товары, требующие разрешительных документов — раздел 3.10" },
];

export default function StepSelectTypes({ data, update, onNext }) {
  const selected = data.selected_types || [];

  const toggle = (key) => {
    const arr = selected.includes(key)
      ? selected.filter(k => k !== key)
      : [...selected, key];
    update({ selected_types: arr });
  };

  // Сохраняем порядок как в бланке
  const ordered = ITEMS_OPTS.map(o => o.key).filter(k => selected.includes(k));

  return (
    <>
      <Card title="Что вы везёте?" subtitle="Отметьте всё что перемещаете через границу — для каждого пункта будет отдельный шаг заполнения">
        <div className="checkbox-grid">
          {ITEMS_OPTS.map(o => {
            const active = selected.includes(o.key);
            return (
              <div key={o.key} className={`check-option ${active ? "active" : ""}`} onClick={() => toggle(o.key)}>
                <span className="check-box">{active ? "✓" : ""}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{o.icon} {o.label}</div>
                  <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{o.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
        {ordered.length === 0 && (
          <div className="empty-hint" style={{ marginTop: 12 }}>Выберите хотя бы один пункт</div>
        )}
      </Card>

      <NavButtons
        onNext={ordered.length > 0 ? onNext : null}
        nextLabel="Далее →"
        disabled={ordered.length === 0}
      />
    </>
  );
}
