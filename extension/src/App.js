import React, { useEffect, useState } from "react";
import styled, { css, keyframes } from "styled-components";

import Logo from "./assets/logo.svg";
import Tags from "@yaireo/tagify/dist/react.tagify";
import _ from "lodash";
import axios from "axios";

/*global chrome*/

const blob = keyframes`
  from {
    transform: rotate(15deg) translate(-20px,0px) skewX(25deg);
  }
  to {
    transform: rotate(115deg) translate(20px,0px) skewX(-25deg);
  }
`;

const blob2 = keyframes`
  from {
    transform: rotate(-15deg) translate(20px,0px) skewX(-25deg);

  }
  to {
    transform: rotate(-115deg) translate(-20px,0px) skewX(25deg);
  }
`;

const Wrapper = styled.div`
  background: #fff;
  width: 250px;
  height: 174px;
  padding: 30px;
  background-image: linear-gradient(#6955e2, #28a6c8);
  z-index: 1;
`;

const Saving = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: white;
  height: 100%;
  font-size: 1.3em;
  font-weight: bold;
  position: relative;
  z-index: 1;
`;
const View = styled.a`
  font-size: 1em;
  font-weight: 300;
  position: relative;
  z-index: 1;
  color: white;
  text-decoration: none;
  margin-top: 13px;
`;

const EditBlobTop = styled.div`
  width: 1500px;
  height: 1500px;
  background: #4384d3;
  opacity: 0.6;
  border-radius: 100%;
  position: absolute;
  top: -20%;
  right: -20%;
  animation: ${blob} 20s ease-in-out infinite;
  animation-direction: alternate;
`;

const EditBlobBottom = styled.div`
  width: 1000px;
  height: 1000px;
  border-radius: 100%;
  background: rgb(91, 95, 203);
  position: absolute;
  bottom: -20%;
  left: 0%;
  opacity: 0.3;
  animation: ${blob2} 30s ease-in-out infinite;
        animation-direction: alternate;
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
  background: #5649cf;
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
    enabled: 2,
    maxItems: 10,
  },
};

const tagsArr = [];

const callback = (e) => {
  tagsArr.push(e.detail.data.value);
};

const tagifyCallbacks = {
  add: callback,
  remove: callback,
  // input: callback,
  edit: callback,
  invalid: callback,
  click: callback,
};

axios.defaults.baseURL = "http://localhost:5000/";

const fetch = () => {
  return axios
    .get("tag", { headers: { Authorization: `Bearer ${localStorage.token}` } })
    .then((response) => {
      const { tags } = response.data;
      const ordered = _.orderBy(tags);
      return ordered;
    })
    .catch((error) => {
      console.log(error);
    });
};

const localGoogleLogin = (access_token) => {
  axios
    .post("/auth/google", { access_token })
    .then((response) => {
      const token = response.headers["x-auth-token"];
      localStorage.setItem("token", token);
    })
    .catch((error) => {
      console.log(error);
    });
};

const App = () => {
  const [token, setToken] = useState();
  const [loader, setLoader] = useState(false);
  const [success, setSuccess] = useState(false);
  const [start, setStart] = useState(true);
  const [localState, setLocalState] = useState([]);

  useEffect(() => {
    setToken(localStorage.token);
    fetch(localStorage.token).then((data) => {
      const tags = data.map((tag) => tag.tag);
      setLocalState({
        whitelist: tags,
      });
    });
    if (chrome.identity) {
      console.log(chrome.identity);
      chrome.identity.getAuthToken({ interactive: true }, (access_token) => {
        localGoogleLogin(access_token);
      });
    }
  }, []);

  const settings = {
    ...tagifySettings,
    ...localState,
    callbacks: tagifyCallbacks,
  };

  const save = () => {
    chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
      const { url } = tabs[0];
      if (url) {
        setStart(false)
        setLoader(true);
        axios
          .post(
            "/article",
            { url, tags: JSON.stringify(tagsArr) },
            { headers: { Authorization: `Bearer ${token}` } }
          )
          .then((response) => {
            setLoader(false);
            setSuccess(true);
            console.log(response);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  };

  if (!token) {
    return (
      <Wrapper>
        <img src={Logo} />
        <Button
          onClick={() => window.open("http://localhost:3000/login", "_blank")}
        >
          Login/register
        </Button>
        <EditBlobTop />
      <EditBlobBottom />
      </Wrapper>
    );
  }
  
  return (
    <Wrapper>
      {loader && <Saving>Saving content and tags</Saving>}
      {success && (
        <Saving>
          <div>Saved 👍</div>
          <View href="https://www.tagit.io/" target="_blank">
            View on tagit.io
          </View>
        </Saving>
      )}
      {start && (
        <div style={{ position: "relative", zIndex: "1" }}>
          <img src={Logo} />
          <div style={{ marginTop: "10px", color: "#fff" }}>
            Write your tags and then press tab.
          </div>
          <Tag
            settings={settings}
            value={localState.value}
            showDropdown={localState.showDropdown}
          />
          <Button onClick={save}>SAVE</Button>
        </div>
      )}
      <EditBlobTop />
      <EditBlobBottom />
    </Wrapper>
  );
};

export default App;
