import { Component } from 'react'
import { connect } from 'react-redux'

export class DisplayEmail extends Component {
  render() {
    return (
       this.props.user.email
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.item.userdata,
})

export default connect(mapStateToProps)(DisplayEmail)