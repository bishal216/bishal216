import Subtree from "../components/Subtree";
import NestedClusters from "../components/NestedClusters";
import TreeExpansion from "../components/TreeExpansion";
import BranchNode from "../components/BranchNode";
import ImageProper from "../components/ImageProper";
import FrameProper from "../components/FrameProper";
import ScaleNode from "../components/ScaleNode";
import DataTransformer from "../components/DataTransformer";
import VectorNode from "../components/VectorNode";
import MapNode from "../components/MapNode";
import "./SwiftLP.css";

const SwiftLP = () => {
  return (
    <div className="swift-lp">
      <Subtree />
      <NestedClusters />
      <TreeExpansion />
      <section className="vector-node">
        <div className="star-node">
          <h1 className="the-swift-swystem-container">
            <span>{`The Swift `}</span>
            <span className="sw">Sw</span>
            <span>ystem</span>
          </h1>
          <div className="polygon-node">
            <div className="game-development-is">
              Game development is notorious for its complexity, time-consuming
              processes, and unpredictable delays.
            </div>
          </div>
        </div>
        <img
          className="line-3-stroke"
          loading="lazy"
          alt=""
          src="/line-3-stroke.svg"
        />
      </section>
      <BranchNode
        ideate="Ideate"
        envisionTheSkiesEveryGrea="Envision the skies. Every great flight begins here."
      />
      <BranchNode
        ideate="Conceptualize"
        envisionTheSkiesEveryGrea="Draft the blueprints for takeoff. Your game's first flap towards the horizon."
      />
      <BranchNode
        ideate="Strategize"
        envisionTheSkiesEveryGrea="Chart the course. Together, we envision the most efficient route through skies."
      />
      <BranchNode
        ideate="Develop"
        envisionTheSkiesEveryGrea="Gear up; gather speed. We transform the concepts to dynamic ascents."
      />
      <ImageProper />
      <FrameProper />
      <ScaleNode />
      <DataTransformer />
      <VectorNode />
      <MapNode />
      <div className="navbar">
        <div className="navitems-parent">
          <div className="navitems">
            <div className="click-link">Problems</div>
          </div>
          <div className="navitems1">
            <div className="click-link1">Solution</div>
          </div>
          <div className="navitems2">
            <div className="click-link2">Services</div>
          </div>
          <div className="navitems3">
            <div className="click-link3">FAQ</div>
          </div>
        </div>
        <div className="button">
          <div className="button1">book a call</div>
        </div>
      </div>
    </div>
  );
};

export default SwiftLP;
