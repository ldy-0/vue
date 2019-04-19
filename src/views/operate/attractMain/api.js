import request from '@/utils/request'

// about
async function setAbout(data, _this){
  let res = await request({
    url: '/api/v2/admin/about',
    method: 'post',
    data,
  });
  // console.log('res ', res);
  return res.error !== '' ? _this.$notify.error({ title: '错误信息', message: res.error, }) : _this.$notify.success({ title: '提示', message: '添加成功' })// res.data; 
}

async function getAboutList(params, _this){
  let res = await request({
    url: '/api/v2/admin/admin',
    methods: 'get',
    params,
  });

  return res.error !== '' ? _this.$notify.error({ title: '错误信息', message: res.error, }) : res; 
}

async function getAbout(params, _this){
  let res = await request({
    url: `/api/v2/common/about`,
    methods: 'get',
    params,
  });

  // console.error('about', res);
  return res.error !== '' ? _this.$notify.error({ title: '错误信息', message: res.error || res.data.error, }) : res.data; 
}

async function updateAbout(id, data, _this){
  let res = await request({
    url: `/api/v2/admin/admin/${id}`,
    method: 'put',
    data,
  });
  console.error('update ', res);
  return res.error !== '' ? _this.$notify.error({ title: '错误信息', message: res.error, }) : _this.$notify.success({ title: '提示', message: '更新成功' })// res.data; 
}

async function deleteAbout(id, data, _this){
  let res = await request({
    url: `/api/v2/admin/admin/${id}`,
    method: 'DELETE',
    data,
  });
  console.error('delete user', res.data);
  return res.error !== '' ? _this.$notify.error({ title: '错误信息', message: res.error, }) : _this.$notify.success({ title: '提示', message: '删除成功' })// res.data; 
}

export default {
  setAbout,
  getAboutList,
  getAbout,
  updateAbout,
  deleteAbout
}