import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Button,
  Modal,
  Alert,
  Dimensions,
  ScrollView
} from 'react-native'
import publicNet from '../../lib/publicNet'
import host from '../../lib/apiConfig'
import apiConfig from '../../lib/apiConfig'
import { formatDateTime } from '../../lib/core'
import {
  StackNavigator,
  TabNavigator
} from 'react-navigation'
import TabBar from '../../components/TabBar'

class StaffBorrowingScreen extends Component {
  static navigationOptions = {
    headerTitle: '',
    headerStyle: {
      height: 0
    },
    headerRight: (
      <Button
        onPress={() => Alert.alert(
          '温馨提示',
          '提示的内容详情',
          [
            { text: '取消', onPress: () => console.log('取消执行的操作') },
            { text: '确定', onPress: () => console.log('确定执行的操作') }
          ]
        )}
        color='#65C0E4'
        title='Info'
      />
    )
  }

  constructor(props) {
    super(props)
    this.state = {
      animationType: 'slide',
      modalVisible: false,
      transparent: true,
      borrowingData: {},
      formInform: null
    }
  }

  componentDidMount() {
    this.getBorrowData()
  }

  getBorrowData() {
    let borrowParams = this.props.navigation.state.params.staffBorrowing
    console.log(borrowParams.taskId+'...staffbrrowing')
    let formData = new FormData();
    formData.append('taskId', borrowParams.taskId)
    formData.append('flowId', borrowParams.flowId)
    console.log(formData)
    let url = `${apiConfig.baseUri}${apiConfig.staffBorrowing}`
    console.log(url)
    publicNet.postJson(url, formData, (responseJson) => {
      if (responseJson.success) {
        console.log(responseJson)
        this.setState({
          borrowingData: responseJson.allResult || {},
          formInform: Object.assign({}, {flowId: borrowParams.flowId}, {userId: '048419'}, {taskId: borrowParams.taskId}, {processInstanceId: borrowParams.processInstanceId})
        })
        console.log(this.state.formInform)
      } else {
        toast(responseJson.errorInfo)
      }
    })
  }

  borrowingDetails() {
    const {borrowingData} = this.state
    let borrowArr = Object.keys(borrowingData)
    if ( borrowArr.length == 0 ) {
      return
    }else {
      return (
        <View style={styles.content}>
          <View style={styles.rows}>
            <Text>单号：{borrowingData.flowId}</Text>
            <Text>日期：{borrowingData.submissionDate}</Text>
          </View>
          <View style={styles.infos}>
            <View>
              <Text style={styles.infoItem}>发起人：</Text>
              <Text style={styles.infoItem}>发起人部门：</Text>
              <Text style={styles.infoItem}>部门审核：</Text>
              <Text style={styles.infoItem}>借支公司：</Text>
              <Text style={styles.infoItem}>总金额：</Text>
              <Text style={styles.infoItem}>财务会计：</Text>
              <Text style={styles.infoItem}>财务经理：</Text>
              <Text style={styles.infoItem}>资金部门：</Text>
              <Text style={styles.infoItem}>资金项目：</Text>
              <Text style={styles.infoItem}>借支金额：</Text>
              <Text style={styles.infoItem}>预计还款日期：</Text>
              <Text style={styles.infoItem}>付款方式：</Text>
              <Text style={styles.infoItem}>收款人：</Text>
              <Text style={styles.infoItem}>开户行编号：</Text>
              <Text style={styles.infoItem}>开户行：</Text>
              <Text style={styles.infoItem}>账号：</Text>
              <Text style={styles.infoItem}>币种：</Text>
            </View>
            <View>
              <Text style={styles.infoItem}>{borrowingData.proposerId} &nbsp;{borrowingData.proposer}</Text>
              <Text style={styles.infoItem}>{borrowingData.propDeptId} &nbsp;{borrowingData.propDeptName}</Text>
              <Text style={styles.infoItem}>{borrowingData.deptAuditor1Id} &nbsp;{borrowingData.deptAuditor1}</Text>
              <Text style={styles.infoItem}>{borrowingData.borrowCompanyId} &nbsp;{borrowingData.borrowCompanyName}</Text>
              <Text style={styles.infoItem}>{borrowingData.totalAmount}</Text>
              <Text style={styles.infoItem}>{borrowingData.finAccountId} &nbsp;{borrowingData.finAccountName}</Text>
              <Text style={styles.infoItem}>{borrowingData.finManagerId} &nbsp;{borrowingData.finManagerName}</Text>
              <Text style={styles.infoItem}>{borrowingData.fundDeptId} &nbsp;{borrowingData.fundDeptName}</Text>
              <Text style={styles.infoItem}>{borrowingData.fundsTypeId} &nbsp;{borrowingData.fundsTypeName}</Text>
              <Text style={styles.infoItem}>{borrowingData.borrowAmount}</Text>
              <Text style={styles.infoItem}>{formatDateTime(borrowingData.expectRepaymentDate ? borrowingData.expectRepaymentDate : '未填写')}</Text>
              <Text style={styles.infoItem}>{borrowingData.payWay}</Text>
              <Text style={styles.infoItem}>{borrowingData.payeeId} &nbsp;{borrowingData.payeeName}</Text>
              <Text style={styles.infoItem}>{borrowingData.bankOfDepositId}</Text>
              <Text style={styles.infoItem}>{borrowingData.bankOfDeposit}</Text>
              <Text style={styles.infoItem}>{borrowingData.openBankNum}</Text>
              <Text style={styles.infoItem}>{borrowingData.moneyClass}</Text>
            </View>
          </View>
          <Text style={styles.infoItem} numberOfLines={3}>备注：{borrowingData.remarks}</Text>
          <Text numberOfLines={5}>借款用途：{borrowingData.use}</Text>
        </View>
      )
    }
  }

  render() {
    const { navigate } = this.props.navigation
    let isDisabled = this.props.navigation.state.params.isDisabled
    let statusType = this.props.navigation.state.params.statusType
    return (
      <View style={{flex: 1}}>
        <ScrollView>
          <Text style={{ textAlign: 'center', fontSize: 20, color: '#000', marginTop: 10 }}>员工借支单</Text>
          {this.borrowingDetails()}
        </ScrollView>
        <TabBar 
          FormInfo={this.state.formInform} 
          navigate={navigate}
          isDisabled={isDisabled}
          />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  content: {
    marginTop: 10,
    marginBottom: 30,
    marginHorizontal: 5
  },
  rows: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5
  },
  infos: {
    flexDirection: 'row'
  },
  infoItem: {
    // marginBottom: 5,
    paddingVertical: 5,
    borderBottomColor: '#E3E3E8',
    borderBottomWidth: 0.8
  }
})

export default StackNavigator({
  StaffBorrowing: {
    screen: StaffBorrowingScreen
  }
})
