import React from 'react';
import { StyleSheet, Text, View, StatusBar, Platform } from 'react-native';
import { LinearGradient, AppLoading } from 'expo';
import PropTypes from 'prop-types';
import { TextInput, ScrollView } from 'react-native-gesture-handler';
import ToDo from "./Todo";
import uuidv1 from "uuid/v1"


export default class App extends React.Component {

  state = {
    newToDo: "",
    loadedToDos : false
  }

  componentDidMount() {
    this._loadToDos();
  }

  _loadToDos = () => {
      this.setState({
        loadedToDos : true
      })
  }

  render() {
    const { newToDo, loadedToDos } = this.state;
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
              <ToDo text={"Hello i'm a ToDo"} />
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
            const newToDoObject = {
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
