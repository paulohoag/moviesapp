import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';
import {API, KEY} from '../utils/Config.js'
import Icon from 'react-native-vector-icons/FontAwesome';
import {CheckBox,Button }  from "react-native-elements";
import {Dimensions }from 'react-native';
import {DeviceEventEmitter,ActivityIndicator} from 'react-native'
import {
  AppRegistry,
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  TextInput,
  ListView,
  Image,
  AsyncStorage,
  ScrollView,
  TouchableHighlight
} from 'react-native';

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

export default class FilmDetailScreen  extends Component {

  
 constructor(props) {
    super(props);
    this.state = {
      film: null,
      saved: false,
      title: ""  ,
      loading: true  ,
      error: false
    
    };
  }

static navigationOptions = ({ navigation }) => ({
    headerStyle:{ backgroundColor: '#282626'},
    headerTitleStyle:{ color: 'white'},
    headerTintColor:'white',     

  });

  fetchFilm(){
    let id = this.props.navigation.state.params.id

    fetch(`${API}/?i=${id}&apikey=${KEY}`,{
        method: 'GET',
        headers: {
        "Accept": "application/json",
        'Content-Type': 'application/json'
        }
    })
    .then((response) => response.json())
    .then((responseJson) => {
          let saved = null
           AsyncStorage.getItem("imdbIds").then((value)=>{
             if(value != null){
                let Ids = value.split(',')
                saved = Ids.indexOf(id) != -1? true: false
                          
              } 
              this.setState({
                film: responseJson,
                title: responseJson.Title,
                saved: saved,
                loading: false
              })    
            
            })
                   
        
    
       
      })
    .catch(err => {
        this.setState({error:true})
    });
      


  }

  componentDidMount(){
   
    this.fetchFilm()
  }


  saveOrDeleteFilm(){

            this.setState({loading:true})
            let newIds;
            AsyncStorage.getItem("imdbIds").then((value)=>{
            if(this.props.navigation.state.params.backScreen === 'ListSavedFilmsScreen')  
               DeviceEventEmitter.emit('update',this.props.navigation.state.params.id)
            if(this.state.saved){
              
              let ids = value.split(',')
              let idToRemove = this.state.film.imdbID
              ids.splice(ids.indexOf(idToRemove),1)

              newIds = ids.toString()
              AsyncStorage.setItem("imdbIds",newIds); 
              
              this.setState({saved: false,loading:false})           
            }else{   
               
                if(value!=null){
                  newIds = value + "," + this.state.film.imdbID           
                }else{
                  newIds = this.state.film.imdbID    
                }
                AsyncStorage.setItem("imdbIds",newIds);   
                this.setState({saved: true,loading:false})                              
           
            } 
            });        
  }


calcStars(star){

if(star==1){
    if(this.state.film.imdbRating == 0)
      return ("star-o")
    if(this.state.film.imdbRating <= 3.3)
      return("star-half-o")
    else
      return("star")

}else if(star==2){
    if(this.state.film.imdbRating <= 3.3)
       return ("star-o")
    if(this.state.film.imdbRating <= 6.6)
       return("star-half-o")
    else
       return("star")

}else{
    if(this.state.film.imdbRating <= 6.6)
       return ("star-o")
    if(this.state.film.imdbRating < 10)
       return("star-half-o")
    else
       return("star")

}



}


  FilmData(){
     if(this.state.loading)
             return(<View style={{backgroundColor:'#555252',height: height}}><ActivityIndicator  color="white"style={{flex: 1}}animating= {true} size={80}/></View>)
     
    else{
        
        return(<ScrollView style={{backgroundColor: "#555252"}}>
          <Text style={{textAlign:"center",fontSize:22,color:"#FFFFFF",fontWeight :"bold",marginTop:10}}>{this.state.film.Title} ({this.state.film.Year})</Text>
          <Text style={{textAlign:"center",marginTop: 20,color:"#FFFFFF"}}>{this.state.film.Genre}</Text>
          <Text style={{textAlign:"center",marginTop: 10,color:"#FFFFFF"}}>{this.state.film.Runtime}</Text>
          <Text style={{textAlign:"center",marginTop: 10,marginLeft:10,color:"#FFFFFF"}}>{this.state.film.Plot}</Text>
          <View style={{flex: 1, flexDirection: 'row',marginTop:10}}>               
                <View style={{flex: 1, flexDirection: 'column',marginTop:10}}> 
                  <Image  style={{width: (width/2), height: (width/2),borderRadius: 100,marginLeft:5}}  source={this.state.film.Poster == 'N/A' ? require('../img/no-image.png'): {uri: this.state.film.Poster}}/>
                </View>  
                <View style={{flex: 1, flexDirection: 'column',marginTop:5,justifyContent: 'center', alignItems:'center'}}>  
                        <View style={{flex: 1, flexDirection: 'row',justifyContent: 'center', alignItems:'center'}}>  
                          <Icon name={this.calcStars(1)} size={22} color="yellow" style={{paddingLeft:10}}/>
                          <Icon name={this.calcStars(2)} size={22} color="yellow" style={{paddingLeft:10}}/>
                          <Icon name={this.calcStars(3)} size={22} color="yellow" style={{paddingLeft:10}}/>
                          <Text style={{fontWeight :"bold",color:"#FFFFFF"}}>  {this.state.film.imdbRating}/10</Text>
                        </View>
                    <View style={{marginBottom:60}}>                 
                       <Text style={{textAlign:"center",fontWeight :"bold",color:"#FFFFFF"}}>Prêmios:</Text>
                       <Text style={{textAlign:"center",color:"#FFFFFF",marginTop:10,marginLeft:5}}>{this.state.film.Awards}</Text>
                    </View>
                </View>    
          </View>
         
        
           <View style={{marginTop: 10}}>
            <Text style={{textAlign:"center",fontWeight :"bold",color:"#FFFFFF"}}>Lançamento:</Text>
            <Text style={{textAlign:"center",marginTop: 10,color:"#FFFFFF"}}>{this.state.film.Released}</Text>
          </View> 
          <View style={{marginTop: 10}}>
            <Text style={{textAlign:"center",fontWeight :"bold",color:"#FFFFFF"}}>Diretor:</Text>
            <Text style={{textAlign:"center",marginTop: 10,color:"#FFFFFF"}}>{this.state.film.Director}</Text>
          </View> 
           <View style={{marginTop: 10}}>
            <Text style={{textAlign:"center",fontWeight :"bold",color:"#FFFFFF"}}>Escritor:</Text>
            <Text style={{textAlign:"center",marginTop: 10,color:"#FFFFFF"}}>{this.state.film.Writer}</Text>
          </View> 
          <View style={{marginTop: 10}}>
            <Text style={{textAlign:"center",fontWeight :"bold",color:"#FFFFFF"}}>Atores:</Text>
            <Text style={{textAlign:"center",marginTop: 10,color:"#FFFFFF"}}>{this.state.film.Actors}</Text>
          </View> 
          <View style={{marginTop: 10}}>
            <Text style={{textAlign:"center",fontWeight :"bold",color:"#FFFFFF"}}>Língua:</Text>
            <Text style={{textAlign:"center",marginTop: 10,color:"#FFFFFF"}}>{this.state.film.Language}</Text>
          </View> 
          <View style={{marginTop: 10}}>
            <Text style={{textAlign:"center",fontWeight :"bold",color:"#FFFFFF"}}>País:</Text>
            <Text style={{textAlign:"center",marginTop: 10,color:"#FFFFFF"}}>{this.state.film.Country}</Text>
          </View> 
          <View style={{marginTop: 10,marginBottom:10}}>
            <Text style={{textAlign:"center",fontWeight :"bold",color:"#FFFFFF"}}>Tipo:</Text>
            <Text style={{textAlign:"center",marginTop: 10,color:"#FFFFFF"}}>{(this.state.film.Type=='movie'?"Filme":this.state.film.Type=='series'?"Série":this.state.film.Type)}</Text>
          </View> 
          <Button  style={{width:width}}onPress={()=>{this.saveOrDeleteFilm()}} title={(this.state.saved? "Remover":"Salvar")} textStyle={{color:(this.state.saved? 'white':'black')}} backgroundColor={(this.state.saved?"#282626":"#FFFFFF")}/>
          </ScrollView>  )

    }
    



  }


  render(){
   
   return(this.FilmData())


  }






}