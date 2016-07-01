var Player = React.createClass({
  render() {
    return (
      <tr className="player">
        <td><img src={'http://graph.facebook.com/v2.6/'+this.props.fbid+'/picture'} alt={this.props.name} /></td>
        <td><a href={'/player/' + this.props.name}>{this.props.name}</a></td>
        <td>{this.props.nickname}</td>
      </tr>
    );
  }
});


var PlayerList = React.createClass({
  render() {
    var playerNodes = this.props.data.map((player)=>{
      return (
        <Player name={player.first_name +' '+ player.last_name} fbid={player.fbid} key={player.id} nickname={player.nickname} />
      );
    });
    return (
      <table className="playerList table table-striped">
        <thead>
          <tr>
            <th>Picture</th>
            <th>Player</th>
            <th>Nickname</th>
          </tr>
        </thead>
        <tbody>
          {playerNodes}
        </tbody>
      </table>
    );
  }
});

var PlayerBox = React.createClass({
  getInitialState() {
    return {data: []};
  },
  componentDidMount() {
    $.ajax({
      type: "GET",
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: (data) => {
        this.setState({data: data});
      },
      error: (xhr, status, err) => {
        console.error(this.props.url, status, err.toString());
      }
    });
  },
  render() {
    return (
      <div className="playerBox">
        <h1>Players of the Games</h1>
        <PlayerList data={this.state.data} />
      </div>
    );
  }
});

ReactDOM.render(
  <PlayerBox url="/api/player/" />,
  document.getElementById('content')
);