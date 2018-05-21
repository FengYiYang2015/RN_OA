import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Button,
  Image,
  TouchableOpacity,
  Dimensions
} from 'react-native'
import {
  StackNavigator,
  TabNavigator
} from 'react-navigation'
import MineScreen from './MinePage'
import LoginScreen from './Login'
const {width, height} = Dimensions.get('window')
var cols = 3
var cellWH = 90
var vMargin = (width - cellWH * cols) / (cols + 1)
var hMargin = 30

class HomeScreen extends Component {
  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props)
    this.state = {
      imagesList: [
        {imgUrl: require('../assets/await.png'), textDesc: '待办中'},
        {imgUrl: require('../assets/underway.png'), textDesc: '进行中'},
        {imgUrl: require('../assets/accomplish.png'), textDesc: '已完成'},
        {imgUrl: require('../assets/termination.png'), textDesc: '已终止'}
      ]
    }
  }

  requestData = ( type ) => {
    const { navigate } = this.props.navigation
    console.log(type+'...home')
    navigate('Await', {statusType: type})
  }

  classification() {
    const {imagesList} = this.state
    let mainWork = []
    console.log(imagesList)
    for (var i = 0; i < imagesList.length; i++) {
      var mainItem = imagesList[i]
      mainWork.push(
        <TouchableOpacity key={i} activeOpacity={0.7} style={styles.mainWork} onPress={this.requestData.bind(this, mainItem.textDesc)}>
          <Image style={styles.IconItem} source={mainItem.imgUrl}/>
          <Text style={styles.decText}>{mainItem.textDesc}</Text>
        </TouchableOpacity>
      )
    }
    return mainWork
  }

  render() {
    return (
      <View style={styles.container}>
        {this.classification()}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection:'row',
    flexWrap:'wrap',
    backgroundColor: '#fff'
  },
  icon: {
    height: 22,
    width: 22,
    resizeMode: 'contain'
  },
  mainWork: {
    width:cellWH,  
    height:cellWH,  
    marginLeft:vMargin,  
    marginTop:hMargin,    
    alignItems:'center'
  },
  IconItem: {
    width: 65,  
    height: 65 
  },
  decText: {
    fontSize: 16,
    marginTop: 5,
    color: '#17C295'
  }
})

export default StackNavigator({
  Home: {
    screen: HomeScreen
  }
})

