import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
  Dimensions,
  Modal,
  Button,
  FlatList,
  ScrollView
} from 'react-native';
import {
  StackNavigator,
  TabNavigator
} from 'react-navigation'
import publicNet from '../lib/publicNet'
import host from '../lib/apiConfig'
import apiConfig from '../lib/apiConfig'
import { toast } from '../lib/core'
import { formatDateTime } from '../lib/core'

const { width, height } = Dimensions.get('window')

export default class TabBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      animationType: 'fade',
      modalVisible: false,
      courseModalVisible: false,
      transparent: true,
      isAgree: Boolean,
      agreeOpinion: '',
      formStatus: '',
      courseData: []
    }
  }

  _setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }
  _courseModalVisible = (visible) => {
    this.setState({ courseModalVisible: visible });
  }

  continueSend = (val) => {
    this.setState({
      modalVisible: true,
      isAgree: val !== 'back' ? true : false
    })
    switch (val) {
      case 'agree':
        this.setState({
          agreeOpinion: '同意。',
          formStatus: 'agree'
        })
        break
      case 'back':
        this.setState({
          agreeOpinion: '退回修改。',
          formStatus: 'back'
        })
        break
      case 'break':
        this.setState({
          agreeOpinion: '不同意。',
          formStatus: 'break'
        })
        break
    }
  }

  confirm = () => {
    console.log(this.state.agreeOpinion)
    console.log(this.props.FormInfo)
    const { FormInfo, navigate } = this.props
    const { formStatus } = this.state
    // let agreeParams = Object.assign({}, this.props.FormInfo, {state: 1}, {comment: this.state.agreeOpinion})
    let url = `${apiConfig.baseUri}${apiConfig.agreeApprove}`
    let agreeParams = new FormData()
    agreeParams.append('flowId', FormInfo.flowId)
    agreeParams.append('taskId', FormInfo.taskId)
    agreeParams.append('userId', FormInfo.userId)
    switch (formStatus) {
      case 'agree':
        agreeParams.append('state', 1)
        break
      case 'back':
        agreeParams.append('state', 2)
        break
      case 'break':
        agreeParams.append('state', 3)
        break
    }
    agreeParams.append('comment', this.state.agreeOpinion)
    console.log(agreeParams)
    publicNet.postJson(url, agreeParams, (responseJson) => {
      if (responseJson.success) {
        console.log(responseJson)
        toast('审批成功')
        this.setState({
          modalVisible: false
        })
        navigate('Home')
      } else {
        console.log('审批失败')
        this.setState({
          modalVisible: false
        })
        toast(responseJson.errorInfo)
      }
    })
  }

  getCourse = () => {
    // console.log(this.state.agreeOpinion)
    // console.log(this.props.FormInfo)
    this.setState({
      courseModalVisible: true
    })
    const { FormInfo } = this.props
    // let agreeParams = Object.assign({}, this.props.FormInfo, {state: 1}, {comment: this.state.agreeOpinion})
    let url = `${apiConfig.baseUri}${apiConfig.approveCourse}`
    let agreeParams = new FormData()
    agreeParams.append('taskId', FormInfo.taskId)
    agreeParams.append('processInstanceId', FormInfo.processInstanceId)
    console.log(agreeParams)
    publicNet.postJson(url, agreeParams, (responseJson) => {
      if (responseJson.success) {
        console.log(responseJson.rows)
        this.setState({
          courseData: responseJson.rows
        })
      } else {
        toast(responseJson.errorInfo)
      }
    })
  }

  render() {
    let modalBackgroundColor = {
      backgroundColor: this.state.transparent ? 'rgba(0, 0, 0, .5)' : 'red'
    }
    const { isDisabled } = this.props
    const { courseData } = this.state
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.footer} 
          activeOpacity={0.6} 
          onPress={this.continueSend.bind(this, 'agree')}
          disabled={isDisabled}
          >
          <Image style={styles.image} source={isDisabled ? require('../assets/mark_disable.png') : require('../assets/mark.png')} />
          <Text style={styles.text}>继续派送</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footer} 
          activeOpacity={0.6} 
          onPress={this.continueSend.bind(this, 'back')}
          disabled={isDisabled}
          >
          <Image style={styles.image} source={isDisabled ? require('../assets/sendBack_disable.png') : require('../assets/sendBack.png')} />
          <Text style={styles.text}>退回</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footer} 
          activeOpacity={0.6} 
          onPress={this.continueSend.bind(this, 'break')}
          disabled={isDisabled}
           >
          <Image style={styles.image} source={isDisabled ? require('../assets/break_disable.png') : require('../assets/break.png')} />
          <Text style={styles.text}>终止流程</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footer} activeOpacity={0.6} onPress={this.getCourse.bind(this)}>
          <Image style={styles.image} source={require('../assets/more.png')} />
          <Text style={styles.text}>审批历程</Text>
        </TouchableOpacity>
        <Modal
          animationType={this.state.animationType}
          transparent={this.state.transparent}
          visible={this.state.modalVisible}
          onRequestClose={() => { this._setModalVisible(false) }}
        >
          <View style={[styles.modalContainer, modalBackgroundColor]}>
            <View style={styles.modalView}>
              <Text style={styles.opinion}>{this.state.isAgree ? '审批意见' : '退回到发起人关卡'}</Text>
              <TextInput
                // defaultValue='同意。'
                multiline={true}
                style={styles.textInput}
                underlineColorAndroid='transparent'
                onChangeText={val => this.setState({ agreeOpinion: val })}
                value={this.state.agreeOpinion}
              />
              <View style={styles.cancelConfirm}>
                <Text style={{ color: '#333', marginRight: 15 }} onPress={this._setModalVisible.bind(this, false)}>取消</Text>
                <TouchableOpacity
                  activeOpacity={0.6}
                  style={styles.button}
                  onPress={this.confirm}
                >
                  <Text style={styles.buttonText}>确定</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <Modal
          visible={this.state.courseModalVisible}
          animationType={this.state.animationType}
          transparent={this.state.transparent}
          onRequestClose={() => { this._courseModalVisible(false) }}
        >
          <View style={[styles.modalContainer, modalBackgroundColor]}>
            <View style={[styles.modalView, { height: 0.4 * height }]}>
              <Text style={[styles.opinion, {padding: 5}]}>审批版本</Text>
              {(Array.isArray(courseData) && courseData.length === 0) ?
                <View style={{flex: 1, justifyContent: 'center'}}><Text style={{textAlign: 'center'}}>暂无数据</Text></View>
                :
                <FlatList
                  style={{margin: 5}}
                  data={courseData}
                  keyExtractor={(item, index) => item.time}
                  renderItem={({ item }) => <ScrollView>
                    <View style={styles.approvalItem}>
                      <View style={[styles.approvalDetails, {width: 0.2*width}]}>
                        <Text style={{ fontSize: 12 }}>审批人:</Text>
                        <Text style={styles.approvalText}>审批意见:</Text>
                        <Text style={{ fontSize: 12 }}>审批时间:</Text>
                      </View>
                      <View style={[styles.approvalDetails, {width: 0.75*width}]}>
                        <Text style={{ fontSize: 12 }}>{item.userId}</Text>
                        <Text style={styles.approvalText}>{item.message}</Text>
                        <Text style={{ fontSize: 12 }}>{formatDateTime(item.time)}</Text>
                      </View>
                    </View>
                  </ScrollView>}
                />
              }
              <View style={styles.cancelConfirm}>
                <Text style={{ color: '#333', marginRight: 15 }} onPress={this._courseModalVisible.bind(this, false)}>取消</Text>
                <TouchableOpacity
                  style={styles.button}
                  activeOpacity={0.6}
                  onPress={this._courseModalVisible.bind(this, false)}
                >
                  <Text style={styles.buttonText}>确定</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    backgroundColor: '#66CCFF',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  footer: {
    height: 58,
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  image: {
    width: 30,
    height: 30
  },
  text: {
    color: '#fff',
    fontSize: 12
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalView: {
    width: 0.8 * width,
    height: 0.3 * height,
    backgroundColor: '#fff',
    borderRadius: 3,
    justifyContent: 'space-between'
  },
  opinion: {
    color: '#000',
    fontSize: 16,
    padding: 10
  },
  textInput: {
    height: 75,
    width: 0.75 * width,
    marginLeft: 0.025 * width,
    borderWidth: 0.8,
    borderColor: '#999',
    borderRadius: 3,
    borderBottomWidth: 0.8,
    borderBottomColor: '#999'
  },
  cancelConfirm: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  FlatListStyle: {
    margin: 10,
  },
  approvalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
    borderBottomColor: '#E3E3E8',
    borderBottomWidth: 0.8
  },
  approvalDetails: {
    // height: 50,
    // flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    paddingVertical: 3
  },
  approvalText: {
    marginVertical: 2,
    fontSize: 12
  },
  buttonText: {
    color: '#fff',
    padding: 5
  },
  button: {
    backgroundColor: '#2196F3',
    borderRadius: 2
  }
})