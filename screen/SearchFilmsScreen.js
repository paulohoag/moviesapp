import React, { Component } from "react";
import { Dimensions,View, Text, FlatList,StyleSheet,TextInput, ActivityIndicator,TouchableHighlight,TouchableOpacity } from "react-native";
import { List, ListItem, SearchBar } from "react-native-elements";
import {API, KEY} from '../utils/Config.js'
import { StackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';

const size = Dimensions.get('window').height

class SearchFilmsScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      data: [],
      page: 1,
      error: false,
      refreshing: false,
      totalResults: null,
      open:false,
      id: null,
      singleFilm: null
    };
  }

   static navigationOptions = ({ navigation }) => ({

     title: "Resultado da busca por '"+navigation.state.params.query+"'",
     headerStyle:{ backgroundColor: '#282626'},
     headerTitleStyle:{ color: 'white'},
     headerTintColor:'white'
  
  });

  
  removeDuplicates(originalArray, prop) {
     var newArray = [];
     var lookupObject  = {};

     for(var i in originalArray) {
        lookupObject[originalArray[i][prop]] = originalArray[i];
     }

     for(i in lookupObject) {
         newArray.push(lookupObject[i]);
     }
      return newArray;
 }

 makeSingleRequest = () =>{
  const { id } = this.state;
    const url = `${API}/?i=${id}&apikey=${KEY}`;
    this.setState({ loading: true });

    fetch(url)
      .then(res => res.json())
      .then(res => {
         this.setState({singleFilm: res});
            
      })
      .catch(error => {
        this.setState({ loading: false });
      });



 }

 
 changeToDetailScreen(item){
  const { navigate } = this.props.navigation;
  navigate('FilmDetail',{id: item.imdbID,title: item.Title,backScreen: 'SearchFilmsScreen'})
  
 }

  makeRemoteRequest = () => {
   
    const page  = this.state.page;
    const query = this.props.navigation.state.params.query
    const url = `${API}/?s=${query}&apikey=${KEY}&page=${page}`;
    this.setState({ loading: true });

    fetch(url)
      .then(res => res.json())
      .then(res => {
        let newArray
        if(page !== 1){
          let array = this.state.data.concat(res.Search)
          newArray = this.removeDuplicates(array,"imdbID")
        }
        let error = false
        if(res.Error)
          error = true
        this.setState({
          data: page === 1 ? res.Search : newArray,
          error:error,
          loading: false,
          refreshing: false,
          totalResults: res.totalResults

        });
      })
      .catch(error => {
        this.setState({ loading: false });
      });
  };

  handleRefresh = () => {
    this.setState(
      {
        page: 1,
        refreshing: true
      },
      () => {
        this.makeRemoteRequest();
      }
    );
  };

  handleLoadMore = () => {
    let currentPage = this.state.page

    if(currentPage < Math.ceil(this.state.totalResults/10)){
    this.setState(
      {
        page: this.state.page + 1
      },
      () => {
      if(currentPage < Math.ceil(this.state.totalResults/10))
        this.makeRemoteRequest();
    
      }
    
    );
  };
  }

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "86%",
          backgroundColor: "#CED0CE",
          marginLeft: "14%"
        }}
      />
    );
  };

  renderHeader = () => {
      if(this.state.totalResults){
        return(<View><Text style={{color:'white',textAlign: 'center',fontSize:24,marginBottom:10}}>Resultados encontrados: {this.state.totalResults}</Text></View>)
  

    }else{
        return(null)
    }
  };
  
  componentDidMount(){
     this.makeRemoteRequest()
    
  }


  render() {
     
    if(this.state.error)
      return( 
         <View style={{backgroundColor:'#555252',height: size}}>
           <Text style={{marginTop: 20,color: 'white',fontSize:20,textAlign:'center',fontWeight :"bold"}}>Nenhum filme encontrado com esse nome</Text>
         </View>)

    if(this.state.data.length === 0)
      return(<View style={{backgroundColor:'#555252',height: size}}><ActivityIndicator  color="white"style={{flex: 1}}animating= {true} size={80}/></View>)

    return (
     <View style={{backgroundColor:'#555252' ,height: size}}>
      <List containerStyle={{ backgroundColor:'#555252',borderTopWidth: 0, borderBottomWidth: 0 }}>
        <FlatList
          data={this.state.data}
          renderItem={({ item }) => (
            <TouchableHighlight onPress={()=>{this.changeToDetailScreen(item)}} underlayColor="gray">
            <View><ListItem
              roundAvatar
              titleStyle={{color:'white'}}
              subtitleStyle={{color:'white'}}
              title={`${item.Title} ${item.Year}`}
              subtitle={item.Type=='movie'?"Filme":item.Type=='series'?"Série":item.Type}
              avatar={{ uri: item.Poster }}
              containerStyle={{ borderBottomWidth: 0 }}
              rightIcon={{ name: 'arrow-right',color:'#555252', type: 'font-awesome', style: { marginRight: 10, fontSize: 15 } }}
              style={{backgroundColor:'#555252'}}
            />
            </View>
            </TouchableHighlight>
          )}
          keyExtractor={item => item.imdbID}
          ItemSeparatorComponent={this.renderSeparator}
          ListHeaderComponent={this.renderHeader}
          onRefresh={this.handleRefresh}
          refreshing={this.state.refreshing}
          onEndReached={this.handleLoadMore}
          onEndReachedThreshold={25}
        />
      </List>
      
      </View>
    );
    
  }
}

export default SearchFilmsScreen;


