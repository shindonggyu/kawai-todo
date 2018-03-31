import React from 'react';
import { StyleSheet, Text, View, StatusBar, Platform, AsyncStorage } from 'react-native';
import { LinearGradient, AppLoading } from 'expo';
import PropTypes from 'prop-types';
import { TextInput, ScrollView } from 'react-native-gesture-handler';
import ToDo from "./Todo";
import uuidv1 from "uuid/v1"


export default class App extends React.Component {

  state = {
    newToDo: "",
    loadedToDos : false,
    toDos: {}
  }

  componentDidMount() {
    this._loadToDos();
  }

  _loadToDos = async () => {
    try{
      const toDos = await AsyncStorage.getItem("toDos");
      const parsedToDos = JSON.parse(toDos);
      this.setState({
        loadedToDos : true,
        toDos : parsedToDos
      })
    }catch(err){
      console.log(err);
    }
    
      
  }

  render() {
    const { newToDo, loadedToDos, toDos } = this.state;
    if(!loadedToDos){
      return(
        <AppLoading />
      )
    }
    return (
      <View style={styles.container}>
        <StatusBar
          barStyle="light-content"
        />
        <Text style={styles.title}>Kawai To Do</Text>
        <View style={styles.card}>
          <TextInput style={styles.input} placeholder={"New to do"} value={newToDo}
           onChangeText={this._controllNewToDo} autoCorrect={false}
           onSubmitEditing={this._addToDos}
           />
          <ScrollView style={styles.todo}>
             {Object.values(toDos).reverse()
             .map(todo => <ToDo 
             key={todo.id} 
             {...todo} 
             deleteToDo={this._deleteToDo}
             completeToDo={this._completeToDo}
             uncompleteToDo={this._uncompleteToDo}
             updateToDo={this._updateToDo}/>)}
          </ScrollView>
        </View>
      </View>
    );
  }

  _addToDos=()=>{
    const { newToDo } = this.state;
    if(newToDo !== ""){
        this.setState(prevState =>{
            const ID = uuidv1();
            const newToDoObject = { //Object로 만드는 이유는 삭제,수정 하기 쉽게 하려고. 
              [ID] : {          //variable이라 대괄호를 씌워줬음. 원래같으면 "" 을 썻을거임
                id : [ID],
                isCompleted : false,
                text: newToDo,
                createdAt : Date.now()
              }
            }
            const newState = {
              ...prevState,
              newToDo : "",
              toDos : {
                ...prevState.toDos,
                ...newToDoObject
              }
            }
            this._saveToDos(newState.toDos);
            return {
              ...newState
            }
        })
    }
  }

  _controllNewToDo = text => {
    this.setState({
      newToDo : text
    });
  };

  _deleteToDo = (id) => {
      this.setState(prevState =>{
        const toDos = prevState.toDos;
        delete toDos[id];
        const newState = {
          ...prevState,
          ...toDos  //이 부분 이해하기 너무 빡쎄다;;; 아마 이전에 있던 prevState를 다 불러온 담에
        }       //toDos는 새로워진 부분이므로 toDos 한 번 더 불러오는 건가..
        this._saveToDos(newState.toDos);
        return {
          ...newState
        }
      })
  }

  _uncompleteToDo = (id) => {
    this.setState(prevState =>{
      const newState = {
        ...prevState,
        toDos : {
          ...prevState.toDos,
          [id] : {
            ...prevState.toDos[id],
            isCompleted : false
          }
        }
      }
      this._saveToDos(newState.toDos);
      return {
        ...newState
      };
    })
  }

  _completeToDo = (id)=> {
    this.setState(prevState =>{
      const newState = {
        ...prevState,
        toDos : {
          ...prevState.toDos,
          [id] : {
            ...prevState.toDos[id],
            isCompleted : true
          }
        }
      }
      this._saveToDos(newState.toDos);
      return {...newState};
    });
  }

  _updateToDo = (id, text) => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        toDos: {
          ...prevState.toDos,
          [id] : {
            ...prevState.toDos[id],
            text : text
          }
        }
      }

      this._saveToDos(newState.toDos);
      return {...newState}
    })
  }

  _saveToDos = (newToDos) => {
    const saveToDos = AsyncStorage.setItem("toDos", JSON.stringify(newToDos));
  }

}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F23657',
    alignItems: "center",
    padding: 10,
    paddingBottom: 25
  },
  title: {
    marginTop: 70,
    color:"white",
    fontSize:30,
    fontWeight:"300",
    marginBottom:30
  },
  card: {
    backgroundColor:"white",
    flex:1,
    width:"100%",
    borderRadius: 5,
    ...Platform.select({
      ios: {
          shadowColor: "black",
          shadowOpacity: 0.5,
          shadowRadius: 5,
          shadowOffset: {
            height: -1
          }
      },
      android: {
          elevation:3
      }
    })
  },
  input: {
    padding: 20,
    fontSize: 22,
    borderBottomWidth: 1,
    borderBottomColor: "#bbb" 
  },
  todo: {
    padding: 10,
  }
});
