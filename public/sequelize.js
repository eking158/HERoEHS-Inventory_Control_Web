// database 버튼 클릭시
document.getElementById('database').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        await axios.post('/items/prev');
    } catch (err) {
        console.error(err);
    }
});