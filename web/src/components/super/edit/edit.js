import React from 'react';
import './antd.css';
import style from './edit.module.css'
import { Table, Input, Button ,Select, Popconfirm} from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import { Collapse, message, Row, Col} from 'antd';

const { Panel } = Collapse;
const { Option } = Select;

class Edit extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      searchText: '',
      searchedColumn: '',
      isMatch:[],
      dataOfElement:[], //elementData in table
      dataOfRelation:[],//relaitonData
      editCacheData: [],
      showAddElement:false,
      showAddRelation:false,
      elementCanvas2D: undefined,//canvase
      relationCanvas2D:undefined,
      isDrawElement:false,
      isDrawRelation:false,
      addElementStartX:null,//add element's position
      addElementStartY:0,
      addElementEndX:0,
      addElementEndY:0,
      addRelationStartX:null,//add relation's position
      addRelationStartY:0,
      addRelationEndX:0,
      addRelationEndY:0,
      drawingSurfaceImageDataElement: undefined,//set canvas on the image
      drawingSurfaceImageDataRelation: undefined,
      showInputElement:false,
      showInputRelation:false,
      changeReceptor:null,//add relation 
      changeRelation:null,
      changeStartor:null,
      selectStartorPosition:[0,0,0,0], // when adding relation, show the gene's position
      selectReceptorPosition:[0,0,0,0],
    }
    //elemnet's table columns
    this.columnsOfElement = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: '8%',
      },
      {
        title: 'Gene Name',
        dataIndex: 'name',
        key: 'name',
        width: '22%',
        render: (text, record) => {
          //edit element statu
          if (this.state.editCacheData.find(item=>item.key == record.key)) {
            return <Input defaultValue={text} onChange={(e)=>{this.textChange(e,record)}}/>
          }else{
            return text;
          }
        },
      },
      {
        title: 'Find',
        dataIndex: 'find',
        key: 'find',
      },
      {
        title: 'Operate',
        key: 'action',
        render: (text, record) => {
          // console.log(record)
          // console.log(typeof(record.name))
          if(typeof(record.name) == 'string'){
            //if is_match = 1/0
            if (this.state.editCacheData.find(item=>item.key == record.key)) {
              return <span>
                        <a href="javascript:;" onClick={()=>{this.saveEditedElement(record)}}>Save</a>
                        <span className="ant-divider"/>
                        <Popconfirm title="Sure to cancel?" onConfirm={()=>{this.cancelToSaveEditedElement(record)}}>
                          <a href="javascript:;" style ={{marginLeft:'5px'}} >Cancel</a>
                        </Popconfirm>
                      </span>
              }else{
                return <span>
                        <a href="javascript:;" onClick={()=>{this.changeToEdit(record)}}>Edit</a>
                      </span>
              }
          }else{
            //if is_match = 2
            return <span>
                  <a href="javascript:;" onClick={()=>{this.saveSelectGenmeName(record)}}>Save</a>
                  </span>
          
            
          }
        }
      },
      {
        title: 'Delete',
        key: 'delete',
        render: (text, record) => {
          return <span>
              <Popconfirm title="Sure to delete this element and its related relationshiop?" 
              onConfirm={()=>{this.deleteElement(record)}}
              >
                <a href="javascript:;">Delete</a>
              </Popconfirm>
          </span>
        }
      }
    ];
    //relation's table columns
    this.columnsOfRelation = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: '15%',
        // ...this.getColumnSearchProps('id'),
      },
      {
        title: 'Starter',
        dataIndex: 'start',
        key: 'start',
        width: '20%',
        // ...this.getColumnSearchProps('start'),
      },
      {
        title: 'Relation_category',
        dataIndex: 'relation',
        key: 'relation',
        width: '30%',
        // ...this.getColumnSearchProps('relation'),
      },
      {
        title: 'Receptor',
        dataIndex: 'receptor',
        key: 'receptor',
        width: '20%',
        // ...this.getColumnSearchProps('receptor'),
      },
      {
        title: 'Delete',
        key: 'delete',
        width: '15%',
        render: (text, record) => {
          return <span>
              <Popconfirm title="Sure to delete?" onConfirm={()=>{this.deleteRelation(record.key)}}>
                <a href="javascript:;">Delete</a>
              </Popconfirm>
          </span>
        }
      },
      {
        title: 'Switch',
        key: 'Switch',
        width: '15%',
        render: (text, record) => {
            return <span>
            
                  <a href="javascript:;" onClick = {()=>{this.switchRelation(record);
                  }}>Switch</a>
              
            </span> 
        }
      }
    ];
  }

  textChange(e, record) {
    let rows = [...this.state.editCacheData];
    let row = rows.find(item=>item.key == record.key);
    if (row) {
        row.name = e.target.value;
    }
    this.setState({
      editCacheData:rows,
    })
  }

  //delete
  deleteElement(record) {
    // console.log(record);
    let rowsRelation = [...this.state.dataOfRelation];
    let relationIndex = [];
    rowsRelation.map((value, index) => {
      if(record.name == value.receptor || record.name == value.start){
        relationIndex.push(value.key)
      }
    })
    this.props.deleteElement(record);
  }

  deleteRelation = (key) => {
    this.props.deleteRelation(key);
  }

  switchRelation(record) {
    this.props.switchRelation(record);
  }

  saveSelectGenmeName(record) {
    console.log(record.id)
    let name = document.getElementById(record.key).value;
    let dictIdIndex = document.getElementById(record.key).selectedIndex;
    this.props.selectGeneName(record.key, record.id, name, dictIdIndex);
  }
  
  //add edited row to cache
  changeToEdit(record) {
    let cacheData = [...this.state.editCacheData];
    cacheData.push({
        key: record.key,
        name: record.name,
    })
    this.setState({
        editCacheData: cacheData
    });
  }
  
  //delete its cache and go to this.props.editElement
  saveEditedElement(record) {
    // console.log(record);
    let rows = [...this.state.editCacheData];
    let row = rows.find(item=>item.key == record.key);
    let cacheData = [...this.state.editCacheData];
    let index = cacheData.findIndex((e, i, a)=>e.key === record.key);
    cacheData.splice(index, 1);
    this.setState({
        editCacheData: cacheData,
    });
    this.props.editElement(row);
  }

  //delete its cache
  cancelToSaveEditedElement(record) {
    let cacheData = [...this.state.editCacheData];
    let index = cacheData.findIndex((e, i, a)=>e.key === record.key);
    cacheData.splice(index, 1);
    this.setState({
        editCacheData: cacheData
    });
  }

  clickElement = (index) =>{
    this.props.findEdit(index);
  }

  returnOutput = () =>{
    this.props.returnOutput();
  }

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      ),
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    // console.log(selectedKeys)
    // console.log(confirm)
    // console.log(dataIndex)
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  addElement = () =>{
    // console.log('addelement')
    let ctx = this.state.elementCanvas2D.getContext('2d');
    // console.log(ctx)
    ctx.canvas.width = 650;
    let height = (650.0/this.props.imgWidth) * this.props.imgHeight;
    ctx.canvas.height = height;
    ctx.canvas.width = 650; 
    this.setState({
      showAddElement:true,
    })
    let e = this.props.imgUrlLeft;
    e.map((value,index) => {
      ctx.strokeStyle = "black";
      ctx.strokeRect(this.props.imgUrlLeft[index],this.props.imgUrlTop[index],
        this.props.imgUrlWidth[index],this.props.imgUrlHeight[index]);
    });
  }

  addRelation = () => {
    let ctx = this.state.relationCanvas2D.getContext('2d');
    ctx.canvas.width = 650;
    let height = (650.0/this.props.imgWidth) * this.props.imgHeight;
    ctx.canvas.height = height;
    ctx.canvas.width = 650; 
    this.setState({
      showAddRelation:true,
    })
  }

  ifDrawTwoElementsWarnning = () => {
    message.warning('you cannot add two elements at once!');
  };

  invalidAdding =() =>{
    message.warning('Invalid add input');
  }

  canvasMouseDown = (e, key) => {
    if (key == "element") {
      if (this.state.addElementStartX == null) {
        let father = document.getElementById("addElement");
        this.saveDrawingSurface(key);
        this.setState({
          isDrawElement:true,
          addElementStartX:e.pageX-father.offsetLeft,
          addElementStartY:e.pageY-father.offsetTop,
        });
      }else{
        this.ifDrawTwoElementsWarnning();
      }
    }else if (key == "relation") {
      // console.log("relation canvas")
      if (this.state.addRelationStartX == null) {
        let father = document.getElementById("addRelation");
        this.saveDrawingSurface(key);
        this.setState({
          isDrawRelation:true,
          addRelationStartX:e.pageX-father.offsetLeft,
          addRelationStartY:e.pageY-father.offsetTop,
        });
      }else{
        this.ifDrawTwoElementsWarnning();
      }
    }
  }

  canvasMouseMove = (e, key) => {
    if (key == "element") {
      let father = document.getElementById("addElement");
      let ctx = this.state.elementCanvas2D.getContext('2d');
      let rect = {};
      if (this.state.isDrawElement) {
        this.restoreDrawingSurface(key);
        rect.startX = this.state.addElementStartX;
        rect.startY = this.state.addElementStartY;
        rect.width = e.pageX-father.offsetLeft - this.state.addElementStartX;
        rect.height = e.pageY-father.offsetTop - this.state.addElementStartY;
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = "red";
        ctx.rect(rect.startX, rect.startY, rect.width, rect.height);
        ctx.stroke();
        ctx.restore();
      }
    }else if (key == "relation") {
      let father = document.getElementById("addRelation");
      let ctx = this.state.relationCanvas2D.getContext('2d');
      let rect = {};
      if (this.state.isDrawRelation) {
        this.restoreDrawingSurface(key);
        rect.startX = this.state.addRelationStartX;
        rect.startY = this.state.addRelationStartY;
        rect.width = e.pageX-father.offsetLeft - this.state.addRelationStartX;
        rect.height = e.pageY-father.offsetTop - this.state.addRelationStartY;
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = "red";
        ctx.rect(rect.startX, rect.startY, rect.width, rect.height);
        ctx.stroke();
        ctx.restore();
      }
    }
  }

  canvasMouseUp = (e, key) =>{
    // console.log("up")
    if (key == "element") {
      let father = document.getElementById("addElement");
      //console.log("up",e.pageX-father.offsetLeft, e.pageY-father.offsetTop);
      this.setState({
        isDrawElement:false,
        showInputElement:true,
        addElementEndX:e.pageX-father.offsetLeft,
        addElementEndY:e.pageY-father.offsetTop,
      });
    }else if (key == "relation") {
      let father = document.getElementById("addRelation");
      //console.log("up",e.pageX-father.offsetLeft, e.pageY-father.offsetTop);
      this.setState({
        isDrawRelation:false,
        showInputRelation:true,
        addRelationEndX:e.pageX-father.offsetLeft,
        addRelationEndY:e.pageY-father.offsetTop,
      });
    }
  }

  sureAddElement = () =>{
    let obj = document.getElementById("inputElementTool");
    if (this.state.addElementStartX != null && obj.value != '') {
      let newElement = document.getElementById('inputElementTool').value;
      let width = Math.abs(this.state.addElementEndX - this.state.addElementStartX);
      let height = Math.abs(this.state.addElementEndY - this.state.addElementStartY);
      let startX = Math.min(this.state.addElementEndX, this.state.addElementStartX);
      let startY = Math.min(this.state.addElementEndY, this.state.addElementStartY)
      this.props.addElement(newElement, startX, startY, width, height);
      this.setState({
        showAddElement:false,
        showInputElement:false,
        addElementStartX:null,
      })
      obj.value = '';
    }else{
      this.invalidAdding();
    }
  }

  sureAddRelation = () => {
    let selectStartorPosition = this.state.selectStartorPosition;
    let selectReceptorPosition = this.state.selectReceptorPosition;
    if (this.state.changeStartor != null &&
        this.state.changeRelation != null &&
        this.state.changeReceptor != null) {
          // selectReceptorPosition. width and height should be switched. -and-is+
          let startorMInX = selectStartorPosition[0], startorMinY = selectStartorPosition[1];
          let startorMaxX = selectStartorPosition[0] + selectStartorPosition[2];
          let startorMaxY = selectStartorPosition[1] + selectStartorPosition[3];
          let receptorMinX = selectReceptorPosition[0], receptorMinY = selectReceptorPosition[1];
          let receptorMaxX = selectReceptorPosition[0] + selectReceptorPosition[2];
          let receptorMaxY = selectReceptorPosition[1] + selectReceptorPosition[3];
          let relationX = Math.min(startorMInX, receptorMinX);
          let relationY = Math.min(startorMinY, receptorMinY);
          let relationHeight = Math.max(startorMaxX, receptorMaxX) - relationX;
          let relationWidth = Math.max(startorMaxY, receptorMaxY) - relationY;
          this.props.addRelation(this.state.changeStartor, 
            this.state.changeRelation,
            this.state.changeReceptor,
            relationX, 
            relationY, 
            relationWidth, relationHeight);
          this.setState({
            showAddRelation:false,
            showInputRelation:false,
            addRelationStartX:null,
          })
    }else{
      this.invalidAdding();
    }
  }

  clearAdd = (key) => {
    if (key == "element") {
      let obj = document.getElementById("inputElementTool");
      obj.value = '';
      this.restoreDrawingSurface(key);
      this.setState({
        showInputElement:false,
        addElementStartX:null,
      })
    }else if (key == "relation") {
      this.setState({
        showInputRelation:false,
        addRelationStartX:null,
      });
    }
  }

  quitAddElement = () => {
    let obj = document.getElementById("inputElementTool");
    obj.value = '';
    this.setState({
      showAddElement:false,
      showInputElement:false,
      addElementStartX:null,
    })
  }

  quitAddRelation = () => {
    this.setState({
      showAddRelation:false,
      showInputRelation:false,
      addRelationStartX:null,
    })
  }

  saveDrawingSurface = (key) => {
    if (key == "element") {
      let ctx = this.state.elementCanvas2D.getContext('2d');
      let height = (650.0/this.props.imgWidth) * this.props.imgHeight;
      this.setState({
        drawingSurfaceImageDataElement : ctx.getImageData(0, 0, 650, height),
      });
    }else if (key == "relation") {
      let ctx = this.state.relationCanvas2D.getContext('2d');
      let height = (650.0/this.props.imgWidth) * this.props.imgHeight;
      this.setState({
        drawingSurfaceImageDataRelation : ctx.getImageData(0, 0, 650, height),
      });
    }
  }

  restoreDrawingSurface = (key) => {
    if (key == "element") {
      let ctx = this.state.elementCanvas2D.getContext('2d');
      ctx.putImageData(this.state.drawingSurfaceImageDataElement, 0, 0);
    }else if (key == "relation") {
      let ctx = this.state.relationCanvas2D.getContext('2d');
      ctx.putImageData(this.state.drawingSurfaceImageDataRelation, 0, 0);
    }

  }

  onChangeStartor = (value) =>{
    // console.log(`selected ${value}`);
    //left top width height
    this.setState({
      changeStartor:value,
      selectStartorPosition:[this.props.imgUrlLeft[value],this.props.imgUrlTop[value],
                              this.props.imgUrlWidth[value],this.props.imgUrlHeight[value]],
    })
  }

  onChangeRelation = (value) => {
    // console.log(`selected ${value}`);
    this.setState({
      changeRelation:value,
    })
  }

  onChangeReceptor = (value) => {
    // console.log(`selected ${value}`);
    this.setState({
      changeReceptor:value,
      selectReceptorPosition:[this.props.imgUrlLeft[value],this.props.imgUrlTop[value],
                              this.props.imgUrlWidth[value],this.props.imgUrlHeight[value]],
    })
  }

  onChangeGeneName = (value) => {
    return value;
  }
  
  // onBlur() {
  //   console.log('blur');
  // }
  
  // onFocus() {
  //   console.log('focus');
  // }
  
  // onSearch(val) {
  //   console.log('search:', val);
  // }

  componentWillReceiveProps(nextProps){
    let tableData = [];
    for(let i = 0; i < nextProps.geneName.length; i++){
      if(nextProps.isMatch[i] == 2){
        let selectGeneNames = nextProps.geneName[i].split(',');
        tableData.push(
          {
            key: nextProps.geneId[i],
            id:i+1,
            find:<a href="javascript:;" onClick = {() => {this.props.findElement(i)}}>find</a>,
            name: <select
                    id = {nextProps.geneId[i]}
                    className = {style.geneSelect}
                    style={{ width: 200 }}
                  >
                    {
                      selectGeneNames.map((value) =>{
                        return <option value={value}>{value}</option>
                      })
                    }
                  </select>,
          }
        );
      }else{
        tableData.push(
          {
            key: nextProps.geneId[i],
            id:i+1,
            find:<a href="javascript:;" onClick = {() => {this.props.findElement(i)}}>find</a>,
            name: nextProps.geneName[i],
          }
        );
      }
    }
    let tableData2 = [];
    for(let i = 0; i < nextProps.relationId.length; i++){
      tableData2.push(
        {
          key: nextProps.relationId[i],
          id: <a onClick = {() => {this.props.findRelation(i)}}>{i+1}</a>,
          start:nextProps.startor[i],
          startor: <a onClick = {() => {this.props.findRelation(i)}}>{nextProps.startor[i]}</a>,
          relation: nextProps.relationCategory[i],
          receptor: nextProps.receptor[i],
        }
      )
    }
    this.setState({
      isMatch:nextProps.isMatch,
      dataOfElement:tableData,
      dataOfRelation:tableData2,
    })
  }

  editConfirm = () => {
    this.props.editConfirm();
    this.clearAll();
  }

  delFigure = () => {
    this.props.delFigure();
    this.clearAll();
  }

  clearAll = () => {
    this.setState({
      selectStartorPosition:[0,0,0,0],
      selectReceptorPosition:[0,0,0,0],
      editCacheData:[],
    });
  }

  tableRowClass = (record,index) => {
    // console.log(record)
    if(this.state.isMatch[record.id - 1] == 0){
      return style.redCase;
    }else if(this.state.isMatch[record.id - 1] == 2){
      return style.yellowCase;
    }else if(this.state.isMatch[record.id - 1] == 3){
      return style.blueCase;
    }else{
      return null;
    }
  }

  componentDidMount = () => {
    this.setState({
      elementCanvas2D: document.querySelector(`#canvasElement`),
      relationCanvas2D:document.querySelector('#canvasRelation'),
    })
  }

  render(){
    let e = this.props.imgUrlLeft;
    let findedElementBorder, findedRelationBorder;
    if (this.props.imgElementWidth > 0) {
      findedElementBorder = '1px solid red'
    }else{
      findedElementBorder = '0px'
    }
    if (this.props.imgRelationWidth > 0) {
      findedRelationBorder = '2px solid red'
    }else{
      findedRelationBorder = '0px'
    }
    let itemElement = (
      <div style={{position:'relative',
      width:'650px', 
      display:this.state.showAddElement ? 'none':'block'}}>
        <img style={{width:'650px'}} src = {this.props.img}></img>
        
        <a style = {{position:'absolute', 
          left:this.props.imgElementLeft-2, 
          top:this.props.imgElementTop-2, 
          width:this.props.imgElementWidth+4, 
          height:this.props.imgElementHeight+4, 
          border:findedElementBorder}}></a>
        {
          e.map((value,index)=>{
            let imgStyle = {
              position:'absolute', 
              left:this.props.imgUrlLeft[index]-2 , 
              top:this.props.imgUrlTop[index]-2 , 
              width:this.props.imgUrlWidth[index]+4 ,
              height:this.props.imgUrlHeight[index]+4, 
              
            }
            return <a id={index} 
                    onClick = {() => {this.clickElement(index)}} 
                    style={imgStyle} ></a>
          })
          }
      </div>
    )
    let itemRelation = (
      <div style={{position:'relative', width:'650px', display:this.state.showAddRelation ? 'none':'block'}}>
        <img style={{width:'650px'}} src = {this.props.img}></img>
        <a style = {{position:'absolute', 
           left:this.props.imgRelationLeft, 
           top:this.props.imgRelationTop, 
           width:this.props.imgRelationWidth, 
           height:this.props.imgRelationHeight, 
           border:findedRelationBorder}}></a>
      </div>
    );

    let itemAddElement = (
      <div id = "addElement" 
      style={{position:'relative', width:'650px',display: this.state.showAddElement ? 'block':'none'}}>
        <img id = "imgAddElement" style={{width:'650px'}} src = {this.props.img}></img>
        <canvas
          id="canvasElement"
          style = {{position:'absolute', left:'0', top:'0',border:'1px solid black'}}
          onMouseDown = {(e) => this.canvasMouseDown(e,"element")}
          onMouseMove = {(e) => this.canvasMouseMove(e,"element")}
          onMouseUp = {(e) => this.canvasMouseUp(e,"element")}
        ></canvas>
      </div>
    );

    let itemAddRelation = (
      <div id = "addRelation" 
      style={{position:'relative', width:'650px', display:this.state.showAddRelation ? 'block':'none',zIndex:'1'}}>
        <img id = "imgAddRelation" style={{width:'650px'}} src = {this.props.img}></img>
        <a style = {{position:'absolute', 
           left:this.state.selectStartorPosition[0], 
           top:this.state.selectStartorPosition[1], 
           width:this.state.selectStartorPosition[2], 
           height:this.state.selectStartorPosition[3], 
           border:'2px solid black'}}></a>
        <a style = {{position:'absolute', 
           left:this.state.selectReceptorPosition[0], 
           top:this.state.selectReceptorPosition[1], 
           width:this.state.selectReceptorPosition[2], 
           height:this.state.selectReceptorPosition[3], 
           border:'2px solid red'}}></a>
        <canvas 
          id="canvasRelation"
          style = {{zIndex:'0', position:'absolute', left:'0', top:'0',border:'1px solid black'}}
          // onMouseDown = {(e) => this.canvasMouseDown(e,"relation")}
          // onMouseMove = {(e) => this.canvasMouseMove(e,"relation")}
          // onMouseUp = {(e) => this.canvasMouseUp(e,"relation")}
        ></canvas>
      </div>
    );

    let itemInputElement = (
      <div id = "inputElement" 
      className = {style.input_element}
      style={{display: this.state.showInputElement ? 'block':'none'}}>
        <input id = "inputElementTool" 
        placeholder = "Input gene‘s name..."
        ></input>
      </div>
    );
    let geneInfo = [];
    this.state.dataOfElement.map((value,index) => {
      geneInfo.push({'geneKey':value.key,'geneName':value.name,'geneId':index})
    })
    let inputStartor = (
      <Select
          id = "inputStartorTool"
          className = {style.startor}
          showSearch
          style={{ width: 200 }}
          placeholder="Select a startor"
          optionFilterProp="children"
          onChange={this.onChangeStartor}
          // onFocus={this.onFocus}
          // onBlur={this.onBlur}
          // onSearch={this.onSearch}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {
            geneInfo.map((value) =>{
              return <Option value={value.geneId}>{"ID:"+value.geneKey+" "+"Name:"+value.geneName}</Option>
            })
          }
        </Select>
    )
    let inputRelation = (
      <Select
          id = "inputRelationTool"
          className = {style.relation}
          showSearch
          style={{ width: 200 }}
          placeholder="Select a relation"
          optionFilterProp="children"
          onChange={this.onChangeRelation}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onSearch={this.onSearch}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          <Option value="activate_relation">activate_relation</Option>
          <Option value="inhibit_relation">inhibit_relation</Option>
        </Select>
    )
    let inputeReceptor = (
      <Select
          id = "inputReceptorTool"
          className = {style.receptor}
          showSearch
          style={{ width: 200 }}
          placeholder="Select a receptor"
          optionFilterProp="children"
          onChange={this.onChangeReceptor}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onSearch={this.onSearch}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {
            geneInfo.map((value) =>{
              return <Option value={value.geneId}>{"ID:"+value.geneKey+" "+"Name:"+value.geneName}</Option>
            })
          }
        </Select>
    )
    let itemInputRelation = (
      <div id = "inputRelation" 
      className = {style.inputRelation}
      style={{display: this.state.showAddRelation ? 'block':'none'}}>
        Add relation Bbox: Please make sure the startor-Bboxing(black rect) and receptor-Bboxing（red recrt） is shown in the image!
        <div id = "1" className = {style.inputStartor}>
          <pre>Starter:  </pre>
          {inputStartor}
        </div>
        <div className = {style.inputnexus}>
          <pre>Relation: </pre>
          {inputRelation}
        </div >
        <div className = {style.inputreceptor}>
          <pre>Receptor: </pre>
          {inputeReceptor}
        </div>
      </div>
    );

    return (
            <div style ={{width:'1500px',margin:'100px auto'}}>
                <Collapse defaultActiveKey={['1','2']} style={{marginLeft:'20px',marginRight:'20px'}}>
                  <Panel header="Edit Element" key="1">  
                    <Row>
                        <div>
                          {itemElement}
                          {itemAddElement}
                          {itemInputElement}
                          <Button 
                            type="primary" 
                            onClick={this.addElement} 
                            className = {style.button_addElement}
                            style = {{display:this.state.showAddElement ? 'none':'block'}}
                          >ADD Element</Button>
                          <Button
                            type="primary" 
                            onClick={this.sureAddElement} 
                            className = {style.button_addElement}
                            style = {{display:this.state.showAddElement ? 'block':'none'}}
                          >Add It</Button>
                          <Button
                            type="primary" 
                            onClick={() => this.clearAdd("element")} 
                            className = {style.button_clearAddElement}
                            style = {{display:this.state.showAddElement ? 'block':'none'}}
                          >Clear it</Button>
                          <Button
                            type="primary" 
                            onClick={this.quitAddElement} 
                            className = {style.button_clearAddElement}
                            style = {{display:this.state.showAddElement ? 'block':'none'}}
                          >Quit</Button>
                          <p className = {style.addElementGuid}
                            style = {{display:this.state.showAddElement ? 'block':'none'}}>Please frame the element you want to add first.</p>
                      </div> 
                      <div style = {{
                        display:this.state.showAddElement ? 'none':'block',
                        marginLeft:'50px', marginTop:'50px'
                        }}>
                        <Table 
                          style={{width:'600px'}}
                          id = 'tableElement'
                          columns={this.columnsOfElement} 
                          dataSource={this.state.dataOfElement} 
                          bordered
                          rowClassName = {this.tableRowClass}
                        />                     
                      </div>
                    </Row>  
                  </Panel>
                  <Panel header="Edit Relation" key="2">
                    <Row>
                      <div>
                        {itemRelation}
                        {itemAddRelation}
                        {itemInputRelation}
                        <Button 
                          type="primary" 
                          onClick={this.addRelation} 
                          className = {style.button_addElement}
                          style = {{display:this.state.showAddRelation ? 'none':'block'}}
                        >ADD Relation</Button>
                        <Button
                          type="primary" 
                          onClick={this.sureAddRelation} 
                          className = {style.button_addElement}
                          style = {{display:this.state.showAddRelation ? 'block':'none'}}
                        >Add It</Button>
                        <Button
                          type="primary" 
                          onClick={() => this.clearAdd("relation")} 
                          className = {style.button_clearAddElement}
                          style = {{display:this.state.showAddRelation ? 'block':'none'}}
                        >Clear it</Button>
                        <Button
                          type="primary" 
                          onClick={this.quitAddRelation} 
                          className = {style.button_clearAddElement}
                          style = {{display:this.state.showAddRelation ? 'block':'none'}}
                        >Quit</Button>
                      </div>
                      <div style = {{
                        display:this.state.showAddRelation ? 'none':'block',
                        marginLeft:'50px', marginTop:'50px'
                        }}>
                          (click id to find the relaiton)
                        <Table 
                        style={{width:'600px'}}
                        tableLayout="fixed" 
                        columns={this.columnsOfRelation} 
                        dataSource={this.state.dataOfRelation} 
                        bordered ellipsis='true'/>
                      </div>
                    </Row>
                  </Panel>
                </Collapse>
 
          <div style={{padding:'10px',paddingRight:'10px',textAlign:'right'}}>
            <Button type="primary" danger size='large' onClick={this.delFigure} style={{float:'left'}}>Delete Figure</Button>
            <Button type="primary" size='large' onClick={this.returnOutput} style={{marginRight:'10px'}}>Quit Edit</Button>
            <Button type="primary" size='large' onClick={this.editConfirm} style={{marginRight:'10px'}}>Confirm</Button>
          </div>
      </div>
    );
  }
}

export default Edit