import { useState } from "react";
import StepDeclarant from "./components/steps/StepDeclarant";
import StepSelectTypes from "./components/steps/StepSelectTypes";
import StepVehicle from "./components/steps/StepVehicle";
import StepCash from "./components/steps/StepCash";
import StepGoods from "./components/steps/StepGoods";
import StepCultural from "./components/steps/StepCultural";
import StepWeapons from "./components/steps/StepWeapons";
import StepMeds from "./components/steps/StepMeds";
import StepAnimals from "./components/steps/StepAnimals";
import StepReview from "./components/steps/StepReview";
import ProgressBar from "./components/ProgressBar";

// Порядок динамических шагов по типу ПТД
const TYPE_STEPS = {
  vehicle:  { label: "Транспорт",         icon: "🚗", component: StepVehicle },
  cash:     { label: "Деньги",            icon: "💵", component: StepCash },
  goods:    { label: "Товары",            icon: "📦", component: StepGoods },
  cultural: { label: "Культурные ценности", icon: "🖼", component: StepCultural },
  weapons:  { label: "Оружие",            icon: "🔫", component: StepWeapons },
  meds:     { label: "Лекарства",         icon: "💊", component: StepMeds },
  animals:  { label: "Животные",          icon: "🐾", component: StepAnimals },
};

export default function App() {
  const [data, setData] = useState({});
  const [selectedTypes, setSelectedTypes] = useState([]);
  // steps: ['declarant', 'select', ...typeKeys, 'review']
  const [stepIndex, setStepIndex] = useState(0);

  const steps = ["declarant", "select", ...selectedTypes, "review"];

  const update = (patch) => setData((d) => ({ ...d, ...patch }));

  const next = () => setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  const prev = () => setStepIndex((i) => Math.max(i - 1, 0));

  const handleSelectTypes = (types) => {
    setSelectedTypes(types);
    // После выбора типов пересчитываем шаги и идём вперёд
    setStepIndex(2); // первый шаг после выбора
  };

  const currentStep = steps[stepIndex];

  // Прогресс-бар: фиксированные + динамические
  const progressSteps = [
    { key: "declarant", label: "Декларант" },
    { key: "select",    label: "Что везёте" },
    ...selectedTypes.map((t) => ({ key: t, label: TYPE_STEPS[t]?.label || t })),
    { key: "review",    label: "Проверка" },
  ];

  const renderStep = () => {
    if (currentStep === "declarant") {
      return <StepDeclarant data={data} update={update} onNext={next} />;
    }
    if (currentStep === "select") {
      return (
        <StepSelectTypes
          selected={selectedTypes}
          onConfirm={(types) => {
            setSelectedTypes(types);
            setStepIndex(2);
          }}
          onPrev={prev}
        />
      );
    }
    if (currentStep === "review") {
      return <StepReview data={data} selectedTypes={selectedTypes} onPrev={prev} onReset={() => { setData({}); setSelectedTypes([]); setStepIndex(0); }} />;
    }
    // Динамические шаги
    const typeKey = currentStep;
    const StepComp = TYPE_STEPS[typeKey]?.component;
    if (!StepComp) return null;
    return <StepComp data={data} update={update} onNext={next} onPrev={prev} />;
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
