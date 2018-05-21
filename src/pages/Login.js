import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
  Dimensions
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { toast } from '../lib/core'
import publicNet from '../lib/publicNet'
import apiConfig from '../lib/apiConfig'
import host from '../lib/apiConfig'
import {
  StackNavigator,
  TabNavigator
} from 'react-navigation'

const {width, height} = Dimensions.get('window')

// const sendParam = (query = {}) => {
//   return query ? Object.keys(query).map(key => {
//     return key + ':' + query[key]
//   }).join('\n') : ''
// }

class LoginScreen extends Component {
  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props)
    this.state = {
      userId: '',
      password: '',
      userIdCanLogin: false,
      passwordCanLogin: false
    }
    this.inputChange = this.inputChange.bind(this)
    this.focusRef = this.focusRef.bind(this)
    // this.canSubmit = this.canSubmit.bind(this)
    // this.onInputBlur = this.onInputBlur.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  inputChange(key, val) {
    let tmpObj = {}
    tmpObj[key] = val
    this.setState(tmpObj)
  }

  focusRef(ref = 'input0') {
    this.refs[ref] && this.refs[ref].focus()
  }

  // canSubmit() {
  //   return this.state.userIdCanLogin && this.state.passwordCanLogin
  // }

  onSubmit() {
    const {userId, password} = this.state
    let regUserId = /^[\w]{6,10}$/
        // regPassword = /^[\w]{6,11}$/
    if (!regUserId.test(userId) && password == '') {
      toast('请输入员工账号和密码')
    }else if (regUserId.test(userId) && password == '') {
      toast('密码不能为空')
    }else if (!regUserId.test(userId) && password != '') {
      toast('请输入正确员工账号')
    }else if (regUserId.test(userId) && password != '') {
      const { navigate } = this.props.navigation
      let formData = new FormData();
      formData.append('userId', userId)
      formData.append('password', password)
      let url = `${apiConfig.baseUri}${apiConfig.mobileLogin}`
      publicNet.postJson(url, formData, (responseJson) => {
        if (responseJson.success) {
          console.log(responseJson)
          navigate('Home')
        }else {
          toast(responseJson.errorInfo)
        }
      })
    }
  }

  componentDidMount() {
    setTimeout(this.focusRef, 1000)
  }

  render() {
    const { navigate } = this.props.navigation
    return (
      <View style={styles.container}>
        <View style={styles.logo}>
          <Image style={{width: 90, height: 90, marginBottom: 20}} source={require('../assets/logo.png')}/>
        </View>
        <View style={[styles.loginInput, {marginTop: 40}]}>
          <Icon name='md-phone-portrait' size={25} backgroundColor="#3b5998"></Icon>
          <TextInput 
            ref='input0'
            underlineColorAndroid='transparent'
            numberOfLines={1}
            placeholder='请输员工账号'
            maxLength={11}
            style={styles.inputs}
            placeholderTextColor='#D9DADB'
            onChangeText={val => this.inputChange('userId', val)}
            onPress={() => this.focusRef('input0')}
            onSubmitEditing={() => this.focusRef('input1')}
            keyboardType={'numeric'}
          />
        </View>
        <View style={[styles.loginInput, {marginTop: 3}]}>
          <Icon name='md-key' size={25} backgroundColor="#3b5998"></Icon>
          <TextInput
            ref='input1' 
            underlineColorAndroid='transparent'
            numberOfLines={1}
            maxLength={11}
            placeholder='请输入密码'
            secureTextEntry={true}
            returnKeyType='done'
            placeholderTextColor='#D9DADB'
            style={styles.inputs}
            onChangeText={val => this.inputChange('password', val)}
            onPress={() => this.focusRef('input1')}
            onSubmitEditing={() => this.onSubmit()}
          />
        </View>
        <TouchableOpacity 
          style={[styles.LoginButton, {backgroundColor: '#1C81F3'}]} 
          activeOpacity={0.8}  
          onPress={this.onSubmit}>
          <Text style={{color: '#fff', textAlign: 'center', fontSize: 16}}>登录</Text>
        </TouchableOpacity>
        <View style={styles.forgetPsd}>
          <Text style={styles.forget}>忘记密码？</Text>
          <Text style={styles.forget}>新用户注册</Text>
        </View>
      </View>
    ) 
  }
}

export default StackNavigator({
  Login: {
    screen: LoginScreen
  }
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  logo: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loginInput: {
    width: 0.7*width,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginVertical: 2
  },
  inputs: {
    width: 0.62*width,
    height: 42,
    borderBottomColor: '#D9DADB',
    borderBottomWidth: 1,
    // marginVertical: 2
  },
  LoginButton: {
    width: 0.8*width,
    marginTop: 20,
    paddingVertical: 10,
    borderRadius: 2
  },
  forgetPsd: {
    width: 0.8*width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5
  },
  forget: {
    color: '#1ACFFC',
    fontSize: 12
  }
})