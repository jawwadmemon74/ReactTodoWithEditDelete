import React, { Component } from 'react';
// import logo from './logo.svg';
// import './App.css';
import ShowTodo from './components/showTodo/showTodo';
import AppBar from 'material-ui/AppBar';

const styles = {
  todoContainer: {
    maxWidth: 760,
    margin: 'auto'
  }
}

class App extends Component {
  render() {
    return (
      <div style={styles.todoContainer}>
          <AppBar
            title="Simple React TodoList"
            iconStyleLeft={{display: 'none'}} titleStyle={{textAlign: 'center'}}
          />
          <ShowTodo removeTodo={this.props.removeTodo}/>
      </div>
    );
  }
}

export default App;
