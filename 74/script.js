const form = document.getElementById('memoForm');
const dateInput = document.getElementById('dateInput');
const textInput = document.getElementById('textInput');
const memoList = document.getElementById('memoList');

let memos = [];

// 起動時にlocalStorageから読み込み
window.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('memos');
  if (saved) {
    memos = JSON.parse(saved);
    renderList();
  }
});

// 追加処理
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const date = dateInput.value;
  const text = textInput.value.trim();
  if (!date || !text) return;

  memos.push({ date, text });
  localStorage.setItem('memos', JSON.stringify(memos));

  renderList();

  dateInput.value = '';
  textInput.value = '';
});

// 表示処理（日付ごとにまとめる）
function renderList() {
  memoList.innerHTML = '';

  // 日付ごとにグループ化
  const grouped = {};
  memos.forEach((memo, index) => {
    if (!grouped[memo.date]) grouped[memo.date] = [];
    grouped[memo.date].push({ text: memo.text, index });
  });

  // 日付順に表示
  Object.keys(grouped).sort().forEach(date => {
    // 日付タイトル（完了ボタン付き）
    const dateTitle = document.createElement('div');
    dateTitle.className = 'date-title';

    const titleText = document.createElement('span');
    titleText.textContent = date;

    const completeBtn = document.createElement('button');
    completeBtn.className = 'complete-btn';
    completeBtn.textContent = '✔ 完了';

    // 日付ごとにまとめて削除
    completeBtn.addEventListener('click', () => {
      memos = memos.filter(m => m.date !== date);
      localStorage.setItem('memos', JSON.stringify(memos));
      renderList();
    });

    dateTitle.appendChild(titleText);
    dateTitle.appendChild(completeBtn);
    memoList.appendChild(dateTitle);

    // メモ一覧
    grouped[date].forEach(item => {
      const memoDiv = document.createElement('div');
      memoDiv.className = 'memo-item';

      const textSpan = document.createElement('span');
      textSpan.textContent = item.text;

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-btn';
      deleteBtn.textContent = '削除';

      deleteBtn.addEventListener('click', () => {
        memos.splice(item.index, 1);
        localStorage.setItem('memos', JSON.stringify(memos));
        renderList();
      });

      memoDiv.appendChild(textSpan);
      memoDiv.appendChild(deleteBtn);
      memoList.appendChild(memoDiv);
    });
  });
}