import React from 'react';
import { Button } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';
import { signOut } from '../actions/authActions';

class LogoutButton extends React.Component {
  
  render() {
    return (
      <Button 
        title="Log out"
        type="clear"
        titleStyle={
          { fontFamily: 'rubik-light',
            fontSize: 16, 
            color:'#8E8E93', 
            textAlign:'left',
          }}
        buttonStyle={{
          width:'100%',
          backgroundColor: '#ffffff',
        }}
        containerStyle={{ marginTop: 10, width: '100%', height: 45, }}
        onPress = {this.props.signOut}
      />
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    signOut: () => dispatch(signOut())
  }
}

// withNavigation returns a component that wraps MyBackButton and passes in the
// navigation prop ie: this.props.navigation.navigate('Auth')
export default connect(null, mapDispatchToProps)(withNavigation(LogoutButton));