<template>
	<div class='MBBlack' v-if="showMsgTip">
		<div class="black"></div>
		<div class='Del_PromptBox' :class="{'tip1':msgTipOpt.model==1,'tip2':msgTipOpt.model==2 || !msgTipOpt.model,'tip3':msgTipOpt.model==3}">
			<template v-if="msgTipOpt.model&&msgTipOpt.model==1">
				<div class='MBHead'>
					<i class="iconfont success" v-if="!msgTipOpt.picModel || msgTipOpt.picModel == 2">&#xe60b;</i>				
					{{msgTipOpt.title}}
				</div>
				<div class='MBContent'>
					{{msgTipOpt.content}}
				</div>
			</template>
			<template v-else-if="msgTipOpt.model==2 || !msgTipOpt.model">
				<div class='MBHead'>	
					<i class="iconfont icon-close" @click="closeTip()">&#xe61a;</i>
				</div>
				<div class='MBContent'>				
					{{msgTipOpt.content}}
				</div>
			</template>
			<template v-else-if="msgTipOpt.model==3">
				<div class='MBHead'>	
					{{msgTipOpt.title}}
					<i class="iconfont icon-close" @click="closeTip()">&#xe61a;</i>
				</div>
				<div class='MBContent'>				
					<textarea :placeholder="msgTipOpt.placeholder"></textarea>
				</div>
			</template>
			<div class='MBFooter'>
				<button type='button' class='btn btn-success' @click="closeTip(1)">确定</button>
				<button type='button' class='btn' :class="{'btn-default':msgTipOpt.model==3}" @click="closeTip(2)" v-if="!msgTipOpt.model || msgTipOpt.model==2|| msgTipOpt.model==3">取消</button>
			</div>
	</div>
</template>
<script>
	import {mapState} from 'vuex'
	export default {
		computed:{
			...mapState({
				showMsgTip:state=>state.basic.tip.showMsgTip,
				msgTipOpt:state=>state.basic.tip.msgTipOpt,
			})
		},
		methods:{
			closeTip:function(type){
				this.$store.commit('hideMsgTip',type);
			},
		},
	}
</script>