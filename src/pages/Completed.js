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
import {
  StackNavigator,
  TabNavigator
} from 'react-navigation'
import StaffBorrowingScreen from './finance/StaffBorrowing'
// import FlatList2 from '../components/FlatList'
const {width, height} = Dimensions.get('window')

class CompletedScreen extends Component {
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
      AwaitList: []
    }
    // this.goDetailsForm = this.goDetailsForm.bind(this)
  }

  componentWillMount() {
    this.getAwaitData()
  }

  getAwaitData() {
    let formData = new FormData();
      formData.append('userId', '048419')
    let url = `${apiConfig.baseUri}${apiConfig.underWay}`
    console.log(url)
    publicNet.postJson(url, formData, (responseJson) => {
      if (responseJson.success) {
        console.log(responseJson)
        this.setState({
          AwaitList: responseJson.rows
        })
        // console.log(JSON.stringify(this.state.AwaitList)+'bbbbbb')
      }else {
        toast(responseJson.errorInfo)
      }
    })
  }

  goDetailsForm(item) {
    // this.props.onPressItem(this.props.id)
    const { navigate } = this.props.navigation
    console.log(item.flowName+'asasasa')
    switch (item.flowName) {
      case '员工借支单':
        navigate('StaffBorrowing', {staffBorrowing: item})
        break
      case '厂商费用协议扣款单':
        navigate('StaffBorrowing')
        break
    }
  }
  // state = {selected: (new Map(): Map<string, boolean>)};
  // _keyExtractor = (item, index) => item.id;
  // _onPressItem = (id: string) => {
  //   // updater functions are preferred for transactional updates
  //   this.setState((state) => {
  //     // copy the map rather than modifying state.
  //     const selected = new Map(state.selected);
  //     selected.set(id, !state.get(id)); // toggle
  //     return {selected};
  //   });
  // };

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
          // extraData={this.state}
          // keyExtractor={this._keyExtractor}
          // getItemLayout={(data, index) => ( {length: 10, offset: (10 + 1) * index, index} )}
          renderItem={({item}) => <TouchableOpacity
            activeOpacity={0.7}
            onEndReachedThreshold={0.1}
            style={styles.itemForm}
            // id={item.id}
            // {...this.props}
            // onPressItem={this._onPressItem}
            // selected={!!this.state.selected.get(item.id)}
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
    return (
      <View style={styles.container}>
        <Text style={{textAlign: 'center', fontSize: 20, color: '#53D265', marginTop: 10}}>待办事项单</Text>
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
  Completed: {
    screen: CompletedScreen
  }
})