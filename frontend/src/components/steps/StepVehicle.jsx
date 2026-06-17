import { useState } from "react";
import { Card, Field, Input, Select, Row, RadioGroup, NavButtons } from "../FormFields";

function fmtDate(val, mode) {
  const digits = val.replace(/\D/g, "");
  if (mode === "my") {
    return (digits.length <= 2 ? digits : digits.slice(0, 2) + "." + digits.slice(2, 6)).slice(0, 7);
  }
  return (digits.length <= 2 ? digits : digits.length <= 4 ? digits.slice(0,2)+"."+digits.slice(2) : digits.slice(0,2)+"."+digits.slice(2,4)+"."+digits.slice(4,8)).slice(0, 10);
}

export default function StepVehicle({ data, update, onNext, onPrev }) {
  const d = data;
  const vtype = d.vehicle_type || "auto";
  const eng = d.eng || "petrol";
  const dateMode = d.date_mode || "my";

  return (
    <>
      <Card title="Транспортное средство" subtitle="Раздел 5">
        <Field label="Вид транспортного средства">
          <RadioGroup name="vtype" value={vtype} onChange={(v) => update({ vehicle_type: v })}
            options={[
              { value: "auto", label: "Авто / мото" },
              { value: "trailer", label: "Прицеп" },
              { value: "water", label: "Водное судно" },
              { value: "air", label: "Воздушное судно" },
            ]} />
        </Field>

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
              <RadioGroup name="eng" value={eng} onChange={(v) => update({ eng: v })}
                options={[
                  { value: "petrol", label: "Бензин / дизель" },
                  { value: "electric", label: "Электро" },
                  { value: "hybrid", label: "Гибрид" },
                ]} />
            </Field>
            <Field label={eng === "electric" ? "Мощность, кВт" : "Объём двигателя, см³"}>
              <Input type="number" placeholder={eng === "electric" ? "150" : "2000"} value={d.cc || ""} onChange={(e) => update({ cc: e.target.value })} />
            </Field>
          </>}
          <Field label="Дата изготовления">
            <RadioGroup name="date_mode" value={dateMode} onChange={(v) => update({ date_mode: v, manufacture_date: "" })}
              options={[{ value: "my", label: "ММ.ГГГГ" }, { value: "full", label: "ДД.ММ.ГГГГ" }]} />
            <div style={{ marginTop: 8 }}>
              <Input placeholder={dateMode === "my" ? "ММ.ГГГГ" : "ДД.ММ.ГГГГ"} value={d.manufacture_date || ""} onChange={(e) => update({ manufacture_date: fmtDate(e.target.value, dateMode) })} />
            </div>
          </Field>
        </>}

        {(vtype === "water") && <>
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

        {(vtype === "air") && <>
          <Field label="Вид воздушного судна"><Input placeholder="Вертолёт, самолёт, дельтаплан..." value={d.aircraft_type || ""} onChange={(e) => update({ aircraft_type: e.target.value })} /></Field>
          <Row cols={2}>
            <Field label="Регистрационный номер"><Input value={d.reg_num || ""} onChange={(e) => update({ reg_num: e.target.value })} /></Field>
            <Field label="Страна регистрации"><Input value={d.reg_country || ""} onChange={(e) => update({ reg_country: e.target.value })} /></Field>
          </Row>
          <Field label="Масса пустого снаряжённого аппарата (кг)">
            <Input type="number" value={d.aircraft_mass || ""} onChange={(e) => update({ aircraft_mass: e.target.value })} />
          </Field>
        </>}

        <Row cols={2}>
          <Field label="Стоимость">
            <Input type="number" placeholder="25000" value={d.vehicle_price || ""} onChange={(e) => update({ vehicle_price: e.target.value })} />
          </Field>
          <Field label="Валюта">
            <Select value={d.vehicle_currency || "USD"} onChange={(e) => update({ vehicle_currency: e.target.value })}>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="RUB">RUB</option>
              <option value="GBP">GBP</option>
              <option value="JPY">JPY</option>
              <option value="CNY">CNY</option>
              <option value="AED">AED</option>
              <option value="GEL">GEL</option>
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
