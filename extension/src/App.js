import React, { useEffect, useState } from "react";
import styled, { css } from 'styled-components';

import Logo from "./assets/logo.svg";
import Tags from "@yaireo/tagify/dist/react.tagify";
import _ from 'lodash';
import axios from 'axios';

/*global chrome*/

const Wrapper = styled.div`
  background: #fff;
  width: 250px;
  padding: 30px;
`;

const Tag = styled(Tags)`
background: #fff;
margin: 15px 0;
  > span {
    padding-left: 0px;
  }
`;

const Input = styled.input`
  height: 20px;
  color: #444444;
  font-style: italic;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 96%;  
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

// fetch()
  //   .then(data => {
  //     const tags = data.map(tag => tag.tag);
  //     setLocalState(lastState => ({
  //       whitelist: tags
  //     }))
  //   });

const fetch = () => {
  return axios
    .get('tag', { headers: { Authorization: `Bearer ${localStorage.token}` } })
    .then((response) => {
      const { tags } = response.data;
      const ordered = _.orderBy(tags);
      return ordered;
    })
    .catch((error) => {
      console.log(error);
    });
  }  

  const localGoogleLogin = access_token => {
        axios
          .post('/auth/google', { access_token })
          .then((response) => {
            console.log(response);
            const token = response.headers['x-auth-token'];        
            localStorage.setItem('token', token);
            console.log({ token });
          })
          .catch((error) => {        
            console.log(error);
          });
      };

const App = () => {      
  const [token, setToken] = useState();
  const [tags, setTags] = useState("");
  const [localState, setLocalState] = useState([]);
  
  useEffect(() => {       
      if(chrome.identity) {
        console.log(chrome.identity);
        chrome.identity.getAuthToken({interactive: true}, (access_token) => {
          console.log(access_token);
          localGoogleLogin(access_token);
        });  
      }
  }, []);

  const settings = {
    ...tagifySettings,
    ...localState,
    callbacks: tagifyCallbacks
  };


  const save = () => {
    chrome.tabs.query({currentWindow: true, active: true}, (tabs) => {      
      const { url } = tabs[0];
      
      if(url) {
         const data = tags.split(",").map(tag => tag.trim());
         axios
          .post('/article', { url, tags: JSON.stringify(data) },  { headers: { Authorization: `Bearer ${token}` } })
          .then((response) => {
            console.log(response);
          })
          .catch((error) => {     
            console.log(error);   
          });
      }      
    });
  }

  if(!token)
  {    
    return (
      <Wrapper>
        <img src={Logo} />
        <Button onClick={() => window.open('http://localhost:3000/login', '_blank')}>Login/register</Button>
      </Wrapper>
    )
  }

  return (
    <Wrapper>
      <img src={Logo} />
      <Tag
        settings={settings}
        value={localState.value}
        showDropdown={localState.showDropdown}
      />    
      <Button onClick={save}>SAVE</Button>
    </Wrapper>
  );
}

export default App;
