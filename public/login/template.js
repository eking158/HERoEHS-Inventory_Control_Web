module.exports = {
    HTML: function (title, body, authStatusUI) {
        return `
      <!doctype html>
      <html>
      <head>    
        <title>재고관리 사이트- ${title}</title>
        <meta charset="utf-8">
        <style>
          @import url(http://fonts.googleapis.com/earlyaccess/notosanskr.css);
  
          body {
              font-family: 'Noto Sans KR', sans-serif;
              background-color: #C5E1A5;
              margin: 50px;
  
          }
  
          .background {
              background-color: white;
              height: auto;
              width: 90%;
              max-width: 450px;
              padding: 10px;
              margin: 0 auto;
              border-radius: 5px;
              box-shadow: 0px 40px 30px -20px rgba(0, 0, 0, 0.3);
              text-align: center;
          }
  
          form {
              display: flex;
              padding: 30px;
              flex-direction: column;
          }
  
          .login {
              border: none;
              border-bottom: 2px solid #D1D1D4;
              background: none;
              padding: 10px;
              font-weight: 700;
              transition: .2s;
              width: 75%;
          }
          .login:active,
          .login:focus,
          .login:hover {
              outline: none;
              border-bottom-color: #7CB342;
          }
  
          .btn {            
              border: none;
              width: 75%;
              background-color: #7CB342;
              color: white;
              padding: 15px 0;
              font-weight: 600;
              border-radius: 5px;
              cursor: pointer;
              transition: .2s;
          }
          .btn:hover {
              background-color: #558B2F;
          }
      </style>
      </head>
      <body>
        <div class="background">
          ${authStatusUI}
          ${body}
        </div>
      </body>
      </html>
      `;
    }
}