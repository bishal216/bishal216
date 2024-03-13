import "./ScaleNode.css";

const ScaleNode = () => {
  return (
    <section className="scale-node">
      <div className="wrapper-position-node">
        <img className="position-node-icon" alt="" src="/vector-62.svg" />
      </div>
      <div className="reflect-node">
        <div className="distort-node">
          <h2 className="game-art-and">Game Art and Design</h2>
          <div className="we-craft-visually">
            We craft visually stunning game art, including character design,
            environment creation, and UI/UX design, to bring your game's world
            to life with captivating visuals.
          </div>
        </div>
      </div>
      <img
        className="subtract-icon"
        loading="lazy"
        alt=""
        src="/subtract.svg"
      />
      <div className="output-aggregator">
        <div className="processing-unit">
          <h2 className="story-and-content">Story and Content Creation</h2>
          <div className="we-develop-compelling">
            We develop compelling narratives, quests, and dialogues that
            captivate players, driving engagement and retention through rich
            storytelling.
          </div>
        </div>
        <input className="rectangle-input" type="checkbox" />
        <div className="branch-splitter">
          <h1 className="here-are-the-container">
            <span>{`Here are the `}</span>
            <span className="sw2">Sw</span>
            <span>chemes.</span>
          </h1>
          <div className="services-designed-with">
            Services designed with speed and efficiency in mind.
          </div>
        </div>
        <img className="output-aggregator-child" alt="" src="/ellipse-1.svg" />
        <div className="processing-unit1">
          <h2 className="game-development">Game Development</h2>
          <div className="we-provide-end-to-end">
            We provide end-to-end game development services, from coding and
            programming to integrating physics and AI, ensuring a seamless,
            engaging gameplay experience.
          </div>
        </div>
      </div>
      <img className="union-icon" alt="" src="/union.svg" />
      <div className="function-node">
        <h2 className="sound-design-and">Sound Design and Music</h2>
        <div className="we-create-immersive">
          We create immersive audio experiences with custom sound effects and
          original music compositions, enhancing the emotional impact and
          immersion of your game.
        </div>
      </div>
    </section>
  );
};

export default ScaleNode;
