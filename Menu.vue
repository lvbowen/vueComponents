<template>
	<div class="collapsedMenu">
		<ul id="main-nav" class="nav nav-tabs nav-stacked">
			<li class="panel" v-for="(value,i) in module">
				<a :href="'#'+value.Href" class="nav-header collapsed" :title="value.Name" data-toggle="collapse" data-parent="#main-nav"
					:class="{'active':i == activeParentMenu}">
					<p class="title">
						<i class="iconfont icon" v-html="value.IconCode"></i>
						{{value.Name}}
					</p>
					<i class="iconfont">&#xe607;</i>
				</a>
				<ul :id="value.Href" class="nav nav-list secondmenu  panel-collapse collapse" v-if="value.Item" ref="menu">
					<li v-for="(valuech,x) in value.Item.MenuData" @click="clickTab(i,valuech)" v-if="valuech.isShow">
						<a href="#" :class="{'active':valuech.Id == activeMenuId}">{{valuech.Name}}</a>
					</li>
				</ul>
			</li>
		</ul>
	</div>
</template>

<script> 
	import Vue from 'vue';
	import { mapState } from 'vuex'
    window.MyComponent = null;
    export default{       
       data:function(){
           return{
               activeParentMenu:'-1',
			   module:[],//判断权限之后应该显示的菜单
			   juriUrlList:[
				   {type:1,url:"/sett/configs/MenuPerm.json"},
				   {type:2,url:"/sett/configs/Finance.json"},
				   {type:3,url:"/sett/configs/Operate.json"},
			   ],
           }
       },
	   computed: {
			...mapState({
				activeMenuId: state => state.venue.id,
				jurisData: state => state.venue.menus,
				tabs: state => state.venue.tablist
			})
		},
		mounted:function(){//判断权限
			var _this=this;
            var type=document.cookie.replace(/(?:(?:^|.*;\s*)type\s*\=\s*([^;]*).*$)|^.*$/, "$1");
			type=1;
			var url=_this.juriUrlList.filter(item => item.type==type);
			if(url&&url.length==1&&url[0].url){
				$.getJSON(url[0].url, function (data) {
					if(data&&data.length>0){
						_this.getJruis(data);
					};
				});
			};
		},
		watch: {
			activeMenuId: function(newValue){
				var _this = this;				
				this.module.forEach((parentMenu,i) => {
					if(!newValue){
						_this.activeParentMenu = -1;
						if($(this.$refs.menu[i]).hasClass('in')){
							$(_this.$refs.menu[i]).collapse('hide');
							return false;
						}
					}else{
						parentMenu.Item.MenuData.forEach(childMenu => {
							if(childMenu.Id == newValue){
								_this.activeParentMenu = i;
								$(_this.$refs.menu[i]).collapse('show');
								return false;
							}
						})
					}					
				})
				
			}
		},
       methods:{
	       //切换tab
           clickTab:function(index,info){	
			   //打开新tab或则切换tab
			   this.$store.commit('addOrToggle',info);	
			   this.activeParentMenu = index;   		   
           },
		   getLeftMenuJruis:function(data){
			   var _this=this;
			   for(var i in _this.jurisData){
				   var _index=data.indexOf(_this.jurisData[i].ModuleCode);
				   if(_index>=0){
					   _this.module.push(_this.jurisData[i]);
				   };
			   };
		   },
		   getJruis:function(data){
				var moduleList=[];//有权限的模块
				for(var i in data){
					if(data[i].Check){
						moduleList.push(data[i].ModuleCode);
					};
				};
				this.getLeftMenuJruis(moduleList);
		   }
       }
    };
</script>