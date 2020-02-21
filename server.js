const express = require('express')
const server = express()


//configurar o servidor para apresentar arquivos extras
//configurando com o servidor com um middleware
server.use(express.static('public'))
server.use(express.urlencoded({extend: true}))


//configurar conexao com banco de dados -POSTGRESQL 
const Pool = require('pg').Pool //tipo de conexao que irá se manter ativa
const db = new Pool({
    user: 'postgres',
    password: '',
    host: 'localhost',
    port: 5432,
    database:'doe'
})


//configurando a template engine
const nunjucks = require('nunjucks')
nunjucks.configure('./', {
    express: server,
    noCache: true,
})


/*
const donors = [
    {
        name: "Bruna Leão",
        blood: "O+"
    },
    {
        name: "Ana Julia",
        blood: "AB-"
    },
    {
        name: "Ana Maria",
        blood: "O-"
    },
    {
        name: "Ana Telles",
        blood: "B+"
    },
    {
        name: "Ana Christina",
        blood: "A+"
    },
    {
        name: "Ana Thereza",
        blood: "A-"
    },
] */


server.get("/", function(req, res){

    const donors =[]

    db.query('SELECT * FROM donors', function(err, result){
       if(err) return res.send("erro de banco de dados")


       const donors = result.rows
       return res.render("index.html", {donors})

    })
 
})

server.post("/", function(req, res){
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood
    if(name == "" || email == "" || blood == ""){
        res.send("Todos os campos são obrigatórios!")
    }

   // donors.push({name: name, blood: blood})
    const query = `INSERT INTO donors("name", "email", "blood") VALUES($1, $2, $3)`
    const values =[name, email, blood]
    db.query(query, values, function(err){

        //em caso de erro
        if(err) return res.send("Erro no banco de dados")

        //em caso de acerto
        return res.redirect("/")
    } )

    
})



server.listen(3000, function(){
    console.log("iniciei o servidor")
})