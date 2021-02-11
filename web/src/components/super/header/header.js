import React from 'react';
import style from './header.module.css';
import { Menu } from 'antd';
import {
  RollbackOutlined,
  HomeOutlined,
  DatabaseOutlined,
} from '@ant-design/icons';
const { SubMenu } = Menu;


class Header extends React.Component{

	constructor(props){
		super(props);

		this.state = {
			current: 'tasks',
			showUserMenu: false,
			showDownloadMenu: false,
			showGlobalMenu: false,
            showHelpMenu:false,
			enterdownload:false,
			collapsed: true,
			prevScrollpos: window.pageYOffset,
			//新的临时变量，用于检测屏幕滑动
			visible: true,
		}
	}

	handleClick = e => {
		// console.log('click ', e);
		this.props.menuClick(e.key);
	};

	componentWillReceiveProps(nextProps){
		//   console.log(nextProps.menu);
		this.setState({
			current:nextProps.menu
		})
	}
	
	render(){
		return (
			<div>
				<Menu className = {style.headerContainer}
					onClick={this.handleClick} selectedKeys={[this.state.current]} mode="horizontal" >
					<Menu.Item key="tasks" className = {style.menu_item}>
					<HomeOutlined style={{fontSize:'18px'}}/>
						Pathway Reviewer
					</Menu.Item>
					<Menu.Item key="tasks" icon = {<DatabaseOutlined />} style={{marginLeft:'47%'}}>
						Tasks
					</Menu.Item>
					<Menu.Item key="review" icon = {<RollbackOutlined />}>
						Review
					</Menu.Item>
			</Menu>
			</div>	
		)
	}
}


export default Header