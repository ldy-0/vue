import editor from '@/components/Tinymce'
export default {
  components: {
    editor
  },

  data () {
    return {
      content: '',
      editorConfig: {
        height: 200,
        menu: ''
      },
      showComponent: true,
      showEditor: true
    }
  },

  // watch: {
  //   'formForNotive.goodsDescribe'(v1, v2) {
  //     console.log(`new: ${JSON.stringify(v1)} old: ${v2}`)
  //   }
  // } 
}