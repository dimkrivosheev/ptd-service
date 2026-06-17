import { useState } from "react";
import { Card, NavButtons } from "../FormFields";

const TYPES = [
  { key: "vehicle",  icon: "🚗", label: "Транспортное средство",    desc: "Авто, мотоцикл, прицеп" },
  { key: "cash",     icon: "💵", label: "Наличные и денежные инструменты", desc: "Свыше 10 000 $ в эквиваленте, векселя, чеки, ценные бумаги" },
  { key: "goods",    icon: "📦", label: "Товары",                   desc: "Сверх нормы беспошлинного ввоза по стоимости, весу или количеству" },
  { key: "cultural", icon: "🖼", label: "Культурные ценности",      desc: "Картины, антиквариат, иконы, монеты" },
  { key: "weapons",  icon: "🔫", label: "Оружие",                   desc: "Гражданское и служебное оружие, части, патроны" },
  { key: "meds",     icon: "💊", label: "Лекарства",                desc: "Наркотические средства, психотропные вещества в виде лекарств" },
  { key: "animals",  icon: "🐾", label: "Животные и растения",      desc: "Домашние питомцы, редкие виды, живые растения" },
];

export default function StepSelectTypes({ selected, onConfirm, onPrev }) {
  const [chosen, setChosen] = useState(selected || []);

  const toggle = (key) => {
    setChosen((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  // Сохраняем порядок как в TYPES
  const ordered = TYPES.map((t) => t.key).filter((k) => chosen.includes(k));

  return (
    <>
      <Card
        title="Что вы везёте?"
        subtitle="Выберите всё, что перемещаете через границу. Можно несколько — всё войдёт в одну декларацию."
      >
        <div className="type-grid">
          {TYPES.map((t) => {
            const active = chosen.includes(t.key);
            return (
              <button
                key={t.key}
                className={`type-card ${active ? "active" : ""}`}
                onClick={() => toggle(t.key)}
              >
                <div className="type-icon">{t.icon}</div>
                <div className="type-name">{t.label}</div>
                <div className="type-desc">{t.desc}</div>
                <div className={`type-check ${active ? "visible" : ""}`}>✓</div>
              </button>
            );
          })}
        </div>

        {chosen.length === 0 && (
          <div className="empty-hint">Выберите хотя бы один вид декларируемого имущества</div>
        )}
      </Card>

      <NavButtons
        onPrev={onPrev}
        onNext={ordered.length > 0 ? () => onConfirm(ordered) : null}
        nextLabel="Заполнить декларацию →"
        disabled={ordered.length === 0}
      />
    </>
  );
}
