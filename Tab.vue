<template>
	<div class="wwtab">
		<div class="wwtab-head">
			<div class="left-menu" @click="moveLeft()"><i class="comfont">&#xe601;</i></div>
			<div class="tab-menu" ref="tabs">
				<ul class="wwtab-list" v-bind:style="{ marginLeft: left+'px' }" role="tablist">
					<li :class="{on:tab.Id == activeTabId}" data-page="true" :title="tab.title" :edit="tab.edit" :data-tab-id="tab.Id" v-for="(tab,index) in tabs"
						@click="toggleActiveTab(tab.Id,tab.ComName,index)" ref="tabItem">
						{{tab.Name}}
						<i class='comfont' @click.stop.prevent="closeTab(tab.Id,index)">&#xe608;</i>
					</li>
				</ul>
			</div>
			<div class="right-menu">
				<i class="comfont LRight" @click="moveRight()">&#xe602;</i>
			</div>

			<div class="dropdown">
				<span class="dropdown-toggle" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
					<i class="comfont">&#xe609;</i>
				</span>
				<div class="triangle">
					<div class="triangle2"></div>
				</div>
				<ul class="dropdown-menu" data-id="tabShortMenu" aria-labelledby="dropdownMenu1">
					<li data-id="tab.Id" class="nore" v-for="(tab,index) in tabs">
						<a @click="toggleActiveTab(tab.Id,tab.ComName,index)">{{ tab.Name }}</a>
					</li>
					<li class="allClose"><a @click="closeAll()">关闭所有页面</a></li>
				</ul>
			</div>

		</div>
		<ul class="wwtab-body">
			<div class="tab-welcome" v-if="!activeTabId"></div>
			<template v-else>
				<li :class="{on:tab.Id == activeTabId}" data-page="true" :data-tab-contentid="activeTabId" v-for="(tab,i) in tabs">
					<component :is="tab.ComName" :param="tab.param" :menuId="tab.Id" :menuIndex="i"></component>
				</li>
			</template>
		</ul>
	</div>

</template>

<script>
	import { mapState } from 'vuex'
    export default{
	   data:function(){
		   return{
			   left: 0,
			   tabMarginLeft: 0,//单个tab的margin-left
			   rightIconWidth: 55,//向右按钮宽度
			   headMenu: '',
			   isMove: false
		   }
	   },
	   computed:{
		   ...mapState({
				activeTabId: state => state.venue.id,
				tabs: state => state.venue.tablist,
				currentView: state => state.venue.currentView
			})
       },
       watch: {
			activeTabId: function (newValue) {
				var _this = this;
				this.tabs.forEach((item,index)=>{
					if(item.Id == newValue)
					_this.$nextTick(function(){
						_this.moveToView(index);
					});
				});
			}
		},
       methods:{
           closeTab:function(id,index){	  
			   this.$store.commit('closeTab', {
				   id:id,//当前关闭的id
				   index: index,
				   size: 1,
			   });					
           },
		   closeAll:function(){
			   //关闭全部
			   this.$store.commit('closeTab', {
				   index: 0,
				   size: this.tabs.length
			   });
			   this.$store.commit('toggleTab',{
					comName: '',
					id: ''
				});
			   this.left = 0;
		   },
		   moveToView: function(index){
			   //如果活动tab在可视区域外，则划入视线
			   var minLeft = this.$refs.tabs.offsetWidth - this.$refs.tabItem[0].clientWidth*this.tabs.length,//margin-left最小值
			   	left = 0-index * (this.$refs.tabItem[0].clientWidth),//活动tab在最左边时margin-left值
				right = this.$refs.tabs.offsetWidth - (index+1) * this.$refs.tabItem[0].clientWidth,//活动tab在最右边时margin-left值
				leftDistance,rightDistance;//左右间距
				minLeft>0?minLeft=0:'';
				if(right>0)right=0;
				if(left<minLeft)left=minLeft;
				//距离左边近则滑向左边
				leftDistance = this.left-left;
				rightDistance = this.left-right;
				if(leftDistance < rightDistance){
					this.move(left);
				}else {
					this.move(right);
				}		
		   },
		   toggleActiveTab:function(id,com,index){
			   //切换tab
			   this.$store.commit('toggleTab',{
				   ComName: com,
				   Id: id
			   });
		   },
		   move:function(target){
			   //滑动
			   var _this = this,
			   speed = (target - _this.left)/10;
			   var timer;
			   timer = setInterval(function(){
				   _this.left = Number((Number((_this.left).toFixed(1))+speed).toFixed(1));
				   //console.log(_this.left);
				   if(_this.left == target){
					   clearInterval(timer);
					   _this.isMove = false;
				   }
			   },15)
		   },
		
		   moveLeft:function(){
			   //左滑
			   if(this.isMove == true || !this.$refs.tabItem || !this.$refs.tabItem.length)
			   	return '';   
			   var minLeft = this.$refs.tabs.offsetWidth - this.$refs.tabItem[0].clientWidth * this.tabs.length,
			   		target = this.left-this.$refs.tabItem[0].clientWidth;
				this.isMove = true;
			   
			   minLeft>0?minLeft=0:'';
			   target<minLeft?target=minLeft:'';
			   if(this.left!=target){
				   this.move(target);
			   }else{
				   this.isMove = false;
			   }
		   },
		   moveRight:function(){
			   //右滑
			   if(this.isMove == true || !this.$refs.tabItem || !this.$refs.tabItem.length)
			   	return '';  
			   var maxLeft = 0,
			   		target = this.left + this.$refs.tabItem[0].clientWidth;
				this.isMove = true;
			   
			   maxLeft>0?maxLeft=0:'';
			   target>maxLeft?target=maxLeft:'';
			   if(this.left!=target){
				   this.move(target);
			   }else{
				   this.isMove = false;
			   }
		   }
       }
    };
</script>