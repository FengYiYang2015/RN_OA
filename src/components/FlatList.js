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
} from 'react-native'

export default class FlatList2 extends Component {
  state = { selected: (new Map(): Map<string, boolean>) }

  _keyExtractor = (item, index) => item.id

  _onPressItem = (id: string) => {
    // updater functions are preferred for transactional updates
    this.setState((state) => {
      // copy the map rather than modifying state.
      const selected = new Map(state.selected)
      selected.set(id, !selected.get(id)) // toggle
      return { selected }
    })
  }

  goDetailsForm(item) {
    this.props.onPressItem(this.props.id)
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

  _renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onEndReachedThreshold={0.1}
      style={styles.itemForm}
      key={item.id}
      {...this.props}
      onPressItem={this._onPressItem}
      selected={!!this.state.selected.get(item.id)}
      onPress={this.goDetailsForm.bind(this, item)}
    >
      <View style={[styles.itemData, { marginBottom: 3 }]}>
        <Text>{item.flowName}</Text>
        <Text>发起时间: {item.submissionDate}</Text>
      </View>
      <View style={styles.itemData}>
        <Text>发起者: {item.proposer}</Text>
        <Text>状态: {item.state}</Text>
      </View>
    </TouchableOpacity>
  )

  render() {
    return (
      <FlatList
        data={this.props.data}
        extraData={this.state}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
      />
    )
  }
}


const styles = StyleSheet.create({
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