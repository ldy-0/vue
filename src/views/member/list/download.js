const info = {
  member_truename: '昵称',
  member_nick: '姓名',
  member_mobile: '联系方式',
  recharge_rc_balance: '当前互转德分',
  available_rc_balance: '当前消费德分',
  total_predeposit: '总余额',
  member_points: '积分',
  member_points: '资产',
  member_mobile: '邀请码',
  inviter_nick: '上级',
  member_addtime: '注册时间',
};

const infoKey = Object.keys(info),
      head = infoKey.map(v => info[v]);

function getData(list){
  return list.map(v => infoKey.map(k => String(v[k])));
}

export default {
  info,
  head,
  getData,
}