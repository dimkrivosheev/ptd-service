from generators.ptd_main import generate_ptd
pdf = generate_ptd({
    'fio': 'Иванов Иван',
    'doc_info': 'Паспорт Россия 1234 567890 01.01.2020',
    'address': 'Москва',
    'country_from': 'Грузия',
    'country_to': 'Россия',
    'selected_types': ['vehicle'],
    'brand_model': 'Toyota Camry',
    'reg_number': 'AA123BB Грузия',
    'vin': 'JT2BF22K1W0123456',
    'cc': '2000',
    'body_num': '123',
    'chassis_num': 'ОТСУТСТВУЕТ',
    'manufacture_date': '01.2020',
    'price_str': '25000 USD',
    'sign_date': '17.06.2026',
    'direction': 'import',
    'cash': None,
    'goods_items': [],
    'cultural_items': [],
    'weapons_items': [],
    'meds_items': [],
    'animals_items': [],
})
open('/tmp/test.pdf', 'wb').write(pdf)
print('OK, байт:', len(pdf))
