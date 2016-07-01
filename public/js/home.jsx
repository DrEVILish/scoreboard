var Chart = React.createClass({
  componentDidMount(){
    
  },
  render(){
    var lines = []
    var scatter = []
    var area = []
    this.props.data.map((player,i)=>{
      var playerData = player.scores.map((arr)=>{
        return {date: moment(arr.date), point: arr.point, average: arr.average}
      });
      var colour =  360 * (i/this.props.data.length);
      lines[i] = <VictoryLine interpolation="cardinal" key={player.id} data={playerData} x={"date"} y={"average"} style={{ data: {stroke: 'hsla('+colour+',100%,50%,0.5)', strokeWidth: 3} }} />
      scatter[i] = <VictoryScatter key={player.id} data={playerData} x={"date"} y={"average"} symbol={(data)=> data.point > data.average ? "triangleUp":"triangleDown"} size={(data)=> Math.abs(data.point - data.average)*0.5} style={{ data: {stroke: 'hsla('+colour+',100%,50%,0.5)', strokeWidth: 3} }} />
      area[i] = <VictoryArea interpolation="cardinal" key={player.id} data={playerData} x={"date"} y={"average"} style={{ data: {fill: 'hsla('+colour+',100%,50%,0.1)'} }} />
    });
    return(
      <VictoryChart>
        <VictoryAxis dependentAxis style={{ grid: { stroke: "grey", strokeWidth: 1 }, axis: {stroke: "transparent"}, ticks: {stroke: "transparent"} }} />
        <VictoryAxis label="Date" tickFormat={(x)=> moment(x).format("D MMM")} />
        <VictoryLabel x={25} y={40} verticalAnchor="end" lineHeight={1.2}>
          {"Average points"}
        </VictoryLabel>
        {area}
        {lines}
        {scatter}
      </VictoryChart>
    )
  }
})


var HomePage = React.createClass({
  getInitialState(){
    return({ data: [] });
  },
  loadScoresFromServer(){
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
  componentDidMount() {
    this.loadScoresFromServer()
  },
  render(){
    return(
      <div>
        <h1>The Scoreboard</h1>
        <Chart data={this.state.data}/>
        <p>Numbler of players {this.state.data.length}</p>
      </div>
    )
  }
});


ReactDOM.render(
  <HomePage url="/api/score/recent" />,
  document.getElementById('content')
);