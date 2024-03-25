import { useState, useEffect } from "react";
import "./App.css";
import APISelector from "./components/APISelector.jsx";

const ACCESS_KEY = import.meta.env.VITE_APP_ACCESS_KEY;

function App() {
  const [currentImage, setCurrentImage] = useState(null);
  const [attributeList, setAttributeList] = useState({
    name: null,
    weight: null,
    origin: null,
    temperament: null,
    life_span: null,
  });
  const [banList, setBanList] = useState([]);
  const [totalList, setTotalList] = useState({
    name: [],
    weight: [],
    origin: [],
    temperament: [],
    life_span: [],
  });

  useEffect(() => {
    fetchBreeds();
  }, []);

  const fetchBreeds = async () => {
    try {
      const response = await fetch("https://api.thecatapi.com/v1/breeds");
      const data = await response.json();
      setTotalList(makeTotalAttributeList(data));
    } catch {
      alert("Error fetching attributes");
    }
  };

  const makeTotalAttributeList = (data) => {
    const attributes = {
      name: [],
      weight: [],
      origin: [],
      temperament: [],
      life_span: [],
    };
    data.forEach((breed) => {
      const { name, weight, origin, temperament, life_span } = breed;
      if (!attributes.name.includes(name)) {
        attributes.name.push(name);
      }
      if (
        !attributes.weight.includes(
          weight.imperial ? weight.imperial : weight.metric
        )
      ) {
        attributes.weight.push(
          weight.imperial ? weight.imperial : weight.metric
        );
      }
      if (!attributes.origin.includes(origin)) {
        attributes.origin.push(origin);
      }
      if (!attributes.temperament.includes(temperament)) {
        attributes.temperament.push(temperament);
      }
      if (!attributes.life_span.includes(life_span)) {
        attributes.life_span.push(life_span);
      }
    });
    return attributes;
  };

  const handleAttribute = (breed) => {
    setAttributeList({
      name: breed.name,
      weight: breed.weight.imperial,
      origin: breed.origin,
      temperament: breed.temperament,
      life_span: breed.life_span,
    });
  };

  const makeAPICall = async () => {
    const bannedAttributes = banList
      .map((attribute) => attribute.name)
      .join(",");
    let query = `https://api.thecatapi.com/v1/images/search?&limit=1&exclude=${bannedAttributes}&api_key=${ACCESS_KEY}`;
    const response = await fetch(query);
    const data = await response.json();
    if (!data[0].url) {
      alert("Image URL not found in API response.");
    }
    if (data[0].breeds.length === 0) {
      makeAPICall();
    } else {
      handleAttribute(data[0].breeds[0]);
      setCurrentImage(data[0].url);
      console.log(data[0]);
    }
  };

  const addAttributetoBan = (attribute, type) => {
    if (banList.some((attr) => attr === attribute)) {
      return;
    }
    if (type === "life_span" || type === "weight") {
      if (banList.some((attr) => attr.startsWith(`${type}`))) {
        return;
      }
      setBanList((prevBanList) => [...prevBanList, `${type}: ${attribute}`]);
    } else {
      setBanList([...banList, attribute]);
    }
    const updatedTotalList = { ...totalList };
    updatedTotalList[type] = updatedTotalList[type].filter(
      (attr) => attr !== attribute
    );
    setTotalList(updatedTotalList);
  };

  return (
    <div className="container">
      <APISelector
        image={currentImage}
        attributes={attributeList}
        onSubmit={makeAPICall}
        onClick={addAttributetoBan}
      />
      <div className="ban-container">
        <h2>Banned Attributes</h2>
        {banList.map((ban, index) => (
          <p key={index}>{ban}</p>
        ))}
      </div>
    </div>
  );
}

export default App;