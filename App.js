import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput, Animated, PanResponder} from 'react-native';
import { useState, useRef } from 'react';

export default function App() {  
  const [allTasks, setAllTasks] = useState([{title: "Eating", isCompleted: true}, {title: "Study", isCompleted: true}, {title: "Walking", isCompleted: false}, {title: "Sleeping", isCompleted: true}]);    
  const [updatedText, setText] = useState('');  
  const [pendingTask, setPendingTask] = useState(false);    

  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, {dx: pan.x, dy: pan.y}], {useNativeDriver: true}),
      onPanResponderRelease: () => {
        Animated.spring(pan, {
          toValue: {x: 0, y: 0},
          useNativeDriver: true,
        }).start();
      },
    }),
  ).current;

  function modalAddTask(){           
    return(
      <View style={styles.addTaskContainer}>

        <Text style={{fontWeight: 'bold', right: "-28%", top: "5%", fontSize: 17.5}}>Input task</Text>

        <TextInput style={styles.taskInput} placeholder='NewTask' onChangeText={newText => setText(newText)} autoFocus={true}></TextInput>


        <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={() => {setPendingTask(false); setText('')}}>
            <Text style={{color: 'black', fontWeight: 'bold', fontSize: 14}}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.okButton} onPress={okButtonPressed}>
            <Text style={{color: 'black', fontWeight: 'bold', fontSize: 14}}>OK</Text>
          </TouchableOpacity>          
        </View>        
  
      </View>
    );        
  };  

  function okButtonPressed(){
    if (updatedText === ''){
      setPendingTask(false);
    }else
    {
      const newTasks = [...allTasks, {title: updatedText, isCompleted: false}];      
      setText('');
      setPendingTask(false);
      setAllTasks(newTasks);
    }    
  }

  function renderItem({item}){
    return(        
      <View style={styles.listItemBorderStyle}> 
        <TouchableOpacity style={styles.radioButton} onPress={() => radioButtonPressed({item})} activeOpacity={0.2}>
          {item.isCompleted ? <View style={styles.radioButtonPressed}></View> : null}
        </TouchableOpacity>
        <Text style={styles.listItemNameStyle}>{item.title}</Text>     
      </View>          
    );

  }

  function radioButtonPressed({item}){
    const indexToRemove = allTasks.indexOf(item);
    allTasks[indexToRemove].isCompleted = !allTasks[indexToRemove].isCompleted;
    const updatedTasks = [...allTasks];
    
    setAllTasks(updatedTasks);  
  }


  return (
    <View style={styles.container}>                        

      <View style={styles.header}>

        <TouchableOpacity style={styles.circle} onPress={() => setPendingTask(true)}>
          <Text style={{fontSize: 38, color: "white", textAlign: 'center', alignContent: 'center', justifyContent: 'center', top: -2}}>+</Text>        
        </TouchableOpacity>      
        <View style={styles.headingContainer}>
          <Text style={{fontSize:25, fontWeight: 'bold'}}>To Do List Today</Text>
          <Text style={{fontSize:15, right: 40, top: -5}}>{allTasks.length} tasks today</Text>
        </View>      

      </View>      

      {pendingTask ? modalAddTask() : null}
      
      <FlatList style={styles.listStyle} data={allTasks} renderItem={({item}) => renderItem({item})} ></FlatList>    
      
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {    
    display: 'flex',    
    backgroundColor: 'white',
    alignItems: 'center',        
    height:"100%",    
  },  
  taskInput:{
    backgroundColor: '#E5eaea',
    margin: 20,
    borderRadius: 5,
       
  },
  addTaskContainer:{
    backgroundColor: 'white',
    height: 23,
    width: 200,
    zIndex:1,
    borderRadius: 10,    
    marginTop: '55%',    
    display: 'flex',    
    shadowColor: '#00000',  
    elevation: 10,
    position: 'absolute'
  },
  buttonsContainer:{    
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'row',        
    marginTop: 0,
    height: 35,
    width: "99%",
    borderTopWidth: 0.9,
    borderColor: 'dodgerblue',    
  },
  okButton:{
    backgroundColor: 'white',            
    alignItems: 'center',
    justifyContent: 'center',        
    borderRadius: 4,          
    borderLeftWidth: 1,
    width: '50%',
    borderColor: 'dodgerblue'
  },
  cancelButton:{
    backgroundColor: 'white',            
    alignItems: 'center',
    justifyContent: 'center',         
    borderRadius: 5,
    borderRightWidth: 1,
    width: '50%',
    right: -1,
    borderColor: 'dodgerblue'
  },
  header:{
    backgroundColor: 'white',
    padding: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',                         
  },
  headingContainer:{    
    alignItems: 'center',    
    width: '50%',
    height: '45%',
    paddingHorizontal: 0,    
    backgroundColor: 'white',       
    marginTop: 70,
    position: 'absolute',    
  },
  circle:{      
    height: 50,
    flexDirection: 'column',
    width:50,
    borderRadius: 50/2,
    backgroundColor: "dodgerblue",
    justifyContent: 'center',
    alignContent: 'center',
    marginTop: 50,
    marginLeft: 300  
  },    
  listStyle:{
    width: "100%",    
    backgroundColor: 'white',    
    padding:5, 
  },
  listItemBorderStyle:{   
    display: 'flex',
    flexDirection: 'row',
    alignContent:'center',
    justifyContent: 'flex-start',    
    height:50,    
    borderRadius: 9,
    margin:5,
    padding:4,    
    backgroundColor: 'white',
    shadowColor: '#00000',  
    elevation: 10,
  },
  listItemNameStyle:{    
    fontSize:20,
    top: 5,
    right:-20,    
  },
  radioButton:{
    height:30,
    width: 30,
    borderRadius: 30/2,
    borderWidth: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    marginTop: 5    
  },
  radioButtonPressed:{
    height:20,
    width: 20,
    borderRadius: 10,    
    backgroundColor: 'dodgerblue',         
  }  
});
