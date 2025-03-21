import "./VectorNode.css";

const VectorNode = () => {
  return (
    <section className="vector-node1">
      <div className="quadtree-node">
        <div className="octree-node">
          <img
            className="octree-node-child"
            loading="lazy"
            alt=""
            src="/group-44.svg"
          />
          <div className="wrapper-group-42">
            <img className="wrapper-group-42-child" alt="" />
          </div>
        </div>
        <h1 className="get-your-game-container">
          <span>{`Get Your `}</span>
          <span className="game">Game</span>
          <span> Flying</span>
        </h1>
        <div className="lets-get-your-container">
          <p className="lets-get-your">
            Let's get your game out of the hangar and into the skies.
          </p>
          <p className="click-below-to">
            Click below to schedule a discovery call with Swift, and let's turn
            your game concept into your next big win sooner than you think.
          </p>
        </div>
        <div className="queue-node">
          <button className="button8">
            <div className="button9">Schedule a Call</div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default VectorNode;
