var express = require('express');
var router = express.Router();

var template = require('./template.js');
var db = require('./db');
const { Script } = require('vm');

// 로그인 화면
router.get('/login', function (request, response) {
    var title = '로그인';
    var html = template.HTML(title, `
            <h2>로그인</h2>
            <form action="/auth/login_process" method="post">
            <p><input class="login" type="text" name="userid" placeholder="아이디"></p>
            <p><input class="login" type="password" name="pwd" placeholder="비밀번호"></p>
            <p><input class="btn" type="submit" value="로그인"></p>
            </form>
            <div class="textconvert">
                <a href="/auth/find_id">아이디 찾기</a> | <a href="/auth/find_password">비밀번호 찾기</a> | <a href="/auth/register">회원가입</a>
            </div>
        `, '');
    response.send(html);
});

// 로그인 프로세스
router.post('/login_process', function (request, response) {
    // console.log(request.body);
    const username = {};
    const userid = request.body.userid;
    const password = request.body.pwd;
    if (userid && password) {             // id와 pw가 입력되었는지 확인

        db.query('SELECT * FROM userTable WHERE userid = ? AND password = ?', [userid, password], function (error, results, fields) {
            if (error) throw error;
            if (results.length > 0) {       // db에서의 반환값이 있으면 로그인 성공
                request.session.is_logined = true;      // 세션 정보 갱신
                request.session.nickname = userid;
                request.session.save(function () {
                    response.redirect(`/`);
                });
            } else {
                response.send(`<script type="text/javascript">alert("로그인 정보가 일치하지 않습니다."); 
                document.location.href="/auth/login";</script>`);
            }
        });

    } else {
        response.send(`<script type="text/javascript">alert("아이디와 비밀번호를 입력하세요!"); 
        document.location.href="/auth/login";</script>`);
    }
});

// 로그아웃
router.get('/logout', function (request, response) {
    request.session.destroy(function (err) {
        response.redirect('/');
    });
});

// 아이디 찾기 화면
router.get('/find_id', function (request, response) {
    var title = '회원가입';
    var html = template.HTML(title, `
    <h2>아이디 찾기</h2>
    <form action="/auth/find_id_process" method="post">
    <p>가입하신 이름을 입력하세요</p>
    <p><input class="login" type="text" name="username" placeholder="이름"></p>
    <p><input class="btn" type="submit" value="검색"></p>
    </form>            
    <p><a href="/auth/login">로그인화면으로 돌아가기</a></p>
    `, '');
    response.send(html);
});

// 아이디 찾기 프로세스
router.post('/find_id_process', function (request, response) {
    console.log(request.body);
    const username = request.body.username;
    if (username) {             // username이 입력되었는지 확인
        db.query('SELECT userid FROM userTable WHERE username = ?', [username], function (error, results, fields) {
            if (error) throw error;
            if (results.length > 0) {       // db에서의 반환값이 있으면 로그인 성공
                console.log('-----------------');
                // console.log(Object());       //////////////////////////////////수정중
                
                response.send('<script type="text/javascript">document.location.href="/auth/show_id";</script>');
            } else {
                response.send(`<script type="text/javascript">alert("이름 정보가 일치하지 않습니다."); 
                document.location.href="/auth/find_id";</script>`);
            }
        });

    } else {
        response.send(`<script type="text/javascript">alert("이름을 입력하세요"); 
        document.location.href="/auth/find_id";</script>`);
    }
});

// 아이디 찾기 프로세스 - 아이디 알려줌
router.get('/show_id', function (request, response) {
    var title = '아이디 확인';
    var html = template.HTML(title, `
    <h2>아이디를 확인해주세요</h2>
    <p><input class="show_id" type="text">유저 아이디 출력</p>
    </form>            
    <p><a href="/auth/login">로그인화면으로 돌아가기</a></p>
    `, '');
    response.send(html);
});

// 비밀번호 찾기 화면
router.get('/find_password', function (request, response) {
    var title = '회원가입';
    var html = template.HTML(title, `
    <h2>회원가입</h2>
    <form action="/auth/register_process" method="post">
    <p><input class="login" type="text" name="username" placeholder="이름"></p>
    <p><input class="login" type="text" name="userid" placeholder="아이디"></p>
    <p><input class="login" type="password" name="pwd" placeholder="비밀번호"></p>    
    <p><input class="login" type="password" name="pwd2" placeholder="비밀번호 재확인"></p>
    <p><input class="btn" type="submit" value="제출"></p>
    </form>            
    <p><a href="/auth/login">로그인화면으로 돌아가기</a></p>
    `, '');
    response.send(html);
});

// 회원가입 화면
router.get('/register', function (request, response) {
    var title = '회원가입';
    var html = template.HTML(title, `
    <h2>회원가입</h2>
    <form action="/auth/register_process" method="post">
    <p><input class="login" type="text" name="username" placeholder="이름"></p>
    <p><input class="login" type="text" name="userid" placeholder="아이디"></p>
    <p><input class="login" type="password" name="pwd" placeholder="비밀번호"></p>    
    <p><input class="login" type="password" name="pwd2" placeholder="비밀번호 재확인"></p>
    <p><input class="btn" type="submit" value="제출"></p>
    </form>            
    <p><a href="/auth/login">로그인화면으로 돌아가기</a></p>
    `, '');
    response.send(html);
});

// 회원가입 프로세스
router.post('/register_process', function (request, response) {
    const username = request.body.username;
    const userid = request.body.userid;
    const password = request.body.pwd;
    const password2 = request.body.pwd2;

    if (userid && password && password2) {

        db.query('SELECT * FROM userTable WHERE userid = ?', [userid], function (error, results, fields) { // DB에 같은 이름의 회원아이디가 있는지 확인
            if (error) throw error;
            if (results.length <= 0 && password == password2) {     // DB에 같은 이름의 회원아이디가 없고, 비밀번호가 올바르게 입력된 경우 
                db.query('INSERT INTO userTable (username, userid, password) VALUES(?,?,?)', [username, userid, password], function (error, data) {
                    if (error) throw error2;
                    response.send(`<script type="text/javascript">alert("회원가입이 완료되었습니다!");
                    document.location.href="/";</script>`);
                });
            } else if (password != password2) {                     // 비밀번호가 올바르게 입력되지 않은 경우
                response.send(`<script type="text/javascript">alert("입력된 비밀번호가 서로 다릅니다."); 
                document.location.href="/auth/register";</script>`);
            }
            else {                                                  // DB에 같은 이름의 회원아이디가 있는 경우
                response.send(`<script type="text/javascript">alert("이미 존재하는 아이디 입니다."); 
                document.location.href="/auth/register";</script>`);
            }
        });

    } else {        // 입력되지 않은 정보가 있는 경우
        response.send(`<script type="text/javascript">alert("입력되지 않은 정보가 있습니다."); 
        document.location.href="/auth/register";</script>`);
    }
});

module.exports = router;