var Game = React.createClass({
  render() {
    return (
      <tr className="game">
        <td className="gameName"><a href={'/score/game/' + this.props.game}>{this.props.game}</a></td>
        <td>{this.props.type}</td>
        <td>{this.props.info}</td>
      </tr>
    );
  }
});


var GameList = React.createClass({
  render() {
    var gameNodes = this.props.data.map((game)=>{
      return (
        <Game game={game.game_name} type={game.game_type} info={game.game_info} key={game.id}></Game>
      );
    });
    return (
      <table className="gameList table table-striped">
        <thead>
          <tr>
            <th>Game</th>
            <th>Type</th>
            <th>Information</th>
          </tr>
        </thead>
        <tbody>
          {gameNodes}
        </tbody>
      </table>
    );
  }
});

var GameBox = React.createClass({
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
      <div className="gameBox">
        <h1>Games</h1>
        <GameList data={this.state.data} />
      </div>
    );
  }
});

ReactDOM.render(
  <GameBox url="/api/game/" />,
  document.getElementById('content')
);