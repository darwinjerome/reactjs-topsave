import { Component } from 'react'
import { connect } from 'react-redux'

export class DisplayName extends Component {
  render() {
    let displayName = this.props.user.displayName;
    let firstName = displayName.split(" ")[0];
    return (
      firstName
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.item.userdata,
})

export default connect(mapStateToProps)(DisplayName)