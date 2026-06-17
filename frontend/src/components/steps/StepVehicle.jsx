import { useState } from "react";
import { Card, Field, Input, Select, Row, RadioGroup, NavButtons } from "../FormFields";

function fmtDate(val, mode) {
  const digits = val.replace(/\D/g, "");
  if (mode === "my") {
    let v = digits.length <= 2 ? digits : digits.slice(0, 2) + "." + digits.slice(2, 6);
    return v.slice(0, 7);
  } else {
    let v = digits.length <= 2 ? digits
      : digits.length <= 4 ? digits.slice(0, 2) + "." + digits.slice(2)
      : digits.slice(0, 2) + "." + digits.slice(2, 4) + "." + digits.slice(4, 8);
    return v.slice(0, 10);
  }
}

export default function StepVehicle({ data, update, onNext, onPrev }) {
  const d = data;
  const eng = d.eng || "petrol";
  const dateMode = d.date_mode || "my";

  return (
    <>
      <Card title="Транспортное средство" subtitle="Раздел 5 — авто- и мототранспортное средство">
        <Row cols={2}>
          <Field label="Марка"><Input placeholder="Mercedes-Benz" value={d.brand || ""} onChange={(e) => update({ brand: e.target.value })} /></Field>
          <Field label="Модель"><Input placeholder="E-Class" value={d.model || ""} onChange={(e) => update({ model: e.target.value })} /></Field>
        </Row>

        <Row cols={2}>
          <Field label="Регистрационный номер"><Input placeholder="" value={d.reg_num || ""} onChange={(e) => update({ reg_num: e.target.value })} /></Field>
          <Field label="Страна регистрации"><Input placeholder="Грузия" value={d.reg_country || ""} onChange={(e) => update({ reg_country: e.target.value })} /></Field>
        </Row>

        <Field label="Идентификационный номер (VIN)" hint="17 символов из ПТС">
          <Input placeholder="WDB2110611A123456" maxLength={17} value={d.vin || ""} onChange={(e) => update({ vin: e.target.value.toUpperCase() })} />
        </Field>

        <Row cols={2}>
          <Field label="Номер кузова"><Input value={d.body_num || ""} onChange={(e) => update({ body_num: e.target.value })} /></Field>
          <Field label="Номер шасси"><Input placeholder="ОТСУТСТВУЕТ" value={d.chassis_num || "ОТСУТСТВУЕТ"} onChange={(e) => update({ chassis_num: e.target.value })} /></Field>
        </Row>

        <Field label="Дата изготовления">
          <RadioGroup
            name="date_mode"
            value={dateMode}
            onChange={(v) => update({ date_mode: v, manufacture_date: "" })}
            options={[
              { value: "my", label: "Месяц и год" },
              { value: "full", label: "Полная дата" },
            ]}
          />
          <div style={{ marginTop: 8 }}>
            <Input
              placeholder={dateMode === "my" ? "ММ.ГГГГ" : "ДД.ММ.ГГГГ"}
              value={d.manufacture_date || ""}
              onChange={(e) => update({ manufacture_date: fmtDate(e.target.value, dateMode) })}
            />
          </div>
        </Field>

        <Field label="Тип двигателя">
          <RadioGroup
            name="eng"
            value={eng}
            onChange={(v) => update({ eng: v })}
            options={[
              { value: "petrol", label: "Бензин / дизель" },
              { value: "electric", label: "Электро" },
              { value: "hybrid", label: "Гибрид" },
            ]}
          />
        </Field>

        <Field label={eng === "electric" ? "Мощность двигателя, кВт" : "Рабочий объём двигателя, см³"}>
          <Input type="number" placeholder={eng === "electric" ? "150" : "2000"} value={d.cc || ""} onChange={(e) => update({ cc: e.target.value })} />
        </Field>

        <Row cols={2}>
          <Field label="Сумма по договору">
            <Input type="number" placeholder="25000" value={d.vehicle_price || ""} onChange={(e) => update({ vehicle_price: e.target.value })} />
          </Field>
          <Field label="Валюта">
            <Select value={d.vehicle_currency || "USD"} onChange={(e) => update({ vehicle_currency: e.target.value })}>
              <option value="USD">USD — Доллар</option>
              <option value="EUR">EUR — Евро</option>
              <option value="RUB">RUB — Рубль</option>
              <option value="GBP">GBP — Фунт</option>
              <option value="JPY">JPY — Иена</option>
              <option value="CNY">CNY — Юань</option>
              <option value="AED">AED — Дирхам</option>
            </Select>
          </Field>
        </Row>

        <Field label="Дата подачи декларации">
          <Input type="date" value={d.sign_date || ""} onChange={(e) => update({ sign_date: e.target.value })} />
        </Field>
      </Card>

      <NavButtons onPrev={onPrev} onNext={onNext} />
    </>
  );
}
