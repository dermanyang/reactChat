import React from 'react';
// import socket from 'socket';
var dummyData = [
  {username: "Sean",
  content: "Hey!"},

  {username: "Tim",
  content: 'Fag.'}];


class ChatRoom extends React.Component{
  //constructor
  constructor(props){
    super(props);
    this.state= {
      message: '',
      messages: dummyData,

    }
}
  //on creation
  componentDidMount() {
    this.props.socket.on('message', message => {
      var arr = this.state.messages.slice();
      arr.push(`${message.username}: ${message.content}`);
      //test to see if we recieved
      alert(newMessage);
      this.setState({
        messages: arr
      })
    })
  }

componentWillReceiveProps(nextProps) {
  if (nextProps.roomName !== this.props.roomName){
    this.setState({
      messages : []
    })
  }
}

handleChange(e){
  this.setState({
    message: e.target.value
  })
}

handleSubmit(e){
  console.log(this.state.message);
  e.preventDefault();
  this.props.socket.emit('message', this.state.message)
  let newMsg = {
    "username": this.props.username,
    "content": this.state.message
  };
  let curArr = this.state.messages.slice();
  curArr.push(newMsg);
  this.setState({
    message: '',
    messages: curArr
  });

}

  render(){
    return(
        <div>
          {this.state.messages.map((msg, index) => <div key={index}>{msg.username + ': ' + msg.content}</div>)}
          <form onSubmit={(e)=>this.handleSubmit(e)}> <input type='text' value={this.state.message}
            onChange={(e)=>this.handleChange(e)}></input>
            <button> Send it </button></form>
        </div>
    )
  }
}


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: io(),
      roomName: 'No room selected!',
      username: ''
      // YOUR CODE HERE (1)
    };
  }

  componentDidMount() {
    this.setState = this.setState.bind(this)
    // WebSockets Receiving Event Handlers
    this.state.socket.on('connect', () => {
      console.log('connected');
      let username = prompt('What is your username?')
      this.setState({
          username: username
      })
      this.state.socket.emit('username', username)
      console.log(this.state.username);
      // YOUR CODE HERE (2)
    });

    this.state.socket.on('errorMessage', message => {
      alert(message);
      // YOUR CODE HERE (3)
    });
  }

  join(room) {
    // room is called with "Party Place"
    this.setState({
      roomName: room,
    })
    this.state.socket.emit('room', room)
    console.log("joining room ", this.state)
  }

  render() {
    return (
      <div>
        <h1>React Chat</h1>
        <button className="btn btn-default" onClick={() => this.join("Party Place")}>
          Join the Party Place
        </button>
        <ChatRoom socket={this.state.socket} roomName={this.state.roomName} username={this.state.username}/>
      </div>
    );
  }
}

export default App;
