import React from "react";


const APISelector = ({ image, attributes, onSubmit, onClick }) => {
  return (
    <div className="API-container">
      <h2>Cat Discovery</h2>
      <p>Discover the different cats in the world!</p>
      {attributes.name && (
        <div className="button-container">
          <button onClick={() => onClick(attributes.name, "name")}>
            {attributes.name}
          </button>
          <button onClick={() => onClick(attributes.weight, "weight")}>
            Weight: {attributes.weight}
          </button>
          <button onClick={() => onClick(attributes.origin, "origin")}>
            {attributes.origin}
          </button>
          <button
            onClick={() => onClick(attributes.temperament, "temperament")}
          >
            {attributes.temperament}
          </button>
          <button onClick={() => onClick(attributes.life_span, "life_span")}>
            Lifespan: {attributes.life_span}
          </button>
        </div>
      )}
      {image && <img src={image} />}
      <button id="discover-button" onClick={onSubmit}>
        Discover
      </button>
    </div>
  );
};

export default APISelector;