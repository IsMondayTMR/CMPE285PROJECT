import React from "react"
import styles from "../css/signin.module.css"

import Chart from '../Charts/Chart';
import { getData } from "../Charts/utils"

import { TypeChooser } from "react-stockcharts/lib/helper";

class ChartComponent extends React.Component {
	componentDidMount() {
		getData().then(data => {
			this.setState({ data })
		})
	}
	render() {
		if (this.state == null) {
			return <div>Loading...</div>
		}
		return (
      
			<TypeChooser>
				{type => <Chart type={type} data={this.state.data} />}
			</TypeChooser>
		)
	}
}

function HomePage() {
    return(
       <>
        <div className = "Chart">
            <div className = "Page">
                <div className = "ChartTitle"> Market Overview Widget</div>
                <ChartComponent className = "Chart" />
            </div>
            
        </div>
       </>

    )
}

export default HomePage