import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import { Header, SearchBar, Button, Icon, Text } from 'react-native-elements'
import MenuButton from '../components/MenuButton';
import Logo from '../components/Common/Logo';
import DisplayAvatar from '../components/UserInfo/DisplayAvatar';
import SearchList from '../screens/Search';

export class MainHeader extends Component {
  constructor(props){
    super(props)

    this.state = {
      keyword: this.props.keyword || '',
      title: this.props.title,
      subtitle: this.props.subtitle,
      searchListVisible: false,   // check if SearchList needs to be visible
      searchBoxVisible: this.props.showSearch || false, // check if SearchBox needs to be visible
      isSearchButtonClicked: false, // check if SearchButton is clicked, show Menu or Back button based on this
      isBack: this.props.isBack || false, // check if Back button needs to be displayed
      isAvatarVisible: this.props.hideAvatar || false, // if avatar needs to show
      rightCustomButton: this.props.rightCustomButton || false
    }

    const willFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      payload => {
        this.checkCurrentScreen(payload);
      }
    );
  }

  checkCurrentScreen = (payload) => {

    const { routeName } = payload.state
    if(routeName == 'AppHome'){
      this.setState(
        { 
          searchListVisible: false, 
          searchBoxVisible: true,
          isBack: false,
          isSearchButtonClicked: false,
        })
    }
  }

  handleSearchChange = (keyword) => {
    this.setState({ keyword });
  }
  
  handleSearchCancel = (i) => {
    this.setState(
      { 
        searchListVisible: false, 
        isBack: false,
      })
    this.state.isSearchButtonClicked ? this.setState({ searchBoxVisible: false }) : null
  }

  handleSearchClear = () => {}

  handleSearchFocus = () => {
    this.setState(
      { 
        searchListVisible: true,
        isBack: true, 
      })
  }

  handleSearchBlur = () => {
    //this.setState({ searchListVisible: false })
  }

  handleSearchButtonPress = () => {
    
    this.setState(
      { 
        searchListVisible: true, 
        searchBoxVisible: true,
        isSearchButtonClicked: true,
      }, ()=>{ this.SearchInput.focus() } )
  }

  handleSearch = () => {
    //console.log(this.props.navigation.state.routeName)

    // If currentRoute is at home, then push SearchResults page otherwise replace it
    const currentRoute = this.props.navigation.state.routeName;
    (currentRoute == "AppHome") ? 
      this.props.navigation.push('SearchResults', { keyword: this.state.keyword }) :
        this.props.navigation.replace('SearchResults', { keyword: this.state.keyword })
  }

  handleBackButtonPress = () => {
    // Back button behaviour: if searchlist is visible, trigger the SearchInput cancel button to close search
    // if not trigger the normal goBack()
    this.state.searchListVisible ? this.SearchInput.cancel() : this.props.navigation.goBack()   
  }

  render() {
    const { keyword, title, subtitle } = this.state;
    const searchComponent = <SearchBar 
      ref = { (ref) => { this.SearchInput = ref } }
      value = {keyword}
      autoComplete = 'off'
      autoCorrect = {false}
      placeholder = "What are you looking for" 
      containerStyle = { styles.searchbar }
      inputContainerStyle = { styles.searchbarInput }
      platform = {'ios'}
      onFocus = { this.handleSearchFocus }
      onChangeText = { this.handleSearchChange }
      onCancel = { this.handleSearchCancel }
      onBlur = { this.handleSearchBlur }
      onClearText = { this.handleSearchBlur }
      onSubmitEditing = { this.handleSearch }
      returnKeyType='search'
    />

    const searchListComponent = (
      <View style={styles.searchList}>
        <SearchList navigation={this.props.navigation} /> 
      </View>
    )

    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
        <Header
          leftComponent=
          { (this.state.isBack || this.state.isSearchButtonClicked) ? 
            <Button 
              buttonStyle={{ padding:0, margin:0, }}
              type='clear'
              icon={
                <Icon
                  name="arrow-back"
                  size={28}
                  color="#8E8E93"
                />
              }
              iconRight
              onPress={ () => this.handleBackButtonPress() }
              /> : <MenuButton navigation={this.props.navigation}/>
          }
          centerComponent={ title ? <Text style={styles.title}>{title}</Text> : <Logo size={24} />}
          rightComponent=
          { <View style={ styles.rightComponent }>
            { this.props.isSearchIcon ? 
            <Button 
              buttonStyle={{ padding:0, margin:0, marginRight:5 }}
              type='clear'
              icon={
                <Icon
                  name="search"
                  size={28}
                  color="#8E8E93"
                />
              }
              onPress={ ()=>{ this.handleSearchButtonPress() }}
              iconRight /> : null }

            { this.state.isAvatarVisible ? null : <DisplayAvatar size="small" /> }

            {/* Custom button */}
            { this.state.rightCustomButton ? 
              <Button
                title="Next"
                type="clear"
                onPress={this.props.rightCustomButton}
              /> : null }
            </View>
          }
          containerStyle={styles.header}
          barStyle="dark-content"
        />

        {/* Show searchbar based on state */}
        { this.state.searchBoxVisible ? searchComponent : null }

        { subtitle ? 
          <View style={styles.subtitle}>
            <Text style={styles.subtitletext}>{subtitle}</Text>
          </View> : null }
        
        </View>

        {/* Show search suggestion lists based on searchListVisible state */}
        { this.state.searchListVisible ? searchListComponent : null }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    zIndex: 50,
  },
  headerContainer: {
    backgroundColor: '#ffffff',
    shadowColor: '#CACAD0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 4,  
    elevation: 1,
    zIndex: 10,
  },
  header: {
    alignItems: 'center',
    top:0, 
    width:'100%',
    backgroundColor: '#ffffff',
    padding: 0,
  },
  rightComponent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'rubik-medium',
    fontSize: 20,
    color: '#707070'
  },
  subtitle: {
    marginTop: 0,
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    alignItems: 'center',
  },
  subtitletext: {
    fontFamily: 'rubik-regular',
    fontSize: 14,
    color: '#505050'
  },
  searchbar:{
    marginTop: 0,
    backgroundColor: '#ffffff',
    width: '100%',
    alignItems: 'center',
  },
  searchbarInput:{
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#707070',
    borderBottomWidth: 1, // explicitly assign borderBottom as this is a bug on SearchBar
  },
  searchList: {
    backgroundColor: '#ffffff',
    width: '100%',
    height: '100%',
  }
})

export default MainHeader
