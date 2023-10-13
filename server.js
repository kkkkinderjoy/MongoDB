const express = require("express"); //require은 무엇을 불러오겠다는 뜻
const app = express() ; //2줄의 의미는 express를 세팅하기 위함
const dotenv = require('dotenv')

dotenv.config();

app.set('view engine', 'ejs');
 
const{MongoClient, ObjectId} = require('mongodb');
app.use(express.static(__dirname + '/public'))

let db;
let sample; //샘플의 변수를 설정해줌
const url =`mongodb+srv://${process.env.MONGODB_ID}:${process.env.MONGODB_PW}@cluster0.5lmfgcd.mongodb.net/`
new MongoClient(url).connect().then((client)=>{
    db = client.db("board");
    sample = client.db("sample_training");
    console.log("DB 연결 완료!")  
    app.listen(process.env.SERVER_PORT, ()=>{ //데이터베이스에 연결이 되면 완전하게 서버를 열겠다는 의미임
        console.log(`${process.env.SERVER_PORT}번호에서 서버 실행 중`);
    }) //서버를 여는 방법
    //데이터베이스를 읽고 서버를 열어야 하기 때문에 위에 코드를 여기에 넣음
}).catch((error)=>{
    console.log(error)
})



app.get("/",(req,res)=>{ //get에서는 2개의 파라미터를 받음 (request,response)
    // res.send("Hello World");// 결과값을 보낸다라는 뜻
    res.sendFile(__dirname + '/page/index.html')
})

app.get("/about",(req,res)=>{ 
    // res.send("어바웃 페이지"); //리엑트에서 라우트 
    res.sendFile(__dirname + '/page/about.html')
    // db.collection("notice").insertOne({
    //     title: "1번째 글",
    //     content:"1번째 글"
    // })
})

app.get("/view/:id",async(req,res)=>{
    const result = await db.collection("notice").findOne({
        _id: new ObjectId(req.params.id) //내가 찾는 id는 오브젝트 id 찾는걸  받는다
    }) 
    console.log(result);
    res.render("view.ejs",{ 
        data : result //전체 데이터를 가져와서 보내주기 위해서 array로 담아서 object 형태로 보내줌
    }); 
})

// 1. Uniform Interface :  여러 URL과 METHOD는 일관성이 있어야 하며, 하나의 URL에서는 하나의 데이터만 디자인하며, 간결하고 예측 가능한 URL과 METHOD를 만들어야 한다.
// 동사보다는 명사위주
// 띄어쓰기는 언더바 대신 대시 기호
// 파일 확장자는 사용금지
// 하위 문서를 뜻할 떈 / 기호를 사용
// 2. 클라이언트와 서버역할 구분
// 유저에게 서버 역할을 맡기거나 직접 입출력을 시키면 안된다.
// 3. stateless
// 요청들은 서로 의존성이 있으면 안되고 , 각각 독립적으로 처리되어야 한다
// 4. Cacheable
// 서버가 보내는 자료는 캐싱이 가능해야 한다 - 대부분 컴퓨터가 동작
// 5.Layered System
// 서버 기능을 만들 때 레이어를 걸쳐서 코드가 실행되어야 한다
// 6. Code on Demeand
// 서버는 실행 가능한 코드를 보낼 수 있다


app.get("/home",(req,res)=>{ 
    res.send("잠와..."); //리엑트에서 라우트 
})



app.get("/list", async(req,res)=>{ 
    //ejs 파일 javascript template라서 컴파일,렌더링 해줘야함 
    const result = await db.collection("notice").find().toArray() 
    //전체문서를 가져오는 방법 ? find(), 하나의 문서를 가져오는 방법 ? findOne() (파이어베이스는 getDocs/getDoc) 
    //await ? 데이터를 다 가져올때꺄지 기다렸다가 아래 코드를 실행하세요
    console.log(result[0]); //데이터가 나오지 않을때는 async await 를 하기(공식문서에 무조건 쓰라고 나와있음)
    res.render("list.ejs",{ 
        data : result //전체 데이터를 가져와서 보내주기 위해서 array로 담아서 object 형태로 보내줌
    }); //props로 데이터를 보냄


})




