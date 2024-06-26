/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditNoteIcon from '@mui/icons-material/EditNote';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';

function Note(props) {
  function handleDelete(){
    props.deleteItem(props.id);
  }
  function handleEdit(){
    props.handleEdits({id : props.id, title : props.title , content : props.content})
  }
  return (
    <div className="note">
      <h1>{props.title}</h1>
      <p>{props.content}</p>
      
      <IconButton aria-label="delete" onClick={handleDelete} size="small">
        <DeleteIcon fontSize="small" />
      </IconButton>
      <IconButton aria-label="Edit" onClick={handleEdit} size="small">
        <EditNoteIcon fontSize="small" />
      </IconButton>
    </div>
  );
}

export default Note;
