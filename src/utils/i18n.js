import { getNames } from '@/utils/auth'
// translate router.meta.title, be used in breadcrumb sidebar tagsview
export function generateTitle(title) {
  const hasKey = this.$te('route.' + title)
  const translatedTitle = this.$t('route.' + title) // $t :this method from vue-i18n, inject in @/lang/index.js

  if (hasKey) {
    return translatedTitle
  }
  // signIn edit names
  if( getNames('names') && ['student', 'course', 'teacher'].indexOf(title) !== -1 ) {
    let names = JSON.parse(getNames('names'));
    if(title === 'student') return `${names.words_name1}列表`;
    if(title === 'course') return `${names.words_name2}列表`;
    if(title === 'teacher') return `${names.words_name3}列表`;
  }

  return title
}
