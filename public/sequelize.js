// database 버튼 클릭시
document.getElementById('database').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        await axios.post('/items');
    } catch (err) {
        console.error(err);
    }
});