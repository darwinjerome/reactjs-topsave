import React, {Component} from 'react'
import  { StyleSheet, Dimensions, TouchableOpacity, View } from 'react-native'
import { Card, Text, Icon } from 'react-native-elements';

class Product extends Component {
  constructor(props){
    super(props)
    
  }
  onPress = (u) => {
    console.log('ID: ' + u.id)

    this.props.navigation.navigate('Product', {item: u});
  }

  componentDidMount = () => {
    
  }

  render(){
    return(
      <TouchableOpacity
        style={styles.touchable}
        onPress={() => this.onPress(this.props.item)}>
        <Card 
          containerStyle={styles.card}
          image={source={ uri: this.props.item.uri_thumbnail }}
          // image={source={uri: 'https://www.witneyandmason.com/wp-content/themes/witneyandmason/images/product-placeholder.gif'}}
        > 
          <View style={styles.details}>
            <View style={styles.leftcontent}>
              <Text style={styles.name} numberOfLines={1} >{this.props.item.name}</Text>
              <Text style={styles.price}>$ {this.props.item.price}</Text>
            </View>
            <View style={styles.rightcontent}>
              <Icon
                name="favorite"
                size={24}
                color="#8E8E93"
                onPress={()=>{console.log('LIKED!')}}
              />
            </View>
          </View>
        </Card>
      </TouchableOpacity> 
    )
  }
}

const width = Dimensions.get('window').width

const styles = StyleSheet.create({
  touchable:{
    width: (width / 2) - 20,
    marginBottom: 10,
    marginHorizontal: 5,
    // borderRadius: 4,
    // borderWidth: 0.5,
    // borderColor: '#d6d7da',
  },
  card:{
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 0,
    margin: 0,
  },
  name:{
    fontFamily: 'rubik-regular',
    fontSize: 16,
    color: '#707070',
  },
  price: {
    fontFamily: 'rubik-light',
    fontSize: 14,
    color: '#707070',
  },
  details: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  leftcontent: {
    width: '70%',
  },
  rightcontent: {
    alignContent: 'flex-end',
  }
})

export default Product;