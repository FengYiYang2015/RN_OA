let host = 'http://172.30.10.177:8080/ZHYOASystem'
let baseUri = `${host}/`

export default {
  host,
  baseUri,
  mobileLogin: 'account/login.do',
  AwaitData: 'task/pendingTask.do',   //待办
  underWay: 'task/unFinishedTask.do',   //进行中
  completed: 'task/finishedTask.do',    //已完成
  terminated: 'task/terminatedTask.do',  //已终止
  staffBorrowing: 'TEmpBorrowingController/selectInfo.do',
  agreeApprove: 'task/processApproval.do',
  approveCourse: 'task/listHistoryComment.do'
}