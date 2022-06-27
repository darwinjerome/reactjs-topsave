import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, ActivityIndicator } from 'react-native';
import { Image, Text, Button, Icon } from 'react-native-elements'
import MainHeader from '../components/MainHeader';

import UserCard from '../components/UserInfo/UserCard';

class ProductDetail extends Component {
  render() {
    const { navigation } = this.props;
    const item = navigation.getParam('item', 'NO-ID');

    return (
      <View style={styles.container}>
        <MainHeader navigation={this.props.navigation} isBack isSearchIcon/> 
        <ScrollView>
          <Image
            source={{ uri: item.uri_thumbnail }}
            style={{ width: '100%', height: 250 }}
            PlaceholderContent={<ActivityIndicator />}
          />
          <View style={styles.content}>
            <Text style={styles.header1}>{item.name}</Text>
            <View style={{ marginTop: 10, flex:1, flexDirection:'row', justifyContent:'space-between'}}>
              <View style={{ flex:1, flexDirection: 'column', alignItems:'flex-start', justifyContent:'space-between' }}>
                <View style={{ flex:1, flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                  <Text style={styles.key}>Condition: </Text>
                  <Text style={styles.value}>{item.condition}</Text>
                </View>
                <View style={{ flex:1, flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                  <Text style={styles.key}>Location: </Text>
                  <Text style={styles.value}>{item.location}</Text>
                </View>
              </View>
              <View style={{ flex:1, flexDirection: 'column', alignItems:'flex-start', justifyContent:'space-between' }}>
                <View style={{ flex:1, flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                  <Text style={styles.key}>Category: </Text>
                  <Text style={styles.value}>{item.category}</Text>
                </View>
                <View style={{ flex:1, flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                  <Text style={styles.key}>Delivery: </Text>
                  <Text style={styles.value}>{item.delivery}</Text>
                </View>
              </View>
            </View>
            <View style={{flex: 1, flexDirection:'column'}}>
              <Text style={{ fontFamily: 'rubik-light', fontSize:16, color: '#8E8E93', paddingTop: 20, }}>
                { item.description }
              </Text>
            </View>             
          </View>

          {/* Seller details */}
          <UserCard user={ item.userseller } />
        </ScrollView>     

        {/* Offerbar */}
        <View style={styles.offerbar}>
          <View style={ styles.offerprice }>
            <Text style={styles.price}>NZD {item.price}</Text>  
          </View>

          <View style={ styles.offerbuttons }>
            <Button
              title="MAKE OFFER" 
              type='outline'
              titleStyle={{ fontFamily: 'rubik-medium', fontSize: 16, color: '#8E8E93' }}
              buttonStyle={{ borderRadius:30, borderWidth:2, borderColor: '#8E8E93', height:40, width:120, marginRight:5 }}
            />
            <Button 
              type='outline' 
              icon={
                <Icon name='comment'
                size={20}
                color='#8E8E93' />
              }
              buttonStyle={{ borderRadius:30, borderWidth:2, borderColor: '#8E8E93', height:40, width:40 }}
            />
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'transparent'
  },
  content: {
    padding: 20,
    marginBottom:80,
  },
  header1: {
    fontFamily: 'rubik-regular',
    fontSize: 30, 
    color:'#505050', 
    textAlign:'left',
  },
  key: {
    fontFamily: 'rubik-regular',
    fontSize: 12, 
    color:'#8E8E93', 
    textAlign:'left',
    paddingRight: 10,
  },
  value: {
    fontFamily: 'rubik-regular',
    fontSize: 14, 
    color:'#505050', 
    textAlign:'left',
  },
  price: {
    fontFamily: 'rubik-medium',
    fontSize: 22, 
    color:'#505050', 
    textAlign:'left',
  },
  offerbar: {
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    width: '100%',
    height: 60,
    padding: 20,

    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,  
    elevation: 1,
  },
  offerprice: {
    width: '50%',
  },
  offerbuttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  }

})

export default ProductDetail;