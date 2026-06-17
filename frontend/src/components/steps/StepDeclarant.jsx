import { Card, Field, Input, Select, Row, CountryInput, AddressInput, NavButtons } from "../FormFields";

export default function StepDeclarant({ data, update, onNext }) {
  const d = data;

  return (
    <>
      <Card title="Сведения о декларанте" subtitle="Раздел 1 пассажирской таможенной декларации">
        <Row cols={3}>
          <Field label="Фамилия"><Input placeholder="Иванов" value={d.fam || ""} onChange={(e) => update({ fam: e.target.value })} /></Field>
          <Field label="Имя"><Input placeholder="Иван" value={d.nam || ""} onChange={(e) => update({ nam: e.target.value })} /></Field>
          <Field label="Отчество"><Input placeholder="Иванович" value={d.otr || ""} onChange={(e) => update({ otr: e.target.value })} /></Field>
        </Row>

        <Row cols={3}>
          <Field label="Тип документа">
            <Select value={d.doc_type || "Паспорт"} onChange={(e) => update({ doc_type: e.target.value })}>
              <option>Паспорт</option>
              <option>Загранпаспорт</option>
              <option>Вид на жительство</option>
              <option>Иной документ</option>
            </Select>
          </Field>
          <Field label="Серия и номер"><Input placeholder="1234 567890" value={d.doc_num || ""} onChange={(e) => update({ doc_num: e.target.value })} /></Field>
          <Field label="Дата выдачи"><Input type="date" value={d.doc_date || ""} onChange={(e) => update({ doc_date: e.target.value })} /></Field>
        </Row>

        <Field label="Страна выдачи документа">
          <Input placeholder="Россия" value={d.doc_country || ""} onChange={(e) => update({ doc_country: e.target.value })} />
        </Field>

        <Field label="Адрес места регистрации" hint="Введите улицу или город — выберите из подсказок">
          <AddressInput value={d.address || ""} onChange={(v) => update({ address: v })} />
        </Field>

        <Row cols={2}>
          <Field label="Страна отправления">
            <CountryInput value={d.country_from || ""} onChange={(v) => update({ country_from: v })} />
          </Field>
          <Field label="Страна назначения">
            <CountryInput value={d.country_to || "Россия"} onChange={(v) => update({ country_to: v })} />
          </Field>
        </Row>
      </Card>

      <NavButtons onNext={onNext} />
    </>
  );
}
