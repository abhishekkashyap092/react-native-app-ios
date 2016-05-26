//importing the components from the react-native
import React, {
  Component,
} from 'react';
import {
  AppRegistry,
  Image,
  NavigatorIOS,
  ListView,
  StyleSheet,
  Text,
  //TouchableWithoutFeedback,
  View,
} from 'react-native';

//var TouchableWithoutFeedback = require('TouchableWithoutFeedback');

//defining the variable for requesting the url for viewing images

var REQUEST_URL = 'https://raw.githubusercontent.com/facebook/react-native/master/docs/MoviesExample.json';
 
 //creating a new class for the components as they can be rendered on demand 

class example1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      loaded: false,
    };
  }

  componentDidMount() {
    this.fetchData();
  }
//fetching data on the behalf of the get data from the response of the url supplied i.e you can change the url as per your need 
  fetchData() {
    fetch(REQUEST_URL)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(responseData.movies),
          loaded: true,
        });
      })
      .done();
  }


//rendering the component as after the state is loaded
  render() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    return (
    
//returning the data source in the form of row too fetch and view
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderMovie}
        style={styles.listView}
      />

    

    );
  }
  //rendering the Loading view as per basics defined in the container
  renderLoadingView() {
    return (
      <View style={styles.container}>
        <Text>
          Loading movies...
        </Text>
        </View>
 
    );
  }
 
 //rendering the movies for the view using container definition 
  renderMovie(movie) {
    return (
     
      <View style={styles.rowContainer}>
        <Image
          source={{uri: movie.posters.thumbnail}}
          style={styles.thumbnail}
        />
        <View style={styles.rowContainer}>

          <Text style={styles.title}>{movie.title}</Text>
        <Text style={styles.year}>{movie.year}</Text>  
        </View>
      </View>
    );

  }

 /** var MyView = React.createClass({
  _handleNavigationRequest: function() {
    this.refs.nav.push(otherRoute);
  },
  render: () => (
    <NavigatorIOS
      ref="nav"
      initialRoute={...}
    />
  ),
});
*/
 
}

//defining the complete style sheet as per the requirement the components can be loaded more as per req. so only add the desired component on the need and link it with the component used (ex:styles.title)
var styles = StyleSheet.create({
  container: {
      flex: 5,
      width: 10,
      height: 10,
      left:  12,
      borderRadius:5,
      flexDirection:'row',
      justifyContent:'center',
  },
  rowContainer: {
    flexDirection: 'row',
     borderBottomWidth:1,
    //borderBottomWidth: 1,
    //borderRadius: 5,
    padding: 4,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor:'blue',
    left: 25,
    right:35,
    //borderBottomLeftRadius : 1,
   
    //marginBottom:1,

  },
  title: {
    fontSize:20,
    marginBottom:22,
    textAlign: 'center',
    left: 7,

  },
  year: {
    textAlign: 'center',
    fontSize:10,
    flex     :2,
    textAlign: 'left',
  
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 25,
    left: 5,
    //shadowRadius: 12,

  },
  listView: {
    paddingTop: 20,
    backgroundColor: '#F5FCFF',
  },
  footer:{
    flex: 6,
    backgroundColor:'blue',
    borderStyle:'dotted',
   // borderBottomWidth:5,
    //borderBottomLeftRadius: 3,
    //borderBottomRightRadius:6,
  },
});

AppRegistry.registerComponent('example1', () => example1);