/* eslint-disable no-unused-vars */
import '../index.css';
import React, { useEffect,useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";
import EditArea from "./EditArea";
// import Svgs from "./Svgs";
import { useCookies } from "react-cookie";

function Main() {
  const [cookie,setCookie,removeCookie] = useCookies(null);
  const authToken = cookie.AuthToken;
  const id = cookie.User;
  const email = cookie.Email;
  
  
  const [EditNote, setEditNote] = useState({ id : "", title: "", content: "" });
  const [editMode , setEditMode] = useState(false);

  const [notes, setNotes] = useState([]);

  function addItem(note) {
    // console.log(note);
    // console.log("clicked");
    setNotes((prev) => [...prev, note]);
    // console.log(items);
  }

  async function deleteItem(id){
    try{
      const response = await fetch(`http://localhost:8000/note/${id}`,{method: "Delete",
    });
      // const jsonData = await response.json();
      console.log("...");
      getNotes()
      //setNotes(await jsonData);
    }
    catch(err){
      console.log(err);
    }

  }

  const  getNotes = async () =>{
    try {
      const response = await fetch(`http://localhost:8000/notes/${id}`);
      const jsonData = await response.json();
      console.log("...");
      setNotes(await jsonData);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {authToken && getNotes()},[])

  function deleteNotes(id) {
    setNotes((prev) =>

      prev.filter((item, index) => {
        return id !== index;
      })
    );
  }

  function changeMode(){
    setEditMode((prev)=> !prev);
    setEditNote({ id : "", title: "", content: "" });
    getNotes()

  }

  function handleEdits(note){
    setEditNote(note);
    setEditMode((prev)=> !prev);
  }

  return (
    <div>
      {editMode ? <EditArea changeMode = {changeMode} note = {EditNote} />: <CreateArea addItem={addItem} user = {id} />}
      <div className="notes-container">
      {notes.map((item, index) => {
        return (
          <Note
            handleEdits = {handleEdits}
            deleteItem={deleteItem}
            key={index}
            id={item.id}
            title={item.title}
            content={item.content}
          />
        );
      })}
      </div>
      <br />
      <br />
      
      <Footer/>
      
    </div>
  );
}

export default Main;
