<style>
	.demo-table-expand {
		font-size: 0;
	}

	.demo-table-expand label {
		width: 90px;
		color: #99a9bf;
	}

	.demo-table-expand .el-form-item {
		margin-right: 0;
		margin-bottom: 0;
		width: 50%;
	}

	.el-table__expanded-cell {
		background: #fff;
		color: #000;
	}
</style>
<template>
	<el-container style="border: 1px solid #eee;margin-top: 30px;">
		<!--预览图片开始 -->
		<el-dialog :visible.sync="dialogVisible">
			<img width="100%" :src="dialogImageUrl" alt="">
		</el-dialog>
		<!--预览图片结束 -->
		<el-table :data="tableData" style="width: 100%">
			<el-table-column class="extent" type="expand">
				<template slot-scope="props">
					<el-form label-position="left" inline class="demo-table-expand">
						<el-form-item label="评价内容">
							<span>{{ props.row.geval_content.textMsg }}</span>
						</el-form-item>
						<el-form-item label="评价图片">

							<img :key="item.imgList" @click="handlePictureCardPreview(item)" v-for="item in props.row.geval_content.imgList" :src="item" style="height: 100px; width:100px;margin-right: 10px;">

						</el-form-item>
					</el-form>
				</template>
			</el-table-column>
			<el-table-column label="订单号" prop="geval_orderno">
			</el-table-column>
			<el-table-column label="商品名称" prop="geval_goodsname">
			</el-table-column>
			<el-table-column label="商品图片">
				<template slot-scope="scope">
					<img  @click="handlePictureCardPreview(scope.row.geval_goodsimage)" :src="scope.row.geval_goodsimage" style="width:50px;height: 50px;">
				</template>
			</el-table-column>
			<el-table-column label="商品价格" prop="geval_goodsprice">
			</el-table-column>
			<el-table-column label="用户姓名" prop="geval_frommembername">
			</el-table-column>
			<el-table-column label="用户头像">
				<template slot-scope="scope">
					<img  @click="handlePictureCardPreview(scope.row.geval_frommemberavatar)" :src="scope.row.geval_frommemberavatar" style="width:50px;height: 50px;">
				</template>
			</el-table-column>
			<el-table-column label="下单时间"  :formatter="formatter" prop="geval_addtime">
			</el-table-column>
			<el-table-column label="评价等级" >
				<template slot-scope="scope">
					<div class="block">
						<el-rate v-model="scope.row.geval_scores"  disabled :colors="['#99A9BF', '#F7BA2A', '#FF9900']">
						</el-rate>
					</div>
				</template>
			</el-table-column>
			<!-- <el-table-column label="受理人" prop="assignee">
			</el-table-column> -->
			<el-table-column label="操作">
				<template slot-scope="scope">
					<el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
	</el-container>
</template>



<script>
	import {
		goodEvaluate_api,
	} from '@/api/seller';
	import {
		formatDate
	} from '../../../static/date.js';
	export default {
		created() {
			//获取订单列表
			this.getEvaluateList()
		},
		data() {
			return {
				tableData: [],
				//分页（请求参数）
				listQuery: {
					page: 1,
					limit: 10,
				},
				//图片预览弹框是否打开
				dialogVisible: false,
				//要预览的图片
				dialogImageUrl: '',
			}
		},
		methods: {
			//格式化时间
			formatter(row, column) {
				if (!row.geval_addtime) return '';
				let date = new Date(row.geval_addtime * 1000);
				return formatDate(date, 'yyyy-MM-dd hh:mm')
			},
			//预览图片
			handlePictureCardPreview(file) {
				this.dialogImageUrl = file;
				this.dialogVisible = true;
			},
			//删除
			handleDelete(index, row) {
				console.log(index, row);
				
					this.$confirm('确认删除该评价？')
					.then(() => {
						
					})
					.catch(() => {});
				
			},
			
			//以下为api操作
			getEvaluateList(){
				let getData = Object.assign({}, this.listQuery);
				goodEvaluate_api(getData).then(res => {
					if (res.status == 0) {
						this.tableData = res.data;
						this.total = res.pagination.total;
						console.log()
						this.tableData.forEach((e,idx)=>{
							this.tableData[idx].geval_content= JSON.parse(this.tableData[idx].geval_content)
							this.tableData[idx].geval_scores=Number(this.tableData[idx].geval_scores)
						})
						console.log("数据")
						console.log(this.tableData)
					}
				})
			}
		},

	}
</script>
