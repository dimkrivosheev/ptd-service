import { Card, Field, Input, Select, Row, NavButtons } from "../FormFields";

const DIRECTION_OPTS = [
  { key: "import",      label: "Ввоз (свободное обращение)" },
  { key: "temp_import", label: "Временный ввоз" },
  { key: "export",      label: "Вывоз" },
  { key: "temp_export", label: "Временный вывоз" },
  { key: "transit",     label: "Транзит" },
];

function RadioRow({ label, checked, onChange }) {
  return (
    <div className={`check-option ${checked ? "active" : ""}`} onClick={onChange}>
      <span className="check-box" style={{ borderRadius: "50%" }}>{checked ? "✓" : ""}</span>
      <span>{label}</span>
    </div>
  );
}

function fmtDate(val, mode) {
  const digits = val.replace(/\D/g, "");
  if (mode === "my") return (digits.length <= 2 ? digits : digits.slice(0,2)+"."+digits.slice(2,6)).slice(0,7);
  return (digits.length <= 2 ? digits : digits.length <= 4 ? digits.slice(0,2)+"."+digits.slice(2) : digits.slice(0,2)+"."+digits.slice(2,4)+"."+digits.slice(4,8)).slice(0,10);
}

export default function StepVehicle({ data, update, onNext, onPrev }) {
  const d = data;
  const vtype = d.vehicle_type || "auto";
  const vdir = d.vehicle_direction || "";
  const eng = d.eng || "petrol";
  const dateMode = d.date_mode || "my";

  return (
    <>
      <Card title="Направление для транспортного средства" subtitle="Раздел 5 — цель ввоза/вывоза ТС">
        <div className="checkbox-grid">
          {DIRECTION_OPTS.map(o => (
            <RadioRow key={o.key} label={o.label} checked={vdir === o.key}
              onChange={() => update({ vehicle_direction: vdir === o.key ? "" : o.key })} />
          ))}
        </div>
      </Card>

      <Card title="Вид транспортного средства" subtitle="Раздел 5">
        <div className="checkbox-grid" style={{ marginBottom: 16 }}>
          {[
            { key: "auto",    label: "Авто- и мототранспортное средство" },
            { key: "trailer", label: "Прицеп к авто/мото" },
            { key: "water",   label: "Водное судно" },
            { key: "air",     label: "Воздушное судно" },
          ].map(o => (
            <RadioRow key={o.key} label={o.label} checked={vtype === o.key}
              onChange={() => update({ vehicle_type: o.key })} />
          ))}
        </div>

        {(vtype === "auto" || vtype === "trailer") && <>
          <Row cols={2}>
            <Field label="Марка"><Input placeholder="Mercedes-Benz" value={d.brand || ""} onChange={(e) => update({ brand: e.target.value })} /></Field>
            <Field label="Модель"><Input placeholder="E-Class" value={d.model || ""} onChange={(e) => update({ model: e.target.value })} /></Field>
          </Row>
          <Row cols={2}>
            <Field label="Регистрационный номер"><Input placeholder="А001АА" value={d.reg_num || ""} onChange={(e) => update({ reg_num: e.target.value })} /></Field>
            <Field label="Страна регистрации"><Input placeholder="Грузия" value={d.reg_country || ""} onChange={(e) => update({ reg_country: e.target.value })} /></Field>
          </Row>
          <Field label="Идентификационный номер (VIN)" hint="17 символов">
            <Input placeholder="WDB2110611A123456" maxLength={17} value={d.vin || ""} onChange={(e) => update({ vin: e.target.value.toUpperCase() })} />
          </Field>
          {vtype === "auto" && <>
            <Row cols={2}>
              <Field label="Номер кузова"><Input value={d.body_num || ""} onChange={(e) => update({ body_num: e.target.value })} /></Field>
              <Field label="Номер шасси"><Input placeholder="ОТСУТСТВУЕТ" value={d.chassis_num || ""} onChange={(e) => update({ chassis_num: e.target.value })} /></Field>
            </Row>
            <Field label="Тип двигателя">
              <div className="checkbox-grid" style={{ marginBottom: 8 }}>
                {[{ key:"petrol",label:"Бензин / дизель"},{key:"electric",label:"Электро"},{key:"hybrid",label:"Гибрид"}].map(o => (
                  <RadioRow key={o.key} label={o.label} checked={eng === o.key} onChange={() => update({ eng: o.key })} />
                ))}
              </div>
            </Field>
            <Field label={eng === "electric" ? "Мощность, кВт" : "Объём двигателя, см³"}>
              <Input type="number" placeholder={eng === "electric" ? "150" : "2000"} value={d.cc || ""} onChange={(e) => update({ cc: e.target.value })} />
            </Field>
          </>}
          <Field label="Дата изготовления">
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              {[{value:"my",label:"ММ.ГГГГ"},{value:"full",label:"ДД.ММ.ГГГГ"}].map(o => (
                <RadioRow key={o.value} label={o.label} checked={dateMode === o.value} onChange={() => update({ date_mode: o.value, manufacture_date: "" })} />
              ))}
            </div>
            <Input placeholder={dateMode === "my" ? "ММ.ГГГГ" : "ДД.ММ.ГГГГ"} value={d.manufacture_date || ""}
              onChange={(e) => update({ manufacture_date: fmtDate(e.target.value, dateMode) })} />
          </Field>
        </>}

        {vtype === "water" && <>
          <Field label="Вид судна"><Input placeholder="Яхта, катер, моторная лодка..." value={d.vessel_type || ""} onChange={(e) => update({ vessel_type: e.target.value })} /></Field>
          <Row cols={2}>
            <Field label="Регистрационный номер"><Input value={d.reg_num || ""} onChange={(e) => update({ reg_num: e.target.value })} /></Field>
            <Field label="Страна регистрации"><Input value={d.reg_country || ""} onChange={(e) => update({ reg_country: e.target.value })} /></Field>
          </Row>
          <Row cols={2}>
            <Field label="Масса (кг)"><Input type="number" value={d.vessel_mass || ""} onChange={(e) => update({ vessel_mass: e.target.value })} /></Field>
            <Field label="Длина корпуса (м)"><Input type="number" step="0.1" value={d.vessel_length || ""} onChange={(e) => update({ vessel_length: e.target.value })} /></Field>
          </Row>
        </>}

        {vtype === "air" && <>
          <Field label="Вид воздушного судна"><Input placeholder="Вертолёт, самолёт..." value={d.aircraft_type || ""} onChange={(e) => update({ aircraft_type: e.target.value })} /></Field>
          <Row cols={2}>
            <Field label="Регистрационный номер"><Input value={d.reg_num || ""} onChange={(e) => update({ reg_num: e.target.value })} /></Field>
            <Field label="Страна регистрации"><Input value={d.reg_country || ""} onChange={(e) => update({ reg_country: e.target.value })} /></Field>
          </Row>
          <Field label="Масса пустого снаряжённого аппарата (кг)">
            <Input type="number" value={d.aircraft_mass || ""} onChange={(e) => update({ aircraft_mass: e.target.value })} />
          </Field>
        </>}

        <Row cols={2}>
          <Field label="Стоимость"><Input type="number" placeholder="25000" value={d.vehicle_price || ""} onChange={(e) => update({ vehicle_price: e.target.value })} /></Field>
          <Field label="Валюта">
            <Select value={d.vehicle_currency || "USD"} onChange={(e) => update({ vehicle_currency: e.target.value })}>
              {["USD","EUR","RUB","GBP","JPY","CNY","AED","GEL"].map(c => <option key={c}>{c}</option>)}
            </Select>
          </Field>
        </Row>
      </Card>

      <Card title="Замененная часть ТС" subtitle="Если в государстве не-члене ЕАЭС была заменена часть, подлежащая учёту">
        <Row cols={2}>
          <Field label="Наименование части"><Input placeholder="Двигатель, кузов..." value={d.replaced_part_name || ""} onChange={(e) => update({ replaced_part_name: e.target.value })} /></Field>
          <Field label="Номер части"><Input value={d.replaced_part_num || ""} onChange={(e) => update({ replaced_part_num: e.target.value })} /></Field>
        </Row>
      </Card>

      <NavButtons onPrev={onPrev} onNext={onNext} />
    </>
  );
}
