import api from '@/api';
import COS from 'cos-js-sdk-v5';

const Bucket = 'threecloud-1253114089';
const Region = 'ap-shanghai';

export default {
  data(){
    return {
      cos: null,
      fileList: [],
    };
  },

  methods: {
    // get Temp Token
    async getToken(){
      let opt = {},
          res = await api.getToken();

      let param = {
          TmpSecretId: res.data.credentials.tmpSecretId,
          TmpSecretKey: res.data.credentials.tmpSecretKey,
          XCosSecurityToken: res.data.credentials.sessionToken,
          ExpiredTime: res.data.expiredTime,
        };

      opt.getAuthorization = (opts, cb) => { cb(param); };

      this.cos = new COS(opt);
    },

    // Upload
    async upload(file){
      if(!file || !file[0]) return [];

      let opt = {
        files: file.map(v => ({ Bucket, Region, Key: v.raw ? v.raw.name : v.name, Body: v.raw || v, })),
      }

      return new Promise((resolve, reject) => {
        this.cos.uploadFiles(opt, (err, data) => resolve(err || this.extractUrl(data.files)));
        // this.cos.sliceUploadFile(opt, (err, data) => resolve(err || data));
      });
    },

    changeFile(file, fileList){
      this.fileList = fileList;
    },

    extractUrl(files){
      return files.map(v => `https://${v.data.Location}`);
    },

  },

  created(){
    this.getToken();
  }
}