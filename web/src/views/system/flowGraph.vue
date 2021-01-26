<template>
  <el-row :gutter="20">
    <el-col :span="24">
      <el-row :gutter="20">
        <el-col :span="24">
          <div class="cardContainer">
            <el-col :span="6" v-for="(item,index) in FlowData" :key="index">
              <div class="colItemContainer text-center">
                <div @click="toG6(item)" :class="{'color-lightgreen':item.ProcessName===selectRow.ProcessName}">
                  <p class="marginBottom-10 text-size-48"><i :class="item.Icon"></i></p>
                  <p class="text-size-16">{{ item.ProcessName }}</p>
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="colItemContainer text-center">
                <p class="marginBottom marginTop text-size-48" @click="addFlow"><i class="el-icon-circle-plus-outline"></i></p>
              </div>
              <el-dialog title="添加流程" :visible.sync="dialogVisible" width="50%" :append-to-body="true">
                <el-form :model="formParameters" label-width="110px">
                  <el-form-item label="流程名称" >
                    <el-input v-model="formParameters.ProcessName"></el-input>
                  </el-form-item>
                  <el-form-item label="展示图标" >
                    <el-input v-model="formParameters.Icon"></el-input>
                  </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="dialogVisible = false">取 消</el-button>
                  <el-button type="primary" @click="saveAddFlow">保存</el-button>
                </span>
              </el-dialog>
            </el-col>
          </div>
        </el-col>
        <el-col :span="24">
          <el-form :inline="true">
            <el-form-item>
              <el-radio-group v-model="modeRadio" size="mini" @change="changeMode">
                <el-radio-button v-for="(item,index) in modeRadioList" :key="index" :label="item.label"></el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <div
                class="container"
                draggable="false">
                <div
                  :class="item.class"
                  :type="item.type"
                  v-for="(item,cindex) in group"
                  :key="cindex"
                  draggable="true"
                  @dragstart="onDragstart($event)"
                  @dragend="onDragend($event)">
                  {{item.label}}
                </div>
              </div>
            </el-form-item>
            <el-form-item>
              <el-button @click="saveFlow" size="small">保存流程结构</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="danger" @click="delFlow" size="mini">删除流程</el-button>
            </el-form-item>
          </el-form>
          <el-row :gutter="20">
            <el-col :span="20">
              <div class="platformContainer">
                <div
                  class="onDown"
                  draggable="false"
                  @dragover="onDragover($event)"
                  @dragenter="onDragenter($event)"
                  @drop="onDrop($event)">
                  <div id="container" style="position:relative;width: 100%;height: 600px;"></div>
                </div>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="platformContainer">
                <el-form v-model="clickModel">
                  <el-form-item label="节点名称">
                    <el-input size="small" v-model="clickModel.label" @change="changeNode"></el-input>
                  </el-form-item>
                </el-form>
                </div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
  import G6 from '@antv/g6';
  import draggable from 'vuedraggable'
  var moment = require('moment');
  export default {
    name: "flowGraph",
    data(){
      return{
        FlowtableName:"TechnologicalProcess",
        FlowData:[],
        dialogVisible:false,
        formParameters:{
          ProcessName:"",
          Icon:""
        },
        selectRow:"",
        selectFlowData:"",
        modeRadio:"拖拽模式",
        modeRadioList:[
          {label:"拖拽模式"},
          {label:"连线模式"},
          {label:"点啥删啥"},
        ],
        graph:null,
        toolbar:null,
        clickNode:{},
        clickModel:{},
        group:[
          {label:"圆形",class:"circleNode",type:"circle"},
          {label:"矩形",class:"rectNode",type:"rect"},
          {label:"菱形",class:"diamondNode",type:"diamond"},
          {label:"三角形",class:"triangleNode",type:"triangle"},
        ],
        nodeType:"", //存拖动的元素类型
      }
    },
    mounted() {
      this.getFlow()
    },
    methods:{
      getFlow(){
        var that = this
        var params = {
          tableName: this.FlowtableName,
        }
        this.axios.get("/api/CUID",{
          params: params
        }).then(res =>{
          if(res.data.code === "200"){
            var data = res.data.data
            that.FlowData = data.rows
          }
        },res =>{
          console.log("请求错误")
        })
      },
      addFlow(){
        this.dialogVisible = true
      },
      saveAddFlow(){
        if(this.formParameters.ProcessName != ""){
          if(this.formParameters.Icon === ''){
            this.formParameters.Icon = "el-icon-share"
          }
          var params = {
            tableName:this.FlowtableName,
            ProcessName:this.formParameters.ProcessName,
            Icon:this.formParameters.Icon,
          }
          this.axios.post("/api/CUID",this.qs.stringify(params)).then(res =>{
            if(res.data.code === "200"){
              this.$message({
                type: 'success',
                message: res.data.message
              });
              this.getFlow()
            }else{
              this.$message({
                type: 'info',
                message: res.data.message
              });
            }
            this.dialogVisible = false
          },res =>{
            console.log("请求错误")
          })
        }else{
          this.$message({
            type: 'info',
            message: "请输入流程名称"
          });
        }
      },
      toG6(label){
        this.selectRow = label
        this.selectFlowData = {}
        this.FlowData.forEach(item =>{
          if(item.ProcessName === label.ProcessName){
            if(item.ProcessStructure != 'None'){
              this.selectFlowData = JSON.parse(item.ProcessStructure)
            }else{
              this.selectFlowData = {}
            }
          }
        })
        if(this.graph){
          this.graph.destroy()
        }
        this.init()
      },
      saveFlow(){
        var params = {
          tableName:this.FlowtableName,
          ID:this.selectRow.ID,
          ProcessStructure:JSON.stringify(this.graph.save())
        }
        this.axios.put("/api/CUID",this.qs.stringify(params)).then(res => {
          if (res.data.code === "200") {
            this.$message({
              type: 'success',
              message: res.data.message
            });
            this.getFlow()
          } else {
            this.$message({
              type: 'info',
              message: res.data.message
            });
          }
        })
      },
      delFlow(){
        if(this.selectRow.ProcessName && this.selectRow.ID){
          var params = {tableName:this.FlowtableName}
          var mulId = []
          mulId.push({id:this.selectRow.ID});
          params.delete_data = JSON.stringify(mulId)
          this.$confirm('确定删除'+this.selectRow.ProcessName+'流程？', '提示', {
            distinguishCancelAndClose:true,
            type: 'warning'
          }).then(()  => {
            this.axios.delete("/api/CUID",{
              params: params
            }).then(res =>{
              if(res.data.code === "200"){
                this.$message({
                  type: 'success',
                  message: res.data.message
                });
              }
              this.getFlow()
            },res =>{
              console.log("请求错误")
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        }else{
          this.$message({
            type: 'info',
            message: '请选择一项流程进行删除'
          });
        }
      },
      init(){
        let that = this
        this.$nextTick(() => {
          //虚线动画
          G6.registerEdge('circle-running',{
            afterDraw(cfg, group) {
              // get the first shape in the group, it is the edge's path here=
              const shape = group.get('children')[0];
              // the start position of the edge's path
              const startPoint = shape.getPoint(0);

              // add red circle shape
              const circle = group.addShape('circle', {
                attrs: {
                  x: startPoint.x,
                  y: startPoint.y,
                  fill: '#1890ff',
                  r: 3,
                },
                name: 'circle-shape',
              });
              // animation for the red circle
              circle.animate(
                ratio => {
                  // the operations in each frame. Ratio ranges from 0 to 1 indicating the prograss of the animation. Returns the modified configurations
                  // get the position on the edge according to the ratio
                  const tmpPoint = shape.getPoint(ratio);
                  // returns the modified configurations here, x and y here
                  return {
                    x: tmpPoint.x,
                    y: tmpPoint.y,
                  };
                },
                {
                  repeat: true, // Whether executes the animation repeatly
                  duration: 3000, // the duration for executing once
                },
              );
            },
          },'line');
          //点击节点添加连接线
          // Register a custom behavior: click two end nodes to add an edge
          G6.registerBehavior('click-add-edge', {
            // Set the events and the corresponding responsing function for this behavior
            getEvents() {
              return {
                'node:click': 'onClick', // The event is canvas:click, the responsing function is onClick
                mousemove: 'onMousemove', // The event is mousemove, the responsing function is onMousemove
                'edge:click': 'onEdgeClick', // The event is edge:click, the responsing function is onEdgeClick
              };
            },
            // The responsing function for node:click defined in getEvents
            onClick(ev) {
              const self = this;
              const node = ev.item;
              const graph = self.graph;
              // The position where the mouse clicks
              const point = { x: ev.x, y: ev.y };
              const model = node.getModel();
              if (self.addingEdge && self.edge) {
                graph.updateItem(self.edge, {
                  target: model.id,
                });
                self.edge = null;
                self.addingEdge = false;
              } else {
                // Add anew edge, the end node is the current node user clicks
                self.edge = graph.addItem('edge', {
                  source: model.id,
                  target: model.id,
                },true);
                self.addingEdge = true;
              }
            },
            // The responsing function for mousemove defined in getEvents
            onMousemove(ev) {
              const self = this;
              // The current position the mouse clicks
              const point = { x: ev.x, y: ev.y };
              if (self.addingEdge && self.edge) {
                // Update the end node to the current node the mouse clicks
                self.graph.updateItem(self.edge, {
                  target: point,
                });
              }
            },
            // The responsing function for edge:click defined in getEvents
            onEdgeClick(ev) {
              const self = this;
              const currentEdge = ev.item;
              if (self.addingEdge && self.edge === currentEdge) {
                self.graph.removeItem(self.edge);
                self.edge = null;
                self.addingEdge = false;
              }
            },
          });
          //点击节点和连接线进行删除
          G6.registerBehavior('click-remove', {
            getEvents() {
              return {
                'node:click': 'onClick',
                'edge:click': 'onEdgeClick',
              };
            },
            onClick(ev) {
              const self = this;
              const node = ev.item;
              const graph = self.graph;
              const model = node.getModel();
              graph.removeItem(model.id,true);
            },
            onEdgeClick(ev) {
              const self = this;
              const node = ev.item;
              const model = node.getModel();
              self.graph.removeItem(model.id,true);
            },
          });
          const width = document.getElementById('container').scrollWidth;
          const height = document.getElementById('container').scrollHeight;
          that.toolbar = new G6.ToolBar()
          that.graph = new G6.Graph({
            container: 'container',
            width,
            height,
            linkCenter: true,
            plugins: [that.toolbar],
            enabledStack: true, //是否启用redo & undo 栈功能，可进行撤销和回退
            modes: {
              default: [
                'drag-canvas',
                'zoom-canvas',
                'click-select',
                'drag-node',
              ],
              addNode: ['click-add-node'],
              addEdge: ['click-add-edge'],
              remove: ['click-remove'],
            },
            layout: {
              type: 'dagre',
              nodesepFunc: d => {
                if (d.id === '3') {
                  return 500;
                }
                return 50;
              },
              ranksep: 70,
              controlPoints: true
            },
            defaultNode: {
              size: [160, 80],
              style: {
                fill: '#9EC9FF',
                stroke: '#5B8FF9',
                lineWidth: 3,
              },
              labelCfg: {
                style: {
                  fill: '#000',
                  fontSize: 18,
                },
              },
            },
            defaultEdge: {  //连接线
              type: 'circle-running',
              style: {
                endArrow: {
                  path: G6.Arrow.vee(10,20,40)
                },
                lineWidth: 2,
                stroke: '#000',
              },
            },
            nodeStateStyles: {
              selected: {
                stroke: '#d9d9d9',
                fill: '#5394ef',
              }
            },
            fitView: true,
          });

          that.graph.read(that.selectFlowData);
          that.graph.on('node:click', evt => {
            const {item, target} = evt
            const targetType = target.get('type')
            const name = target.get('name')
            if(targetType === 'text' || targetType === 'rect' || targetType === 'path' || targetType === 'circle'){
              that.clickNode = evt.item
              that.clickModel = evt.item.getModel()
            }
          })
        })
      },
      changeMode(){
        if(this.modeRadio === "拖拽模式"){
          this.graph.setMode("default");
        }else if(this.modeRadio === "连线模式"){
          this.graph.setMode("addEdge");
        }else if(this.modeRadio === "点啥删啥"){
          this.graph.setMode("remove");
        }
      },
      changeNode(text){ //修改节点 重新渲染
        let that = this
        if(that.clickModel.label){
          that.graph.updateItem(that.clickModel.id,{
            label:text
          });
        }
      },
      onDragstart(e){
        this.nodeType = e.target.attributes.type.value
      },
      onDragend(e){
        //console.log(e)
      },
      onDragover(e){
        //console.log(e)
      },
      onDragenter(e){
        //console.log(e)
      },
      onDrop(e){  //在画布内松开鼠标 添加节点
        if(this.nodeType === "triangle"){
          this.graph.addItem('node', {
            x: e.offsetX,
            y: e.offsetY,
            id: Date.now().toString(), // Generate the unique id
            label:"node",
            type:this.nodeType,
            size:[80,80]
          },true);
        }else{
          this.graph.addItem('node', {
            x: e.offsetX,
            y: e.offsetY,
            id: Date.now().toString(), // Generate the unique id
            label:"node",
            type:this.nodeType,
          },true);
        }
      }
    }
  }
</script>

<style scoped>
  .circleNode{
    display: inline-block;
    margin-right: 20px;
    width: 50px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    border: 1px solid #5B8FF9;
    background: #9EC9FF;
    border-radius: 50%;
    cursor: pointer;
  }
  .rectNode{
    display: inline-block;
    margin-right: 20px;
    width: 80px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    border: 1px solid #5B8FF9;
    background: #9EC9FF;
    cursor: pointer;
  }
  .diamondNode{
    display: inline-block;
    margin-right: 20px;
    width: 40px;
    height: 40px;
    text-align: center;
    border: 1px solid #5B8FF9;
    background: #9EC9FF;
    -ms-transform: rotateZ(45deg);
    -moz-transform: rotateZ(45deg);
    -webkit-transform: rotateZ(45deg);
    -o-transform: rotateZ(45deg);
    cursor: pointer;
  }
  .triangleNode{
    display: inline-block;
    margin-right: 20px;
    width: 0;
    height: 0;
    border-width: 0 40px 40px;
    border-style: solid;
    border-color: transparent transparent #9EC9FF;
    position: relative;
    white-space: nowrap;
    cursor: pointer;
  }
</style>
