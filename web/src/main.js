import React, { Component } from 'react';
import $ from 'jquery';
import Headers from './components/super/header/header';
import Tasks from './components/super/tasks/tasks'
import Edit from './components/super/edit/edit';
import './main.module.css';
import style from './main.module.css';
import { BackTop, Empty, message } from 'antd';

class Main extends Component {
	constructor(props){
		super(props);
		this.state = {
      showOutput:false,
      showEdit:false,
      showEmpty:true,
      geneName:[],//gene info
      geneId:[],
      editData:[],
      genePosition:[],
      aliasGeneId:[],//alias's dict_id in database
      isMatch:[],
      imgUrlTop:[],//gene's position on the img
      imgUrlLeft:[],
      imgUrlWidth:[],
      imgUrlHeight:[],
      relationLeft:[],//relation's position on the img
      relationTop:[],
      relationWidth:[],
      relationHeight:[],
      startor:[],//relaiton info
      relationCategory:[],
      receptor:[],
      relationId:[],
      imgWidth:0,//img info
      imgHeight:0,
      imgRelationLeft:0,//find the relation
      imgRelationTop:0,
      imgRelationWidth:0,
      imgRelationHeight:0,
      imgElementLeft:0,//find the element
      imgElementTop:0,
      imgElementWidth:0,
      imgElementHeight:0,
      menu:'tasks',
      img:undefined,//image reviewed
      geneDic:{},//geneId -> geneName
      dictId_geneName:{},//dict -> geneName
      dictId:[],
      currentFigId:0,
      //figure
      fig_id:[],
      figureName:[],
      figureStatus:[],
      figId:1,
      currentReviewer:'',
      currentDataset:'',
		}
  }

  componentWillMount = () =>{
    // this.uploadFigure()
  }

  menuClick = (key) => {
    this.setState({
      menu:key,
    });
    if (key==='tasks') {
      this.clearResult();
    }
    
  }

  findRelation = index => {
    this.setState({
      imgRelationLeft:this.state.relationLeft[index],
      imgRelationTop:this.state.relationTop[index],
      imgRelationWidth:this.state.relationWidth[index],
      imgRelationHeight:this.state.relationHeight[index],
    });
  }

  findElement = index => {
    // console.log(this.state.imgUrlLeft);
    this.setState({
      imgElementLeft:this.state.imgUrlLeft[index],
      imgElementTop:this.state.imgUrlTop[index],
      imgElementWidth:this.state.imgUrlWidth[index],
      imgElementHeight:this.state.imgUrlHeight[index],
    });
  }

  editMode = () =>{
    //alert(this.state.geneName[0])
    this.setState({
      showOutput:false,
      showEdit:true,
      editData:this.state.geneName,
    })
  }

  findEdit= index =>{
    //alert(this.state.geneName[index])
    let data = [];
    data.push(this.state.geneName[index])
    this.setState({
      editData:data,
    });
  }

  returnOutput = () =>{
    this.setState({
      menu:'tasks',
      showEmpty:true,
    });
    this.clearResult();
  }

  //edit geneName whose is_match is 1 or 0
  editElement = (record) => {
    // console.log(record)
    $.ajax(
      {
        type:'post',
        url:'/editElement',
        data:{
          'geneId':record.key,
          'newName':record.name,
          'figId':this.state.currentFigId,
        },
        success:data => {
          // console.log(data);
          if (data == 0) {
            message.error({
              content: 'Invalid input',
              style: {
                marginTop: '60px',
                height:'50px', lineHeight:'50px',fontSize:'18px'
              },
            });
          }else{
            this.updateOutput(data);
          }
        },
        error: (XMLHttpRequest, textStatus, errorThrown) => {
          console.log(
            'status', XMLHttpRequest.status, '\n',
            'readydtate', XMLHttpRequest.readyState, '/n',
            'text', textStatus, '/n',
            'error', errorThrown
          );
        }
      }
    );
  }

  //edit geneName whose is_match is 2
  selectGeneName = (key, id, geneName, dictIdIndex) => {
    if ( this.state.dictId[id - 1] != undefined) {
      $.ajax(
        {
          type:'post',
          url:'/selectElement',
          data:{
            'geneId':key, // geneid
            'newName':geneName, //genename
            'dictId': Number( this.state.dictId[id - 1][dictIdIndex] ), //dictid
            'figId':this.state.currentFigId, //figid
          },
          success:(data) => {
              // console.log(data)
              this.updateOutput(data);
          },
          error: (XMLHttpRequest, textStatus, errorThrown) => {
            console.log(
              'status', XMLHttpRequest.status, '\n',
              'readydtate', XMLHttpRequest.readyState, '/n',
              'text', textStatus, '/n',
              'error', errorThrown
            );
          }
        },
      )
    }else{
      message.error({
        content: 'Please delete it',
        style: {
          marginTop: '60px',
          height:'50px', lineHeight:'50px',fontSize:'18px'
        }
      })
    }

  }

  deleteElement = (record) => {
    $.ajax(
      {
        type:'post',
        url:'/deleteElement',
        data:{
          'geneId':record.key,
          'figId':this.state.currentFigId,
        },
        success:data => {
          this.updateOutput(data);
        },
        error: (XMLHttpRequest, textStatus, errorThrown) => {
          console.log(
            'status', XMLHttpRequest.status, '\n',
            'readydtate', XMLHttpRequest.readyState, '/n',
            'text', textStatus, '/n',
            'error', errorThrown
          );
        }
      }
    );
  }

  addElement = (name, startX, startY, width, height) => {
    $.ajax(
      {
        type:'post',
        url:'/addElement',
        data:{
          'name':name,
          'startX':parseInt( startX*this.state.imgWidth/650 ),
          'startY':parseInt( startY*this.state.imgWidth/650 ), 
          'width':parseInt( width*this.state.imgWidth/650 ),
          'height':parseInt( height*this.state.imgWidth/650 ),
          'figId':this.state.currentFigId,
        },
        success:data => {
          // console.log(data)
          if (data === 0) {
            message.warning('Invalid name ! Please check it !')
          }else{
            this.updateOutput(data)
          } 
        },
        error: (XMLHttpRequest, textStatus, errorThrown) => {
          console.log(
            'status', XMLHttpRequest.status, '\n',
            'readydtate', XMLHttpRequest.readyState, '/n',
            'text', textStatus, '/n',
            'error', errorThrown
          );
        }
      }
    );
  }

  addRelation = (startor, relation, receptor, startX, startY, width, height) =>{
    let startor_dictId = this.state.geneId[startor]
    let receptor_dictId = this.state.geneId[receptor]
    $.ajax(
      {
        type:'post',
        url:'/addRelation',
        data:{
          'startor':startor_dictId,
          'receptor':receptor_dictId,
          'relationType':relation,
          'startX':startX*this.state.imgWidth/650, 
          'startY':startY*this.state.imgWidth/650, 
          'width':width*this.state.imgWidth/650, 
          'height':height*this.state.imgWidth/650,
          'figId':this.state.currentFigId,
        },
        success:data => {
          this.updateOutput(data);
        },
        error: (XMLHttpRequest, textStatus, errorThrown) => {
          console.log(
            'status', XMLHttpRequest.status, '\n',
            'readydtate', XMLHttpRequest.readyState, '/n',
            'text', textStatus, '/n',
            'error', errorThrown
          );
        }
      }
    );
  }

  deleteRelation = (key) => {
    $.ajax(
      {
        type:'post',
        url:'/deleteRelation',
        data:{
          'relationId':key,
          'figId':this.state.currentFigId,
        },
        success: data => {
          // console.log(data)
          this.updateOutput(data);
        },
        error: (XMLHttpRequest, textStatus, errorThrown) => {
          console.log(
            'status', XMLHttpRequest.status, '\n',
            'readydtate', XMLHttpRequest.readyState, '/n',
            'text', textStatus, '/n',
            'error', errorThrown
          );
        }
      }
    );
  }

  switchRelation = (record) => {
    // console.log(record);
    $.ajax(
      {
        type:'post',
        url:'/switchRelation',
        data:{
          'relationId':record.key,
          'figId':this.state.currentFigId,
        },
        success: data => {
          let activator = [], receptor = [];
          data.map((value, index) => {
            activator.push(this.state.geneDic[value.activator]);
            receptor.push(this.state.geneDic[value.receptor]);
          })
          this.setState({
            startor:activator,
            receptor:receptor,
          })
        },
        error: (XMLHttpRequest, textStatus, errorThrown) => {
          console.log(
            'status', XMLHttpRequest.status, '\n',
            'readydtate', XMLHttpRequest.readyState, '/n',
            'text', textStatus, '/n',
            'error', errorThrown
          );
        }
      }
    );
  }

  clearResult = () => {
    this.setState({
      geneDic:{},
      dictId_geneName:{},
      geneName:[],
      startor:[],
      relationCategory:[],
      receptor:[],
      imgUrlLeft:[],
      imgUrlTop:[],
      imgUrlWidth:[],
      imgUrlHeight:[],
      relationLeft:[],
      relationTop:[],
      relationWidth:[],
      relationHeight:[],
      geneId:[],
      relationId:[],
      imgWidth:0,
      imgHeight:0,
      imgRelationLeft:0,//find the relation
      imgRelationTop:0,
      imgRelationWidth:0,
      imgRelationHeight:0,
      imgElementLeft:0,//find the element
      imgElementTop:0,
      imgElementWidth:0,
      imgElementHeight:0,
    });
  }

  loadOutput = (data) => {
    //element, dic{} is temp geneid -> genename
    let name = [], isMatch = [],aliasGeneId = [],dictId = [];
    let dic = {}, eLeft = [], eTop = [], eWidth = [], eHeight = [], geneId = [], dictId_geneName = {};
    data[0].map((value, index) => {
      if( value.is_match == 1 ){//100%match in dict belong to one dictid
        dictId.push(value.dict_id);
        if(value.matched_alias != null){
          name.push(value.matched_alias);
          dic[value.gene_id] = value.matched_alias;
        }else{
          name.push(value.ocr_gene_name)
          dic[value.gene_id] = value.ocr_gene_name;
        }
      }else if( value.is_match == 2 ){//match mutiple dictid
        let aliasId = value.matched_alias.split('@@')[1];
        // console.log(aliasId)
        if(aliasId != '' && aliasId != undefined){
          // console.log(value.ocr_gene_name)
          let aliasIds = aliasId.split(',');
          name.push(value.matched_alias.split('@@')[0]);
          dic[value.gene_id] = value.matched_alias.split('@@')[0];
          dictId.push(aliasIds);
        }else{// none matched
          // console.log(value.ocr_gene_name)
          name.push(value.ocr_gene_name);
          dic[value.gene_id] = value.ocr_gene_name;
          dictId.push(value.dic_id);
        }
      }else{
        dic[value.gene_id] = value.ocr_gene_name;
        dictId.push(value.dict_id);
        name.push(value.ocr_gene_name)
      }
      eLeft.push(value.gene_BBox.split(",")[0]*650/data[1][0].width);
      eTop.push(value.gene_BBox.split(",")[1]*650/data[1][0].width);
      eWidth.push(value.gene_BBox.split(",")[2]*650/data[1][0].width);
      eHeight.push(value.gene_BBox.split(",")[3]*650/data[1][0].width);
      dictId_geneName[value.gene_name] = value.dict_id;
      geneId.push(value.gene_id);
      isMatch.push(value.is_match);
    })
    //relation
    let activator = [], receptor = [], relationType = [], relationId = [];
    let rLeft = [], rTop = [], rWidth = [], rHeight = [];
    data[2].map((value, index) => {
      relationType.push(value.relation_type);
      rLeft.push( value.relation_BBox.split(",")[0]*650/data[1][0].width );
      rTop.push( value.relation_BBox.split(",")[1]*650/data[1][0].width );
      rWidth.push( value.relation_BBox.split(",")[2]*650/data[1][0].width );
      rHeight.push( value.relation_BBox.split(",")[3]*650/data[1][0].width );
      activator.push(dic[value.activator]);
      receptor.push(dic[value.receptor]);
      relationId.push(value.relation_id);
    })
    this.setState({
      isMatch:isMatch,
      dictId:dictId,
      geneDic:dic,
      dictId_geneName:dictId_geneName,
      geneName:name,
      aliasGeneId:aliasGeneId,
      startor:activator,
      relationCategory:relationType,
      receptor:receptor,
      imgUrlLeft:eLeft,
      imgUrlTop:eTop,
      imgUrlWidth:eWidth,
      imgUrlHeight:eHeight,
      relationLeft:rLeft,
      relationTop:rTop,
      relationWidth:rWidth,
      relationHeight:rHeight,
      geneId:geneId,
      relationId:relationId,
      imgWidth:data[1][0].width,
      imgHeight:data[1][0].height,
    });
  }

  updateOutput = (data) => {
    // console.log(data)
    let name = [], isMatch = [],aliasGeneId = [],dictId = [];
    let dic = {}, eLeft = [], eTop = [], eWidth = [], eHeight = [], geneId = [], dictId_geneName = {};
    data[0].map((value, index) => {
      if( value.is_match == 1 ){//100%match in dict belong to one dictid
        dictId.push(value.dict_id);
        if(value.matched_alias != null){
          name.push(value.matched_alias);
          dic[value.gene_id] = value.matched_alias;
        }else{
          name.push(value.ocr_gene_name)
          dic[value.gene_id] = value.ocr_gene_name;
        }
      }else if( value.is_match == 2){//match mutiple dictid
        let aliasId = value.matched_alias.split('@@')[1];
        if(aliasId != undefined){
          let aliasIds = aliasId.split(',');
          name.push(value.matched_alias.split('@@')[0]);
          dic[value.gene_id] = value.matched_alias.split('@@')[0];
          dictId.push(aliasIds);
        }else{ // none matched
          name.push(value.ocr_gene_name);
          dic[value.gene_id] = value.ocr_gene_name;
          dictId.push(value.dic_id);
        }
      }else{
        dic[value.gene_id] = value.ocr_gene_name;
        dictId.push(value.dict_id);
        name.push(value.ocr_gene_name)
      }
      eLeft.push(value.gene_BBox.split(",")[0]*650/this.state.imgWidth);
      eTop.push(value.gene_BBox.split(",")[1]*650/this.state.imgWidth);
      eWidth.push(value.gene_BBox.split(",")[2]*650/this.state.imgWidth);
      eHeight.push(value.gene_BBox.split(",")[3]*650/this.state.imgWidth);
      dictId_geneName[value.gene_name] = value.dict_id;
      geneId.push(value.gene_id);
      isMatch.push(value.is_match);
    })
    //relation
    let activator = [], receptor = [], relationType = [], relationId = [];
    let rLeft = [], rTop = [], rWidth = [], rHeight = [];
    data[1].map((value, index) => {
      relationType.push(value.relation_type);
      rLeft.push( value.relation_BBox.split(",")[0]*650/this.state.imgWidth );
      rTop.push( value.relation_BBox.split(",")[1]*650/this.state.imgWidth );
      rWidth.push( value.relation_BBox.split(",")[2]*650/this.state.imgWidth );
      rHeight.push( value.relation_BBox.split(",")[3]*650/this.state.imgWidth );
      activator.push(dic[value.activator]);
      receptor.push(dic[value.receptor]);
      relationId.push(value.relation_id);
    })
    this.setState({
      isMatch:isMatch,
      dictId:dictId,
      geneDic:dic,
      dictId_geneName:dictId_geneName,
      geneName:name,
      aliasGeneId:aliasGeneId,
      startor:activator,
      relationCategory:relationType,
      receptor:receptor,
      imgUrlLeft:eLeft,
      imgUrlTop:eTop,
      imgUrlWidth:eWidth,
      imgUrlHeight:eHeight,
      relationLeft:rLeft,
      relationTop:rTop,
      relationWidth:rWidth,
      relationHeight:rHeight,
      geneId:geneId,
      relationId:relationId,
    });
  }

  uploadFigure=()=>{
    $.ajax(
			{
				type:'post',
				url:'/loadData',
				success:data => {
					let name = [], status = [],ID = [];
					data.map((value) => {
						ID.push(value.fig_id)
						name.push(value.fig_name);
						status.push(value.review_status)
					})
					this.setState({
						fig_id:ID,
						figureName:name,
						figureStatus:status,
						figId:data[0].fig_id,
					})
				}
			}
		)
  }

  selectFiguresByName = (dataset, name) => {
    // console.log(name)
    $.ajax(
      {
        type:'post',
        url:'selectFigureByName',
        data:{
          dataset:dataset,
          name:name
        },
        success:data => {
          // console.log(data)
          let name = [], status = [],ID = [];
          if(data.length > 0) {
            data.map((value) => {
              ID.push(value.fig_id)
              name.push(value.fig_name);
              status.push(value.review_status)
            })
            this.setState({
              fig_id:ID,
              figureName:name,
              figureStatus:status,
              figId:data[0].fig_id,
            })
          }else{
            alert("There are tasks for you")
          }
        },
        error: (XMLHttpRequest, textStatus, errorThrown) => {
          console.log(
            'status', XMLHttpRequest.status, '\n',
            'readydtate', XMLHttpRequest.readyState, '/n',
            'text', textStatus, '/n',
            'error', errorThrown
          );
        },
      }
    )
  }

  review = (record) => {
    // console.log(record)
    //load output
    $.ajax(
			{
				type:'post',
				url:'/review',
				data:{
					'id':record.id,
				},
				success: data => {
					if (data == 0) {
            message.warning('Figure is inexistent')
          }
          this.loadOutput(data);
				},
        error: (XMLHttpRequest, textStatus, errorThrown) => {
          console.log(
            'status', XMLHttpRequest.status, '\n',
            'readydtate', XMLHttpRequest.readyState, '/n',
            'text', textStatus, '/n',
            'error', errorThrown
          );
        }
			}
    );
    //load image
    $.ajax(
			{
				type:'post',
				url:'/readImg',
				data:{
          'dataset':this.state.currentDataset,
					'name':record.name,
				},
				success: data => {
          // console.log(data)
          this.setState({
            img:"data:image/jpg;base64," + data,
          })
				},
        error: (XMLHttpRequest, textStatus, errorThrown) => {
          console.log(
            'status', XMLHttpRequest.status, '\n',
            'readydtate', XMLHttpRequest.readyState, '/n',
            'text', textStatus, '/n',
            'error', errorThrown
          );
        }
			}
    );
    window.scrollTo(0,0);
    this.setState({
      menu:'review',
      currentFigId:record.id,
      showEmpty:false,
    });

  }

  editConfirm = () => {
    window.scrollTo(0,0);
    $.ajax(
      {
        type:'post',
        url:'/confirmEdit',
        data:{
          'figId':this.state.currentFigId,
        },
        success:data => {
          this.selectFiguresByName(this.state.currentDataset, this.state.currentReviewer)
        },
        error: (XMLHttpRequest, textStatus, errorThrown) => {
          console.log(
            'status', XMLHttpRequest.status, '\n',
            'readydtate', XMLHttpRequest.readyState, '/n',
            'text', textStatus, '/n',
            'error', errorThrown
          );
        }
      }
    );
    this.setState({
      menu:'tasks',
      showEmpty:true,
    });
    this.clearResult();
    
  }

  delFigure = () => {
    window.scrollTo(0,0);
    $.ajax(
      {
        type:'post',
        url:'/delFigure',
        data:{
          'figId':this.state.currentFigId,
        },
        success:data => {
          console.log("sucess to del");
          this.selectFiguresByName(this.state.currentDataset, this.state.currentReviewer)
        },
        error: (XMLHttpRequest, textStatus, errorThrown) => {
          console.log(
            'status', XMLHttpRequest.status, '\n',
            'readydtate', XMLHttpRequest.readyState, '/n',
            'text', textStatus, '/n',
            'error', errorThrown
          );
        }
      }
    );
    this.setState({
      menu:'tasks',
      showEmpty:true,
    });
    this.clearResult();
    // this.uploadFigure();
  }

  selectTasksByStatu = (value) => {
    $.ajax(
      {
        type:'post',
        url:'selectDataStatu',
        data:{
          statu:value,
        },
        success:data => {
          if(data.length > 0) {
            let name = [], status = [],ID = [];
            data.map((value) => {
              ID.push(value.fig_id)
              name.push(value.fig_name);
              status.push(value.review_status)
            })
            this.setState({
              fig_id:ID,
              figureName:name,
              figureStatus:status,
              figId:data[0].fig_id,
            })
          }else{
            alert("There are no reviewed img")
          }
					
				},
        error: (XMLHttpRequest, textStatus, errorThrown) => {
          console.log(
            'status', XMLHttpRequest.status, '\n',
            'readydtate', XMLHttpRequest.readyState, '/n',
            'text', textStatus, '/n',
            'error', errorThrown
          );
        },
      }
    )
  }

  selectName = (name) => {
    this.setState({
      currentReviewer:name
    })
  }

  selectDataset = (value) => {
    // console.log(value)
		this.setState({
      currentDataset:value
    })
	}

	selectTasks = () => {
    this.selectFiguresByName(this.state.currentDataset, this.state.currentReviewer)
		// console.log(this.state.currentDataset)
	}

	render(){
    // console.log(this.state.dictId)
		return (
      <div id = 'main'>
        <div id = 'head'>
          <Headers
            menuClick = {this.menuClick}
            menu = {this.state.menu}
          />
        </div>
        <div style={{display:this.state.menu=='tasks' ? 'block':'none'}}>
          <Tasks
            review = {this.review}
            selectDataset = {this.selectDataset}
            selectTasks = {this.selectTasks}
            selectTasksByStatu = {this.selectTasksByStatu}
            selectName = {this.selectName}
            fig_id={this.state.fig_id}
            figureName={this.state.figureName}
            figureStatus={this.state.figureStatus}
            figId={this.state.figId}
          />
        </div>
        <div style={{display: this.state.menu=='review' && this.state.showEmpty == true ? 'block':'none'}}>
          <div id='main' className={style.main}>
            <Empty />
          </div>
        </div>
        <div style={{display: this.state.menu=='review' && this.state.showEmpty == false ? 'block':'none'}}>
          <Edit
             isMatch = {this.state.isMatch}
             geneName = {this.state.geneName}
             geneId = {this.state.geneId}
             dictId = {this.state.dictId}
             editData = {this.state.editData}
             genePosition = {this.state.genePosition}
             imgUrlHeight = {this.state.imgUrlHeight}
             imgUrlWidth = {this.state.imgUrlWidth}
             imgUrlLeft = {this.state.imgUrlLeft}
             imgUrlTop = {this.state.imgUrlTop}
             mianDownload = {this.mianDownload}
             predictRelation = {this.predictRelation}
             startor = {this.state.startor}
             relationCategory = {this.state.relationCategory}
             receptor = {this.state.receptor}
             relationId = {this.state.relationId}
             imgRelationLeft= {this.state.imgRelationLeft}
             imgRelationTop= {this.state.imgRelationTop}
             imgRelationWidth= {this.state.imgRelationWidth}
             imgRelationHeight= {this.state.imgRelationHeight}
             editMode = {this.editMode}
             returnOutput = {this.returnOutput}
             findEdit = {this.findEdit}
             findRelation = {this.findRelation}
             imgElementLeft = {this.state.imgElementLeft}
             imgElementTop = {this.state.imgElementTop}
             imgElementWidth = {this.state.imgElementWidth}
             imgElementHeight = {this.state.imgElementHeight}
             imgWidth = {this.state.imgWidth}
             imgHeight = {this.state.imgHeight}
             findElement = {this.findElement}
             deleteElement = {this.deleteElement}
             deleteRelation = {this.deleteRelation}
             switchRelation = {this.switchRelation}
             editElement = {this.editElement}
             img = {this.state.img}
             editConfirm = {this.editConfirm}
             addElement = {this.addElement}
             addRelation = {this.addRelation}
             selectGeneName = {this.selectGeneName}
             delFigure = {this.delFigure}
          />
        </div>
        <>
          <BackTop />
          <strong className="site-back-top-basic"></strong>
        </>
        <footer className={style.footer}>Pathway ©2020 Created by DBL</footer>
        </div>
    );
	}
}

export default Main