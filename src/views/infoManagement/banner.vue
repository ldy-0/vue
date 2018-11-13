<template>
	<div class="app-container">
		<!--预览图片开始 -->
		<el-dialog :visible.sync="dialogVisible">
			<img width="100%" :src="dialogImageUrl" alt="">
		</el-dialog>
		<!--预览图片结束 -->
		<!--顶部菜单开始 -->
		<div class="filter-container">
			<el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="CreateItem">添加图片</el-button>
		</div>
		<!--顶部菜单结束 -->
		<!--中间表格开始 -->
		<el-table :data="tableData" style="width: 100%">
			<el-table-column type="index" width="50">
			</el-table-column>
			<el-table-column label="图片">
				<template slot-scope="scope">
					<img @click="handlePictureCardPreview(scope.row)" :src="scope.row.banner_pic" style="width:100px">
				</template>
			</el-table-column>
		<!-- 	<el-table-column label="标题" prop='banner_title'>
			</el-table-column> -->
			<el-table-column label="跳转图片">
				<template slot-scope="scope">
					<img @click="handlePictureCardPreview(scope.row)" :src="scope.row.banner_url" style="width:100px">
				</template>
			</el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
					<el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!--中间表格结束 -->
		<!--内容弹框开始 -->
		<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
			<el-form :rules="rules" ref="form" :model="form" label-width="120px">
				<el-form-item label="图片" prop="banner_pic">
					<el-upload action="" list-type="picture-card" accept="image/*" :limit="1" :auto-upload="false" :file-list="form.banner_pic | filterUrl"
					 :on-change="handleImgChange" :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
						<i class="el-icon-plus"></i>
					</el-upload>
				</el-form-item>
			<!-- 	<el-form-item label="标题" prop="banner_title">
					<el-input v-model="form.banner_title"   placeholder="请输入标题"></el-input>
				</el-form-item> -->
				<el-form-item label="活动区域">
					<el-select v-model="form.region" placeholder="跳转类型(图片,无)" @change="changeSelect" :disabled ="dialogStatus == 'edit'">
						<el-option label="图片" value="true"></el-option>
						<el-option label="无" value="false"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="跳转图片" prop="banner_url" v-if="form.region == 'true' ">
					<el-upload action="" list-type="picture-card" accept="image/*" :limit="1" :auto-upload="false" :file-list="form.banner_url | filterUrl"
					 :on-change="handleImgChangeTwo" :on-preview="handlePictureCardPreview" :on-remove="handleRemoveTwo">
						<i class="el-icon-plus"></i>
					</el-upload>
				</el-form-item>
				<el-form-item >
					<el-button type="primary" @click="onSubmit(form)" :disabled="isUpimg" :loading="isloading">保存</el-button>
					<el-button @click="dialogFormVisible = false">取消</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
		<!-- 内容弹框结束-->
	</div>

</template>
<script>
	import {
		getBannerList_api,
		deleteBanner_api,
		addBanner_api,
		editBanner_api
	} from '@/api/seller'
	import uploadFn from '@/utils/tencent_cos'

	//初始化常量
	const form = {
		banner_pic: [],
		title: '',
		region: '',
		banner_url: [],
	}
	export default {
		created() {
			//获取首页列表
			this.getBannerList()
		},
		filters: {
			//这里进行加入url到Ui框架
			filterUrl: function(value) {
				let arr = []
				// console.log(value)
				if (!Array.isArray(value)) {
					arr.push({
							url: value
						}),
						value = arr
				} else {
					for (let i = 0; i < value.length; i++) {
						if (!value[i].url) {
							value[i] = {
								url: value[i]
							}
						}
					}
				}
				//console.log("过滤的")
				//console.log(value)
				return value
			}
		},
		data() {
			return {
				//案例列表
				tableData: [],
				//判断弹框是新增还是编辑
				textMap: {
					edit: '编辑',
					create: '添加'
				},
				//默认弹框隐藏
				dialogFormVisible: false,
				//弹框状态
				dialogStatus: '',
				//表单内容
				form: {
					banner_pic: [],
					//banner_title: '',
					region: '',
					banner_url: [],

				},
				//图片预览弹框是否打开
				dialogVisible: false,
				//要预览的图片
				dialogImageUrl: '',
				//表单验证规则
				rules: {
					banner_pic: [{
						required: true,
						message: '请上传图片',
						trigger: 'change'
					}, ],
// 					banner_title: [{
// 						required: true,
// 						message: '请填写标题',
// 						trigger: 'blur'
// 					}]
				},
				//正在上传图片
				isUpimg: false,
				//正在保存
				isloading: false,
			}
		},
		methods: {
			//新增
			CreateItem() {
				this.form= Object.assign({}, form),
				this.form.banner_pic=[];
				this.form.banner_url=[]
				console.log(this.form)
				this.dialogFormVisible = true //打开内容弹框
				this.dialogStatus = 'create'
			},
			//是否选择图片跳转
			changeSelect(val){
				console.log(val)
				if(val=='false'){
					this.form.banner_url=[]
				}
				console.log(this.form)
			},
			//上传图片
			async handleImgChange(file, fileList) {
				console.log("change")
				console.log(file, fileList);
				this.isUpimg = true
				let imgurl = await uploadFn(file.raw);
				this.isUpimg = false
				this.form.banner_pic.push({
					url: imgurl[0]
				})
				console.log(this.form)
			},
			//跳转图片
			async handleImgChangeTwo(file, fileList) {
				console.log("change")
				console.log(file, fileList);
				this.isUpimg = true
				let imgurl = await uploadFn(file.raw);
				console.log("上传完")
				console.log(imgurl)
				this.isUpimg = false
				this.form.banner_url.push({
					url: imgurl[0]
				})
				console.log(this.form)
			},
			//删除图片
			handleRemove(file, fileList) {
				console.log(file, fileList);
				console.log("删除")
				this.form.banner_pic=[]
			},
			handleRemoveTwo(file, fileList) {
				console.log(file, fileList);
				this.form.banner_url=[]
			},
			//预览图片
			handlePictureCardPreview(file) {
				this.dialogImageUrl = file.banner_pic || file.url;
				this.dialogVisible = true;
			},
			//保存内容
			onSubmit(form) {
				//console.log(this.$refs)
				this.$refs['form'].validate((valid) => {
					if (valid) {
						this.isloading = true;
						if (this.dialogStatus == 'create') {
							this.addBannerList()
						} else {
							this.editBanner()
						}

					} else {
						console.log('error submit!!');
						return false;
					}
				});

			},
			//编辑对应项
			handleEdit(row) {
                console.log(row)
				console.log("编辑")
				this.form = Object.assign({}, row) // copy obj
				console.log(this.form)
				if(this.form.banner_url){				
					this.form.region='true'
					
				}else{
					this.form.region='false'
				}
				this.dialogStatus = 'edit'
				this.dialogFormVisible = true
				this.$nextTick(() => {
					this.$refs['form'].clearValidate()
				})
			},
			//删除
			handleDelete(index, row) {
				console.log(index, row);
				this.$confirm('此操作将永久删除该图片, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {

					this.deleteBanner(row.banner_id)
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});

			},
			//以下为api操作
			//获取轮播图
			getBannerList() {
				let sendData = {}
				getBannerList_api(sendData).then(res => {
					if (res.status == 0) {
						this.tableData = res.data
						console.log(this.tableData)
					}
				})
			},
			//增加轮播图
			addBannerList() {
				console.log("图片")
				console.log(this.form)
				//return
				let sendData = {}
				sendData.banner_type = 'firstPic';
				sendData.banner_pic = this.form.banner_pic[0].url;
				sendData.banner_url=this.form.banner_url[0] ? this.form.banner_url[0].url : null;
				//sendData.banner_title=this.form.banner_title
				addBanner_api(sendData).then(res => {
					if (res.status == 0) {
						this.dialogFormVisible = false;
						this.isloading = false;
						this.$notify({
							title: '成功',
							message: '保存成功',
							type: 'success',
							duration: 2000
						})
						this.getBannerList()
					}
				})
			},

			//修改轮播图
			editBanner() {
				console.log("图片")
				console.log(this.form)
				//return
				let sendData = {}
				if(this.form.banner_pic[0].url){		
				sendData.banner_pic = this.form.banner_pic.length==0 ? '' :this.form.banner_pic[0].url;
				  if(this.form.banner_url){
					  sendData.banner_url=this.form.banner_url;
				  }else{
					  sendData.banner_url=''
				  }
				}else{
					if(Array.isArray(this.form.banner_url) && this.form.banner_url.length!=0){
						sendData.banner_url=this.form.banner_url[0].url;
					}else{
						sendData.banner_url=this.form.banner_url.length==0 ? '' :this.form.banner_url;
					}
					sendData.banner_pic = this.form.banner_pic.length==0 ? '' :this.form.banner_pic;
					
				}
				sendData.banner_type = 'firstPic';
			//	sendData.banner_title=this.form.banner_title
				sendData.banner_id = this.form.banner_id
				console.log("修改的对象")
				console.log(sendData)
				editBanner_api(sendData).then(res => {
					if (res.status == 0) {
						this.dialogFormVisible = false;
						this.isloading = false;
						this.$notify({
							title: '成功',
							message: '修改成功',
							type: 'success',
							duration: 2000
						})
						this.getBannerList()
					}else{
							this.dialogFormVisible = false;
							this.isloading = false;
							this.$notify({
								title: '成功',
								message: '修改成功',
								type: 'success',
								duration: 2000
							})
							this.getBannerList()
						
					}
				})
			},
			//删除轮播图
			deleteBanner(id) {
				deleteBanner_api(id).then(res => {
					if (res.status == 0) {
						this.$notify({
							title: '成功',
							message: '删除成功',
							type: 'success',
							duration: 2000
						})
						this.getBannerList()
					}
				})

			}
		},
	}
</script>
