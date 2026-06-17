import { useState } from "react";
import StepSelectTypes from "./components/steps/StepSelectTypes";
import StepDeclarant from "./components/steps/StepDeclarant";
import StepBaggage from "./components/steps/StepBaggage";
import StepVehicle from "./components/steps/StepVehicle";
import StepCash from "./components/steps/StepCash";
import StepLgota from "./components/steps/StepLgota";
import StepGoods from "./components/steps/StepGoods";
import StepCultural from "./components/steps/StepCultural";
import StepWeapons from "./components/steps/StepWeapons";
import StepMeds from "./components/steps/StepMeds";
import StepAnimals from "./components/steps/StepAnimals";
import StepOther from "./components/steps/StepOther";
import StepReview from "./components/steps/StepReview";
import ProgressBar from "./components/ProgressBar";

const TYPE_META = {
  vehicle:  { label: "Транспорт",       component: StepVehicle },
  cash:     { label: "Наличные",        component: StepCash },
  льгота:   { label: "Льгота",          component: StepLgota },
  goods:    { label: "Товары",          component: StepGoods },
  cultural: { label: "Культ. ценности", component: StepCultural },
  weapons:  { label: "Оружие",          component: StepWeapons },
  meds:     { label: "Лекарства",       component: StepMeds },
  animals:  { label: "Животные",        component: StepAnimals },
  minerals: { label: "Прочее",          component: StepOther },
  bio:      { label: null,              component: null },
  other:    { label: null,              component: null },
};

const TYPE_ORDER = ["vehicle","cash","льгота","goods","cultural","weapons","meds","animals","minerals"];

export default function App() {
  const [data, setData] = useState({});
  const [stepIndex, setStepIndex] = useState(0);
  const update = (patch) => setData((d) => ({ ...d, ...patch }));

  const selected = data.selected_types || [];
  const hasOther = selected.some(k => ["minerals","bio","other"].includes(k));

  // ТС идёт сразу после декларанта, потом baggage только если есть товары
  const hasVehicle = selected.includes("vehicle");
  const hasGoods = selected.some(k => k !== "vehicle");
  const vehicleSteps = hasVehicle ? ["vehicle"] : [];
  const goodsSteps = TYPE_ORDER.filter(k => {
    if (k === "vehicle") return false;
    if (k === "minerals") return hasOther;
    return selected.includes(k);
  });
  const steps = [
    "select",
    "declarant",
    ...vehicleSteps,
    ...(hasGoods ? ["baggage"] : []),
    ...goodsSteps,
    "review",
  ];
  const currentStep = steps[stepIndex];

  const next = () => setStepIndex(i => Math.min(i + 1, steps.length - 1));
  const prev = () => setStepIndex(i => Math.max(i - 1, 0));

  const progressSteps = [
    { key: "select",    label: "Что везёте" },
    { key: "declarant", label: "Декларант" },
    ...(hasVehicle ? [{ key: "vehicle", label: "Транспорт" }] : []),
    ...(hasGoods ? [{ key: "baggage", label: "Перемещение" }] : []),
    ...goodsSteps.map(k => ({ key: k, label: TYPE_META[k]?.label || k })),
    { key: "review",    label: "Проверка" },
  ];

  const renderStep = () => {
    if (currentStep === "select")    return <StepSelectTypes data={data} update={update} onNext={next} />;
    if (currentStep === "declarant") return <StepDeclarant   data={data} update={update} onNext={next} onPrev={prev} />;
    if (currentStep === "baggage")   return <StepBaggage     data={data} update={update} onNext={next} onPrev={prev} />;
    if (currentStep === "review")    return <StepReview      data={data} selectedTypes={selected} onPrev={prev} onReset={() => { setData({}); setStepIndex(0); }} />;
    if (currentStep === "minerals")  return <StepOther data={data} update={update} onNext={next} onPrev={prev} />;
    if (currentStep === "vehicle")   return <StepVehicle data={data} update={update} onNext={next} onPrev={prev} />;
    const Comp = TYPE_META[currentStep]?.component;
    if (!Comp) { next(); return null; }
    return <Comp data={data} update={update} onNext={next} onPrev={prev} />;
  };

  return (
    <div className="app">
      <header className="hdr">
        <div className="logo">
          <svg viewBox="0 0 24 24"><path d="M9 12h6M9 16h6M9 8h6M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" strokeWidth="1.8" stroke="currentColor" fill="none" strokeLinecap="round"/></svg>
        </div>
        <div>
          <div className="hdr-title">ПТД Онлайн</div>
          <div className="hdr-sub">Пассажирская таможенная декларация · ЕАЭС</div>
        </div>
      </header>
      <ProgressBar steps={progressSteps} currentKey={currentStep} />
      <main>{renderStep()}</main>
    </div>
  );
}
