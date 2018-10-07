<template>
	<div class="app-container">
		<!--预览图片开始 -->
		<el-dialog :visible.sync="dialogVisible">
			<img width="100%" :src="dialogImageUrl" alt="">
		</el-dialog>
		<!--预览图片结束 -->
		<!--顶部菜单开始 -->
		<div class="filter-container">
			<el-input style="width: 240px;" placeholder="工人姓名,手机号" v-model="listQuery.search"></el-input>
			<el-button type="primary" icon="el-icon-search" @click="handelsearch()">查询</el-button>
		</div>
		<!--顶部菜单结束 -->
		<!--中间表格开始 -->
		<el-table :data="tableData" style="width: 100%">
			<el-table-column label="编号" prop="serial">
			</el-table-column>
			<el-table-column label="工人姓名" prop="name">
			</el-table-column>
			<el-table-column label="手机号" prop="phone">
			</el-table-column>
			<el-table-column label="派单数量" prop="orders">
			</el-table-column>
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button size="mini" @click="handleDetail(scope.$index, scope.row)">查看明细</el-button>
					<el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!--中间表格结束 -->
		<!-- 表格分页开始 -->
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-sizes="[10,20,30]"
		    :page-size="listQuery.limit" layout="total, sizes, prev, pager, next" background :total="total">
		</el-pagination>
		<!--表格分页结束 -->
		<!--内容弹框开始 -->
		<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
			<el-form :rules="rules" ref="form" :model="form" label-width="120px">
				<el-form-item label="编号" prop="serial">
					<el-input v-model="form.serial"></el-input>
				</el-form-item>
				<el-form-item label="工人姓名" prop="name">
					<el-input v-model="form.name"></el-input>
				</el-form-item>
				<el-form-item label="联系方式" prop="phone">
					<el-input type="tel" v-model="form.phone"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="onSubmit(form)" :loading="isloading">保存</el-button>
					<el-button @click="dialogFormVisible = false">取消</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
		<!-- 内容弹框结束-->
		<!--工人详情弹框开始 -->
		<el-dialog title="工人详情" :visible.sync="dialogFormVisibleOrder" width="70%">
			<el-table :data="orderList" style="width: 100%">
				<el-table-column label="订单号" prop="order_sn">
				</el-table-column>
				<el-table-column label="购买者" prop="buyer_name">
				</el-table-column>
				<!-- <el-table-column label="下单时间" :formatter="formatter" prop="add_time">
				</el-table-column> -->
				<el-table-column label="下单时间" prop="created_at">
				</el-table-column>
				<el-table-column label="订单金额" prop="order_amount">
				</el-table-column>
				<el-table-column label="订单状态" :formatter="orderState" prop="order_state">
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button size="mini" type="info" @click="lookItem(scope.$index, scope.row)">查看评价</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-dialog>
		<!-- 工人相亲弹框结束-->
		<!--查看订单详情弹框开始 -->
		<el-dialog title="订单评价" :visible.sync="OrderDetailShow" width="60%">
			<el-table stripe :data="orderComment">
				<el-table-column label="评价图片">
					<template slot-scope="scope">
						<img :key="item.imgList" @click="handlePictureCardPreview(item)" v-for="item in scope.row.geval_content.imgList" :src="item" style="height: 80px; width:80px;margin-right: 10px;">
					</template>
				</el-table-column>
				<el-table-column label="评价内容" prop="geval_content.textMsg">
				</el-table-column>
				<el-table-column label="评价等级" >
					<template slot-scope="scope">
						<div class="block">
							<el-rate v-model="orderComment[0].geval_scores"  disabled :colors="['#99A9BF', '#F7BA2A', '#FF9900']">
							</el-rate>
						</div>
					</template>
				</el-table-column>
			</el-table>
			<span slot="footer" class="dialog-footer">
				<el-button @click="detailShow = false">返 回</el-button>
			</span>

		</el-dialog>
		<!--查看订单详情弹框结束 -->
	</div>

</template>
<script>
	import {
		getWorker_api,
		deleteWorker_api,
		addWorker_api,
		WorkerDetail_api,
		WorkerOrderDetail_api
	} from '@/api/seller'
	import {
		formatDate
	} from '../../../static/date.js';
	export default {
		filters: {
			textFilter: function (value) {

				if (!value) return '';
				let obj = {}
				obj = JSON.parse(value);
				// console.log(arr)
				return obj.textMsg
			},
		},
		created() {
			//获取工人列表
			this.getWorkerList()
		},
		data() {
			return {
				//工人列表
				tableData: [],
				//某个工人的派单列表
				orderList: [],
				//某个工人订单评价
				orderComment: [],
				//分页（请求参数）
				listQuery: {
					page: 1,
					limit: 10,
					search: '',
				},
				//总条数
				total: 0,
				//判断弹框是新增还是编辑
				textMap: {
					edit: '编辑',
					create: '添加'
				},
				//工人订单评价隐藏
				OrderDetailShow: false,
				//默认弹框隐藏
				dialogFormVisible: false,
				//默认工人详情弹框隐藏
				dialogFormVisibleOrder: false,
				//弹框状态
				dialogStatus: '',
				//表单内容
				form: {
					serial: '',
					name: '',
					phone: '',
				},
				//图片预览弹框是否打开
				dialogVisible: false,
				//要预览的图片
				dialogImageUrl: '',
				//表单验证规则
				rules: {
					serial: [{
							required: true,
							message: '请输工人编号',
							trigger: 'blur'
						},
						{
							min: 1,
							max: 20,
							message: '长度在1到20个字'
						}
					],
					name: [{
							required: true,
							message: '请输工人姓名',
							trigger: 'blur'
						},
						{
							min: 1,
							max: 4,
							message: '长度在1到4个字'
						}
					],

					phone: [{
						validator: phone
					}]
				},
				//正在保存
				isloading: false,
			}
		},
		methods: {
				//派单工人查询
				handelsearch(){
					console.log("查询")
					console.log(this.listQuery)
			this.getWorkerList()
				},
			//查看工人订单详情
			lookItem(idx, raw) {
				console.log(raw)
				console.log("ceshi")
				this.getWorkerOrder(raw.workerorder_id)
			},
			//格式化时间
			formatter(row, column) {
				if (!row.add_time) return '';
				let date = new Date(row.add_time * 1000);
				return formatDate(date, 'yyyy-MM-dd hh:mm')
			},
			//格式化订单状态
			orderState(row, column) {
				if (!row.order_state) return '';
				//console.log(row.order_state)
				let code = row.order_state
				let state = '';
				switch (code) {
					case '0':
						state = '已取消'
						break;
					case '20':
						state = '已支付'
						break;
					case '30':
						state = '已派单'
						break;
					case '40':
						state = '已完成'
						break;
					default:
						state = '暂无状态'
				}

				return state
			},
			//新增
			CreateItem() {
				this.form = {};
				this.dialogFormVisible = true //打开内容弹框
				this.dialogStatus = 'create'
			},
			handleImgChange(file, fileList) {
				console.log("change")
				console.log(file, fileList);
			},
			//删除图片
			handleRemove(file, fileList) {
				console.log(file, fileList);
			},
			//预览图片
			handlePictureCardPreview(file) {
				console.log("预览图")
				console.log(file)
				this.dialogImageUrl = file;
				this.dialogVisible = true;
			},
			//保存内容
			onSubmit(form) {
				//console.log( this.$refs)

				// return
				this.$refs['form'].validate((valid) => {
					if (valid) {
						this.isloading = true;
						console.log(this.form)
						addWorker_api(this.form).then(res => {
							if (res.status == 0) {
								this.dialogFormVisible = false;
								this.isloading = false;
								this.$notify({
									title: '添加工人',
									message: '添加成功',
									type: 'success',
									duration: 2000
								})
								this.getWorkerList()
							}
						})
					} else {
						console.log('error submit!!');
						return false;
					}
				});

			},
			//查看工人明细
			handleDetail(index, row) {
				console.log("查看工人详情")
				console.log(row)
				this.workDetail(row.worker_id)
				this.dialogFormVisibleOrder = true
			},
			//获取订单对应评论
			handleBuyerSay(idx, row) {
				console.log("获取用户评价")
				console.log(row)
			},
			//编辑对应项
			handleEdit(idx, row) {
				console.log("编辑")
				this.form = Object.assign({}, row) // copy obj
				console.log(this.form)
				//return
				this.dialogStatus = 'edit'
				this.dialogFormVisible = true
				this.$nextTick(() => {
					this.$refs['form'].clearValidate()
				})
			},
			//删除
			handleDelete(index, raw) {

				let sendData = {}
				sendData.workerId = raw.worker_id
				this.$confirm('确认删除该工人？')
					.then(() => {
						deleteWorker_api(sendData).then(res => {
							if (res.status == 0) {
								this.$notify({
									title: '删除工人',
									message: '删除成功',
									type: 'success',
									duration: 2000
								})
								this.getWorkerList()
							}
						})
					})
					.catch(() => {});
			},
			//改变每页条数
			handleSizeChange(val) {
				this.listQuery.limit = val
				this.getWorkerList();
			},
			//选择哪一页
			handleCurrentChange(val) {
				console.log(val)
				this.listQuery.page = val;
				this.getWorkerList();
			},
			//以下为api操作
			//获取工人列表
			getWorkerList() {
				let getData = Object.assign({}, this.listQuery);
				getWorker_api(getData).then(res => {
					if (res.status == 0) {
						this.tableData = res.data;
						this.total = res.pagination.total
					}
				})
			},
			//工人详情
			workDetail(id) {
				let sendData = Object.assign({}, this.listQuery);
				sendData = {
					worker_id: id,

				}
				WorkerDetail_api(sendData).then(res => {
					if (res.status == 0) {
						//console.log(res.data)
						this.orderList = res.data

						this.orderList.forEach((e, idx) => {
							//this.orderList[idx].json = JSON.parse(e.json)
						})
						console.log(this.orderList)

					}
				})
			},
			getWorkerOrder(id) {
				this.OrderDetailShow = true
				WorkerOrderDetail_api(id).then(res => {
					if (res.status == 0) {
						this.orderComment=[]
						console.log(res.data)
						let obj={}
						 obj= res.data.evaluate
						if(obj){
							obj.geval_content=JSON.parse(res.data.evaluate.geval_content)
							//obj.geval_scores=res.data.evaluate.geval_scores
							this.orderComment.push(obj)
							this.orderComment[0].geval_scores= Number(this.orderComment[0].geval_scores)
						}else{
							this.orderComment=[]
						}
						  console.log(this.orderComment)
						
					}
				})
			}
		},
	}
</script>
