<template>
	<div>
	    <div class="dropdown drbot">
	        <button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown">
	            <em>{{initCity.Province.text}}</em><i class="iconfont">&#xe613;</i>
	        </button>
	        <ul class="dropdown-menu" role="menu">
	            <li v-for='province in areaTree' @click="setProvince(province)" :areaId="province.areaId"><a href="##">{{province.text}}</a></li>
	        </ul>
	    </div>
	    <div class="dropdown drbot" v-if="isNeedShowCity">
	        <button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown">
	            <em>{{initCity.City.text}}</em><i class="iconfont">&#xe613;</i>
	        </button>
	        <ul class="dropdown-menu" role="menu">
	            <li><a href="##">请先选择省份</a></li>
	            <li v-for='city in cityDataList' @click="setCity(city)" :areaId="city.areaId"><a href="##">{{city.text}}</a></li>
	        </ul>
	    </div>
	    <div class="dropdown drbot" v-if="!isHideDistrict">
	        <button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown">
	            <em>{{initCity.District.text}}</em><i class="iconfont">&#xe613;</i>
	        </button>
	        <ul class="dropdown-menu" role="menu">
	            <li><a href="##">请先选择城市</a></li>
	            <li v-for='district in districtDataList' @click="setDistrict(district)" :areaId="district.areaId"><a href="##">{{district.text}}</a></li>
	        </ul>
	    </div>
	</div>
</template>
<script>
import areaJson from '../../sett/Areatree.js'
export default {
  data:function(){
    return {
        areaTree:window.areaTrea,
        cityDataList:null,
        districtDataList:null,
		initCity:{
			Province:{text:'省',areaId:'',nextAreaId:''},
			City:{text:'市',areaId:'',nextAreaId:''},
			District:{text:'区',areaId:'',nextAreaId:''},
		},
        isNeedShowCity:true,//是否需要显示城市下拉
		isHideDistrict:false,//是否需要隐藏区域下拉
		levelTree:[],
    };
  },
  props:['initOpt'],
  computed:{
	  deInitCity:function(){
		  return this.initOpt;
	  },
  },
  watch:{
	deInitCity:function(){
	  this.initShowText(this.deInitCity);
	},
  },
  mounted:function(){
	  this.initShowText(this.initOpt);
  },
  methods:{
	useTextGetId:function(text,minTree){
		var _obj=minTree.filter(item=>item.text==text);
		if(_obj&&_obj.length==1){
			return _obj[0];
		}else{
			return false;
		};
	},//根据传过来的文字，获得当前名字的areaid
    initShowText:function(_obj){
		var _this=this;
		if(_obj&&_obj.Province){
			var _proObj=_this.useTextGetId(_obj.Province,_this.areaTree);
			if(_proObj){
				_this.setProvince(_proObj,function(){
					if(_obj.City){
						var _cityObj=_this.useTextGetId(_obj.City,_this.cityDataList);
						if(_cityObj){
							_this.setCity(_cityObj);
						};
					};
				});
			};
			if(_obj.District)
				_this.initCity.District.text=_obj.District;
		}else{
			_this.initCity={
				Province:{text:'省',areaId:'',nextAreaId:''},
				City:{text:'市',areaId:'',nextAreaId:''},
				District:{text:'区',areaId:'',nextAreaId:''},
			};
			_this.cityDataList=null;
			_this.districtDataList=null;
		};
		if(_obj&&_obj.isHideDistrict){
			_this.isHideDistrict=_obj.isHideDistrict;
		};
	},//初始化显示的内容
	getAllTree:function(obj){
		var _this=this;
		if(obj&&obj.length>0){
			for(var i in obj){
				_this.levelTree.push({text:obj[i].text,areaId:obj[i].areaId});
				if(obj[i].nodes&&obj[i].nodes.length>0){
					_this.getAllTree(obj[i].nodes);
				};
			};
		};
	},//选中省份时，获取该省下面的城市及区域列表，并列显示，---场馆查询使用
  	getDataList:function(_id,tree,type){
  		for (var j = 0; j < tree.length; j++) {
            var _sub = tree[j];
            if (_sub.areaId == _id) {
            	if(type=="province"){
            		if(this.isNeedShowCity)
                		this.cityDataList = _sub.nodes;
                	else
                		this.districtDataList = _sub.nodes[0].nodes;
            	}
                else if(type=="city"){
                	this.districtDataList = _sub.nodes;
                };
                break;
            };
        };
  	},//设置下一个下拉列表数据
  	setProvince:function(obj,res){
		var _this=this;
  		_this.districtDataList=null;
        var s1 = obj.text.indexOf("市");
        var s2 = obj.text.indexOf("特别行政区");
        if (s1 >= 0 || s2 >= 0) {//市或特别行政区没有市级
            _this.isNeedShowCity=false;           
        } else {
            _this.isNeedShowCity=true;
        };
  		_this.getDataList(obj.areaId,_this.areaTree,"province");
  		_this.initCity={
        	Province:{text:obj.text,areaId:obj.areaId,nextAreaId:_this.cityDataList},
        	City:{text:'市',areaId:'',nextAreaId:''},
        	District:{text:'区',areaId:'',nextAreaId:''},
  		};
  		if(!_this.isNeedShowCity){
  			_this.initCity.Province.nextAreaId=_this.districtDataList;
  			_this.initCity.City={text:'市',areaId:'',nextAreaId:''};
        	_this.$emit('getAreaData',{
				nextTreeList:_this.districtDataList,
				currentData:{
					province:{text:obj.text,areaId:obj.areaId},
					city:{text:obj.text,areaId:obj.areaId},//如果不显示城市则在当前选中的这个数据就显示省
				},
			});
  		}else{
			_this.levelTree=[];
			_this.getAllTree(_this.cityDataList);
        	_this.$emit('getAreaData',{
				nextTreeList:_this.cityDataList,
				allTreeList:_this.levelTree,//市+区数组列表
				currentData:{
					province:{text:obj.text,areaId:obj.areaId}
				},
			});
        };
		if(res&&typeof res=="function")
			res();
  	},//点击省份时触发
  	setCity:function(obj){
  		var _pid=this.initCity.Province.areaId;
  		var _pText=this.initCity.Province.text;
  		if(_pid)
  			this.getDataList(_pid,this.areaTree,"city");
  		if(obj.areaId)
  			this.getDataList(obj.areaId,this.districtDataList,"city");
  		this.initCity.City={text:obj.text,areaId:obj.areaId,nextAreaId:this.districtDataList};
  		this.initCity.District={text:'区',areaId:'',nextAreaId:''};
        this.$emit('getAreaData',{
			nextTreeList:this.districtDataList,
			allTreeList:this.districtDataList,//所有区数组列表
			currentData:{
				province:{text:_pText,areaId:_pid},
				city:{text:obj.text,areaId:obj.areaId},
			},
		});
  	},//点击城市时触发
  	setDistrict:function(obj){
  		var _pObj=this.initCity.Province;
  		var _cObj=this.initCity.City;
  		this.initCity.District={text:obj.text,areaId:obj.areaId,nextAreaId:obj.areaId};
		var _curData={
			province:{text:_pObj.text,areaId:_pObj.areaId},
			district:{text:obj.text,areaId:obj.areaId},
		};
		if(_cObj.areaId)
			_curData.city={text:_cObj.text,areaId:_cObj.areaId};
        this.$emit('getAreaData',{
			nextTreeList:[obj],
			allTreeList:[obj],
			currentData:_curData,
		});
  	},//点击区域时触发
  },
}
</script>
<style scoped>
	form .drbot>button.dropdown-toggle{padding:0 35px 0 12px;}
	div.dropdown>ul.dropdown-menu{max-height:200px;overflow-x:hidden;}
</style>