import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import bcrypt from "bcrypt";
import env from "dotenv";
import cors from 'cors';
import jwt from 'jsonwebtoken'

const app = express();
const PORT = 8000;
app.use(cors());
const saltRounds = 10;
env.config();

// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: true,
//   })
// );
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const pool = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
pool.connect();

// getting notes.. 


app.get("/notes/:id",async (req,res)=>{
  const user_id = req.params.id;
        try {
                const notes = await pool.query("Select * FROM notes WHERE user_id = $1",[user_id]);
                res.json(notes.rows);
        }
        catch (err){
                console.log(err);
                res.status(500).send("Oops, something went wrong");
        }
})


app.post("/newNote/:user_id",async (req,res)=>{
        const {user_id}= req.params;
        const {title,content} = req.body;
        console.log(req.body);
        try{
                const note = await pool.query("INSERT INTO notes (title,content,user_id) VALUES ($1 , $2, $3) RETURNING *",[title,content,user_id]);
                res.json(note.rows[0])
        } 

        catch (err){
                console.log(err);
                res.sendStatus(500).send("Oops, something went wrong");
        }
})

app.patch("/note/:id",async (req,res)=>{
        const {id} = req.params;
        const {title , content} = req.body;
        try {
                const prev = (await pool.query("Select title,content FROM notes WHERE id = $1",[id])).rows[0];
                try {
                        const updatedNote = (await pool.query("UPDATE notes SET title = $1, content = $2 WHERE id = $3 RETURNING title,content",[(title ? title : prev.title ),(content ? content : prev.content),id])).rows[0];
                        res.json(updatedNote);
                } catch (error) {
                        console.log(error)
                }      
        } catch (error) {
                console.log(error)
        }      
})

app.delete("/note/:id", async (req,res)=>{
        const {id} = req.params;
        // console.log(id);
        try{
                const query = await pool.query("DELETE FROM notes WHERE id = $1 ", [id]);
                res.sendStatus(200);
        }
        catch(error){
                console.log(error);
        }
})

// Auth 

// login

app.post('/login', async(req,res)=>{
  const {email,password} = req.body;
//   const hashedPassword = bcrypt.hashSync(password,saltRounds);
  try {
          const user = await pool.query(`SELECT * FROM users WHERE email = $1`,[email]);
          if (!user.rows.length){
                return res.json({detail : 'User does not exist!'});
        }
        //   console.log(user.rows[0]);
        //   console.log(hashedPassword === user.rows[0].password);
          const success = await bcrypt.compare(password,user.rows[0].password);
          const authToken = jwt.sign({email},'secret',{expiresIn : '1 hr'});
          const id = await user.rows[0].id;
          const username = "Back "+ await user.rows[0].username;
        //   console.log(user.rows);
        //   console.log(id);
          if(success){
                  res.json({ email : email , authToken : authToken, id : id, username : username})
          }
          else{
                  res.json({detail : 'Password is Incorrect'});
          }
  } catch (error) {
          console.log(error);
  }
})

// signup

app.post('/signup', async(req,res)=>{
  const {email,password,username} = req.body;
//   console.log(req.body);
//   console.log(`Email: ${email} & Password: ${password}`);
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(password,salt);
  try {
         const response = await pool.query(`INSERT INTO users (email,password,username) VALUES ($1,$2,$3) RETURNING *`,[email,hashedPassword,username]);
         const authToken = jwt.sign({email},'secret',{expiresIn : '1 hr'});
         const id = await response.rows[0].id;
         console.log(response.rows);
         console.log(id);
         const usernam = await response.rows[0].username;
         res.json({email,authToken,id,username : usernam});
  } catch (error) {
          console.log(error);
          if (error){
                  res.json({detail : error.detail})
          }
  }
  
})


console.log(app.listen(PORT,()=> `Server running on Port ${PORT}`))