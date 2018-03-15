import React from 'react';
import { View, StyleSheet, Image, ImageBackground, Text,
  TouchableOpacity, Alert, Platform, ScrollView, 
} from 'react-native'
import { WebBrowser, Constants, Location, Permissions, MapView } from 'expo';
import * as firebase from 'firebase';
import MainTaNavigator from '../navigation/MainTabNavigator';
import { StackNavigator } from 'react-navigation';
import actions from '../actions'
const data = require('../constants/config.json');

// Initialize Firebase
const firebaseConfig = {
    apiKey: data["firebase"].apiKey,
    authDomain: data["firebase"].authDomain,
    databaseURL: data["firebase"].databaseURL,
    projectId: data["firebase"].projectId,
    storageBucket: data["firebase"].storageBucket,
    messagingSenderId: data["firebase"].messagingSenderId
  };

firebase.initializeApp(firebaseConfig);

export default class login extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
          userInfo: this.props,
          error: '',
          loading: false,
        };
    }
    static navigationOptions = {
      title: 'Login',
      header: null,
      headerLeft: null
    };

    loginFB = async () => {
        this.setState({ error: '', loading: true });

        const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync(data.facebook.appId, {
            permissions: ['public_profile'],
        });

        if (type === 'success') {

            const credential = firebase.auth.FacebookAuthProvider.credential(token);

            // Sign in with credential from the Facebook user.
            firebase.auth().signInWithCredential(credential).catch((error) => {
              this.setState({ error: 'Authentication failed', loading: false });
            });

            // Get the user's name using Facebook's Graph API
            const response = await fetch(
            `https://graph.facebook.com/me?access_token=${token}&fields=id,name,picture.type(large)`);
            const userInfo = await response.json();
            this.setState({userInfo: userInfo});
            console.log('Logged in, ' + userInfo.name);

            firebase.auth().onAuthStateChanged((user) => {
                if (user != null) {
                    this.setState({ error: '', loading: false });
                    this.props.navigation.navigate('Main', {
                        picture: userInfo.picture.data.url,
                        name: userInfo.name,
                        id: userInfo.id,
                        user: user,
                        firebase: firebase
                    });
                } else {
                  this.setState({ error: 'Authentication failed', loading: false });
                }
            });

        } else if (type === 'cancel') {
          Alert.alert('Login cancelled.');
          this.setState({ loading: false });
        }
    }

    loginGoogle = async () => {
      try {
        const result = await Expo.Google.logInAsync({
          androidClientId: data.google.android,
          iosClientId: data.google.ios,
          scopes: ['profile', 'email'],
        });
    
        if (result.type === 'success') {
          const credential = firebase.auth.GoogleAuthProvider.credential(result.accessToken);
          
          // Sign in with credential from the Facebook user.
          firebase.auth().signInWithCredential(credential).catch((error) => {
            this.setState({ error: 'Authentication failed', loading: false });
          });

          firebase.auth().onAuthStateChanged((user) => {
            if (user != null) {
                this.setState({ error: '', loading: false });
                actions.setUser(user);
                actions.setFirebase(firebase);
                this.props.navigation.navigate('Main', {
                    // picture: result.user.photoUrl,
                    // name: result.user.name,
                    // id: result.user.id,
                    // user: user,
                    // firebase: firebase
                });
            } else {
              this.setState({ error: 'Authentication failed', loading: false });
            }
          });
          console.log(result.user.name, result.user.photoUrl);
          return result.accessToken;
        } else {
          return {cancelled: true};
        }
      } catch(e) {
        return {error: true};
      }
    }

    renderLoginOrLoading() {
        if (this.state.loading) {
            return <Text style={styles.getStartedText}> Loading </Text>
        }
        return <View style={styles.centerLogIn}>
                    <TouchableOpacity 
                    style={styles.container}
                    onPress={this.loginFB} >
                    <Image source={require('../assets/images/facebook-login2.png')} style={styles.loginContainer} />
                    </TouchableOpacity>

                    <TouchableOpacity 
                    style={styles.container}
                    onPress={this.loginGoogle} >
                    <Image source={require('../assets/images/google-login2.png')} style={styles.loginContainer} />
                    </TouchableOpacity>

                    <Text>{this.state.error}</Text>
        </View>

    }
    render() {
        return (
            <ImageBackground source={require('../assets/images/back3.jpg')} style={styles.container}>
                <ScrollView
                  style={styles.container}
                  contentContainerStyle={styles.contentContainer}>
                  <View style={styles.welcomeContainer}>
                    <Image
                      source={require('../assets/images/logo.png')}
                      style={styles.welcomeImage}
                    />
                  </View>

                  <View style={styles.getStartedContainer}>
                    <Text style={styles.getStartedText}>Welcome to GoodTurn!</Text>
                  </View>

                  <View style={styles.getStartedView}>
                    <Text style={styles.getStartedText}>Sign in to continue for free</Text>
                  </View>
                  
                  {this.renderLoginOrLoading()}

                  <View style={styles.helpContainer}>
                    <TouchableOpacity
                      onPress={this._handleHelpPress}
                      style={styles.helpLink}>
                      <Text style={styles.helpLinkText}>
                        Help
                      </Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>

                {/*<View style={styles.tabBarInfoContainer}>
                  <Text style={styles.tabBarInfoText}>
                    Put adds here?
                  </Text>
                </View>*/}

            </ImageBackground>
        )
    }

  _handleHelpPress = () => {
    WebBrowser.openBrowserAsync(
      'http://www.ryanwalker.party/goodturn'
    );
  };
}

const styles = StyleSheet.create({
  centerLogIn: {
    flex:1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 30,
  },
  getStartedText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
  getStartedView: {
    flex:1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  loginContainer: {
    width: 350,
    height: 87,
    resizeMode: 'contain',
    marginBottom: 1,
    backgroundColor: 'transparent',
  },
  /*tabBarInfoContainer: {
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
  },*/
  /*tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },*/
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    backgroundColor: 'transparent',
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: 'transparent',
  },
  welcomeImage: {
    width: 300,
    height: 240,
    resizeMode: 'contain',
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: 'transparent',
  },
});
