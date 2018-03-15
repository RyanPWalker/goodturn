import React from 'react';
import {
  Image,
  ScrollView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import { WebBrowser, Constants, Location, Permissions } from 'expo';
import { connect } from 'react-redux';
import * as firebase from 'firebase';

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = { 
      text: '',
    };
  }
  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headerTop} />
        <ScrollView>
          <View style={styles.postHeader}>
            <View style={styles.postHeaderView1}>
              <TouchableOpacity
                onPress={this._storePost}
                style={styles.postButton}
                title="Post"
              />
            </View>
            <View style={styles.postHeaderView2}>
              <TextInput
                style={styles.postBox}
                placeholder="What new opportunity do you have?"
                placeholderStyle={{ /*paddingLeft: 25*/ textAlign: 'center', }}
                onChangeText={(text) => this.setState({text: text})}
              />
            </View>
          </View>
          {this._renderScrollView()}
          {console.log("User: ", this.props.user)}
          {console.log("Firebase: ", this.props.firebase)}
        </ScrollView>
      </View>
    );
  }

  componentWillMount() {
    //this._getPostsAsync();
  }

  /*_getUserPosts = async () => {
    var childData = await fetch(firebase.database().ref('users').on('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          childData = childSnapshot.val();
          console.log("longitude.. " + childData.longitude);
          console.log("latitude.. " + childData.latitude);
          console.log("name.. " + childData.name);
        });
    }));
    console.log("TRY 2 longitude.. " + childData.longitude);
          console.log("latitude.. " + childData.latitude);
          console.log("name.. " + childData.name);
    this.setState(previousState => ({
      markers: [previousState.markers, { title: childData.name, coordinates: {latitude: childData.latitude, longitude: childData.longitude} }]
    }));
    console.log(JSON.stringify(childData, null, 4))
    console.log(JSON.stringify(this.state.markers, null, 4))

    /*var query = firebase.database().ref("users").orderByKey();
    query.once("value")
      .then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          // key will be "ada" the first time and "alan" the second time
          var key = childSnapshot.key;
          // childData will be the actual contents of the child
          var childData = childSnapshot.val();
          console.log('testing.. ' + key);
          console.log('d;fkj; ' + childData)
      });
    });*/
  //}

  _handleLogoutPress = () => {
    this._resetNavigation('Login');
  };

  _renderScrollView = () => {
    var sections = [
      { name: 'Ryan', stuff: 'Name' },
      { name: 'Ryan', stuff: 'Name' },
      { name: 'Ryan', stuff: 'Name' },
    ];

    return (
      <View style={styles.contentContainer}>
        {sections.map((thing, index) =>
          <Text key={index} style={styles.textContainer}>{thing.name} {thing.stuff}</Text>
        )}
      </View>
    );
  }

  _resetNavigation = (targetRoute) => {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: targetRoute }),
      ],
    });
    this.props.navigation.dispatch(resetAction);
  } 

  _storePost = () => {
    let text = this.state.text;
    console.log("Text: " + text);
    // if (this.state.user != null) {
    //   firebase.database().ref('posts/').post({
    //     creator: this.state.user.uid,
    //     message: text,
    //   });
    //}
  }
  /*_storePost = () => {
    if (this.state.user != null) {
      firebase.database().ref('posts/' + this.state.user.uid).set({
        user: this.state.user.uid,
        postId: '',
        postContent: ''
      });
    }
  }*/
}

const styles = StyleSheet.create({
  centerLogIn: {
    flex:1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  clearButton: {
    marginTop: 20,
    backgroundColor: 'transparent',

  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 30,
    width: '100%',
    height: '20%'
  },
  headerTop: {
    backgroundColor: '#5bb0ff',
    top: 0,
    width: '100%',
    height: 20,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    textAlign: 'center',
  },
  postHeader: {
    height: 100,
    width: '100%',
    backgroundColor: '#cccccc',
  },
  postHeaderView1: {
    height: '50%',
    alignItems: 'flex-end',
  },
  postHeaderView2: {
    height: '50%',
    justifyContent: 'flex-end'
  },
  postBox: {
    margin: 3,
    backgroundColor: 'white',
    borderRadius: 25,
    height: '100%',
  },
  postButton: {
    height: '100%',
    width: '20%',
    backgroundColor: "#5bb0ff",
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3
    },
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  textContainer: {
    fontSize: 20,
    
  },
});

export default connect(
  (state) => ({user: state.user, firebase: state.firebase})
)(HomeScreen);