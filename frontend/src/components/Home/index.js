import React, { Component } from 'react';
import styles from '../../styles/Home.module.css';
import Flexbox from 'flexbox-react';
import Progress from './Progress';
// import BarChart from './BarChart';
import ReactChartkick, { PieChart } from 'react-chartkick'
import Chart from 'chart.js'



import TimeRange from './TimeRange';
import ImpactStatement from './ImpactStatement';

ReactChartkick.addAdapter(Chart)

class Home extends Component {
  constructor() {
    super();
    this.state = {
      emissions: 0,
      cost: 0,
      offset: 0,
      breakdown: null,
      timeRange: 30
    };
    this.getBreakdown = this.getBreakdown.bind(this);
  }
  getBreakdown(timeRange) {
    window
      .fetch('/breakdown/' + timeRange.toString())
      .then(response => response.json())
      .then(data => {
        const emissions = data['emission'];
        console.log("emissions", emissions)
        const cost = data['cost'];
        console.log("cost", cost)
        const offset = data['offset'];
        console.log("offset", offset)
        const breakdown = data['breakdown'];
        this.setState({ emissions, cost, offset, breakdown, timeRange });
      });
  }
  componentDidMount() {
    this.getBreakdown(this.state.timeRange);
  }
  render() {
    var data = {
      _id: 'Emisssions',
      children: this.state.breakdown
        ? Object.keys(this.state.breakdown).map(category => {
            return {
              _id: category, // unique id (required)
              value: this.state.breakdown[category]['emissions'], // used to determine relative size of bubbles (required)
              colorValue: 0x67000d, // used to determine color
              selected: false // if true will use selectedColor/selectedTextColor for circle/text
            };
          })
        : []
    };

    return (
      <div>
        <div className={styles.timeRange}>
          <TimeRange getBreakdown={this.getBreakdown} />
        </div>

        <div>
          <Progress emissions={this.state.emissions} offset={this.state.offset} />
        </div>
        <Flexbox minHeight="100vh" justifyContent="space-around">
          <Flexbox element="header" height="60px">
            {/*              <PieChart/>
             */}{' '}
            {/*<BarChart data={[5,10,1,3,6,7,8, 1100]} size={[500,500]} /> */}
            {/* <BarChart
              data={
                this.state.breakdown
                  ? Object.keys(this.state.breakdown).map(category => {
                      return {
                        type: category,
                        amount: this.state.breakdown[category]['emissions']
                      };
                    })
                  : []
              }
              size={[500, 500]}
            /> */}
            {/* <PieChart
  data={[
    { title: 'One', value: 10, color: '#E38627' },
    { title: 'Two', value: 15, color: '#C13C37' },
    { title: 'Three', value: 20, color: '#6A2135' },
  ]}
/>; */}
          {/* <PieChart/> */}
          <PieChart data={[["Blueberry", 44], ["Strawberry", 23]]} />

          </Flexbox>
          <Flexbox>
            <ImpactStatement
              emissions={this.state.emissions}
              offset={this.state.offset}
              timeRange={this.state.timeRange}
            />
          </Flexbox>
        </Flexbox>
      </div>
    );
  }
}

export default Home;
