import React, { useState, useEffect } from "react";
import styled, { css } from 'styled-components';
import Tags from "@yaireo/tagify/dist/react.tagify";
import Logo from "./assets/logo.svg";
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

const Button = styled.div`
  background: #5649CF;
  display: flex;
  justify-content: center;
  height: 50px;
  align-items: center;
  color: white;
  font-weight: bold;
  letter-spacing: 1px;
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

chrome.storage.sync.get(['key'], function(result) {        
  if (!result.key) {
   console.log('no key');
  }
  console.log(result.key);
}); 

const fetch = (token) => {
  return axios
    .get('tag', { headers: { Authorization: `Bearer ${token}` } })
    .then((response) => {
      const { tags } = response.data;
      const ordered = _.orderBy(tags);
      return ordered;
    })
    .catch((error) => {
      console.log(error);
    });
  }

const App = () => {      
  const [localState, setLocalState] = useState([]);
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzExNjhiZDlmZmE2N2QzYzYyMDAxZCIsImlhdCI6MTU3NDExNTU0N30.9FggkmGeo6AnMklfGTDldhzbBTOkKQtK3mgOJsJn5XE';
  useEffect(() => {
  fetch(token)
  .then(data => {
    const tags = data.map(tag => tag.tag);
    setLocalState(lastState => ({
      whitelist: tags
    }))
  });
}, []);

const settings = {
  ...tagifySettings,
  ...localState,
  callbacks: tagifyCallbacks
};


  return (
    <Wrapper>
      <img src={Logo} />
      <Tag
        settings={settings}
        value={localState.value}
        showDropdown={localState.showDropdown}
      />
      <Button>Save to tagit</Button>
    </Wrapper>
  );
}

export default App;
