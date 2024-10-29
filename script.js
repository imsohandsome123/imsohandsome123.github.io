document.addEventListener("DOMContentLoaded", function () {
    const csvFiles = ['data/4star_char_name.csv', 'data/5star_char_name.csv']; // 加入所有CSV檔案的名稱
    // 讀取並合併所有 CSV 檔案
    Promise.all(csvFiles.map(file => fetch(file).then(response => response.text())))
      .then(allData => {
        let characterData = [];
  
        allData.forEach(data => {
          const rows = data.split('\n').slice(1); // 移除標題
          rows.forEach(row => {
            const rowData = row.split(',').map(cell => cell.trim());
            if (rowData.length === 4) { // 確認每列有四個欄位
              characterData.push(rowData);
            }
          });
        });
  
        displayTable(characterData);
  
        const searchBox = document.getElementById("searchBox");
        searchBox.addEventListener("input", () => searchCharacter(characterData, searchBox.value));
      });
  
    // 顯示表格並加入點擊複製功能
    function displayTable(data) {
      const tableBody = document.getElementById("characterTable").getElementsByTagName("tbody")[0];
      tableBody.innerHTML = ""; // 清空表格內容
      data.forEach(row => {
        let newRow = tableBody.insertRow();
        row.forEach(cell => {
          let newCell = newRow.insertCell();
          newCell.textContent = cell;
          
          // 新增點擊事件以便複製
          newCell.addEventListener("click", () => copyText(cell));
        });
      });
    }
  
    // 點擊複製文字
    function copyText(text) {
      navigator.clipboard.writeText(text)
        .then(() => alert(`已複製: ${text}`))
        .catch(err => console.error("無法複製文字: ", err));
    }
  
    // 搜尋功能
    function searchCharacter(data, query) {
      const suggestions = document.getElementById("suggestions");
      suggestions.innerHTML = "";
  
      if (query.length === 0) {
        // 若搜尋字串為空，顯示完整資料表
        displayTable(data);
        return;
      }
  
      const results = data.filter(row =>
        row.some(cell => cell.toLowerCase().includes(query.toLowerCase()))
      );
  
      if (results.length > 0) {
        results.forEach(row => {
          let suggestion = document.createElement("div");
          suggestion.textContent = row.join(" | ");
          suggestion.onclick = () => {
            displayMatch(row);
            suggestions.innerHTML = "";
          };
          suggestions.appendChild(suggestion);
        });
      }
    }
  
    // 顯示搜尋結果
    function displayMatch(match) {
      const tableBody = document.getElementById("characterTable").getElementsByTagName("tbody")[0];
      tableBody.innerHTML = "";
      let newRow = tableBody.insertRow();
      match.forEach(cell => {
        let newCell = newRow.insertCell();
        newCell.textContent = cell;
        newCell.addEventListener("click", () => copyText(cell));
      });
    }
  });