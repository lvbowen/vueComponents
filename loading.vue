<template>
	<div class='MBBlack' :class="'loading '+'loading-'+isSHow">
        <!--<div class="loading">-->
		<div class="Del_PromptBox tip1">
			<div class="spinner8 loadingIcon MBContent">
				<div class="spinner-container container1">
					<div class="circle1">&nbsp;</div>
					<div class="circle2">&nbsp;</div>
					<div class="circle3">&nbsp;</div>
					<div class="circle4">&nbsp;</div>
				</div>
				<div class="spinner-container container2">
					<div class="circle1">&nbsp;</div>
					<div class="circle2">&nbsp;</div>
					<div class="circle3">&nbsp;</div>
					<div class="circle4">&nbsp;</div>
				</div>
				<div class="spinner-container container3">
					<div class="circle1">&nbsp;</div>
					<div class="circle2">&nbsp;</div>
					<div class="circle3">&nbsp;</div>
					<div class="circle4">&nbsp;</div>
				</div>
			</div>
			<div class="MBFooter">
				{{tip || '正在加载'}}...
			</div>
		</div>
	</div>
</template>
<script>
 import {setTimeouts,setIntervals,getTimeoutList} from '../../sett/timerMg.js'
 import { mapState } from 'vuex'
    export default{
		computed: {
			...mapState({
				show: state => state.basic.loading,
				tip: state => state.basic.loadingTip
			}),
			isSHow:function(){
				if(this.show)
					return "show";
				else
					return "hide";
			}
		}
    };
</script>