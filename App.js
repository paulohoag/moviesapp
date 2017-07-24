
import React from 'react';
import Autocomplete from 'react-native-autocomplete-input';
import { SearchBar, Button,SocialIcon } from "react-native-elements";
import {
  AppRegistry,
  Text,
  StyleSheet,
  TouchableOpacity,
  View, 
  TextInput,
  TouchableHighlight,
  Dimensions,
  ActivityIndicator 
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import ListSavedFilmsScreen from './screen/ListSavedFilmsScreen.js'
import FilmDetailScreen from './screen/FilmDetailScreen.js'
import {API, Key} from './utils/Config.js'
var ScrollableTabView = require('react-native-scrollable-tab-view');
import SearchFilmsScreen from './screen/SearchFilmsScreen.js'
const size = Dimensions.get('window').width

const styles = StyleSheet.create({
  autocompleteContainer: {
    flex: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1
  }
});
var data = [];
var that;
  
class HomeScreen extends React.Component {
    
constructor(props) {
    super(props);
    this.state = {
      query:null    
    };
  }

  static navigationOptions = {

    title: "MoviesApp",
    headerLeft: (<Icon name="film" size={22} color="white" style={{paddingLeft:10}}/>),
    headerStyle:{ backgroundColor: '#282626'},
    headerTitleStyle:{ color: 'white'},
  
  };

  
  componentDidMount() {
      navigate = this.props.navigation;
      that = this
      
   }

  getFilms(query) {

    if(this.state.query){
    const { navigate } = this.props.navigation;
    if(this.state.text!= ''){
      navigate('SearchFilms', { query: this.state.query })
    }

  }
  
  }

  navigate(){
    const { navigate } = this.props.navigation;

     navigate('ListSavedFilms')
  }

  render() {
    
    const query = this.state.query

      
    return (<View style={{backgroundColor:'#555252', height: Dimensions.get('window').height}}>
              <SearchBar
                onChangeText={(query) => this.setState({query})}
                placeholder='O que você procura?' 
                lightTheme
                placeholderTextColor="white"
                containerStyle={{backgroundColor:"#555252"}}
                inputStyle={{backgroundColor:"#282626",color:"white",textAlign: "center"}}
                onSubmitEditing = {()=>{this.getFilms()}}
                defaultValue={this.state.query == null ? "": this.state.query}         
                round={true}/>
              <SocialIcon button  style={{backgroundColor:"#282626"}}onPress={()=>{this.navigate()}} title={"Mostrar Filmes Salvos"}  backgroundColor={"#282626"}/>
            </View>)
      

    
     
  }
}

const MoviesApp = StackNavigator({
  Home: { screen: HomeScreen },
  ListSavedFilms: {screen: ListSavedFilmsScreen},
  SearchFilms: {screen: SearchFilmsScreen},
  FilmDetail: {screen: FilmDetailScreen}
});



AppRegistry.registerComponent('MoviesApp', () => MoviesApp);