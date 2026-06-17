import { useState } from "react";

const SOURCE_LABELS = { salary:"Зарплата / доходы от бизнеса", dividends:"Дивиденды", property:"Доходы от реализации имущества", transfers:"Безвозмездные трансферты", pension:"Пенсия / стипендия", rent:"Доходы от аренды", loan:"Заёмные средства", inheritance:"Наследство", other:"Прочее" };
const PURPOSE_LABELS = { expenses:"Текущие расходы", investment:"Инвестиции", transfer_p:"Трансферты физлицам", transfer_l:"Благотворительность", other:"Прочее" };
const BAGGAGE_LABELS = { accompanied:"Сопровождаемый багаж", unaccompanied:"Несопровождаемый багаж", delivered:"Доставляемые товары" };
const DIRECTION_LABELS = { import:"Ввоз (свободное обращение)", export:"Вывоз", temp_export:"Временный вывоз", transit:"Транзит" };
const TYPE_LABELS = { vehicle:"Транспортное средство", cash:"Наличные", льгота:"Льгота (освобождение от пошлин)", goods:"Товары", cultural:"Культурные ценности", weapons:"Оружие", meds:"Лекарства", animals:"Животные/растения", minerals:"3.8 Минералогия", bio:"3.9 Биоматериалы", other:"3.10 Прочие ограничения" };
const VTYPE_LABELS = { auto:"Авто / мото", trailer:"Прицеп", water:"Водное судно", air:"Воздушное судно" };

function Row({ label, value }) {
  if (!value && value !== 0) return null;
  return (
    <div className="review-row">
      <span className="review-key">{label}</span>
      <span className="review-val">{value}</span>
    </div>
  );
}
function Section({ title, children }) {
  return <div className="review-section"><div className="review-section-title">{title}</div>{children}</div>;
}

export default function StepReview({ data, selectedTypes, onPrev, onReset }) {
  const [loading, setLoading] = useState(false);
  const d = data;
  const fio = [d.fam, d.nam, d.otr].filter(Boolean).join(" ");
  const dd = d.doc_date ? d.doc_date.split("-").reverse().join(".") : "";
  const docInfo = [d.doc_type, d.doc_country, d.doc_num, dd].filter(Boolean).join(", ");
  const sd = d.sign_date ? d.sign_date.split("-").reverse().join(".") : "";
  const vt = d.vehicle_type || "auto";

  const buildPayload = () => ({
    fio, doc_info: docInfo,
    address: d.address || "",
    address_temp: d.address_temp || "",
    country_from: d.country_from || "",
    country_to: d.country_to || "",
    children_count: d.children_count || "0",
    sign_date: sd,
    baggage_type: d.baggage_type || "",
    direction: d.direction || "",
    selected_types: selectedTypes,
    // ТС
    vehicle_type: vt,
    vehicle_direction: d.vehicle_direction || "",
    brand_model: [d.brand, d.model].filter(Boolean).join(", "),
    reg_number: [d.reg_num, d.reg_country].filter(Boolean).join(", "),
    vin: d.vin || "",
    cc: d.cc || "",
    body_num: d.body_num || "",
    chassis_num: d.chassis_num || "",
    manufacture_date: d.manufacture_date || "",
    price_str: d.vehicle_price ? `${d.vehicle_price} ${d.vehicle_currency || "USD"}` : "",
    vessel_type: d.vessel_type || "",
    vessel_mass: d.vessel_mass || "",
    vessel_length: d.vessel_length || "",
    aircraft_type: d.aircraft_type || "",
    aircraft_mass: d.aircraft_mass || "",
    replaced_part_name: d.replaced_part_name || "",
    replaced_part_num: d.replaced_part_num || "",
    // Наличные
    cash: d.cash || null,
    birth_date: d.birth_date || "",
    // Раздел 4
    lgota_items: d.lgota_items || [],
    goods_items: d.goods_items || [],
    cultural_items: d.cultural_items || [],
    weapons_items: d.weapons_items || [],
    meds_items: d.meds_items || [],
    animals_items: d.animals_items || [],
    minerals_items: d.minerals_items || [],
    bio_items: d.bio_items || [],
    other_items: d.other_items || [],
  });

  const getPdf = async () => {
    const resp = await fetch("/generate_pdf", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(buildPayload()) });
    if (!resp.ok) throw new Error("Ошибка сервера");
    return resp.blob();
  };

  const handleDownload = async () => {
    setLoading(true);
    try {
      const blob = await getPdf();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = "PTD.pdf"; a.click();
      URL.revokeObjectURL(url);
    } catch (e) { alert(e.message); } finally { setLoading(false); }
  };

  const handlePrint = async () => {
    setLoading(true);
    try {
      const blob = await getPdf();
      const url = URL.createObjectURL(blob);
      const win = window.open(url, "_blank");
      if (win) win.onload = () => win.print();
    } catch (e) { alert(e.message); } finally { setLoading(false); }
  };

  return (
    <>
      <div className="review-card">
        <div className="review-header">
          <div className="review-title">Проверка данных</div>
          <div className="review-sub">Убедитесь, что всё верно, затем распечатайте</div>
        </div>
        <div className="review-body">
          <Section title="Разделы декларации">
            {selectedTypes.map(t => <span key={t} className="review-tag">{TYPE_LABELS[t] || t}</span>)}
          </Section>

          <Section title="Раздел 1 · Декларант">
            <Row label="ФИО" value={fio} />
            <Row label="Документ" value={docInfo} />
            <Row label="Адрес регистрации" value={d.address} />
            <Row label="Адрес временного проживания" value={d.address_temp} />
            <Row label="Страна отправления" value={d.country_from} />
            <Row label="Страна назначения" value={d.country_to} />
            <Row label="Детей до 16 лет" value={d.children_count} />
            <Row label="Дата декларации" value={sd} />
          </Section>

          <Section title="Раздел 2 · Способ перемещения">
            <Row label="Багаж" value={BAGGAGE_LABELS[d.baggage_type]} />
          </Section>

          <Section title="Раздел 3 · Направление">
            <Row label="Цель" value={DIRECTION_LABELS[d.direction]} />
          </Section>

          {selectedTypes.includes("vehicle") && (
            <Section title="Раздел 5 · Транспортное средство">
              <Row label="Вид" value={VTYPE_LABELS[vt]} />
              <Row label="Марка и модель" value={[d.brand, d.model].filter(Boolean).join(" ")} />
              <Row label="Рег. номер / страна" value={[d.reg_num, d.reg_country].filter(Boolean).join(", ")} />
              <Row label="VIN" value={d.vin} />
              <Row label="Кузов / шасси" value={[d.body_num, d.chassis_num].filter(Boolean).join(" / ")} />
              <Row label="Дата изготовления" value={d.manufacture_date} />
              <Row label="Объём / мощность" value={d.cc ? `${d.cc} ${d.eng === "electric" ? "кВт" : "см³"}` : null} />
              <Row label="Стоимость" value={d.vehicle_price ? `${d.vehicle_price} ${d.vehicle_currency || "USD"}` : null} />
              <Row label="Замененная часть" value={d.replaced_part_name ? `${d.replaced_part_name} № ${d.replaced_part_num}` : null} />
            </Section>
          )}

          {selectedTypes.includes("cash") && d.cash && (
            <Section title="Приложение · Наличные">
              {(d.cash.banknotes || []).map((b, i) => <Row key={i} label={`Банкноты ${i+1}`} value={b.amount ? `${b.amount} ${b.currency}` : null} />)}
              <Row label="Источник" value={(d.cash.sources || []).map(k => SOURCE_LABELS[k] || k).join(", ")} />
              <Row label="Цель" value={(d.cash.purposes || []).map(k => PURPOSE_LABELS[k] || k).join(", ")} />
            </Section>
          )}

          {["lgota","goods","cultural","weapons","meds","animals"].filter(k => selectedTypes.includes(k)).map(key => {
            const items = d[`${key}_items`] || [];
            if (!items.length) return null;
            return (
              <Section key={key} title={`Раздел 4 · ${TYPE_LABELS[key]}`}>
                {items.map((item, i) => <Row key={i} label={`Позиция ${i+1}`} value={item.name || item.type || item.species} />)}
              </Section>
            );
          })}
        </div>
      </div>

      <button className="dl-btn" onClick={handleDownload} disabled={loading}>
        {loading ? "⏳ Формируем..." : "⬇ Скачать PDF"}
      </button>
      <button className="dl-btn" onClick={handlePrint} disabled={loading} style={{ background: "#555", marginTop: 8 }}>
        🖨 Распечатать
      </button>
      <div className="nav-btns" style={{ marginTop: 12 }}>
        <button className="btn btn-ghost" onClick={onPrev}>← Назад</button>
        <button className="btn btn-ghost" onClick={onReset}>↺ Заново</button>
      </div>
    </>
  );
}
