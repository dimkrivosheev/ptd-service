import { Card, Field, Input, Select, Row, CountryInput, AddressInput, NavButtons } from "../FormFields";

export default function StepDeclarant({ data, update, onNext }) {
  const d = data;
  return (
    <>
      <Card title="Сведения о декларанте" subtitle="Раздел 1">
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
        <Field label="Адрес постоянного места жительства (регистрации)" hint="Вводите улицу или город — выберите из подсказок">
          <AddressInput value={d.address || ""} onChange={(v) => update({ address: v })} />
        </Field>
        <Field label="Адрес временного проживания в государстве — члене ЕАЭС" hint="Заполняется иностранными лицами">
          <Input placeholder="г. Москва, ул. Тверская, д. 1, кв. 1" value={d.address_temp || ""} onChange={(e) => update({ address_temp: e.target.value })} />
        </Field>
        <Row cols={2}>
          <Field label="Страна отправления">
            <CountryInput value={d.country_from || ""} onChange={(v) => update({ country_from: v })} />
          </Field>
          <Field label="Страна назначения">
            <CountryInput value={d.country_to || ""} onChange={(v) => update({ country_to: v })} />
          </Field>
        </Row>
        <Field label="Количество детей до 16 лет, следующих со мной" hint="Укажите 0 если нет">
          <Input type="number" min="0" max="20" placeholder="0" value={d.children_count ?? ""} onChange={(e) => update({ children_count: e.target.value })} />
        </Field>
        <Field label="Дата подачи декларации">
          <Input type="date" value={d.sign_date || ""} onChange={(e) => update({ sign_date: e.target.value })} />
        </Field>
      </Card>
      <NavButtons onNext={onNext} />
    </>
  );
}
