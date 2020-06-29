import firebase from 'firebase/app';
import 'firebase/auth';
import axios from 'axios';
import Setup from './setup';

function App({ sheetId, languages, existMetadata, messages }) {
    function doLogin () {
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then(function(result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;

            console.log(user);
            // ...
          }).catch(function(error) { 
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
            console.log(error);
          });
    }
    return (
        <div>
            <button type="button" onClick={doLogin}>로그인</button>

            <Setup
                sheetId={sheetId}
                languages={languages}
                existMetadata={existMetadata}
                messages={messages}
            ></Setup>
        </div>
    );
}

App.getInitialProps = async ({ req }) => {
    const res = await axios.get('http://localhost:3000/api/metadata');
    const existMetadata = res.data.sheetId !== '' && res.data.languages.length > 0;
    const res2 = existMetadata ? await axios.get('http://localhost:3000/api/messages') : { data: {} };
  
    return {
        sheetId: res.data.sheetId,
        languages: res.data.languages,
        existMetadata: existMetadata,
        messages: res2.data
    }
}

export default App;
