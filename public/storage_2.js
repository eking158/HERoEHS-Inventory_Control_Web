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
    e.target.search_item.value = '';    // 검색창 비우기
  });