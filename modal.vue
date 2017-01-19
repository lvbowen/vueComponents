<template>
    <div class="modal fade" :id="id" data-tab-contentid="vetabid" style="z-index:1041;" role="dialog" aria-labelledby="mymodalLabel">
        <div class="modal-dialog" role="document">
            <div class="modal-content" :class="{'small-content':param&&param.boxType}">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><i aria-hidden="true" class="iconfont">&#xe61a;</i></button>
                    <h4 class="modal-title">{{title}}</h4>
                </div>
                <div class="modal-body">
                    <slot></slot>
                </div>
            </div>
        </div>
    </div>
</template>



<script>
    import { mapState } from 'vuex'
    import { mapMutations } from 'vuex'
    export default {
        data(){
            return{
                id: "myModal001"
            }
        },
        computed:{
            ...mapState({
				//isShow: state => state.basic.modal.isShow,
				param: state => state.basic.modal.param,
				title: state => state.basic.modal.title,
				view: state => state.basic.modal.view
			})
        },
        // watch:{
        //     isShow: function(newValue){
        //         if(newValue){
        //             $("#"+this.id).modal('show');
        //         }else{
        //             $("#"+this.id).modal('hide');
        //         }
        //     }
        // },
        // methods:{
        //     ...mapMutations([
        //         'closeModal'
        //     ]),
        // }
  }  
</script>
<style scoped>
    .small-content{width:400px;margin:0 auto;}
</style>