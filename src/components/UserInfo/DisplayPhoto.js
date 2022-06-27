import { Component } from 'react'
import { connect } from 'react-redux'

export class DisplayPhoto extends Component {
  render() {
    let displayPhoto = this.props.user.photoURL;
    
    return (
      displayPhoto
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.item.userdata,
})

export default connect(mapStateToProps)(DisplayPhoto)