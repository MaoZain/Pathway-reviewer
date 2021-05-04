import React from 'react';
import style from './tasks.module.css';
import $ from 'jquery';
import {Select, Table, Popconfirm, Input, Button} from 'antd';

const { Option } = Select;

class Tasks extends React.PureComponent{
	constructor(props){
		super(props);
		this.state = {
			img: null,
			figureName:props.figureName,
			figureStatus:props.figureStatus,
			geneName:[],
			geneTop:[],
			geneLeft:[],
			geneWidth:[],
			geneHeight:[],
			fig_id:props.fig_id,
			figId:props.figId,
		}
		this.columns = [
			{
				title: 'ID',
				dataIndex: 'id',
				key: 'id',
				width: '8%',
			},
			{
				title:'Name',
				dataIndex:'name',
				key:'name',
			},
			{
				title:'Status',
				dataIndex:'status',
				key:'status',
				sorter: {
					compare: (a, b) => a.chinese - b.chinese,
					multiple: 3,
				  },
			},
			{
				title:'Review',
				key:'review',
				render: (text, record) => {
					return <span >
						<a className={style.review} href="javascript:;" onClick={()=>{this.review(record, this.state.figId)}}>review</a>
					</span>
				}
			}
		]
	}

	componentWillReceiveProps = (nextProps) => {
		this.setState({
			fig_id:nextProps.fig_id,
			figureName:nextProps.figureName,
			figureStatus:nextProps.figureStatus,
			figId:nextProps.figId,
		})
	}

	review(record){
		// console.log(record);
		this.props.review(record);
	}

	handleChange = (value) => {
		this.props.selectTasksByStatu(value);
	}

	selectFiguresByName = (value) => {
		// console.log(e.target.value);
		this.props.selectName(value)
	}

	selectDataset = (value) => {
		this.props.selectDataset(value);
	}

	selectTasks = () => {
		this.props.selectTasks()
	}

	// componentWillMount = ()  => {
	// 	$.ajax(
	// 		{
	// 			type:'post',
	// 			url:'/loadData',
	// 			success:data => {
	// 				let name = [], status = [],ID = [];
	// 				data.map((value) => {
	// 					ID.push(value.fig_id)
	// 					name.push(value.fig_name);
	// 					status.push(value.review_status)
	// 				})
	// 				this.setState({
	// 					fig_id:ID,
	// 					figureName:name,
	// 					figureStatus:status,
	// 					figId:data[0].fig_id,
	// 				})
	// 			}
	// 		}
	// 	)
	// }

	// shouldComponentUpdate = ( nextProps,props ) =>{
	// 	$.ajax(
	// 		{
	// 			type:'post',
	// 			url:'/loadData',
	// 			success:data => {
	// 				let name = [], status = [],ID = [];
	// 				data.map((value) => {
	// 					ID.push(value.fig_id)
	// 					name.push(value.fig_name);
	// 					status.push(value.review_status)
	// 				})
	// 				this.setState({
	// 					fig_id:ID,
	// 					figureName:name,
	// 					figureStatus:status,
	// 					figId:data[0].fig_id,
	// 				})
	// 			}
	// 		}
	// 	)
	// 	return true
	// }

	render(){
		let tableData = [];
		this.state.figureName.map((value,index) => {
			tableData.push(
				{
					id:this.state.fig_id[index],
					name:value,
					status:this.state.figureStatus[index] == 0 ? "unreviewed":"reviewed",
				}
			)
		})
		return (
		<div id='main' className={style.main}>
			
			<div id='selecter' className={style.selecter}>
			<p className={style.hint}>Choose the Dataset:</p>
				<Select style={{ width: 120 }} onChange={this.selectDataset}>
					<Option value="lung">Lung Cancer</Option>
					<Option value="pathway1">pathway1</Option>
				</Select>
			</div>
			
			<div id='selecter' className={style.selecter}>
			<p className={style.hint}>Choose your name:</p>
				<Select style={{ width: 120 }} onChange={this.selectFiguresByName}>
					<Option value="mark">Mark</Option>
					<Option value="mihail">Mihail</Option>
					<Option value="dana">Dana</Option>
				</Select>
			</div>
			<Button type="primary" 
			style={{marginLeft:'30px'}}
			onClick = {this.selectTasks} >Select</Button>
			{/* <p className={style.hint}>Select your data:</p>
			<div id='selecter' className={style.selecter}>
				<Select defaultValue="0"  onChange={this.handleChange}>
					<Option value="1">reviewed</Option>
					<Option value="0">unreviewed</Option>
				</Select>
			</div> */}
			<div id = 'data' className = {style.table}>
			    <Table 
					columns={this.columns} 
					dataSource={tableData} 
					bordered
				/>
			</div>
			
		</div>	
	    )
	}
}


export default Tasks;