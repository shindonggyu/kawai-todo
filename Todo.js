import React from 'react';
import { StyleSheet, Text, View, StatusBar, Platform
,TouchableOpacity, TextInput } from 'react-native';
import { LinearGradient } from 'expo';
import PropTypes from 'prop-types';

export default class ToDo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isEditing : false, toDoValue : props.text
        }
    }

    static propTypes ={
        text : PropTypes.string.isRequired,
        isCompleted: PropTypes.bool.isRequired,
        createdAt: PropTypes.number.isRequired,
        deleteToDo: PropTypes.func.isRequired
    }

    

    render(){
        const { isCompleted, isEditing, toDoValue } = this.state;
        const { text,id , deleteToDo } = this.props;
        return(
            <View style={styles.container}>
            <View style={styles.columns}>
                <TouchableOpacity onPress={this._toggleComplete}>
                    <View style={[styles.circle, isCompleted ? 
                        styles.completedCircle : styles.uncompletedCircle]}/>
                </TouchableOpacity>
                { isEditing ? (<TextInput 
                style={[styles.input, styles.text, isCompleted ? 
                    styles.completedText : styles.uncompletedText ]} 
                 value={toDoValue} onChangeText={this._controllInput}
                 autoCorrect={false} multiline={true} onBlur={this._endEditing}
                />) : 
                (<Text 
                    style={[styles.text, isCompleted ? 
                styles.completedText : styles.uncompletedText]}>{text}</Text>)}
                    
            </View>
            {isEditing ? (<View style={styles.columns}>
                <View style={styles.actions}>
                    <TouchableOpacity onPressOut={this._endEditing}>
                        <View style={styles.actionContainer}>
                            <Text style={styles.action}>✅</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>) : (<View style={styles.columns}>
                <View style={styles.actions}>
                <TouchableOpacity onPressOut={this._startEditing}>
                    <View style={styles.actionContainer}>
                        <Text style={styles.action}>✏️</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPressOut={()=> deleteToDo(id)}>
                    <View style={styles.actionContainer}>
                        <Text style={styles.action}>❌</Text>
                    </View>
                </TouchableOpacity>   
                </View>
            </View>)}
            
            
            </View>
        )
    }

    _toggleComplete = () => {
        this.setState(prevState => {
            return{
                isCompleted : !prevState.isCompleted
            }
        })
    }

    _endEditing = () => {
        this.setState({
            isEditing : false
        })
    }

    _startEditing = ()=> {
        this.setState({
            isEditing : true
        })
    }
    _controllInput = (text) => {
        this.setState({
            toDoValue : text
        })
    }


}

const styles = StyleSheet.create({
    container: {
        borderBottomColor: "#bbb",
        borderBottomWidth: StyleSheet.hairlineWidth,
        flexDirection: "row",
        alignItems : "center",
        justifyContent: "space-between"
    },
    circle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        borderWidth: 5,
        marginRight: 15
    },
    text: {
        fontSize: 20,
        fontWeight: "400",
        marginVertical: 20
    },
    completedCircle: {
        borderColor: "#bbb"
    },
    uncompletedCircle: {
        borderColor : "#F23657"
    },
    completedText: {
        color: "#bbb",
        textDecorationLine: "line-through"
    },
    uncompletedText: {
        color :"black"
    },
    columns: {
        flexDirection: "row",
        alignItems: "center"
    },
    actions: {
        flexDirection: "row"
    },
    actionContainer: {
        margin: 10
    },
    input: {
        width: "70%"
    }

})