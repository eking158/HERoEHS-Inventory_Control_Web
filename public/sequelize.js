// 검색 버튼 클릭 시
document.getElementById('item-search').addEventListener('submit', async (e) => {
    e.preventDefault();
    const search_item = e.target.search_item.value;
    if (!search_item) {
      return alert('찾고 싶은 물품을 입력하세요');
    }
    try {
      //await axios.get('/items', { search_item });
      searchItems(search_item);
    } catch (err) {
      console.error(err);
    }
    e.target.search_item.value = '';

    //printItems(search_item);
});

//물품 Searching
async function searchItems(search_item) {
    try {
      const res = await axios.post('/items', { search_item });
      console.log('dd');
      console.log(res);
      const items = res.data;
      const tbody = document.querySelector('#item-list tbody');
      tbody.innerHTML = '';
      items.map(function (item) {
        // 로우 셀 추가
        const row = document.createElement('tr');
        let td = document.createElement('td');
        td.textContent = item.id;
        row.appendChild(td);
        td = document.createElement('td');
        td.textContent = item.name;
        row.appendChild(td);
        td = document.createElement('td');
        td.textContent = item.L_category;
        row.appendChild(td);
        td = document.createElement('td');
        td.textContent = item.S_category;
        row.appendChild(td);
        td = document.createElement('td');
        td.textContent = item.room;
        row.appendChild(td);
        td = document.createElement('td');
        td.textContent = item.box;
        row.appendChild(td);
        td = document.createElement('td');
        td.textContent = item.count;
        row.appendChild(td);
        td = document.createElement('td');
        td.textContent = item.etc;
        row.appendChild(td);
        tbody.appendChild(row);
      });
    } catch (err) {
      console.error(err);
    }
  }


// 사용자 등록 시
// document.getElementById('item-search').addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const search_item = e.target.search_item.value;
//     if (!search_item) {
//       return alert('찾고 싶은 물품을 입력하세요');
//     }
//     try {
//       await axios.search('/items', { search_item });
//       getUser();
//     } catch (err) {
//       console.error(err);
//     }
//     e.target.search_item.value = '';
// });
