# PTD Service — Пассажирская Таможенная Декларация

## Структура проекта

```
ptd-service/
├── frontend/          # React + Vite
│   ├── src/
│   │   ├── App.jsx                    # Главный компонент, логика шагов
│   │   ├── components/
│   │   │   ├── ProgressBar.jsx        # Прогресс-бар
│   │   │   ├── FormFields.jsx         # Переиспользуемые компоненты
│   │   │   └── steps/
│   │   │       ├── StepDeclarant.jsx  # Раздел 1 — Декларант
│   │   │       ├── StepSelectTypes.jsx # Выбор видов ПТД
│   │   │       ├── StepVehicle.jsx    # Раздел 5 — ТС
│   │   │       ├── StepCash.jsx       # Раздел 3.1 + Приложение
│   │   │       ├── StepGoods.jsx      # Раздел 3.3 + Раздел 4
│   │   │       ├── StepCultural.jsx   # Раздел 3.4 + Раздел 4
│   │   │       ├── StepWeapons.jsx    # Раздел 3.5 + Раздел 4
│   │   │       ├── StepMeds.jsx       # Раздел 3.6 + Раздел 4
│   │   │       ├── StepAnimals.jsx    # Раздел 3.7 + Раздел 4
│   │   │       └── StepReview.jsx     # Проверка + генерация PDF
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── backend/           # FastAPI + ReportLab
    ├── main.py        # FastAPI сервер
    ├── generators/
    │   └── ptd_main.py  # PDF генератор (все страницы ПТД)
    └── requirements.txt

## Запуск

### Backend
cd backend
pip install -r requirements.txt
python main.py

### Frontend
cd frontend
npm install
npm run dev

## Как работает

1. Пользователь вводит данные декларанта (Раздел 1)
2. Выбирает что везёт (от 1 до 7 видов ПТД)
3. Заполняет шаги под каждый выбранный вид
4. На шаге "Проверка" смотрит сводку и нажимает "Распечатать"
5. Frontend → POST /generate_pdf → Backend → PDF (2-4 страницы)

## Выходной PDF

- Стр. 1: Раздел 1 (декларант) + Разделы 2, 3 (чекбоксы заполнены по выбору)
- Стр. 2: Раздел 4 (таблица товаров из всех видов) + Раздел 5 (ТС)
- Стр. 3-4: Приложение к ПТД (только если выбраны наличные)
