var Board = React.createClass({
  render(){
    var tr = this.props.data.map((player,i)=>{
      return(
        <tr key={player.id}>
          <td>{i+1}</td>
          <td><img src={'http://graph.facebook.com/v2.6/'+player.fbid+'/picture'} alt={player.fbid} />{' '+player.first_name +' '+ player.last_name}</td>
          <td>{player.pointsTot}</td>
          <td>{player.gamesPlayed}</td>
          <td>{player.average.toFixed(2)}</td>
        </tr>
      )
    })
    return(
      <table className="gameList table table-striped">
        <thead>
          <tr>
            <th>Position</th>
            <th>Player</th>
            <th>Total Points</th>
            <th>Games Played</th>
            <th>Average Points</th>
          </tr>
        </thead>
        <tbody>
          {tr}
        </tbody>
      </table>
    )
  }
});

var Leaderboard = React.createClass({
  getInitialState(){
    return({data: []})
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
  render(){
    var players = this.state.data;

    return(
      <div>
        <h1>Leaderboard</h1>
        <Board data={players} />
      </div>
    )
  }
});

ReactDOM.render(
  <Leaderboard url="/api/score/leaderboard" />,
  document.getElementById('content')
);