import Toast from 'react-native-root-toast'

export function toast(msg, pos) {
  if (!pos) {
    pos = Toast.positions.CENTER
  } else if (pos == 'bottom') {
    pos = Toast.positions.BOTTOM
  } else {
    pos = Toast.positions.TOP
  }
  Toast.show(msg, {position: pos})
}

export function formatDateTime(date) {
  let str = ''
  str = date.substr(0, 10)
  return str
}