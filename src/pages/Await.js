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
  Dimensions
} from 'react-native'
import publicNet from '../lib/publicNet'
import host from '../lib/apiConfig'
import apiConfig from '../lib/apiConfig'
import { toast } from '../lib/core'
import {StackNavigator, TabNavigator} from 'react-navigation'
// import FlatList2 from '../components/FlatList'
const {width, height} = Dimensions.get('window')

class AwaitScreen extends Component {
  static navigationOptions = {
    headerTitle: '',
    headerStyle: {
      height: 0
    },
    headerRight: (
      <Button 
        onPress={()=>Alert.alert(
          '温馨提示',
          '提示的内容详情',
          [
            {text: '取消', onPress: () => console.log('取消执行的操作')},
            {text: '确定', onPress: () => console.log('确定执行的操作')}
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
      AwaitList: [],
      isDisabled: false
    }
    // this.goDetailsForm = this.goDetailsForm.bind(this)
  }

  componentDidMount() {
    console.log(this.props.navigation.state.params.statusType+'测试测试')
    this.getAwaitData()
  }

  getAwaitData() {
    let statusType = this.props.navigation.state.params.statusType
    console.log(statusType+'...await')
    let formData = new FormData()
    let url = ''
    formData.append('userId', '048419')
    switch (statusType){
      case '待办中':
        url = `${apiConfig.baseUri}${apiConfig.AwaitData}`
        console.log(statusType+'999999')
        this.setState({isDisabled: false})
        break
      case '进行中':
        url = `${apiConfig.baseUri}${apiConfig.underWay}`
        this.setState({isDisabled: true})
        break
      case '已完成':
        url = `${apiConfig.baseUri}${apiConfig.completed}`
        this.setState({isDisabled: true})
        break
      case '已终止':
        url = `${apiConfig.baseUri}${apiConfig.terminated}`
        this.setState({isDisabled: true})
        break
      default:
        url = `${apiConfig.baseUri}${apiConfig.AwaitData}`
    }
    console.log(url)
    publicNet.postJson(url, formData, (responseJson) => {
      if (responseJson.success) {
        // console.log(responseJson+'123')
        this.setState({
          AwaitList: responseJson.rows
        })
        console.log(JSON.stringify(this.state.AwaitList)+'bbbbbb')
      }else {
        console.log(responseJson.errorInfo)
        toast('暂无数据')
      }
    })
  }

  goDetailsForm(item) {
    let statusType = this.props.navigation.state.params.statusType
    const { navigate } = this.props.navigation
    const { isDisabled } = this.state
    console.log(item.flowName+'asasasa')
    console.log(isDisabled)
    switch (item.flowName) {
      case '员工借支单':
        navigate('StaffBorrowing', {staffBorrowing: item, isDisabled: isDisabled})
        break
      case '厂商费用协议扣款单':
        navigate('StaffBorrowing')
        break
    }
  }

  flatListData = () => {
    const { AwaitList } = this.state
    if ( Array.isArray(AwaitList) && AwaitList.length === 0 ) {
      return(
        <Text style={{textAlign: 'center', fontSize: 14, marginTop: 10}}>暂无待办事项</Text>
      )
    }else {
      return (
        <FlatList
          style={styles.FlatListStyle}
          data={AwaitList}
          keyExtractor={(item, index) => item.flowId}
          renderItem={({item}) => <TouchableOpacity
            activeOpacity={0.7}
            onEndReachedThreshold={0.1}
            style={styles.itemForm}
            onPress={this.goDetailsForm.bind(this, item)}
          >
            <View style={[styles.itemData, {marginBottom: 3}]}>
              <Text>{item.flowName}</Text>
              <Text>发起时间: {item.submissionDate}</Text>
            </View>
            <View style={styles.itemData}>
              <Text>发起者: {item.proposer}</Text>
              <Text>状态: {item.state}</Text>
            </View>
          </TouchableOpacity>}
        />
      )
    }
  }

  render() {
    let statusType = this.props.navigation.state.params.statusType
    return (
      <View style={styles.container}>
        <Text style={{textAlign: 'center', fontSize: 20, color: '#53D265', marginTop: 10}}>{statusType}</Text>
        {this.flatListData()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    // width: 0.9*width,
    // alignItems: 'center'
  },
  FlatListStyle: {
    marginTop: 10,
    marginBottom: 35,
    paddingHorizontal: 5
  },
  itemForm: {
    paddingVertical: 5,
    borderBottomColor: '#E3E3E8',
    borderBottomWidth: 0.8
  },
  itemData: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
})

export default StackNavigator({
  Await: {
    screen: AwaitScreen
  }
})