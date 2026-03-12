export async function exportToWord(result) {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = await import('docx');
  const { name, age, score, total, answers, questions, date } = result;
  const percent = Math.round((score / total) * 100);

  const children = [
    new Paragraph({
      text: 'BrainQuest — Результаты теста',
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
    }),
    new Paragraph({ text: '' }),
    new Paragraph({ children: [new TextRun({ text: 'Имя участника: ', bold: true }), new TextRun({ text: name })] }),
    new Paragraph({ children: [new TextRun({ text: 'Возрастная группа: ', bold: true }), new TextRun({ text: `${age} лет` })] }),
    new Paragraph({ children: [new TextRun({ text: 'Дата: ', bold: true }), new TextRun({ text: new Date(date).toLocaleString('ru-RU') })] }),
    new Paragraph({ children: [new TextRun({ text: 'Результат: ', bold: true }), new TextRun({ text: `${score} из ${total} (${percent}%)`, color: percent >= 70 ? '16a34a' : 'dc2626' })] }),
    new Paragraph({ text: '' }),
    new Paragraph({ text: 'Ответы на вопросы:', heading: HeadingLevel.HEADING_2 }),
    new Paragraph({ text: '' }),
    ...answers.map((a, i) => {
      const q = questions[i];
      const isCorrect = a === q.correct;
      return [
        new Paragraph({ children: [new TextRun({ text: `${i + 1}. ${q.question}`, bold: true })] }),
        new Paragraph({ children: [new TextRun({ text: isCorrect ? '✓ Верно: ' : '✗ Неверно: ', color: isCorrect ? '16a34a' : 'dc2626', bold: true }), new TextRun({ text: q.options[a], color: isCorrect ? '16a34a' : 'dc2626' })] }),
        ...(!isCorrect ? [new Paragraph({ children: [new TextRun({ text: `Правильный ответ: ${q.options[q.correct]}`, color: '16a34a' })] })] : []),
        new Paragraph({ children: [new TextRun({ text: `Пояснение: ${q.explanation}`, italics: true, color: '6b7280' })] }),
        new Paragraph({ text: '' }),
      ];
    }).flat(),
  ];

  const doc = new Document({ sections: [{ children }] });
  const blob = await Packer.toBlob(doc);
  const filename = `BrainQuest_${name}_${formatDate(date)}.docx`;
  downloadFile(blob, filename, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
}

export async function exportToExcel(result) {
  const XLSX = await import('xlsx');
  const { name, age, score, total, answers, questions, date } = result;
  const percent = Math.round((score / total) * 100);

  const summaryData = [
    ['BrainQuest — Результаты теста'],
    [],
    ['Имя участника', name],
    ['Возрастная группа', `${age} лет`],
    ['Дата', new Date(date).toLocaleString('ru-RU')],
    ['Правильных ответов', score],
    ['Всего вопросов', total],
    ['Процент', `${percent}%`],
  ];

  const detailData = [
    ['№', 'Вопрос', 'Ваш ответ', 'Правильный ответ', 'Результат', 'Пояснение'],
    ...answers.map((a, i) => {
      const q = questions[i];
      const isCorrect = a === q.correct;
      return [i + 1, q.question, q.options[a], q.options[q.correct], isCorrect ? 'Верно' : 'Неверно', q.explanation];
    }),
  ];

  const wb = XLSX.utils.book_new();
  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
  const wsDetail = XLSX.utils.aoa_to_sheet(detailData);
  wsSummary['!cols'] = [{ wch: 25 }, { wch: 40 }];
  wsDetail['!cols'] = [{ wch: 4 }, { wch: 45 }, { wch: 25 }, { wch: 25 }, { wch: 12 }, { wch: 60 }];
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Итоги');
  XLSX.utils.book_append_sheet(wb, wsDetail, 'Подробно');

  // Конвертируем в Blob для надёжной загрузки на мобильных
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const filename = `BrainQuest_${name}_${formatDate(date)}.xlsx`;
  downloadFile(blob, filename, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
}

function downloadFile(blob, filename, mimeType) {
  // Метод 1: стандартный — работает на десктопе
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    // IE/Edge legacy
    window.navigator.msSaveOrOpenBlob(blob, filename);
    return;
  }

  const url = URL.createObjectURL(blob);

  // Метод 2: для iOS Safari — открываем в новой вкладке
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  if (isIOS) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const a = document.createElement('a');
      a.href = reader.result;
      a.download = filename;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };
    reader.readAsDataURL(blob);
    return;
  }

  // Метод 3: стандартный для Android и Desktop
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
}
