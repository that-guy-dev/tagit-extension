import React, { useState, useEffect } from "react";
import styled, { css } from 'styled-components';
// import Tags from "@yaireo/tagify/dist/react.tagify";
import Logo from "./assets/logo.svg";
import _ from 'lodash';
import axios from 'axios';

/*global chrome*/

const Wrapper = styled.div`
  background: #fff;
  width: 250px;
  padding: 30px;
`;

const Tag = styled.div`
background: #fff;
margin: 15px 0;
  > span {
    padding-left: 0px;
  }
`;

const Button = styled.div`
  background: #5649CF;
  display: flex;
  justify-content: center;
  height: 50px;
  align-items: center;
  color: white;
  font-weight: bold;
  letter-spacing: 1px;
  cursor: pointer;
`;


const tagifySettings = {
  blacklist: ["xxx", "yyy", "zzz"],
  // maxTags: 6,
  backspace: "edit",
  addTagOnBlur: false,
  placeholder: "",
  dropdown: {
    enabled   : 3,
    maxItems  : 3
  }
};


const callback = e =>
  console.log(`%c ${e.type}: `, "background:#222; color:#bada55", e.detail);

// callbacks props (for this demo, the same callback reference is assigned to every event type)
const tagifyCallbacks = {
  add: callback,
  remove: callback,
  input: callback,
  edit: callback,
  invalid: callback,
  click: callback
};

axios.defaults.baseURL = 'http://localhost:5000/';

// chrome.storage.sync.get(['key'], function(result) {        
//   if (!result.key) {
//    console.log('no key');
//   }
//   console.log(result.key);
// }); 

// fetch()
  //   .then(data => {
  //     const tags = data.map(tag => tag.tag);
  //     setLocalState(lastState => ({
  //       whitelist: tags
  //     }))
  //   });

// const fetch = () => {
  // return axios
  //   .get('tag', { headers: { Authorization: `Bearer ${localStorage.token}` } })
  //   .then((response) => {
  //     const { tags } = response.data;
  //     const ordered = _.orderBy(tags);
  //     return ordered;
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });
  // }  

  const localGoogleLogin = access_token => {
    axios
      .post('/auth/google', { access_token })
      .then((response) => {
        const token = response.headers['x-auth-token'];        
        localStorage.setItem('token', token);
        console.log({ token });
      }).then(() => {      
      })
      .catch((error) => {        
      });
  };

  
const App = () => {      
  const [localState, setLocalState] = useState([]);
  
  useEffect(() => {   

    // if(!localStorage.token)
    // {
      if(chrome.identity) {
        chrome.identity.getAuthToken({interactive: true}, (access_token) => {
          localGoogleLogin(access_token);
        });  
      }
    // }    

  }, []);

  const settings = {
    ...tagifySettings,
    ...localState,
    callbacks: tagifyCallbacks
  };

  const save = () => {

    chrome.tabs.query({currentWindow: true, active: true}, (tabs) => {

      const { url } = tabs[0];      
      const tags = JSON.stringify([]);

      axios
        .post('/article', { url, tags },  { headers: { Authorization: `Bearer ${localStorage.token}` } })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {     
          console.log(error);   
        });

    });
  }

  return (
    <Wrapper>
      <img src={Logo} />
      <Tag
        settings={settings}
        value={localState.value}
        showDropdown={localState.showDropdown}
      />
      		       
      <input type="text" />
    
      <Button onClick={save}>Save to tagit</Button>
    </Wrapper>
  );
}

export default App;
