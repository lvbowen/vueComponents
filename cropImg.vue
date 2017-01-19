<!--本地node后台裁剪并上传到本地后上传到七牛-->
<template>
	<div>
		<label class="col-md-1 col-sm-1 col-xs-1 control-label" v-html="option.labelName"></label>
    	<div class="col-md-10 col-sm-10 col-xs-10 imgJCrop">
        <div class="cropImgList">
			<div class="list_image" v-for="(item,index) in imgItems">
				<i class="iconfont" @click="deleteImg(index)">&#xe61a;</i>
                <img :src="item.src" />
				<!--<div class="mb" v-if="item.checked">封面</div>
				<div class="mb" v-else>设为封面</div>-->
			</div>
		</div>
        <img :src="option.addImg" @click="boxShowEvent" class="imageCropAdd" v-if="option.maxCount>imgItems.length" />
        <p style="clear:both;vertical-align:bottom;" v-if="option.needTip.tipOne&&option.needTip.tipOne.bool" v-html="option.needTip.tipOne.tipHtml"></p>
        <p style="clear:both;vertical-align:bottom;" v-if="option.needTip.tipTwo&&option.needTip.tipTwo.bool" v-html="option.needTip.tipTwo.tipHtml"></p>
        <div class="myVar" v-if="isShowBox">
            <div class="cropNav" v-if="option.isNeedSystemImg">
                <ul>
                    <li @click="isShowSys=true" :class="{active:isShowSys}">系统相册</li>
                    <li @click="isShowSys=false,isShowInputFile=true" :class="{active:!isShowSys}">本地上传</li>
                </ul>
            </div>
            <div class="tab-content" :class="{isNeedSys:option.isNeedSystemImg}">
                <div v-if="isShowSys&&option.isNeedSystemImg" class="SystemPhoto">
					<ol>
						<li v-for="item in option.systemImgList" @click="addImg(item.src)"><img class="syspic" :src="item.src"></li>
					</ol>
				</div>
                <div v-else class="localUp">
					<input type="file" style="display: none" @change="changeEvent" id="inputFile" />
                    <div class="zykvar1" v-if="isShowInputFile">
                        <button type="button" class="btn btn-default" @click="changeInputFile">
                            <i class="iconfont">&#xe655;</i>选择本地照片
                        </button>
                    </div>
                    <div v-else class="jcrop-holder">
                        <div class="jc-demo-box">
                            <img src="" id="targetImgId" />
                            <input type="hidden" data-id="x" name="x" />
                            <input type="hidden" data-id="y" name="y" />
                            <input type="hidden" data-id="w" name="w" />
                            <input type="hidden" data-id="h" name="h" />
                            <input type="hidden" data-id="actualW" name="w" />
                            <input type="hidden" data-id="actualH" name="h" />
                        </div>
                        <div class="jc-demo-yl">
							<div class="preview-pane" :style="smallImg.paneStyle">
								<div class="preview-container" :style="smallImg.conStyle">
									<img :src="smallImg.src" class="jcrop-preview" :style="smallImg.imgStyle" />
								</div>
							</div>
                            <div class="jcBtnGroup">
                                <p>图片预览</p>
                                <p><button type="button" class="btn btn-default" @click="changeInputFile">重新选择</button></p>
                                <p><button type="button" class="btn btn-success" @click="uploadCropImg">确认上传</button></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

	</div>
</template>
<script>
    import api from '../../sett/ApiMg.js'
	import jcropCom from '../../imageCrop/js/jquery.Jcrop.min.js'
	export default {
		data:function(){
			return {
				option:{
					labelName:'<b class="tip">*</b>上传图片',
					addImg:'../../imageCrop/images/add.png',
					maxSize: '300kb',//限制上传大小--参数必须带单位，仅支持kb和mb
					maxCount: 1,//限制上传数量
					limitType: ['.png', '.bmp', '.jpg', '.jpeg', '.gif'],
					screenshotRatio: "184/100",//截图比例-带引号-宽必须小于等于200，高必须小于等于宽
					isNeedSystemImg:false,
					needTip: {
						tipOne: {
							bool: false,
							tipHtml: "一共可以添加5张封面图"
						},
						tipTwo: {
							bool: true,
							tipHtml: '<b class="tip">*</b>图片上传大小限制300kb,支持.png、.jpg、.jpeg、.gif、.bmp格式,上传尺寸无限制'
						},
					},
					systemImgList: [
						{ src: "http://pic.hulabanban.com/7cb5087b1c974ec1a9a4e4074ff861e2" },
						{ src: "http://pic.hulabanban.com/5ff58113239549b5a1eb8a66026c948b" },
						{ src: "http://pic.hulabanban.com/065372ba66df48d2b6eb24dc88464679" },
						{ src: "http://pic.hulabanban.com/48af4ec7459d48d79ac128a1d77a65a9" },
						{ src: "http://pic.hulabanban.com/793b5f322445481183829d68044e7508" },
						{ src: "http://pic.hulabanban.com/e4d4964767ba4de7b36fa8e461259f9d" },
						{ src: "http://pic.hulabanban.com/d56e0dc005d74c37a62c12c9f7e3c67c" },
						{ src: "http://pic.hulabanban.com/b39e8fb24bae45b6b7303de488c5132e" },
						{ src: "http://pic.hulabanban.com/5acb38c6408a4f518b18ef794cdba7f4" },
						{ src: "http://pic.hulabanban.com/48c8a26cc5fe4582912b4f085b3c9d3a" },
						{ src: "http://pic.hulabanban.com/88def20a939645b5b1778c4d0dc3b17b" },
						{ src: "http://pic.hulabanban.com/Venue/bce54534e78e4dc7a9dd96961f57cac3.jpg" },
						{ src: "http://pic.hulabanban.com/Venue/69f051485779406abc37596791b9440a.jpg" },
						{ src: "http://pic.hulabanban.com/Venue/d7ec221ef02a4ec6ae4cbf4504bc4f0e.jpg" },
						{ src: "http://pic.hulabanban.com/Venue/8d827692ccae446c9f5a7628013bf3f7.jpg" },
						{ src: "http://pic.hulabanban.com/Venue/59418b270d67444f8363959e47411c0b.jpg" },
						{ src: "http://pic.hulabanban.com/Venue/35346f6cb77c46e19f854bcdfd80fb41.jpg" },
						{ src: "http://pic.hulabanban.com/Venue/bb84b43058bc406da354533efc62a18b.jpg" },
						{ src: "http://pic.hulabanban.com/Venue/872d905d21dc4524954788867fac751a.jpg" },
						{ src: "http://pic.hulabanban.com/Venue/d13f62cd9a8b457fbcec410c411ab1a9.jpg" },
						{ src: "http://pic.hulabanban.com/Venue/fbd19c618f664deca372f6cc41f70510.jpg" },
						{ src: "http://pic.hulabanban.com/Venue/a0efc74bdf7344e49a04f68951c71d7c.jpg" },
						{ src: "http://pic.hulabanban.com/Venue/afded5c405f34598bfaf1d92c887d797.jpg" },
						{ src: "http://pic.hulabanban.com/Venue/cbada2022c454ac0bf667fda5abc7004.jpg" },
						{ src: "http://pic.hulabanban.com/Venue/7cb1f721bb0943af872e0e38fad696cb.jpg" },
						{ src: "http://pic.hulabanban.com/Venue/02ae3ed4cac74a6395073afb89a86983.jpg" },
						{ src: "http://pic.hulabanban.com/Venue/89a9f23cd3944cf399395b74c61efcf0.jpg" },
						{ src: "http://pic.hulabanban.com/Venue/b041d411378949f9a270baa872d88d89.jpg" },
						{ src: "http://pic.hulabanban.com/Venue/1450daa5ae9c49f3827e6ecf01cab49f.jpg" },
						{ src: "http://pic.hulabanban.com/Venue/de55a8b724f6445a89748b4aa742e4ea.jpg" },
					],
				},
				isShowBox:false,//是否显示上传图片控件
				isShowSys:true,//是否显示系统相册
				isShowInputFile:true,//是否显示input=file控件页面
				api:[],//存放jcrop对象，销毁时使用
				cropSize:{},//当前截图选框宽，高,x,y,原图缩放/不缩放宽高
				smallImg:{
					src:null,
					imgStyle:null,
					paneStyle:null,
					conStyle:null,
				},
				canvas:{
					width:null,
					height:null,
				},
			}
		},
		props:['setOption'],
		mounted:function(){
			this.option=$.extend({},this.option,this.setOption);
		},
		computed:{
			imgItems:function(){
				return this.setOption.imgItems;
			},
		},
		methods:{
			boxShowEvent:function(){
				this.isShowBox=!this.isShowBox;
				this.isShowSys=true;
				if(this.option.isNeedSystemImg)
					this.isShowSys=true;
				else
					this.isShowInputFile=true;
			},
			addImg:function(_src){//选中系统图片
				var _this=this;
				if(_this.option.maxCount<=_this.imgItems.length){
					_this.imgItems.splice(_this.imgItems.length-1,1);
				};
				_this.imgItems.push({'src':_src});
				_this.isShowBox=false;
				_this.$emit('addImg',{imgItems:_this.imgItems,addImg:{'src':_src}});
			},
			deleteImg:function(i){
				var _this=this;
				var delImgObj=_this.imgItems[i];
				_this.imgItems.splice(i,1);
				_this.$emit('delImg',{imgItems:_this.imgItems,delImg:delImgObj});
			},
			changeInputFile:function(){
				var _this=this;
				$("#inputFile").click();
			},
			changeEvent:function(event){
				var _this=this;
				var file = event.target.files[0];
				if(file){
					if (_this.option.maxSize) {//限制了大小
						var Unit = (_this.option.maxSize.substr(_this.option.maxSize.length - 2, 2)).toLowerCase();//取到单位并转为小写
						var fileSize = file.size;
						if (Unit == "kb") {
							fileSize = fileSize / 1024;//单位kb
						} else if (Unit == "mb") {
							fileSize = fileSize / 1024 / 1024;//单位mb
						};
						if (fileSize >= (_this.option.maxSize.substr(0, _this.option.maxSize.length - 2))) {
							this.$store.commit('showMsgTip',{
								content:"图片大小必须小于" + _this.option.maxSize + "，请重新上传!",
								model:1
							});
							return false;
						};
					};
					if(_this.option.limitType.length>0){
						var extStart = file.name.lastIndexOf(".");
						var ext = file.name.substring(extStart, file.name.length).toLowerCase();
						if (_this.option.limitType.indexOf(ext) == -1) {
							this.$store.commit('showMsgTip',{
								content:'格式不正确！',
								model:1
							});
							return false;
						};
					};
					_this.isShowInputFile=false;//必须在前端判断是否符合条件之后再执行
					var img = new Image();
					img.src = URL.createObjectURL(file);
					img.onload = function (e) {
						$("#targetImgId").attr("src", img.src);//这里不能用vuejs绑定数据,异步原因
						$("#targetImgId").removeAttr("style");
						$("#targetImgId").css("maxWidth", "500px");
						_this.destroy();
						_this.Jcrop(img.src);//加载Jcrop插件
					};
				};
			},
			Jcrop:function(res){
				var _this=this;
				var boundx, boundy, cropw, croph, parw, parh;
				cropw = Number(_this.option.screenshotRatio.split('/')[0]);
				croph = Number(_this.option.screenshotRatio.split('/')[1]);
				parw = cropw + 14;
				parh = croph + 14;
				_this.destroy();
				$("#targetImgId").Jcrop({
      		  		onChange: updatePreview,
      		  		aspectRatio: cropw / croph,
				},function(){
                    _this.api.push(this);
                    var bounds = this.getBounds();
                    boundx = bounds[0];
                    boundy = bounds[1];
                    //设置显示区域尺寸
                    _this.smallImg.paneStyle={width: parw + "px",height: parh + "px"};
                    _this.smallImg.conStyle={width: cropw + "px",height: croph + "px"};
                    //初始化画布
                    _this.canvas.width = this.ui.holder.width();
                    _this.canvas.height = this.ui.holder.height();
					_this.smallImg.src=res;
      		 		this.setSelect([(_this.canvas.width - cropw) / 2, (_this.canvas.height - croph) / 2, (_this.canvas.width - cropw) / 2 + cropw, (_this.canvas.height - croph) / 2 + croph]);
				});
				function updatePreview(c, a, b, d){
                    if (parseInt(c.w) > 0) {
                        var rx = cropw / c.w;
                        var ry = croph / c.h;
                        _this.smallImg.imgStyle={
                            width: Math.round(rx * boundx) + 'px',
                            height: Math.round(ry * boundy) + 'px',
                            marginLeft: '-' + Math.round(rx * c.x) + 'px',
                            marginTop: '-' + Math.round(ry * c.y) + 'px'
                        };
                        //初始化裁剪参数
                        _this.cropSize.w = c.w;
                        _this.cropSize.h = c.h;
                        _this.cropSize.x = c.x;
                        _this.cropSize.y = c.y;
						_this.cropSize.currentW=$("#targetImgId").width();
						_this.cropSize.currentH=$("#targetImgId").height();
                    };
				};
			},
			uploadCropImg:function(){
                const _this=this;
                var file = document.getElementById("inputFile");
                var formData = new FormData();
                formData.append('file',file.files[0]);
                formData.append('cropSize',JSON.stringify(_this.cropSize));
                api.upload.post.imgCropUpload({
                    data:formData,
                    callBack: res => {
						var data=JSON.parse(res.data);
                        if(data.resultType!=0){
							this.$store.commit('showMsgTip',{
								content:'上传失败！',
								model:1
							});
                        }else{
							_this.addImg(data.AppendData);
                        };
                    },
                });
			},
            destroy: function () {
				var _this=this;
                if (_this.api.length>0) {
                    //销毁截图对象
                    for (var i = 0; i < _this.api.length; i++) {
                        _this.api[i].destroy();
                    };
                    _this.api = [];
                };
            },
		},
	}
</script>
<style scoped>
	@import '../../imageCrop/css/jquery.Jcrop.min.css';
	ul,ol{margin:0;padding:0;}
/*选中/上传图片样式*/
.imgJCrop .cropImgList{display: inline-block;}
.imgJCrop .cropImgList .list_image {width: 119px;height: 119px;margin-right: 6px;position: relative;float: left;overflow: hidden;}
.imgJCrop .cropImgList .list_image i {position: absolute;right: 4px;top: 4px;cursor: pointer;color: #eee;width: 30px;height: 30px;border-radius: 30px;
                                background: #000;text-align: center;line-height: 30px;opacity: .7;box-shadow: 0 0 3px #222;}
.imgJCrop .cropImgList .list_image img {max-width: 100%;max-height: 100%;}
/*.imgJCrop .cropImgList .list_image div.mb {position: absolute;bottom: 0;left: 0;width: 100%;height: 20px;background: #c7c7c7;text-align: center;cursor: pointer;}
.imgJCrop .cropImgList .list_image div.mb2 {background: #2fcb78;color: #fff;}*/
/*系统相册，上传本地图片css样式*/
.imgJCrop .myVar {display:inline-block;border: 1px solid #aaa; background: #ddd; margin-top: 10px; overflow: hidden; }
/*左侧导航*/
.imgJCrop .myVar .cropNav { background: #ddd;float: left; }
.imgJCrop .myVar .cropNav ul{padding:0;}
.imgJCrop .myVar .cropNav ul li {width:122px;line-height:36px;text-align:center;list-style-type: none;cursor:pointer;display:block;color:#337ab7;}
.imgJCrop .myVar .cropNav ul li.active{background:#fff;color:#666;}
.imgJCrop .myVar .tab-content { width: 760px; padding: 5px; background: #fff;overflow:hidden; }
.imgJCrop .myVar .isNeedSys{margin-left: 122px;}
/*右侧系统图列表*/
.imgJCrop .myVar .tab-content .SystemPhoto{height:330px;overflow-x:hidden;}
.imgJCrop .myVar .tab-content .SystemPhoto ol li { width: 140px; height: 140px; float: left; overflow: hidden; cursor: pointer; margin: 0 0 6px 6px; position: relative; }
.imgJCrop .myVar .tab-content .SystemPhoto ol li.active { border: 5px solid #2fcb78; }
.imgJCrop .myVar .tab-content .SystemPhoto ol li.active i { display: block; width: 30px; height: 30px; line-height: 35px; background: #2fcb78; color: #fff; padding-left: 4px; }
.imgJCrop .myVar .tab-content .SystemPhoto ol li img { width: 100%; height: 100%; }
/*右侧本地图片选取*/
.imgJCrop .zykvar1{ min-height: 330px; position: relative; }
.imgJCrop .zykvar1 .btn { background: #e8e8e8; position: absolute; top: 50%; margin-top: -17px; left: 50%; margin-left: -62px; }
.imgJCrop .jc-demo-box { width: 530px; min-height: 332px; float: left; padding: 15px; border-right: 1px solid #aaa; }
.imgJCrop .jc-demo-yl {float: left;width: calc(100% - 535px);min-height: 332px;position:relative;}
.imgJCrop .jc-demo-yl .jcBtnGroup{position: absolute;bottom: 25px;width: 100%;}
.imgJCrop .jc-demo-yl p { text-align: center; margin: 8px 0; }
.imgJCrop .jc-demo-yl p button { font-size: 12px; padding: 6px 30px; border-radius: 0 !important; }
/*添加功能图片*/
.imgJCrop .imageCropAdd{cursor: pointer; vertical-align: top;max-height:119px; }
.imgJCrop .jc-demo-yl .preview-pane { width: 200px; height: 120px;overflow: hidden; margin: 40px auto 0;padding: 6px; border: 1px rgba(0,0,0,.4) solid; background-color: white; -webkit-border-radius: 6px; -moz-border-radius: 6px; border-radius: 6px; -webkit-box-shadow: 1px 1px 5px 2px rgba(0, 0, 0, 0.2); -moz-box-shadow: 1px 1px 5px 2px rgba(0, 0, 0, 0.2); box-shadow: 1px 1px 5px 2px rgba(0, 0, 0, 0.2); }
.imgJCrop .preview-pane .preview-container { width: 184px; height: 100px; overflow: hidden; }
</style>