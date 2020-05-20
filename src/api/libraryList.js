import request from '@/utils/request'

export function getLibList(data) { //平台题库list
    return request({
        url: '/api/v1/seller/topic',
        method: 'get',
        params: data
    })
}

export function postLibSearchTitle(data) { //平台题库按title搜索
    return request({
        url: '/api/v1/seller/search',
        method: 'post',
        data
    })
}

export function getLibClassList(data) { //平台分类list
    return request({
        url: '/api/v1/seller/classify',
        method: 'get',
        params: data
    })
}

export function getLibSearchClass(data) { //平台按分类搜索
    return request({
        url: '/api/v1/seller/search',
        method: 'get',
        params: data
    })
}

export function deleteLibList(data) { //删除平台题目
    return request({
        url: '/api/v1/seller/topic',
        method: 'delete',
        data
    })
}

export function postLibAddList(data) { //添加平台题目
    return request({
        url: '/api/v1/seller/topic',
        method: 'post',
        data
    })
}

export function putLibEditList(data) { //修改平台题目
    return request({
        url: '/api/v1/seller/topic',
        method: 'put',
        data
    })
}

export function getClassList(data) { //平台分类list
    return request({
        url: '/api/v1/seller/classify',
        method: 'get',
        params: data
    })
}

export function postAddClass(data) { //添加平台分类
    return request({
        url: '/api/v1/seller/classify',
        method: 'post',
        data
    })
}

export function putEditClass(data) { //修改平台分类
    return request({
        url: '/api/v1/seller/classify',
        method: 'put',
        data
    })
}

export function deleteClassList(data) { //删除分类
    return request({
        url: '/api/v1/seller/classify',
        method: 'delete',
        data
    })
}

export function postImportLib(data) { //导出平台题目
    return request({
        url: '/api/v1/Excel/import',
        method: 'post',
        data
    })
}

// export function postImportLib(data) { //导出平台题目
//     return request({
//         url: '/api/v1/aatest/import',
//         method: 'post',
//         data
//     })
// }