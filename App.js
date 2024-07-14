import { StyleSheet, Text, View, FlatList, TouchableOpacity, TextInput, Animated, PanResponder, Touchable} from 'react-native';
import { useState, useRef, useEffect } from 'react';
import axios, { all } from 'axios';

export default function App() {    
  const [allTasks, setAllTasks] = useState([]);    
  const [updatedText, setText] = useState('');  
  const [pendingTask, setPendingTask] = useState(false);       
  const [tasksLength, setTasksLength] = useState(allTasks.length);
  getTasksStoredInServer();
  console.log("alltasks as application starts", allTasks);   
  console.log(tasksLength)      

 async function getTasksStoredInServer(){

  function compareObjects(item1, item2){
    return (item1.id === item2.id) && (item1.name === item2.name) && (item1.isCompleted === item2.isCompleted);
  }

  function compareItemWithArray(item, array) {
    for (let i = 0; i < array.length; i++) {
      if (compareObjects(item, array[i])) {
        return true; // Found a match
      }
    }
    return false; // No match found
  }
  
  try{
    const response = await axios.get("http://localhost:8587/GetAllTodoItems");

    let refresh = false;
    
    if (response.data.length !== allTasks.length){
      refresh = true;
    }else{
      allTasks.forEach((item) => {
        if (compareItemWithArray(item, response.data) === false){
          refresh = true;
        }
      });
    }

    console.log("refresh screen", refresh);
    
    if (refresh)
    {      
      setAllTasks(response.data);          
      setTasksLength(allTasks.length);
      console.log("all tasks when refreshed", response.data);
    }    
  }catch (error) {
    console.log('Error fetching data:', error);
  }  
 }
 
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

  async function okButtonPressed(){
    if (updatedText === ''){
      setPendingTask(false);
    }else
    {      
      const url = "http://localhost:8587/AddToDoItem?name=" + updatedText;
      var response = await fetch("http://localhost:8587/AddToDoItem", 
                              {method: "POST", 
                              headers: {"Accept":"application/json", "Content-Type":"application/json"}, 
                              body: JSON.stringify(updatedText)
                              });      
      setText('');
      setPendingTask(false);      
    }    
  }

  async function deleteButtonPressed({item}){    
    try{
      var respose = await fetch("http://localhost:8587/RemoveToDoItem",
                              {
                                method: "POST",
                                headers:{"Accept":"application/json", "Content-Type":"application/json"},
                                body: JSON.stringify(item.id)                                
                              });
      const newTasksList = allTasks.filter(x => x !== item);
      setAllTasks(newTasksList);    
      

    }catch(error){
      console.log(error);
    }    
  }

  function renderItem({item}){          
    console.log("item rendering status:", item.isCompleted);

      return(
      
        <View style={styles.listItemBorderStyle}>        

            <TouchableOpacity style={styles.radioButton} onPress={() => radioButtonPressed({item})} activeOpacity={0.2}>  
              {item.isCompleted ? <View style={styles.radioButtonPressed}></View> : null}
            </TouchableOpacity>
            <Text style={styles.listItemNameStyle}>{item.name}</Text>                      

            <TouchableOpacity style={styles.deleteButton} onPress={() => deleteButtonPressed({item})}>              
              <Text style={{textAlign: 'center', color: 'white', fontSize: 16, fontWeight: 'bold'}}>Delete</Text>
            </TouchableOpacity>

        </View>
      );                
  }

  async function radioButtonPressed({item}){    
    try{
      
      console.log("radio button pressed of", item);
      const newItem = {id: item.id, isCompleted: item.isCompleted};
      newItem.isCompleted = !newItem.isCompleted;            
      console.log("new item generated after radio button", {newItem});
      console.log(!newItem.isCompleted);
      

      const response = await fetch("http://localhost:8587/ChangeStatusToDoItem", 
                              {method: "POST", 
                              headers: {"Content-Type":"application/json"}, 
                              body: JSON.stringify(newItem)});

      await console.log("response after sending new item", response.text());
      

      // Create a new array with the updated item
    const newTasks = allTasks.map((task) =>
    task.id === newItem.id ? newItem : task
  );

  // Update the state with the new array
  setAllTasks(newTasks);
  
      
    }catch(error){
      console.log(error);
    }    
  }

  return (
    <View style={styles.container}>                        

      <View style={styles.header}>

        <TouchableOpacity style={styles.circle} onPress={() => setPendingTask(true)}>
          <Text style={{fontSize: 38, color: "white", textAlign: 'center', alignContent: 'center', justifyContent: 'center', top: -2}}>+</Text>        
        </TouchableOpacity>      

        <View style={styles.headingContainer}>
          <Text style={{fontSize:25, fontWeight: 'bold'}}>To Do List Today</Text>
          <Text style={{fontSize:15, right: 40, top: -5, backgroundColor: 'green'}}>tasks today</Text>
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
  deleteButton:{
    backgroundColor: 'dodgerblue',    
    width: 80,
    height: 28,
    borderRadius: 15,
    top: 7.5,
    justifyContent: 'center',            
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
    width: 250,    
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
