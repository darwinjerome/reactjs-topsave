import React, {Component} from 'react';
import { StyleSheet, FlatList, View, ActivityIndicator, Dimensions } from 'react-native';
import { Icon, Text } from 'react-native-elements';
import Product from '../components/Product';
import { connect } from 'react-redux';
import { fetchProducts, searchProductsDirect } from '../actions/productActions';

const width = Dimensions.get('window').width

class FeedProducts extends Component {
  constructor(props){
    super(props)

    this.state = {
      loading: true,
      pagenum: 0,
      resultsize: 16,
    }
  }

  componentDidMount = () => {
    if(this.props.keyword){
      this.setState({ isSearching: true, loading: true })
      this.props.searchProducts(this.props.keyword, this.state.pagenum, this.state.resultsize)
    }else{
      this.setState({ isSearching: false , loading: true}) 
      this.props.fetchProducts('*', this.state.pagenum, this.state.resultsize)
    }
  }

  static getDerivedStateFromProps(nextProps, currentState){    
    // Check if new list have been loaded
    if (currentState.products !== nextProps.products) {  
      /* Update this.state.loading */
      return { loading: false }
    }
  }
 
  _renderPost = ({item}) => {
    return <Product item={item} navigation={this.props.navigation}/>
  }

  // Generates unique keys for each product using the name
  _returnKey = (item) => {
    return item.id.toString();
  }

  _onEndReached = (info) => {
    if (info.distanceFromEnd >= -20) {
      this._renderNextBatch();
    }
  };

  _renderNextBatch = () => {
    
    /* Check if current products lenght is less than the total lenght of the matching query in ES, 
    otherwise return null */

    (this.props.products.length < this.props.items_total) ? 
  
    /* Increment pagenum */
    /* Show loading when rendering next batch */
    /* call next page after setting state */
    this.setState(prevState => {
      return {
        pagenum: prevState.pagenum + prevState.resultsize,
        loading: true 
      }
    }, () => {      
      this.props.fetchProducts('*', this.state.pagenum, this.state.resultsize)
        .then(() => {
          this.setState({ loading:false })
        })
    }) : null;
  }

  _renderFooter = () => {
    return (
      this.state.loading ? 
        <View style={styles.footerloader}>
          <ActivityIndicator animating size="large" color="#CACAD0" />
        </View> : null
    );
  };

  renderFilterBar = () => {
    return (
      <View style={styles.searchheader}>
        <View style={styles.filtercolumnstart}>
          <Icon
            name='filter'
            type='antdesign'
            color='#505050'
          />        
          <Icon
            name='sort'
            type='material-community'
            color='#505050'
            containerStyle={{marginLeft: 10, marginRight: 5}}
          />
          <Text style={styles.text}>Best match</Text>
        </View>

        <View style={styles.filtercolumnlast}>
          <Text style={[styles.text, {marginRight:5}]} color='#8E8E93'>{this.props.items_total} Results</Text>
          <Icon
            name='bars'
            type='antdesign'
            color='#505050'
          />
        </View>
      </View>
    )
  }

  renderEmptyResults = () => {

    if (this.props.items_total != 0){
      return null;
    }
    return (      
      <View style={styles.horizontal}>
        <Text>Sorry, I am unable to find that item</Text>
        <Text>Try a different keyword.</Text>
      </View> 
    )
  }

  render () {

    const productFeed = (
      <FlatList 
        contentContainerStyle = {styles.scrollcontent}
        keyExtractor = {this._returnKey} 
        data = {this.state.isSearching ? this.props.search_results : this.props.products}
        renderItem = {this._renderPost}
        numColumns = {2}
        ListFooterComponent = {this._renderFooter}
        onEndReached = {this._onEndReached}
        onEndReachedThreshold = {0.9}
        ListEmptyComponent = {this.renderEmptyResults}
      />
    )
    return (
      <View style={styles.container}>
        {/* render filter header based on props */}
        { this.props.isFilter ? this.renderFilterBar() : null }

        {/* display product FlatList */}
        { productFeed }
      </View>
    )  
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollcontent: {
    marginTop:5,
    flexDirection: 'column',
    padding:10,
    justifyContent: 'space-between',
    alignItems: "flex-start",
  },
  searchheader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#BCBCBC',
    marginVertical: 10,
    paddingBottom: 10,
    paddingHorizontal: 10
  },
  filtercolumnstart: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  filtercolumnlast: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'rubik-light',
    fontSize: 14,
    color: '#505050',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    alignSelf: 'center'
  },
  footerloader: {
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: "#000000",
    flex: 1,
    position: 'absolute',
    left: width/2,
    right: 0,
    top: 50,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',          
  }
})

const mapStateToProps = (state) => {
  return {
    products: state.products.default.items,
    items_total: state.products.default.items_total,
    search_results: state.products.isSearching.search_results,
    search_results_total: state.products.search_results_total,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchProducts: (keyword, pagenum, resultsize) => { return dispatch(fetchProducts(keyword, pagenum, resultsize)) },
    searchProducts: (keyword, pagenum, resultsize) => { return dispatch(searchProductsDirect(keyword, pagenum, resultsize)) },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedProducts)