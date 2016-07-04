var DateSelection = React.createClass({
  getInitialState(){
    return {
      maxDate: moment()
    }
  },
  handleEvent(e,picker){
    this.props.setDate(picker.startDate);
  },
  render(){
    var start = this.props.date.format('DD-MM-YYYY')
    return (
      <InputGroup>
        <DateRangePicker singleDatePicker={true} onEvent={this.handleEvent} startDate={this.props.date} maxDate={this.state.maxDate}>
          <Button>
            <Glyphicon glyph="calendar" />
            <span>{' '+start+' '}</span>
          </Button>
        </DateRangePicker>
      </InputGroup>
    )
  }
});

var GameTypeSelection = React.createClass({
  getInitialState(){
    return ({ gameTypes: [] });
  },
  componentDidMount(){
    this.loadGameTypesFromServer();
  },
  loadGameTypesFromServer(){
    $.ajax({
      type: "GET",
      url: '/api/gametype',
      dataType: 'json',
      cache: false,
      success: (data) => {
        this.setState({gameTypes: data});
        this.props.setGameTypeId(this.state.gameTypes[0].id);
      },
      error: (xhr, status, err) => {
        console.error(this.props.gameURL, status, err.toString());
      }
    });
  },
  handleGameTypeChange(e){
    this.props.setGameTypeId(e.target.value);
  },
  render(){
    var options = this.state.gameTypes.map((gameType)=>{
      return(
        <option key={gameType.id} value={gameType.id}>{gameType.gameType}</option>
      )
    });
    return (
      <FormGroup controlId="formControlsSelect">
        <ControlLabel>Select Game Type</ControlLabel>
        <FormControl componentClass="select" placeholder="Game Type" onChange={this.handleGameTypeChange}>
          {options}
        </FormControl>
      </FormGroup>
    )
  }
});

var AddGameAlert = React.createClass({
  render(){
    return(
      <Alert bsStyle="danger" onDismiss={this.props.handleAlertDismiss}>
        <p>{this.props.message}</p>
      </Alert>
    );
  }
});

var AddNewGame = React.createClass({
  getInitialState(){
    return { showModal: false, gameTypeId: '', isLoading: false, gameName: '', gameInfo: '', message: false };
  },
  close(){
    this.setState({showModal: false});
    this.handleAlertDismiss();
  },
  open(){
    this.setState({showModal: true});
  },
  setGameTypeId(gameTypeId){
    this.setState({ gameTypeId: gameTypeId });
  },
  handleGameNameChange(e){
    this.setState({ gameName: e.target.value })
  },
  handleGameInfoChange(e){
    this.setState({ gameInfo: e.target.value })
  },
  handleAlertDismiss(){
    this.setState({ message: false });
  },
  postNewGame(name, id, info, cb){
    var data = {gameName: name, gameTypeId: id, gameInfo: info};
    $.ajax({
      url: this.props.gameURL,
      dataType: 'JSON',
      type: 'POST',
      data: $.param(data),
      success: ()=>{
        cb();
      },
      error: (xhr,status,err)=>{
        cb(true)
        console.error(this.props.gameURL, status, err.toString());
      }
    })
  },
  handleSubmitGame(e){
    e.preventDefault();
    var gameName = this.state.gameName;
    var gameTypeId = this.state.gameTypeId;
    var gameInfo = this.state.gameInfo;
    this.handleAlertDismiss();
    this.setState({ isLoading: true });
    if (!gameName || !gameInfo){
      var message = "Please enter a Game Name and Info about the game."
      this.setState({isLoading: false, message: message});
      return
    }
    this.postNewGame(gameName, gameTypeId, gameInfo, (err)=>{
      if (err){

        this.setState({ isLoading: false });
      }
      this.props.loadGameListFromServer();
      this.setState({ isLoading: false });
      this.close();
    });
  },
  render(){
    var isLoading = this.state.isLoading;
    return(
      <InputGroup.Button>
        <Button bsStyle="primary" onClick={this.open}>Add New Game</Button>
        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              { this.state.message ? <AddGameAlert handleAlertDismiss={this.handleAlertDismiss} message={this.state.message} /> : null }
              <FormGroup>
                <ControlLabel>Game Name</ControlLabel>
                <FormControl type="text" placeholder="Game Name" onChange={this.handleGameNameChange} />
              </FormGroup>
              <GameTypeSelection setGameTypeId={this.setGameTypeId} />
              <FormGroup controlId="formControlsTextarea">
                <ControlLabel>Game Description</ControlLabel>
                <FormControl componentClass="textarea" placeholder="Description" onChange={this.handleGameInfoChange} />
              </FormGroup>
              <Button type="submit" psStyle="primary" disabled={isLoading} onClick={!isLoading ? this.handleSubmitGame : null}>
                {isLoading ? 'adding...' : 'Submit'}
              </Button>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.close}>Close</Button>
          </Modal.Footer>
        </Modal>
      </InputGroup.Button>
    )
  }
});

var GameSelection = React.createClass({
  getInitialState(){
    return ({games: [], gameid: ''});
  },
  componentDidMount() {
    this.loadGameListFromServer();
  },
  loadGameListFromServer(){
    $.ajax({
      type: "GET",
      url: this.props.gameURL,
      dataType: 'json',
      cache: false,
      success: (data) => {
        this.setState({games: data, gameid: data[0].id});
      },
      error: (xhr, status, err) => {
        console.error(this.props.gameURL, status, err.toString());
      }
    });
  },
  handleGameChange(e){
    this.setState({gameid: e.target.value})
  },
  render(){
    var gameOptions = this.state.games.map((game,i)=>{
      return (
        <option key={game.id} value={game.id}>{game.game_name}</option>
      )
    })
    return (
      <InputGroup>
        <select className="form-control" placeholder="Game Name" onChange={this.handleGameChange}>
          {gameOptions}
        </select>
        <AddNewGame loadGameListFromServer={this.loadGameListFromServer} gameURL={this.props.gameURL} />
      </InputGroup>
    )
  }
});

var AddPlayerScore = React.createClass({
  getInitialState(){
    return ({ score: ''})
  },
  handlePlayerChange(e){
    this.setPlayerId(e.target.value)
  },
  handleScoreChange(e){
    this.setState({score: e.target.value})
  },
  handleAddScore(e){
    e.preventDefault();
    var player = this.props.players[this.props.players.map((player)=>{ return player.id }).indexOf(parseInt(this.props.playerid))];
    var score = this.state.score.trim();
    if (!(this.isPlayerDisabled(player.id)) || !score) {
      return;
    }
    this.props.togglePlayerById(player.id);
    this.props.onPlayerScoreSubmit({player: player, score: score});
    var nextPlayerId = this.nextPlayer( this.props.players, player.id )
    if(nextPlayerId){
      this.setPlayerId(nextPlayerId);
    }
    this.setState({score: ''});
  },
  setPlayerId(playerid){
    this.props.setPlayerId(playerid);
  },
  isPlayerDisabled(playerId){
    return (this.props.playerDisabled.indexOf(playerId)<0)
  },
  nextPlayer(players, currentPlayerId){
    var currentPlayerId = parseInt(currentPlayerId);
    var nextPlayerId = currentPlayerId+1;
    var count = players.length;
    if( nextPlayerId > count ) {
        nextPlayerId = players[0].id;
    } 
    while(!(this.isPlayerDisabled(nextPlayerId))){
      if(nextPlayerId == currentPlayerId){
       return 1;
      }
      nextPlayerId++;
    }
    return nextPlayerId;
  },
  render(){
    var playerOptions = this.props.players.map((player,i)=>{
      return (
        <option disabled={Boolean(this.props.playerDisabled.indexOf(player.id)>=0)} key={i} value={player.id}>{player.first_name +' '+player.last_name}</option>
      )
    });
    return(
      <tr className="gameInput">
        <td><select className="form-control" value={this.props.playerid} onChange={this.handlePlayerChange}>{playerOptions}</select></td>
        <td><input className="form-control" type="number" autoFocus placeholder="Score..." value={this.state.score} onChange={this.handleScoreChange} /></td>
        <td><button className="form-control btn btn-default" type="submit" value="Add" onClick={this.handleAddScore}><Glyphicon glyph="plus" /></button></td>
      </tr>
    )
  }
});

var PlayerScore = React.createClass({
  render(){
    return (
        <tr>
          <td><img src={'http://graph.facebook.com/v2.6/'+this.props.player.fbid+'/picture'} alt={this.props.player.fbid} />{' '+this.props.player.first_name +' '+this.props.player.last_name}</td>
          <td>{this.props.score}</td>
          <td><button className="btn btn-danger btn-xs pull-right" type="button" value="Remove" onClick={this.props.onClick}><span className="glyphicon glyphicon-minus" aria-hidden="true"></span></button></td>
        </tr>
    )
  }
})

var ScoresList = React.createClass({
  getInitialState(){
    return ({players: [], playerid: 1});
  },
  componentDidMount() {
    $.ajax({
      type: "GET",
      url: this.props.playerURL,
      dataType: 'json',
      cache: false,
      success: (data) => {
        this.setState({players: data});
      },
      error: (xhr, status, err) => {
        console.error(this.props.playerURL, status, err.toString());
      }
    });
  },
  handlePlayerScoreSubmit(playerScore){
    var scores = this.props.scores;
    var newScores = scores.push(playerScore);
    this.props.setScores(scores);
  },
  handleRemoveScore(index,id){
    var scores = this.props.scores.filter((item, i)=>{
      return index !== i;
    });
    this.setPlayerId(id);
    this.props.togglePlayerById(id);
    this.props.setScores(scores);
  },
  setPlayerId(playerid){
    this.setState({playerid: playerid})
  },
  render(){
    var scoresRows = this.props.scores.map((score,i)=>{
      var boundClick = this.handleRemoveScore.bind(this,i,score.player.id);
      return (
        <PlayerScore player={score.player} score={score.score} key={i} onClick={boundClick} />
      )
    });
    if(this.props.playerDisabled.length == this.state.players.length){
      var addPlayerScore = null;
    }else{
      var addPlayerScore = <AddPlayerScore setPlayerId={this.setPlayerId} playerid={this.state.playerid} playerDisabled={this.props.playerDisabled} togglePlayerById={this.props.togglePlayerById} players={this.state.players} onPlayerScoreSubmit={this.handlePlayerScoreSubmit} />
    }
    return (
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Player Name</th>
            <th colSpan={2}>Player Score</th>
          </tr>
        </thead>
        <tbody>
          {scoresRows}
          {addPlayerScore}
        </tbody>
      </table>
    )
  }
});

var AddScoreBox = React.createClass({
  getInitialState(){
    return({ scores: [], disabled: [], date: moment() });
  },
  handleScoresChange(scores){
    this.setState({scores: scores});
  },
  togglePlayerById(id){
    var disabled = this.state.disabled;
    var index = disabled.indexOf(id);
    if (index != -1){
      disabled.splice(index, 1)
    } else {
      disabled.push(id)
    }
    this.setState({disabled: disabled});
  },
  postNewScores(scores, date, gameid, cb){
    var data = $.param({gameid: gameid, scores: scores, date: date.format('YYYY-MM-DD H:mm:ss')});
    $.ajax({
      url: this.props.scoreURL,
      type: 'POST',
      data: data,
      success(){
        cb();
      },
      error(xhr,status,err){
        cb(true)
        console.error(this.props.scoreURL, status, err.toString());
      }
    })
  },
  handleDateChange(date){
    this.setState({startDate: date});
  },
  handleScoreSubmit(e){
    var scores = this.state.scores;
    var gameid = this.refs.gameSelect.state.gameid;
    var date = this.state.date;
    if(!gameid || !(scores.length > 1)){
      return;
    }
    this.postNewScores(scores, date, gameid, ()=>{
      this.setState({scores: [], disabled: []});
    });
  },
  setDate(date){
    this.setState({date: date});
  },
  render(){
    return (
      <div className="ScoreBox">
        <h1>Add New Scores</h1>
        <Form horizontal>
          <FormGroup>
            <Col sm={2} componentClass={ControlLabel}>Date</Col>
            <Col sm={10}><DateSelection date={this.state.date} setDate={this.setDate} /></Col>
          </FormGroup>
          <FormGroup>
            <Col sm={2} componentClass={ControlLabel}>Game</Col>
            <Col sm={10}><GameSelection ref="gameSelect" gameURL={this.props.gameURL} /></Col>
          </FormGroup>
          <ScoresList ref="scoresList" playerDisabled={this.state.disabled} togglePlayerById={this.togglePlayerById} scores={this.state.scores} setScores={this.handleScoresChange} playerURL={this.props.playerURL} />
          <input className="pull-right btn btn-primary" type="button" value="Submit Scores" onClick={this.handleScoreSubmit} />
        </Form>
      </div>
    )
  }
});

ReactDOM.render(
  <AddScoreBox playerURL="/api/player" gameURL="/api/game" scoreURL="/api/score" />,
  document.getElementById('content')
);