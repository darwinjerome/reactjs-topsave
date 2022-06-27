import React, { Component } from 'react'
import { Avatar } from 'react-native-elements';
import { connect } from 'react-redux';
import { getUserInitials } from '../../actions/userActions';

class DisplayAvatar extends Component {

  render() {
    const { profile, auth } = this.props
    const displayname = profile.firstName + " " + profile.lastName
    const initials = profile ? getUserInitials(displayname) : null

    return (
      <Avatar
        rounded
        size={this.props.size}
        title= { initials }
        source= { auth.photoURL && { uri: auth.photoURL} }
      />
    )
  }
}

const mapStateToProps = (state) => {
  return {
    profile: state.firebase.profile,
    auth: state.firebase.auth
  }
}

export default connect(mapStateToProps)(DisplayAvatar)