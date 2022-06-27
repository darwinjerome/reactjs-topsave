import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';

const sampledata = ['laptop', 'laptop accessories', 'laptop bag', 'laptop case']

class Search extends Component{
  constructor(props){
    super(props) 
  }

  _renderPost = ({item}) => {
    return (
    <TouchableOpacity 
     
      onPress={ ()=>{
        /* 1. Navigate to the Details route with params */
        this.props.navigation.navigate('SearchResults', 
        {
          keyword: item,
        });
      }}
    >
    <View style={styles.content}>
        <Text style={styles.text}>{item}</Text>
        <Icon
          name="arrow-forward"
          size={28}
          color="#CACAD0"
        />
    </View> 
    </TouchableOpacity>
    )
  }

  render(){
    return(
      <View style={styles.container}>        
        <FlatList
          data={sampledata}
          renderItem={ this._renderPost }
          keyExtractor={ (item,index) => index.toString() } 
        />        
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    alignItems: 'flex-start',
    paddingLeft: 20,
    paddingBottom: 10,
    paddingRight: 10,
    borderBottomColor: '#CACAD0',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  text: {
    fontFamily: 'rubik-regular',
    fontSize: 16,
    color: '#8E8E93',
  }
})


export default Search;
