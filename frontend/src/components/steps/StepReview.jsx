import { useState } from "react";

const SOURCE_LABELS = { salary:"Зарплата / доходы от бизнеса", dividends:"Дивиденды", property:"Доходы от реализации имущества", transfers:"Безвозмездные трансферты", pension:"Пенсия / стипендия", rent:"Доходы от аренды", loan:"Заёмные средства", inheritance:"Наследство", other:"Прочее" };
const PURPOSE_LABELS = { expenses:"Текущие расходы", investment:"Инвестиции", transfer_p:"Трансферты физлицам", transfer_l:"Благотворительность", other:"Прочее" };
const TYPE_LABELS = { vehicle:"Транспортное средство", cash:"Наличные", goods:"Товары", cultural:"Культурные ценности", weapons:"Оружие", meds:"Лекарства", animals:"Животные/растения" };

function Row({ label, value }) {
  if (!value) return null;
  return (
    <div className="review-row">
      <span className="review-key">{label}</span>
      <span className="review-val">{value}</span>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="review-section">
      <div className="review-section-title">{title}</div>
      {children}
    </div>
  );
}

export default function StepReview({ data, selectedTypes, onPrev, onReset }) {
  const [loading, setLoading] = useState(false);
  const d = data;

  const fio = [d.fam, d.nam, d.otr].filter(Boolean).join(" ");
  const dd = d.doc_date ? d.doc_date.split("-").reverse().join(".") : "";
  const docInfo = [d.doc_type, d.doc_country, d.doc_num, dd].filter(Boolean).join(", ");

  const buildPayload = () => {
    const sd = d.sign_date ? d.sign_date.split("-").reverse().join("/") : "";
    const vehiclePriceStr = d.vehicle_price ? `${parseFloat(d.vehicle_price).toLocaleString("ru")} ${d.vehicle_currency || "USD"}` : "";
    return {
      fio, doc_info: docInfo,
      address: d.address || "",
      country_from: d.country_from || "",
      country_to: d.country_to || "Россия",
      direction: d.direction || "import",
      baggage_type: d.baggage_type || "accompanied",
      льгота: false,
      selected_types: selectedTypes,
      // ТС
      brand_model: [d.brand, d.model].filter(Boolean).join(", "),
      reg_number: [d.reg_num, d.reg_country].filter(Boolean).join(", "),
      vin: d.vin || "",
      cc: d.cc || "",
      body_num: d.body_num || "",
      chassis_num: d.chassis_num || "ОТСУТСТВУЕТ",
      manufacture_date: d.manufacture_date || "",
      price_str: vehiclePriceStr,
      sign_date: sd,
      // Наличные
      cash: d.cash || null,
      birth_date: d.birth_date || "",
      // Товары / прочее (секция 4)
      goods_items: d.goods_items || [],
      cultural_items: d.cultural_items || [],
      weapons_items: d.weapons_items || [],
      meds_items: d.meds_items || [],
      animals_items: d.animals_items || [],
    };
  };

  const handlePrint = async () => {
    setLoading(true);
    try {
      const resp = await fetch("/generate_pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload()),
      });
      if (!resp.ok) throw new Error("Ошибка сервера");
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const win = window.open(url, "_blank");
      if (win) win.onload = () => win.print();
    } catch (e) {
      alert("Ошибка: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    setLoading(true);
    try {
      const resp = await fetch("/generate_pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload()),
      });
      if (!resp.ok) throw new Error("Ошибка сервера");
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = "PTD.pdf"; a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert("Ошибка: " + e.message);
    } finally {
      setLoading(false);
    }
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
            {selectedTypes.map(t => (
              <div key={t} className="review-tag">{TYPE_LABELS[t]}</div>
            ))}
          </Section>

          <Section title="Раздел 1 · Декларант">
            <Row label="ФИО" value={fio} />
            <Row label="Документ" value={docInfo} />
            <Row label="Адрес" value={d.address} />
            <Row label="Страна отправления" value={d.country_from} />
            <Row label="Страна назначения" value={d.country_to} />
          </Section>

          {selectedTypes.includes("vehicle") && (
            <Section title="Раздел 5 · Транспортное средство">
              <Row label="Марка и модель" value={[d.brand, d.model].filter(Boolean).join(", ")} />
              <Row label="Рег. номер / страна" value={[d.reg_num, d.reg_country].filter(Boolean).join(", ")} />
              <Row label="VIN" value={d.vin} />
              <Row label="Кузов / шасси" value={[d.body_num, d.chassis_num].filter(Boolean).join(" / ")} />
              <Row label="Дата изготовления" value={d.manufacture_date} />
              <Row label="Объём / мощность" value={d.cc ? `${d.cc} ${d.eng === "electric" ? "кВт" : "см³"}` : null} />
              <Row label="Стоимость" value={d.vehicle_price ? `${d.vehicle_price} ${d.vehicle_currency || "USD"}` : null} />
              <Row label="Дата декларации" value={d.sign_date} />
            </Section>
          )}

          {selectedTypes.includes("cash") && d.cash && (
            <Section title="Приложение · Наличные и ден. инструменты">
              {(d.cash.banknotes || []).map((b, i) => (
                <Row key={i} label={`Банкноты ${i+1}`} value={b.amount ? `${b.amount} ${b.currency}` : null} />
              ))}
              <Row label="Источник" value={(d.cash.sources || []).map(k => SOURCE_LABELS[k] || k).join(", ")} />
              <Row label="Цель" value={(d.cash.purposes || []).map(k => PURPOSE_LABELS[k] || k).join(", ")} />
            </Section>
          )}

          {selectedTypes.includes("goods") && (d.goods_items || []).length > 0 && (
            <Section title="Раздел 4 · Товары">
              {d.goods_items.map((item, i) => (
                <Row key={i} label={`Товар ${i+1}`} value={[item.name, item.value ? `${item.value} ${item.currency}` : ""].filter(Boolean).join(" — ")} />
              ))}
            </Section>
          )}

          {selectedTypes.includes("cultural") && (d.cultural_items || []).length > 0 && (
            <Section title="Раздел 4 · Культурные ценности">
              {d.cultural_items.map((item, i) => (
                <Row key={i} label={`Предмет ${i+1}`} value={item.name} />
              ))}
            </Section>
          )}

          {selectedTypes.includes("weapons") && (d.weapons_items || []).length > 0 && (
            <Section title="Раздел 4 · Оружие">
              {d.weapons_items.map((item, i) => (
                <Row key={i} label={`Ед. ${i+1}`} value={[item.type, item.model].filter(Boolean).join(", ")} />
              ))}
            </Section>
          )}

          {selectedTypes.includes("meds") && (d.meds_items || []).length > 0 && (
            <Section title="Раздел 4 · Лекарства">
              {d.meds_items.map((item, i) => (
                <Row key={i} label={`Препарат ${i+1}`} value={[item.name, item.dosage, item.quantity ? `${item.quantity} ${item.unit}` : ""].filter(Boolean).join(", ")} />
              ))}
            </Section>
          )}

          {selectedTypes.includes("animals") && (d.animals_items || []).length > 0 && (
            <Section title="Раздел 4 · Животные/растения">
              {d.animals_items.map((item, i) => (
                <Row key={i} label={`Позиция ${i+1}`} value={[item.type, item.species, item.count > 1 ? `${item.count} шт.` : ""].filter(Boolean).join(", ")} />
              ))}
            </Section>
          )}
        </div>
      </div>

      <button className="dl-btn" onClick={handleDownload} disabled={loading}>
        {loading ? "⏳ Формируем..." : "⬇ Скачать PDF"}
      </button>
      <button className="dl-btn secondary" onClick={handlePrint} disabled={loading} style={{ background: "#444", marginTop: 8 }}>
        🖨 Распечатать
      </button>

      <div className="nav-btns" style={{ marginTop: 12 }}>
        <button className="btn btn-ghost" onClick={onPrev}>← Назад</button>
        <button className="btn btn-ghost" onClick={onReset}>↺ Заново</button>
      </div>
    </>
  );
}
