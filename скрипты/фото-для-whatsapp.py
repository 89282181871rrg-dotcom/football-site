# -*- coding: utf-8 -*-
"""
Делает jpg-копии первых фотографий товаров для превью в WhatsApp.

Зачем: каталог хранится в webp, а WhatsApp такие ссылки почти никогда
не разворачивает в картинку. Копии в jpg он показывает миниатюрой.

Запуск из корня проекта:   python скрипты/фото-для-whatsapp.py
Нужен Pillow:              pip install pillow

Запускать после того, как добавил товар или поменял его первое фото.
"""
import re, io, os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

src = io.open("lib/products.js", encoding="utf-8").read()
firsts = re.findall(r'images:\s*\[\s*"([^"]+)"', src)

os.makedirs("public/wa", exist_ok=True)
сделано = пропущено = 0

for path in firsts:
    исходник = "public" + path
    if not os.path.exists(исходник):
        print("нет файла:", исходник)
        пропущено += 1
        continue
    имя = os.path.basename(path).rsplit(".", 1)[0] + ".jpg"
    im = Image.open(исходник).convert("RGB")
    im.thumbnail((900, 900), Image.LANCZOS)     # больше для миниатюры не нужно
    im.save("public/wa/" + имя, "JPEG", quality=82, optimize=True, progressive=True)
    сделано += 1

print("Готово: %d фото, пропущено %d" % (сделано, пропущено))
