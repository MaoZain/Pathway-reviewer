import React from 'react';
import style from './tasks.module.css';
import $ from 'jquery';
import {Select, Table, Popconfirm} from 'antd';

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
					status:this.state.figureStatus[index],
				}
			)
		})
		return (
		<div id='main' className={style.main}>
			<p className={style.hint}>Select your data:</p>
			<div id='selecter' className={style.selecter}>
				<Select defaultValue="Genecard"  onChange={this.handleChange}>
					<Option value="Genecard">example1</Option>
					<Option value="Swiss">example2</Option>
				</Select>
			</div>
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