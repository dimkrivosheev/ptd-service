"""PTD PDF Generator — все разделы ПТД + Приложение (наличные)"""
import io
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os

W, H = A4

def _reg_fonts():
    candidates = [
        # Linux — DejaVu
        ('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',      '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'),
        ('/usr/share/fonts/dejavu/DejaVuSans.ttf',               '/usr/share/fonts/dejavu/DejaVuSans-Bold.ttf'),
        # Linux — Liberation
        ('/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf', '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf'),
        ('/usr/share/fonts/liberation/LiberationSans-Regular.ttf',          '/usr/share/fonts/liberation/LiberationSans-Bold.ttf'),
        # macOS — Arial
        ('/Library/Fonts/Arial.ttf',                             '/Library/Fonts/Arial Bold.ttf'),
        ('/System/Library/Fonts/Supplemental/Arial.ttf',         '/System/Library/Fonts/Supplemental/Arial Bold.ttf'),
        # macOS — Helvetica Neue
        ('/System/Library/Fonts/HelveticaNeue.ttc',              '/System/Library/Fonts/HelveticaNeue.ttc'),
    ]
    for r, b in candidates:
        if os.path.exists(r) and os.path.exists(b):
            pdfmetrics.registerFont(TTFont('R', r))
            pdfmetrics.registerFont(TTFont('B', b))
            return
    # Последний вариант — встроенные шрифты ReportLab (без кириллицы, но не падает)
    from reportlab.lib.fonts import addMapping
    pdfmetrics.registerFont(TTFont('R', 'Helvetica'))
    pdfmetrics.registerFont(TTFont('B', 'Helvetica-Bold'))
try: _reg_fonts()
except: pass
NR,NB = 'R','B'

def hm(v): return v*mm
def line(c,x1,y1,x2,y2,w=0.4): c.setLineWidth(w);c.setStrokeColor(colors.black);c.line(hm(x1),hm(y1),hm(x2),hm(y2))
def rect(c,x,y,w,h,lw=0.4): c.setLineWidth(lw);c.setStrokeColor(colors.black);c.rect(hm(x),hm(y),hm(w),hm(h))
def t(c,text,x,y,size=7,font=NR,color=colors.black): c.setFillColor(color);c.setFont(font,size);c.drawString(hm(x),hm(y),str(text))
def checkbox(c,x,y,sz=3.5,checked=False):
    rect(c,x,y,sz,sz,0.5)
    if checked:
        c.setLineWidth(0.9);c.setStrokeColor(colors.black)
        c.line(hm(x+0.5),hm(y+1.8),hm(x+1.4),hm(y+0.7));c.line(hm(x+1.4),hm(y+0.7),hm(x+sz-0.3),hm(y+sz-0.4))
def fline(c,x,y,w,label='',value='',vsz=8.5,lsz=5,bold=False):
    line(c,x,y,x+w,y)
    if label: t(c,label,x+0.5,y-3.5,lsz,NR,colors.HexColor('#555'))
    if value:
        font=NB if bold else NR; c.setFont(font,vsz); mw=hm(w-2); s=str(value)
        while s and c.stringWidth(s,font,vsz)>mw: s=s[:-1]
        t(c,s,x+1.5,y+1.5,vsz,font)
def mtext(c,lines_list,x,y,sz=6.5,leading=3.5):
    for ln in lines_list: t(c,ln,x,y,sz,NR,colors.HexColor('#222')); y-=leading

def page1(c,D):
    M=15;RW=180;y=280
    y-=3;c.setFont(NB,10);c.setFillColor(colors.black)
    c.drawCentredString(W/2,hm(y),'ПАССАЖИРСКАЯ ТАМОЖЕННАЯ ДЕКЛАРАЦИЯ')
    y-=5
    mtext(c,['Заполняется физическим лицом, достигшим 16-летнего возраста.',
        'В случае утвердительного ответа в соответствующем поле проставляется знак "X" или "✓".',
        'Экземпляр оформленной пассажирской таможенной декларации сохраняется на весь период',
        'временного пребывания на таможенной территории ЕАЭС (за её пределами) и предъявляется',
        'таможенному органу при въезде (возвращении).'],M,y,6,3.3)
    y-=20
    t(c,'1. Сведения о декларанте:',M,y,8,NB);y-=7
    parts=D.get('fio','').split(); fam=parts[0] if len(parts)>0 else ''; name=parts[1] if len(parts)>1 else ''; otch=' '.join(parts[2:]) if len(parts)>2 else ''
    fw=RW/3-1
    fline(c,M,y,fw,'(фамилия)',fam,bold=True); fline(c,M+fw+1,y,fw,'(имя)',name,bold=True); fline(c,M+fw*2+2,y,fw-1,'(отчество)',otch,bold=True)
    y-=9; fline(c,M,y,RW,'(документ, удостоверяющий личность (наименование, страна выдачи, серия, номер, дата выдачи))',D.get('doc_info',''),bold=True)
    y-=9; fline(c,M,y,RW,'(адрес постоянного места жительства (регистрации))',D.get('address',''),bold=True)
    y-=9; fline(c,M,y,RW,'(адрес временного проживания (пребывания) в государстве — члене ЕАЭС — заполняется иностранным лицом)','')
    y-=8; hw=RW/2-2
    fline(c,M,y,hw,'(страна отправления)',D.get('country_from',''),bold=True); fline(c,M+hw+4,y,hw,'(страна назначения)',D.get('country_to',''),bold=True)
    y-=9; t(c,'Со мной следуют лица, не достигшие 16-летнего возраста, в количестве _____ чел.',M,y,7)
    y-=4; t(c,'Мной, следующими со мной лицами, не достигшими 16-летнего возраста, либо в мой адрес (от меня)',M,y,7)
    y-=4; t(c,'перемещаются следующие товары и транспортные средства:',M,y,7); y-=7
    t(c,'2. Сведения о способе перемещения товаров и транспортных средств:',M,y,8,NB);y-=6
    bt=D.get('baggage_type','accompanied'); checkbox(c,M,y-0.5,checked=(bt=='accompanied')); mtext(c,['2.1. Сопровождаемый','багаж, включая','ручную кладь'],M+4.5,y,7)
    checkbox(c,M+50,y-0.5,checked=(bt=='unaccompanied')); mtext(c,['2.2. Несопровождаемый багаж','(багаж, следующий отдельно от','въезжающего/выезжающего лица)'],M+54.5,y,7)
    checkbox(c,M+120,y-0.5,checked=(bt=='delivered')); mtext(c,['2.3. Доставляемые в адрес','(пересылаемые) товары','без въезда/выезда лица'],M+124.5,y,7)
    y-=14
    t(c,'3. Сведения о товарах:',M,y,8,NB);y-=6
    selected=D.get('selected_types',[])
    imp=D.get('direction','import')=='import'; checkbox(c,M,y,checked=imp);t(c,'Ввоз (свободное',M+4.5,y,7);t(c,'обращение)',M+4.5,y-3.8,7)
    checkbox(c,M+45,y,checked=not imp);t(c,'Вывоз',M+49.5,y,7)
    checkbox(c,M+75,y,checked=(D.get('direction','import')=='temp_export'));t(c,'Временный вывоз',M+79.5,y,7)
    checkbox(c,M+125,y,checked=(D.get('direction','import')=='transit'));t(c,'Транзит (для товаров,',M+129.5,y,7);t(c,'ввозимых со льготой)',M+129.5,y-3.8,7)
    y-=10
    items=[
        ('3.1.',['Наличные денежные средства и (или) дорожные чеки свыше 10 000 $ в эквиваленте','(на 1 лицо), векселя, чеки (банковские чеки), ценные бумаги <*>'],'cash' in selected),
        ('3.2.',['Товары, ввозимые с освобождением от уплаты таможенных пошлин, налогов (ввоз со льготой)'],False),
        ('3.3.',['Товары, стоимость, вес и (или) количество которых превышают нормы ввоза без уплаты','таможенных пошлин, налогов'],'goods' in selected),
        ('3.4.',['Культурные ценности'],'cultural' in selected),
        ('3.5.',['Гражданское и служебное оружие, его основные (составные) части, патроны к нему'],'weapons' in selected),
        ('3.6.',['Наркотические средства, психотропные вещества, их прекурсоры в виде лекарственных средств'],'meds' in selected),
        ('3.7.',['Животные, растения'],'animals' in selected),
        ('3.8.',['Коллекционные материалы по минералогии, палеонтологии, кости ископаемых животных'],False),
        ('3.9.',['Образцы биологических материалов человека'],False),
        ('3.10.',['Другие товары, в отношении которых подлежат соблюдению запреты и ограничения','и требуется представление подтверждающих документов и (или) сведений'],False),
    ]
    for num,lbls,checked in items:
        t(c,num,M,y,7,NB)
        for i,ln in enumerate(lbls): t(c,ln,M+7,y-i*3.8,7)
        checkbox(c,M+RW-4,y-0.5,checked=checked)
        y-=3.8*len(lbls)+2.5
    c.showPage()

def page2(c,D):
    M=15;RW=180;y=277
    selected=D.get('selected_types',[])
    t(c,'4. Дополнительные сведения о товарах, в том числе указанных в графах 3.2 - 3.10:',M,y,8,NB);y-=5
    cols_w=[8,100,36,36]
    hdrs=[['№','п/п'],
        ['Наименование товара и его описание (идентификационный номер','и другие сведения, наименования, даты и номера документов,','подтверждающих соблюдение условий ввоза с освобождением от','уплаты таможенных пошлин, налогов, и (или) документа,','подтверждающего соблюдение ограничений, а также наименования','органов, выдавших такие документы)'],
        ['Вес (с учётом','фактически','перемещаемой','первичной упаковки)','(кг)/количество','(л, шт.)'],
        ['Стоимость','(в валюте','государства —','члена ЕАЭС,','евро или','долларах США)']]
    th=24;cx=M
    for w,hd in zip(cols_w,hdrs):
        rect(c,cx,y-th,w,th);ly=y-3
        for ln in hd: t(c,ln,cx+0.8,ly,5,NB);ly-=3.2
        cx+=w
    y-=th
    # Собираем строки раздела 4
    rows4=[]
    for item in D.get('goods_items',[]):
        desc='; '.join(filter(None,[item.get('name',''),item.get('description',''),item.get('doc_name',''),item.get('doc_num','')]))
        rows4.append((desc,f"{item.get('weight','')} {item.get('unit','кг')}".strip(),f"{item.get('value','')} {item.get('currency','')}".strip()))
    for item in D.get('cultural_items',[]):
        desc='; '.join(filter(None,[item.get('name',''),item.get('description',''),item.get('date_create',''),item.get('doc_name',''),item.get('doc_num','')]))
        rows4.append((desc,'',f"{item.get('value','')} {item.get('currency','')}".strip()))
    for item in D.get('weapons_items',[]):
        desc='; '.join(filter(None,[item.get('type',''),item.get('model',''),f"сер.{item.get('serial','')}" if item.get('serial') else '',f"кал.{item.get('caliber','')}" if item.get('caliber') else '',item.get('doc_name',''),item.get('doc_num','')]))
        rows4.append((desc,f"{item.get('ammo_count','')} патр." if item.get('ammo_count') else '',''))
    for item in D.get('meds_items',[]):
        desc='; '.join(filter(None,[item.get('name',''),item.get('substance',''),item.get('form',''),item.get('dosage',''),item.get('doc_name',''),item.get('doc_num','')]))
        rows4.append((desc,f"{item.get('quantity','')} {item.get('unit','')}".strip(),''))
    for item in D.get('animals_items',[]):
        desc='; '.join(filter(None,[item.get('type',''),item.get('species',''),f"чип:{item.get('microchip','')}" if item.get('microchip') else '',item.get('doc_vet',''),item.get('doc_cites_num','')]))
        rows4.append((desc,str(item.get('count','')),''))
    rh=6; nr=max(5,len(rows4))
    for i in range(nr):
        cx=M
        for wi in cols_w: rect(c,cx,y-rh,wi,rh);cx+=wi
        if i<len(rows4):
            dr,wt,val=rows4[i]; t(c,str(i+1),M+1,y-rh+2,5.5)
            t(c,dr[:88] if len(dr)>88 else dr,M+cols_w[0]+1,y-rh+2,5.5)
            t(c,wt[:16],M+cols_w[0]+cols_w[1]+1,y-rh+2,5.5)
            t(c,val[:16],M+cols_w[0]+cols_w[1]+cols_w[2]+1,y-rh+2,5.5)
        y-=rh
    y-=6
    has_v='vehicle' in selected
    t(c,'5. Сведения о транспортных средствах:',M,y,8,NB);y-=7
    checkbox(c,M,y,checked=has_v and D.get('direction','import')=='import');t(c,'Ввоз (свободное обращение)',M+4.5,y,7)
    checkbox(c,M+52,y,checked=False);t(c,'Временный ввоз',M+56.5,y,7)
    checkbox(c,M+90,y,checked=False);t(c,'Вывоз',M+94.5,y,7)
    checkbox(c,M+112,y,checked=False);t(c,'Временный вывоз',M+116.5,y,7)
    checkbox(c,M+152,y,checked=False);t(c,'Транзит',M+156.5,y,7)
    y-=8
    checkbox(c,M,y,checked=False);t(c,'Транспортные средства, ввозимые с освобождением от уплаты таможенных пошлин, налогов',M+4.5,y,7);t(c,'(ввоз со льготой)',M+4.5,y-3.8,7)
    y-=10
    checkbox(c,M,y,checked=has_v);t(c,'Авто- и мототранспортное средство',M+4.5,y,7);checkbox(c,M+80,y,checked=False);t(c,'Прицеп',M+84.5,y,7)
    y-=8
    a,b,cv,d=58,52,42,18
    fline(c,M,y,a,'(марка, модель)',D.get('brand_model',''),bold=True)
    fline(c,M+a+2,y,b,'(регистрационный номер, страна регистрации)',D.get('reg_number',''),bold=True)
    fline(c,M+a+b+4,y,cv,'(идентификационный номер)',D.get('vin',''),bold=True)
    fline(c,M+a+b+cv+6,y,d,'(рабочий объём (см³))',D.get('cc',''),bold=True)
    y-=10
    e,f,g,h=55,40,38,38
    fline(c,M,y,e,'(номер кузова)',D.get('body_num',''),bold=True)
    v=D.get('chassis_num',''); fline(c,M+e+2,y,f,'(номер шасси)',v if v and v != 'ОТСУТСТВУЕТ' else '',bold=True)
    fline(c,M+e+f+4,y,g,'(дата изготовления)',D.get('manufacture_date',''),bold=True)
    fline(c,M+e+f+g+6,y,h,'(стоимость)',D.get('price_str',''),bold=True)
    y-=11
    t(c,'Водное судно',M,y,7);line(c,M+18,y,M+55,y);t(c,'(вид)',M+18,y-3.5,5,color=colors.HexColor('#555'));line(c,M+57,y,M+110,y);t(c,'(рег. номер, страна)',M+57,y-3.5,5,color=colors.HexColor('#555'));line(c,M+112,y,M+140,y);t(c,'(стоимость)',M+112,y-3.5,5,color=colors.HexColor('#555'));line(c,M+142,y,M+160,y);t(c,'(масса, кг)',M+142,y-3.5,5,color=colors.HexColor('#555'));line(c,M+162,y,M+180,y);t(c,'(длина, м)',M+162,y-3.5,5,color=colors.HexColor('#555'))
    y-=10
    t(c,'Воздушное судно',M,y,7);line(c,M+22,y,M+58,y);t(c,'(вид)',M+22,y-3.5,5,color=colors.HexColor('#555'));line(c,M+60,y,M+118,y);t(c,'(рег. номер, страна)',M+60,y-3.5,5,color=colors.HexColor('#555'));line(c,M+120,y,M+150,y);t(c,'(стоимость)',M+120,y-3.5,5,color=colors.HexColor('#555'));line(c,M+152,y,M+180,y);t(c,'(масса пустого, кг)',M+152,y-3.5,5,color=colors.HexColor('#555'))
    y-=10
    t(c,'Часть транспортного средства, замененная в государстве, не являющемся членом ЕАЭС, и подлежащая учету (регистрации)',M,y,7)
    y-=5;line(c,M+28,y,M+180,y);t(c,'(наименование, номер)',M+29,y-3.5,5,color=colors.HexColor('#555'));y-=10
    t(c,'Мне известно, что сообщение в пассажирской таможенной декларации недостоверных сведений влечет',M,y,7)
    y-=4;t(c,'за собой ответственность в соответствии с законодательством государства — члена ЕАЭС',M,y,7);y-=9
    fline(c,M,y,28,'(дата)',D.get('sign_date',''),bold=True);fline(c,M+30,y,28,'(подпись)','');fline(c,M+65,y,110,'(Ф.И.О. лица, действующего от имени и по поручению декларанта, реквизиты документа)',D.get('fio',''),bold=True,vsz=7.5)
    y-=12;line(c,M,y,M+RW,y,0.6);y-=5;t(c,'Для служебных отметок:',M,y,7,NB);y-=5;rect(c,M,y-18,30,18);y-=22
    for _ in range(4): line(c,M+35,y,M+RW,y);y-=5.5
    y-=4;t(c,'М.П.',M,y,7);y-=8;line(c,M,y,M+RW,y,0.6);y-=5
    t(c,'<*> Необходимо заполнить приложение к пассажирской таможенной декларации.',M,y,6.5,NR,colors.HexColor('#333'))
    c.showPage()

def page_annex(c,D):
    M=15;RW=180;y=275
    cash=D.get('cash',{}or {})
    t(c,'Приложение к пассажирской таможенной декларации',M,y,9,NB)
    t(c,D.get('fio',''),M+RW-len(D.get('fio',''))*2,y,8,NB);y-=8
    t(c,'1. Дополнительные сведения о декларанте:',M,y,8,NB);y-=7
    bd=D.get('birth_date','')
    if bd: parts=bd.split('-');bd=f"{parts[2]}.{parts[1]}.{parts[0]}" if len(parts)==3 else bd
    fline(c,M,y,35,'(дата рождения)',bd,bold=True);fline(c,M+37,y,RW-37,'(номер и дата выдачи визы)',cash.get('visa',''))
    y-=11
    t(c,'2. Сведения о наличных денежных средствах и (или) денежных инструментах:',M,y,8,NB);y-=6
    t(c,'2.1. Наличные денежные средства и дорожные чеки:',M,y,7);y-=5
    c21=[80,50,50];hdrs21=['Наличные денежные средства, дорожные чеки','Сумма','Наименование валюты']
    cx=M
    for w,h in zip(c21,hdrs21): rect(c,cx,y-6,w,6);t(c,h,cx+1,y-4,5.5,NB);cx+=w
    y-=6
    banknotes=cash.get('banknotes',[])
    rect(c,M,y-6,c21[0],6);t(c,'Банкноты, казначейские билеты, монеты',M+1,y-4,5.5)
    if banknotes:
        ts='; '.join(f"{b.get('amount','')} {b.get('currency','')}" for b in banknotes if b.get('amount'))
        rect(c,M+c21[0],y-6,c21[1]+c21[2],6);t(c,ts[:40],M+c21[0]+1,y-4,5.5)
    else: rect(c,M+c21[0],y-6,c21[1],6);rect(c,M+c21[0]+c21[1],y-6,c21[2],6)
    y-=6
    rect(c,M,y-6,c21[0],6);t(c,'Дорожные чеки',M+1,y-4,5.5)
    cheq=cash.get('cheques','');rect(c,M+c21[0],y-6,c21[1],6);t(c,str(cheq) if cheq else '',M+c21[0]+1,y-4,5.5);rect(c,M+c21[0]+c21[1],y-6,c21[2],6);t(c,'USD' if cheq else '',M+c21[0]+c21[1]+1,y-4,5.5)
    y-=8
    t(c,'2.2. Денежные инструменты, за исключением дорожных чеков:',M,y,6.5);y-=5
    c22=[30,30,22,25,50,23];hdrs22=['Наименование\nинструмента','Наименование\nэмитента','Дата\nвыпуска','Идентиф.\nномер','Номинальная стоимость\nили сумма, валюта','Количество']
    cx=M
    for w,h in zip(c22,hdrs22):
        rect(c,cx,y-9,w,9)
        for i,ln in enumerate(h.split('\n')): t(c,ln,cx+0.8,y-4-i*3.2,5,NB)
        cx+=w
    y-=9
    for _ in range(3):
        cx=M
        for w in c22: rect(c,cx,y-6,w,6);cx+=w
        y-=6
    y-=6
    t(c,'3. Сведения о владельце наличных денежных средств и (или) денежных инструментов:',M,y,8,NB)
    t(c,'(заполняется в случае, если декларант не является собственником)',M,y-4,6.5,NR,colors.HexColor('#666'))
    y-=10
    c3=[70,70,40]; cx=M
    for w in c3: rect(c,cx,y-8,w,8);cx+=w
    if not cash.get('own',True):
        vals=[cash.get('owner_name',''),cash.get('owner_address',''),cash.get('owner_amount','')]
        cx=M
        for w,v in zip(c3,vals): t(c,str(v)[:int(w/2.3)],cx+1,y-5,5.5);cx+=w
    y-=10
    c.showPage()
    # Page 4
    y=275
    t(c,'4. Сведения об источнике происхождения наличных денежных средств и (или) денежных инструментов:',M,y,8,NB);y-=7
    sources=cash.get('sources',[])
    sm=[('salary','Зарплата/доходы\nот бизнеса'),('dividends','Дивиденды и\nдоходы от участия'),('property','Доходы от\nреализации имущества'),('transfers','Безвозмездные\nтрансферты'),('pension','Пенсия, стипендия,\nпособия, алименты'),('rent','Доходы от аренды\nнедвижимости'),('loan','Заёмные\nсредства'),('inheritance','Наследство')]
    bw=RW/len(sm)
    for i,(key,lbl) in enumerate(sm):
        bx=M+i*bw; rect(c,bx,y-14,bw,14);checkbox(c,bx+bw/2-1.75,y-4,sz=3.5,checked=(key in sources))
        for j,ln in enumerate(lbl.split('\n')): t(c,ln,bx+1,y-7-j*3.5,4.5)
    y-=17;fline(c,M,y,RW,'Прочее (указать)',cash.get('other_source',''));y-=10
    t(c,'5. Сведения о предполагаемом использовании наличных денежных средств и (или) денежных инструментов:',M,y,8,NB);y-=7
    purposes=cash.get('purposes',[])
    pm=[('expenses','Текущие расходы\n(товары и услуги)'),('investment','Инвестиции,\nвкл. недвижимость'),('transfer_p','Безвозмездные\nтрансферты физлицам'),('transfer_l','Благотворительность/\nпожертвования юрлицам')]
    bw2=RW/len(pm)
    for i,(key,lbl) in enumerate(pm):
        bx=M+i*bw2; rect(c,bx,y-14,bw2,14);checkbox(c,bx+bw2/2-1.75,y-4,sz=3.5,checked=(key in purposes))
        for j,ln in enumerate(lbl.split('\n')): t(c,ln,bx+1,y-7-j*3.5,4.5)
    y-=17;fline(c,M,y,RW,'Прочее (указать)',cash.get('other_purpose',''));y-=10
    t(c,'6. Сведения о маршруте и способе перевозки наличных денежных средств и (или) денежных инструментов:',M,y,8,NB);y-=6
    hw=RW/2-2;fline(c,M,y,hw,'(страна отправления, дата выезда)',D.get('country_from',''));fline(c,M+hw+4,y,hw,'(страна назначения, дата въезда)',D.get('country_to',''))
    y-=10;fline(c,M,y,RW,'(страны транзита)','');y-=10
    t(c,'Вид транспорта, которым осуществляется ввоз/вывоз:',M,y,7);y-=6
    transport=cash.get('transport','auto');tx=M
    for key,lbl in [('air','воздушный'),('auto','автомобильный'),('rail','железнодорожный'),('sea','водный')]:
        checkbox(c,tx,y,sz=3.5,checked=(transport==key));t(c,lbl,tx+5,y,7);tx+=42
    y-=8;fline(c,M,y,RW,'Прочее (указать)','');y-=12
    t(c,'Мне известно, что сообщение в пассажирской таможенной декларации недостоверных сведений влечёт',M,y,7)
    y-=4;t(c,'за собой ответственность в соответствии с законодательством государства — члена ЕАЭС',M,y,7);y-=9
    fline(c,M,y,28,'(дата)',D.get('sign_date',''),bold=True);fline(c,M+30,y,28,'(подпись)','');fline(c,M+65,y,110,'(Ф.И.О. лица, действующего от имени и по поручению декларанта, реквизиты документа)',D.get('fio',''),bold=True,vsz=7.5)
    y-=12;line(c,M,y,M+RW,y,0.6);y-=5;t(c,'Для служебных отметок:',M,y,7,NB);y-=5;rect(c,M,y-18,30,18);y-=22
    for _ in range(4): line(c,M+35,y,M+RW,y);y-=5.5
    y-=4;t(c,'М.П.',M,y,7)
    c.showPage()

def generate_ptd(D:dict)->bytes:
    buf=io.BytesIO(); c=canvas.Canvas(buf,pagesize=A4)
    page1(c,D); page2(c,D)
    if 'cash' in D.get('selected_types',[]) and D.get('cash'):
        page_annex(c,D)
    c.save(); return buf.getvalue()
