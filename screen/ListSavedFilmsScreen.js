import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import {API, KEY} from '../utils/Config.js'
import { List, ListItem } from "react-native-elements";
import {DeviceEventEmitter,ActivityIndicator} from 'react-native'

import {
  AppRegistry,
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  Button,
  TextInput,
  ListView,
  AsyncStorage,
  TouchableHighlight,
  FlatList,
  Dimensions
} from 'react-native';
    

class ListSavedFilmsScreen  extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      page: 1,
      loading: true
     

    
    };
  }

  static navigationOptions = ({ navigation }) => ({
     title: 'Filmes Salvos',
     headerStyle:{ backgroundColor: '#282626'},
     headerTitleStyle:{ color: 'white'},
     headerTintColor:'white'
  });
  
  fecthSavedFilms(){
    
    AsyncStorage.getItem("imdbIds").then((value)=>{
       if(value != null){
       let ids = value.split(',')
       ids.map((id)=>{
         this.getFilm(id)
       })
       }
          this.setState({loading: false})
      
    })

  }

  getFilm(id) {

    const url = `${API}/?i=${id}&apikey=${KEY}`;
    fetch(url)
      .then(res => res.json())
      .then(res => {
        let films = this.state.data
        films.push({Title: res.Title,Year: res.Year,Type: res.Type,Poster: res.Poster,imdbID: res.imdbID})
        this.setState({data: data})
        
      })
      .catch(error => {
        this.setState({loading: false });
      });
  }

  changeToDetailScreen(item){
    const { navigate } = this.props.navigation;
    navigate('FilmDetail',{id: item.imdbID,title: item.Title,backScreen: 'ListSavedFilmsScreen'})
  
 }
 

   componentDidMount(){
     this.setState({loading: true})
     this.fecthSavedFilms()
     DeviceEventEmitter.addListener('update', (id)=>{ this.removeOrAddFilm(id)})

   }

   removeOrAddFilm(id){
    
    let savedFilmPosition = -1
    let data = this.state.data
   
    for(let i =0;i<data.length;i++){
        if(data[i].imdbID == id){
          savedFilmPosition = i
           break
        }
    }
        if(savedFilmPosition == -1){       
           this.getFilm(id)    
        }else{
          data.splice(savedFilmPosition,1)
          this.setState({data: data})    
        }
    
    
   }
    
  
  
  render(){
     let size = Dimensions.get('window').height
     
     if(this.state.loading){
             return(<View style={{backgroundColor:'#555252',height: size}}><ActivityIndicator  color="white"style={{flex: 1}}animating= {true} size={80}/></View>)
     }
     
     if(this.state.data.length === 0)
        return( 
         <View style={{backgroundColor:'#555252',height: size}}>
           <Text style={{marginTop: 20,color: 'white',fontSize:20,textAlign:'center',fontWeight :"bold"}}>Você não tem filmes salvos ainda</Text>


         </View>)

     return (
      <View style={{backgroundColor:'#555252',height: size}}>
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

export default ListSavedFilmsScreen;