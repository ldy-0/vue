import request from '@/utils/request';

//商品
export function goods_api(type, data) {
    if (type == 'get') return request.get('/api/v1/admin/goodscommon', { params: data });
    if (type == 'detail') return request.get('/api/v1/admin/goodscommon/' + data.id, { params: data });
    if (type == 'post') return request.post('/api/v1/admin/goodscommon', data);
    if (type == 'put') return request.put('/api/v1/admin/goodscommon/' + data.id, data);
    if (type == 'delete') return request.delete('/api/v1/admin/goodscommon/' + data.id, { data: data });
    if (type == 'upDown') return request.get('/api/v1/admin/goodscommon/' + data.id + '/edit', { params: data });
}