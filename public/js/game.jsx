var GameRoot = React.createClass({
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
      <GameList data={this.state.data} />
    );
  }
});

var GameList = React.createClass({
  render() {
    var gameNodes = this.props.data.map((game)=>{
      return (
        <Game game={game.game_name} type={game.game_type} info={game.game_info} key={game.id} rounds={game.rounds}></Game>
      );
    });
    return (
      <div>
        {gameNodes}
      </div>
    );
  }
});

var Game = React.createClass({
  render() {
    return (
      <div>
        <h1>{this.props.game}</h1>
        <h2>{this.props.type} game</h2>
        <p>{this.props.info}</p>
        <RoundList rounds={this.props.rounds}></RoundList>
      </div>
    );
  }
});

var RoundList = React.createClass({
  render() {
    var roundNodes = this.props.rounds.map((round)=>{
      return (
        <Round key={round.id} date={Date.parse(round.date)} scores={round.scores}></Round>
      );
    });
    var maxScores = Math.max(...this.props.rounds.map((res)=>{
      return res.scores.length;
    }));

    return (
      <table className="table table-striped table-condensed">
        <thead>
          <tr>
            <th>Date</th>
            <th>First</th>
            <th>Second</th>
            <th>Third</th>
            <th colSpan={maxScores-3}>Runners Up</th>
          </tr>
        </thead>
        <tbody>
          {roundNodes}
        </tbody>
      </table>
    )
  }
});

var Round = React.createClass({
  render() {
    var scores = this.props.scores;
    return (
      <tr>
        <td style={{verticalAlign: 'middle'}} scope="row">{moment(this.props.date).format("DD-MM-YYYY")}</td>
        {
          scores.map((score)=>{
            return (
              <td key={score.id}><img src={'http://graph.facebook.com/v2.6/'+score.player.fbid+'/picture'}/><span style={{verticalAlign: 'middle', fontSize: '30px'}}> {score.score}</span></td>
            )
          })
        }
      </tr>
    );
  }
});


var game_name = document.getElementById('content').getAttribute("data-data");

ReactDOM.render(
  <GameRoot url={'/api/game/' + game_name} />,
  document.getElementById('content')
);