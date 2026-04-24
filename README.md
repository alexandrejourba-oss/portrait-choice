** Portrait Choice **

Учебный веб-проект для прохождения **Теста восьми влечений методом портретных выборов**  
(без интерпретации результатов, без базы данных, с локальным сохранением в браузере).

> ⚠️ Важно: проект предназначен **только для учебных и демонстрационных целей**.  
> Он **не является инструментом психологической, клинической или медицинской диагностики**.

---

# Возможности

- Прохождение серий портретных выборов
- Выбор:
  - **2 наиболее симпатичных**
  - **2 наиболее неприятных**
- Адаптация под смартфоны
- Сохранение прогресса в `localStorage`
- Восстановление незавершённой сессии
- Экспорт результатов:
  - `JSON`
  - `CSV`

---

# Стек

- **Next.js**
- **React**
- **TypeScript**
- **Tailwind CSS**

---

# Структура проекта

src/
  app/
	 globals.css
	 layout.tsx
	 page.tsx
    instructions/
		page.tsx
    result/
		page.tsx
		 print/
		  page.tsx
    test/
        page.tsx
  config/
      testConfig.ts
  components/
	BottomActionBar.tsx
	ConsentCheckbox.tsx
	PortraitCard.tsx
	ProgressBar.tsx
	ResumeScreen.tsx
	SelectionHeader.tsx
	SelectionStatus.tsx
	StartScreen.tsx
  lib/
    download.ts
	factors.ts
	storage.ts
	testData.ts
	testLogic.ts
  types/
    test.ts
  utils
    preloadImages.ts
public/
  set1/
    round1/
    round2/
    round3/
    round4/
    round5/
    round6/
 set2/
    round1/
    round2/
    round3/
    round4/
    round5/
    round6/