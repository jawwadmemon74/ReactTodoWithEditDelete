import React, { Component } from 'react';
import Checkbox from 'material-ui/Checkbox';
import AddTodo from '../../components/addTodo/addTodo';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
// import update from 'immutability-helper';
import {db_config} from '../../fire'
import firebase from 'firebase';

const styles = {
    block: {
      maxWidth: 250,
    },
    checkbox: {
      marginBottom: 16,
    },
  };

class ShowTodo extends Component {
    constructor(props){
        super(props);
        this.addTodo = this.addTodo.bind(this);
        this.removeTodo = this.removeTodo.bind(this);
        this.editTodo = this.editTodo.bind(this);
        this.showEditBar = this.showEditBar.bind(this);
        this.handleNewTodoInput = this.handleNewTodoInput.bind(this);
        this.app = firebase.initializeApp(db_config);
        this.database = this.app.database().ref().child('notes');
        this.handlerRemoveItem = this.handlerRemoveItem.bind(this);
        this.noteid = props.noteid;
        
        
        this.state = {
            notes : [],
            showEditInput: false,
            clickedTodo: '',
            updatedTodoValue: ''
        }
    }

    handlerRemoveItem(id){
        // console.log('removeTodo'+ noteId)
        this.removeTodo(id);
    }
    handlerEditItem(newNote, id){
        // console.log('removeTodo'+ noteId)
        this.editTodo(newNote, id);
        this.setState({showEditInput: false, clickedTodo: id})
    }
    handleNewTodoInput(e) {
        
        this.setState({
            updatedTodoValue : e.target.value,
        });
    }
    componentWillMount(){
        const oldTodos = this.state.notes;
        // const update = require('immutability-helper');

        this.database.on('child_added', snap => {
            oldTodos.push({
                id: snap.key,
                todoContent: snap.val().todoContent,
            })
            this.setState({
                notes: oldTodos
            }); 
        });

        this.database.on('child_removed', snap => {
            setTimeout(() => {
            for(var i=0; i<oldTodos.length; i++){
                if(oldTodos[i].id === snap.key){
                    oldTodos.splice(i,1)
                }
            }
            this.setState({
                notes: oldTodos,
                
            });
        }, 500)

        
            
        });
        

    }
    componentDidMount() {
        const oldTodos = this.state.notes;
        this.database.on('child_changed', snap => {
            for(var i=0; i<oldTodos.length; i++){
                if(oldTodos[i].id === snap.key){
                    oldTodos[i].todoContent = snap.val().todoContent; //new value
                     break;
                }
            }
            this.setState({
                notes:oldTodos,
                updatedTodoValue: ''
            });
            
        });
    }
    addTodo(note) {
        this.database.push().set({todoContent:note})
    }

    removeTodo(noteId){
        console.log('removeTodo'+ noteId)
        this.database.child(noteId).remove();
    }
    editTodo(note, noteId){
        console.log('editTodo'+ noteId)
        this.database.child(noteId).update({
            todoContent: note,
        });
        
    }
    showEditBar(key){
       this.setState({showEditInput: true,clickedTodo: key })
    }

    render() {
        return(
        
            <div className="mainTodoList">
                {
                    this.state.notes.map((note) => {
                        return(
                            <div className="todoSingle" key={note.id} noteid={note.id}>
                                <span className="todoItem" onClick={() => this.handlerRemoveItem(note.id)} >
                                    <Checkbox label={note.todoContent}  style={styles.checkbox} /> 
                                </span>
                                <div className="todoEdit" onClick={this.addActiveClass}>
                                   
                                {this.state.showEditInput && this.state.clickedTodo === note.id ?
                                    <div className="todoEditInner">
                                        <TextField hintText="New Text" onChange={this.handleNewTodoInput} value={this.state.updatedTodoValue}/>
                                        <RaisedButton onClick={()=> this.handlerEditItem(this.state.updatedTodoValue, note.id)} label="Update"  />
                                    </div>  : 
                                    <RaisedButton className="todoEditButton" onClick={() => this.showEditBar(note.id)} label="Edit"  />
                                }
                                </div>
                            </div>
                        )
                    })
                }   
                <br />  
                <div className="AddBar">
                    <AddTodo addTodo={this.addTodo} />  
                </div>
               
            </div>
        );
    }
}

export default ShowTodo