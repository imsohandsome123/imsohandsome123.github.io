document.addEventListener("DOMContentLoaded", function () {
    // 讀取並解析 CSV 檔案
    fetch('characters.csv')
      .then(response => response.text())
      .then(data => {
        const rows = data.split('\n').slice(1); // 移除標題
        const characterData = rows.map(row => row.split(','));
        displayTable(characterData);
  
        const searchBox = document.getElementById("searchBox");
        searchBox.addEventListener("input", () => searchCharacter(characterData, searchBox.value));
      });
  
    // 顯示表格
    function displayTable(data) {
      const tableBody = document.getElementById("characterTable").getElementsByTagName("tbody")[0];
      data.forEach(row => {
        let newRow = tableBody.insertRow();
        row.forEach(cell => {
          let newCell = newRow.insertCell();
          newCell.textContent = cell.trim();
        });
      });
    }
  
    // 搜尋功能
    function searchCharacter(data, query) {
      const suggestions = document.getElementById("suggestions");
      suggestions.innerHTML = "";
  
      if (query.length === 0) return;
  
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
        newCell.textContent = cell.trim();
      });
    }
  });