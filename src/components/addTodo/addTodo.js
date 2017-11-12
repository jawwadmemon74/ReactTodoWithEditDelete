import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';





class AddTodo extends Component {
    constructor(props){
        super(props);
        
        this.state = {
            newTodoContent: ''
        };
        this.handleUserInput = this.handleUserInput.bind(this);
        this.writeTodo = this.writeTodo.bind(this);
    }
    handleUserInput(e){
        this.setState ({
            newTodoContent: e.target.value,
         })
     }
     writeTodo() {
         if(this.state.newTodoContent !== ''){
            this.props.addTodo(this.state.newTodoContent);
        } else {
            alert('You are submitting an empty Todo!')
        }
         this.setState ({
            newTodoContent: '',
         })
     }
    render() { 
        return(
            <div className="inputs-btns">
                <TextField floatingLabelText="Write text here..." onChange={this.handleUserInput} value={this.state.newTodoContent} />
                <RaisedButton label="Add Todo" primary={true} onClick={this.writeTodo} />
            </div>
        );
    }
}

export default AddTodo;